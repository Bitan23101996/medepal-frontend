import { Component, OnInit, ViewChildren } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DoctorService } from '../../doctor/doctor.service';
import { ServiceProviderService } from '../service-provider.service';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { IndividualService } from '../../individual/individual.service';
import { environment } from '../../../../environments/environment';
import { GetSet } from 'src/app/core/utils/getSet';
import { SBISConstants } from 'src/app/SBISConstants';
import { ThrowStmt } from '@angular/compiler';
import * as moment from 'moment';


@Component({
  selector: 'app-inpatient-summary',
  templateUrl: './inpatient-summary.component.html',
  styleUrls: ['./inpatient-summary.component.css']
})
export class InpatientSummaryComponent implements OnInit {

  panelVisible = false;
  title: any;
  dtFormat: any;
  inpatientList: any=[];
  resdata: any = [];
  admissionRefNo: string;
  currentPatientDetails: any;
  isPaginator = false;
  isDisableBtn: boolean = true;
  isShowChember: boolean;
  doctorRefNo: string;
  chemberList: any = [];
  groupMemberList: any = [];
  query: any;
  allAdmittedPatientList: any = [];
  currentUser: any;
  selectedHospitalCount = 0;
  hideForIndividual: boolean = true;
  filterPatientName: any;
  filterDoctorName: string;
  form: NgForm;
  selectedValues: string[] = [];

  dateFormat: any;
  fromDate: Date = new Date();
  fromDateNo: any;
  toDateNo: any
  admissionToDate: any;
  toDate: Date = new Date();
  date: Date = new Date();
  frmDate: any;
  admissionDate: any;
  buttonClassCurrent: any;
  buttonClassAnother: any;
  admistDateString: any;
  minDate: Date;
  isEdit = false;
  isHideGroupTable: boolean = false;
  isHidePrimaryTable: boolean = true;
  isHideMyselfbtn: boolean = false;
  isHideGroupbtn: boolean = true;
  showProcedureNote: boolean = true;
  showPatientFilter: boolean = true;
  inpatientSummeryFilter = {
    filterPatientName: '',
    filterDoctorName: '',
    filterToDate: new Date(),
    filterFromDate: null,
  }
  initialInpatientList: any = [];
  isDateSelected: boolean = false;
noCardMsg: boolean = false;

  @ViewChildren("checkboxes") checkboxes;
  chkDischargedPatient: boolean = false; //Issues app#1497
  showDoctorFilter: boolean = true; //Issues app#1497




  // Working on app/issues/1548
  inPatientPaymentDetailsFrom: FormGroup;
  paymentModeCategories: Object[] = [];
  displayReceviePaymentSidebar: boolean = false;
  paymentSubmitted: boolean = false;
  displayInvoiceSidebar: boolean = false;
  inPatientTransactionDetails: any = { previousBills: [], bedHistoryDetail: [], paymentList: [] };
  outstandingAmount: number = 0
  totalDue: number = 0
  totalPayDone: number = 0
  showAdvancePaymentBlock: boolean = false;
  invoiceDetails: any = null;
  currentAdmission: any = { admissionStatus: 'ADMITTED' }
  // End Working on app/issues/1548

  // Working on app/issue/1844
  displayAdmissionDetailsSideBar:boolean=false;
  // End Working on app/issue/1844
  // Working on app/issue/2009
  isPatientAdmitted:boolean=true;
  inpatientSummeryFilterForm:FormGroup;
  viewDate=new Date();
  // End Working on app/issue/2009 

  // Working on app/issue/2294
  totalBedCharge:number=0;
  totalRefund:number=0;
  totalBillAmount:number=0;
  // End Working on app/issue/2294

  displayBillDetailsSidebar=false;// Working on app/issue/1934
  billDetailList:any=[];// Working on app/issue/1934
  currentBillDetails:any={intBillNo:null,totalAmount:null,billingStatus:null};// Working on app/issue/1934
  radioLabelValues: any[] = [
    { key: SBISConstants.INPATIENT_SUMMARY.VISIT_NOTE, isChecked: true },
    { key: SBISConstants.INPATIENT_SUMMARY.PROCEDURE_NOTE, isChecked: false }
  ];
  admitedPatientDetails: any = { 'patientName': "", "bedNo": "", "roomNo": "", "gender": "", "age": "" };// Working on app/issues/1642

  changeDoctorForm: FormGroup;
  changeBedForm: FormGroup;
  refundDetailsSection:boolean=false; // Working on app/issue/2243
  loading:boolean=false; // Working on app/issue/2243
  loadingForModal:boolean=false;

  constructor(
    private broadcastService: BroadcastService, private fb: FormBuilder, private sanitizer: DomSanitizer,
    private translate: TranslateService, private router: Router,
    private doctorService: DoctorService, private serviceProviderService: ServiceProviderService,
    private authService: AuthService,
    private _doctorService: DoctorService,
    private _toastService: ToastService,
    private individualService: IndividualService
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
    this.minDate = new Date();
    let d = new Date();
    d.setMonth(d.getMonth() - 3);
    this.inpatientSummeryFilter.filterFromDate = d;
  }

  ngOnInit() {
    this.loading= true;
    document.body.classList.add('hide-bodyscroll');
    this.broadcastService.setHeaderText("");
    this.dateFormat = environment.DATE_FORMAT;
    this.title = "IN-PATIENT LIST";
    this.dtFormat = environment.DATE_FORMAT;
    this.currentUser = JSON.parse(localStorage.getItem('user'))
    this.createInpatientSummeryFilterForm();
    if (this.currentUser.roleName == "ADMIN" || this.currentUser.roleName == "OPERATOR") {
      this.getInpatientList();
      this.isHideGroupbtn = false;
      this.isHideMyselfbtn = false;
      this.showDoctorFilter = true;
     
    }

    else if (this.currentUser.roleName == "DOCTOR" || this.currentUser.roleName == "ASSISTANT") {
      this.title = "IN-PATIENTS ADMITTED UNDER YOU";
      this.getInpatientList();
      this.isDisableBtn = false;
      this.isShowChember = true;
      this.hideForIndividual = true;
      this.isHideGroupbtn = false;
      this.isHideMyselfbtn = false;
      this.showDoctorFilter = false;
      this.getHospitalListByDoctorRefNo();
    }
    else if (this.currentUser.roleName == "INDIVIDUAL" || this.currentUser.roleName == "ASSISTANT") {
      this.getInpatientList();
      this.hideForIndividual = false;
      this.isShowChember = true;
      this.isDisableBtn = false;
      this.showProcedureNote = false;
      this.showPatientFilter = false;

    }
    // Working on app/issues/1548
    this.getPaymentModeCategory();
   
    // End Working on app/issues/1548
    //this.fromDate = ('0' + this.date.getDate()).slice(-2) + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + this.date.getFullYear();
    //this.toDate = ('0' + this.date.getDate()).slice(-2) + '-' + ('0' + (this.date.getMonth() + 1)).slice(-2) + '-' + this.date.getFullYear();
    if (this.currentUser.roleName == "INDIVIDUAL" ){
      this.title="MY HOSPITALIZATION";
    }
    this.displayAdmissionDetailsSideBar = false;

    this.createChangeDoctorForm();
    this.createChangeBedForm();
  }

  getInpatientList() {
    let fromDate = this.inpatientSummeryFilterForm.value.fromDate.getFullYear() + '-' + ('0' + (this.inpatientSummeryFilterForm.value.fromDate.getMonth() + 1)).slice(-2) + '-' + ('0' + this.inpatientSummeryFilterForm.value.fromDate.getDate()).slice(-2); 
    let toDate = this.inpatientSummeryFilterForm.value.toDate.getFullYear() + '-' + ('0' + (this.inpatientSummeryFilterForm.value.toDate.getMonth() + 1)).slice(-2) + '-' + ('0' + this.inpatientSummeryFilterForm.value.toDate.getDate()).slice(-2); 
    let payload = {      
      patientName:this.inpatientSummeryFilterForm.value.patientName,
      doctorName:this.inpatientSummeryFilterForm.value.doctorName,
      dischargedStatus:this.inpatientSummeryFilterForm.value.patientStatus=="admitted"?"N":"Y",
      fromDate:fromDate,
      toDate:toDate,
      hospitalList:this.inpatientSummeryFilterForm.value.hospitalList.join().toString()
    };console.log("payload ::::",payload);
    this.serviceProviderService.fetchInpatientList(payload).subscribe(res => {
      console.log("getInpatientList ::::",res);
      if (res.status === 2000) {
        this.doctorRefNo = res.doctorRefNo;
        res.data.forEach(element => {
          element.doctorHistoryList.forEach(ele => {
            element.doctorNameArrStr != '' ? (element.doctorNameArrStr = element.doctorNameArrStr + ele.doctorName) : (element.doctorNameArrStr = ele.doctorName);
          });
        });
        this.inpatientList = res.data;
        this.initialInpatientList = res.data;
        this.allAdmittedPatientList = res.data;
        this.resdata = res.data;
        this.chemberList = Array.from(new Set(this.resdata.map(s => s.hospitalRefNo))).map(hospitalRefNo => {
          return {
            hospitalRefNo: hospitalRefNo,
            hospitalName: this.resdata.find(hospital => hospital.hospitalRefNo == hospitalRefNo).hospitalName
          }
        });
        if (this.resdata.length > 5) {
          this.isPaginator = true;
        } else {
          this.isPaginator = false;
        }
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      }
    });

  }

  filteredList: any = [];
  onValueChange(label: any, dt: Date): void {
    if (label == 'fromDate') {
      this.fromDate = new Date(dt);
    }
    if (label == 'toDate') {
      this.toDate = new Date(dt);
    }
    this.filteredList = [];
    for (let admission of this.inpatientList) {
      var admistDate = new Date(admission.admissionDateStr);
      var admisnDateString = admistDate.toISOString().split("T")[0].split("-").join("");
      var admisnDateNo = Number(admisnDateString);
    }
    if (this.fromDate == this.toDate) {
      this.buttonClassCurrent = 'btn btn-dark';
      this.buttonClassAnother = 'btn btn-light';
    }
    else {
      this.buttonClassCurrent = 'btn btn-light';
      this.buttonClassAnother = 'btn btn-dark';
    }
    this.isDateSelected = true;
    // this.filterTable();
  }






  filterData(event, q) {

    if (event.target.checked) {
      this.selectedHospitalCount++;
      if (this.selectedHospitalCount == 1) {
        this.inpatientList = [];
      }
      let filteredList = this.allAdmittedPatientList.filter(patient => patient.hospitalRefNo == q.hospitalRefNo);
      for (let patientObj of filteredList) {
        this.inpatientList.push(patientObj);
      }
    }
    else {
      this.selectedHospitalCount--;
      if (this.selectedHospitalCount == 0)
        this.inpatientList = this.allAdmittedPatientList;
      else
        this.inpatientList = this.inpatientList.filter(chamber => chamber.hospitalRefNo != q.hospitalRefNo)
    }
  }


  refineChember() {

  }


  groupMemberButton() {

    this.isHideGroupbtn = false;
    this.isHideMyselfbtn = true;
    this.isHidePrimaryTable = false;
    this.isHideGroupTable = true;
    this.showPatientFilter = true;
    this.serviceProviderService.fetchGroupList().subscribe(res => {
      if (res.status === 2000) {
        this.title = "GROUP DETAILS"
        this.groupMemberList = res.data;
      }
    });
  }

  myselfButton() {
    this.title = "MY HOSPITALIZATION";
    this.isHidePrimaryTable = true;
    this.isHideGroupTable = false;
    this.isHideGroupbtn = true;
    this.isHideMyselfbtn = false;
    this.showPatientFilter = false;
  }



  onClickSubmit(data) {
    let fromDate = data.fromDate.toISOString().split("T")[0].split("-").join("");
    let toDate = data.toDate.toISOString().split("T")[0].split("-").join("");
    let filteredList: any;
    for (let admission of this.inpatientList) {
      let admistDate = new Date(admission.admissionDateStr);
      let admisnDateString = admistDate.toISOString().split("T")[0].split("-").join("");
      let admisnDateNo = Number(admisnDateString);
      if (fromDate >= admisnDateNo && admisnDateNo <= toDate) {
        filteredList = this.inpatientList.filter(data => data.fromDateNo && data.toDateNo)
      }
      this.inpatientList.push(filteredList)
    }
  }


  showDischargedPatient(event) { //Issues app#1497
    this.chkDischargedPatient = true;

    if (event.target.checked) {
      let payload = {
        dischargedStatus: "Y"
      }
      this.serviceProviderService.fetchInpatientList(payload).subscribe(res => {
        if (res.status === 2000) {
          this.doctorRefNo = res.doctorRefNo;
          this.inpatientList = res.data;
          this.initialInpatientList = res.data;
          res.data.forEach(element => {
            element.doctorHistoryList.forEach(ele => {
              element.doctorNameArrStr != '' ? (element.doctorNameArrStr = element.doctorNameArrStr + ele.doctorName) : (element.doctorNameArrStr = ele.doctorName);
            });
          });
          this.allAdmittedPatientList = res.data;
          this.resdata = res.data;
          this.chemberList = Array.from(new Set(this.resdata.map(s => s.hospitalRefNo))).map(hospitalRefNo => {
            return {
              hospitalRefNo: hospitalRefNo,
              hospitalName: this.resdata.find(hospital => hospital.hospitalRefNo == hospitalRefNo).hospitalName
            }
          });
          if (this.resdata.length > 5) {
            this.isPaginator = true;
          } else {
            this.isPaginator = false;
          }
        }
      });

    }
    else {
      let payload = {
        dischargedStatus: "N"
      }
      this.serviceProviderService.fetchInpatientList(payload).subscribe(res => {
        if (res.status === 2000) {
          this.doctorRefNo = res.doctorRefNo;
          this.inpatientList = res.data;
          this.allAdmittedPatientList = res.data;
          this.resdata = res.data;
          this.chemberList = Array.from(new Set(this.resdata.map(s => s.hospitalRefNo))).map(hospitalRefNo => {
            return {
              hospitalRefNo: hospitalRefNo,
              hospitalName: this.resdata.find(hospital => hospital.hospitalRefNo == hospitalRefNo).hospitalName
            }
          });
          if (this.resdata.length > 5) {
            this.isPaginator = true;
          } else {
            this.isPaginator = false;
          }
        }
      });

    }
  }

  filterTable() {
    let patientFilterResp;
    let doctorFilterResp;
    let date;
    if (this.inpatientSummeryFilter.filterPatientName != '' || this.inpatientSummeryFilter.filterPatientName != null) {
    //  patientFilterResp = this.initialInpatientList.filter(data => data.patientName.toLowerCase().startsWith(this.inpatientSummeryFilter.filterPatientName.toLowerCase()));
    patientFilterResp = this.initialInpatientList.filter(data => data.patientName.toLowerCase().includes(this.inpatientSummeryFilter.filterPatientName.toLowerCase())); //app#1692
  } else {
      patientFilterResp = this.initialInpatientList;
    }

    if (this.inpatientSummeryFilter.filterDoctorName != '' || this.inpatientSummeryFilter.filterDoctorName != null) {
    //  doctorFilterResp = patientFilterResp.filter(data => data.doctorNameArrStr.includes(this.inpatientSummeryFilter.filterDoctorName.toLowerCase())); //data.doctorHistoryList.doctorName.toLowerCase().startsWith(this.inpatientSummeryFilter.filterDoctorName.toLowerCase())
      doctorFilterResp = patientFilterResp.filter(data => data.doctorNameArrStr.toLowerCase().includes(this.inpatientSummeryFilter.filterDoctorName.toLowerCase())); //app#1692
  } else {
      doctorFilterResp = patientFilterResp;
    }

    if (this.isDateSelected) {
      let frmDate = new Date(this.fromDate);
      let tDate = new Date(this.toDate);
      date = doctorFilterResp.filter(data => Number(new Date(data.admissionDateStr)) >= Number(frmDate) && Number(new Date(data.admissionDateStr)) <= Number(tDate));
    } else {
      date = doctorFilterResp;
    }

    this.inpatientList = date;
  }

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

  resetAll(filterForm: NgForm) {
    this.createInpatientSummeryFilterForm();
    this.getInpatientList();
  }

  editPatientDetails() {
    // this.admissionRefNo = currentPatientDetails.admissionRefNo;
    this.router.navigate(['opd/inpatient-admission', { refNo: this.admissionRefNo }])

  }


  //Working on app/issues/1499
  navigateToBillRaise(admissionObj) {
    this.router.navigate(['opd/patient-bill-raise', admissionObj.admissionRefNo]);

  }
  // End Working on app/issues/1499

  //=============== procedure sidebar =======================//
  //procedure note add
  displayProcedureSidebar: boolean = false;
  selectedAdmissionRefNo: string = "";
  procedureNotes: any[] = [];
  selectedProcedureNote: any = {};
  startProcedureNote(inPatientDetails) {
    let patient = {
      "name": inPatientDetails.patientName,
      "age": inPatientDetails.age,
      "gender": inPatientDetails.patientGender,
      "ref_no": inPatientDetails.patientRefNo
    }
    this.selectedAdmissionRefNo = inPatientDetails.admissionRefNo;
    GetSet.setPatientDetails(JSON.stringify(patient));
    this.getAllProcedureByAdmissionRefNumber(inPatientDetails.admissionRefNo);
    this.displayProcedureSidebar = true;
  }//end of method

  //method to close sidebar for procedure
  closeProcedureSidebar() {
    this.procedureNotes = [];
    this.selectedProcedureNote = {};
    this.displayProcedureSidebar = false;
  }//end of method

  //method to get all procedure data by admission ref number
  getAllProcedureByAdmissionRefNumber(admissionRefNumber: string) {
    this.noCardMsg = false;
    let requestBody: any = { "admissionRefNo": admissionRefNumber };
    this.serviceProviderService.getAllUsersProcedureInfoByAdmissionRefNo(requestBody).subscribe(res => {
      this.procedureNotes = [];
      if (res.status == 2000) {
        // this.procedureNotes = res.data;
        if(res.data.length != 0){
          this.noCardMsg = false;
          res.data.forEach((element, index) => {
            element.procedureUploadDtoList.forEach((el, ind) => {
              let query = {
                'downloadFor': SBISConstants.IMAGE_UPLOAD_CONST.PROCEDURE_IMAGE,
                'procedureImageRefNo': el.procedureUploadRefNo
              }
              this.doctorService.downloadDocument(query).subscribe((result) => {
                if (result.status == 2000) {
                  let fileContentTypeStr = result.data.fileName.split('.');
                  el['contentType'] = fileContentTypeStr[fileContentTypeStr.length -1];
                  let imgSrc = (el['contentType'] =='pdf')? "data:application/pdf;base64,": "data:image/jpeg;base64," + result.data.data;
                  el['actualSrc'] = result.data.data;
                  el['imgSrc'] = imgSrc;
                }
              });
            });
            if ((index + 1) == res.data.length)
              this.procedureNotes = res.data;
          });
        }else{
          this.noCardMsg = true;
        }


      }
    });
  }//end of method

  //method to fire a trigger when the procedure has been saved from sidebar
  procedureSavedFromSidebar(event) {
    this.getAllProcedureByAdmissionRefNumber(this.selectedAdmissionRefNo);
  }//end of method

  //method to open image in new tab
  openImageInNewTab(imgSrc) {
    var image = new Image();
    image.src = imgSrc;
    var w = window.open("");
    w.document.write(image.outerHTML);
  }//end of method

  //method to edit procedure
  editProcedure(selectedProcedure) {
    this.selectedProcedureNote = selectedProcedure;
  }//end of method

  //Call this method in the image source, it will sanitize it.
  transform(imgSrc) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imgSrc);
  }

  //Working on app/issues/1496
  navigateToGenrateInvoice(admissionObj) {
    this.router.navigate(['opd/generate-invoice', admissionObj.admissionRefNo]);
  }
  // End Working on app/issues/1496


  // Working on app/issues/1548
  createSaveReceipePayment() {

    this.inPatientPaymentDetailsFrom = this.fb.group({
      txnTypeRefNo: [this.admissionRefNo, Validators.required],
      paymentDescription: ["Advance Payment"],
      amount: [null, Validators.required],
      paymentMode: ["Cash", Validators.required],
      cardNo: [null],
      txnType: ["ADMISSION"],
      paymentType:["ADVANCE"]
    })
    // Working on app/issue/2243
    if(this.currentAdmission.admissionStatus=="DISCHARGED"){
      this.inPatientPaymentDetailsFrom.patchValue({
        paymentDescription:null,
        paymentType:"ADDITIONAL"
      });
    }
    if(this.refundDetailsSection){
      this.inPatientPaymentDetailsFrom.patchValue({
        paymentDescription:null,
        paymentType:"REFUND"
      });
    }
    // End Working on app/issue/2243
  }


  getPaymentModeCategory() {
    this.doctorService.GetPaymentModeCategory()
      .subscribe(res => {
        this.paymentModeCategories = res.masterDataAttributeValues
      });
  }



  openRecivePaymentBillDetails(currentPatientDetails) {
    this.paymentSubmitted = false;  //app#1664
    this.createSaveReceipePayment(); //app#1664
    this.admissionRefNo = currentPatientDetails.admissionRefNo;
    this.inPatientPaymentDetailsFrom.patchValue({
      txnTypeRefNo: this.admissionRefNo
    });
    this.getInPatientPaymentHistoryByAdmission();
    this.getAdmissionBasicInfo()

    this.displayReceviePaymentSidebar = true;
   

  }
  closeRecivePaymentBillDetails() {
    
    this.inPatientPaymentDetailsFrom.patchValue({
      txnTypeRefNo: null
    });
    this.displayReceviePaymentSidebar = false;
    
  }


  saveReceivePaymentBillDetails() {
    this.loadingForModal = true;
    document.body.classList.add('hide-bodyscroll');
    this.paymentSubmitted = true;
    if (!this.inPatientPaymentDetailsFrom.valid)
      return false;   
      // Working on app/issue/2243
      if(this.currentAdmission.admissionStatus=="DISCHARGED"){
        this.inPatientPaymentDetailsFrom.patchValue({         
          paymentType:"ADDITIONAL"
        });
      }
      if(this.refundDetailsSection){
        this.inPatientPaymentDetailsFrom.patchValue({         
          paymentType:"REFUND"
        });
      }
     // End Working on app/issue/2243
    this.serviceProviderService.saveInPatientPayment(this.inPatientPaymentDetailsFrom.value).subscribe(res => {
      if(res) {
        this.loadingForModal = false;
        document.body.classList.remove('hide-bodyscroll');
      }
      if (res.status == 2000) {
        this._toastService.showI18nToastFadeOut("Payment saved", "success");
        this.generatePaymentReport(res.data.txnTypeRefNo)
        if (this.displayReceviePaymentSidebar)
        this.displayReceviePaymentSidebar = false;
        this.createSaveReceipePayment();
        this.paymentSubmitted = false;
        this.getInPatientPaymentHistoryByAdmission();// Working on app/issue/2243
      }

      else
        if (res.status == 500) {
          this._toastService.showI18nToast("Payment saved Failed", 'error');
          this.createSaveReceipePayment();
        }

    }, (error) => {
      this._toastService.showI18nToast("Payment saved Failed", 'error');
    });

  }




  openInvoiceSideBar(currentPatientDetails) {
    this.admissionRefNo = currentPatientDetails.admissionRefNo;
    this.createSaveReceipePayment();

    this.getAdmissionBasicInfo();
    this.inPatientPaymentDetailsFrom.patchValue({
      txnTypeRefNo: this.admissionRefNo
    });
    let requestQuery = {
      admissionRefNo: this.admissionRefNo
    }
    this.currentAdmission.admissionStatus = currentPatientDetails.admissionStatus;
    if(currentPatientDetails.admissionStatus=="ADMITTED"){
        this.displayInvoiceSidebar = true;
        this.getInpatientBillList();
        this.getBedChargeDetailByAdmission();
        this.getInPatientPaymentHistoryByAdmission();
    }
    else{
      this.serviceProviderService.getInvoiceByAdmissionRefNo(requestQuery).subscribe(res => {
        this.displayInvoiceSidebar = true;
        this.invoiceDetails = res.data;console.clear();console.log("invoiceDetails::",this.invoiceDetails);
        
          this.inPatientTransactionDetails.previousBills=res.data.invoiceDetailList;
          this.inPatientTransactionDetails.bedHistoryDetail = res.data.bedHistoryDetail;
          this.inPatientTransactionDetails.paymentList = res.data.paymentList;
          this.calculateOutstandingAmount();
       
      }, (error) => {
      });
    }
   /*  this.serviceProviderService.getInvoiceByAdmissionRefNo(requestQuery).subscribe(res => {
      this.displayInvoiceSidebar = true;
      this.invoiceDetails = res.data;console.clear();console.log("invoiceDetails::",this.invoiceDetails);
      if (res.data.invoiceNo == null) {
        this.getInpatientBillList();
        this.getBedChargeDetailByAdmission();
        this.getInPatientPaymentHistoryByAdmission();

      } else {
        console.log();
        
        // this.getInpatientBillList();
        this.inPatientTransactionDetails.previousBills=res.data.invoiceDetailList;
        this.inPatientTransactionDetails.bedHistoryDetail = res.data.bedHistoryDetail;
        this.inPatientTransactionDetails.paymentList = res.data.paymentList;
        this.calculateOutstandingAmount();
      }
    }, (error) => {
    }); */

  }
  closeInvoiceSideBar() {
    this.displayInvoiceSidebar = false;
    this.showAdvancePaymentBlock = false;

  }


  getInpatientBillList() {
    let requestQuery = {
      admissionRefNo: this.admissionRefNo,
      isBillDetailsRequired: true,
    }
    this.serviceProviderService.getInpatientBillList(requestQuery).subscribe((res) => {
      this.inPatientTransactionDetails.previousBills = res.data;
      this.calculateOutstandingAmount()

    }, (error) => {
    });
  }

  getBedChargeDetailByAdmission() {
    let requestQuery = {
      admissionRefNo: this.admissionRefNo
    }
    this.serviceProviderService.getBedChargeDetailByAdmission(requestQuery).subscribe((res) => {
      this.inPatientTransactionDetails.bedHistoryDetail = res.data;
      for(let bedHistory of this.inPatientTransactionDetails.bedHistoryDetail){
        bedHistory['bedInfo']= bedHistory.roomCategory+"/"+bedHistory.roomNo+"/"+bedHistory.bedNo
      }
      this.calculateOutstandingAmount()

    }, (error) => {
      ;
    });
  }

  getInPatientPaymentHistoryByAdmission() {
    let requestQuery = {
      admissionRefNo: this.admissionRefNo
    }
    this.serviceProviderService.getInPatientPaymentHistory(requestQuery).subscribe((res) => {
      this.inPatientTransactionDetails.paymentList = res.data;
      this.calculateOutstandingAmount();
    }, (error) => {
      ;
    });
  }
  totalPaymentAmount:number=0;
  calculateOutstandingAmount() {
    let totalBedCharge: number = 0;
    let totalBillCharge: number = 0;
    let totalPayment: number = 0;
    this.totalBillAmount=0;
    this.totalBedCharge=0;
    this.totalRefund=0;
    this.totalPaymentAmount=0;
    for (let bed of this.inPatientTransactionDetails.bedHistoryDetail) {
      totalBedCharge = totalBedCharge + (bed.noOfDays * bed.bedChargeStandard);      
    }
    this.totalBedCharge=totalBedCharge;// Working on app/issue/2294

    for (let bill of this.inPatientTransactionDetails.previousBills) {
      let charge:any;
      if(bill.amount!==undefined){
        charge = bill.amount
      }
      else if(bill.totalAmount!==undefined){
        charge = bill.totalAmount
      }
      let detailCharge=parseInt(charge);
        if(isNaN(detailCharge)) detailCharge=0;
      totalBillCharge = totalBillCharge + detailCharge;
      console.log(charge);
      
      this.totalBillAmount=this.totalBillAmount+detailCharge;// Working on app/issue/2294
    }

    for (let payment of this.inPatientTransactionDetails.paymentList) {
      if(payment.paymentType=="REFUND"){// Working on app/issue/2294
        totalPayment = totalPayment - payment.amount;
        this.totalRefund=this.totalRefund+payment.amount;
       }else{
        totalPayment = totalPayment + payment.amount;
        this.totalPaymentAmount=this.totalPaymentAmount+payment.amount;
       }
      // totalPayment = totalPayment + payment.amount;
    }

    this.outstandingAmount = totalBedCharge + totalBillCharge - totalPayment;
    // if(this.invoiceDetails != null){ // app#2252
      this.totalDue = (totalBedCharge + totalBillCharge) + (this.invoiceDetails?this.invoiceDetails.discountAmount:0);
    // }
    this.totalPayDone = totalPayment;
    if (this.invoiceDetails != null) {
      this.outstandingAmount = this.outstandingAmount + this.invoiceDetails.discountAmount;
    }
    
  }

  redirectToInvoice() {
    this.router.navigate(['opd/generate-invoice', this.admissionRefNo]);
  }

  showAdvancePaymentPart() {
    if(this.currentAdmission.admissionStatus=="DISCHARGED"){
      this.inPatientPaymentDetailsFrom.patchValue({
        paymentDescription:null,
        paymentType:"ADDITIONAL"
      });
    }
    if(this.refundDetailsSection){
      this.inPatientPaymentDetailsFrom.patchValue({
        paymentDescription:null,
        paymentType:"REFUND"
      });
    }
    this.showAdvancePaymentBlock = !this.showAdvancePaymentBlock;

  }

  generatePaymentReport(paymentRefNo) {

    let payload = {
      paymentRefNo: paymentRefNo,
      reportId: "INPATIENT_PAYMENT_RECEIPT"
    }
    this.serviceProviderService.downloadFile(payload).subscribe(response => {

      var fileName = paymentRefNo;
      var a = document.createElement("a");
      var file = new Blob([response], { type: 'application/pdf' });
      var fileURL = URL.createObjectURL(file);

      var w = window.open("about:blank");

      var iframe = document.createElement('iframe');
      iframe.src = fileURL;
      iframe.focus();
      iframe.onload = function () {
        iframe.contentWindow.print();
      };

      w.document.body.appendChild(iframe);
      w.document.body.style.display = "none";

    })
  }

  // End Working on app/issues/1548

  //method to get active role and do the process accordingly 
  activeOption(radioVal: string) {
    if (radioVal == SBISConstants.INPATIENT_SUMMARY.PROCEDURE_NOTE) {
      GetSet.setAdmissionRefNo(this.admissionRefNo);
      this.router.navigate(['doctor/procedure']);
    }
  }//end of method

  // Working on app/issues/1642

  getAdmissionBasicInfo() {
    let requestQuery = {
      admissionRefNo: this.admissionRefNo
    }
    this.serviceProviderService.getAdmissionBasicInfo(requestQuery).subscribe((res) => {
      this.admitedPatientDetails.patientName = res.data.patientName
      this.admitedPatientDetails.bedNo = res.data.bedNo
      this.admitedPatientDetails.roomNo = res.data.roomNo
      this.admitedPatientDetails.gender = res.data.patientGender
      this.admitedPatientDetails.age = res.data.patientAge

    }, (error) => {
      ;
    });
  }
  // End Working on app/issues/1642

  // Working on app/issues/1844
  showInvoice(){

    if(this.invoiceDetails==null)
      return false;
    
    let payload = {
     invoiceNo:this.invoiceDetails.invoiceNo,
     reportId:"INPATIENT_INVOICE"
    }
    this.serviceProviderService.downloadFile(payload).subscribe(response => {

      var fileName = this.invoiceDetails.invoiceNo;
      var a = document.createElement("a");
      var file = new Blob([response], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);

      var w = window.open("about:blank");

      var iframe = document.createElement('iframe');
      iframe.src = fileURL;
      iframe.focus();
      iframe.onload = function() {
        iframe.contentWindow.print();
      };
      w.document.body.appendChild(iframe);
      w.document.body.style.display = "none";

    })
  }

  showAdmissionTransaction(){

    if(this.invoiceDetails==null)
      return false;
    
    let payload = {
      admissionRefNo:this.admissionRefNo,
     reportId:"ADMISSION_TRANSACTION"
    }
    
    this.serviceProviderService.downloadFile(payload).subscribe(response => {
      console.log("NEW JASPER response::",response);
      var fileName = this.admissionRefNo;
      var a = document.createElement("a");
      var file = new Blob([response], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);

      a.href = fileURL;
      a.download = fileName;
      a.click();
      window.open(fileURL);

    /*   var w = window.open("about:blank");

      var iframe = document.createElement('iframe');
      iframe.src = fileURL;
      iframe.focus();
      iframe.onload = function() {
        iframe.contentWindow.print();
      };
      w.document.body.appendChild(iframe);
      w.document.body.style.display = "none"; */

    })
  }

  openAdmissionDetailsSideBar(currentPatientDetails){
    // app#2222
    this.createChangeDoctorForm();
    this.createChangeBedForm();
    this.showChangeDoctor=false;
    this.showChangeBed=false;
    this.submitted=false;
    this.submitted1=false;
    this.showRoomDetail=false;
    this.roomCategoryRefNo= null; 
    this.departmentRefNo = null;
    this.roomName = null; // app#2222
    this.bedNo = null; 
    //end app#2222

    this.displayAdmissionDetailsSideBar=true;
    this.admissionRefNo = currentPatientDetails.admissionRefNo;
    let payload = {
      admissionRefNo: this.admissionRefNo
    }
    this.serviceProviderService.getInpatientAdmissionDetails(payload).subscribe(res => {
      console.log("RESPONSE ON EDIT:::",res);
      
      if (res.status === 2000) {
        this.isEdit = true;
       this.currentAdmission=res.data;
        console.clear();
        console.log(this.currentAdmission);
        this.setMinDateForDoctorHistory(this.currentAdmission);
        this.setMinDateForBedHistory(this.currentAdmission);
        this.currentAdmission.admissionStatus = currentPatientDetails.admissionStatus;
      }
    });
    
  }

  closeAdmissionDetailsSideBar(){
    this.displayAdmissionDetailsSideBar=false;
  }

  // End Working on app/issues/1844

  //susmita
  openPdf(src){
    var newTab = window.open();
    let srcForPdf = "data:application/pdf;base64," + src;
    newTab.document.body.innerHTML = '<iframe width="100%" height="101%" style="padding: 0;margin:0;" src="'+srcForPdf+'""></iframe>';
    newTab.document.body.style.overflow = "hidden";
    newTab.document.body.style.margin = "0";
    newTab.document.body.style.padding = "0";

  }//end of method


  cancelBedHistoryByAdmissionRefNo(bedHistory) {
    if(confirm("Do you want to remove this bed allocation ?")){
      let requestQuery = {
        admissionRefNo: this.admissionRefNo,
        bedHistoryPk:bedHistory.bedHistoryPk
      }
      this.serviceProviderService.cancelBedHistoryByAdmissionRefNo(requestQuery).subscribe((res) => {
        if(res.status=2000){
          this._toastService.showI18nToastFadeOut("Bed allocation removed successfully", "success");
          this.getBedChargeDetailByAdmission();
        }
      }, (error) => {
        console.log(error);      
      });
    }
    
  }

  navigateToSummary(admission){
    // localStorage.setItem("userRefNo", admission.patientRefNo);
    // localStorage.setItem("admissionRefNo", admission.admissionRefNo);
    let patient = {
      "name": admission.patientName,
      "age": admission.age,
      "gender": admission.patientGender,
      "ref_no": admission.patientRefNo
    }
    this.selectedAdmissionRefNo = admission.admissionRefNo;
    GetSet.setPatientDetails(JSON.stringify(patient));
    let payload = {
      "userRefNo": admission.patientRefNo,
      "admissionRefNo": admission.admissionRefNo
    }
    GetSet.setAdmission(payload);
    // this.router.navigate(['opd/ipd-patient', {'admission':JSON.stringify(payload)}]);
    this.router.navigate(['opd/ipd-patient']);
  }

  
// Working On app/issue/2009
createInpatientSummeryFilterForm(){
  let selectedHospitals:string[]=[];
  this.inpatientSummeryFilterForm = this.fb.group({
  patientName:[null],
  doctorName:[null],
  patientStatus:['admitted'],
  fromDate:[new Date( this.viewDate.getFullYear(),this.viewDate.getMonth()-1,this.viewDate.getDate())],
  toDate:[new Date()],
  hospitalList:[selectedHospitals],
  }) 
}


getPatientListByStatus(event){
this.isPatientAdmitted=true;
if(event.target.value=='discharged'){
  this.isPatientAdmitted=false;
  this.inpatientSummeryFilterForm.patchValue({
    fromDate:new Date( this.viewDate.getFullYear(),
    this.viewDate.getMonth()-1,
    this.viewDate.getDate())
  })
  console.log("inpatientList:::",this.inpatientList);
  
}
else{
  this.getInpatientList();
}
}



filterThroughCheckbox(event, q) {
let selectedHospitals=this.inpatientSummeryFilterForm.value.hospitalList
console.log("selectedHospitals::",selectedHospitals);
console.log("selectedHospital ::",q.hospitalRefNo);

if (event.target.checked) {
  selectedHospitals.push(q.hospitalRefNo);  
}
else {    
  selectedHospitals=selectedHospitals.filter(hospitalRefNo=>hospitalRefNo!=q.hospitalRefNo);
}

this.inpatientSummeryFilterForm.patchValue({
  hospitalList:selectedHospitals
})
console.log("FORM::",this.inpatientSummeryFilterForm.value);

}

getHospitalListByDoctorRefNo(){
let payload={
  doctorRefNo:this.currentUser.refNo
}
this.doctorService.getHospitalListByDoctorRefNo(payload).subscribe(res=>{
  console.log("RES::",res);    
  this.chemberList=res.data;
},
error=>{

});
}
//End Working On app/issue/2009


getBillDetails(bill){
  let requestQuery={
    intBillNo:bill.intBillNo
  }
  this.serviceProviderService.getInpatientBillDetailByRefNo(requestQuery).subscribe((res) => {
    this.displayBillDetailsSidebar=true;
      this.currentBillDetails=res.data;
        console.log("RESPONSE OF BILL DETAILS:::",res);
        this.billDetailList=res.data.billDetailList;
  },
    (error) => {
      
    }); 
}

closeBillDetailsSidebar(){
  this.displayBillDetailsSidebar=false;
}

usageCalculation(usage:number){

  let hours=Math.floor(usage/60);
  let minutes=usage-(hours*60);
  if(hours>0 && minutes>0)
    return hours+" Hours "+minutes+"Minutes";
  else if(hours>0 )
    return hours+" Hours";
  else
    return minutes+"Minutes";
}

  //app#2227 + //app#2228
  showChangeDoctor: boolean=false;
  showChangeBed: boolean=false;
  submitted: boolean=false;
  submitted1: boolean=false;
  showRoomDetail: boolean=false;
  changeDoctor(){
    this.showChangeDoctor=true;
    this.getDoctorName();
    this.changeDoctorForm.patchValue({
      admissionRefNo: this.currentAdmission.admissionRefNo
    });
  }
  changeBed(){
    this.showChangeBed=true;
    this.getDepartmentDetails();
    this.getRoomCategoryDetailsWithRole();
    this.changeBedForm.patchValue({
      admissionRefNo: this.currentAdmission.admissionRefNo
    });
  }
  backToChangeDoctor(){
    this.showChangeDoctor=false;
    this.submitted = false;
    this.changeDoctorForm.patchValue({
      doctorName: null,
      doctorRefNo: null,
      effectiveDate: null
    })
  }
  backToChangeBed(){
    this.showChangeBed=false;
    this.submitted1 = false;
    this.changeBedForm.patchValue({
      bedRefNo:null,
      roomCategory:null,
      roomNo:null,
      department: null,
      effectiveDate: null
    });
    this.departmentRefNo = null;
    this.roomName=null;
    this.bedNo = null;
  }
  createChangeDoctorForm(){
    this.changeDoctorForm=this.fb.group({
      admissionRefNo: [null],
      doctorName: [null, Validators.required],
      doctorRefNo: [null],
      effectiveDate: [null, Validators.required]
    })
  }
  createChangeBedForm(){
    this.changeBedForm=this.fb.group({
      admissionRefNo: [null],
      department: [null],
      roomCategory: [null, Validators.required],
      // departmentRefNo: [null],
      // roomCategoryRefNo: [null],
      bedRefNo: [null, Validators.required],
      roomNo:  [null, Validators.required],
      effectiveDate: [null, Validators.required]
    })
  }
  doctorList: any = [];
  optionsDoctorToDisplay: any = [];
  roomCategoryRefNo: any = null;; // app#2222
  departmentRefNo: any = null;
  roomName: any = null;; // app#2222
  bedNo: any = null; // app#2222
  allRoomRelatedInfoList: any=[];
  getDoctorName() {
     this.doctorList=[];
    if (this.currentUser.entityName == "HOSPITAL") {
      this.serviceProviderService.fetchDoctorListByOPD('ipd').subscribe(res => {
        if (res.status === 2000) {
          this.doctorList = res.data;         
        }
      }); 
    }
    else if (this.currentUser.entityName == "DOCTOR") {
      let query = {
        requestType: 'ipd',
        admissionRefNo: this.admissionRefNo
      }
       this.serviceProviderService.fetchDoctorListByOPDDoctor(query).subscribe(res => {
        if (res.status === 2000) {
          this.doctorList = res.data;        
        }
      }); 
    }
  }

  doctorNameList: any = [];
  referralNameList: string[];
  doctorDetails: any = [];
  bedAllocation: any;
  filteredReferralSingle(event) {
    this.doctorDetails = [];
        for(let i = 0; i < this.doctorList.length; i++) {
            let d = this.doctorList[i];
            if(event.query==""){
              if(d.name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                if(this.currentAdmission.doctorRefNo==d.ref_no) continue;
                let data = {refNo: null, name: null};
                data.refNo = d.ref_no;
                data.name = d.name
                this.doctorDetails.push(data);
              }
            }
            else{
              if(d.name.toLowerCase().indexOf(event.query.toLowerCase()) >= 0) {
                if(this.currentAdmission.doctorRefNo==d.ref_no) continue;
                let data = {refNo: null, name: null};
                data.refNo = d.ref_no;
                data.name = d.name
                this.doctorDetails.push(data);
              } 
            }
            
        }
  }

  referredNameSelect(doctor) {
    this.changeDoctorForm.patchValue({
      doctorName: doctor.name,
      doctorRefNo: doctor.refNo
    })
  }

  departmentList: any = [];
  categoryList: any = [];
//   getRoomCategoryDetailsWithRole() {
//     let query = {
//       admissionRefNo: this.admissionRefNo
//     }
//     this.categoryList=[];
//    if (this.currentUser.entityName == "HOSPITAL") {
//     this.serviceProviderService.fetchRoomcategoryListByAdmisnRefNo(query).subscribe(res => {
//           //this.categoryList = res;
//           if (res.status === 2000) {
//           for(let i = 0; i < res.data.length; i++ ){
//             let data = {label: null, value: null};
//             data.label = res.data[i].roomCatagory;
//             data.value = res.data[i].refNo;
//             this.categoryList.push(data);
//           }
//           }
//         });
//    }
//    else if (this.currentUser.entityName == "DOCTOR") {
    
//       this.serviceProviderService.fetchRoomcategoryListByAdmisnRefNo(query).subscribe(res => {
//        if (res.status === 2000) {
//         for(let i = 0; i < res.data.length; i++ ){
//           let data = {label: null, value: null};
//           data.label = res.data[i].roomCatagory;
//           data.value = res.data[i].refNo; 
          
//          this.categoryList.push(data);
//         }
//        }
//      }); 
//    }

//    else if (this.currentUser.entityName == "INDIVIDUAL") {
    
//     this.serviceProviderService.fetchRoomcategoryListByAdmisnRefNo(query).subscribe(res => {
//      if (res.status === 2000) {
//       for(let i = 0; i < res.data.length; i++ ){
//         let data = {label: null, value: null};
//         data.label = res.data[i].roomCatagory;
//         data.value = res.data[i].refNo; 
        
//        this.categoryList.push(data);
//       }
//      }
//    }); 
//  }
// }

getRoomCategoryDetailsWithRole() {
  let query = {
    admissionRefNo: this.admissionRefNo
  }
  this.categoryList=[];
 if (this.currentUser.entityName == "HOSPITAL") {
  this.serviceProviderService.getRoomCategoryDetailsWithBedResource(query).subscribe(res => {
        //this.categoryList = res;
        for(let i = 0; i < res.length; i++ ){
          let data = {label: null, value: null};
          data.label = res[i].roomCatagory;
          data.value = res[i].refNo;
          this.categoryList.push(data);
        }
      });
 }
 else if (this.currentUser.entityName == "DOCTOR") {
  
    this.serviceProviderService.getRoomCategoryDetailsWithBedResource(query).subscribe(res => {
     
      for(let i = 0; i < res.length; i++ ){
        let data = {label: null, value: null};
        data.label = res[i].roomCatagory;
        data.value = res[i].refNo;
        this.categoryList.push(data);
      }
   }); 
 }

 else if (this.currentUser.entityName == "INDIVIDUAL") {
  
  this.serviceProviderService.getRoomCategoryDetailsWithBedResource(query).subscribe(res => {
    for(let i = 0; i < res.length; i++ ){
      let data = {label: null, value: null};
      data.label = res[i].roomCatagory;
      data.value = res[i].refNo;
      this.categoryList.push(data);
    }
 }); 
}
}

getDepartmentDetails() {
  this.serviceProviderService.getDepartmentList()
    .subscribe(res => {
      //this.departmentList = res;
      for(let i = 0; i < res.length; i++ ){
        let data = {label: null, value: null};
        data.label = res[i].department;
        data.value = res[i].deptRefNo;
        this.departmentList.push(data);
      }
    });
}

setDepartment(dept){
  this.departmentRefNo = dept;
}
setRoomCategory(category){
  this.roomCategoryRefNo = category;
}
openRoomInfoSideBar(){
  this.showRoomDetail=true;
  this.getRoomCategoryDetailsWithBedResource();
 }
 closeRoomSidebar(){
  this.showRoomDetail=false
 }

 bedCnt: any = 0;
 getRoomCategoryDetailsWithBedResource(){
  let query = {
    admissionRefNo: this.admissionRefNo,
    departmentRefNo: this.departmentRefNo,
    roomCategoryRefNo: this.roomCategoryRefNo
  }
   this.serviceProviderService.getRoomCategoryDetailsWithBedResource(query).subscribe(res=>{
     console.log("RESOURCE RESPONSE::",res);
     this.allRoomRelatedInfoList=res;
     console.log("allRoomRelatedInfoList::",this.allRoomRelatedInfoList);
     this.bedCnt=0;
    for(let i=0;i<this.allRoomRelatedInfoList.length;i++){
      if(this.allRoomRelatedInfoList[i].bedCount > 0)  {
        this.bedCnt++;
      }
    }

   },(error)=>{
    console.log("RESOURCE ERROR::",error);
   })
 }

 getBedAvailablity(bed,room,roomCategoryRefNo){
  let query = {
    resourceRefNo:bed.refNo,
    date: new Date()
  }
  this.serviceProviderService.getResourceAvailablity(query).subscribe(res=>{
    console.log("CHECK::",res);

    this.bedAllocation=res.data;

    if(this.bedAllocation.startTime!=null){
      this._toastService.showI18nToast("This Bed is occupied","error")
    }
    else{

      this.changeBedForm.patchValue({
        bedRefNo:bed.refNo,
        roomCategory:roomCategoryRefNo,
        roomNo:room.refNo,
        department: room.departmentRefNo
      });
      this.departmentRefNo = room.departmentRefNo;
      this.roomCategoryRefNo = roomCategoryRefNo;
      this.roomName=room.roomNo;
      this.bedNo = bed.resourceName;
      console.log("FORM::",this.changeBedForm);
      this.showRoomDetail=false;
    }
  },(error)=>{
   console.log("RESOURCE ERROR::",error);
  })
 }


  saveChangeDoctor(){
    this.submitted = true;
    console.log(this.changeDoctorForm.value);
    if(this.changeDoctorForm.invalid){
      this._toastService.showI18nToastFadeOut("Please fill up all mandatory fields.", "error");
      return;
    }
    this.serviceProviderService.changeDoctorByAdmissionRefNo(this.changeDoctorForm.value).subscribe(res=>{
      if(res.status==2000){
        this._toastService.showI18nToastFadeOut("Doctor changed successfully.", "success");
        this.getAdmissionDetailsByAdmissionRefNo();
        this.showChangeDoctor=false;
      }
    });
  
  }
  saveChangeBed(){
    this.submitted1 = true;
    console.log(this.changeBedForm.value);
    if(this.changeBedForm.invalid){
      this._toastService.showI18nToastFadeOut("Please fill up all mandatory fields.", "error");
      return;
    }
    this.serviceProviderService.changeBedByAdmissionRefNo(this.changeBedForm.value).subscribe(res=>{
      console.log("CHECK::",res);
      if(res.status==2000){
        this._toastService.showI18nToastFadeOut("Bed changed successfully.", "success");
        this.getAdmissionDetailsByAdmissionRefNo();
        this.showChangeBed=false;
      }
    });
  }

  getAdmissionDetailsByAdmissionRefNo(){
    let payload = {
      admissionRefNo: this.admissionRefNo
    }
    this.serviceProviderService.getInpatientAdmissionDetails(payload).subscribe(res => {
      if (res.status === 2000) {
        this.isEdit = true;
       this.currentAdmission=res.data;
        console.clear();
        console.log(this.currentAdmission);
        this.currentAdmission.admissionStatus = "ADMITTED";
      }
    });
  }

  minDateDoctorHistory: any=null;
  minDateBedHistory: any=null;
  setMinDateForDoctorHistory(currentAdmission){
    if(currentAdmission.doctorHistoryList.length>0){
      for(let i=0;i<currentAdmission.doctorHistoryList.length;i++){
        if(currentAdmission.doctorHistoryList[i].endDate==null){
          this.minDateDoctorHistory=new Date(currentAdmission.doctorHistoryList[i].startDate)
        }
      }
    }
  }
  setMinDateForBedHistory(currentAdmission){
    if(currentAdmission.bedHistoryList.length>0){
      for(let i=0;i<currentAdmission.bedHistoryList.length;i++){
        if(currentAdmission.bedHistoryList[i].endDate==null){
          this.minDateBedHistory=new Date(currentAdmission.bedHistoryList[i].startDate)
        }
      }
    }
  }

  deleteDoctorHistory(docHist, i){
    console.log(docHist);
    if(docHist.endDate!=null){
      if(confirm("You are going to delete middle of history data. Do you want to Proceed?")){
        this.deleteDocHistory(docHist, this.admissionRefNo);
      }
    }
    else{
      this.deleteDocHistory(docHist, this.admissionRefNo);
    }
  }
  deleteDocHistory(docHist,admissionRefNo){
    let payload = {
      admissionRefNo: this.admissionRefNo,
      historyPk: docHist.historyPk
    }
    this.serviceProviderService.deleteDoctorHistory(payload).subscribe(res=>{
      if(res.status==2000){
        this._toastService.showI18nToastFadeOut("Doctor deleted successfully.", "success");
        this.getAdmissionDetailsByAdmissionRefNo();
      }
    });
  }
  deleteBedHistory(bedHist, i){
    if(bedHist.endDate!=null){
      if(confirm("You are going to delete middle of history data. Do you want to Proceed?")){
        this.deleteBedHist(bedHist, this.admissionRefNo);
      }
    }
    else{
      this.deleteBedHist(bedHist, this.admissionRefNo);
    }
  }
  deleteBedHist(bedHist,admissionRefNo){
    let payload = {
      admissionRefNo: this.admissionRefNo,
      bedHistoryPk: bedHist.bedHistoryPk
    }
    this.serviceProviderService.deleteBedHistory(payload).subscribe(res=>{
      if(res.status==2000){
        this._toastService.showI18nToastFadeOut("Bed deleted successfully.", "success");
        this.getAdmissionDetailsByAdmissionRefNo();
      }
    });
  }


  //Working On app/issue/2243
togglePaymentOrRefund() {

  this.refundDetailsSection=!this.refundDetailsSection;
  if(this.refundDetailsSection){
    this.inPatientPaymentDetailsFrom.patchValue({
      paymentDescription:null,      
    })
  }
}
// End Working On app/issue/2243

}

import { Component, OnInit, ViewChildren, OnDestroy } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { DoctorService } from '../../doctor/doctor.service';
import { ServiceProviderService } from '../../service-provider/service-provider.service';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { IndividualService } from '../../individual/individual.service';
import { environment } from '../../../../environments/environment';
import { SBISConstants } from '../../../../app/SBISConstants';
import { GetSet } from '../../../core/utils/getSet';
import { ThrowStmt } from '@angular/compiler';


@Component({
  selector: 'app-ind-inpatient-summary',
  templateUrl: './ind-inpatient-summary.component.html',
  styleUrls: ['./ind-inpatient-summary.component.css']
})
export class IndInpatientSummaryComponent implements OnInit, OnDestroy {

  panelVisible = false;
  title: any;
  dtFormat: any;
  inpatientList: any;
  resdata: any = [];
  admissionRefNo: string;
  currentPatientDetails: any;
  isPaginator = false;
  isDisableBtn: boolean = true;
  isShowChember: boolean;
  doctorRefNo: string;
  chamberList: any = [];
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
  fromDate: any;
  fromDateNo: any;
  toDateNo: any
  admissionToDate: any;
  toDate: any;
  headingsArray: any[] = [];//to display the headings on right side
  todate: Date = new Date();
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

 
  chkDischargedPatient : boolean = false; //Issues app#1497
  showDoctorFilter : boolean = true; //Issues app#1497


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
  invoiceDetails: any = { previousBills: [], bedHistoryDetail: [], paymentList: [] ,discountAmount:0};
  currentAdmission:any={admissionStatus:'ADMITTED'}
  // End Working on app/issues/1548

  radioLabelValues: any[] = [
    { key: SBISConstants.INPATIENT_SUMMARY.VISIT_NOTE, isChecked: true },
    { key: SBISConstants.INPATIENT_SUMMARY.PROCEDURE_NOTE, isChecked: false }
  ];
  admitedPatientDetails: any = { 'patientName': "", "bedNo": "", "roomNo": "", "gender": "", "age": "" };// Working on app/issues/1642
  inPatientFor: string;
  // Working on app/issue/1844
  displayAdmissionDetailsSideBar:boolean=false;
  // Working on app/issue/1844
  loading:boolean=false;

  displayBillDetailsSidebar=false;// Working on app/issue/1934
  billDetailList:any=[];// Working on app/issue/1934
  currentBillDetails:any={intBillNo:null,totalAmount:null,billingStatus:null};// Working on app/issue/1934
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

   this.customiseDesignOfBodyAcordingToUrl();   
   this.constructHeadingsArray();//method to construct heading array
  }//end of constructor

  ngOnInit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.dateFormat = environment.DATE_FORMAT;
    this.title = "My Hospitalization"
    this.dtFormat = environment.DATE_FORMAT;    
      this.inPatientFor = SBISConstants.MY_PRESCRIPTION_CONST.OWN;
      this.getInpatientList();
      this.hideForIndividual = false;
      this.isShowChember = true;
      this.isDisableBtn = false;
      this.showProcedureNote = false;
      this.showPatientFilter = false;
    // Working on app/issues/1548
    this.getPaymentModeCategory();
    this.createSaveReceipePayment();
    // End Working on app/issues/1548
    this.fromDate = ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear();
    this.toDate = ('0' + this.todate.getDate()).slice(-2) + '-' + ('0' + (this.todate.getMonth() + 1)).slice(-2) + '-' + this.todate.getFullYear();
    this.currentUser = JSON.parse(localStorage.getItem('user'))
  }//end of oninit

  constructHeadingsArray() {
  //method to construct headers array -- to display the headers to the right side of the page
    this.headingsArray.push({ inPatientFor: SBISConstants.MY_PRESCRIPTION_CONST.OWN, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.OWN_LABEL });
    this.headingsArray.push({ inPatientFor: SBISConstants.MY_PRESCRIPTION_CONST.GROUP, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.GROUP_LABEL });
    this.headingsArray.push({ inPatientFor: SBISConstants.MY_PRESCRIPTION_CONST.MINOR, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.MINOR_LABEL });
    // this.headingsArray.push({ prescriptionFor: SBISConstants.MY_PRESCRIPTION_CONST.ASSOCIATE, headingLabel: SBISConstants.MY_PRESCRIPTION_CONST.ASSOCIATE });
  }//end of method

   //method to set the data according to second header click
   onClickSecondHeader(clickedHeading: any) {
     this.loading = true;
     document.body.classList.add('hide-bodyscroll');
    this.inPatientFor = clickedHeading.inPatientFor;
    this.title = ((clickedHeading.headingLabel == SBISConstants.MY_PRESCRIPTION_CONST.OWN)? "My": clickedHeading.headingLabel ) + " Hospitalization";
    this.getInpatientList();
  }//end of method 


  customiseDesignOfBodyAcordingToUrl(){
    const url = window.location.href.toString();
    if(url.endsWith("/inpatient-summary"))
      document.body.classList.add('order-screen');
    else
        document.body.classList.remove('order-screen');
  }//end of method

  ngOnDestroy(){
    document.body.classList.remove('order-screen');
  }//end of method

  getInpatientList() {
    this.serviceProviderService.fetchIndividualUsersInpatientList(this.inPatientFor).subscribe(res=>{
      if(res.status == 2000){

        this.inpatientList = res.data;
        this.resdata = res.data;
        this.chamberList = Array.from(new Set(this.resdata.map(s => s.hospitalRefNo))).map(hospitalRefNo => {
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
    }, err => {
      // console.log("err of get order med::", err);
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
    });

    /* let payload = {
           dischargedStatus : "N" 
        }
      
    this.serviceProviderService.fetchInpatientList(payload).subscribe(res => {
      if (res.status === 2000) {
        this.doctorRefNo = res.doctorRefNo;
        this.inpatientList = res.data;
        this.allAdmittedPatientList = res.data;
        this.resdata = res.data;
        this.chamberList = Array.from(new Set(this.resdata.map(s => s.hospitalRefNo))).map(hospitalRefNo => {
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
    }); */

  }

  filteredList: any = [];
  onValueChange(label: any, dt: Date): void {
    if (label == 'fromDate') {
      // this.fromDate = dt.toISOString().split("T")[0].split("-").join("");
      this.fromDate = new Date(dt);
      this.fromDateNo = Number(this.fromDate);
      console.log("fromDate::", this.fromDateNo);
    }
    if (label == 'toDate') {
      // this.toDate = dt.toISOString().split("T")[0].split("-").join("");
      this.toDate = new Date(dt);
      this.toDateNo = Number(this.toDate);
      console.log("toDate::", this.toDateNo);
    }

    this.filteredList = [];
    console.clear();
    for (let admission of this.inpatientList) {
      var admistDate = new Date(admission.admissionDateStr);
      var admisnDateString = admistDate.toISOString().split("T")[0].split("-").join("");
      var admisnDateNo = Number(admisnDateString);
      // console.log("AAAA::",admisnDateNo);

      // console.log("Admission Date::",admistDate.getDate());


    }
    // this.inpatientList = [];
    // this.inpatientList = this.filteredList;


    let toDate = dt.toISOString().split("T")[0].split("-").join("");

    // console.log("toDate::",toDate);

    if (this.fromDate == this.toDate) {
      this.buttonClassCurrent = 'btn btn-dark';
      this.buttonClassAnother = 'btn btn-light';
    }
    else {
      this.buttonClassCurrent = 'btn btn-light';
      this.buttonClassAnother = 'btn btn-dark';
    }
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
        console.log(this.groupMemberList);

      }
    });
  }

  myselfButton() {
    this.title = "ADMITTED PATIENT LIST";
    this.isHidePrimaryTable = true;
    this.isHideGroupTable = false;
    this.isHideGroupbtn = true;
    this.isHideMyselfbtn = false;
    this.showPatientFilter = false;
  }



  onClickSubmit(data) {
    console.clear();
    // this.fromDate = new Date();
    // this.toDate = new Date();
    //  let fromDate = new Date(data.fromDate);
    //  let toDate = new Date(data.toDate);

    //  console.log("From Date::",data.fromDate.toISOString().split("T")[0].split("-").join(""));
    //  console.log("To Date::",data.toDate.toISOString().split("T")[0].split("-").join(""));

    let fromDate = data.fromDate.toISOString().split("T")[0].split("-").join("");
    let toDate = data.toDate.toISOString().split("T")[0].split("-").join("");
    let fromDateNo = Number(fromDate);
    let toDateNo = Number(toDate);

    console.log(fromDateNo, toDateNo);
    let filteredList: any;
    for (let admission of this.inpatientList) {
      let admistDate = new Date(admission.admissionDateStr);
      let admisnDateString = admistDate.toISOString().split("T")[0].split("-").join("");
      let admisnDateNo = Number(admisnDateString);
      console.log("AAAA::", admisnDateNo);

      // console.log("Admission Date::",admistDate.getDate());

      if (fromDate >= admisnDateNo && admisnDateNo <= toDate) {


        filteredList = this.inpatientList.filter(data => data.fromDateNo && data.toDateNo)
        console.log("Matched::", admistDate);

      }
      this.inpatientList.push(filteredList)
    }
    console.log(this.frmDate, this.todate);

  }




  /*showDischargedPatient(event) { //Issues app#1497
    this.chkDischargedPatient=true;

    if (event.target.checked) {
      let payload = {
                dischargedStatus : "Y"
             }
            this.serviceProviderService.fetchInpatientList(payload).subscribe(res => {
              if (res.status === 2000) {
                this.doctorRefNo = res.doctorRefNo;
                this.inpatientList = res.data;
                this.allAdmittedPatientList = res.data;
               console.log(this.allAdmittedPatientList);
        
                this.resdata = res.data;
                this.chamberList = Array.from(new Set(this.resdata.map(s => s.hospitalRefNo))).map(hospitalRefNo => {
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
              dischargedStatus : "N"
            }
          this.serviceProviderService.fetchInpatientList(payload).subscribe(res => {
           if (res.status === 2000) {
              this.doctorRefNo = res.doctorRefNo;
              this.inpatientList = res.data;
              this.allAdmittedPatientList = res.data;
              console.log(this.allAdmittedPatientList);
        
              this.resdata = res.data;
              this.chamberList = Array.from(new Set(this.resdata.map(s => s.hospitalRefNo))).map(hospitalRefNo => {
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
  } */

  filterTable(event, type) {
    this.inpatientList = this.resdata;
    if (type == 'patient') {
      this.inpatientList = this.inpatientList.filter(data => data.patientName.toLowerCase().startsWith(event.toLowerCase()))
    }
    if (type == 'doctor') {
      this.inpatientList = this.inpatientList.filter(data => data.doctorName.toLowerCase().startsWith(event.toLowerCase()))
    }
  }

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

  resetAll(filterForm: NgForm) {
    console.log("Reset::", filterForm);
    this.chkDischargedPatient = false;// Issues app#1497
    filterForm.resetForm();    
    // this.selectedValues = [];
    this.inpatientList = this.allAdmittedPatientList;
    this.getInpatientList();
  }

  editPatientDetails(currentPatientDetails) {
    this.admissionRefNo = currentPatientDetails.admissionRefNo;
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
    // const bdate = new Date(inPatientDetails.patientDateOfBirth);
    // const timeDiff = Math.abs(Date.now() - bdate.getTime());
    // let age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + "Y";
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
    let requestBody: any = { "admissionRefNo": admissionRefNumber };
    this.serviceProviderService.getAllUsersProcedureInfoByAdmissionRefNo(requestBody).subscribe(res => {
      this.procedureNotes = [];
      if (res.status == 2000) {
        // this.procedureNotes = res.data;  
        res.data.forEach((element, index) => {
          element.procedureUploadDtoList.forEach((el, ind) => {
            let query = {
              'downloadFor': SBISConstants.IMAGE_UPLOAD_CONST.PROCEDURE_IMAGE,
              'procedureImageRefNo': el.procedureUploadRefNo
            }
            this.doctorService.downloadDocument(query).subscribe((result) => {
              if (result.status == 2000) {
                let imgSrc = "data:image/jpeg;base64," + result.data.data;
                el['imgSrc'] = imgSrc;
              }
            });
          });
          if ((index + 1) == res.data.length)
            this.procedureNotes = res.data;
        });
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
    // window.open(imgSrc);
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
      txnTypeRefNo: [null, Validators.required],
      paymentDescription: ["Advance Payment"],
      amount: [null, Validators.required],
      paymentMode : ["Cash", Validators.required],
      cardNo: [null],
      txnType: ["ADMISSION"]
    })
  }


  getPaymentModeCategory() {
    this.doctorService.GetPaymentModeCategory()
      .subscribe(res => {
        this.paymentModeCategories = res.masterDataAttributeValues
      });
  }



  openRecivePaymentBillDetails(currentPatientDetails) {
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
    // this.displayReceviePaymentSidebar = true;
    this.paymentSubmitted = true;
    console.log("inPatientPaymentDetailsFrom::", this.inPatientPaymentDetailsFrom);

    if (!this.inPatientPaymentDetailsFrom.valid)
      return false;
    this.serviceProviderService.saveInPatientPayment(this.inPatientPaymentDetailsFrom.value).subscribe(res => {
      if (res.status == 2000) {
        this._toastService.showI18nToastFadeOut("Payment saved", "success");
        this.generatePaymentReport(res.data.txnTypeRefNo)
        if (this.displayReceviePaymentSidebar)
          this.displayReceviePaymentSidebar = false;
        /* if (this.displayInvoiceSidebar)
          this.displayInvoiceSidebar = false; */

        this.createSaveReceipePayment();
        this.paymentSubmitted = false;

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

  calculateOutstandingAmount() {
    let totalBedCharge: number = 0;
    let totalBillCharge: number = 0;
    let totalPayment: number = 0;
    for (let bed of this.inPatientTransactionDetails.bedHistoryDetail) {
      totalBedCharge = totalBedCharge + (bed.noOfDays * bed.bedChargeStandard)
    }
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
      // totalBillCharge = totalBillCharge + bill.amount;
    }

    for (let payment of this.inPatientTransactionDetails.paymentList) {
      totalPayment = totalPayment + payment.amount;
    }

    this.outstandingAmount = totalBedCharge + totalBillCharge - totalPayment;
    this.totalDue = (totalBedCharge + totalBillCharge) + (this.invoiceDetails.discountAmount);
    this.totalPayDone = totalPayment;
    console.log(this.inPatientTransactionDetails);
    console.log(this.totalDue,totalBedCharge,totalBillCharge, this.invoiceDetails.discountAmount);
    if (this.invoiceDetails != null){
      this.outstandingAmount = this.outstandingAmount + this.invoiceDetails.discountAmount;
      /*if(this.outstandingAmount < 0){
        console.log(this.outstandingAmount);
        this.outstandingAmount = this.outstandingAmount * -1;
        console.log(this.outstandingAmount);
      }*/

    }

  }

  redirectToInvoice() {
    this.router.navigate(['opd/generate-invoice', this.admissionRefNo]);
  }

  showAdvancePaymentPart() {
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
  // end Working on app/issues/1642

 // Working on app/issues/2101
  openInvoiceSideBar(currentPatientDetails) {
    this.createSaveReceipePayment();
    this.admissionRefNo = currentPatientDetails.admissionRefNo;
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
        this.inPatientTransactionDetails.previousBills=res.data.invoiceDetailList;
        this.inPatientTransactionDetails.bedHistoryDetail = res.data.bedHistoryDetail;
        this.inPatientTransactionDetails.paymentList = res.data.paymentList;
        this.calculateOutstandingAmount();
      }
    }, (error) => {
    });
 */

  }
  closeInvoiceSideBar() {
    this.displayInvoiceSidebar = false;
    this.showAdvancePaymentBlock = false;

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


    })
  }

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

 // end Working on app/issues/2101
 // Working on app/issues/1844
 openAdmissionDetailsSideBar(currentPatientDetails){
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
        this.currentAdmission.admissionStatus = currentPatientDetails.admissionStatus;
      }
    });
  
  }
  closeAdmissionDetailsSideBar(){
    this.displayAdmissionDetailsSideBar=false;
  }
   // End Working on app/issues/1844

   // Working on app/issues/1934
   getBillDetails(bill){
    let requestQuery={
      intBillNo:bill.intBillNo
    }
    this.serviceProviderService.getInpatientBillDetailByRefNo(requestQuery).subscribe((res) => {
      this.displayBillDetailsSidebar=true;
        this.currentBillDetails=res.data;
          console.log("RESPONSE OF BILL DETAILS:::",res);
          this.billDetailList=res.data.billDetailList;
          console.log("billDetailList:::",this.billDetailList);
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
  // End Working on app/issues/1934

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
}

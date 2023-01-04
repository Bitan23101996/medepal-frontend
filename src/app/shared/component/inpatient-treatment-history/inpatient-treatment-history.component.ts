import { Component, OnInit,Input, EventEmitter, Output, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { DoctorService } from '../../../modules/doctor/doctor.service';
import { SBISConstants } from 'src/app/SBISConstants';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GetSet } from '../../../core/utils/getSet';
import { DomSanitizer } from '@angular/platform-browser';
import { ServiceProviderService } from '../../../modules/service-provider/service-provider.service';
import { IndividualService } from '../../../modules/individual/individual.service';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-inpatient-treatment-history',
  templateUrl: './inpatient-treatment-history.component.html',
  styleUrls: ['./inpatient-treatment-history.component.css']
})
export class InpatientTreatmentHistoryComponent implements OnInit {
  @Input() admissionRefNo: any;
  @Input() userRefNo: any;
  @Input() screenFlag: any;
  @Input() patientDetails: any;
  
  @Output() treatmentFormData = new EventEmitter<any>();
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  @ViewChild('procedurePreviewModal') procedurePreviewModal: TemplateRef<any>; 
  modalRef: BsModalRef;
  config = {
    // class: 'custom-modal-width modal-lg',
    // backdrop: true,
    // ignoreBackdropClick: true
    class: 'modal-lg',
  };
  currentMedicationList: any=[];//app#2445
  @ViewChild('discontinueMedicineModal') discontinueMedicineModal: TemplateRef<any>; //Working on app/issues/2445
  @ViewChild('editMedicineModal') editMedicineModal: TemplateRef<any>; //Working on app/issues/2445
  
  pastPrescription: any = [];
  showDataFlag: boolean = false;
  loggedInUser:any;
  procedureNote: any=null;
  prescriptionRefNo: any;

  constructor(private doctorService: DoctorService,private translateService:TranslateService, 
    private individualService: IndividualService, private fb: FormBuilder, private toastService: ToastService,
    private router: Router,private location:Location,private bsModalService: BsModalService, 
    private sanitizer: DomSanitizer, private serviceProviderService: ServiceProviderService) {
    translateService.setDefaultLang('en');
    translateService.use('en');
   }

  
  ngOnInit() {
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    this.getPrescriptionsByAdmissionRefNo();
    const url = window.location.href.toString();
      //console.log(url);
      if (url.indexOf('/prescription') > 0) {
        this.screenFlag="prescription";
      }else{
        this.screenFlag="ipd";
      }
      this.getCurrentMedicineList();
  }


  getPrescriptionsByAdmissionRefNo() {
    let payload = {
      admissionRefNo: this.admissionRefNo,
      
    }

    this.doctorService.getPastPrescriptionApiV5(payload)
      .subscribe(data => {
        console.clear();
        console.log(data);
        this.getInvestigationHistory(data.data); //app2445
        this.calculateProcedureStartTime(data.data);
        this.getUploadedDocumentListAndSetTheListToTheArray(data.data,"uploadedMedicalRecordList","uploadedMRImages");//new add to get uploaded document list by document ref number
        this.getUploadedDocumentListAndSetTheListToTheArray(data.data,"procedureUploadDtoList","procedureImages")
        },
        (error) => {
          console.log(error);
          
          return;
        });
  }//end of method

    //create a common method to store past prescription from response and calculate procedure start time
    calculateProcedureStartTime(response){
      this.pastPrescription = response;
      if(this.pastPrescription && this.pastPrescription.length>0){
        for(let i=0; i < this.pastPrescription.length; i++){
          let prescription = this.pastPrescription[i];
          if((!prescription["prescription"]) && prescription["procedureStartTime"]){
              let sT = prescription["procedureStartTime"].substring(3,5);
              let stSub = prescription["procedureStartTime"].substring(0,2);
              prescription["procedureStartTime"] = (((+stSub)>12)?((+stSub)-12): stSub )+":"+sT + (((+stSub)>12)?" PM": " AM");
          }
        }
      }
      this.showDataFlag = true;
    }//end of method
  
    getUploadedDocumentListAndSetTheListToTheArray(responseArray: any[],uploadedImageListName:string,arrayName:string) {
      responseArray.forEach((element,index) => {
        element[arrayName] = [];          
        element[uploadedImageListName].forEach((el,ind)=>{
          let query = {
            'downloadFor': (uploadedImageListName == "uploadedMedicalRecordList") ?
             SBISConstants.IMAGE_UPLOAD_CONST.TEST_REPORT: SBISConstants.IMAGE_UPLOAD_CONST.PROCEDURE_IMAGE
          };
          (uploadedImageListName == "uploadedMedicalRecordList")? 
          query['documentRefNo'] = el: 
          query['procedureImageRefNo'] = el.procedureUploadRefNo
          this.doctorService.downloadDocument(query).subscribe((result) => {
            if (result.status == 2000) {                
              let fileContentTypeStr = result.data.fileName.split('.');
              el['contentType'] = fileContentTypeStr[fileContentTypeStr.length -1];
              let imgSrc = ((el['contentType'] =='pdf')? "data:application/pdf;base64,": "data:image/jpeg;base64,") + result.data.data;                 
              element[arrayName].push({imgSrc: imgSrc, contentType: el.contentType, actualSrc: result.data.data});
            }              
          });
        });
        if((index+1) == responseArray.length){
          this.pastPrescription = [];
          this.pastPrescription = responseArray;
        }
      });
    }//end of method




    navigateToPrescription() {
      localStorage.setItem("userRefNo",this.userRefNo)
      localStorage.setItem("admissionRefNo",this.admissionRefNo);
      this.router.navigate(['doctor/prescription']);
    }
    editPrescription(pp){
      localStorage.setItem("userRefNo",this.userRefNo)
      localStorage.setItem("admissionRefNo",this.admissionRefNo);
      localStorage.setItem("prescriptionRefNo",pp.prescriptionRefNo);
      this.router.navigate(['doctor/prescription']);
    }

    back(){
      this.location.back();
    }

    navigateToProcedure() {
      GetSet.setPatientDetails(JSON.stringify(this.patientDetails));
      GetSet.setAdmissionRefNo(this.admissionRefNo);
      localStorage.setItem("admissionRefNo",this.admissionRefNo);
      this.router.navigate(['doctor/procedure']);
    }



  displayProcedureSidebar: boolean = false;
  selectedAdmissionRefNo: string = "";
  procedureNotes: any[] = [];
  selectedProcedureNote: any = {};
  noCardMsg: boolean = false;
  
    openVisitNoteSidebar(){
      let patient = {
        "name": this.patientDetails.name,
        "age": this.patientDetails.age,
        "gender": this.patientDetails.gender,
        "ref_no": this.patientDetails.ref_no
      }
      this.selectedAdmissionRefNo = this.admissionRefNo;
      GetSet.setPatientDetails(JSON.stringify(patient));
      this.getAllProcedureByAdmissionRefNumber(this.admissionRefNo);
      this.displayProcedureSidebar = true;
    }
    //method to close sidebar for procedure
    closeProcedureSidebar() {
      this.procedureNotes = [];
      this.selectedProcedureNote = {};
      this.displayProcedureSidebar = false;
    }
    //method to fire a trigger when the procedure has been saved from sidebar
  procedureSavedFromSidebar(event) {
    this.getAllProcedureByAdmissionRefNumber(this.selectedAdmissionRefNo);
  }
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
  openPdf(src){
    var newTab = window.open();
    // let srcForPdf = "data:application/pdf;base64," + src;
    newTab.document.body.innerHTML = '<iframe width="100%" height="101%" style="padding: 0;margin:0;" src="'+src+'""></iframe>';
    newTab.document.body.style.overflow = "hidden";
    newTab.document.body.style.margin = "0";
    newTab.document.body.style.padding = "0";

  }//end of method

    cancelPatientPreview() {
      this.treatmentFormData.emit(false);
    }

    openPrescriptionModal(prescription){
      this.prescriptionRefNo=prescription.prescriptionRefNo;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, this.config);
    }

    openProcedureModal(procedure){
      let payload = {
        refNo: this.userRefNo
      }
      let age: any;
      //taking a json to store patient details
      let patient: any = {};
      this.doctorService.getPatientDetailsByRefNo(payload).subscribe(data => {
        if (data['data']) {
          if (data['data'].dateOfBirth != null) {
            const bdate = new Date(data['data'].dateOfBirth);
            const timeDiff = Math.abs(Date.now() - bdate.getTime());
            age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " Y";
            patient["name"] = data['data'].name;
            patient["age"]  = age;
            patient["gender"] =  data['data'].gender;
            patient["ref_no"] = this.userRefNo;
          }
        }
      })
      procedure["patient"] = patient
      console.log(procedure);
      this.procedureNote = procedure;
      this.modalRef = this.bsModalService.show(this.procedurePreviewModal, this.config);
    }

    //edit diagnostics test details
    patientPrescriptionDetail: any = {};
    showDiagnosticsTestReport: boolean = false;
  medicalDiagnosticDetailsData: any;
  onClickEditDiagnosticsTestDetails(diagnosticsTestDetails, prescription,editAddStr: string) {
    if(editAddStr == 'edit'){
      this.patientPrescriptionDetail['prescriptionRefNo'] = prescription.prescriptionRefNo;
      this.medicalDiagnosticDetailsData = diagnosticsTestDetails;
    }else{
      this.medicalDiagnosticDetailsData = "";
    }
    this.patientPrescriptionDetail['refNo'] = this.userRefNo;
    this.patientPrescriptionDetail['name'] = (this.loggedInUser)?(this.loggedInUser.name? this.loggedInUser.name : ''): prescription.individualUserEntity.name;
    (editAddStr == 'edit')? this.showDiagnosticsTestReport = true: this.fetchUserDetailsByUserRefNo("testReport");
  } // end of method

  //close diagnostics edit modal
  medicalDetailsClose(){
    this.showDiagnosticsTestReport = false;
  }//end of method

  //creating a method to fetch user details [https://gitlab.com/sbis-poc/app/issues/1163] --susmita--
  fetchUserDetailsByUserRefNo(calledFrom: string , procedureRefNo?: string){
    let payload = {
      refNo: this.userRefNo
    }
    let age: any;
    //taking a json to store patient details
    let patient: any = {};
    this.doctorService.getPatientDetailsByRefNo(payload).subscribe(data => {
      if (data['data']) {
        if (data['data'].dateOfBirth != null) {
          const bdate = new Date(data['data'].dateOfBirth);
          const timeDiff = Math.abs(Date.now() - bdate.getTime());
          age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + " Y";
          patient["name"] = data['data'].name;
          patient["age"]  = age;
          patient["gender"] =  data['data'].gender;
          patient["ref_no"] = this.userRefNo;
          switch(calledFrom){
            case "procedure":{
              this.commonRouteByParameter(calledFrom,patient);
              break;
            }
            case "editProcedure":{
              this.commonRouteByParameter(calledFrom,patient,procedureRefNo);
              break;
            }
            case "testReport":{
              this.patientPrescriptionDetail['name'] = patient.name;
              this.commonRouteByParameter(calledFrom,patient);
              break;
            }
            case "peerConsulting":{
              patient["mobile"] = "+919230325697";
              patient["ms_user_pk"] = "1";
              patient["prescriptionDate"] = "2019-07-16";
              this.commonRouteByParameter(calledFrom,patient);
              break;
            }
          }
        }      
      }
    });  
  }//end of method -- [https://gitlab.com/sbis-poc/app/issues/1163]

  //a common method to route procedure/test-report/peer-consulting
  commonRouteByParameter(whereToRoute: string,patient: any,procedureRefNo?: string){
    GetSet.setPatientDetails(JSON.stringify(patient));
    switch(whereToRoute){
      case "peerConsulting":{
        this.router.navigate(['peerconsulting/peer-consulting-request']);
        break;
      }
      case "procedure":{
        this.router.navigate(['doctor/procedure']);
        break;
      }
      case "editProcedure":{
        this.router.navigate(['doctor/procedure',procedureRefNo]);
        break;
      }
      case "testReport":{
        this.showDiagnosticsTestReport = true;
        break;
      }
    }//end of switch
  }//end of method

  // Working on app/issues/2445
  effictiveFrom:any=null;
  showDate: boolean=false;
  discontinueForm:FormGroup;
  errMsg:any="";
  medicine:any;

  getCurrentMedicineList(){
    let payload = {
      "admissionRefNo":this.admissionRefNo
    }
    this.individualService.currentMedicineListIPDV2(payload).subscribe((currentMedicine) => {
			if(currentMedicine.status == 2000) {
        this.currentMedicationList=currentMedicine.data
        console.log(this.currentMedicationList)
			}
    });
  }
  discontinueMedicine(medicine){
    this.medicine=medicine;
    this.discontinueForm=this.fb.group({
      discontinueDate: [null]
    })
    this.effictiveFrom=null;
    this.modalRef = this.bsModalService.show(this.discontinueMedicineModal, {class: 'modal-sm',});
  }

  setEffectiveFrom(value){
    if(value=="I"){
      this.showDate = false;
      this.errMsg="";
      this.discontinueForm.reset();
    }
    else if(value=="T"){
      this.showDate = false;
      this.errMsg="";
      this.discontinueForm.reset();
    }
    else{
      this.showDate = true;
    }
    this.effictiveFrom = value
  }
  discontinue(){
    if(this.effictiveFrom=="O" && (this.discontinueForm.value.discontinueDate==null || this.discontinueForm.value.discontinueDate=="")){
      this.errMsg="Please enter date";
    }
    else{
      this.errMsg="";
    }
    let payload = {
      "medicineId": this.medicine.medicationPk,
      "effictiveFrom": this.effictiveFrom,
      "effictiveFromDate": this.discontinueForm.value.discontinueDate
    }
    console.log(payload);
    this.individualService.discontinueCurrentMedicine(payload).subscribe((res)=>{
      if(res.status==2000){
        this.toastService.showI18nToastFadeOut(this.medicine.medicineName+" discontinued","success");
        this.modalRef.hide();
        this.getCurrentMedicineList();
      }
    })
    
  }

  investigationHistory:any=[];
  getInvestigationHistory(res){
    for(let i=0;i<res.length;i++){
      if(res[i].prescriptionRefNo!=null && res[i].doctorRecommendedTestList.length>0){
        let testList = res[i].doctorRecommendedTestList;
        
        for(let j=0;j<testList.length;j++){
          testList[j]['prescription']=res[i];
          this.investigationHistory.push(testList[j]);
        }
        
      }
    }
    console.log( this.investigationHistory);
    
  }

  prescriptionForm:FormGroup;
  durationUnitList : any;
  dosageDurationList : any;
  submitted: boolean = false;
  enableSos: any;
  enableFrequency: any;
  unitType: any = [];
  configMedicine = {
    class: 'custom-modal-width-95-prescription modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  isDuplicateMedicine: any;
  results: any;

  editMedicine(medicine){
    this.isDuplicateMedicine = [];
    this.enableSos = [];
    this.enableFrequency = [];
    this.unitType = ['vial', 'ml', 'tabs', 'drop'];
     this.getDosageDurationList();
    this.getDurationUnitList();

    this.modalRef = this.bsModalService.show(this.editMedicineModal, this.configMedicine);
    console.log(medicine);
    let medicineArr: FormGroup[] = [];
    medicineArr.push(this.editForm(medicine));
    this.prescriptionForm = this.fb.group({
      prescriptionDate: [],
      nextCheckUpDate: [],
      medicalFindingsList: [],
      observationList: [],
      doctorRecommendedTestList: [],
      patientProblemNarration: [],
      diagnosisList: [],
      medicationDTOList: this.fb.array(medicineArr),
      adviceList: [],
      doctorNote: [],
      doctorReferral: [],
      status: ["NRM"],
      userRefNo: [this.userRefNo],
      doctorRefNo: [medicine.doctorRefNo],
      appointmentRefNo: [null],
      isDraft: ["N"],
      
      observationFormDirty: false,
      medicationFormDirty: true,
      adviceFormDirty: false,
      diagnosisFormDirty: false,
      testFormDirty: false,
      vitalFormDirty: false,
      prescriptionFormDirty: false,
      noteFormDirty: false,
      referralFormDirty: false,
      symptomFormDirty: false,
      symptomList: [],
      reportReviewDate: [],
      prescriptionRefNo: [],
      admissionRefNo: [this.admissionRefNo],
      shareWithPatient:[],  
      printGenericName: [null]
    });
  }

  get medicationDTOList(): FormArray {
    return this.prescriptionForm.get('medicationDTOList') as FormArray;
  }

  getDosageDurationList(){
    this.doctorService.getDosageDurationList()
    .subscribe(res =>{
      //console.log(res);
      this.dosageDurationList = res.masterDataAttributeValues;
      
    });
  }
  getDurationUnitList(){
    this.doctorService.getDurationUnitList()
    .subscribe(res =>{
      //console.log(res);
      this.durationUnitList = res.masterDataAttributeValues;
      
    });
  }

  editForm(res): FormGroup {
    let substituteMedicineList: any = [];
    for(let i = 0; i< res.substituteMedicineList.length; i++){
      substituteMedicineList.push(res.substituteMedicineList[i]);
    }
    return this.fb.group({
      medicationPk: [null],
      //medicationDetailsPk: [res.medicationDetailsPk],
      medicineId: [res.medicineId],
      medicineName: [res.medicineName, Validators.required],
      dosageFrequency: [res.dosageFrequency==0?null:res.dosageFrequency],
      dosageInterval: [res.dosageInterval],
      duration: [res.duration==0?null:res.duration],
      durationUnit: [res.durationUnit],
      timing: [res.timing],
      status: [res.status],
      
      sosFlag: [res.sosFlag],
      beforeAfterMealFlag: [res.beforeAfterMealFlag],
      comments: [res.comments],
      noOfUnit: [res.noOfUnit],
      unitType: [res.unitType],
      substituteMedicineList: [substituteMedicineList],
      genericName: [res.genericName] //app/issues/2145
    })
  }

  
  getMedicineList(event) {
    //console.log(event.query);
    let query = {
      "_source" : ["product_name", "product_composition", "product_id"],
      "query" : {
      "multi_match": {
          "query": event.query,
          "type":  "cross_fields",
          "fields": ["product_name", "product_composition"]
          }
      }
  }      
  ;
     //console.log(query);
     this.individualService.getMedicinesByNameList(event.query).subscribe((data) => {
      //console.log(data)
      this.results = data.data;
      //console.log(this.results)
    });
  }

  setMedicineName(event, index){
    //console.log(event);
    let medicationList = this.prescriptionForm.get('medicationDTOList') as FormArray;
    let medicineForm = medicationList.controls[index] as FormGroup;
    medicineForm.controls.medicineName.patchValue(event.brandName);
    medicineForm.controls.medicineId.patchValue(event.medicineId);
    medicineForm.controls.genericName.patchValue(event.product_composition);
    if(event.packageType == "vial"){
      medicineForm.controls.unitType.patchValue("vial");
    }
    else if(event.packageType == "strip"){
      medicineForm.controls.unitType.patchValue("tabs");
    }
    else if(event.packageType == "bottle"){
      medicineForm.controls.unitType.patchValue("ml");
    }
    else if(event.brandName.includes("Drop") || event.brandName.includes("drop")){
      medicineForm.controls.unitType.patchValue("drop");
    }
    
  }

  managePk(medicineName, i){
    let medicationList = this.prescriptionForm.get('medicationDTOList') as FormArray;
    let medicineForm = medicationList.controls[i] as FormGroup;
    
    if(medicineName != medicineForm.controls.medicineName.value){
      medicineForm.controls.medicineId.patchValue("");
    }
    
  }

  toggleSos(event, i){
    let medicationList = this.prescriptionForm.get('medicationDTOList') as FormArray;
    let medicineForm = medicationList.controls[i] as FormGroup;
    if(event.target.checked){
      this.enableSos[i] = true;
      medicineForm.controls.sosFlag.patchValue('Y');
      medicineForm.controls.dosageFrequency.patchValue(null);
      medicineForm.controls.dosageInterval.patchValue(null);
      //Working on app/issues/878
      medicineForm.controls.duration.patchValue(null);
      medicineForm.controls.durationUnit.patchValue(null);
      //End Working on app/issues/878
      //console.log(this.prescriptionForm.value);
      
    }
    else{
      this.enableSos[i] = false;
      medicineForm.controls.sosFlag.patchValue('N');
      medicineForm.controls.dosageInterval.patchValue('D');
      medicineForm.controls.dosageFrequency.patchValue(1);
      //Working on app/issues/878
      medicineForm.controls.duration.patchValue(1);
      medicineForm.controls.durationUnit.patchValue("D");
      //End Working on app/issues/878

    }
    this.prescriptionForm.markAsDirty();
  }

  toggleFrequency(event, i){
    let medicationList = this.prescriptionForm.get('medicationDTOList') as FormArray;
    let medicineForm = medicationList.controls[i] as FormGroup;
    if(event.target.checked){
      this.enableSos[i] = false;
      //this.enableFrequency[i] = true;
      medicineForm.controls.sosFlag.patchValue('N');
      medicineForm.controls.dosageInterval.patchValue('D');
    }
    else{
      this.enableSos[i] = true;
      //this.enableFrequency[i] = false;
    }
    this.prescriptionForm.markAsDirty();
  }
  
  selectTiming(event, i, timing){
    let medicationList = this.prescriptionForm.get('medicationDTOList') as FormArray;
    let medicineForm = medicationList.controls[i] as FormGroup;
    
      if(timing=="A"){
        if(event.target.checked){
          medicineForm.controls.beforeAfterMealFlag.patchValue('A');
        }
        else{
          medicineForm.controls.beforeAfterMealFlag.patchValue(null);
        }
      }
      if(timing=="B"){
        if(event.target.checked){
          medicineForm.controls.beforeAfterMealFlag.patchValue('B');
        }
        else{
          medicineForm.controls.beforeAfterMealFlag.patchValue(null);
        }
      } 
      this.prescriptionForm.markAsDirty();
    }


  savePrescription(){
    this.submitted=true;
    
    this.doctorService.autoSavePrescription(this.prescriptionForm.value).subscribe(data => {
      if (data['status'] == '2000') {
        this.toastService.showI18nToastFadeOut("Prescription saved successfully", "success");
        this.modalRef.hide();
        this.getCurrentMedicineList();
      }
    });
  }
  // End Working on app/issues/2445
}

import { Component, OnInit, Input ,TemplateRef, ViewChild} from '@angular/core';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { ActivatedRoute, ParamMap ,Router} from '@angular/router';
import { DoctorService } from '../../../modules/doctor/doctor.service';
import { IndividualService } from '../../../modules/individual/individual.service';
import { GetSet } from '../../../core/utils/getSet';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { SBISConstants } from '../../../SBISConstants';
import { ToastService } from '../../../core/services/toast.service';
@Component({
  selector: 'app-prescription-preview',
  templateUrl: './prescription-preview.component.html',
  styleUrls: ['./prescription-preview.component.css']
})
export class PrescriptionPreviewComponent implements OnInit {

  @ViewChild('googleMapLocation') googleMapLocation: TemplateRef<any>;
  prescriptionPreviewForm: any;
  age: any = "Not Specified";
  specializations = "";
  qualifications = "";
  doctorQualifications: any = [];
  doctorSpecializations: any = [];
  fileName = "Prescription";
  reportType = "PRES";
  pk:any;
  signatureSrc:any;
  domSanitizer: any;
  @Input() prescriptionRefNo: any;
  @Input() appRefNo: any;
  @Input() modalRef: any;
  @Input() prescription: any;
  @Input() customType: any; //Working on app/issues/1267
  @Input() admissionRefNo: any=null; //Working on app/issues/1970
  @Input() prePrintOff: boolean ;
  notFoundMsg = "";
  user: any;
  isHide: any = false;
  headerImage = "";
  footerImage = "";
  // sbis-poc/app/issues/644
  isVitalShow: boolean = false;
  preprinted: string = "N";

  download = {
    downloadImageSrc: "",
    contentType: "",
    doctorName: "",
    forUserName: ""
  }
  printSectionId = "print-section"
  uploadedPrescriptionSrc: any;
  constructor(private _docService: DoctorService, 
              private broadcastService: BroadcastService,
              private route: ActivatedRoute,
              private bsModalService: BsModalService,
              private router: Router,
              private _individualService: IndividualService,
              private _domSanitizer: DomSanitizer,
              private individualService: IndividualService,
              private toastService: ToastService ) {
                this.domSanitizer = _domSanitizer;
               }

  ngOnInit() {
    this.prePrintOff = this.prePrintOff ? true: false;
    //this.broadcastService.setHeaderText("Prescription Preview");
    //console.log(this.precription);
    this.user = JSON.parse(localStorage.getItem('user'));
    if(GetSet.getPrescriptionPreviewFromOrderMedicine() == true) {
      this.isHide = true;
    } else {
      this.isHide = false;
    }
     //Working on app/issues/1970
    if(this.admissionRefNo==null){
      this.getPrescriptionByAppRefNo();
    }
    else{
      this.getPrescriptionByAdmissionRefNoAndPrescriptionRefNo();
    }
     //End Working on app/issues/1970
    this.route.paramMap.subscribe((params: ParamMap) => {

      let appointmentRefNo = params.get('appointmentRefNo');
    });
  }

   //Working on app/issues/1970
  getPrescriptionByAppRefNo(){
    let payload = {
      "appointmentRef": this.appRefNo
    }
    this._docService.getPrescriptionByAppoRefNoV2(payload).subscribe(data => {
    //this._docService.GetprescriptionByAppoRef(this.appRefNo).subscribe(data => {
      if(data['status']==2000){
        this.notFoundMsg ="";
        this.pk = data['data'].prescriptionRefNo;
        this.downloadDrewImageFile(data['data'].prescriptionRefNo);
        if(this.prescription) {
          data['data']['prescriptionForUserName'] = this.prescription.forUserName;
          data['data']['prescriptionForUserRefNo'] = this.prescription.userReferenceNo;
          data['data']['prescriptionFor'] = this.prescription.prescriptionFor;
        }
        if(data['data'].medicalFindingsList.length > 0 ){
          data['data'].medicalFindingsList = this.reArrangeArray(data['data'].medicalFindingsList);
        }
        this.prescriptionPreviewForm = data['data'];
        // sbis-poc/app/issues/644 start
        if(this.prescriptionPreviewForm.medicalFindingsList != null){
          let totalNoOfMedicales = this.prescriptionPreviewForm.medicalFindingsList.length;
          for(let i=0; i < totalNoOfMedicales && !this.isVitalShow; i++){
            let medical = this.prescriptionPreviewForm.medicalFindingsList[i];
            if(medical["result"] != null){
              this.isVitalShow = true;
            }
          }
        }
        // sbis-poc/app/issues/644 end
        console.log(this.prescriptionPreviewForm);
        if(this.prescriptionPreviewForm.doctor.signatureImage!=null){
          this.signatureSrc = "data:image/jpeg;base64," + this.prescriptionPreviewForm.doctor.signatureImage;
          }
        //Modified to solve issue no - 592
        if(this.prescriptionPreviewForm.doctor.headerFilePath!=null){
          this.headerImage = "data:image/jpeg;base64," + this.prescriptionPreviewForm.doctor.headerImage;
          }
          if(this.prescriptionPreviewForm.doctor.footerFilePath!=null){
          this.footerImage = "data:image/jpeg;base64," + this.prescriptionPreviewForm.doctor.footerImage;
          }
        //End Modified to solve issue no - 592  

        //Working on app/issues/1425
        if(this.prescriptionPreviewForm.uploadedFilePath!=null){
          this.uploadedPrescriptionSrc = "data:image/jpeg;base64," + this.prescriptionPreviewForm.uploadedImage;
          this.downloadPrescription(data['data'].prescriptionRefNo);
        }
        
        //End Working on app/issues/1425

        if(this.prescriptionRefNo) {
          this.prescriptionPreviewForm['prescriptionRefNo'] = this.prescriptionRefNo;
        }
        // localStorage.setItem("Medication",JSON.stringify(this.prescriptionPreviewForm));
        // Derive age from DOB
        if(data['data'].individualUserEntity.dateOfBirth != null){
          const bdate = new Date(data['data'].individualUserEntity.dateOfBirth);
          const timeDiff = Math.abs(Date.now() - bdate.getTime() );

          // app#823 - if age < 1 year show in month; if < 1 month show in days; also handle singular / plural
          let ageInDays = Math.floor(timeDiff / (1000 * 3600 * 24));
          if (ageInDays == 1)
            this.age = "1D";
          else if (ageInDays < 30)
            this.age = ageInDays + "D";
          else if (ageInDays < 60)
            this.age = "M";
          else if (ageInDays < 365)
            this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) + "M";
          else if (ageInDays <= 2*365)
            this.age = "Y";
          else
            this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + "Y";
        }
        // Formulate comma-separated qualifications and specializations
  
        let spec=[];
        let qual = []
        spec = data['data'].doctor.doctorSpecializations;
        qual = data['data'].doctor.doctorQualifications;
        
        for(let i = 0; i<spec.length; i++){
          this.doctorSpecializations.push(spec[i].specialization)
        }
  
        for(let i = 0; i<qual.length; i++){
          this.doctorQualifications.push(qual[i].qualificationShort);
          
        }
        this.specializations = this.doctorSpecializations.join(', ')
  
        this.qualifications = this.doctorQualifications.join(', ')
      }
      else{
        this.prescriptionPreviewForm = null;
        this.notFoundMsg = "Prescription not found";
        document.getElementById('download-ico').style.visibility = "hidden";
        document.getElementById('print-ico').style.visibility = "hidden";
      }
    
    },(error) => {
      alert("Internal Server Error");
      return;
    });
  }

  getPrescriptionByAdmissionRefNoAndPrescriptionRefNo(){
    let payload = {
      "prescriptionRefNo": this.prescriptionRefNo,
      "admissionRefNo": this.admissionRefNo,
    }
    this._docService.getPrescriptionByAdmisionOrAppointmentAndPrescriptionRefNo(payload).subscribe(data => {
      if(data['status']==2000){
        this.notFoundMsg ="";
        this.pk = data['data'].prescriptionRefNo;
        this.downloadDrewImageFile(data['data'].prescriptionRefNo);
        if(this.prescription) {
          data['data']['prescriptionForUserName'] = this.prescription.forUserName;
          data['data']['prescriptionForUserRefNo'] = this.prescription.userReferenceNo;
          data['data']['prescriptionFor'] = this.prescription.prescriptionFor;
        }
        if(data['data'].medicalFindingsList.length > 0 ){
          data['data'].medicalFindingsList = this.reArrangeArray(data['data'].medicalFindingsList);
        }
        this.prescriptionPreviewForm = data['data'];
        // sbis-poc/app/issues/644 start
        if(this.prescriptionPreviewForm.medicalFindingsList != null){
          let totalNoOfMedicales = this.prescriptionPreviewForm.medicalFindingsList.length;
          for(let i=0; i < totalNoOfMedicales && !this.isVitalShow; i++){
            let medical = this.prescriptionPreviewForm.medicalFindingsList[i];
            if(medical["result"] != null){
              this.isVitalShow = true;
            }
          }
        }
        // sbis-poc/app/issues/644 end
        console.log(this.prescriptionPreviewForm);
        if(this.prescriptionPreviewForm.doctor.signatureImage!=null){
          this.signatureSrc = "data:image/jpeg;base64," + this.prescriptionPreviewForm.doctor.signatureImage;
          }
        //Modified to solve issue no - 592
        if(this.prescriptionPreviewForm.doctor.headerFilePath!=null){
          this.headerImage = "data:image/jpeg;base64," + this.prescriptionPreviewForm.doctor.headerImage;
          }
          if(this.prescriptionPreviewForm.doctor.footerFilePath!=null){
          this.footerImage = "data:image/jpeg;base64," + this.prescriptionPreviewForm.doctor.footerImage;
          }
        //End Modified to solve issue no - 592  

        //Working on app/issues/1425
        if(this.prescriptionPreviewForm.uploadedFilePath!=null){
          this.uploadedPrescriptionSrc = "data:image/jpeg;base64," + this.prescriptionPreviewForm.uploadedImage;
          this.downloadPrescription(data['data'].prescriptionRefNo);
        }
        
        //End Working on app/issues/1425

        if(this.prescriptionRefNo) {
          this.prescriptionPreviewForm['prescriptionRefNo'] = this.prescriptionRefNo;
        }
        // localStorage.setItem("Medication",JSON.stringify(this.prescriptionPreviewForm));
        // Derive age from DOB
        if(data['data'].individualUserEntity.dateOfBirth != null){
          const bdate = new Date(data['data'].individualUserEntity.dateOfBirth);
          const timeDiff = Math.abs(Date.now() - bdate.getTime() );

          // app#823 - if age < 1 year show in month; if < 1 month show in days; also handle singular / plural
          let ageInDays = Math.floor(timeDiff / (1000 * 3600 * 24));
          if (ageInDays == 1)
            this.age = "1D";
          else if (ageInDays < 30)
            this.age = ageInDays + "D";
          else if (ageInDays < 60)
            this.age = "M";
          else if (ageInDays < 365)
            this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) + "M";
          else if (ageInDays <= 2*365)
            this.age = "Y";
          else
            this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + "Y";
        }
        // Formulate comma-separated qualifications and specializations
  
        let spec=[];
        let qual = []
        spec = data['data'].doctor.doctorSpecializations;
        qual = data['data'].doctor.doctorQualifications;
        
        for(let i = 0; i<spec.length; i++){
          this.doctorSpecializations.push(spec[i].specialization)
        }
  
        for(let i = 0; i<qual.length; i++){
          this.doctorQualifications.push(qual[i].qualificationShort);
          
        }
        this.specializations = this.doctorSpecializations.join(', ')
  
        this.qualifications = this.doctorQualifications.join(', ')
      }
      else{
        this.prescriptionPreviewForm = null;
        this.notFoundMsg = "Prescription not found";
        document.getElementById('download-ico').style.visibility = "hidden";
        document.getElementById('print-ico').style.visibility = "hidden";
      }
    
    },(error) => {
      alert("Internal Server Error");
      return;
    });
  }
   //End Working on app/issues/1970

  downloadPrescription(prescriptionRefNo) {
    let query = {
      'downloadFor': SBISConstants.DOCUMENT_TYPE_CONST.PRESCRIPTION,
      'documentRefNo': prescriptionRefNo
    }
    this.individualService.prescriptionDownload(query).subscribe((result) => {
      if (result.status != 2000) {
        this.toastService.showI18nToast("Right now unable to view this prescription", "info");
        return;
      }

      this.download.contentType = result.data.contentType;
      this.download.downloadImageSrc = "data:" + result.data.contentType + ";base64," + result.data.data;
    });
  }

  //method to rearrange the array
  reArrangeArray(arrayToBeSorted): any[]{
    //to rearrange the dia and sys value of the array
    let findIndexForSys =  arrayToBeSorted.findIndex(x=> x.systemCode == 'L833');
    let findIndexForDia = arrayToBeSorted.findIndex(x=> x.systemCode == 'L722');
    if(findIndexForSys != -1 && findIndexForDia != -1)
     [ arrayToBeSorted[findIndexForDia],arrayToBeSorted[findIndexForSys]]=[ arrayToBeSorted[findIndexForSys],arrayToBeSorted[findIndexForDia]]
  
     return arrayToBeSorted;
  }//end of method

  goToOrderMedicine(){
    GetSet.setPrescriptionPk(this.prescriptionPreviewForm.prescriptionRefNo);
    if(this.modalRef){
      this.modalRef.hide();
    }
    localStorage.setItem("Medication",JSON.stringify(this.prescriptionPreviewForm));
    this.router.navigate(['individual/order-medicine'])
   
  }

  handelPrePrinted(e){
    if (e.target.checked) {
      this.preprinted = "Y";
    }
    else{
      this.preprinted = "N";
    }
  }

  lat : number =  34.052235;
  long: number = -118.243683;
  chamberName: string;
  chamberAddress: string;
  //method to display google map location
  displayGoogleMapLocationInModal( doctorchamber ){
    this.chamberName = doctorchamber.hospitalName;
    this.chamberAddress = doctorchamber.line1 + " "+ doctorchamber.line2? doctorchamber.line2 : '' +" "+ doctorchamber.city;
    this.modalRef = this.bsModalService.show(this.googleMapLocation, { class: 'modal-lg' });
  }

  goToBookDiagnostics() {
    if(this.modalRef){
      this.modalRef.hide();
    }
    GetSet.setDiagnosticsFromPrescription(this.prescriptionPreviewForm);
    //localStorage.setItem("Medication",JSON.stringify(this.prescriptionPreviewForm));
    this.router.navigate(['individual/book-diagnostics']);
  }

  //method to downlad file
  downloadDrewImageFile(prescriptionRefNo){
    let query = {
      'downloadFor': 'DOCTOR_PRESCRIPTION_DRAW',
      'prescriptionRefNo': prescriptionRefNo
    }
    this._individualService.prescriptionDownload(query).subscribe((result) => {
      if (result.status != 2000) {
        return;
      }
      this.download.contentType = result.data.contentType;
      this.download.downloadImageSrc = "data:" + result.data.contentType + ";base64," + result.data.data;
    });
    // this.downloadFile();
  }//end of method

  downloadFile() {
    //this.download.downloadImageSrc = this.uploadedPrescriptionSrc;
    const link = document.createElement('a');
    link.href = this.download.downloadImageSrc;
    link.download = this.download.forUserName.replace(/\./g, '_') + "_" + this.download.doctorName.replace(/\./g, '_');
    link.click();
  }

  printFile(){
    this.download.downloadImageSrc = this.uploadedPrescriptionSrc;
    
    var file = new Blob([this.uploadedPrescriptionSrc], {type: 'application/pdf'});
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
  }
}

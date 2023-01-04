import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DoctorService } from '../../../doctor/doctor.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DeliveryService } from '../../../delivery/delivery.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SBISConstants } from '../../../../SBISConstants';
import { HttpResponse, HttpRequest, HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-verify-form',
  templateUrl: './verify-form.component.html',
  styleUrls: ['./verify-form.component.css']
})
export class VerifyFormComponent implements OnInit {
  
  @Input() docInfo:any;
  @Input() index:any;
  @Output() emitResponse = new EventEmitter<Boolean>();
  verificationForm: FormGroup;
  resonList: any = [];
  submitted:boolean = false;
  fileName: any;
  domSanitizer: any;
  idForFile: any;
  ifRejected: boolean =false;
  user: any;
  
  
  constructor(
    private _doctorService: DoctorService,
    private _toastService: ToastService,
    private _deliveryService: DeliveryService,
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.fileName = "";
    this.idForFile = "uploadArtifact"+this.index;
    this.createVerificationForm();
    this.getReasonList();
  }

  createVerificationForm(){
    this.verificationForm = this.fb.group({
      approvalStatus: [null],
      reasonCode: [null, Validators.required],
      file: [null]
    })
  }
  getReasonList(){
    this._deliveryService.getReasonList(SBISConstants.DR_CONST.DR_REG_VERIFICATION).subscribe(data => {
      if(data['status']=='2000'){
        this.resonList = data.data;
      }
    });
  }
  setApprovalStatus(approvalStatus){
    if(approvalStatus == "APPROVED" ){
      this.ifRejected = false;
      this.verificationForm.patchValue({
        approvalStatus: "APPROVED"
      })
      this.verificationForm.get('reasonCode').clearValidators();
      this.verificationForm.get('reasonCode').setErrors(null);
      this.verificationForm.get('reasonCode').reset();
    }
    else{
      this.ifRejected = true;
      this.verificationForm.patchValue({
        approvalStatus: "REJECTED"
      })
    }
  }

  saveVerificationForm(){
    this.submitted = true;
    if(this.fileName == ""){
      return;
    }
    if(this.verificationForm.valid){
      console.log(this.docInfo);
      let valueData = this.verificationForm.value;
      let formdata = new FormData();
      
      let documentDtoList = JSON.stringify({
          "doctorRefNo": this.docInfo.doctorRefNo,
          "approvalStatus": valueData.approvalStatus,
          "reasonCode": valueData.reasonCode,
          "approvalRejectedBy": this.user.userId,
          "fileUploadFor": "ARTIFACTS",
     });

      formdata.append('file', valueData.file);
      formdata.append('document', documentDtoList);
      this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this._toastService.showI18nToast("Verification Status updated successfully","success");
          this.emitResponse.emit(true);
          
        } else {
          this._toastService.showI18nToast(response.message, 'error')
        }

      }
    });
      
    }
  }

  
  saveDocument(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
     // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
   
  }

  selectSingleFile(event: any) {
    const file = event.target.files[0];
    if((file.type == "image/jpeg") || (file.type == "application/pdf")) {
      //do nothing
    } else {
      this._toastService.showI18nToast("File type should be jpg/pdf", "warning");
      return;
    }
    
    if (Math.round(file.size / 1024) > 140) {
      document.getElementById(this.idForFile)["value"] = "";
      this.verificationForm.patchValue({
        file: null
      });
      this.fileName = "";
      this._toastService.showI18nToast("Uploaded file should be less than 140 KB", "warning");
      return;
    }
    
    if (file) {
      this.verificationForm.patchValue({
        file: event.target.files[0]
      });
      this.fileName = file.name; 
    }
  }

  closeSingleFile() {
    this.fileName = "";
  }

}

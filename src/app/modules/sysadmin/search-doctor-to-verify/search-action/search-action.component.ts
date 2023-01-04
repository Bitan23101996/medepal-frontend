import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DoctorService } from '../../../doctor/doctor.service';
import { ToastService } from '../../../../core/services/toast.service';
import { DeliveryService } from '../../../delivery/delivery.service';
import { HttpClient } from '@angular/common/http';
import { SBISConstants } from '../../../../SBISConstants';

@Component({
  selector: 'app-search-action',
  templateUrl: './search-action.component.html',
  styleUrls: ['./search-action.component.css']
})
export class SearchActionComponent implements OnInit {

  @Input() docInfo:any;
  @Input() index:any;
  @Output() emitResponse = new EventEmitter<Boolean>();
  searchActionForm: FormGroup;
  resonList: any = [];
  submitted:boolean = false;
  fileName: any;
  domSanitizer: any;
  idForFile: any;
  ifRejected: boolean =false;
  user: any;
  verificationHistoryList: any = [];
  
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
    this.createSearchActionForm();
    this.getReasonList();
  }
  createSearchActionForm(){
    this.searchActionForm = this.fb.group({
      approvalStatus: [null],
      reasonCode: [null, Validators.required],
      //file: [null]
    })
  }
  getReasonList(){
    this._deliveryService.getReasonList(SBISConstants.DR_CONST.DR_REG_VERIFICATION).subscribe(data => {
      if(data['status']=='2000'){
        this.resonList = data.data;
      }
    });
  }

  saveSearchActionForm(status){
    this.submitted = true;
    if(status=="REVOKED" || status=="REJECTED"){
      this.ifRejected = true;
    }
    else{
      this.ifRejected = false;
    }
    if(this.searchActionForm.valid || status=="APPROVED"){
      let payload = {
          "doctorRefNo": this.docInfo.doctorRefNo,
          "approvalStatus": status,
          "reasonCode": this.searchActionForm.value.reasonCode,
          "approvalRejectedBy": this.user.userId,
      }
      this._doctorService.saveDoctorRegistrationVerificationHistory(payload).subscribe(res => {
        if(res['status']=='2000'){
          this._toastService.showI18nToast("Verification Status updated successfully","success");
          this.emitResponse.emit(true);
        }
           
           
      });
    }
  }

  getHistory(docInfo){
    let payload = {
      "doctorRef" : docInfo.doctorRefNo
    }
    this._doctorService.getDoctorRegistrationVerificationHistory(payload).subscribe(data => {
      if(data['status']=='2000'){
        this.verificationHistoryList = data.data;
      }
    });
  }

}

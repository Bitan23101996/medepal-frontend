import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliveryService } from '../../delivery.service';
import { ToastService } from '../../../../core/services/toast.service';
import { environment } from '../../../../../environments/environment';
import { SBISConstants } from 'src/app/SBISConstants';

@Component({
  selector: 'app-ofd-form',
  templateUrl: './ofd-form.component.html',
  styleUrls: ['./ofd-form.component.css']
})
export class OfdFormComponent implements OnInit {

  @Input() orderData:any;
  @Input() fromList:any;
  @Output() emitResponse = new EventEmitter<Boolean>();
  ofdForm: FormGroup;
  submitted:boolean = false;
  dateFormat: any;
  minDate: Date;
  ofdDeliveryFlag: boolean;
  resonList : any;

  constructor(private fb: FormBuilder,
              private _deliveryService: DeliveryService,
              private toastService: ToastService) { }

  ngOnInit() {
    this.dateFormat=environment.DATE_FORMAT;
    this.minDate = new Date();
    this.ofdDeliveryFlag = true;
    this.ofdForm = this.fb.group({
      deliveryStatus:[SBISConstants.DELIVERY_CONST.DELIVERED],
      actualDelivery: [null],
      receivedBy:  [null],
      deliveredBy:  [null],
      reasonCode: [null]
    })

    this._deliveryService.getReasonList(SBISConstants.DELIVERY_CONST.ATTEMPTED).subscribe(data => {
      console.log(data);   
      if(data['status']=='2000'){
        this.resonList = data.data;
      }
      console.log("****************");
      console.log(this.resonList);      
    });
  }

  setDeliveryState(deliveryState){
      if(deliveryState=='DLV'){
        this.ofdDeliveryFlag = true;
      }
      else{
        this.ofdDeliveryFlag = false;
      }
  }

  saveOfdToDelivery(){
    this.submitted = true;
    if(this.ofdDeliveryFlag){
      this.ofdForm.patchValue({
        deliveryStatus: SBISConstants.DELIVERY_CONST.DELIVERED,
        reasonCode: null
      })

      this.ofdForm.controls['deliveredBy'].setValidators([Validators.required]);
      this.ofdForm.controls['deliveredBy'].updateValueAndValidity();
      this.ofdForm.controls['actualDelivery'].setValidators([Validators.required]);
      this.ofdForm.controls['actualDelivery'].updateValueAndValidity();
      this.ofdForm.controls['receivedBy'].setValidators([Validators.required]);
      this.ofdForm.controls['receivedBy'].updateValueAndValidity();
      this.ofdForm.get('reasonCode').setValidators([]);
      this.ofdForm.get('reasonCode').updateValueAndValidity();
    }
    else{
      this.ofdForm.patchValue({
        deliveryStatus: SBISConstants.DELIVERY_CONST.ATTEMPTED,
        actualDelivery: null,
        receivedBy:  null,
        deliveredBy:  null,
      })

      this.ofdForm.get('deliveredBy').setValidators([]);
      this.ofdForm.get('deliveredBy').updateValueAndValidity();
      this.ofdForm.get('actualDelivery').setValidators([]);
      this.ofdForm.get('actualDelivery').updateValueAndValidity();
      this.ofdForm.get('receivedBy').setValidators([]);
      this.ofdForm.get('receivedBy').updateValueAndValidity();
      this.ofdForm.controls['reasonCode'].setValidators([Validators.required]);
      this.ofdForm.controls['reasonCode'].updateValueAndValidity();
    }
    if(this.ofdForm.valid){
      console.log(this.ofdForm.value);
      let payload = {};
      payload = {
        deliveryRefNo: this.orderData.deliveryRefNo,
        entityRequitionRefNo: this.orderData.entityRequitionRefNo,
        actualDelivery: this.ofdForm.value.actualDelivery,
        deliveryStatus: this.ofdForm.value.deliveryStatus,
        receivedBy: this.ofdForm.value.receivedBy,
        deliveredBy: this.ofdForm.value.deliveredBy,
        reasonCode: this.ofdForm.value.reasonCode,
        workflowId: "MED_ORDER",
        entityType : "pharmacy",
        entityOrderRefNo: this.orderData.entityOrderRefNo
      }
      console.log("*************");
      console.log(payload);
      this._deliveryService.saveDelivery(payload).subscribe(res => {
        if(res['status']=='2000')
          this.toastService.showI18nToast(res['message'],"success");
          if(this.fromList){
            this.emitResponse.emit(this.fromList);
          }
          else{
            this.emitResponse.emit(this.fromList);
          }
      });
    }
  }

}

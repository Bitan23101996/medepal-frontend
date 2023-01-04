import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SBISConstants } from '../../../../SBISConstants';
import { environment } from '../../../../../environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeliveryService } from '../../delivery.service';
import { ToastService } from '../../../../core/services/toast.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sample-received',
  templateUrl: './sample-received.component.html',
  styleUrls: ['./sample-received.component.css']
})
export class SampleReceivedComponent implements OnInit {

  
  @Input() orderData:any;
  @Input() fromList:any;
  @Output() emitResponse = new EventEmitter<Boolean>();
  labDeliveryForm: FormGroup;
  submitted:boolean = false;
  dateFormat: any;
  minDate: Date;

  constructor(private fb: FormBuilder,
    private _deliveryService: DeliveryService,
    private toastService: ToastService) { }

  ngOnInit() {
    this.dateFormat=environment.DATE_FORMAT;
    this.minDate = new Date();
    let timeNow = moment(this.minDate).format('HH:mm');
    this.labDeliveryForm = this.fb.group({
      collectionRcvDate: [this.minDate],
      collectionRcvTime: [timeNow]
    })
  }

  saveDeliveryStep(){
    this.submitted = true;
    if(this.labDeliveryForm.valid){
      let deliveryEventDate = this.labDeliveryForm.value.collectionRcvDate;
      let deliveryEventTime = this.labDeliveryForm.value.collectionRcvTime;
  
      let date = deliveryEventDate.getFullYear() + '-' + ('0' + (deliveryEventDate.getMonth() + 1)).slice(-2) + '-' + ('0' + deliveryEventDate.getDate()).slice(-2);
      let deliveryEventDateTimeStr = date+" "+deliveryEventTime+":00";
      //let expDeliveryDt = this.labDeliveryForm.value.expectedDelivery.split("-");
      let payload = {};
      payload = {
        deliveryRefNo: this.orderData.deliveryRefNo,
        entityRequitionRefNo: this.orderData.entityRequitionRefNo,
        deliveryStatus: SBISConstants.LAB_DELIVERY_CONST.SAMPLE_RECEIVED_LAB,
        // expectedDelivery: expDeliveryDt[2]+"-"+expDeliveryDt[1]+"-"+expDeliveryDt[0],
        //deliveryEventDateTime: this.labDeliveryForm.value.collectionRcvDate,
        deliveryEventDateTimeStr: deliveryEventDateTimeStr,
        workflowId: 'LABTEST_ORDER',
        entityOrderRefNo: this.orderData.entityOrderRefNo,
        entityType: 'lab'
      }
      console.log(payload);
      this._deliveryService.saveDelivery(payload).subscribe(res => {
        if(res['status']=='2000'){
          this.toastService.showI18nToast(res['message'],"success");
          if(this.fromList){
            this.emitResponse.emit(this.fromList);
          }
          else{
            this.emitResponse.emit(this.fromList);
          }
        } 
      });
    }
  }
}

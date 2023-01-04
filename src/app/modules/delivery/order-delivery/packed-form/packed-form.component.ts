import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DeliveryService } from '../../delivery.service';
import { ToastService } from '../../../../core/services/toast.service';
import { environment } from '../../../../../environments/environment';
import { SBISConstants } from 'src/app/SBISConstants';


@Component({
  selector: 'app-packed-form',
  templateUrl: './packed-form.component.html',
  styleUrls: ['./packed-form.component.css']
})
export class PackedFormComponent implements OnInit {

  @Input() orderData:any;
  @Input() fromList:any;
  @Output() emitResponse = new EventEmitter<Boolean>();
  packedForm: FormGroup;
  submitted:boolean = false;
  dateFormat: any;
  minDate: Date;

  constructor(private fb: FormBuilder,
    private _deliveryService: DeliveryService,
    private toastService: ToastService) { }

  ngOnInit() {
    this.dateFormat=environment.DATE_FORMAT;
    this.minDate = new Date();
    this.packedForm = this.fb.group({
      expectedDelivery: [null],
      agentName: [null],
      agentContact: [null]
    })
  }

  savePackedToOutForDelivery(){
    this.submitted = true;
    if(this.packedForm.valid){
      //let expDeliveryDt = this.packedForm.value.expectedDelivery.split("-");
      let payload = {};
      payload = {
        deliveryRefNo: this.orderData.deliveryRefNo,
        entityRequitionRefNo: this.orderData.entityRequitionRefNo,
        deliveryStatus: SBISConstants.DELIVERY_CONST.OUT_FOR_DELIVERY,
        // expectedDelivery: expDeliveryDt[2]+"-"+expDeliveryDt[1]+"-"+expDeliveryDt[0],
        expectedDelivery: this.packedForm.value.expectedDelivery,
        dlvAgentName: this.packedForm.value.agentName,
        dlvAgentContactNo: this.packedForm.value.agentContact,
        workflowId: "MED_ORDER",
        entityType : "pharmacy",
        entityOrderRefNo: this.orderData.entityOrderRefNo
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

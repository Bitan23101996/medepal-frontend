import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { SBISConstants } from '../../../../SBISConstants';
import { environment } from '../../../../../environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeliveryService } from '../../delivery.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-assign-collector',
  templateUrl: './assign-collector.component.html',
  styleUrls: ['./assign-collector.component.css']
})
export class AssignCollectorComponent implements OnInit {

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
    this.labDeliveryForm = this.fb.group({
      agentName: [null],
      agentContact: [null]
    })
  }

  saveDeliveryStep(){
    this.submitted = true;
    if(this.labDeliveryForm.valid){
      //let expDeliveryDt = this.labDeliveryForm.value.expectedDelivery.split("-");
      let payload = {};
      payload = {
        deliveryRefNo: this.orderData.deliveryRefNo,
        entityRequitionRefNo: this.orderData.entityRequitionRefNo,
        deliveryStatus: SBISConstants.LAB_DELIVERY_CONST.ASSIGN_COLLECTOR,
        // expectedDelivery: expDeliveryDt[2]+"-"+expDeliveryDt[1]+"-"+expDeliveryDt[0],
        dlvAgentName: this.labDeliveryForm.value.agentName,
        dlvAgentContactNo: this.labDeliveryForm.value.agentContact,
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

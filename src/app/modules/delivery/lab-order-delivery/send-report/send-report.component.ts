import { Component, OnInit, EventEmitter, Output, Input, DoCheck, OnDestroy } from '@angular/core';
import { SBISConstants } from '../../../../SBISConstants';
import { environment } from '../../../../../environments/environment.prod';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DeliveryService } from '../../delivery.service';
import { ToastService } from '../../../../core/services/toast.service';
import { GetSet } from "../../../../core/utils/getSet";
import * as moment from 'moment';

@Component({
  selector: 'app-send-report',
  templateUrl: './send-report.component.html',
  styleUrls: ['./send-report.component.css']
})
export class SendReportComponent implements OnInit, DoCheck, OnDestroy {


  @Input() orderData: any;
  @Input() fromList: any;
  @Output() emitResponse = new EventEmitter<Boolean>();
  labDeliveryForm: FormGroup;
  submitted: boolean = false;
  dateFormat: any;
  minDate: Date;
  showDiagnosticsTestReport: boolean = false;
  patientPrescriptionDetail: any = {};
  medicalDiagnosticDetailsData: any;

  constructor(private fb: FormBuilder,
    private _deliveryService: DeliveryService,
    private toastService: ToastService) { }

  ngOnInit() {
    this.dateFormat = environment.DATE_FORMAT;
    this.minDate = new Date();
    let timeNow = moment(this.minDate).format('HH:mm');
    this.labDeliveryForm = this.fb.group({
      reportSendingDate: [this.minDate],
      reportSendingTime: [timeNow]
    });
    GetSet.setIsLabOrderSendReport(true);
  }

  ngDoCheck() {
    if(GetSet.getSaveDelivery()) {
      console.log('Its working');
      let deliveryEventDate = this.labDeliveryForm.value.reportSendingDate;
      let deliveryEventTime = this.labDeliveryForm.value.reportSendingTime;

      let date = deliveryEventDate.getFullYear() + '-' + ('0' + (deliveryEventDate.getMonth() + 1)).slice(-2) + '-' + ('0' + deliveryEventDate.getDate()).slice(-2);
      let deliveryEventDateTimeStr = date + " " + deliveryEventTime + ":00";
      let query = {
        deliveryRefNo: this.orderData.deliveryRefNo,
        entityRequitionRefNo: this.orderData.entityRequitionRefNo,
        deliveryStatus: SBISConstants.LAB_DELIVERY_CONST.SEND_REPORT,
        deliveryEventDateTimeStr: deliveryEventDateTimeStr,
        workflowId: 'LABTEST_ORDER',
        entityOrderRefNo: this.orderData.entityOrderRefNo,
        entityType: 'lab'
      }
      this.saveDelivery(query);
      GetSet.setSaveDelivery(false);
      query = null;
    }
  }

  ngOnDestroy() {
    GetSet.setMedicalFindingsDetailsForLabAdmin(false);
  }

  saveDeliveryStep() {
    this.submitted = true;
    if (this.labDeliveryForm.valid) {
      this.patientPrescriptionDetail['name'] = this.orderData.requestBy;
      let lastIndex = this.orderData.entityRequestDetailList.length -1;
     let prescriptionRefNo;
     if(this.orderData.entityRequestDetailList[lastIndex].prescriptionRefNo) {
      prescriptionRefNo = this.orderData.entityRequestDetailList[lastIndex].prescriptionRefNo;
     } else {
      prescriptionRefNo = 'null';
     }

      this.patientPrescriptionDetail['prescriptionRefNo'] = prescriptionRefNo;
      this.patientPrescriptionDetail['refNo'] = this.orderData.entityRequestDetailList[lastIndex].userRefNo;
      let date = new Date(this.orderData.requisitionRcvDatetime);
      let dateStr = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
      
      let medicalAttributeData = {
        'medicalAttributeName': this.orderData.entityRequestDetailList[lastIndex].productName,
        'result': this.orderData.entityRequestDetailList[lastIndex].result,
        'dateStr': dateStr
      }
      
      this.medicalDiagnosticDetailsData = medicalAttributeData;
      GetSet.setMedicalFindingsDetailsForLabAdmin(true);
      GetSet.setTriggerPkForLab(this.orderData.entityRequestDetailList[lastIndex].entityRequisitionDetailPk);
      GetSet.setIsLabOrderSendReport(true);
      this.showDiagnosticsTestReport = true;
    }
  }

  saveDelivery(payload) {
    this._deliveryService.saveDelivery(payload).subscribe(res => {
      if (res['status'] == '2000') {
        //this.toastService.showI18nToast(res['message'], "success");
        GetSet.setRetrieveOrderListForDelivery(true);
        if (this.fromList) {
          this.emitResponse.emit(this.fromList);
        }
        else {
          this.emitResponse.emit(this.fromList);
        }
      }
    });
  }

  //close diagnostics edit modal
  medicalDetailsClose(){
    this.showDiagnosticsTestReport = false;
  }//end of method

}

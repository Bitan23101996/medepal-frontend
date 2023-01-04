import { Component, OnInit, Input } from '@angular/core';
import { GetSet } from '../../../core/utils/getSet';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { SBISConstants } from '../../../SBISConstants';

@Component({
  selector: 'app-confirmation-page',
  templateUrl: './confirmation-page.component.html',
  styleUrls: ['./confirmation-page.component.css']
})
export class ConfirmationPageComponent implements OnInit {
  @Input('paymentState') paymentState: string;
  @Input('confirmationMsg') confirmationMsg: any;
  @Input('buttonName') actionButtonName: string;
  @Input('buttonTwoName') actionButtonTwoName: string;
  @Input('paymentFor') paymentFor: string;
  @Input('headerText') headerText: string;

  appointmentResp: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private broadcastService: BroadcastService,
  ) { 
    let action = this.activatedRoute.snapshot.paramMap.get("confirmationFor");
  }

  ngOnInit() {
    GetSet.setPaymentRetryBoolean('');
    this.appointmentResp = GetSet.getAppointmentState();
  }

  routeToPage() {
    if(this.paymentFor == "ADD_USER_OPD") {
      GetSet.setAddAnotherUserBoolean(false);
    } else {
      //do nothing
    }
    this.router.navigate([SBISConstants.ROUTE_URL_JSON[this.paymentFor]]);
  }

  routeToRetryPage() {
    if(this.paymentFor == "ADD_USER_OPD") {
      GetSet.setAddAnotherUserBoolean(true);
      this.router.navigate([SBISConstants.ROUTE_URL_JSON[this.paymentFor]]);
    } else if(this.paymentFor == "ADD_ASSISTANT") {
      GetSet.setAddAnotherAssistantBoolean(true);
      this.router.navigate([SBISConstants.ROUTE_URL_JSON[this.paymentFor]]);
    } else {
      GetSet.setPaymentRetryBoolean(SBISConstants.PAYMENT_FOR[this.paymentFor]);
      this.router.navigate([SBISConstants.ROUTE_RETRY_URL_JSON.RAZOR_PAY]);
    }
  }

}

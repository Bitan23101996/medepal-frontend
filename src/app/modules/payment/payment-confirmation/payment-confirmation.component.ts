import { Component, OnInit } from '@angular/core';
import { GetSet } from '../../../core/utils/getSet';

@Component({
  selector: 'app-payment-confirmation',
  templateUrl: './payment-confirmation.component.html',
  styleUrls: ['./payment-confirmation.component.css']
})
export class PaymentConfirmationComponent implements OnInit {

  paymentState: string;
  confirmationMsg: any = [];
  buttonName: string;
  paymentFor: string;
  headerText: string;
  buttonTwoName: string;

  constructor() { 
    let confirmationInfo = GetSet.getConfirmationInfo();
    this.paymentState = confirmationInfo.paymentState;
    this.confirmationMsg = confirmationInfo.confirmationMsg;
    this.buttonName = confirmationInfo.buttonName;
    this.paymentFor = confirmationInfo.paymentFor;
    this.headerText = confirmationInfo.headerText;
    this.buttonTwoName = confirmationInfo.buttonTwoName;
  }

  ngOnInit() {
  }

}

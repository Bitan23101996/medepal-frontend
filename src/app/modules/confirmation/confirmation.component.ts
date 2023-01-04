import { Component, OnInit } from '@angular/core';
import { GetSet } from '../../core/utils/getSet';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent implements OnInit {

  paymentState: string;
  confirmationMsg: any = [];
  buttonName: string;
  paymentFor: string;
  headerText: string;
  buttonTwoName: string;

  constructor(private router: Router) { 
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
  goToNext(){
    if(this.buttonName == "ROOM MASTER"){
      this.router.navigate(['/opd/room']);
    }
    else if(this.buttonName == "PATIENT LIST"){
      this.router.navigate(['/opd/inpatient-summary']);
    }
  }
}

import { Component, OnInit, NgZone } from '@angular/core';
import { GetSet } from '../../../core/utils/getSet';
import { PaymentService } from '../payment.service';
import { IndividualService } from '../../individual/individual.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { SBISConstants } from '../../../SBISConstants';
import { JsonTranslation } from '../../../shared/translation';

declare var Razorpay: any;
@Component({
  selector: 'app-razor-pay-payment',
  templateUrl: './razor-pay-payment.component.html',
  styleUrls: ['./razor-pay-payment.component.css']
})
export class RazorPayPaymentComponent implements OnInit {

  placeOrderData: any;
  transactionType: any;
  responseData: any = {};
  razorpay_order_id: any;
  appointmentData: any;
  isAdvancePayment: boolean;
  appointmentResp: any;
  confirmationMsg: any = [];
  userDetails: any;
  myAppointmentResponse: any;

  constructor(
    private ngZone: NgZone,
    private PaymentService: PaymentService,
    private individualService: IndividualService,
    private broadcastService: BroadcastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private jsonTranslate: JsonTranslation
  ) {
  }

  ngOnInit() {
    this.transactionType = GetSet.getTransactionType();
    this.appointmentResp = GetSet.getAppointmentState();
    this.myAppointmentResponse = GetSet.getAppointmentResp();
    this.getUserDetails();
    this.razorPay();
  }

  getUserDetails() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.individualService.getUserFullProfile(user.refNo).subscribe(userResp => {
      if (userResp.status == 2000) {
        this.userDetails = userResp.data;
      }
    });
  }

  razorPay() {
    let paymentObj;
    if (this.transactionType == 'PHARMACY' || this.transactionType == 'DIAGNOSTICS') {
      this.placeOrderData = GetSet.getPlaceOrderData();
      paymentObj = {
        'orderRefNo': this.placeOrderData.orderRefNo,
        'paymentMode': "RAZORPAY",
        'transactionTypeEnum': this.transactionType
      };
    } else if (this.transactionType == 'APPOINTMENT') {
      this.appointmentData = GetSet.getAppointmentPaymentData();
      paymentObj = {
        'triggerPk': this.appointmentData.appointmentPk,
        'paymentMode': 'RAZORPAY',
        'transactionTypeEnum': this.transactionType,
        'grossAmount': this.appointmentData.payableAmount,
        'tax': this.appointmentData.tax,
        'netAmount': this.appointmentData.netAmount,
        'discount': this.appointmentData.discount,
        'appointmentRefNo': this.appointmentData.appointmentRefNo
      }
      this.isAdvancePayment = GetSet.getAdvancePay();
      if (this.isAdvancePayment) {
        paymentObj['forAdvancePayment'] = this.isAdvancePayment;
      } else {
        paymentObj['forAdvancePayment'] = this.isAdvancePayment;
      }
    }
    this.PaymentService.paymentInitiateV2(paymentObj).subscribe((resp: any) => {
      if (resp && resp.status == 2000) {
        this.responseData = resp.data;

        let txnamount = parseInt(this.responseData.txnamount);
        // console.log("txnamount:"+txnamount);

        if (txnamount <= 0) {

          if (this.transactionType == 'PHARMACY') {
            this.broadcastService.setHeaderOrderItem();
            let url: string = "/individual/my-order";
            // this.router.navigate([url]);
            this.ngZone.run(async () => this.router.navigate([url])).then();
          }
          else if (this.transactionType == 'DIAGNOSTICS') {
            let url: string = "/individual/my-diagnostics";
            this.ngZone.run(async () => this.router.navigate([url])).then();
          }
          else if (this.transactionType == 'APPOINTMENT') {
            this.router.navigate(["appoinment"]);
          }
          return;
        } else {
          let razor_pay_options = {
            name: 'MEDePal',
            description: resp.data.paymentFor,
            theme: {
              color: "#582491"
            },
            handler: this.paymentResponseHander.bind(this),
            "modal": {
              "ondismiss": this.ondismissPaymentModal.bind(this)
            },
            // "prefill": {
            //   "name": "Gaurav Kumar",
            //   "email": "gaurav.kumar@example.com",
            //   "contact": "9999999999"
            // }             
          }
          let amount = Number(100 * this.responseData.txnamount).toFixed(2);
          razor_pay_options["amount"] = Number(amount);
          razor_pay_options["order_id"] = this.responseData.razorpay_order_id;
          razor_pay_options["key"] = this.responseData.key_id;
          let user = JSON.parse(localStorage.getItem('user'));
          this.razorpay_order_id = this.responseData.razorpay_order_id;
          if (user) {
            let prefill = {
              name: user.userName,
              email: this.userDetails.emailAddress,
              contact: this.userDetails.contactNo
            }
            razor_pay_options["prefill"] = prefill;
          }

          let rzp = new Razorpay(razor_pay_options);
          rzp.open();
        }
      }
    })

  }

  //Success Payment
  paymentResponseHander(response) {
    let query = {
      'razorpay_order_id': response.razorpay_order_id,
      'razorpay_payment_id': response.razorpay_payment_id,
      'razorpay_payment_failReason': "",
      'razorpay_payment_success': true,
      'paymentFor': this.transactionType
    }
    if (this.isAdvancePayment) {
      query['forAdvancePayment'] = this.isAdvancePayment;
    } else if (!this.isAdvancePayment) {
      query['forAdvancePayment'] = this.isAdvancePayment;
    }
    this.individualService.completeMedicinePayment(query).subscribe((resp) => {
      ;
      this.razorpay_order_id = null;
      this.broadcastService.setHeaderOrderItem();
      if (GetSet.getVideoChatData()) {
        GetSet.setVideoChatBooleanFromRazorPay(true);
        this.ngZone.run(async () => this.router.navigate(["appoinment"])).then();
      } else {
        //retry
        if (GetSet.getPaymentRetryBoolean() == 'APPOINTMENT') {
          this.confirmationMsg = [];
          if (this.myAppointmentResponse.appointmentState == 'REQ') {
            let confMsgForReq;
            if (this.myAppointmentResponse.appointmentTime) {
              confMsgForReq = this.jsonTranslate.translateJson('CONFIRMATION_MSG.APPOINTMENT_RQST_WITH_DOC') + this.myAppointmentResponse.doctorName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ON') + this.myAppointmentResponse.appointmentDate + this.jsonTranslate.translateJson('CONFIRMATION_MSG.AT') + this.myAppointmentResponse.appointmentTime.slice(0, -3) + this.jsonTranslate.translateJson('CONFIRMATION_MSG.BEEN_SENT_TO_DOC');
            } else {
              confMsgForReq = this.jsonTranslate.translateJson('CONFIRMATION_MSG.APPOINTMENT_RQST_WITH_DOC') + this.myAppointmentResponse.doctorName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ON') + this.myAppointmentResponse.appointmentDate + this.jsonTranslate.translateJson('CONFIRMATION_MSG.BEEN_SENT_TO_DOC');
            }
            this.confirmationMsg.push(confMsgForReq);
            this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.WILL_RCV_UPDATE_NOTE'));
          } else if (this.myAppointmentResponse.appointmentState == 'CON') {
            let confMsgForCon = this.jsonTranslate.translateJson('CONFIRMATION_MSG.APPOINTMENT_CON_WITH_DOC') + this.myAppointmentResponse.doctorName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ON') + this.myAppointmentResponse.appointmentDate + this.jsonTranslate.translateJson('CONFIRMATION_MSG.AT') + this.myAppointmentResponse.appointmentTime.slice(0, -3) + " .";
            this.confirmationMsg.push(confMsgForCon);
          }
          let confirmationInfo = {};
          confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
          confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.APPOINTMENT;
          confirmationInfo['confirmationMsg'] = this.confirmationMsg;
          confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.APPOINTMENT;
          confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.APPOINTMENT;
          // confirmationInfo['buttonTwoName'] = '';
          GetSet.setConfirmationInfo(confirmationInfo);
        } else if (GetSet.getPaymentRetryBoolean() == 'PHARMACY') {
          let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.MEDICINE_ORDER_PAID_SUCCESSFULLY');
          this.confirmationMsg.push(confMsg);
          let confirmationInfo = {};
          confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
          confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.PHARMACY;
          confirmationInfo['confirmationMsg'] = this.confirmationMsg;
          confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.PHARMACY;
          confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.PHARMACY;
          GetSet.setConfirmationInfo(confirmationInfo);
        } else if (GetSet.getPaymentRetryBoolean() == 'DIAGNOSTICS') {
          let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.DIAGNOSTICS_BOOKED');
          this.confirmationMsg.push(confMsg);
          let confirmationInfo = {};
          confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
          confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.DIAGNOSTICS;
          confirmationInfo['confirmationMsg'] = this.confirmationMsg;
          confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.DIAGNOSTICS;
          confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.DIAGNOSTICS;
          GetSet.setConfirmationInfo(confirmationInfo);
        }

        //end retry
        this.ngZone.run(async () => this.router.navigate(["confirmation"])).then();
      }
    });
  }

  //Cancel Payment
  ondismissPaymentModal() {
    let query = {
      'razorpay_order_id': this.razorpay_order_id,
      'razorpay_payment_failReason': "Dismissed By User",
      'razorpay_payment_success': false,
      'paymentFor': this.transactionType
    }
    if (this.isAdvancePayment) {
      query['forAdvancePayment'] = this.isAdvancePayment;
    } else if (!this.isAdvancePayment) {
      query['forAdvancePayment'] = this.isAdvancePayment;
    }
    this.individualService.completeMedicinePayment(query).subscribe((resp) => {
      if (GetSet.getVideoChatData()) {
        GetSet.setVideoChatBooleanFromRazorPay(false);
      }
      this.razorpay_order_id = null;
      this.broadcastService.setHeaderOrderItem();
      this.confirmationMsg = [];
      let cancelMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.PAYMENT_OF_FEES_FOR') + SBISConstants.CONFIRMATION_CANCEL_STRING[this.transactionType] + this.jsonTranslate.translateJson('CONFIRMATION_MSG.IS_FAILED');
      this.confirmationMsg.push(cancelMsg);
      let confirmationInfo = {};
      confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CANCEL;
      confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT[this.transactionType];
      confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME[this.transactionType];
      confirmationInfo['confirmationMsg'] = this.confirmationMsg;
      confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR[this.transactionType];
      confirmationInfo['buttonTwoName'] = SBISConstants.SECONDARY_ACTION_BUTTON_NAME.RETRY;
      GetSet.setConfirmationInfo(confirmationInfo);
      this.ngZone.run(async () => this.router.navigate(["confirmation"])).then();
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GetSet } from '../../../core/utils/getSet';
import { IndividualService } from "../individual.service";
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ToastService } from '../../../core/services/toast.service';
import { SBISConstants } from '../../../SBISConstants';
import { TranslateService } from '@ngx-translate/core';
import { JsonTranslation } from '../../../shared/translation';

@Component({
  selector: 'app-review-diagnostics',
  templateUrl: './review-diagnostics.component.html',
  styleUrls: ['./review-diagnostics.component.css']
})
export class ReviewDiagnosticsComponent implements OnInit {

  diagnosticsList: any;
  delivarAddress: any;
  totalAmount: number=0;
  deliveryCharge: number = 0.00;
  tax: number = 0.00;
  discount: number = 0.00;
  grandTotal: number;
  orderRefNo: string;
  diagnosticsQuery: any;
  confirmationMsg: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private individualService: IndividualService,
    private broadcastService: BroadcastService,
    private toastService: ToastService,
    private translate: TranslateService,
    private jsonTranslate: JsonTranslation
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en'); // this language will be used as a fallback when a translation isn't found in the current language
   }

  ngOnInit() {
    this.broadcastService.setHeaderText('Review Diagnostics');
    this.diagnosticsList = GetSet.getDiagnostics();
    this.delivarAddress = GetSet.getAddress();
    this.diagnosticsQuery = GetSet.getDiagnosticsQuery();
    this.totalAmount = this.diagnosticsQuery.grossAmount;
    this.deliveryCharge = this.diagnosticsQuery.deliveryCharge;
    this.tax = this.diagnosticsQuery.taxAmount;
    this.discount = this.diagnosticsQuery.discount;
    this.getGrandTotal();
  }

  getAllFeesByItem() {
    let query = {
      "itemType": "DIAGNOSTIC",
	    "amount": this.totalAmount,
	    "deliveryTypeId":"STANDARD",
    }
    this.individualService.getAllFees(query).subscribe((resp) => {
      this.deliveryCharge = (+resp.data.deliveryCharge.fees);
      this.discount = (+resp.data.discount.fees);
      for(let tax of resp.data.taxes) {
        this.tax = this.tax + (+tax.fees);
      }
      this.getGrandTotal();
    });
  }

  getGrandTotal() {
    this.grandTotal = (this.totalAmount+this.tax+this.deliveryCharge)-this.discount;
    if(this.grandTotal < 0) {
      this.grandTotal = 0;
    }
  }

  backOperation() {
    this.router.navigate(['/individual/book-diagnostics']);
  }

  placeOrder() {
    this.individualService.bookDiagnostics(this.diagnosticsQuery).subscribe(result => {
        if(result.status == 2000) {
          this.toastService.showI18nToast('Diagnostics Booked', 'success');
          //confirm page info set
          let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.DIAGNOSTICS_BOOKED');
          this.confirmationMsg.push(confMsg);
          let confirmationInfo = {};
          confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
          confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.DIAGNOSTICS;
          confirmationInfo['confirmationMsg'] = this.confirmationMsg;
          confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.DIAGNOSTICS;
          confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.DIAGNOSTICS;
          // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.DIAGNOSTICS;
          GetSet.setConfirmationInfo(confirmationInfo);
          //end of confirm page info set
          this.router.navigate(['confirmation']);
        }
    });
  }

}

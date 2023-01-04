import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { GetSet } from '../../../core/utils/getSet';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IndividualService } from '../individual.service';
import { PaymentService } from '../../payment/payment.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ModalService } from 'src/app/shared/directive/modal/modal.service';
import { ToastService } from '../../../core/services/toast.service';
import { SBISConstants } from '../../../SBISConstants';
import { JsonTranslation } from '../../../shared/translation';

declare var Razorpay: any;
@Component({
  selector: 'app-review-carted-order',
  templateUrl: './review-carted-order.component.html',
  styleUrls: ['./review-carted-order.component.css']
})
export class ReviewCartedOrderComponent implements OnInit {
  @ViewChild('someVar') el: ElementRef;


  user_id: any;
  userRefNo: any;
  cartData: any;
  delivarAddress: any;
  totalAmount: number=0;
  cartRefNumber: any;
  placeOrderData: any;
  modalRef: BsModalRef;
  paytmRespObj: any = {};
  razorpay_order_id: any;
  cardItemCount: number;
  deliveryCharge: number = 0.00;
  tax: number = 0.00;
  discount: number = 0.00;
  grandTotal: number;
  confirmationMsg: any = [];
  paymentState: string;
  buttonName: string;

  constructor(
    private apiService: ApiService,
    private broadcastService: BroadcastService,
    private router: Router,
    private individualService: IndividualService,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private bsModalService: BsModalService,
    private PaymentService: PaymentService,
    private toastService: ToastService,
    private jsonTranslate: JsonTranslation
  ) { }

  ngOnInit() {
    this.broadcastService.setHeaderText('Review Order');
    this.getOrderCountById();
    this.delivarAddress = GetSet.getAddress();
    this.cartRefNumber = GetSet.getCartRefNumber();
    let number = this.activatedRoute.snapshot.paramMap.get("totalAmount");
    this.totalAmount = +number;
    this.countCartOrders();
    this.getAllFeesByItem();
  }

  countCartOrders() {
    let user = JSON.parse(localStorage.getItem('user'));
      this.apiService.CountOrderById.getByPath(user.refNo).subscribe((result) => {
        this.cardItemCount = result.data;
      })
  }

  getOrderCountById() {
    let user = JSON.parse(localStorage.getItem('user'));
    if(user) {
      this.user_id = user.id;
      this.userRefNo = user.refNo;
      this.apiService.GetOrderById.getByPath(user.refNo).subscribe((result) => {
        this.cartData = result.data;
      })
    }
  } 

  getAllFeesByItem() {
    let query = {
      "itemType": "MEDICINE",
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

  paymentResponseHander(response) {
    let query = {
      'razorpay_order_id': response.razorpay_order_id,
      'razorpay_payment_id': response.razorpay_payment_id,
     // 'order_ref_no': this.totalAmount,
      'razorpay_payment_failReason': "",
      'razorpay_payment_success': true,
      'paymentFor':'PHARMACY'
    }
    this.individualService.completeMedicinePayment(query).subscribe((resp) => {
        this.razorpay_order_id = null; 
        this.broadcastService.setHeaderOrderItem();
        this.router.navigate([ "/individual/my-order"]);
     
    });

   
  }

  ondismissPaymentModal() {
    alert('ondismissPaymentModal');
    let query = {
      'razorpay_order_id': this.razorpay_order_id,
      'razorpay_payment_failReason': "Dismissed By User",
      'razorpay_payment_success': false,
      'paymentFor':'PHARMACY'
    }
    this.individualService.completeMedicinePayment(query).subscribe((resp) => {    
      this.razorpay_order_id = null; 
      this.broadcastService.setHeaderOrderItem();
      this.router.navigate([ "/individual/my-order"]);
    });

    
  }



  placeOrder() {
    let query = {
        'addressId': this.delivarAddress.id,
        'userRefNo': this.userRefNo,
        'grossAmount': (+this.totalAmount),        
        'tax': (+this.tax),        
        'charges':(+this.deliveryCharge),
        'discount': (+this.discount),        
        'netAmount': this.grandTotal,
        'cartRefNoList': this.cartRefNumber,
        'deliveryOption': "STANDARD"
      }
    this.individualService.placeOrderFromCart(query).subscribe((resp) => {
      if (resp.status === 2000) {
        this.placeOrderData = resp.data;
        this.toastService.showI18nToast('Order Placed', 'success');
        //confirm page info set
        let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.MEDICINE_ORDER_CONFIRMED');
        this.confirmationMsg.push(confMsg);
        let confirmationInfo = {};
        confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
        confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.PHARMACY;
        confirmationInfo['confirmationMsg'] = this.confirmationMsg;
        confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.PHARMACY;
        confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.PHARMACY;
        // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.PHARMACY;
        GetSet.setConfirmationInfo(confirmationInfo);
        //end of confirm page info set
        this.router.navigate(['confirmation']);
      }
    })
  }

  backOperation() {
    this.router.navigate(['/individual/deliver-address', this.totalAmount]);
  }

}

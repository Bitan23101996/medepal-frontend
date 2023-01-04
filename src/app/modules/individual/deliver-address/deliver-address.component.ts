
/*
 *  * |///////////////////////////////////////////////////////////////////////|
 *  * |                                                                       |
 *  * | Copyright (C) STELLABLUE INTERACTIVE SERVICES PVT. LTD.               |
 *  * | All Rights Reserved                                                   |
 *  * |                                                                       |
 *  * | This document is the sole property of StellaBlue Interactive          |
 *  * | Services Pvt. Ltd.                                                    |
 *  * | No part of this document may be reproduced in any form or             |
 *  * | by any means - electronic, mechanical, photocopying, recording        |
 *  * | or otherwise - without the prior written permission of                |
 *  * | StellaBlue Interactive Services Pvt. Ltd.                             |
 *  * |                                                                       |
 *  * |///////////////////////////////////////////////////////////////////////|
 *  */
 

import { Component, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { IndividualService } from '../../../modules/individual/individual.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ModalService } from 'src/app/shared/directive/modal/modal.service';
import { PaymentService } from '../../payment/payment.service';
import { GetSet } from '../../../core/utils/getSet';
import { BroadcastService } from '../../../core/services/broadcast.service';

@Component({
  selector: 'deliver-address',
  templateUrl: './deliver-address.component.html',
  styleUrls: ['./deliver-address.component.css']
})
export class DeliverAddressComponent implements OnInit {
  @ViewChild('someVar') el: ElementRef;
  @ViewChild('addressTypeTemp') addressTypeTemp: TemplateRef<any>;

  user: any;
  user_id: any;
  addressList=[];
  addressForm: FormGroup;
  form: FormGroup;
  addressTypeList: any = [];
  addressData: any = [];
  isEdit: any = false;
  masterCOUNTRY: any = [];
  masterSTATE: any = [];
  addressT: any;
  modalRef: BsModalRef;
  isAnyAddressInEditState:boolean;
  oldItems:any[] = [];
  isEditDeleteAllowed:boolean = true;
  cardBorder: any = false;
  selectedAddress: any;
  totalAmount: number;
  cartRefenceNumber=[];
  placeOrderData: any;
  paytmRespObj: any = {};
  delivarProceed: any = false;
  cardItemCount: number;
  pinList : any =[];
  disabledAddressBtn :boolean = false;
  user_refNo: string;
  deliveryPossible: boolean = false;

  constructor(
    private PaymentService: PaymentService,
    private modalService: ModalService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastService,
    private bsModalService: BsModalService,
    private individualService: IndividualService,
    private broadcastService: BroadcastService,
    private apiService: ApiService,
    private frb: FormBuilder
  ) {
    this.addressForm = frb.group({
      'name': [null],
      'contactNo': [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      'line1': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      'line2': [null],
      'country': [null, Validators.required],
      'state': [null, Validators.required],
      'city': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],//, Validators.pattern(/^[a-zA-Z]*$/)
      'pinCode': [null, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
      'addressType': [null, Validators.required],
      'isSubmit': false
    });
   }

  ngOnInit() {
    this.deliveryPossible = false;
    this.broadcastService.setHeaderText('Select Delivery Address');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.user_id = this.user.id;
    this.user_refNo = this.user.refNo;
    this.getOrderCountById();
    this.loadAllMasterData();
    this.addressTypeList = [{ id: 1, Type: "Home" }, { id: 2, Type: "Office" }, { id: 3, Type: "Custom Address Type" }];
    let number = this.activatedRoute.snapshot.paramMap.get("totalAmount");
    // this.cartReferenceNumber = this.activatedRoute.snapshot.paramMap.get("cartRefNum");
    this.totalAmount = +number;
    this.countCartOrders();
    console.log(this.pinList);
  }//end of oninit

  countCartOrders() {
    let user = JSON.parse(localStorage.getItem('user'));
      this.apiService.CountOrderById.getByPath(user.refNo).subscribe((result) => {
        this.cardItemCount = result.data;
      })
  }

  getOrderCountById() {
    // let user = JSON.parse(localStorage.getItem('user'));
        if(this.user) {
        this.apiService.AddressById.getByPath(this.user.refNo).subscribe((result) => {
        this.addressList = result.data;

        for( let address of this.addressList){         
          this.individualService.getValidateDeliverAddress("MEDICINE/"+address.pinCode).subscribe(response => {
            address['service_available']= response.data;
            // this.addressList.push(address);
            // this.addressData.push(address);
            address['customCssClass'] = this.setcustomCssClass(address);
            address['customCssClassCursor'] = this.setcustomCssClassCursor(address);
            this.defaultSelectAddressOnReorderMed();//calling the method to default select address if reorder medicine
        });
        }//end of for
        this.addressData = this.addressList; 
      });
    }//end of user check
  }//end of method

  //method to select default address if reorder medicine
  defaultSelectAddressOnReorderMed(){
   let previousAddressPk =  GetSet.getPreviousAddressForReorderMed();
   if(previousAddressPk){
   let selectedAddress =  this.addressList.find(el=> el.id == previousAddressPk);
   selectedAddress? this.selectAddress(selectedAddress): null;//calling the method to select default address
   }//end of check previousAddressPk exist or not 
  }//end of method

  setcustomCssClassCursor(address) {
    address['selected'] ? address['customcssforselected'] = 'selected-card' : address['customcssforselected'] = '';
    if(!address.service_available) {
      address['customcssforselected'] = '';
      address['customcssfordisablecursor'] = 'disabledDeliverAddressCursor';
    } else {
      address['customcssfordisablecursor'] = '';
    }
    let customCssStrCursor = address['customcssforselected'] + ' ' + address['customcssfordisablecursor'];
    this.deliveryPossible = true;
    return customCssStrCursor;
  } //end of method

  setcustomCssClass(address): string{
    address['selected'] ? address['customcssforselected'] = 'selected-card' : address['customcssforselected'] = '';
    if(!address.service_available){
      address['customcssforselected'] = '';
      address['customcssfordisable'] = 'disabledDeliverAddress';
      // address['customcssfordisablecursor'] = 'disabledDeliverAddressCursor';
    }else{
      address['customcssfordisable'] =  '';
      // address['customcssfordisablecursor'] = '';
    }
    // address.service_available? address['customcssfordisable'] = '': ( address['customcssforselected'] = '' address['customcssfordisable'] = 'disabledDeliverAddress';)
    let customCssStr = address['customcssforselected'] + ' ' + address['customcssfordisable'];
    // console.log("customCssClass::",customCssStr);
    return customCssStr;
  }//end of method

  loadAllMasterData() {
    this.individualService.getMasterDataCountry().subscribe(data => {
      if (data.status === 2000) {
        this.masterCOUNTRY = data.data;
      } else {
        alert(data.message);
      }
    });
  }

  getStateCasCadeToCounntry(ctrl: any) {
    this.masterSTATE = [];
    this.addressForm.patchValue({
      'state': ""
    });
    // if (this.addressForm.value.country == "") return;

    this.individualService.getMasterDataState(this.addressForm.value.country).subscribe(data => {
      if (data.status === 2000) {
        this.masterSTATE = data.data;
        let address = this.addressData.filter(x => x["id"] == this.addressForm.value.id)[0];
        if (address && this.masterSTATE.filter(x => x["stateName"] == address.state).length > 0) {
          ctrl.patchValue({
            'state': address.state
          });
        }
      }
    }, (error) => {

    });
  }

  createNewAddressType(ev: any, ctrl: any) {
    if (ev.target.value === 'Custom Address Type' || ev.target.value === 'create') {
      this.addressT = "" ;
      this.modalRef = this.bsModalService.show(this.addressTypeTemp, { class: 'modal-lg', backdrop: 'static' });
      this.modalRef["ctrl"] = ctrl;
    } else {
      if (this.addressData.filter(x => x["addressType"] == ev.target.value && x["id"] != ctrl.value.id).length > 0) {
        let currentAddress = this.addressData.filter(x => x["id"] == ctrl.value.id)[0];
        if (currentAddress) {
          ctrl.patchValue({
            'addressType': currentAddress["addressType"]
          });
        }else{
          ctrl.patchValue({
            'addressType': null
          }); 
        }
        this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_TYPE_EXIST', 'error');
      }
    }
  }

  createAddresType() {
    let ctrl = this.modalRef["ctrl"];
    if (this.addressT != '') {
      if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == this.addressT.toLowerCase()).length > 0) {
        this.toastService.showI18nToast('USER_ADDRESS_TOAST.TYPE_ALREADY_EXIST_IN_LIST', 'error');
        return;
      } else if (this.addressT.length>25) {
        this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_TYPE_SHOULD_BE_BETWEEN_25', 'warning')
        return;
      }
      let newId = this.addressTypeList.length + 1;
      this.addressTypeList.push({ id: newId, Type: this.addressT });
      ctrl.patchValue({
        'addressType': this.addressT
      });
      this.modalRef.hide();
    }
    else {
      this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_NOT_BE_BLANK', 'warning');
    }
  }
  
  addNewAddress() {
    this.addressForm.patchValue({
      'name': "",
      'contactNo': "",
      'line1': "",
      'line2': "",
      'country': "",
      'state': "",
      'city': "",
      'pinCode': "",
      'addressType': ""
    })
    this.isEdit = true;
    let defaultCountryName: string = '';
    this.masterCOUNTRY.filter((elm)=>{
      if(elm.countryName == 'India'){
        defaultCountryName  = elm.countryName;
      };
    });
    this.addressForm.patchValue({
      'country': defaultCountryName
    });
    this.individualService.getMasterDataState(this.addressForm.get('country').value).subscribe((data) => {
      this.masterSTATE = data.data;
        let address = this.addressData.filter(x => x["id"] == this.addressForm.value.id)[0];
        if (address && this.masterSTATE.filter(x => x["stateName"] == address.state).length > 0) {
          this.addressForm.patchValue({
            'state': address.state
          });
        }
    })
  }

  onBackOperation() {
    this.isEdit = false;
    this.addressForm.reset();
  }

  closeModal() {
    let ctrl = this.modalRef["ctrl"];
    let currentAddress = this.addressData.filter(x => x["id"] == ctrl.value.id)[0];
    console.log(currentAddress);
    if (currentAddress) {
      ctrl.patchValue({
        'addressType': currentAddress["addressType"]
      });
    }else{
      ctrl.patchValue({
        'addressType': ''
      });
    }
    this.modalRef.hide();
  }

  saveAddress(addressForm: any) {
    // let addValue = addressForm.value;
    addressForm.patchValue({
      'isSubmit': true
    });
    if (addressForm.invalid) {
      return;
    }
   

    let query = {
      'name': this.addressForm.get('name').value,
      'contactNo': this.addressForm.get('contactNo').value.internationalNumber,
      'line1': this.addressForm.get('line1').value,
      'line2': this.addressForm.get('line2').value,
      'country': this.addressForm.get('country').value,
      'city': this.addressForm.get('city').value,
      'addressType': this.addressForm.get('addressType').value,
      'state': this.addressForm.get('state').value,
      'pinCode': this.addressForm.get('pinCode').value,
      // 'id': this.addressForm.get('id').value
    }
    // if(addValue.id<1){
    //   delete query["id"];
    // }
    this.isAnyAddressInEditState = false;
    this.individualService.updateUserProfile({
      'updateSection': 'ADDRESS',
      'userRefNo': this.user_refNo,
      'addressList': [query]
    }).subscribe((data) => {
      if (data.status === 2000) {
        this.getOrderCountById();
        //this.editToggleAddress(ctrl);
        this.addressForm.reset();
      }
      this.toastService.showI18nToast(data.message, 'success');
      
    }, (error) => {
      // handle error
    });
    this.oldItems = [];
    this.isEditDeleteAllowed = true;
    this.isEdit = false;
    // if(this.addressTypeList.length > 2) {
    //   this.addressTypeList.push({id: this.newId+1, Type: "Custom Address Type"});
    // }
  }

  onKeydown($event){
    if(($event.key == "!" || $event.key == "@" || $event.key == "#" || $event.key == "$" || $event.key == "%" || $event.key == "^" || $event.key == "&" || $event.key == "*" || $event.key == "(" || $event.key == ")") ||($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 106 && $event.keyCode <= 111)) 
      return false;
  }

  reSetSelrctedAddress(){
    this.addressList.forEach(item => {
       item["selected"]=false;
       item['customCssClass'] = this.setcustomCssClass(item);
      //  console.log("item['customCssClass']::",item['customCssClass']);
    });
  }

  selectAddress(addresses)  {
      this.reSetSelrctedAddress();
        this.selectedAddress = addresses;
        addresses["customCssClass"] = 'selected-card';
        addresses['customCssClassCursor'] =  '';//to remove disable class
        addresses['customCssStr']
        addresses["selected"]=true;
        this.cardBorder = true; 
        this.delivarProceed = true;
  }//end of method

  placeOrder() {
    GetSet.setAddress(this.selectedAddress);
    GetSet.setCartRefNumber(JSON.parse(localStorage.getItem('cartRefNum')));
    this.router.navigate(['/individual/review-order', this.totalAmount]);
    // this.cartRefenceNumber = JSON.parse(localStorage.getItem('cartRefNum'));
    // let query = {
    //   'addressId': this.selectedAddress.id,
    //   'userPk': this.user_id,
    //   'netAmount': this.totalAmount,
    //   'taxAmount': 0.00,
    //   'grossAmount': this.totalAmount,
    //   'discount': 0,
    //   'cartRefNoList': this.cartRefenceNumber
    // }
    // this.individualService.placeOrderFromCart(query).subscribe((resp) => {
    //   if (resp.status === 2000) {
    //     this.placeOrderData = resp.data;

    //     var paymentObj = {
    //       'orderRefNo': this.placeOrderData.orderRefNo,
    //       'paymentMode': "PAYTM",
    //       'transactionTypeEnum': "PHARMACY"
    //     };

    //     this.PaymentService.paymentInitiateV2(paymentObj).subscribe((resp: any) => {
    //       if (resp && resp.status == 2000) {
    //         this.modalService.open('paytm-popup');
    //         this.paytmRespObj = resp.data;
    //         setTimeout(() => {
    //           this.el.nativeElement.submit();
    //         }, 500);
    //       }
    //     })
    //   }
    // })
  }

  placeOrderNewAddress() {
    GetSet.setAddress(this.addressForm.value);
    GetSet.setCartRefNumber(JSON.parse(localStorage.getItem('cartRefNum')));
    this.router.navigate(['/individual/review-order', this.totalAmount]);
    // this.cartRefenceNumber = JSON.parse(localStorage.getItem('cartRefNum'));
    // let query = {
    //   'addressId': this.selectedAddress.id,
    //   'userPk': this.user_id,
    //   'netAmount': this.totalAmount,
    //   'taxAmount': 0.00,
    //   'grossAmount': this.totalAmount,
    //   'discount': 0,
    //   'cartRefNoList': this.cartRefenceNumber
    // }
    // this.individualService.placeOrderFromCart(query).subscribe((resp) => {
    //   if (resp.status === 2000) {
    //     this.placeOrderData = resp.data;

    //     var paymentObj = {
    //       'orderRefNo': this.placeOrderData.orderRefNo,
    //       'paymentMode': "PAYTM",
    //       'transactionTypeEnum': "PHARMACY"
    //     };

    //     this.PaymentService.paymentInitiateV2(paymentObj).subscribe((resp: any) => {
    //       if (resp && resp.status == 2000) {
    //         this.modalService.open('paytm-popup');
    //         this.paytmRespObj = resp.data;
    //         setTimeout(() => {
    //           this.el.nativeElement.submit();
    //         }, 500);
    //       }
    //     })
    //   }
    // })
  }

  backOperation() {
    this.router.navigate(['/individual/order-medicine']);
  }

}

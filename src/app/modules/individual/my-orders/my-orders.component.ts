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
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IndividualService } from '../individual.service';
import { BroadcastService } from './../../../core/services/broadcast.service';
import { SearchPipe } from 'src/app/shared/search.pipe';//for search
import { SBISConstants } from './../../../SBISConstants';
import { GetSet } from '../../../core/utils/getSet';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DeliveryService } from '../../delivery/delivery.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ToastService } from '../../../core/services/toast.service';
import { JsonTranslation } from '../../../shared/translation';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  @ViewChild('orderedMedicineDetailsViewModal') orderedMedicineDetailsViewModal: TemplateRef<any>;
  //taking var to store user id n name from localstorage
  user_id: any;
  userRefNo: any;
  user_name: any;
  modeList: any;
  fromDate: any = "";
  toDate: any = "";
  dateFormat: any;
  modeArr = [];
  stat = [];
  statusList: any;
  panelVisible = false;
  buttonClassCurrent: any;
  buttonClassAnother: any;
  orderMedListArr: any[] = [];
  medicineListArrObj: any = {};//to store medicine list arr obj by clicking view details
  public orderedMedicineListArr: any = [];//taking orderMedicine arr to store the ordered med list
  public patientNameDistArr: string[] = [];//taking patientNameDist arr to store the distinct value of psatient name from response
  modalRef: BsModalRef//modal close
  public facetedFormGroup: FormGroup;//taking form group to filter data
  noOrderFound: boolean = false;
  downloadOrderInvoice = {
    downloadImageSrc: "",
    contentType: "",
    orderByUserName: "",
    fileName: ""
  };

  orderState: any = {};
  orderStateOutForDelivery: any;
  ratingList = [];
  editRating: any;
  user_rolePk: number;
  ratings: any;
  reviews = {
    userReviewsList: [],
    page: 1,
    pharmacyRefNo: null,
    labRefNo: null,
    doctorName: "",
    yearsOfExperience: 0,
    doctorQualifications: [],
    doctorSpecializations: [],
    rating: 0,
    reviewNum: 0
  }
  patientName: any;
  fromDateDiag: any = "";
  toDateDiag: any = "";
  confirmationMsg: any = [];
  isMyOrders: boolean = false;
  loading: boolean = false;
  @ViewChild('userReviewsModal') userReviewsModal: TemplateRef<any>;
  // public orderIdDist
  constructor(
    private fb: FormBuilder,
    private individualService: IndividualService,
    private bsModalService: BsModalService,
    private _deliveryService: DeliveryService,
    private broadcastService: BroadcastService,
    private router: Router,
    private toastService: ToastService,
    private jsonTranslate: JsonTranslation
  ) {
    this.orderState = SBISConstants.ORDER_STATE;
    this.orderStateOutForDelivery = SBISConstants.ORDER_STATE_OUT_FOR_DELIVERY;
  }//end of constructor

  ngOnInit() {
    // this.broadcastService.setHeaderText('My Orders');
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_rolePk = user.rolePk
    this.dateFormat = environment.DATE_FORMAT;
    let clearPrevious = JSON.parse(localStorage.getItem("clearPrevious"));
    this.fromDate = JSON.parse(localStorage.getItem("fromDatePrevious"));
    this.toDate = JSON.parse(localStorage.getItem("toDatePrevious"));
    this.createFetchOrderForm();
    this.loadRatingData();
    //  this.facetedFormGroup.patchValue({
    //   patientNameFC:JSON.parse(localStorage.getItem("namePrevious"))
    // });
    this.modeList = null;
    this.statusList = null;
    this.modeArr = [];
    this.orderedMedicineListArr = [];
    let previousOrderlist = JSON.parse(localStorage.getItem("orderlistPrevious"));
    console.log("previousOrderlist", previousOrderlist);
    if (previousOrderlist != null) {
      this.orderedMedicineListArr = previousOrderlist;
    }

    this.isMyOrders = true;
    this.user_id = user.id;
    this.userRefNo = user.refNo;
    this.user_name = user.userName;

    this.buttonClassCurrent = 'btn btn-dark';
    this.buttonClassAnother = 'btn btn-light';
    this.getAllAppStatus('DELIVERY_STATUS');
    this.getAllDeliveryMode('DELIVERY_MODE');
    // this.stat=JSON.parse(localStorage.getItem("statlistPrevious"));
    // this.modeArr=JSON.parse(localStorage.getItem("modelistPrevious"));
    if (this.orderedMedicineListArr.length == 0) {
      this.getMyOrderMedList();
    }
    if (clearPrevious != null) {
      localStorage.setItem("orderlistPrevious", JSON.stringify(null));
      localStorage.setItem("statlistPrevious", JSON.stringify(null));
      localStorage.setItem("modelistPrevious", JSON.stringify(null));
      localStorage.setItem("fromDatePrevious", JSON.stringify(null));
      localStorage.setItem("toDatePrevious", JSON.stringify(null));
      localStorage.setItem("namePrevious", JSON.stringify(null));
      localStorage.setItem("clearPrevious", JSON.stringify(null));
    }

    ///sbis-poc/app/issues/673 start
    try {
      localStorage.removeItem("myOrderDetails");
    } catch (e) { }
    ///sbis-poc/app/issues/673 end

    var d = new Date();
    var b = new Date();
    d.setMonth(d.getMonth() - 3);
    this.facetedFormGroup.patchValue({
      fromDate: d,
      toDate: b
    });
    //method to get order medicine by user id
    this.broadcastService.setHeaderText(SBISConstants.HEADER_NAME_OBJ.MY_ORDERS_HEADER_NAME);
    this.orderState = SBISConstants.ORDER_STATE;
    this.orderStateOutForDelivery = SBISConstants.ORDER_STATE_OUT_FOR_DELIVERY;
  }//end of onInit
  createFetchOrderForm() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.facetedFormGroup = this.fb.group({
      // patientNameFC: "",
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }//end of method
  //method to build form
  // private buildForm() {
  //   let formGrpObj: any = {};
  //   formGrpObj['patientNameFC'] = new FormControl();
  //   formGrpObj['orderIdFC'] = new FormControl();
  //   formGrpObj['medicineNameFC'] = new FormControl();
  //   formGrpObj['fromDate'] = new FormControl();
  //   formGrpObj['toDate'] = new FormControl();
  //   this.facetedFormGroup = new FormGroup(formGrpObj);
  // }//end of build form method

  //method to get ordered med by user id

  private getMyOrderMedList() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    let request = {
      "user_refNo": this.userRefNo,
      "fromDate": this.fromDate,
      "toDate": this.toDate,
      "medicineName": "",
      "name": "",
      "modeList": this.modeArr,
      "stateList": this.stat
    }
    this.individualService.getOrderMedicineByUserRefNov3(request).subscribe((response) => {
      if (response.status == 2000) {
        this.isMyOrders = true;
        response.data.sort((a, b) => {
          const d1 = new Date(a.orderDate);
          const d2 = new Date(b.orderDate);
          return (d1.getTime() - d2.getTime()) * -1;
        });
        let index = 0;
        for (let myDiagnostics of response.data) {
          response.data[index]['outstandingAmount'] = (+response.data[index].totalAmount) - (+response.data[index].paidAmount);
          index = index + 1;
        }
        this.orderedMedicineListArr = response.data;
        this.orderMedListArr = response.data;
        if (this.orderMedListArr.length == 0) {
          this.noOrderFound = true;
        }
        for (let orderMedListArrEl of this.orderedMedicineListArr) {
          if (this.patientNameDistArr.indexOf(orderMedListArrEl.orderByUserName) == -1) {
            this.patientNameDistArr.push(orderMedListArrEl.orderByUserName);
          }
        }
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      }
    }, err => {
      // console.log("err of get order med::", err);
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
    });
  }//end of method

  getMyDiagnosticsList() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    let request = {
      "user_refNo": this.userRefNo,
      "fromDate": this.fromDate,
      "toDate": this.toDate,
      "medicineName": "",
      "name": "",
      "modeList": this.modeArr,
      "stateList": this.stat
    }
    this.individualService.getDiagnosticsLabOrders(request).subscribe((response) => {
      if (response.status == 2000) {
        this.isMyOrders = false;
        response.data.sort((a, b) => {
          const d1 = new Date(a.orderDate);
          const d2 = new Date(b.orderDate);
          return (d1.getTime() - d2.getTime()) * -1;
        });
        let index = 0;
        for (let myDiagnostics of response.data) {
          response.data[index]['outstandingAmount'] = (+response.data[index].totalAmount) - (+response.data[index].paidAmount);
          index = index + 1;
        }
        this.orderedMedicineListArr = response.data;
        this.orderMedListArr = response.data;
        if (this.orderMedListArr.length == 0) {
          this.noOrderFound = true;
        }
        for (let orderDiagnosticsArrEl of this.orderedMedicineListArr) {
          if (this.patientNameDistArr.indexOf(orderDiagnosticsArrEl.orderByUserName) == -1) {
            this.patientNameDistArr.push(orderDiagnosticsArrEl.orderByUserName);
          }
        }
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      }
    }, err => {
      // console.log("err of get order med::", err);
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
    });
  }//end of method

  //method to filter by order id
  filterByInputText(event, columnName: string) {
    let typedOrderIdVal = event.target.value;
    let testArr: any[] = this.orderMedListArr;
    let searchPipeVar = new SearchPipe();
    let colName: string = (columnName == 'filterByOrderId') ? 'pharmacyOrderRefNo' : 'orderByUserName';
    this.orderedMedicineListArr = searchPipeVar.searchByFieldName(testArr, colName, typedOrderIdVal);
  }//end of method

  filterByMEdicineName(event) {
    let inputText: string = event.target.value;
    if (inputText) {
      let inputTexts: string[] = inputText.split(",");
      let testArr: any[] = this.orderMedListArr;
      let searchPipeVar = new SearchPipe();
      let colName: string = 'medicine';
      let arr: any[] = [];
      testArr.filter((element, index) => {
        let searchedMedFlag: boolean;
        searchedMedFlag =
          searchPipeVar.searchByFieldNameWithInutArr(element.orderMedicineDetails, colName, inputTexts);
        if (searchedMedFlag) {
          arr.push(element);
        }
      });
      this.orderedMedicineListArr = arr;
    } else {
      this.orderedMedicineListArr = this.orderMedListArr;
    }
  }//end of method

  //method to open modal by click view label
  onClickViewOrder(clickedArrEl: any) {
    GetSet.setMyOrderDetails(clickedArrEl);
    localStorage.setItem("orderlistPrevious", JSON.stringify(this.orderedMedicineListArr));
    localStorage.setItem("statlistPrevious", JSON.stringify(this.stat));
    localStorage.setItem("modelistPrevious", JSON.stringify(this.modeArr));
    localStorage.setItem("fromDatePrevious", JSON.stringify(this.fromDate));
    localStorage.setItem("toDatePrevious", JSON.stringify(this.toDate));
    // localStorage.setItem("namePrevious",JSON.stringify(this.facetedFormGroup.value.patientNameFC));
    this.router.navigate(['individual/my-order-details']);
    // this.medicineListArrObj = {};
    // this.medicineListArrObj = clickedArrEl;
    // this.modalRef = this.bsModalService.show(this.orderedMedicineDetailsViewModal, { class: 'modal-lg' });
    // //new add for download image
    // this.downloadOrderInvoice.downloadImageSrc = '';
    // this.downloadOrderInvoice.contentType = '';
    // this.downloadOrderInvoice.orderByUserName = clickedArrEl.orderByUserName;  
    // this.downloadORderInvoiceReport(clickedArrEl.pharmacyOrderRefNo);
  }//end of method


  downloadFile() {
    const link = document.createElement('a');
    link.href = this.downloadOrderInvoice.downloadImageSrc;
    link.download = this.downloadOrderInvoice.fileName;
    link.click();
  }//end of method

  //new add to download image
  downloadORderInvoiceReport(pharmacyOrderRefNo) {
    this.individualService.getMyOrderInvoiceReport(pharmacyOrderRefNo).subscribe((result) => {
      if (result.status != 2000) {
        return;
      }
      this.downloadOrderInvoice.contentType = result.data.contentType;
      this.downloadOrderInvoice.downloadImageSrc = "data:" + result.data.contentType + ";base64," + result.data.data;
      this.downloadOrderInvoice['fileName'] = result.data.fileName;
    });
  }

  onClickReOrder(orderMedListEl) {
    //console.log(orderMedListEl.orderMedicineDetails);
    GetSet.setReOrderDetails(orderMedListEl);

    this.router.navigate(['individual/order-medicine/re-order']);

  }
  getAllAppStatus(name) {
    this._deliveryService.getAppStatus(name).subscribe(res => {
      this.statusList = res;
    });
  }
  getAllDeliveryMode(name) {
    this._deliveryService.getAppStatus(name).subscribe(res => {
      this.modeList = res;
    });
  }


  modeChange(e, type) {
    if (e.target.checked) {
      let index = this.findIndexToUpdateMode(type.attributeValue);
      if (index >= 0) {

      } else {
        this.modeArr.push(type.attributeValue);
      }
    }
    else {
      let index = this.findIndexToUpdateMode(type.attributeValue);
      this.modeArr.splice(index, 1);
    }
  }

  findIndexToUpdateMode(attributeValue) {
    for (let i = 0; i < this.modeArr.length; i++) {
      if (this.modeArr[i] == attributeValue)
        return i;
    }
  }

  submit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    if (this.isMyOrders) {
      let request = {
        "user_refNo": this.userRefNo,
        "fromDate": this.fromDate,
        "toDate": this.toDate,
        "medicineName": "",
        // "name":this.facetedFormGroup.value.patientNameFC,
        "modeList": this.modeArr,
        "stateList": this.stat
      }
      this.individualService.getOrderMedicineByUserRefNov3(request).subscribe((response) => {
        if (response.status == 2000) {
          response.data.sort((a, b) => {
            const d1 = new Date(a.orderDate);
            const d2 = new Date(b.orderDate);
            return (d1.getTime() - d2.getTime()) * -1;
          });
          let index = 0;
          for (let myDiagnostics of response.data) {
            response.data[index]['outstandingAmount'] = (+response.data[index].totalAmount) - (+response.data[index].paidAmount);
            index = index + 1;
          }
          this.orderedMedicineListArr = response.data;
          this.orderMedListArr = response.data;
          if (this.orderMedListArr.length == 0) {
            this.noOrderFound = true;
          }
          for (let orderMedListArrEl of this.orderedMedicineListArr) {
            if (this.patientNameDistArr.indexOf(orderMedListArrEl.orderByUserName) == -1) {
              this.patientNameDistArr.push(orderMedListArrEl.orderByUserName);
            }
          }
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
        }
      }, err => {
        // console.log("err of get order med::", err);
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      });
    } else {
      this.orderedMedicineListArr = [];
      let request = {
        "user_refNo": this.userRefNo,
        "fromDate": this.fromDateDiag,
        "toDate": this.toDateDiag,
        "medicineName": "",
        "name": this.patientName,
        "modeList": this.modeArr,
        "stateList": this.stat
      }
      this.individualService.getDiagnosticsLabOrders(request).subscribe((response) => {
        if (response.status == 2000) {
          // this.isResp = true;
          response.data.sort((a, b) => {
            const d1 = new Date(a.orderDate);
            const d2 = new Date(b.orderDate);
            return (d1.getTime() - d2.getTime()) * -1;
          });
          let index = 0;
          for (let myDiagnostics of response.data) {
            response.data[index]['outstandingAmount'] = (+response.data[index].totalAmount) - (+response.data[index].paidAmount);
            index = index + 1;
          }
          this.orderedMedicineListArr = response.data;
          this.orderMedListArr = response.data;
          if (this.orderMedListArr.length == 0) {
            this.noOrderFound = true;
          }
          for (let orderDiagnosticsArrEl of this.orderedMedicineListArr) {
            if (this.patientNameDistArr.indexOf(orderDiagnosticsArrEl.orderByUserName) == -1) {
              this.patientNameDistArr.push(orderDiagnosticsArrEl.orderByUserName);
            }
          }
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
        }
      }, err => {
        // console.log("err of get order med::", err);
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      });
    }
  }

  onValueChange(label: any, dt: Date): void {

    if (label == 'fromDate') {
      this.fromDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);

    }
    if (label == 'toDate') {
      this.toDate = dt.getFullYear() + '-' + ('0' + (dt.getMonth() + 1)).slice(-2) + '-' + ('0' + dt.getDate()).slice(-2);

    }

    if (this.fromDate == this.toDate) {
      this.buttonClassCurrent = 'btn btn-dark';
      this.buttonClassAnother = 'btn btn-light';
    }
    else {
      this.buttonClassCurrent = 'btn btn-light';
      this.buttonClassAnother = 'btn btn-dark';
    }
  }


  resetAll() {
    this.modeArr = [];
    this.stat = [];
    if(this.isMyOrders) {
      this.facetedFormGroup = this.fb.group({
        fromDate: this.fromDate,
        toDate: this.toDate
      });
    } else {
      this.fromDateDiag = null;
      this.toDateDiag = null;
      this.patientName = '';
    }
  }

  resetMode() {
    this.modeArr = [];
  }

  resetOrderStatus() {

    this.stat = [];
  }

  statusChange(e, type) {
    if (e.target.checked) {
      let index = this.findIndexToUpdateStatus(type.attributeValue);
      if (index >= 0) {

      } else {
        this.stat.push(type.attributeValue);
      }
    }
    else {
      let index = this.findIndexToUpdateStatus(type.attributeValue);
      this.stat.splice(index, 1);
    }
  }

  findIndexToUpdateStatus(attributeValue) {
    for (let i = 0; i < this.stat.length; i++) {
      if (this.stat[i] == attributeValue)
        return i;
    }
  }


  //method to cancel order
  cancelOrder(order) {
    if (confirm("Are you sure you want to cancel this order?")) {
      let cancelOrderJsonBody: any = {
        "userRefNo": this.userRefNo,
        "orderRefNo": order.pharmacyOrderRefNo,
        "orderCancelReason": "User Request"
      };

      this.individualService.DeleteSelectedOrderedMedicine(cancelOrderJsonBody).subscribe(res => {
        if (res.status == 2000) {
          this.getMyOrderMedList();
        }
      }, err => {

      });
    }
  }//end of method

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

  payOrder(order) {
    order['orderRefNo'] = order.pharmacyOrderRefNo;
    console.log(order);
    GetSet.setPlaceOrderData(order);
    GetSet.setTransactionType('PHARMACY');
    //confirm page info set
    let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.MEDICINE_ORDER_PAID_SUCCESSFULLY');
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
    // this.router.navigate(['/payment/confirmation-status']);
    this.router.navigate(['/payment/razor-pay']);
  }

  giveRatingForOrder(order: any) {
    console.log(order);
    this.editRating = null;
    GetSet.setRatingFor('PHARMACY');
    this.ratingList.forEach(item => {
      item["ratingParameterScore"] = 0;
    })
    let query = {
      "triggeringActionType": 'PHARMACY',
      "triggeringRefNo": order.pharmacyOrderRefNo
    }
    this.individualService.viewRatingV2(query).subscribe((result) => {
      this.ratings = result.data;
      // this.review = result.data.review;
      if (result.status == 2000 && result.data != null) {
        result.data.ratingDetails.forEach(item => {
          let targetRating = this.ratingList.filter(x => x.ratingParameterDTO.ratingParameterName == item.ratingParameter.ratingParameterName)[0];
          if (targetRating) {
            targetRating["ratingParameterScore"] = item.ratingParameterScore;
          }
        });
        this.editRating = result.data;
      }
    });
  }

  loadRatingData() {
    this.individualService.getRatingForPharmacy().subscribe((result) => {
      if (result.status === 2000) {
        this.ratingList = result.data;
        console.log(this.ratingList);
        this.ratingList.forEach(item => {
          item["ratingParameterScore"] = 0;
        })
      }
    })
  }

  formatAMPM(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }//end of method

  userReviews(order) {
    this.reviews.page = 1;
    this.reviews.userReviewsList = [];
    this.isMyOrders ? (this.reviews.pharmacyRefNo = order.pharmacyRefNo) : (this.reviews.labRefNo = order.labRefNo);
    this.modalRef = this.bsModalService.show(this.userReviewsModal, { class: 'modal-lg' });
    this.loadReviews();
  }

  loadReviews() {
    if (this.isMyOrders) {
      this.individualService.getUserReviewsForPharmacy(this.reviews.pharmacyRefNo, this.reviews.page).subscribe(result => {
        if (result.status == 2000) {
          if (result.data.length == 0) {
            this.toastService.showI18nToast("No Record Found", "error");
          }
          result.data.forEach(item => {
            item["date"] = moment(new Date(item.ratingDate)).format("YYYY-MM-DD");
            item["time"] = this.formatAMPM(new Date(item.ratingDate));
            this.reviews.userReviewsList.push(item);
          });
        }
      });
    } else {
      this.individualService.getUserReviewsForDiagnostics(this.reviews.labRefNo, this.reviews.page).subscribe(result => {
        if (result.status == 2000) {
          if (result.data.length == 0) {
            this.toastService.showI18nToast("No Record Found", "error");
          }
          result.data.forEach(item => {
            item["date"] = moment(new Date(item.ratingDate)).format("YYYY-MM-DD");
            item["time"] = this.formatAMPM(new Date(item.ratingDate));
            this.reviews.userReviewsList.push(item);
          });
        }
      });
    }
  }//end of method

  moreReviews() {
    this.reviews.page = this.reviews.page + 1;
    this.loadReviews();
  }

  //method to cancel order
  cancelDiagnostics(medicineEl) {
    if (confirm("Are you sure you want to cancel this order?")) {
      let cancelOrderJsonBody: any = {
        "userRefNo": this.userRefNo,
        "orderRefNo": medicineEl.orderRefNo,
        "orderCancelReason": "User Request"
      };

      this.individualService.DeleteSelectedOrderedMedicine(cancelOrderJsonBody).subscribe(res => {
        if (res.status == 2000) {
          this.getMyDiagnosticsList();
        }
      }, err => {

      });
    }
  }//end of method

  cancelForDiagnosticsOrOrder(orderMedListEl) {
    this.isMyOrders ? this.cancelOrder(orderMedListEl) : this.cancelDiagnostics(orderMedListEl);
  }

  giveRating(orderMedListEl) {
    this.isMyOrders ? this.giveRatingForOrder(orderMedListEl) : this.giveRatingForDiagnostics(orderMedListEl);
  }

  payDiagnostics(diagnostics) {
    GetSet.setPlaceOrderData(diagnostics);
    GetSet.setTransactionType('DIAGNOSTICS');
    //confirm page info set
    let confMsg = this.jsonTranslate.translateJson('CONFIRMATION_MSG.DIAGNOSTICS_PAID_SUCCESSFULLY');
    this.confirmationMsg.push(confMsg);
    let confirmationInfo = {};
    confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
    confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.DIAGNOSTICS;
    confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.DIAGNOSTICS;
    confirmationInfo['confirmationMsg'] = this.confirmationMsg;
    confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.DIAGNOSTICS;
    // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.DIAGNOSTICS;
    GetSet.setConfirmationInfo(confirmationInfo);
    //end of confirm page info set
    this.router.navigate(['/payment/razor-pay']);
  }

  giveRatingForDiagnostics(appoinment) {
    console.log(appoinment);
    //this.appointment = appoinment;
    GetSet.setRatingFor('DIAGNOSTICS');
    this.ratingList.forEach(item => {
      item["ratingParameterScore"] = 0;
    });
    let query = {
      "triggeringRefNo": appoinment.orderRefNo,
      "triggeringActionType": "DIAGNOSTICS"
    }
    this.individualService.viewRatingV2(query).subscribe((result) => {
      if (result.status == 2000 && result.data != null) {
        result.data.ratingDetails.forEach(item => {
          let targetRating = this.ratingList.filter(x => x.ratingParameterDTO.ratingParameterName == item.ratingParameter.ratingParameterName)[0];
          if (targetRating) {
            targetRating["ratingParameterScore"] = item.ratingParameterScore;
          }
        });
        // this.modalRef["editRating"] = result.data;
        this.editRating = result.data;
      }
    });
    //this.appointment["doctorRefNo"] = appoinment.labRefNo;
  }//end of method


}//end of method



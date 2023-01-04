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

import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IndividualService } from '../../../modules/individual/individual.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { GetSet } from 'src/app/core/utils/getSet';

@Component({
  selector: 'app-fetch-medicine',
  templateUrl: './fetch-medicine.component.html',
  styleUrls: ['./fetch-medicine.component.css']
})
export class FetchMedicineComponent implements OnInit {

  // @ViewChild('addMedicineName') addMedicineName: TemplateRef<any>;
  @Input() cartData: any = [];
  totalAmount: number = 0.0;
  modalRef: BsModalRef;
  medicineModalArr: any = [];
  medicineModalQueryArr: any = [];
  addmedModalDisableFlag: boolean = true;
  addmedQtyModalDisableFlag: boolean = true;
  resultsToDisplay: any = [];
  results: any[];
  prescribedMedicineList: any[] = [];
  cartItem: number = 0;
  cartPrice: number = 0.0;
  getMedicinesList: any[] = [];
  newMedicineList: any;
  medBrand: any;
  quantity: any;
  cartReferenceNumber: any = [];
  user_id: any;
  user_refNo: any;
  medicineAdded: any = false;
  selectedMedQuantity: number;
  subTotalIsZero: any = false;
  cardItemCount: number;
  prescriptionsForMe: any[] = [];

  constructor(
    private apiService: ApiService,
    private toastService: ToastService,
    private router: Router,
    private _individualService: IndividualService,
    private broadcastService: BroadcastService
  ) { }

  ngOnInit() {
    // console.log("this.cartData::",this.cartData);
    // let user = JSON.parse(localStorage.getItem('user'));
    
  
    if (this.cartData == []) {
      this.subTotalIsZero = true;
    } else {
      this.subTotalIsZero = false;
    }
    this.broadcastService.setHeaderText('My Cart');
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.user_refNo = user.refNo;
      //new add to get medicine list
      // if(user) {
        this.user_id = user.id;
        this._individualService.getOrderById(this.user_refNo).subscribe((result) => {
          if(result.status == 2000) {
            // if(GetSet.getMedicineDetails()) {
            //   //result.data.cartItems.push(GetSet.getMedicineDetails());
            //   let medicinesFromOrderMedicine = GetSet.getMedicineDetails();
            //   let cartItems = []; 
            //   let query;
            //   if(result.data.length > 0) {
            //     for(let cartItem of result.data[0].cartItems) {
            //       query = {
            //         'itemId': cartItem.itemPk,
            //         'discount': +(cartItem.discount),
            //         'medicine': cartItem.itemName,
            //         'netAmount': +(cartItem.netAmount),
            //         'numUnits': cartItem.numUnits,
            //         'patientRefNo': user.refNo,
            //         'prescriptionRefNo': null,
            //         'tax': +(cartItem.tax) 
            //       }
            //       cartItems.push(query);
            //     }
            //   }
            //   for(let item of medicinesFromOrderMedicine) {
            //     var findObj=  cartItems.find( cartitem => cartitem.itemId == item.itemId );
            //     if(findObj ){
            //       findObj.numUnits = findObj.numUnits + item.numUnits;
            //       findObj.netAmount = findObj.netAmount + item.netAmount;
            //     }else{
            //       cartItems.push(item);
            //     }
               
            //   }
            //   let queryForOrderMedicine = {
            //     'userPk': this.user_id,
            //     'patientPk': this.user_id,
            //     'requisitionRefNo': result.data.length > 0 ? result.data[0].requisitionRefNo : null,
            //     'netAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
            //     'grossAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
            //     'orderItems': cartItems
            //   }
            //   this._individualService.saveOrder(queryForOrderMedicine).subscribe((resp) => {
            //     if(resp.status == 2000) {
            //       //this.cartData = resp.data;
            //       this._individualService.getOrderById(this.user_id).subscribe((getResp) => {
            //         if(resp.status == 2000) {
            //           this.cartData = getResp.data;
            //           this.countCartOrders();
            //           this.broadcastService.setHeaderOrderItem();
            //           this.calculateNetAmountOFCartData();
            //         }
            //       })
            //     }
            //   })
            // } else {
              this.cartData = result.data;
              console.log(this.cartData);
              this.calculateNetAmountOFCartData();
            // }
          }

          this.getPrescriptions();
        });
      // }//end of user check
      //end of new add to get medicine list
    }
    this.prescribedMedicineList.forEach(element => {
      this.cartItem = this.cartItem + 1;
      this._individualService.getMedicinesByNameList(element.medicineName).subscribe((data) => {
        if (data.status === 2000) {
          element["company"] = data.data.company;
          element["packageSize"] = data.data.packageSize;
          element["packageType"] = data.data.packageType;
          element["unitPrice"] = data.data.price;
          this.calculatePrice(element, data.data.packageType);
          this.cartPrice = this.cartPrice + element.overallPricePerMedicine;
          this.getMedicinesList.push(data.data);
        }
      });
    });
    this.countCartOrders();
    // this.addMedicine();
  }//end of oninit

  getPrescriptions() {
    this._individualService.getPrescriptionByUserId(this.user_refNo).subscribe((resp) => {
      if(resp.status == 2000) {
        let index = -1;
        for(let myPrescription of resp.data.ownPrescriptions) {
          index = index+1;
          resp.data.ownPrescriptions[index].prescriptionDate = new Date(myPrescription.prescriptionDate);
        }
       this.prescriptionsForMe = resp.data.ownPrescriptions;
      }
    });
  }

  ngOnChanges() {
    this.countCartOrders();
    if (this.cartData == 0) {
      this.subTotalIsZero = true;
    } else {
      this.subTotalIsZero = false;
    }
    if (this.cartData)
      this.totalAmount = this.cartData.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0)
  }//end of onchanges

  countCartOrders() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.apiService.CountOrderById.getByPath(user.refNo).subscribe((result) => {
      this.cardItemCount = result.data;
    });
  }//end of count orders

  calculateNetAmountOFCartData(){
    let totalamountlocal: number = 0;
    this.cartData.forEach(element => {
      element.cartItems.forEach(cartItmEl=>{
        if(cartItmEl.netAmount == 0){
          cartItmEl.netAmount = parseFloat(cartItmEl.numUnits) * parseFloat(cartItmEl.price);
        }
      });
    });
    if (this.cartData){
      this.cartData.forEach(element => {
        element.cartItems.forEach(el => {
          if(el.netAmount != 0){
            totalamountlocal =totalamountlocal + parseFloat(el.netAmount);
          }
        });
      });
    }//end of if
    this.totalAmount = totalamountlocal;
  }//end of method

  //method onClickAddIconOnAddNewMedicineModal
  onClickMedAddByMedSearchDrpDwn(selectedMedicine) {
    //console.log("selectedMedicine::",selectedMedicine);
    //new add 
    let findObj = this.cartData.filter(x => x.cartItems.filter(y => y["itemPk"] == selectedMedicine.medicineId).length > 0)[0];
    if (findObj) {
      //console.log("findObj::::",findObj);
      let findItemObj = findObj.cartItems.filter(y => y["itemPk"] == selectedMedicine.medicineId)[0];
      if (findItemObj) {
        let perMedPrice = parseFloat(findItemObj["netAmount"]) / findItemObj["numUnits"];
        findItemObj["numUnits"] = findItemObj["numUnits"] + 1;
        findItemObj["netAmount"] = perMedPrice * findItemObj["numUnits"];

        this.medicineModalQueryArr.push(findObj);
      }
    } else {
      let orderObj = this.cartData.filter(x => x["prescriptionPk"] == null)[0];
      let totalPrice = 0;
      totalPrice = totalPrice + parseFloat(selectedMedicine.price) * 1;//selectedMedicine.quantity;       

      let cartItemObj = {
        'itemName': selectedMedicine.brandName,
        'itemPk': selectedMedicine.medicineId,
        'numUnits': 1,//selectedMedicine.quantity,
        'netAmount': parseFloat(selectedMedicine.price) * 1//selectedMedicine.quantity
      }

      if (orderObj) {
        orderObj['cartItems'].push(cartItemObj);
      } else {
        let orderItemObj = {
          "grossAmount": totalPrice,
          "discount": 0,
          "tax": 0,
          "netAmount": totalPrice,
          "cartItems": [cartItemObj]
        }

        orderObj = orderItemObj;
        this.cartData.push(orderItemObj);
      }//end of orderobj check 

      this.totalAmount = this.cartData.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0);
      //console.log("this.totalAmount::",this.totalAmount);
      this.cartItem = this.prescribedMedicineList.length > 0 ? this.prescribedMedicineList.length : 0;     
      let query = {
        "userPk": this.user_id,
        "patientPk": this.user_id,
        "netAmount": orderObj.cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),//orderItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
        "taxAmount": 0.00,
        "grossAmount": orderObj.cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),//orderItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
        "discount": 0.00,
        "cartItems": orderObj.cartItems//orderItems
        // "orderItems": orderItems
      }
      if (orderObj.requisitionRefNo) {
        query["requisitionRefNo"] = orderObj.requisitionRefNo;
      }
      this.medicineModalQueryArr.push(query);
    }//end of else check the medicine is exist in the list or not
    this.addMedicineByDropdownWSCall();
  }//end of method

  addMedicineByDropdownWSCall() {
    this.medicineModalQueryArr.forEach(element => {
      let query: any = {};
      if (element.cartItems) {
        //console.log("element of medmodalarr::",element);
        query["userRefNo"] = this.user_refNo;
        if(element.requisitionRefNo){
          query["requisitionRefNo"] = element.requisitionRefNo;
        }
        query["orderItems"] = [];
        element.cartItems.forEach(itm => {
          query.orderItems.push({
            "medicine": itm.itemName,
            "itemId": itm.itemPk,
            "numUnits": parseInt(itm.numUnits),
            "netAmount": parseFloat(itm.netAmount),
            "discount": 0,
            "tax": 0,
            "patientRefNo" : this.user_refNo,
            "prescriptionRefNo" : null,
          });
        });
        query["netAmount"] = query["orderItems"].map(data => (+parseFloat(data['netAmount']))).reduce((a, b) => a + b, 0);
        query["grossAmount"] = query["orderItems"].map(data => (+parseFloat(data['netAmount']))).reduce((a, b) => a + b, 0);
        this._individualService.saveOrder(query).subscribe((data) => {
          //console.log(data.status);
            if (data.status === 2000) {
              element.cartItems=null;
              this.medicineAdded = true;
              this.broadcastService.setHeaderOrderItem();
              this.apiService.GetOrderById.getByPath(this.user_refNo).subscribe((result) => {
                this.cartData = result.data;
                if(this.cartData == []){
                  this.subTotalIsZero = true;
                } else {
                  this.subTotalIsZero = false;
                }
                this.calculateNetAmountOFCartData();//to calculate net amount and total amount
                // this.totalAmount = this.cartData.map(data => (+parseInt(data['netAmount']))).reduce( (a,b) => a+b ,0);
              });
              // this.toastService.showI18nToast("medicine added", 'success');
              this.countCartOrders();
              }
        });
      }
    });
  }//end of method
 
  //method to calculate price
  calculatePrice(element: any, medicineType: any) {
    let quantity;
    let totalMedQty: number;
    let pricePerPis = element.unitPrice / element.packageSize;
    if (medicineType == 'strip') {
      if (element.durationUnit == 'W') {

        if (element.dosageInterval == 'W') {
          quantity = element.dosageFrequency * element.duration;
        } else if (element.dosageInterval == 'D') {
          quantity = element.dosageFrequency * element.duration * 7;
        }

      } else if (element.durationUnit == 'M') {

        if (element.dosageInterval == 'W') {
          quantity = element.dosageFrequency * element.duration * 4;
        } else if (element.dosageInterval == 'D') {
          quantity = element.dosageFrequency * element.duration * 30;
        } else if (element.dosageInterval == 'M') {
          quantity = element.dosageFrequency * element.duration;
        }

      } else if (element.durationUnit == 'Y') {

        if (element.dosageInterval == 'W') {
          quantity = element.dosageFrequency * element.duration * 52;
        } else if (element.dosageInterval == 'D') {
          quantity = element.dosageFrequency * element.duration * 365;
        } else if (element.dosageInterval == 'M') {
          quantity = element.dosageFrequency * element.duration * 12;
        } else if (element.dosageInterval == 'Y') {
          quantity = element.dosageFrequency * element.duration;
        }

      } else if (element.durationUnit == 'D') {
        if (element.dosageInterval == 'D') {
          quantity = element.dosageFrequency * element.duration;
        }
      } else if (element.prescriptionType == 'selfOrder') {//sef order med condition
        pricePerPis = element.pricePerPis;
        quantity = element.packageSize;
      }
      totalMedQty = quantity;
      quantity = totalMedQty / element.packageSize;
      quantity = JSON.stringify(quantity);
      let checkDecimal = quantity.includes('.');
      if (checkDecimal) {
        let splitValues = quantity.split('.');
        if (splitValues[1] > 0) {
          quantity = parseInt(splitValues[0]) + 1;
          // quantity = qtyNumVal;
        }
      }
    } else {
      quantity = 1;
      pricePerPis = element.unitPrice;
    }
    element['medicineQuantity'] = quantity;
    element['overallPricePerMedicine'] = element.unitPrice * quantity;//quantity * pricePerPis;
    element['pricePerPis'] = pricePerPis;
  }//end of method calculate price

   //negetive value avoid:
   private numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }//end of method

  updatePriceByQuantity(event, selecedCartMedicineObj: any, index: number) {
    this.numberOnly(event);
    // console.log(event);
    // console.log("selecedCartMedicineObj" ,selecedCartMedicineObj);
    this.cartData.forEach(element => {
      element.cartItems.forEach((selectedmedel,indexOfSelectedMed) => {
        if(index == indexOfSelectedMed){
          selectedmedel['overallPricePerMedicine'] = parseFloat(selectedmedel['numUnits']) * parseFloat(selectedmedel['price']);// 
          selectedmedel['netAmount'] = parseFloat(selectedmedel['netAmount']);
          selectedmedel['netAmount'] = selectedmedel['overallPricePerMedicine'];
        }
      });
    });
    this.calculateNetAmountOFCartData();//to calculate net amount
    //ws call to update cart in db
    let query: any = {};
    if (selecedCartMedicineObj) {
      query["userRefNo"] = this.user_refNo;
      // query["patientPk"] = this.user_id;
      if(selecedCartMedicineObj.requisitionRefNo)
        query["requisitionRefNo"] = selecedCartMedicineObj.requisitionRefNo;     
     if(selecedCartMedicineObj.prescriptionPk)
      query["prescriptionPk"] = selecedCartMedicineObj.prescriptionPk;

      query["orderItems"] = [];
      selecedCartMedicineObj.cartItems.forEach(itm => {
        query.orderItems.push({
          "medicine": itm.itemName,
          "itemId": itm.itemPk,
          "numUnits": parseInt(itm.numUnits),
          "netAmount": parseFloat(itm.netAmount),
          "discount": 0,
          "tax": 0,
          "patientRefNo" : this.user_refNo,
          "prescriptionRefNo" : null,
        });
      });
      query["netAmount"] = query["orderItems"].map(data => (+parseFloat(data['netAmount']))).reduce((a, b) => a + b, 0);
      query["grossAmount"] = query["orderItems"].map(data => (+parseFloat(data['netAmount']))).reduce((a, b) => a + b, 0);
      //console.log("query for ws call",query);
      this._individualService.saveOrder(query).subscribe((data) => {
        if (data.status === 2000) {
          this.countCartOrders();
          this.broadcastService.setHeaderOrderItem();
          }
        });
      }//end of obj check
  }//end of method

  search(event) {
    if (event.query.length < 3) { //Working on app/issues/717
      this.results = [];
      return;
    }
    this._individualService.getMedicinesByNameList(event.query).subscribe((data) => {
      this.resultsToDisplay = data.data;
      this.results = this.resultsToDisplay.filter(el => el['ss'] == null);
    });
  }//end of method  autosearch

  deleteMedicine(order, itemIndex) {
    let user = JSON.parse(localStorage.getItem('user'));
    let orderItems = [];
    order.cartItems.forEach(function (item, i) {
      if (itemIndex != i) {
        let itemQuery = {
          "itemId": item.itemPk,
          "numUnits": item.numUnits,
          "price": item.price,
          "discount": 0,
          "tax": 0,
          "netAmount": item.netAmount,
          "patientRefNo" : user.refNo,
          "prescriptionRefNo" : null,
        }
        orderItems.push(itemQuery);
      }
    });
    if (confirm("Are you sure you want to delete this medicine from your cart items ?")) {
      let updateOrder = {
        "requisitionRefNo": order.requisitionRefNo,
        "userRefNo": this.user_refNo,
        // "patientPk": this.user_id,
        "netAmount": orderItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
        "taxAmount": 0.00,
        "grossAmount": orderItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
        "discount": 0.00,
        "orderItems": orderItems
      }
      this._individualService.saveOrder(updateOrder).subscribe((resp) => {
        if (resp.status === 2000) {
          this.apiService.GetOrderById.getByPath(this.user_refNo).subscribe((result) => {
            //result
            this.cartData = result.data;
            this.calculateNetAmountOFCartData();//to calculate net amount and total amount
            // this.totalAmount = this.cartData.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0);
            if (this.totalAmount == 0) {
              this.subTotalIsZero = true;
            } else {
              this.subTotalIsZero = false;
            }
          });
          this.broadcastService.setHeaderOrderItem();
          //this.toastService.showI18nToast("medicine deleted", 'success');
          this.countCartOrders();
        }
      });
    }
  }//end of method

  placeOrder() {
    this.cartReferenceNumber = [];
    this.apiService.GetOrderById.getByPath(this.user_refNo).subscribe((result) => {
      this.cartData = result.data;
      for (let cartRefNumber of this.cartData) {
        this.cartReferenceNumber.push(cartRefNumber.cartRefNo);
      }
      //console.log(this.cartReferenceNumber);
      localStorage.setItem("cartRefNum", JSON.stringify(this.cartReferenceNumber));
      this.router.navigate(['/individual/deliver-address', this.totalAmount]);
    });
  }//end of method

  selectPrescription(selectedPrescription) {
    console.log("selectecPrescription: "+selectedPrescription);
    // if(selectedPrescription != null) {
    //   this.prescriptionRequired = false;
    // }
  }

}//end of class

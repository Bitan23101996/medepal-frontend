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
import { Component, OnInit, OnDestroy, NgModule, AfterViewInit, ElementRef, Renderer2, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { startWith } from 'rxjs/operators';
import { BroadcastService } from './../../../core/services/broadcast.service';
import { IndividualService } from './../../individual/individual.service';
import { ToastService } from '../../../core/services/toast.service';
import { GetSet } from '../../../core/utils/getSet';
import { ApiService } from '../../../core/services/api.service';
import { DoctorService } from '../../../modules/doctor/doctor.service';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DomSanitizer } from '@angular/platform-browser';
import { element } from '@angular/core/src/render3';
import { FormGroupDirective, FormBuilder, FormGroup, Validators, FormArray, FormControl, NgForm } from '@angular/forms';
import { SBISConstants } from 'src/app/SBISConstants';
import { HttpClient, HttpEvent, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-order-medicine',
  templateUrl: './order-medicine.component.html',
  styleUrls: ['./order-medicine.component.css']
})
export class OrderMedicineComponent implements OnInit, OnDestroy {
  // @ViewChild('someVar') el: ElementRef;
  // @ViewChild('addMedicineName') addMedicineName: TemplateRef<any>;

  resultsToDisplay: any[] = [];
  paymentRadio: boolean = false;
  results: any[];
  paymentData: any = [];
  // paymentMode: String = '';
  // appointmentId: any = null;
  // paytmRespObj: any = {};
  // select1: number = 0;
  cartItem: number = 0;
  cartPrice: number = 0.0;
  prescribedMedicineList: any = [];
  addedMedicine: any = [];
  medBrand: any;
  prescriptionPk: number;
  medicationData: any;
  user_id: any;
  orderMedicineQuery: any;
  orderMedicinePage: any = false;
  reOrderableMedicine: any;
  resMedDetEl: any;
  subscribe: any;
  isReOrder = false;
  saveOrderQuery: any;
  queryToSave: any[];
  prescriptionsForMe: any = [];
  selectedPrescription: any[] = [];
  user_refNo: any;
  prescriptionRequired: any = false;
  modalRef: BsModalRef;
  download = {
    downloadImageSrc: "",
    contentType: "",
    doctorName: "",
    forUserName: "",
    source: "",
    documentRefNo: ""
  }
  medicine = {
    medicineQuantity: null
  }
  domSanitizer: any;
  appRefNo: any;
  requisitionRefNo: any;
  cardItemCount: number;
  cartReferenceNumber: any = [];
  uploadForm: FormGroup;
  patientNamelist: any[] = [];
  isPrescription: boolean = false;
  currentPrescriptionDetails: any[] = [];
  isMyPrescriptionCancel: boolean = false;
  isSysPrescriptionLoaded: boolean = false;
  isUplPrescriptionLoaded: boolean = false;
  isSelectPrescription: boolean = false;
  displaySaveBtn: boolean = false;
  checkRequired: boolean = false;

  @ViewChild('prescriptionUpload') prescriptionUpload: TemplateRef<any>;
  @ViewChild('prescriptionPreviewModal') prescriptionPreviewModal: TemplateRef<any>;
  prescriptionSBIS: any = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private broadcastService: BroadcastService,
    private _individualService: IndividualService,
    private apiService: ApiService,
    private _docService: DoctorService,
    private bsModalService: BsModalService,
    private _domSanitizer: DomSanitizer,
    private frb: FormBuilder,
    private http: HttpClient
  ) {
    this.domSanitizer = _domSanitizer;
    this.uploadForm = frb.group({
      'doctorName': [null, [Validators.required]],
      'forUserPk': [null, [Validators.required]],
      'file': [null, [Validators.required]],
      'documents': [null],
      'date': [new Date()],
      'fileUploadFor': [SBISConstants.DOCUMENT_TYPE_CONST.PRESCRIPTION],
      'isSubmit': [false]
    });
  }//end of constructor

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.user_id = user.id;
      this.user_refNo = user.refNo;
      // this.getPrescriptions();
    }
    if (GetSet.getRequisitionRefNo()) {
      this.requisitionRefNo = GetSet.getRequisitionRefNo();
    }
    //this.getPrescriptions();
    GetSet.setPreviousAddressForReorderMed(null);
    this.subscribe = this.route.params.subscribe(params => {
      if (params['source']) {
        this.isReOrder = true;
      } else {
        this.isReOrder = false;
      }
    })
    this.cartItem = 0;
    this.prescribedMedicineList = [];
    this.medicationData = null;
    this.reOrderableMedicine = null;
    if (GetSet.getOrderMedicineLabel()) {
      this.broadcastService.setHeaderText(GetSet.getOrderMedicineLabel());
    } else {
      this.broadcastService.setHeaderText('Order Medicine');
    }

    this.reOrderableMedicine = GetSet.getReOrderDetails();
    let number = GetSet.getPrescriptionPk();
    if (number != null) {
      this.prescriptionPk = +number;
    } else {
      this.prescriptionPk = null;
    }
    this.medicationData = JSON.parse(localStorage.getItem("Medication"));
    if (!this.medicationData) {
      if (this.reOrderableMedicine) {
        this.cartItem = 0;
        this._individualService.getReOrderableMedicineDetails(this.reOrderableMedicine.pharmacyOrderRefNo).subscribe((result) => {
          this.resMedDetEl = result.data;
          this.isReOrder ? GetSet.setPreviousAddressForReorderMed(result.data.addressPk) : GetSet.setPreviousAddressForReorderMed(null);
          // console.log(this.resMedDetEl);
          this.resMedDetEl.orderDetails.forEach(element => {
            element.cartItems.forEach(el => {
              el['medicineId'] = el.itemPk;
              el['medicineName'] = el.itemName;
              el['company'] = el.brandName;
              el['unitPrice'] = el.price;
              el['medicineQuantity'] = el.numUnits;
              el['overallPricePerMedicine'] = el.numUnits * (+el.price);
              this.prescribedMedicineList.push(el);
              // console.log(this.resMedDetEl.orderDetails);
              this.cartPrice = this.cartPrice + el.overallPricePerMedicine;
              this.cartItem = this.cartItem + 1;
            })
          });
          // this.prescribedMedicineList = this.resMedDetEl.orderDetails;
        })
      } else {
        if (!this.isReOrder && user) this.getMedDetByMedId();//method to get medicine details by medicine id
        // return;
      }
    } else {
      if (this.prescriptionPk != null) {
        console.log(this.medicationData);
        this.medicationData.medicationDTOList.forEach(element => {
          this._individualService.getMedicinesByMedicineId(element.medicineId).subscribe((data) => {
            if (data.status == 2000) {
              this.resMedDetEl = data.data;

              this.prescribedMedicineList.push({
                medicineName: this.resMedDetEl.brandName,
                prescriptionRequired: this.resMedDetEl.prescriptionRequired,
                company: this.resMedDetEl.company,
                itemId: this.resMedDetEl.medicineId,
                product_package: this.resMedDetEl.product_package,
                unitPrice: +this.resMedDetEl.price,
                overallPricePerMedicine: +this.resMedDetEl.price,
                numUnits: 1,
                medicine: this.resMedDetEl.brandName,
                discount: 0,
                tax: 0,
                netAmount: +this.resMedDetEl.price,
                patientRefNo: this.user_refNo,
                prescriptionRefNo: this.medicationData.prescriptionRefNo,
                medicineQuantity: 1
              });
              // this.medicine.medicineQuantity = 1;
              this.cartPrice = this.cartPrice + (+this.resMedDetEl.price);
              this.cardItemCount = this.prescribedMedicineList.map(data => (+data['medicineQuantity'])).reduce((a, b) => a + b, 0);
              // console.log( this.prescribedMedicineList);
              //susmita
              // if(precribedMedicineLength == this.medicationData.medicationDTOList.length){
              //   let queryForOrderMedicine = {
              //     'userRefNo': this.user_refNo,
              //     // 'patientPk': this.user_id,
              //     'requisitionRefNo': this.requisitionRefNo ? this.requisitionRefNo : null,
              //     'netAmount': medicineList.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
              //     'grossAmount': medicineList.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
              //     'orderItems': medicineList
              //   }
              //   this._individualService.saveOrder(queryForOrderMedicine).subscribe((resp) => {
              //     if (resp.status == 2000) {
              //       this.getMedDetByMedId();
              //     }
              //   });
              // }//end of if array length check with count
              //susmita
            }//end of status check
          })
        })

      } else {
        this._individualService.getOrderById(this.user_refNo).subscribe(resp => {
          if (resp.status == 2000) {
            this.cartPrice = 0;
            this.prescribedMedicineList = [];
            let medicineList = [];
            if (resp.data.length != 0) {
              this.requisitionRefNo = resp.data[0].requisitionRefNo;
              resp.data[0].cartItems.forEach(element => {
                medicineList.push({
                  itemId: element.itemPk,
                  numUnits: element.numUnits,
                  prescriptionRequired: element.prescriptionRequired,
                  medicine: element.itemName,
                  discount: +element.discount,
                  tax: +element.tax,
                  netAmount: +element.netAmount,
                  patientRefNo: this.user_refNo,
                  prescriptionRefNo: element.prescriptionRefNo,
                });
              });


              let precribedMedicineLength = 0;
              //;
              this.medicationData.medicationDTOList.forEach(element => {
                this._individualService.getMedicinesByMedicineId(element.medicineId).subscribe((data) => {
                  precribedMedicineLength++;
                  if (data.status == 2000) {
                    this.resMedDetEl = data.data;

                    medicineList.push({
                      itemId: this.resMedDetEl.medicineId,
                      numUnits: 1,
                      prescriptionRequired: this.resMedDetEl.prescriptionRequired,
                      medicine: this.resMedDetEl.brandName,
                      discount: 0,
                      tax: 0,
                      netAmount: +this.resMedDetEl.price,
                      patientRefNo: this.user_refNo,
                      prescriptionRefNo: this.medicationData.prescriptionRefNo
                    });
                    // console.log( this.prescribedMedicineList);
                    //susmita
                    if (precribedMedicineLength == this.medicationData.medicationDTOList.length) {
                      let queryForOrderMedicine = {
                        'userRefNo': this.user_refNo,
                        // 'patientPk': this.user_id,
                        'requisitionRefNo': this.requisitionRefNo ? this.requisitionRefNo : null,
                        'netAmount': medicineList.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
                        'grossAmount': medicineList.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
                        'orderItems': medicineList
                      }
                      this._individualService.saveOrder(queryForOrderMedicine).subscribe((resp) => {
                        if (resp.status == 2000) {
                          this.getMedDetByMedId();
                        }
                      });
                    }//end of if array length check with count
                    //susmita
                  }//end of status check
                });//end of ws call
              });//end of foreach medicationDTOList
            }//end of status check
          }//end of service call in else part
        });
      }

    }
  }//end of oninit



  getPrescriptions() {
    this.selectedPrescription = [];
    this._individualService.getPrescriptionByUserId(this.user_refNo).subscribe((resp) => {
      if (resp.status == 2000) {
        let index = -1;
        for (let myPrescription of resp.data.ownPrescriptions) {
          index = index + 1;
          resp.data.ownPrescriptions[index].prescriptionDate = new Date(myPrescription.prescriptionDate);
        }
        let prescriptions = resp.data.ownPrescriptions;
        for (let prescriptionPerAppointment of prescriptions) {
          if (prescriptionPerAppointment.source == "SBIS") {
            let appointmentRefNo = prescriptionPerAppointment.appointmentRefNo;
            let prescriptionRefNo = prescriptionPerAppointment.prescriptionRefNo;
            this._docService.GetprescriptionByAppoRefV2({ "appointmentRef": appointmentRefNo }).subscribe((result) => {
              if (result.status == 2000) {
                this.isPrescription = true;
                if (result.data.medicationDTOList.length != 0) {
                  result.data['prescriptionRefNo'] = prescriptionRefNo;
                  result.data['appointmentRefNo'] = appointmentRefNo;
                  result.data['source'] = "SBIS";
                  //if (GetSet.getPrescriptionPk()) {
                  if (this.prescribedMedicineList.find(x => x.prescriptionRefNo === result.data.prescriptionRefNo)) {
                    this.selectedPrescription.push(result.data);
                    // console.log(this.selectedPrescription);
                  } else {
                    //do nothing
                  }
                  //}
                  this.prescriptionsForMe.push(result.data);
                }
              }
            });
          } else {
            let docRefNo = prescriptionPerAppointment.prescriptionRefNo
            let prescriptionRefNo = prescriptionPerAppointment.prescriptionRefNo
            let query = {
              'downloadFor': 'PRESCRIPTION',
              'documentRefNo': docRefNo
            }
            this._individualService.prescriptionDownload(query).subscribe((result) => {
              if (result.status == 2000) {
                this.isPrescription = true;
                let doc: any = {}
                doc['contentType'] = result.data.contentType;
                doc['downloadImageSrc'] = "data:" + result.data.contentType + ";base64," + result.data.data;
                doc['source'] = "UPLOAD";
                doc['documentRefNo'] = docRefNo;
                doc['prescriptionRefNo'] = prescriptionRefNo;

                if (this.prescribedMedicineList.find(x => x.prescriptionRefNo === doc.prescriptionRefNo)) {
                  this.selectedPrescription.push(doc);
                  // console.log(this.selectedPrescription);
                } else {
                  //do nothing
                }
                this.prescriptionsForMe.push(doc);
              }
            });
          }
        }
      }
    });
  }

  downloadPrescription(documentRefNo) {
    let query = {
      'downloadFor': 'PRESCRIPTION',
      'documentRefNo': documentRefNo
    }
    this._individualService.prescriptionDownload(query).subscribe((result) => {
      if (result.status != 2000) {
        return;
      }

      this.download.contentType = result.data.contentType;
      this.download.downloadImageSrc = "data:" + result.data.contentType + ";base64," + result.data.data;
    })
  }

  openPrescription(prescription: any) {
    GetSet.setPrescriptionPreviewFromOrderMedicine(true);
    if (prescription.source == 'SBIS') {
      this.prescriptionSBIS = true;
      this.appRefNo = prescription.appointmentRefNo;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    } else {
      this.downloadPrescription(prescription.documentRefNo);
      this.prescriptionSBIS = false;
      this.modalRef = this.bsModalService.show(this.prescriptionPreviewModal, { class: 'modal-lg' });
    }
  }

  ngOnDestroy() {
    localStorage.setItem("Medication", null);
    GetSet.setReOrderDetails(null);
    GetSet.setOrderMedicineLabel(null);
    GetSet.setPrescriptionPk(null);
    if (this.subscribe) this.subscribe.unsubscribe();
  }

  //method to get medicine det by medicine id
  getMedDetByMedId() {
    this._individualService.getOrderById(this.user_refNo).subscribe(resp => {
      if (resp.status == 2000) {
        this.cartPrice = 0;
        this.broadcastService.setHeaderOrderItem();
        this.countCartOrders();
        this.prescribedMedicineList = [];
        if (resp.data.length != 0) {
          this.requisitionRefNo = resp.data[0].requisitionRefNo;
          // this.selectedPrescription = [];
          this.cartPrice = resp.data[0].cartItems.map(data => (+data.netAmount)).reduce((a, b) => a + b, 0);
          for (let medicine of resp.data[0].cartItems) {
            this.prescribedMedicineList.push({
              company: medicine.brandName,
              medicineName: medicine.itemName,
              medicineQuantity: medicine.numUnits,
              overallPricePerMedicine: +medicine.netAmount,
              packageSize: medicine.packageSize,
              packageType: medicine.packageType,
              prescriptionRequired: medicine.prescriptionRequired,
              unitPrice: medicine.price,
              product_package: medicine.product_package,
              prescriptionRefNo: medicine.prescriptionRefNo,
              medicineId: medicine.itemPk
            });
            if(!this.isMyPrescriptionCancel && !this.isSelectPrescription) {
              this._individualService.getPrescriptionsByMedicineName({"medicineId": medicine.itemPk,"medicineName": medicine.itemName}).subscribe(respns => {
                if (respns.status == 2000) {
                  if (respns.data.length > 0) {
                    medicine.prescriptionRefNo ? this.getPrescriptionDetailsByAppointmentRefNo(respns.data[0].appointmentRefNo) : '';




                      //if (resp.status == 2000) {
                        //resp.data['source'] = "SBIS";

                        if(this.prescribedMedicineList.length > 0 && !medicine.prescriptionRequired){
                          this.displaySaveBtn = true;
                        }else if(this.prescribedMedicineList.length > 0 && medicine.prescriptionRequired){
                          this.displaySaveBtn = false;
                          this.checkRequired = true;

                        }else{
                          this.displaySaveBtn = false;

                        }

                  } else {


                    if(medicine.prescriptionRefNo) {
                      let query = {
                        'downloadFor': 'PRESCRIPTION',
                        'documentRefNo': medicine.prescriptionRefNo
                      }
                      this._individualService.prescriptionDownload(query).subscribe(rsp => {
                        if (rsp.status == 2000) {
                          let doc: any = {}
                          doc['contentType'] = rsp.data.contentType;
                          doc['downloadImageSrc'] = "data:" + rsp.data.contentType + ";base64," + rsp.data.data;
                          doc['source'] = "UPLOAD";
                          doc['documentRefNo'] = medicine.prescriptionRefNo;
                          doc['prescriptionRefNo'] = medicine.prescriptionRefNo;
                          if (this.prescribedMedicineList.find(x => x.prescriptionRefNo === doc.prescriptionRefNo)) {
                            if (this.selectedPrescription.length > 0) {
                              if (this.selectedPrescription.findIndex(y => y.prescriptionRefNo == doc.prescriptionRefNo) == -1) {
                                this.selectedPrescription.push(doc);
                              }
                            } else {
                              this.selectedPrescription.push(doc);
                            }



                            if(this.prescribedMedicineList.length > 0 && !medicine.prescriptionRequired){
                              this.displaySaveBtn = true;
                            }else if(this.prescribedMedicineList.length > 0 && medicine.prescriptionRequired && this.selectedPrescription.length >0 ){
                              this.displaySaveBtn = true;
                            }else{
                              this.displaySaveBtn = false;
                            }

                          }
                        }
                      });
                    }
                  }
                }
              });
           }
          }
        } else {
          this.requisitionRefNo = null;
          this.displaySaveBtn = false;
        }
      }
    });
  }//end of method

  //negetive value avoid:
  private numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }//end of method


  //method to calculate price
  calculatePrice(element: any, medicineType: any) {
    let quantity;
    let totalMedQty: number;
    let qtyNumVal: number;
    let pricePerPis = element.unitPrice / element.packageSize;
    if (element.sosFlag) {
      quantity = 1;
    }

    else if (medicineType == 'strip') {
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
      // quantity = Math.round(quantity);
    } else {
      quantity = 1;
      pricePerPis = element.unitPrice;
    }
    element['medicineQuantity'] = quantity;
    element['overallPricePerMedicine'] = element.unitPrice * quantity;// quantity * pricePerPis;
    element['pricePerPis'] = pricePerPis;
  }//end of method calculate price

  updatePrice(event, medicine: any, index: number) {
    this.numberOnly(event);
    let selectedPrice = +(event.target.value);
    if (selectedPrice > 10) {
      this.prescribedMedicineList[index].medicineQuantity = 10;
    } else if (selectedPrice == 0) {
      this.prescribedMedicineList[index].medicineQuantity = 1;
    }
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (this.prescriptionPk != null) {
        this.prescribedMedicineList[index].overallPricePerMedicine = event.target.value * this.prescribedMedicineList[index].unitPrice;
        this.cartPrice = this.prescribedMedicineList.map(data => (+data['overallPricePerMedicine'])).reduce((a, b) => a + b, 0);
        this.cardItemCount = this.prescribedMedicineList.map(data => (+data['medicineQuantity'])).reduce((a, b) => a + b, 0);
      } else {
        if (!this.reOrderableMedicine) {
          this.prescribedMedicineList[index].numUnits = medicine.medicineQuantity;
          let medicineList = [];
          this.prescribedMedicineList.forEach(element =>
            medicineList.push({
              itemId: element.medicineId,
              numUnits: element.medicineQuantity,
              prescriptionRequired: element.prescriptionRequired,
              medicine: element.medicineName,
              discount: 0.00,
              tax: 0.00,
              price: (+element.unitPrice),
              netAmount: element.medicineQuantity * (+element.unitPrice),
              patientRefNo: this.user_refNo,
              prescriptionRefNo: element.prescriptionRefNo ? element.prescriptionRefNo : null,
            }));
          let cartItems = [];
          for (let item of medicineList) {
            var findObj = cartItems.find(cartitem => cartitem.itemId == item.itemId);
            if (findObj) {
              findObj.numUnits = findObj.numUnits + item.numUnits;
              findObj.netAmount = findObj.netAmount + item.netAmount;
            } else {
              cartItems.push(item);
            }
          }
          let queryForOrderMedicine = {
            'userRefNo': this.user_refNo,
            // 'patientPk': this.user_id,
            'requisitionRefNo': this.requisitionRefNo ? this.requisitionRefNo : null,
            'netAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
            'grossAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
            'orderItems': cartItems
          }
          this._individualService.saveOrder(queryForOrderMedicine).subscribe((resp) => {
            if (resp.status == 2000) {
              this.getMedDetByMedId();
              // console.log(this.prescribedMedicineList);
              //this.prescribedMedicineList.push(prescribedMed);
            }
          });
        } else {
          this.resMedDetEl.orderDetails.forEach((element, i) => {
            if (i == index) {
              this.cartPrice = this.cartPrice - medicine.overallPricePerMedicine;
              medicine['overallPricePerMedicine'] = medicine['medicineQuantity'] * medicine['unitPrice'];// medicine['pricePerPis'];                  
              this.cartPrice = this.cartPrice + medicine['overallPricePerMedicine'];
            }
          });
        }
      }
    } else {
      let findObj = this.prescribedMedicineList.find(x => x.medicineId === medicine.medicineId);
      if (findObj) {
        this.prescribedMedicineList[index].numUnits = medicine.medicineQuantity;
        this.prescribedMedicineList[index].overallPricePerMedicine = this.prescribedMedicineList[index].unitPrice * medicine.medicineQuantity;
      }
      this.cartPrice = this.prescribedMedicineList.map(data => (+data['overallPricePerMedicine'])).reduce((a, b) => a + b, 0);
      this.countCartOrders();
    }
  }//end of method

  removeMedicine(event, medicineList, index) {
    medicineList.splice(index, 1);

    let cartPricelocal: number = 0;//    
    let totalItems: number = 0;
    this.resMedDetEl.orderDetails.forEach((element, index) => {
      totalItems = totalItems + element.cartItems.length;
      if (element.cartItems.length > 0) {
        element.cartItems.forEach(cartitemel => {
          cartPricelocal = cartPricelocal + parseInt(cartitemel.overallPricePerMedicine);
        })
      }
    })
    this.cartPrice = cartPricelocal;
    this.cartItem = totalItems;//medicineList.length;
  }

  updatePriceAndCart(event, medicine, index) {
    if (!this.reOrderableMedicine) {
      // console.log(this.prescribedMedicineList);
      this.prescribedMedicineList.splice(index, 1);
      this.cartItem = this.prescribedMedicineList.length;
      this.cartPrice = 0;
      this.prescribedMedicineList.forEach(element => {
        this.cartPrice = this.cartPrice + element.overallPricePerMedicine;
      });
    } else {
      this.resMedDetEl.orderDetails.forEach((element, ind) => {
        let key = element.brandName + element.company + element.itemName + element.itemPk + element.medicineId + element.medicineQuantity;
        let medicinekey = medicine.brandName + medicine.company + medicine.itemName + medicine.itemPk + medicine.medicineId + medicine.medicineQuantity;
        if (key == medicinekey) {
          this.resMedDetEl.orderDetails.splice(medicine, ind);
        }
      });
      this.cartPrice = 0;
      // });
    }
  }//end of method

  serviceCallForMedicine(query) {
    this._individualService.saveOrderMultiple(query).subscribe((resp) => {
      if (resp.status === 2000) {
        this.router.navigate(['individual/fetch-carted-medicine']);
      }
    });
  }

  queryArr: any[] = [];
  saveReOrder() {
    // console.log("saveReOrder");
    //console.log(JSON.stringify(this.resMedDetEl.orderDetails))
    let count = 0
    this.resMedDetEl.orderDetails.forEach(item => {
      count++;
      let user = JSON.parse(localStorage.getItem('user'));

      let medicineList = [];
      item.cartItems.forEach(ctrItem => {
        medicineList.push({
          itemId: ctrItem.medicineId,
          numUnits: ctrItem.medicineQuantity,
          price: ctrItem.unitPrice,
          discount: 0.00,
          tax: 0.00,
          netAmount: ctrItem.netAmount,
          patientRefNo: user.refNo
        })
      });

      this.saveOrderQuery = {
        userRefNo: user.refNo,
        // patientPk: user.id,
        prescriptionPk: item.prescriptionPk,
        netAmount: medicineList.map(data => (+parseInt(data['price']))).reduce((a, b) => a + b, 0),
        taxAmount: 0.00,
        grossAmount: medicineList.map(data => (+parseInt(data['price']))).reduce((a, b) => a + b, 0),
        discount: 0.00,
        orderItems: []
      }

      this.saveOrderQuery["orderItems"] = medicineList;
      this.queryArr.push(this.saveOrderQuery);
    });
    if (count == this.resMedDetEl.orderDetails.length) {
      this.serviceCallForMedicine(this.queryArr);
      this.paymentData["payableAmount"] = this.cartPrice;
      this.paymentData["transactionType"] = 'PHARMACY';
    }
  }//end of method

  saveOrderV2() {
    if (this.isReOrder) {
      this.saveReOrder();
      return;
    }
    this.paymentData = null;
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      let medicineList = [];

      this.prescribedMedicineList.forEach(element =>
        medicineList.push({
          itemId: element.medicineId,
          numUnits: element.medicineQuantity,
          prescriptionRequired: element.prescriptionRequired,
          medicine: element.medicineName,
          discount: 0.00,
          tax: 0.00,
          netAmount: element.overallPricePerMedicine,
          patientRefNo: user.refNo,
          prescriptionRefNo: element.prescriptionRefNo,
        }));
      //console.log(medicineList);
      // for(let medicine of medicineList) {
      //   if(medicine.prescriptionRequired == true && medicine.prescriptionRefNo == null) {
      //     this.toastService.showI18nToast('please select a prescription to buy this medicine', 'warning');
      //     return;
      //   }
      // }
      //GetSet.setMedicineDetails(medicineList);
      this._individualService.getOrderById(this.user_refNo).subscribe((cartOrderDetails) => {
        if (cartOrderDetails.status == 2000) {
          let cartItems = [];
          let query;
          if (cartOrderDetails.data.length > 0) {
            for (let cartItem of cartOrderDetails.data[0].cartItems) {
              query = {
                'itemId': cartItem.itemPk,
                'discount': +(cartItem.discount),
                'medicine': cartItem.itemName,
                'netAmount': +(cartItem.netAmount),
                'numUnits': cartItem.numUnits,
                'patientRefNo': user.refNo,
                'prescriptionRefNo': null,
                'tax': +(cartItem.tax)
              }
              cartItems.push(query);
            }
          }
          for (let item of medicineList) {
            for (let prescription of this.selectedPrescription) {
              if (prescription.source == 'SBIS') {
                if (prescription.medicationDTOList.find(x => x.medicineId == item.itemId)) {
                  item.prescriptionRefNo = prescription.prescriptionRefNo;
                }
              } else {
                //do nothing
              }
            }
          }
          for (let item of medicineList) {
            var findObj = cartItems.find(cartitem => cartitem.itemId == item.itemId);
            if (findObj) {
              findObj.numUnits = findObj.numUnits + item.numUnits;
              findObj.netAmount = findObj.netAmount + item.netAmount;
            } else {
              cartItems.push(item);
            }
          }
          let index: number = 0;
          for (let item of medicineList) {
            if (item.prescriptionRequired && item.prescriptionRefNo == null && this.selectedPrescription.length > 0) {
              if (this.selectedPrescription.find(x => x.source === 'UPLOAD')) {
                let uploadIndex = this.selectedPrescription.findIndex(x => x.source == 'UPLOAD');
                for (let medicine of cartItems) {
                  if (!medicine.prescriptionRefNo) {
                    cartItems[index].prescriptionRefNo = this.selectedPrescription[uploadIndex].prescriptionRefNo;
                  }
                  index = index + 1;
                }
              } else if (!item.prescriptionRequired && item.prescriptionRefNo == null && this.selectedPrescription.length > 0) {
                if (this.selectedPrescription.find(x => x.source === 'UPLOAD')) {
                  let uploadIndex = this.selectedPrescription.findIndex(x => x.source == 'UPLOAD');
                  for (let medicine of cartItems) {
                    if (!medicine.prescriptionRefNo) {
                      cartItems[index].prescriptionRefNo = this.selectedPrescription[uploadIndex].prescriptionRefNo;
                    }
                    index = index + 1;
                  }
                }
              } else {
                this.toastService.showI18nToast('Medicine not available on selected prescription', 'error');
                return;
              }
            }
            else if (item.prescriptionRequired && item.prescriptionRefNo == null && this.selectedPrescription.length == 0) {
              this.toastService.showI18nToast('Select a prescription for a prescription required medicine', 'warning');
              return;
            }
          }
          let queryForOrderMedicine = {
            'userRefNo': this.user_refNo,
            // 'patientPk': this.user_id,
            'requisitionRefNo': cartOrderDetails.data.length > 0 ? cartOrderDetails.data[0].requisitionRefNo : null,
            'netAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
            'grossAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
            'orderItems': cartItems
          }
          this._individualService.saveOrder(queryForOrderMedicine).subscribe((resp) => {
            if (resp.status == 2000) {
              this.router.navigate(['individual/fetch-carted-medicine']);
            }
          });
        }
      });
    } else {
      let medicineList = [];
      this.prescribedMedicineList.forEach(element =>
        medicineList.push({
          itemId: element.medicineId,
          numUnits: element.medicineQuantity,
          price: element.unitPrice,
          discount: 0.00,
          tax: 0.00,
          netAmount: element.overallPricePerMedicine
        }));
      this.orderMedicineQuery = {
        // userPk: user.id,
        // patientPk: user.id,
        netAmount: this.cartPrice,
        taxAmount: 0.00,
        grossAmount: this.cartPrice,
        discount: 0.00,
        orderItems: medicineList
      }
      this.orderMedicinePage = true;
      GetSet.setOrderMedicine(this.orderMedicinePage);
      GetSet.setOrderMedicineQuery(this.orderMedicineQuery);
      this.broadcastService.setLogin();
      return;
    }
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
  }//end of search method

  //method onClickAddIconOnAddNewMedicineModal
  onClickMedAddByMedSearchDrpDwn(selectedMedicine) {
    this.addedMedicine = [];
    let user = JSON.parse(localStorage.getItem('user'));
    localStorage.setItem("Medication", this.prescribedMedicineList);
    let testMedObj: any = {};
    let findIndex: number = this.prescribedMedicineList.findIndex(findObj => findObj.medicineId == selectedMedicine.medicineId);
    if (findIndex != -1) {
      this.prescribedMedicineList[findIndex].medicineQuantity = this.prescribedMedicineList[findIndex].medicineQuantity + 1;
      this.prescribedMedicineList[findIndex].overallPricePerMedicine = this.prescribedMedicineList[findIndex].unitPrice * this.prescribedMedicineList[findIndex].medicineQuantity
      //if(user) {
      let medicineList = [];
      this.prescribedMedicineList.forEach(element =>
        medicineList.push({
          itemId: element.medicineId,
          numUnits: element.medicineQuantity,
          prescriptionRequired: element.prescriptionRequired,
          medicine: element.medicineName,
          price: +(element.unitPrice),
          discount: 0.00,
          tax: 0.00,
          netAmount: element.overallPricePerMedicine,
          patientRefNo: this.user_refNo,
          prescriptionRefNo: element.prescriptionRefNo,
        }));
      let cartItems = [];
      for (let item of medicineList) {
        var findObj = cartItems.find(cartitem => cartitem.itemId == item.itemId);
        if (findObj) {
          findObj.numUnits = findObj.numUnits + item.numUnits;
          findObj.netAmount = findObj.netAmount + item.netAmount;
        } else {
          cartItems.push(item);
        }
      }
      let queryForOrderMedicine = {
        'userRefNo': this.user_refNo,
        // 'patientPk': this.user_id,
        'requisitionRefNo': this.requisitionRefNo ? this.requisitionRefNo : null,
        'netAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
        'grossAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
        'orderItems': cartItems
      }
      this._individualService.saveOrder(queryForOrderMedicine).subscribe((resp) => {
        if (resp.status == 2000) {
          this.getMedDetByMedId();
          // console.log(this.prescribedMedicineList);
          //this.prescribedMedicineList.push(prescribedMed);
        }
      });
    } else {
      if (user) {
        this.cartItem = this.cartItem + 1;
        testMedObj['medicineName'] = selectedMedicine.brandName;
        testMedObj['medicineId'] = selectedMedicine.medicineId;
        testMedObj['company'] = selectedMedicine.company;
        testMedObj['packageSize'] = selectedMedicine.packageSize;
        testMedObj['packageType'] = selectedMedicine.packageType;
        testMedObj['unitPrice'] = selectedMedicine.price;
        selectedMedicine.unitPrice = selectedMedicine.price;
        selectedMedicine.prescriptionType = 'selfOrder';//set pres type value to selforder
        this.calculatePrice(selectedMedicine, selectedMedicine.packageType);//to calculate price
        testMedObj['medicineQuantity'] = 1;//selectedMedicine.medQty;
        testMedObj['overallPricePerMedicine'] = 1 * parseFloat(selectedMedicine.price);//selectedMedicine.pricePerPiece;//element.price;
        testMedObj['pricePerPis'] = selectedMedicine.pricePerPiece;
        testMedObj["prescriptionRequired"] = selectedMedicine.prescriptionRequired;
        testMedObj["product_package"] = selectedMedicine.product_package;
        this.cartPrice = this.cartPrice + testMedObj.overallPricePerMedicine;//element.overallPricePerMedicine;
        if (!this.isReOrder) {
          // this.getAllPrescriptionsByMedicine(selectedMedicine);
          this._individualService.getPrescriptionsByMedicineName({
            "medicineId": selectedMedicine.medicineId,
            "medicineName": selectedMedicine.brandName
          }).subscribe(resp => {
            if (resp.status == 2000) {
              if (resp.data.length > 0) {
                testMedObj['prescriptionRefNo'] = resp.data[0].prescriptionRefNo;
                this.currentPrescriptionDetails = resp.data;
                this.getPrescriptionDetailsByAppointmentRefNo(this.currentPrescriptionDetails[0].appointmentRefNo);
              } else {
                testMedObj['prescriptionRefNo'] = null;
                //this.getUploadedPrescriptions();
              }
              this.addedMedicine.push(testMedObj);
              console.log(this.addedMedicine);
              this._individualService.getOrderById(this.user_refNo).subscribe(resp => {
                if (resp.status == 2000) {
                  if (resp.data.length != 0) {
                    this.requisitionRefNo = resp.data[0].requisitionRefNo;
                    for (let item of resp.data) {
                      item.cartItems.forEach(element => {
                        this.addedMedicine.push({
                          company: element.brandName,
                          medicineName: element.itemName,
                          medicineQuantity: element.numUnits,
                          overallPricePerMedicine: +element.netAmount,
                          packageSize: element.packageSize,
                          packageType: element.packageType,
                          prescriptionRequired: element.prescriptionRequired,
                          unitPrice: element.price,
                          product_package: element.product_package,
                          prescriptionRefNo: element.prescriptionRefNo,
                          medicineId: element.itemPk
                        });
                      });
                    }
                  } else {
                    this.requisitionRefNo = null;
                  }
                  //updated by shanu 19th june
                  let medicineList = [];
                  this.addedMedicine.forEach(element =>
                    medicineList.push({
                      itemId: element.medicineId,
                      numUnits: element.medicineQuantity,
                      prescriptionRequired: element.prescriptionRequired,
                      medicine: element.medicineName,
                      price: +(element.unitPrice),
                      discount: 0.00,
                      tax: 0.00,
                      netAmount: element.overallPricePerMedicine,
                      patientRefNo: this.user_refNo,
                      prescriptionRefNo: element.prescriptionRefNo,
                    }));
                  let cartItems = [];
                  for (let item of medicineList) {
                    for (let prescription of this.selectedPrescription) {
                      if (prescription.source == 'SBIS') {
                        if (prescription.medicationDTOList.find(x => x.medicineId == item.itemId)) {
                          item.prescriptionRefNo = prescription.prescriptionRefNo;
                        }
                      } else {
                        //do nothing
                      }
                    }
                  }
                  for (let item of medicineList) {
                    var findObj = cartItems.find(cartitem => cartitem.itemId == item.itemId);
                    if (findObj) {
                      findObj.numUnits = findObj.numUnits + item.numUnits;
                      findObj.netAmount = findObj.netAmount + item.netAmount;
                    } else {
                      cartItems.push(item);
                    }
                  }
                  let index: number = 0;
                  for (let item of medicineList) {
                    if (item.prescriptionRequired && item.prescriptionRefNo == null && this.selectedPrescription.length > 0) {
                      if (this.selectedPrescription.find(x => x.source === 'UPLOAD')) {
                        let uploadIndex = this.selectedPrescription.findIndex(x => x.source == 'UPLOAD');
                        for (let medicine of cartItems) {
                          if (!medicine.prescriptionRefNo) {
                            cartItems[index].prescriptionRefNo = this.selectedPrescription[uploadIndex].prescriptionRefNo;
                          }
                          index = index + 1;
                        }
                      } else if (!item.prescriptionRequired && item.prescriptionRefNo == null && this.selectedPrescription.length > 0) {
                        if (this.selectedPrescription.find(x => x.source === 'UPLOAD')) {
                          let uploadIndex = this.selectedPrescription.findIndex(x => x.source == 'UPLOAD');
                          for (let medicine of cartItems) {
                            if (!medicine.prescriptionRefNo) {
                              cartItems[index].prescriptionRefNo = this.selectedPrescription[uploadIndex].prescriptionRefNo;
                            }
                            index = index + 1;
                          }
                        }
                      }
                      // else {
                      //   this.toastService.showI18nToast('Medicine not available on selected prescription', 'error');
                      //   return;
                      // }
                    }
                    // else if (item.prescriptionRequired && item.prescriptionRefNo == null && this.selectedPrescription.length == 0) {
                    //   this.toastService.showI18nToast('Select a prescription for a prescription required medicine', 'warning');
                    //   return;
                    // }
                  }
                  let queryForOrderMedicine = {
                    'userRefNo': this.user_refNo,
                    // 'patientPk': this.user_id,
                    'requisitionRefNo': this.requisitionRefNo ? this.requisitionRefNo : null,
                    'netAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
                    'grossAmount': cartItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
                    'orderItems': cartItems
                  }
                  this._individualService.saveOrder(queryForOrderMedicine).subscribe((resp) => {
                    if (resp.status == 2000) {
                      this.getMedDetByMedId();
                      // console.log(this.prescribedMedicineList);
                      //this.prescribedMedicineList.push(prescribedMed);
                    }
                  });
                }
              });
            }
          });
          // for (let prescription of this.prescriptionsForMe) {
          //   if (prescription.source == "SBIS") {
          //     for (let medicine of prescription.medicationDTOList) {
          //       if (medicine.medicineId == testMedObj.medicineId) {
          //         if (this.selectedPrescription.length == 0) {
          //           this.selectedPrescription.push(prescription);
          //           testMedObj['prescriptionRefNo'] = prescription.prescriptionRefNo;
          //         } else {
          //           if (this.selectedPrescription.find(x => x.prescriptionRefNo === testMedObj.prescriptionRefNo)) {
          //             // do nothing
          //           } else {
          //             this.selectedPrescription.push(prescription);
          //             testMedObj['prescriptionRefNo'] = prescription.prescriptionRefNo;
          //           }
          //         }
          //       }
          //     }
          //   }
          // }
        } else {
          let filterArray = this.resMedDetEl.orderDetails.filter(x => {
            return x.cartItems.filter(y => y['medicineId'] == testMedObj['medicineId']).length > 0;
          })[0];
          if (filterArray) {
            let medObj = filterArray.cartItems.filter(y => y['medicineId'] == testMedObj['medicineId'])[0];
            medObj.numUnits = medObj.numUnits + testMedObj['medicineQuantity'];
            medObj.medicineQuantity = medObj.medicineQuantity + testMedObj['medicineQuantity'];

            //  medObj.unitPrice= parseInt(medObj.unitPrice)+ parseInt(testMedObj['unitPrice']);
            medObj.unitPrice = parseInt(testMedObj['unitPrice']);
            medObj.price = parseInt(medObj.price) + parseInt(testMedObj['unitPrice']);
            medObj.overallPricePerMedicine = parseInt(medObj.overallPricePerMedicine) + parseInt(testMedObj['unitPrice']);

            filterArray["netAmount"] = filterArray.cartItems.map(data => (+parseInt(data['price']))).reduce((a, b) => a + b, 0);
            filterArray["grossAmount"] = filterArray.cartItems.map(data => (+parseInt(data['price']))).reduce((a, b) => a + b, 0);
          } else {
            let filterByprescriptionPk = this.resMedDetEl.orderDetails.filter(x => Number(x["prescriptionPk"]) == Number(this.prescriptionPk))[0];
            if (filterByprescriptionPk) {
              filterByprescriptionPk.cartItems.push({
                "requsitionPk": null,
                "itemPk": testMedObj['medicineId'],
                "itemName": testMedObj['medicineName'],
                "brandName": testMedObj['medicineName'],
                "packageSize": testMedObj['packageSize'],
                "packageType": testMedObj['packageType'],
                "itemType": null,
                "numUnits": testMedObj['medicineQuantity'],
                "price": testMedObj['unitPrice'],
                "discount": "0.00",
                "tax": "0.00",
                "netAmount": "0.00",
                "prescriptionRequired": testMedObj["prescriptionRequired"],
                "product_package": testMedObj["product_package"],
                "product_composition": "Paracetamol / Acetaminophen (1000mg)",
                "medicineId": testMedObj['medicineId'],
                "medicineName": testMedObj['medicineName'],
                "company": testMedObj['medicineName'],
                "unitPrice": testMedObj['unitPrice'],
                "medicineQuantity": testMedObj['medicineQuantity'],
                "overallPricePerMedicine": testMedObj['unitPrice']
              })
              filterByprescriptionPk["netAmount"] = filterByprescriptionPk.cartItems.map(data => (+parseInt(data['price']))).reduce((a, b) => a + b, 0);
              filterByprescriptionPk["grossAmount"] = filterByprescriptionPk.cartItems.map(data => (+parseInt(data['price']))).reduce((a, b) => a + b, 0);
            } else {
              let newObj = {
                "requisitionRefNo": null,
                "prescriptionPk": null,
                "cartRefNo": null,
                "grossAmount": "0.00",
                "discount": "0.00",
                "tax": "0.00",
                "netAmount": "0.00",
                "cartItems": [{
                  "requsitionPk": null,
                  "itemPk": testMedObj['medicineId'],
                  "itemName": testMedObj['medicineName'],
                  "brandName": testMedObj['medicineName'],
                  "packageSize": testMedObj['packageSize'],
                  "packageType": testMedObj['packageType'],
                  "itemType": null,
                  "numUnits": testMedObj['medicineQuantity'],
                  "price": testMedObj['unitPrice'],
                  "discount": "0.00",
                  "tax": "0.00",
                  "netAmount": "0.00",
                  "prescriptionRequired": testMedObj["prescriptionRequired"],
                  "product_package": testMedObj["product_package"],
                  "product_composition": "Paracetamol / Acetaminophen (1000mg)",
                  "medicineId": testMedObj['medicineId'],
                  "medicineName": testMedObj['medicineName'],
                  "company": testMedObj['medicineName'],
                  "unitPrice": testMedObj['unitPrice'],
                  "medicineQuantity": testMedObj['medicineQuantity'],
                  "overallPricePerMedicine": testMedObj['unitPrice']
                }]
              }
              this.resMedDetEl.orderDetails.push(newObj);
            }
          }
        }
      } else {
        this.prescribedMedicineList.push({
          company: selectedMedicine.company,
          medicineName: selectedMedicine.brandName,
          medicineQuantity: 1,
          overallPricePerMedicine: +selectedMedicine.price,
          packageSize: selectedMedicine.packageSize,
          packageType: selectedMedicine.packageType,
          prescriptionRequired: selectedMedicine.prescriptionRequired,
          unitPrice: +selectedMedicine.price,
          product_package: selectedMedicine.product_package,
          prescriptionRefNo: null,
          medicineId: selectedMedicine.medicineId
        });
        this.cartPrice = this.prescribedMedicineList.map(data => (+data['overallPricePerMedicine'])).reduce((a, b) => a + b, 0);
        this.countCartOrders();
      }
    }
  }//end of method

  //method to disable ordermedicine button
  orderMedDisableMethod(): boolean {
    let disableflg: boolean = true;
    if (!this.reOrderableMedicine) {
      (this.prescribedMedicineList.length > 0) ? disableflg = false : disableflg = true;
      return disableflg;
    } else {
      if (this.cartItem > 0) {
        disableflg = false;
      }
    }
  }//end of method

  selectPrescription(selectedPrescription) {
    this.isMyPrescriptionCancel = false;
    this.isSelectPrescription = true;
    if (this.selectedPrescription.length > 0) {
      if (this.selectedPrescription.find(x => x['prescriptionRefNo'] === selectedPrescription.prescriptionRefNo)) {
        //do nothing
      } else if (this.selectedPrescription.find(y => y.source === 'UPLOAD')) {
        //do nothing
      }
      else {
        this.selectedPrescription.push(selectedPrescription);
      }
    } else {
      this.selectedPrescription.push(selectedPrescription);
      this.displaySaveBtn = true;
    }
    let index: number = 0;
    for (let medicine of this.prescribedMedicineList) {
      for (let prescription of this.selectedPrescription) {
        if (prescription.source == 'SBIS') {
          for (let presMedicine of prescription.medicationDTOList) {
            if (presMedicine.medicineId == medicine.medicineId && medicine.prescriptionRefNo == null) {
              this.prescribedMedicineList[index].prescriptionRefNo = prescription.prescriptionRefNo;
            }
          }
          // this.getAndShowMedicine();
        } else {
          if (medicine.prescriptionRequired && medicine.prescriptionRefNo == null) {
            this.prescribedMedicineList[index].prescriptionRefNo = prescription.prescriptionRefNo;
          }
        }
      }
      index = index + 1;
    }
    this.getAndShowMedicine();
    let myPrescription = [];
    this.prescriptionsForMe.forEach((element) => {
      if(element.source != 'SBIS') {
        myPrescription.push(element);
      }
    });
    this.prescriptionsForMe = myPrescription;
  }

  cancelPrescription(index, prescription) {
    let i: number = 0;
    let element = this.selectedPrescription[index].prescriptionRefNo;
    let medicineDetails = this.prescribedMedicineList.find(x => x.prescriptionRefNo == prescription.prescriptionRefNo);
    console.log(medicineDetails);
    if(prescription.source == 'SBIS') {
      this.getAllPrescriptionsByMedicine(medicineDetails);
    }
    for (let medicine of this.prescribedMedicineList) {
      if (medicine.prescriptionRefNo == element) {
        this.prescribedMedicineList[i].prescriptionRefNo = null;
      }
      i = i + 1;
    }
    console.log(this.prescribedMedicineList);
    
    this.selectedPrescription.splice(index, 1);
    console.log(this.selectedPrescription.length);
    if(this.selectedPrescription.length == 0){
      this.displaySaveBtn = false;
    }
    this.isMyPrescriptionCancel = true;
    this.getAndShowMedicine();
    if (this.prescriptionsForMe.length > 0) {
      if ((this.prescriptionsForMe.findIndex(x => x.prescriptionRefNo == prescription.prescriptionRefNo)) == -1) {
        this.prescriptionsForMe.push(prescription);
      }
    } else {
      this.prescriptionsForMe.push(prescription);
    }
  }

  getAndShowMedicine() {
    let medicineList = [];
    this.prescribedMedicineList.forEach(element => {
      medicineList.push({
        itemId: element.medicineId,
        numUnits: element.medicineQuantity,
        prescriptionRequired: element.prescriptionRequired,
        medicine: element.medicineName,
        discount: 0.00,
        tax: 0.00,
        netAmount: element.overallPricePerMedicine,
        patientRefNo: this.user_refNo,
        prescriptionRefNo: element.prescriptionRefNo,
      });
    });
    let queryForOrderMedicine = {
      'userRefNo': this.user_refNo,
      // 'patientPk': this.user_id,
      'requisitionRefNo': this.requisitionRefNo ? this.requisitionRefNo : null,
      'netAmount': medicineList.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
      'grossAmount': medicineList.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
      'orderItems': medicineList
    }
    this._individualService.saveOrder(queryForOrderMedicine).subscribe((resp) => {
      if (resp.status == 2000) {
        this.getMedDetByMedId();
      }
    });
  }

  deleteMedicine(medicine, itemIndex) {
    let orderItems = [];
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (this.prescriptionPk != null) {
        this.prescribedMedicineList.splice(itemIndex, 1);
        this.cartPrice = this.prescribedMedicineList.map(data => (+data['overallPricePerMedicine'])).reduce((a, b) => a + b, 0);
        this.cardItemCount = this.prescribedMedicineList.map(data => (+data['medicineQuantity'])).reduce((a, b) => a + b, 0);
      } else {
        this.prescribedMedicineList.forEach(function (item, i) {
          if (itemIndex != i) {
            let itemQuery = {
              "itemId": item.medicineId,
              "numUnits": item.medicineQuantity,
              "price": item.unitPrice,
              "discount": 0,
              "tax": 0,
              "netAmount": item.overallPricePerMedicine,
              "patientRefNo": user.refNo,
              "prescriptionRefNo": item.prescriptionRefNo,
            }
            orderItems.push(itemQuery);
          }
        });
        if (confirm("Are you sure you want to delete this medicine from your cart items ?")) {
          let updateOrder = {
            "requisitionRefNo": this.requisitionRefNo ? this.requisitionRefNo : null,
            "userRefNo": user.refNo,
            // "patientPk": this.user_id,
            "netAmount": orderItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
            "taxAmount": 0.00,
            "grossAmount": orderItems.map(data => (+data['netAmount'])).reduce((a, b) => a + b, 0),
            "discount": 0.00,
            "orderItems": orderItems
          }
          this._individualService.saveOrder(updateOrder).subscribe((resp) => {
            if (resp.status === 2000) {
              this.getMedDetByMedId();
              let selectedPrescriptionForCurrentMedicine = this.selectedPrescription.findIndex(x => x.prescriptionRefNo == medicine.prescriptionRefNo)
              if (selectedPrescriptionForCurrentMedicine != -1) {
                this.selectedPrescription.splice(selectedPrescriptionForCurrentMedicine, 1);
              }
            }
          });
        }
      }

    } else {
      console.log(medicine);
      this.prescribedMedicineList.splice(itemIndex, 1);
      this.cartPrice = this.prescribedMedicineList.map(data => (+data['overallPricePerMedicine'])).reduce((a, b) => a + b, 0);
      this.countCartOrders();
    }
  }//end of method

  countCartOrders() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      this.apiService.CountOrderById.getByPath(user.refNo).subscribe((result) => {
        this.cardItemCount = result.data;
      });
    } else {
      this.cardItemCount = this.prescribedMedicineList.map(data => (+data['medicineQuantity'])).reduce((a, b) => a + b, 0);
    }
  }//end of count orders

  placeOrder() {
    let user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      if (this.prescriptionPk != null) {
        console.log(this.prescribedMedicineList);
        let medicine = [];
        this.prescribedMedicineList.forEach(element => {
          medicine.push({
            itemId: element.itemId,
            numUnits: element.medicineQuantity,
            prescriptionRequired: element.prescriptionRequired,
            medicine: element.medicine,
            discount: element.discount,
            tax: element.tax,
            netAmount: element.overallPricePerMedicine,
            patientRefNo: element.patientRefNo,
            prescriptionRefNo: element.prescriptionRefNo
          });
        });
        let query = {
          'userRefNo': this.user_refNo,
          'requisitionRefNo': null,
          'netAmount': this.prescribedMedicineList.map(data => (+data['overallPricePerMedicine'])).reduce((a, b) => a + b, 0),
          'grossAmount': this.prescribedMedicineList.map(data => (+data['overallPricePerMedicine'])).reduce((a, b) => a + b, 0),
          'orderItems': medicine
        }
        this._individualService.saveOrder(query).subscribe((resp) => {
          if (resp.status == 2000) {
            this.getOrderByIdAndRoute();
          }
          // this.router.navigate(['/individual/deliver-address', this.cartPrice]);
          // localStorage.setItem("cartRefNum", JSON.stringify(resp.data.cartRefNo));
        });
      } else {
        for (let cartedMedicine of this.prescribedMedicineList) {
          if (cartedMedicine.prescriptionRequired && !cartedMedicine.prescriptionRefNo) {
            if (this.selectedPrescription.length != 0) {
              this.toastService.showI18nToast('Your medicine does not available on your selected prescription', 'error');
              return;
            } else {
              this.toastService.showI18nToast('please select a prescription to buy this medicine', 'warning');
              return;
            }
          }
        }
        this.getOrderByIdAndRoute();
      }
    } else {
      let medicineList = [];
      this.prescribedMedicineList.forEach(element =>
        medicineList.push({
          itemId: element.medicineId,
          numUnits: element.medicineQuantity,
          price: element.unitPrice,
          discount: 0.00,
          tax: 0.00,
          netAmount: element.overallPricePerMedicine,
          prescriptionRequired: element.prescriptionRequired,
          prescriptionRefNo: null
        }));
      this.orderMedicineQuery = {
        // userPk: user.id,
        // patientPk: user.id,
        netAmount: this.cartPrice,
        taxAmount: 0.00,
        grossAmount: this.cartPrice,
        discount: 0.00,
        orderItems: medicineList
      }
      this.orderMedicinePage = true;
      GetSet.setOrderMedicine(this.orderMedicinePage);
      GetSet.setOrderMedicineQuery(this.orderMedicineQuery);
      this.broadcastService.setLogin();
      return;
    }
  }//end of method

  uploadModal() {
    this.bindPationNameList();
    this.uploadForm.patchValue({
      'documents': null
    });
    this.uploadForm.reset();
    this.uploadForm.controls.date.setValue(new Date());
    this.uploadForm.controls.fileUploadFor.setValue(SBISConstants.DOCUMENT_TYPE_CONST.PRESCRIPTION);
    this.modalRef = this.bsModalService.show(this.prescriptionUpload, { class: 'modal-lg' });
  }

  getOrderByIdAndRoute() {
    this.cartReferenceNumber = [];
    this._individualService.getOrderById(this.user_refNo).subscribe((result) => {
      if (result.status == 2000) {
        for (let cartRefNumber of result.data) {
          this.cartReferenceNumber.push(cartRefNumber.cartRefNo);
        }
        console.log(this.cartReferenceNumber);
        localStorage.setItem("cartRefNum", JSON.stringify(this.cartReferenceNumber));
        this.router.navigate(['/individual/deliver-address', this.cartPrice]);
      }
      //this.cartData = result.data;
    });
  }

  onSubmit() {
    this.uploadForm.patchValue({
      isSubmit: true
    });

    if (this.uploadForm.invalid) {
      return;
    }
    let valueData = this.uploadForm.value;

    let formdata = new FormData();
    let prescriptionFileUpload = JSON.stringify({
      "forRefNo": valueData.forUserPk,
      "byRefNo": this.user_refNo,
      "doctorName": valueData.doctorName,
      "fileUploadFor": valueData.fileUploadFor,
      "uploadDate": valueData.date
    });

    formdata.append('file', valueData.file);
    formdata.append('document', prescriptionFileUpload);


    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status == 2000) {
          this.modalRef.hide();
          this.toastService.showI18nToast('MY_PRESCRIPTION_TOAST.PRESCRIPTION_UPLOADED', 'success');
          // this.getPrescriptions();
        } else {
          this.toastService.showI18nToast(response.message, 'error');
        }
      }
    });
  }

  saveDocument(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {
      // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);

    //return this.apiService.UploadProfiePhoto.upload(formData);
  }

  prescriptionFileSelected(event) {
    this.uploadForm.patchValue({
      file: event.target.files[0]
    });
  }

  bindPationNameList() {
    this.patientNamelist = [];
    //do nothing
    let user = JSON.parse(localStorage.getItem('user'));
    let query = {
      forUserName: user.userName,
      userRefNo: user.refNo,
      selected: false
    }
    this.patientNamelist.push(query);
  }

  getAllPrescriptionsByMedicine(selectedMedicine) {
    let query = {
      "medicineId": selectedMedicine.medicineId,
      "medicineName": selectedMedicine.medicineName,
      "fetchAll": true
    }
    this._individualService.getPrescriptionsByMedicineName(query).subscribe(resp => {
      if (resp.status == 2000) {
        this.currentPrescriptionDetails = resp.data;
        this.currentPrescriptionDetails.forEach(element => {
          if(this.prescriptionsForMe.length > 0) {
            if(this.prescriptionsForMe.findIndex(x => x.prescriptionRefNo === element.prescriptionRefNo) == -1) {
              this._docService.GetprescriptionByAppoRefV2({ "appointmentRef": element.appointmentRefNo }).subscribe((result) => {
                if (result.status == 2000) {
                  this.isPrescription = true;
                  if (result.data.medicationDTOList.length != 0) {
                    result.data['prescriptionRefNo'] = element.prescriptionRefNo;
                    result.data['appointmentRefNo'] = element.appointmentRefNo;
                    result.data['source'] = "SBIS";
                    this.prescriptionsForMe.push(result.data);
                  }
                }
              });
            }
          } else {
            this._docService.GetprescriptionByAppoRefV2({ "appointmentRef": element.appointmentRefNo }).subscribe((result) => {
              if (result.status == 2000) {
                this.isPrescription = true;
                if (result.data.medicationDTOList.length != 0) {
                  result.data['prescriptionRefNo'] = element.prescriptionRefNo;
                  result.data['appointmentRefNo'] = element.appointmentRefNo;
                  result.data['source'] = "SBIS";
                  this.prescriptionsForMe.push(result.data);
                }
              }
            });
          }
        });
      }
    });
  }

  getPrescriptionDetailsByAppointmentRefNo(appointmentRefNo) {
    this._docService.GetprescriptionByAppoRefV2({ "appointmentRef": appointmentRefNo }).subscribe(resp => {
      if (resp.status == 2000) {
        resp.data['source'] = "SBIS";
        if (this.selectedPrescription.length > 0) {
          if ((this.selectedPrescription.findIndex(x => x.prescriptionRefNo == resp.data.prescriptionRefNo)) == -1) {
            this.selectedPrescription.push(resp.data);
          }
        } else {
          this.selectedPrescription.push(resp.data);
        }
      }

      if(this.checkRequired && this.selectedPrescription.length > 0){
        this.displaySaveBtn = true;
      }
    });
  }

  getUploadedPrescriptions() {
    if(!this.isUplPrescriptionLoaded) {
      this._individualService.getUploadedPrescriptions().subscribe(resp => {
        if (resp.status == 2000) {
          resp.data.forEach(element => {
            let query = {
              'downloadFor': 'PRESCRIPTION',
              'documentRefNo': element.prescriptionRefNo,
              'docName':element.doctorName,
              'presDate':element.prescriptionDate,
              'patientName':element.patientName,
            }
            this._individualService.prescriptionDownload(query).subscribe((result) => {
              if (result.status == 2000) {
                this.isPrescription = true;
                let doc: any = {}
                doc['contentType'] = result.data.contentType;
                doc['downloadImageSrc'] = "data:" + result.data.contentType + ";base64," + result.data.data;
                doc['source'] = "UPLOAD";
                doc['documentRefNo'] = element.prescriptionRefNo;
                doc['prescriptionRefNo'] = element.prescriptionRefNo;
                doc['docName'] = element.doctorName;
                doc['presDate'] = element.prescriptionDate;
                doc['patientName'] = element.patientName;

                if (this.prescribedMedicineList.find(x => x.prescriptionRefNo === doc.prescriptionRefNo)) {
                  this.selectedPrescription.push(doc);
                  // console.log(this.selectedPrescription);
                } else {
                  //do nothing
                }
                this.prescriptionsForMe.push(doc);
              }
            });
          });
          this.isUplPrescriptionLoaded = true;
        }
      });
    }
  }

}//end of class

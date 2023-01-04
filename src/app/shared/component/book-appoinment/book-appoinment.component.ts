import { Component, OnInit, OnChanges, Input, EventEmitter, Output, OnDestroy, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { AppoinmentService } from './../../../modules/appoinment/appoinment.service';
import { ToastService } from './../../../core/services/toast.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { TranslateService } from '@ngx-translate/core';
import { ModalService } from './../../../shared/directive/modal/modal.service';
import { IndividualService } from './../../../modules/individual/individual.service';
import { PaymentService } from './../../../modules/payment/payment.service';
import { GetSet } from './../../../core/utils/getSet';
import { UtilsFactory } from './../../../core/utils/factory'
import { AuthService } from './../../../auth/auth.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../../core/services/api.service';
import { FormGroupDirective, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DoctorService } from '../../../modules/doctor/doctor.service';
import { DatePipe } from '@angular/common';
import { SBISConstants } from 'src/app/SBISConstants';
import { JsonTranslation } from '../../translation';

declare var Razorpay: any;
@Component({
  selector: 'app-book-appoinment',
  templateUrl: './book-appoinment.component.html',
  styleUrls: ['./book-appoinment.component.css'],
  providers: [FormGroupDirective]
})
export class BookAppoinmentComponent implements OnInit, OnChanges {
  @ViewChild('googleMapLocation') googleMapLocation: TemplateRef<any>;
  @Input('data') appoinment: any;
  @Input('id') popUpId = "";
  @Input() dateTimeDisabled: boolean;
  @Input() timeSlotDisabled: boolean;
  @Input('modalRef') modalRefParent: any;
  @Output() onClose = new EventEmitter<any>();

  @ViewChild('someVar') el: ElementRef;

  //timeSlotDisabled: boolean = false;
  domSanitizer: any;
  appointmentDateFormat: any;
  activeRadio: any = false;
  activePaymentRadio: any = false;
  paymentMode: String = '';
  onlyBookProceed: any = false;
  groupMembers: any;
  user_id: any;
  advancedPay: any = false;
  prepayAmount: any;
  payableAmount: any;
  appointmentDetails: any = null;
  appAppointment: any = {
    userPk: null,
    appointmentPk: null,
    chamberPk: null,
    doctorPk: null,
    appointmentDate: new Date(),
    remarks: "General Check-Up",
    appointmentTime: '',
    timeTo: '',
    appointmentBy: null,
    appointmentRefNo: "APP-REF-001",
    totalFees: 0,
    status: "REQ",
    fullTime: null,
    chamber: null,
    onlineConsultationFlag: 'N',
    isAcceptOnline: false
  };
  appSIgnUp: any = {
    userName: '',
    mobileNo: '',
    firstName: '',
    password: 'test1234',
    registrationProvider: 'SBIS',
    userType: 'SUDO'
  };
  appoinmentUser = {
    userType: null,
    userName: "",
    emailAddress: "",
    contactNo: "",
    firstName: "",
    lastName: "",
    searchText: "",
    existingUser: null
  }
  showAppoinmentForMe: boolean = false;
  showAppoinmentForGroup: boolean = false;
  showAppoinmentForMinor: boolean = false;
  appoinmentTypeLists = [
    { id: "1", label: "For me" },
    { id: "4", label: "Minor" },
    { id: "2", label: "For my group user" },
    { id: "3", label: "Person Known to me" }

  ];
  userGroupMembers: any[] = [];
  userForMinor: any[] = [];
  user_refNo: any;
  refNoOfMinorUsers: any;
  calenderList = [];
  minDate = new Date();
  appointmentId: any = null;
  paytmRespObj: any = {};
  fromAppointment = false;
  isReview: any = false;
  ispayment: any = false;
  chamberList: any;
  fees: any;
  appointmentTime: any;
  appointmentDate: any;
  appointmentForSeelection: any;
  cardBorder: any = false;
  modalRef: BsModalRef;
  selectedChamberName: "";
  razorpay_order_id: any;
  tax: number = 0.00;
  discount: number = 0.00;
  grandTotal: number = 0.00;
  maxDate: Date;
  isAdvancedPay: boolean = false;

  // Working on app/issues/595
  addressTypeList: any = [];
  showHomeVisitLayout: boolean = false;
  userAddressList: any = [];
  isEdit: any = false;
  addressForm: FormGroup;
  addressData: any = [];
  masterCOUNTRY: any = [];
  masterSTATE: any = [];
  addressT: any;
  isAnyAddressInEditState: boolean;
  oldItems: any[] = [];
  isEditDeleteAllowed: boolean = true;
  //End Working on app/issues/595
  userDetails: any;
  selectedChamber: any;
  selectedDate: any;
  advancedPayAutoCheck: boolean = false;
  onlyBookAutoCheck: boolean = false;
  confirmationMsg: any = [];
  paymentState: string;
  buttonName: string;
  selectedClinic: any;

  showOnlineLayout: boolean = false;
  isDocPermissionChecked: boolean = false;
  selectedAppointmentDate: any;
  selectedPatientRefNo: string;
  existingPermission: boolean = false;
  doctorPermissionDetails: any;
  permissionDates: any;
  isPermissionCheckboxChecked: boolean = false;
  isOnlineConsultationBooloean: boolean = false;

  constructor(
    private appoinmentService: AppoinmentService,
    private toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private bsModalService: BsModalService,
    private translate: TranslateService,
    private modalService: ModalService,
    private authService: AuthService,
    private _paymentService: PaymentService,
    private _individualService: IndividualService,
    private _domSanitizer: DomSanitizer,
    private apiService: ApiService,
    private _doctorService: DoctorService, // Working on app/issues/595
    private frb: FormBuilder, // Working on app/issues/595
    private datePipe: DatePipe,
    private jsonTranslate: JsonTranslation
  ) {
    this.domSanitizer = _domSanitizer;
    translate.setDefaultLang('en');
    translate.use('en');
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    this.maxDate = new Date(year + 100, month, day);
    this.minDate = new Date(year, month, day);

    // Working on app/issues/595
    this.addressForm = frb.group({
      'line1': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      'line2': [null],
      'country': [null, Validators.required],
      'state': [null, Validators.required],
      'city': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],//, Validators.pattern(/^[a-zA-Z]*$/)
      'pinCode': [null, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
      'addressType': [null, Validators.required],
      'isSubmit': false
    });
    //End Working on app/issues/595
  }

  ngOnChanges() {
    console.log(this.appoinment);
    this.isOnlineConsultationBooloean = GetSet.getOnlineConsultationBoolean();
    this.dateTimeDisabled = false;
    this.timeSlotDisabled = false;
    this.isReview = false;
    this.prepayAmount = -1;
    this.activeRadio = false;
    this.fromAppointment = true;
    //this.appoinment=GetSet.getAppoinment();
    if (this.appoinment) {
      this.reSetSelrctedClinic();
      if (typeof this.appoinment["appAppointment"] != "undefined") {
        this.appAppointment = this.appoinment.appAppointment;
        this.setUpDefaultAppointMent();
        //this.fromAppointment = true;
      } else {
        //this.fromAppointment = false;
      }
      this.loadAppointment(this.appoinment);
    } else {
      //this.router.navigate(["/appoinment"]);
    }


    if (this.appoinment['doctorChamberList'].length == 1) {
      let clinicData = this.appoinment['doctorChamberList'][0];
      if (clinicData) this.slectClinic(clinicData);
    }

    // this.appoinment.doctorChamberList.forEach((element, index) => {
    //   element['id'] = index;
    // });

    if(GetSet.getReBookData()) {
      let reBookData = GetSet.getReBookData();
      this.slectClinic(reBookData);
      // let obj = document.getElementsByClassName('selected-card');
      // let getId = this.appoinment.doctorChamberList.filter(x => x.chamberRefNo == reBookData.chamberRefNo);
      // getId[0].scrollIntoView();
      GetSet.setReBookData(null);
    }
    let user = JSON.parse(localStorage.getItem('user'));
    this.selectedPatientRefNo = user.refNo;
  }

  ngOnInit() {
    //this.dateTimeDisabled = false;
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.appoinment.doctorChamberList.forEach((element, index) => {
      element.chamberTimingList.sort(function (obj1, obj2) {
        return (+obj1.dayOfWeek) - (+obj2.dayOfWeek);
      });
      // element['id'] = index;
    });

    console.log(this.appoinment);
    
    // Working on app/issues/595
    this.addressTypeList = [{ id: 1, Type: "Home" }, { id: 2, Type: "Office" }];

    //End Working on app/issues/595

    // Speciality list
    this.appoinment["speciality"] = this.appoinment.doctorSpecializations;
    // Qualification list
    this.appoinment["qualifications"] = this.appoinment.doctorQualifications;

    if (GetSet.getMinorCount() == 0) {
      this.appoinmentTypeLists = this.appoinmentTypeLists.filter(x => x['label'] != "Minor");
    }
    this._individualService.getGroupMember(user.refNo + '?permission=ALL').subscribe(resp => {
      if (resp.data.length == 0) {
        this.appoinmentTypeLists = this.appoinmentTypeLists.filter(x => x['label'] != "For my group user");
      }
    });
    this.appAppointment.userRefNo = this.user_refNo;
  }

  setUpDefaultAppointMent() {
    let selectedClinic = this.appoinment.doctorChamberList.filter(x => x["chamberRefNo"] == this.appAppointment.chamberRefNo.id)[0];
    if (selectedClinic) {
      selectedClinic["selected"] = true;
      this.prepayAmount = selectedClinic.prepayAmount;
      this.fees = selectedClinic.fees;
    }
  }



  back() {
    this.isReview = false;
    // this.activeRadio = false;
    this.activePaymentRadio = false;
    this.grandTotal = null;
    this.tax = null;
    this.discount = null;
    if (this.selectedClinic.prepayAmount == "" || !this.selectedClinic.prepayAmount || this.selectedClinic.prepayAmount == "0.00") {
      this.onlyBook();
      this.onlyBookAutoCheck = true;
    } else {
      this.advancedPayAutoCheck = true;
      this.paymentTypeAdvanced();
    }
  }

  getDayByNo(noOfDay) {
    return UtilsFactory.getDayByNumber(noOfDay);
  }

  onclickGroupUser(groupMember: any) {
    this.appSIgnUp.userName = groupMember.name;
    this.appSIgnUp.mobileNo = groupMember.contactNo;
    this.appAppointment.userPk = groupMember.id;
    this.appAppointment['name'] = groupMember.name;
    this.appAppointment['emailAddress'] = groupMember.emailAddress;
    this.appAppointment['contactNo'] = groupMember.contactNo;
    this.appAppointment.userRefNo = groupMember.userRefNo;
    this.selectedPatientRefNo = groupMember.userRefNo;
    this.getDoctorPermission(groupMember.userRefNo);
  }
  onclickMinorUser(userForMinor: any) {
    this.appSIgnUp.userName = userForMinor.minor.userName;
    this.appSIgnUp.mobileNo = userForMinor.minor.contactNo ? userForMinor.minor.contactNo : null;
    this.appAppointment.userPk = userForMinor.minor.id;
    this.appAppointment['name'] = userForMinor.minor.name;
    this.appAppointment['userRefNo'] = userForMinor.minor.userRefNo;
    this.appAppointment['emailAddress'] = userForMinor.minor.emailAddress;
    this.appAppointment['contactNo'] = userForMinor.minor.contactNo;
    this.selectedPatientRefNo = userForMinor.minor.userRefNo;
    this.getDoctorPermission(userForMinor.minor.userRefNo);
  }

  createAppointment(chamberList: any) {
    console.log(this.appAppointment.userRefNo);
    this.getDoctorPermission(this.appAppointment.userRefNo);
    // Working on app/issues/595
    if (this.showHomeVisitLayout) {
      if (!this.selectedAddress) {
        this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.SELECT_ADDRESS', 'warning');
        return;
      }
    }
    //End Working on app/issues/595

    if (!this.appAppointment.chamber) {
      this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.SELECT_CLINIC', 'warning');
      return;
    } else if (!this.appAppointment.appointmentDate) {
      this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.SELECT_APPOINTMENT_DATE', 'warning');
      return;
    } else if (!this.appAppointment.fullTime) {
      // Working on app/issues/595
      if (!this.showHomeVisitLayout) {
        this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.SELECT_APPOINTMENT_FULL_TIME', 'warning');
        return;
      }

    } if (!this.appSIgnUp.userName) {
      this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.ENTER_PATIENT_NAME', 'warning');
      return;
    } if (this.appSIgnUp.mobileNo) {
      if (!this.appSIgnUp.mobileNo) {
        this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.ENTER_VALID_PHONE_NO', 'warning');
        return;
      }
      if (this.appSIgnUp.mobileNo.length != 13) {
        this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.MOBILE_NUMBER_HAVE_TEN_DIGIT', 'warning');
        return;
      }
    } else if (this.appSIgnUp.mobileNo == '') {
      this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.ENTER_VALID_PHONE_NO', 'warning');
      return;
    }

    let date = this.appAppointment.appointmentDate
    this.appointmentDateFormat = date;//.getDate()+'-'+parseInt(date.getMonth()+1)+'-'+date.getFullYear(); // Working on app/issues/595
    if (this.isAdvancedPay) {
      this.payableAmount = this.prepayAmount;
      this.grandTotal = this.prepayAmount;
    } else {
      this.getAllFeesByItem();
    }
    // this.getDiscountAmountByItem();
    let user: any = localStorage.getItem('user');
    user = JSON.parse(user);
    if (user) {
      this.isReview = true;
      if (this.appointmentForSeelection == '3') {
        this.appAppointment['name'] = this.appSIgnUp.userName;
        this.appAppointment['emailAddress'] = this.appSIgnUp.emailAddress;
        this.appAppointment['contactNo'] = this.appSIgnUp.mobileNo;
      }
    } else {
      if (!this.appSIgnUp.userName) {
        this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.ENTER_PATIENT_NAME', 'warning');
        return;
      } else if (!this.appSIgnUp.mobileNo) {
        this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.ENTER_VALID_PHONE_NO', 'warning');
        return;
      } else if (this.appSIgnUp.mobileNo) {
        this.authService.checkContactno(this.appSIgnUp.mobileNo).subscribe((data) => {
          if (data) {
            if (data.status === 5051) {
              this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.MOBILE_NUMBER_EXIST', 'error');
              return;
            }
            // show msg
          }
        },
          (error) => {
            // show error
          });
      }

      this.appAppointment['name'] = this.appSIgnUp.userName;
      this.appAppointment['emailAddress'] = this.appSIgnUp.emailAddress;
      this.appAppointment['contactNo'] = this.appSIgnUp.mobileNo;
      this.isReview = true;
      this.chamberList = chamberList;

    }
  }

  getAllFeesByItem() {
    let query = {
      "itemType": "DOC-APP",
      "amount": this.fees,
    }
    this.apiService.GetAllFees.postByQuery(query).subscribe((resp) => {
      this.discount = (+resp.data.discount.fees);
      for (let tax of resp.data.taxes) {
        let taxPay = +(tax.fees);
        this.tax = this.tax + taxPay;
      }
      this.getGrandTotal();
    });
    // this.grandTotal = (this.fees+this.tax)-this.discount;
    // if(this.grandTotal < 0) {
    //   this.grandTotal = 0;
    // }
  }

  getGrandTotal() {
    this.grandTotal = (this.fees + this.tax) - this.discount;
    if (this.grandTotal < 0) {
      this.grandTotal = 0;
    }
  }

  getTaxAndDiscountByItem() {
    let queryForTax = {
      "itemType": "DOC-APP",
      "amount": this.fees,
      "taxFeedId": "GST"
    }
    this.apiService.GetTaxByItem.postByQuery(queryForTax).subscribe((result) => {
      if (result['status'] == 2000) {
        this.tax = result.data.fees;
        let queryForDiscount = {
          "itemType": "DOC-APP",
          "amount": this.fees
        }
        this.apiService.GetDiscountAmountByItem.postByQuery(queryForDiscount).subscribe((data) => {
          if (result['status'] == 2000) {
            this.discount = data.data.fees;
            this.grandTotal = ((+this.payableAmount) + (+this.tax)) - (+this.discount);
            if (this.grandTotal < 0) {
              this.grandTotal = 0;
            }
          }
        });
      }
    });
  }

  makeAppontmentV2(userRefNo: any, userForMinor: any) {
    // Working on app/issues/595
    let fullTIme;
    if (!this.showHomeVisitLayout) {
      fullTIme = this.appAppointment.fullTime.label.split('-');
    }
    //End Working on app/issues/595
    let chamberRefNo: any;
    if (!this.showHomeVisitLayout) {
      chamberRefNo = this.appAppointment.chamber.chamberRefNo;
    }
    else {
      chamberRefNo = this.appAppointment.chamber.refNo;
    }
    if (!this.showOnlineLayout) {
      chamberRefNo = this.appAppointment.chamber.chamberRefNo;
    }
    else {
      chamberRefNo = this.appAppointment.chamber.refNo;
    }
    const query = {
      appointmentByRefNo: userRefNo,
      patientName: this.appAppointment.name,
      patientContactNo: this.appAppointment.contactNo ? this.appAppointment.contactNo : null,
      patientEmailAddress: this.appAppointment.emailAddress ? this.appAppointment.emailAddress : null,
      doctorPk: this.appoinment.doctorPk,
      totalFees: this.appAppointment.chamber.fees,
      //chamberPk: this.appAppointment.chamber.chamberPk,   
      chamberRefNo: chamberRefNo,
      doctorRefNo: this.appoinment.doctorRefNo,
      patientRefNo: this.appAppointment.userRefNo,
      appointmentTime: !this.showHomeVisitLayout ? fullTIme[0] + ":00" : null,  // Working on app/issues/595
      timeTo: !this.showHomeVisitLayout ? fullTIme[1] + ":00" : null, // Working on app/issues/595
      advanceFees: this.appAppointment.chamber.prepayAmount ? this.appAppointment.chamber.prepayAmount : 0.00,
      appointmentDateStr: this.convert(this.appAppointment.appointmentDate.toString()),
      userAddressPk: this.selectedAddress == null ? null : this.selectedAddress.id, // Working on app/issues/595
      forMinor: false,
      isSerial: true,
      onlineConsultation: this.appAppointment.onlineConsultationFlag ? SBISConstants.YES_NO_CONST.YES_ENUM : SBISConstants.YES_NO_CONST.NO_ENUM
    };
    
    this.appoinmentService.makeAppointmentV4(query).subscribe(resp => {
      if (resp && resp.status != 2000) {
        this.toastService.showI18nToast(resp.message, 'error');
        return;
      } else if (!resp) {
        return;
      }
      //set confirmation msg
      let date = new Date(resp.data.appointmentDate);
      let day = (date.getDate() < 10 ? '0' : '') + date.getDate();
      let month = ((date.getMonth() + 1) < 10 ? "0" : "") + (date.getMonth() + 1);
      let year = date.getUTCFullYear();
      resp.data.appointmentDate = day + '-' + month + '-' + year;
      GetSet.setAppointmentResp(resp.data);
      this.confirmationMsg = [];
      if (resp.data.appointmentState == 'REQ') {
        let confMsgForReq;
        if (resp.data.appointmentTime) {
          confMsgForReq = this.jsonTranslate.translateJson('CONFIRMATION_MSG.APPOINTMENT_RQST_WITH_DOC') + resp.data.doctorName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ON') + resp.data.appointmentDate + this.jsonTranslate.translateJson('CONFIRMATION_MSG.AT') + resp.data.appointmentTime.slice(0, -3) + this.jsonTranslate.translateJson('CONFIRMATION_MSG.BEEN_SENT_TO_DOC');
        } else {
          confMsgForReq = this.jsonTranslate.translateJson('CONFIRMATION_MSG.APPOINTMENT_RQST_WITH_DOC') + resp.data.doctorName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ON') + resp.data.appointmentDate + this.jsonTranslate.translateJson('CONFIRMATION_MSG.BEEN_SENT_TO_DOC');
        }
        this.confirmationMsg.push(confMsgForReq);
        this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.WILL_RCV_UPDATE_NOTE'));
      } else if (resp.data.appointmentState == 'CON') {
        let confMsgForCon = this.jsonTranslate.translateJson('CONFIRMATION_MSG.APPOINTMENT_CON_WITH_DOC') + resp.data.doctorName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ON') + resp.data.appointmentDate + this.jsonTranslate.translateJson('CONFIRMATION_MSG.AT') + resp.data.appointmentTime.slice(0, -3) + " .";
        this.confirmationMsg.push(confMsgForCon);
      }
      // end of set confirmation msg
      if (this.payableAmount > 0) {
        GetSet.setAppointmentState(resp.data);
        this.ispayment = true;
        let appointmentData = resp.data;
        appointmentData["payableAmount"] = this.grandTotal;
        appointmentData["discount"] = this.discount;
        appointmentData["tax"] = this.tax;
        appointmentData["netAmount"] = this.grandTotal;
        appointmentData["appointmentRefNo"] = resp.data.appointmentRefNo;
        localStorage.setItem("appointmentData", JSON.stringify(appointmentData));
        this.appointmentId = resp.data.appointmentPk;
        localStorage.setItem("appoinmentId", this.appointmentId);

        if (this.onlyBookProceed == false) {
          GetSet.setAppointmentPaymentData(appointmentData);
          GetSet.setTransactionType('APPOINTMENT');
          this.modalService.close('book-appoinment-popup');
          if (this.modalRefParent) {
            this.modalRefParent.hide();
          }
          if (this.payableAmount > 0) {
            let confirmationInfo = {};
            confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
            confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.APPOINTMENT;
            confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.APPOINTMENT;
            confirmationInfo['confirmationMsg'] = this.confirmationMsg;
            confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.APPOINTMENT;
            confirmationInfo['buttonTwoName'] = SBISConstants.SECONDARY_ACTION_BUTTON_NAME.RETRY;
            GetSet.setPaymentRetryBoolean('APPOINTMENT');
            GetSet.setConfirmationInfo(confirmationInfo);
            this.router.navigate(['/payment/razor-pay']);
          } else {
            this.router.navigate(['appoinment']);//working for issue number #748
          }
        };
        // this.modalService.open('payment-method-popup');
      } else {
        //this.modalService.close('book-appoinment-popup');
        // let element: HTMLElement = document.querySelector('#pop-close') as HTMLElement;
        //   element.click();
        if (this.modalRefParent) {
          this.modalRefParent.hide();
        }
        GetSet.setAppointmentState(resp.data);
        let confirmationInfo = {};
        confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
        confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.APPOINTMENT;
        confirmationInfo['confirmationMsg'] = this.confirmationMsg;
        confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.APPOINTMENT;
        confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.APPOINTMENT;
        // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.APPOINTMENT;
        GetSet.setConfirmationInfo(confirmationInfo);
        this.router.navigate(['confirmation']);
      }

      this.modalService.close('book-appoinment-popup');
    })
  }

  bookAndPayFromReviewModal(fees: any) {
    this.payableAmount = fees;
    this.activePaymentRadio = false;
    let user: any = localStorage.getItem('user');
    user = JSON.parse(user);
    this.setDoctorPermission();
    this.makeAppontmentV2(user.refNo, this.chamberList);
  }

  onKeydown($event) {
    if (($event.key == "!" || $event.key == "@" || $event.key == "#" || $event.key == "$" || $event.key == "%" || $event.key == "^" || $event.key == "&" || $event.key == "*" || $event.key == "(" || $event.key == ")") || ($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 106 && $event.keyCode <= 111))
      return false;
  }

  /*makeAppontment(userId: any,chamberList:any) {    
   
    let fullTIme = this.appAppointment.fullTime.label.split('-');
    // this.appAppointment.appointmentTime = fullTIme[0];
    // this.appAppointment.timeTo = fullTIme[1];
    let fees = chamberList.filter(x=>x["chamberPk"]==this.appAppointment.chamberPk.id)[0]["fees"];
    const query = {
      userPk: this.appAppointment.userPk,
      appointmentBy: userId,
      doctorPk: this.appoinment.doctorPk,
      totalFees: fees,
      chamberPk: this.appAppointment.chamberPk.id,     
      appointmentTime: fullTIme[0] + ":00",
      timeTo: fullTIme[1] + ":00",
      appointmentDateStr:this.convert(this.appAppointment.appointmentDate.toString()) 
    };

    this.appoinmentService.makeAppointment(query).subscribe(resp => {
      if (resp && resp.status != 2000) {
        this.toastService.showI18nToast(resp.message, 'error');
        return;
      }else if(!resp){
        return;
      }

      this.appointmentId = resp.data.appointmentPk;
      

      this.modalService.close('book-appoinment-popup');

      this.modalService.open('payment-method-popup');
    })
  }*/

  onChangeClinic(event: any) {
    this.appoinment["timeList"] = [];
    if (!event.value) return;
    let chamber = this.appoinment.doctorChamberList.filter(x => x["chamberPk"] == event.value.id)[0];
    if (chamber) {

      chamber.chamberTimingList.forEach(item => {
        let time = item.startTime.substring(0, 5) + "-" + item.endTime.substring(0, 5);
        this.appoinment["timeList"].push({ id: item.dayOfWeek, label: time });
      });
    }

    let query = {
      doctorRefNo: this.appointmentDetails.doctorRefNo,
      chamberRefNo: chamber.chamberRefNo
    }
    this.appoinmentService.getCalender(query).subscribe(result => {

      this.calenderList = result.data;
    })
  }

  getAppoinmentType(appointFor: any) {
    this.appointmentForSeelection = appointFor;
    switch (appointFor) {
      case '1': {// For me selection
        this.fromAppointment = true;
        this.showAppoinmentForMe = true;
        this.showAppoinmentForGroup = false;
        this.showAppoinmentForMinor = false;
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);
        this.appSIgnUp.userName = this.userDetails.firstName;
        this.appSIgnUp.mobileNo = this.userDetails.contactNo;
        this.appAppointment.userPk = user.id;
        this.appAppointment['name'] = this.userDetails.name;
        this.appAppointment['emailAddress'] = this.userDetails.emailAddress;
        this.appAppointment['contactNo'] = this.userDetails.contactNo;
        this.appAppointment.userRefNo = this.userDetails.userRefNo;
        this.selectedPatientRefNo = user.refNo;
        this.getDoctorPermission(user.refNo);
        break;
      }
      case '2': {// group member selection
        this.userGroupMembers = [];
        this.showAppoinmentForMinor = false;
        this.showAppoinmentForMe = false;
        this.showAppoinmentForGroup = true;
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);

        this._individualService.getGroupMember(user.refNo + '?permission=ALL').subscribe((groups) => {
          for (let groupMember of groups.data) {
            if (groups) {
              if (groupMember.userRefNo != this.user_refNo) {
                this.userGroupMembers.push(groupMember);
              }
              // this.userGroupMembers = this.userGroupMembers.filter(member => member.id != user.id);
            }
          }
          //new add for sorting by member name--10.05.2019
          this.userGroupMembers.sort((a, b) => a.name.localeCompare(b.name));
        });
        break;
      }
      case '3': {// known member selection
        this.fromAppointment = false;
        this.showAppoinmentForMe = true;
        this.showAppoinmentForGroup = false;
        this.showAppoinmentForMinor = false;
        this.appSIgnUp.userName = '';
        this.appSIgnUp.mobileNo = '';
        this.appAppointment.userRefNo = null;
        this.appSIgnUp.mobileNo = this.userDetails.contactNo;
        break;
      }
      case '4': {//Minor User selection
        this.userForMinor = [];
        this.showAppoinmentForMinor = true;
        this.showAppoinmentForMe = false;
        this.showAppoinmentForGroup = false;
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);
        this._individualService.listViewOfMinor(this.user_refNo)
          .subscribe(data => {
            this.userForMinor = data.data;
          }, (error) => {

          });
        break;
      }

    }

  }


  loadAppointment(appoinment) {
    //for concat with 0 if start or end tym length is three
    let stringNum = "0";
    appoinment.doctorChamberList.forEach(element => {
      element.chamberTimingList.forEach(elementT => {
        if (elementT.startTime.length == 3) {
          elementT.startTime = stringNum.concat(elementT.startTime);
        }
        if (elementT.endTime.length == 3) {
          elementT.endTime = stringNum.concat(elementT.endTime);
        }
      });
    });
    //end of for concat with 0 if start or end tym length is three
    this.showAppoinmentForMe = true;
    this.showAppoinmentForGroup = false;
    this.showAppoinmentForMinor = false;
    let user: any = localStorage.getItem('user');
    if (user) {
      user = JSON.parse(user);
      this.appoinmentUser.userType = this.appoinmentTypeLists[0].id;
      this.appAppointment.userPk = user.id;

      this._individualService.getUserFullProfile(user.refNo).subscribe(res => {
        if (res.status == 2000) {
          this.userDetails = res.data;
          this.appSIgnUp.userName = res.data.firstName;
          this.appSIgnUp.mobileNo = res.data.contactNo;
          this.appAppointment['name'] = res.data.name;
          this.appAppointment['emailAddress'] = res.data.emailAddress;
          this.appAppointment['contactNo'] = res.data.contactNo;
        }
      });
    } else {
      this.appoinmentTypeLists = [];
    }
    appoinment["clinicList"] = [];
    appoinment.doctorChamberList.forEach(item => {
      appoinment["clinicList"].push({ id: item.chamberPk, label: item.hospitalName });
    });
    console.log(this.appoinment);
    console.log(this.prepayAmount);
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), day, mnth].join("-");
  }

  getClickningTimes(isToast = true) {
    this.appoinment["timeList"] = [];
    let d = new Date(Date.parse(this.appAppointment.appointmentDate));
    this.appAppointment.appointmentDate = d;

    let currentDate = new Date();
    let momentItem = moment(d).format("YYYY-MM-DD");
    let momentCurrent = moment(currentDate).format("YYYY-MM-DD");

    let doctorAvailableOnSelectedDate = this.calenderList.filter(x => x["calendarDate"] == momentItem)[0];
    if (!doctorAvailableOnSelectedDate) {
      if (isToast) this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.DOC_NOT_AVAILABLE_ON_SELECTED_DATE', 'warning');
      return;
    }

    doctorAvailableOnSelectedDate.timeSlots.forEach(item => {
      if (!item.occupied) {
        let time = item.fromTime.substring(0, 5) + "-" + item.toTime.substring(0, 5);
        if (momentItem === momentCurrent) {
          let currDate = new Date();
          let currentHrs = currDate.getHours();
          let currentMins = currDate.getMinutes();
          let itemHrs = Number(item.fromTime.substr(0, 2));
          let itemMins = Number(item.fromTime.substr(6, 7));
          if (itemHrs > currentHrs) {
            this.appoinment["timeList"].push({ id: time, label: time });
          } else if (itemHrs == currentHrs && itemMins >= currentMins) {
            this.appoinment["timeList"].push({ id: time, label: time });
          }
        } else {
          this.appoinment["timeList"].push({ id: time, label: time });
        }
      }
    });
    if(this.isOnlineConsultationBooloean && this.appoinment.timeList.length > 0) {
      this.appAppointment.fullTime = this.appoinment.timeList[0];
    }
    if (this.appoinment["timeList"].length == 0) {
      if (isToast) this.toastService.showI18nToast('DOCTOR_SEARCH_TOAST.NO_SLOT_AVAILABLE', 'warning');
    }
  }

  onSelectDate(event, appAppointment) {
    appAppointment.appointmentDate = event;
    this.selectedAppointmentDate = event;
    let d = (event.getDate() < 10 ? '0' : '') + event.getDate();
    let m = ((event.getMonth() + 1) < 10 ? '0' : '') + (event.getMonth() + 1);
    let selectedDateWithFormat = d + '/' + m + '/' + event.getFullYear();
    let query = {
      chamberRefNo: this.selectedChamber.chamberRefNo ? this.selectedChamber.chamberRefNo: this.selectedChamber.refNo, // else part is for online consultation [if its coming from online consultation part then we get the chamber ref no in 'refNo' field]
      appointmentDate: selectedDateWithFormat
    }
    this._individualService.getCalenderDoctorChamberV5(query).subscribe(result => {
      if (result.status == 2000) {
        this.calenderList = result.data;
        this.getClickningTimes();
      }
    });
    //this.getClickningTimes();
    this.timeSlotDisabled = true;
  }

  reSetSelrctedClinic() {
    this.appoinment.doctorChamberList.forEach(item => {
      item["selected"] = false;
    });
  }

  slectClinic(clinicData) {
    let selectedNextDay = [];
    let today = new Date().getDay();
    let index = 1;

    for (let i = 1; i <= 7; i++) {
      if (index != 7) {
        selectedNextDay = clinicData.chamberTimingList.filter(x => x.dayOfWeek == today + index);
        if (selectedNextDay.length != 0) {
          var d = new Date();
          d.setDate(d.getDate() + (+(selectedNextDay[0].dayOfWeek) + 7 - d.getDay()) % 7);
          this.appAppointment.appointmentDate = d;
          break;
        } else {
          index = index + 1;
        }
      } else {
        index = 1;
        selectedNextDay = clinicData.chamberTimingList.filter(x => x.dayOfWeek == 1);
        if (selectedNextDay.length != 0) {
          var d = new Date();
          d.setDate(d.getDate() + (+(selectedNextDay[0].dayOfWeek) + 7 - d.getDay()) % 7);
          this.appAppointment.appointmentDate = d;
          break;
        } else {
          index = index + 1;
        }
      }
    }

    this.selectedClinic = clinicData;
    if (clinicData.prepayAmount == "" || !clinicData.prepayAmount || clinicData.prepayAmount == "0.00") {
      this.onlyBook();
      this.onlyBookAutoCheck = true;
    } else {
      this.advancedPayAutoCheck = true;
      this.paymentTypeAdvanced();
    }
    this.reSetSelrctedClinic();
    clinicData["selected"] = true;
    this.cardBorder = true;
    this.prepayAmount = clinicData.prepayAmount;
    this.fees = clinicData.fees;

    let chamber = this.appoinment.doctorChamberList.filter(x => x["chamberRefNo"] == clinicData.chamberRefNo)[0];
    if (chamber) {
      this.selectedDate = new Date();
      this.selectedChamber = chamber;
      this.appAppointment.onlineConsultationFlag = (chamber.acceptonline == SBISConstants.YES_NO_CONST.YES_ENUM ? true: false);
      this.appAppointment.isAcceptOnline = (chamber.acceptonline == SBISConstants.YES_NO_CONST.YES_ENUM ? true: false);
      this.appAppointment.chamber = clinicData;
      let date = this.selectedDate;
      let d = (date.getDate() < 10 ? '0' : '') + date.getDate();
      let m = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
      let selectedDateWithFormat = d + '/' + m + '/' + date.getFullYear();
      if(GetSet.getOnlineConsultationBoolean()) {
        this.onSelectDate(this.selectedDate, this.appAppointment);
        this.paymentTypeFull();
      } else {
        this.onSelectDate(this.appAppointment.appointmentDate, this.appAppointment);
      }
      this.selectedChamberName = this.appAppointment.chamber.hospitalName;
    }
    this.dateTimeDisabled = true;

  }

  paymentMethod(method: String) {

    this.paymentMode = method;
    this.activePaymentRadio = true;
  }

  paymentTypeAdvanced() {
    // this.advancedPay = true;
    this.payableAmount = this.prepayAmount;
    this.activeRadio = true;
    this.onlyBookProceed = false;
    this.isAdvancedPay = true;
    GetSet.setAdvancePay(this.isAdvancedPay);
  }

  paymentTypeFull() {
    // this.advancedPay = false;
    //this.payableAmount = fees;
    this.payableAmount = this.fees;
    this.activeRadio = true;
    this.onlyBookProceed = false;
    this.isAdvancedPay = false;
    GetSet.setAdvancePay(this.isAdvancedPay);
  }

  onlyBook() {
    this.activeRadio = true;
    this.onlyBookProceed = true;
    this.payableAmount = 0;
    this.isAdvancedPay = false;
    GetSet.setAdvancePay(this.isAdvancedPay);
  }


  googleMapDisplayObj: any = {
    chamberName: '',
    chamberAddress: '',
    lat: 0,
    long: 0
  }
  displayGoogleMapLocationInModal(doctorchamber) {
    this.googleMapDisplayObj.chamberName = doctorchamber.chamberName;
    this.googleMapDisplayObj.chamberAddress = doctorchamber.displayAddress;//.line1 + " "+ doctorchamber.line2? doctorchamber.line2 : '' +" "+ doctorchamber.city;
    this.googleMapDisplayObj.lat = doctorchamber.latitude;
    this.googleMapDisplayObj.long = doctorchamber.longitude;
    this.modalRef = this.bsModalService.show(this.googleMapLocation, { class: 'modal-lg' });
  }

  // Working on app/issues/595
  chamberForHomeVisit: any;
  showHomeVisitSection() {
    this.showHomeVisitLayout = !this.showHomeVisitLayout;
    if (this.showHomeVisitLayout) {
      this.showOnlineLayout = false;
      this.dateTimeDisabled = false;
      this.loadAllMasterData();
      this.getOrderCountById();
      let payload = {
        "doctorRef": this.appoinment.doctorRefNo
      }
      this._doctorService.getHomeVisitDetailsByDoctorRefNo(payload).subscribe(result => {
        let chamber = result.data;
        if (chamber != null) {
          this.appAppointment.chamber = chamber;
          this.chamberForHomeVisit = chamber;
          this.prepayAmount = chamber.prepayAmount;
          this.fees = parseFloat(chamber.fees);
        }

      });
    }
    else {
      this.dateTimeDisabled = true;
    }


  }

  getOrderCountById() {
    this.apiService.AddressById.getByPath(this.user_refNo).subscribe((result) => {
      this.userAddressList = result.data;
      this.addressData = this.userAddressList;
    });
  }

  addNewAddress() {
    this.addressForm.patchValue({
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
    this.masterCOUNTRY.filter((elm) => {
      if (elm.countryName == 'India') {
        defaultCountryName = elm.countryName;
      };
    });
    this.addressForm.patchValue({
      'country': defaultCountryName
    });
    this._individualService.getMasterDataState(this.addressForm.get('country').value).subscribe((data) => {
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

  saveAddress(addressForm: any) {
    // let addValue = addressForm.value;
    addressForm.patchValue({
      'isSubmit': true
    });
    if (addressForm.invalid) {
      return;
    }


    let query = {
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
    this._individualService.updateUserProfile({
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

  }
  loadAllMasterData() {
    this._individualService.getMasterDataCountry().subscribe(data => {
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

    this._individualService.getMasterDataState(this.addressForm.value.country).subscribe(data => {
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

  selectedAddress: any;

  selectAddress(addresses) {
    this.resetSelectedAddress();
    addresses["selected"] = true;
    this.cardBorder = true;
    this.selectedAddress = addresses;

    let query = {
      chamberRefNo: this.chamberForHomeVisit.refNo
    }
    this.appoinmentService.getCalenderForDoctor(query).subscribe(result => {
      this.calenderList = result.data;
      this.getClickningTimes(false);
      this.appAppointment.appointmentDate = new Date(this.calenderList[0].calendarDate);
    });


    //this.prepayAmount = clinicData.prepayAmount;
    // this.fees = clinicData.fees;

    // let chamber = this.appoinment.doctorChamberList.filter(x => x["chamberRefNo"] == clinicData.chamberRefNo)[0];
    // if (chamber) {
    //    this.appAppointment.chamber =  clinicData;
    //     let query={
    //       chamberRefNo:chamber.chamberRefNo
    //     }
    //     this.appoinmentService.getCalenderForDoctor(query).subscribe(result=>{       
    //       this.calenderList = result.data; 
    //       this.getClickningTimes(false);     
    //     });
    //     this.selectedChamberName = this.appAppointment.chamber.hospitalName;
    // }
    this.dateTimeDisabled = true;

  }

  resetSelectedAddress() {
    this.dateTimeDisabled = false;
    this.userAddressList.forEach(item => {
      item["selected"] = false;
    });
  }


  // Working on app/issues/595

  changeName(event, type) {
    if (type == 'userName') {
      this.appSIgnUp.userName = event;
    }
  }

  //for mobile component
  changeNumber(event, type, i) {
    if (event) {
      if (type == 'signupUserNumber') {
        this.appSIgnUp.mobileNo = event.internationalNumber.replace(/\s/g, "");
      }
    }
  } // end of method

  // Working on app/issues/1615
  chamberForOnlineVisit: any;
  showOnlineSection() {
    this.showOnlineLayout = !this.showOnlineLayout;
    if (this.showOnlineLayout) {
      this.showHomeVisitLayout = false;
      this.dateTimeDisabled = true;
      //this.loadAllMasterData();
      //this.getOrderCountById();
      let payload = {
        "doctorRef": this.appoinment.doctorRefNo
      }
      this._doctorService.getOnlineConsultationDetailsByDoctorRefNo(payload).subscribe(result => {
        let chamber = result.data;
        if (chamber != null) {
          this.appAppointment.chamber = chamber;
          this.selectedChamber = chamber;
          this.chamberForOnlineVisit = chamber;
          this.chamberForOnlineVisit['selected'] = true;
          this.prepayAmount = chamber.prepayAmount;
          this.fees = parseFloat(chamber.fees);
          this.setOnlineDateTime(this.selectedChamber);
          this.payableAmount = this.fees;
          this.activeRadio = true;
          this.onlyBookProceed = false;
          this.isAdvancedPay = false;
          GetSet.setAdvancePay(this.isAdvancedPay);
        }

      });
    }
    else {
      this.dateTimeDisabled = true;
    }
  }

  setOnlineDateTime(clinicData) {
    this.selectedClinic = clinicData;
    let chamber = this.appoinment.doctorChamberList.filter(x => x["chamberRefNo"] == clinicData.refNo)[0];
    if (chamber) {
      this.selectedDate = new Date();
      this.selectedChamber = chamber;
      this.appAppointment.chamber = clinicData;
      let date = this.selectedDate;
      let d = (date.getDate() < 10 ? '0' : '') + date.getDate();
      let m = ((date.getMonth() + 1) < 10 ? '0' : '') + (date.getMonth() + 1);
      let selectedDateWithFormat = d + '/' + m + '/' + date.getFullYear();
      this.onSelectDate(this.selectedDate, this.appAppointment);
      this.selectedChamberName = this.appAppointment.chamber.hospitalName;
    }
    this.dateTimeDisabled = true;

  }

  dateSetToOneDayErlearAndSevenDaysAfter() {
    let prvDateObj = new Date(this.selectedAppointmentDate);
    let sevenDayDateObj = new Date(this.selectedAppointmentDate);
    // subtract one day from current time    
    let dateCheck = prvDateObj.getDate() + "-" + prvDateObj.getMonth();
    let todayDateCheck = new Date().getDate() + "-" + new Date().getMonth();
    if (dateCheck != todayDateCheck) {
      prvDateObj.setDate(prvDateObj.getDate() - 1);
    }
    let prvDate = (("0" + prvDateObj.getDate()).slice(-2)) + '-' + ("0" + (prvDateObj.getMonth() + 1)).slice(-2) + '-' + prvDateObj.getFullYear();
    sevenDayDateObj.setDate(sevenDayDateObj.getDate() + 7);
    let sevenDaysAfter = (("0" + sevenDayDateObj.getDate()).slice(-2)) + '-' + ("0" + (sevenDayDateObj.getMonth() + 1)) + '-' + sevenDayDateObj.getFullYear();
    this.permissionDates = {
      authorizationDateFrom: new Date(prvDate),
      authorizationDateTo: new Date(sevenDaysAfter),
      authDateFrom: prvDate,
      authDateTo: sevenDaysAfter
    };
  }

  checkPermission(event) {
    this.dateSetToOneDayErlearAndSevenDaysAfter();
    this.isPermissionCheckboxChecked = event.target.checked;
  }

  getDoctorPermission(userRef) {
    let query = {
      authorizationfor: this.appoinment.doctorRefNo,
      authorizationby: userRef
    }
    this._individualService.getPermission(query).subscribe(resp => { //'authorizationfor='+this.appoinment.doctorRefNo+'&authorizationby='+this.user_refNo
      if (resp.status == 2000) {
        this.doctorPermissionDetails = resp.data;
        resp.data.length > 0 ? this.existingPermission = true : this.existingPermission = false;
        resp.data.length > 0 ? this.isDocPermissionChecked = true : this.isDocPermissionChecked = false;
        resp.data.length > 0 ? this.isPermissionCheckboxChecked = true : this.isPermissionCheckboxChecked = false;

        if (resp.data.length > 0) {
          this.permissionDates = {
            authorizationDateFrom: resp.data[0].authorizationDateFrom,
            authorizationDateTo: resp.data[0].authorizationDateTo
          };
        } else {
          this.dateSetToOneDayErlearAndSevenDaysAfter();
        }
      }
    });
  }

  setDoctorPermission() {
    if (this.isPermissionCheckboxChecked) {
      var prvDateObj = new Date(this.selectedAppointmentDate);
      var sevenDayDateObj = new Date(this.selectedAppointmentDate);
      // subtract one day from current time
      let dateCheck = prvDateObj.getDate() + "-" + prvDateObj.getMonth();
      let todayDateCheck = new Date().getDate() + "-" + new Date().getMonth();
      if (dateCheck != todayDateCheck) {
        prvDateObj.setDate(prvDateObj.getDate() - 1);
      }
      let prvDate = (("0" + prvDateObj.getDate()).slice(-2)) + '-' + ("0" + (prvDateObj.getMonth() + 1)).slice(-2) + '-' + prvDateObj.getFullYear();
      sevenDayDateObj.setDate(sevenDayDateObj.getDate() + 7);
      let sevenDaysAfter = (("0" + sevenDayDateObj.getDate()).slice(-2)) + '-' + ("0" + (sevenDayDateObj.getMonth() + 1)) + '-' + sevenDayDateObj.getFullYear();
      let query = {
        authorizationDateFrom: prvDate,
        authorizationDateTo: sevenDaysAfter
      };
      this.permissionDates = {
        authorizationDateFrom: new Date(prvDate),
        authorizationDateTo: new Date(sevenDaysAfter)
      };
      if (!this.existingPermission) {
        query['authorizationByRefNo'] = this.selectedPatientRefNo;
        query['authorizationForRefNo'] = this.appoinment.doctorRefNo
      } else {
        query['refNo'] = this.doctorPermissionDetails.refNo;
      }
      this._individualService.setPermission(query).subscribe(result => {
        if (result.status == 2000) {
          console.log(result.data);
        }
      });
    } else {
      if (this.doctorPermissionDetails.length > 0) {
        this._individualService.revokePermission({ 'refNo': this.doctorPermissionDetails[0].refNo }).subscribe(res => {
          if (res.status == 2000) {
            console.log(res.data);
          }
        });
      }
    }
  }

}//end of class

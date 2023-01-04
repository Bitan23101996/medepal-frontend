import { Component, OnInit, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, ControlContainer, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ModalService } from '../../directive/modal/modal.service';
import { BsModalService } from 'ngx-bootstrap';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { HttpClient } from '@angular/common/http';
import { SBISConstants } from 'src/app/SBISConstants';
import { DoctorService } from 'src/app/modules/doctor/doctor.service';
import { IndividualService } from '../../../modules/individual/individual.service';
import { ApiService } from '../../../core/services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'app-common-prescription-ngbt',
  templateUrl: './common-prescription-ngbt.component.html',
  styleUrls: ['./common-prescription-ngbt.component.css']
})
export class CommonPrescriptionNgbtComponent implements OnInit {
  appointmentForm: FormGroup;
  @Input("submitted")
  submitted = false;
  @Output() populatePatientOnPhone = new EventEmitter();
  // @Output() timeValidateOnBlur = new EventEmitter();
  @Output() convertTimingOnChange = new EventEmitter();
  @Output() oncloseList = new EventEmitter();
  @Output() emitAssociateUser = new EventEmitter();
  @Input()
  startTimingErrorFlag = false;
  @Input()
  endTimingErrorFlag = false;
  @Input()
  chamberList: any[] = [];
  @Input()
  entityName: string;
  @Input()
  dtFormat = "";
  minDate = new Date();
  @Input()
  isNewMinor: boolean = false;
  @Input() isMinorDisable: boolean;
  @Input() isGender: boolean;
  @Input() displaySidebar: boolean;
  @Input() associatedUserDetailsList: any[] = [];
  @Input() getUserDetails: any;
  @ViewChild('minorModal') minorModal: TemplateRef<any>;
  @Input() usingComponentStr: string;
  @Input() procedureFlag: boolean = false;
  @Input() isPopulated: boolean = false;
  @Input() isModal: boolean;
  @Input() isExistMultiRole: boolean;
  @Output() emitUserDetails: EventEmitter<any> = new EventEmitter<any>();
  // /sbis-poc/app/issues/1119
  @Input() isPopulateOnlyPatientDetails: boolean = false;
  @Input() isDob: boolean;
  spinners = false;
  time : any;

  @Output() emitUserAddressDetails = new EventEmitter<any>();
  @Input() userAddressDetails: any;


  APP_STATE = SBISConstants.APPOINTMENT_STATE;
  APP_STATUS = SBISConstants.ENTITY_STATUS;
  masterGender: any;
  associateUser: any;
  isGuardian: boolean;
  isDobSelect: boolean = true;
  isDobDisabled: boolean = false;
  isAgeInMonthDisabled: boolean = false;
  isExistingMinorPatient: boolean = false;
  minorDateRange: Date;
  doctorNameList: any = [];// Working on app/issues/937
  referralNameList: any = [];// Working on app/issues/937
  appointmentForUserItself : boolean = false;
  
  initialFormValue: any;//app#2399
  editForApp: boolean = false;//app#2399

  constructor(private controlContainer: ControlContainer,
    private _doctorService: DoctorService,
    private _toastService: ToastService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private _individualService: IndividualService,
    private apiService: ApiService,) { }//end of constructor

  ngOnInit() {
    this.loadInitialData();
    this.loadAllMasterData();
  }//end of oninit

  /*ngOnChanges(){
    this.time = {hour:2 , minute:0};
  }*/

  //method to load initial data
  loadInitialData() {
    this.appointmentForm = <FormGroup>this.controlContainer.control;
    this.initialFormValue = this.appointmentForm.value;

    if(this.appointmentForm.value.appointmentRefNo==null){
      console.log("ccc");
      this.appointmentForm.patchValue({
        onlineConsultationFlag:true
      });
    }

    console.log(this.appointmentForm.value);
    
    if(this.appointmentForm.value.appointmentRefNo==null && this.appointmentForm.value.appointmentDate!=null){
      let d = (this.appointmentForm.value.appointmentDate.getDate() < 10 ? '0' : '') + this.appointmentForm.value.appointmentDate.getDate();
      let m = ((this.appointmentForm.value.appointmentDate.getMonth() + 1) < 10 ? '0' : '') + (this.appointmentForm.value.appointmentDate.getMonth() + 1);
      let selectedDateWithFormat = d + '/' + m + '/' + this.appointmentForm.value.appointmentDate.getFullYear();
      let query = {
        chamberRefNo: this.appointmentForm.value.chamberRefNo,
        appointmentDate: selectedDateWithFormat
      }
      if(this.appointmentForm.value.chamberRefNo!=""){
        this.getChamberTimingList(query);
      }
    }
    this.isPopulated = false;
    this._doctorService.getMasterDataGender({ q: SBISConstants.MASTER_DATA.GENDER }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
      }
    });
    // Working on app/issues/937
    this._doctorService.doctorNameList().subscribe(data => {
      if (data['status'] == '2000') {
        this.doctorNameList = data['data'];
      }
    });//End Working on app/issues/937
    // Working on app/issues/1086
    let appointmentDay;
    if (this.appointmentForm.value.appointmentDate != null)
      appointmentDay = this.appointmentForm.value.appointmentDate.getDay();
      // console.log(this.appointmentForm.controls.chamberRefNo.value);
      // console.log(this.chamberList);
    for (let chamber of this.chamberList) {
      for (let timing of chamber.chamberTimingList) {
        let chameberStartTime = timing.startTime.split(":")
        chameberStartTime = new Date(0, 0, 0, chameberStartTime[0], chameberStartTime[1], 0);

        let chameberEndTime = timing.endTime.split(":")
        chameberEndTime = new Date(0, 0, 0, chameberEndTime[0], chameberEndTime[1], 0);

        let appointmentStartTime = this.appointmentForm.value.appointmentTime.split(":");
        appointmentStartTime = new Date(0, 0, 0, appointmentStartTime[0], appointmentStartTime[1], 0);

        console.log(appointmentStartTime);

        if (timing.dayOfWeek == appointmentDay) {
          // if ((chameberStartTime.getTime() < appointmentStartTime.getTime())
          // ) {
          //   this.appointmentForm.patchValue({
          //     chamberRefNo: chamber.chamberRefNo
          //   })
          // }
        }
      }
    }// End Working on app/issues/1086

  }//end of method

  emitDisplayFlag(event) {
    this.oncloseList.emit(false);
  }//end of method

  registerNewPatient() {
    let other = {
      'name': 'Other',
      'userContactNo': this.getUserDetails.data.individualUserBasicInfo.contactNo ? this.getUserDetails.data.individualUserBasicInfo.contactNo : null,
      'dateOfBirth': null,
      'gender': null
    }
    this.setPatientIfMinorHave(other);
  }

  populatePatientDetailsByPhone(mobile) {
    this.isExistingMinorPatient = false;
    this.isExistMultiRole = false;
    if (mobile.length > 12) {
      this.isPopulated = false;
      this._doctorService.getAssociateUserByEaddress(mobile).subscribe(resp => {
        this.getUserDetails = resp;
        //app#2367
        // if(resp.data.associatedUserDetailsList.length==0){
        //   this.showAddressSection=true;
        //   this.addNewAddress();
        //   this.userAddressList=[];
        // }        
        //end app#2367
        this.emitUserDetails.emit(this.getUserDetails);
        if (resp.status == 2000) {
          this.appointmentForm.patchValue({
            'appointmentByRefNo': resp.data.individualUserBasicInfo ? (resp.data.individualUserBasicInfo.refNo ? resp.data.individualUserBasicInfo.refNo : null): null
          });
          // if (resp.data.associatedUserDetailsList.length != 0 && !this.appointmentForm.value.forMinor && !this.isPopulateOnlyPatientDetails) {
          this.associatedUserDetailsList = [];
          (resp.data.individualUserBasicInfo) ? this.associatedUserDetailsList.push(resp.data.individualUserBasicInfo) : null;// add user to show in display list
          if (resp.data.associatedUserDetailsList.length != 0) {
            for (let associatedUserDetailsList of resp.data.associatedUserDetailsList) {
              this.associatedUserDetailsList.push(associatedUserDetailsList);
            }
          }
          
          this.associatedUserDetailsList.length > 0 ? this.displaySidebar = true : this.displaySidebar = false;
          this.isPopulated = true;
        } else if (resp.status == 5001) {
          this.isDob = false;

          this.appointmentForm.patchValue({
            'isExistingInUser': false,
            'isSerial': false,
            'appointmentByRefNo': null,
            'guardianEmailId': null
          });
        }
      });
    }
    else {
      if (!this.appointmentForm.value.forMinor) {
        this.appointmentForm.patchValue({
          userPk: null,
          patientName: null,
          patientDateOfBirth: null,
          patientGender: null,
          patientAgeInMonth: null,
          appointmentRefNo: null
        });
        this.isDob = false;
        this.isGender = false;
        this.appointmentForUserItself = false;
      }
    }
  }//end of method

  convertTiming(event1,event2,label) {
    //console.log(hour,minute,label);
    if(event1 < 10){
      event1 = "0"+ event1.toString();
    }else{
      event1 =  event1.toString();
    }

    if(event2 < 10){
      event2 = "0"+ event2.toString();
    }else{
      event2 =  event2.toString();
    }
    let tt = event1+":"+event2;
    this.convertTimingOnChange.emit({ event: tt, label: label });
    console.log(tt);
  }//end of method


  setPatientIfMinorHave(associateUser) {
    this.associateUser = associateUser;
    (associateUser.refNo == this.getUserDetails.data.individualUserBasicInfo.refNo) ? this.appointmentForUserItself = true : this.appointmentForUserItself = false;
    this.emitAssociateUser.emit(this.associateUser);
    let user = JSON.parse(localStorage.getItem('user'));
    this.appointmentForm.patchValue({
      'patientName': associateUser.name,
      'patientGender': associateUser.gender,
      'patientRefNo': associateUser.refNo ? associateUser.refNo : null,
      'appointmentByRefNo': (this.getUserDetails.data.individualUserBasicInfo)? this.getUserDetails.data.individualUserBasicInfo.refNo: null,
      'isExistingInUser': true,
      'isSerial': false,
      'forMinor': true,
      'patientDateOfBirth': associateUser.dateOfBirth ? associateUser.dateOfBirth : null
    });
    this.getUserAddresBtRefNoAndAddressType(associateUser.refNo,"Inpatient"); //app#2367
    if (associateUser.isMinor) {
      this.isGuardian = true;
      this.isNewMinor = true;
      this.isExistingMinorPatient = true;
    } else {
      associateUser.gender ? this.isGender = true : this.isGender = false;

      // End Working on app/issue/1374
      /*if (associateUser.dateOfBirth != null)
        this.appointmentForm.patchValue({ 'patientAgeInMonth': null });*/
      if(associateUser.userType=="PSEUDO"){
        if(associateUser.age!=null)
        this.appointmentForm.patchValue({ 'patientAgeInMonth': Math.round(parseInt(associateUser.age)/12 )});
        else
        this.appointmentForm.patchValue({ 'patientAgeInMonth': associateUser.age});

      }
      // End Working on app/issue/1374

      this.appointmentForm.patchValue({ 'forMinor': false });
      this.isExistingMinorPatient = false;
      if (associateUser.name == 'Other') {
        this.appointmentForm.patchValue({
          'forMinor': true,
          'patientName': '',
          'patientGender': '',
          'patientRefNo': ''
        });
      } else {
        this.isGuardian = false;
        this.isNewMinor = false;
      }
      if (associateUser.dateOfBirth != null) {
        this.isDob = true;
      } else {
        this.isDob = false;
      }
    }//end of else
    this.isGuardian = false;
    this.displaySidebar = false;

    //app#2367
    // this.user_refNo = associateUser.refNo;
    // // this.addressTypeList = [{ id: 1, Type: "Home" }, { id: 2, Type: "Office" }];
    // // this.loadAllMasterData();
    // this.showAddressSection=true;
    // if(this.user_refNo!=null)
    //     this.getAddressListByUserRefNo();
    // else{
    //     this.addNewAddress();
    //     this.userAddressList=[];
    // }
    //End app#2367
  }//end of method

  changeDate(date) {
    let age = 0;
    const bdate = new Date(date);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    if (age <= 18) {
      if (!this.appointmentForm.value.forMinor) {
        this.appointmentForm.patchValue({
          'forMinor': true
        });
      }
    } else {
      this.appointmentForm.patchValue({
        forMinor: false
      })
    }
    this.isAgeInMonthDisabled = true;
    this.isDobDisabled = false;
    this.appointmentForm.patchValue({
      'patientAgeInMonth': null
    });
  }//end of method

  changeAge(age) {
    if (age != "") {
      if (age <= 18) {
        if (!this.appointmentForm.value.forMinor) {
          this.appointmentForm.patchValue({
            'forMinor': true,
            'guardianContactNo': this.appointmentForm.value.patientContactNo
          });
        }
      } else {
        this.appointmentForm.patchValue({
          forMinor: false
        });
      }
      this.isAgeInMonthDisabled = false;
      this.isDobDisabled = true;
      this.appointmentForm.patchValue({
        'patientDateOfBirth': null
      });
    } else {
      this.isAgeInMonthDisabled = false;
      this.isDobDisabled = false;
      this.appointmentForm.patchValue({
        'patientDateOfBirth': null,
        'patientAgeInMonth': null
      });
    }
  }//end of method

  // Working on app/issues/937
  filteredReferralSingle(event) {
    let query = event.query;
    this.referralNameList = this.filterReferralName(query, this.doctorNameList);
  }//end of method

  filterReferralName(query, referralName: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < referralName.length; i++) {
      let referred = referralName[i];
      if (referred.toLowerCase().toString().indexOf(query.toLowerCase()) != -1) {
        filtered.push(referred);
      }
    }
    return filtered;
  }//end of method

  referredNameSelect(referredName) {
    this.appointmentForm.patchValue({
      referredBy: referredName
    });
  } //End Working on app/issues/937

  onDateChange(event) {
    let selectedDate = new Date(event);
    var CurrentDate = new Date();
    let today = this.datePipe.transform(CurrentDate, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER);
    let seletedDate = this.datePipe.transform(selectedDate, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER);
    if(seletedDate < today){
      this._toastService.showI18nToast('You are creating a back dated appointment','warning');
    }

    this.checkHolidayByAppointmentDateAndChamber();// Working on app/issue/2355
  }

  findValueWidth(event, type) {
    let str = new String(event.target.value);
    let width;
    (str.length == 0) ? (width = '100px') : (str.length > 0 && str.length < 7) ? (width = (str.length * 16) + 'px') : (str.length >= 7 && str.length <= 15) ? (width = (str.length * 13) + 'px') : (width = (str.length * 10) + 'px');
    (type == 'chamber') ? (document.getElementById("myChamberBtn").style.width = width) : document.getElementById("myAgeBtn").style.width = width;
   
    this.checkHolidayByAppointmentDateAndChamber();// Working on app/issue/2355
  }

  //app#2367
  addressTypeList: any = [];
  showAddressSection: boolean = false;
  userAddressList: any = [];
  isEdit: any = false;
  //addressForm: FormGroup;
  addressData: any = [];
  masterCOUNTRY: any = [];
  masterSTATE: any = [];
  addressT: any;
  isAnyAddressInEditState: boolean;
  oldItems: any[] = [];
  isEditDeleteAllowed: boolean = true;
  user_refNo: any;
  cardBorder: any = false;
  
  get addressForm():FormGroup{
    return this.appointmentForm.get("addressForm") as FormGroup
 }

  getAddressListByUserRefNo() {
    this.apiService.AddressById.getByPath(this.user_refNo).subscribe((result) => {
      this.userAddressList = result.data;
      this.addressData = this.userAddressList;
      if(this.userAddressList.length==0){
        this.addNewAddress();
      }
    });
    this.isEdit = false;
  }

  addNewAddress() {
    this.addressTypeList = [{ id: 1, Type: "Home" }, { id: 2, Type: "Office" }];
    this.loadAllMasterData();
    this.appointmentForm.controls.addressForm.patchValue({
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
    this.appointmentForm.controls.addressForm.patchValue({
      'country': 'India'
    });
    this._individualService.getMasterDataState(this.addressForm.get('country').value).subscribe((data) => {
      this.masterSTATE = data.data;
      let address = this.addressData.filter(x => x["id"] == this.addressForm.value.id)[0];
      if (address && this.masterSTATE.filter(x => x["stateName"] == address.state).length > 0) {
        this.appointmentForm.controls.addressForm.patchValue({
          'state': address.state
        });
      }
    })
  }

  onBackOperation() {
    this.isEdit = false;
    this.addressForm.reset();

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
    this.appointmentForm.controls.addressForm.patchValue({
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
    this.emitUserAddressDetails.emit(this.selectedAddress);
  }

  resetSelectedAddress() {
    this.userAddressList.forEach(item => {
      item["selected"] = false;
    });
  }
  onKeydown($event) {
    if($event.key == ' ') {
      return true;
    }
    if(($event.keyCode >= 48 && $event.keyCode <= 57) || ($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 96 && $event.keyCode <= 111)) {
      return false;
    }
  }
  fetchCountryStateCityByPin(ctrl: any, ev) {
	  if (ev.code.indexOf('Arrow') != -1) return;
    if(ctrl.value.pinCode.length == 6) {
      let payload = {
        "pincode" : ctrl.value.pinCode
      }
      this._individualService.findCountryStateCityByPin(payload).subscribe(data =>{
        if(data.status == 2000){
          if(data.data.country == null && data.data.state == null && data.data.city == null){
            this._toastService.showI18nToast("Invalid PIN Code", 'error');
            ctrl.patchValue({
              pinCode: "",
              country: "India",
              state: "",
              city: ""
            });
          }else{
            ctrl.patchValue({
              'country': data.data.country,
              'state': data.data.state,
              'city': data.data.city
            });
          }
        }else{
          this._toastService.showI18nToast(data['message'], 'error');
        }
      });
    }
  }  

  getUserAddresBtRefNoAndAddressType(userRefNo,addressType){
    let reQuestPayload={
     userRefNo:userRefNo,
     addressType:addressType
    }
    console.log("payload::",reQuestPayload);
      
   this._individualService.getUserAddresBtRefNoAndAddressType(reQuestPayload).subscribe(res => {
     console.log("RESPONSE::",res);
     
     if (res.status === 2000) {
       if(res.data.id!=null){
         this.appointmentForm.controls.addressForm.patchValue({
           id: res.data.id,
           addressType: res.data.addressType,
           country: res.data.country,
           pinCode: res.data.pinCode,
           state: res.data.state,
           city: res.data.city,
           line1: res.data.line1,
           line2: res.data.line2
         });
         
         //this.appointmentForm.controls.addressForm.markAsDirty();
       }else{
         this.appointmentForm.controls.addressForm.patchValue({
         id: null,
         addressType: "Inpatient",
         country: "India",
         pinCode: null,
         state: null,
         city: null,
         line1: null,
         line2: null,
 
         });
       }
       this.selectedAddress = res.data;
       this.emitUserAddressDetails.emit(this.selectedAddress);
       console.log("admissionForm after Address Fetch::",this.appointmentForm);
     } 
 
   });
 
  }

  // Working on app/issue/2355
  checkHolidayByAppointmentDateAndChamber(){
    let payload={
      chamberRefNo:this.appointmentForm.value.chamberRefNo,
      appointmentDate:this.appointmentForm.value.appointmentDate
    }
    this._doctorService.checkHolidayByAppointmentDateAndChamber(payload).subscribe(res=>{
      if (res.data > 0) {

        if(res.message!=null)
          this._toastService.showI18nToast(res.message, 'warning');
      }
      else{
        let d = (this.appointmentForm.value.appointmentDate.getDate() < 10 ? '0' : '') + this.appointmentForm.value.appointmentDate.getDate();
        let m = ((this.appointmentForm.value.appointmentDate.getMonth() + 1) < 10 ? '0' : '') + (this.appointmentForm.value.appointmentDate.getMonth() + 1);
        let selectedDateWithFormat = d + '/' + m + '/' + this.appointmentForm.value.appointmentDate.getFullYear();
        let query = {
          chamberRefNo: this.appointmentForm.value.chamberRefNo,
          appointmentDate: selectedDateWithFormat
        }
        if(this.appointmentForm.value.chamberRefNo!=""){
          this.getChamberTimingList(query);
        }
         
      }
    },error=>{
      console.log(error);
      
    });
  }

  // Working on app/issue/2399
calenderList: any =[];
    timingList: any =[];
    getChamberTimingList(payload){
      this._individualService.getCalenderDoctorChamberV5(payload).subscribe(result => {
        if (result.status == 2000) {
          this.calenderList = result.data;
         
          this.getClickningTimes();
        }
      });
    }

    doctorNotAvailableFlag: boolean = false;
    slotNotAvailableFlag: boolean = false;
    getClickningTimes(isToast = true) {
      this.timingList = [];
      let d = new Date(Date.parse(this.appointmentForm.value.appointmentDate));
      this.appointmentForm.value.appointmentDate = d;
  
      let currentDate = new Date();
      let momentItem = moment(d).format("YYYY-MM-DD");
      let momentCurrent = moment(currentDate).format("YYYY-MM-DD");
  
      let doctorAvailableOnSelectedDate = this.calenderList.filter(x => x["calendarDate"] == momentItem)[0];
      if (!doctorAvailableOnSelectedDate) {
        this.doctorNotAvailableFlag=true;
        this.slotNotAvailableFlag=false;
        //if (isToast) this._toastService.showI18nToast('DOCTOR_SEARCH_TOAST.DOC_NOT_AVAILABLE_ON_SELECTED_DATE', 'warning');
        return;
      }
  
      doctorAvailableOnSelectedDate.timeSlots.forEach(item => {
        if (!item.occupied) {
          let time = item.fromTime.substring(0, 5);
          if (momentItem === momentCurrent) {
            let currDate = new Date();
            let currentHrs = currDate.getHours();
            let currentMins = currDate.getMinutes();
            let itemHrs = Number(item.fromTime.substr(0, 2));
            let itemMins = Number(item.fromTime.substr(6, 7));
            if (itemHrs > currentHrs) {
              this.timingList.push({ id: time, label: time });
            } else if (itemHrs == currentHrs && itemMins >= currentMins) {
              this.timingList.push({ id: time, label: time });
            }
          } else {
            this.timingList.push({ id: time, label: time });
          }
        }
  
      })
      console.log(this.timingList);
          
      if (this.timingList.length == 0) {
        this.doctorNotAvailableFlag=false;
        this.slotNotAvailableFlag=true;
        //if (isToast) this._toastService.showI18nToast('DOCTOR_SEARCH_TOAST.NO_SLOT_AVAILABLE', 'warning');
      }
    }

    selectedTime:any=null;
    setAppointmentTime(time){
      this.selectedTime = time;
      this.appointmentForm.patchValue({
        'appointmentTime': time,
      });
      this.time = {hour:parseInt(time.substring(0, 2)) , minute:parseInt(time.substring(3, 5))};
    }

    // Working on app/issue/2399
    editModeAppointmentOn(editFor) {
       if(editFor == 'appointment') {
        this.editForApp = true;
        // this.appointmentForm.patchValue({
        //   'appointmentDate': this.initialFormValue.appointmentDate,
        //   'appointmentTime': this.initialFormValue.appointmentTime,
        //   'chamberRefNo': this.initialFormValue.chamberRefNo
        // });
      } else if(editFor == 'cancel') {
        // this.appointmentForm.patchValue({
        //   'appointmentDate': this.initialFormValue.appointmentDate,
        //   'appointmentTime': this.initialFormValue.appointmentTime,
        //   'chamberRefNo': this.initialFormValue.chamberRefNo
        // });
        this.timingList = [];
        this.doctorNotAvailableFlag=false;
        this.slotNotAvailableFlag=false;
        this.editForApp = false;
      }
    }

    updateAppointment(){
      this.appointmentForm.patchValue({
        appointmentDateStr: this.convert(this.appointmentForm.value.appointmentDate.toString())
      });
      let query = this.appointmentForm.value;
      this._doctorService.checkOverlappingDoctorAppointmentV4(this.makeRequestBodyForOverLappingDocAppNUpdateAppointment(query)).subscribe(data => {  // Working on app/issue/2086
        if (data.data > 0) {
          this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_EXISTS_IN_SAME_TIME_SLOT', 'error');
        }
        else{
          let query = this.appointmentForm.value;
          this._individualService.updateAppointment(this.makeRequestBodyForOverLappingDocAppNUpdateAppointment(query)).subscribe(resp => {
            if(resp.status == 2000) {
              this._doctorService.getAppointmentsViewByRefNo({appointmentRef: query.appointmentRefNo}).subscribe(response => {
                if(response.status == 2000) {
                  this.appointmentForm.patchValue({
                    'appointmentDate':new Date(response.data.appointmentDate),
                    'appointmentTime':response.data.appointmentTime.substring(0,5),
                    'chamberRefNo': response.data.chamberRefNo,
                    'chamberName': response.data.chamberName,
                    'onlineConsultationFlag': response.data.onlineConsultation == SBISConstants.YES_NO_CONST.YES_ENUM ? true: false
                  });
                  this.initialFormValue = this.appointmentForm.value;
                }
              });
              this.editForApp = false;
              this._toastService.showI18nToast("Success!", 'success');
            }
          });
        }
      });
    }

    makeRequestBodyForOverLappingDocAppNUpdateAppointment(value: any): any { //method to construct req payload 
      let query: any = value;
      query['onlineConsultation'] = value.onlineConsultationFlag ? SBISConstants.YES_NO_CONST.YES_ENUM: SBISConstants.YES_NO_CONST.NO_ENUM;
      return query;
    }//end of method

    convert(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), day, mnth].join("-");
    }

    convertDateToNo(str) {
      var date = new Date(str),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("");
    }
  //End Working on app/issue/2399
}//end of class

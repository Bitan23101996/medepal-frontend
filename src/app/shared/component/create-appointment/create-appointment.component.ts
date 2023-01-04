import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { DoctorService } from '../../../modules/doctor/doctor.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ToastService } from '../../../core/services/toast.service';
import { SBISConstants } from 'src/app/SBISConstants';
import { Router } from '@angular/router';
@Component({
  selector: 'app-create-appointment',
  templateUrl: './create-appointment.component.html',
  styleUrls: ['./create-appointment.component.css']
})
export class CreateAppointmentComponent implements OnInit {
  fromTime: any;
  toTime: any;
  isPopulated:boolean = false;
  isDob: boolean;
  getUserDetails:any
  minorUsers: any[] = [];
  isGender: boolean;
  isMinorDisable: boolean;
  isNewMinor: boolean;
  displaySidebar:boolean = false;
  chamberList: any[] = [];
  entityName: string;
  dtFormat = environment.DATE_FORMAT;
  submitted: boolean = false;
  startTimingErrorFlag: boolean = false;
  endTimingErrorFlag: boolean = false;
  usingComponentStr:string = "calender";
  associateUser: any;
  doctorRefNo:string;
  appointmentForm: FormGroup
  APP_STATE = SBISConstants.APPOINTMENT_STATE;
  APP_STATUS = SBISConstants.ENTITY_STATUS;

  user_roleName: any
  user_refNo: string;
  user_rolePk: number;
  userId: any;
  msUserId: any;
  loggedInUser: any;
  constructor( private fb: FormBuilder,private _doctorService: DoctorService,
               private broadcastService: BroadcastService,private _toastService: ToastService,
               private router: Router) { }

  ngOnInit() {
    this.broadcastService.setHeaderText('NEW APPOINTMENT');
    this.dtFormat = environment.DATE_FORMAT;
    let user = JSON.parse(localStorage.getItem('user'));
     this.user_roleName = user.roleName;
    this.user_refNo = user.refNo;
    this.user_rolePk = user.rolePk;
    this.entityName = user.entityName;
    this.userId = user.id;
    this.msUserId = user.userId;
    this.loggedInUser = JSON.parse(localStorage.getItem('user')); 
    this.doctorRefNo=user.refNo

    this.appointmentForm = this.fb.group({     
      appointmentByRefNo: null,
      appointmentCxlBy: null,
      appointmentCxlDateTime: null,
      appointmentCxlReason: null,
      appointmentRefNo: null,
      chamberRefNo: ['', Validators.required],
      onlineConsultationFlag: [false],
      doctorRefNo: this.doctorRefNo,
      userRefNo: [null],
      status: this.APP_STATUS.NORMAL,
      remarks: null,
      appointmentDateStr: null,
      appointmentDate: [null, Validators.required],
      appointmentTime: [null, Validators.required],
      patientName: [null, Validators.required],      
      appointmentState: null,
      patientContactNo: null,   
      isExistingInUser: [false],
      existingrolePk: [null],
      entityName: [this.entityName],
      isSerial: [null], 
      isMinor: [null],
      forMinor: false,
      minorRelationship: [null],
      patientDateOfBirth:[null],
      patientGender:[null,[ Validators.required]],
      patientAgeInMonth:[null],
      referredBy: [null],
      patientRefNo: [null],
      userAddressPk: [null],
      addressForm: this.fb.group({
        id:[null],
        line1: [null, [Validators.minLength(5), Validators.maxLength(100)]],
        line2: [null],
        country: ['India'],
        state: [null],
        city: [null, [Validators.minLength(3), Validators.maxLength(50)]],
        pinCode: [null, [Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
        addressType: ['Inpatient'],
        isSubmit: [false],
        isDirty: [false]
      })
    });

    // console.log("appointmentForm::::",this.appointmentForm)


     var request={
        "refNo":user.refNo
      }

      // console.log("request",request);
      this._doctorService.getAllChamberByDoctorRefNo(request).subscribe(
        result =>{
          console.log("result",result);
          this.chamberList = result.data;
          return;
        }
      )  
  }


  
  saveDoctorAppointment(appointmentState) {
    console.log(this.appointmentForm);
    
    this.submitted = true;
    if (this.appointmentForm.valid) {
      /****Save fresh new appointment******/
      if (this.appointmentForm.controls.appointmentRefNo.value === null) {
        if (this.fromTime != null) {
          this.appointmentForm.controls.appointmentTime.setValue(this.fromTime);
        }
        // let ageInMonth = this.appointmentForm.controls.patientAgeInMonth.value * 12;
        // this.appointmentForm.controls.patientAgeInMonth.setValue(ageInMonth);
      }
      //===================================//
      /****Cancel Or Reject appointment****/
      if (appointmentState === this.APP_STATE.CANCELLED || appointmentState === this.APP_STATE.REJECTED) {
        this.appointmentForm.patchValue({
          appointmentCxlBy: this.appointmentForm.controls.doctorPk.value
        });
      }
      //===================================//
      this.appointmentForm.patchValue({
        appointmentState: appointmentState,
      });

      this.appointmentForm.patchValue({
        appointmentDateStr: this.convert(this.appointmentForm.value.appointmentDate.toString())
      });

      if (this.entityName == 'DOCTOR') {
        if (this.appointmentForm.value.appointmentRefNo == null && this.appointmentForm.value.isExistingInUser) {
          
           this._doctorService.checkOverlappingDoctorAppointmentV3(this.makeRequestBodyJson(this.appointmentForm.value)).subscribe(data => {  // Working on app/issue/2086
            if (data.data > 0) {
              this.appointmentForm.patchValue({
                appointmentState: null,
              });
              this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_EXISTS_IN_SAME_TIME_SLOT', 'error');
            } else {
              this.appointmentForm.value.appointmentDateStr = this.convert(this.appointmentForm.value.appointmentDate.toString());
              // if(this.appointmentForm.get("patientAgeInMonth").value != null && this.appointmentForm.get("patientAgeInMonth").value != ""){
              //   let dob = +this.appointmentForm.get("patientAgeInMonth").value;
              //   // dob = dob * 12;
              //   // this.appointmentForm.patchValue({
              //   //   patientAgeInMonth: dob,
              //   //   ageInMonth: dob
              //   // });
              //  }
              let query = this.appointmentForm.value;
              this.submitAppointment(query);
            }
          });
        }
        else
          this.submitAppointment(this.appointmentForm.value);
      } else { // OPD
        // In case of new appointment do some validations
        if (this.appointmentForm.value.appointmentRefNo == null) {
          // In case of existing user check if he has already an appo in the chamber time slot
          if (this.appointmentForm.value.msUserPk != null) {
            this._doctorService.checkAppointmentExistsForUserInSelectedTimeRangeV2(this.makeRequestBodyJson(this.appointmentForm.value)).subscribe(data => {
              if (!data) {
                this.appointmentForm.patchValue({
                  appointmentState: null,
                });
                this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_EXISTS_IN_CHAMBER_TIME_RANGE', 'error');
              }
              else { // Check if overbooking limit is exceeded
                this._doctorService.checkOverBookingExcceededV2(this.makeRequestBodyJson(this.appointmentForm.value)).subscribe(data => {
                  if (!data) {
                    this.appointmentForm.patchValue({
                      appointmentState: null,
                    });
                    this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_OVERBOOKING_EXCEEDED', 'error');
                  }
                  else {
                    this.submitAppointment(this.appointmentForm.value);
                  }
                },
                  error => {
                    this.appointmentForm.patchValue({
                      appointmentState: null,
                    });
                    this._toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
                  })
              }
            },
              error => {
                this.appointmentForm.patchValue({
                  appointmentState: null,
                });
                this._toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
              })
          }
          else { // In case of new user check if overbooking limit is exceeded
            this._doctorService.checkOverBookingExcceeded(this.makeRequestBodyJson(this.appointmentForm.value)).subscribe(data => {
              if (!data) {
                this.appointmentForm.patchValue({
                  appointmentState: null,
                });
                this._toastService.showI18nToast('APPOINTMENT.APPOINTMENT_OVERBOOKING_EXCEEDED', 'error');
              }
              else {
                this.submitAppointment(this.appointmentForm.value);
              }
            },
              error => {
                this.appointmentForm.patchValue({
                  appointmentState: null,
                });
                this._toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
              })
          }
        }
        else {
          this.submitAppointment(this.appointmentForm.value);
        }
      }
    }
  }




  submitAppointment(query) {
    let addressForm =  this.appointmentForm.value.addressForm;
      console.log(addressForm);
      if(addressForm.pinCode=="" && addressForm.line1=="" && addressForm.state=="" 
        && addressForm.city=="" && addressForm.addressType==""){
          this.appointmentForm.controls.addressForm.patchValue({
            isSubmit: false
          })
      }
      else{
        this.appointmentForm.controls.addressForm.patchValue({
          isSubmit: true
        })
      }
      if(addressForm.pinCode!="" && addressForm.line1!="" && addressForm.state!="" 
        && addressForm.city!="" && addressForm.addressType!=""){
          // this.createPrescription.controls.addressForm.patchValue({
          //   isSubmit: true
          // })
      }
      else if(addressForm.pinCode=="" && addressForm.line1=="" && addressForm.state=="" 
      && addressForm.city=="" && addressForm.addressType==""){
        // this.createPrescription.controls.addressForm.patchValue({
        //   isSubmit: false
        // })
      }
      else{
        this._toastService.showI18nToast('Must enter full address information or none' , "error");
        return;
      }
      this.appointmentForm.controls.addressForm.patchValue({
        isDirty: this.appointmentForm.controls.addressForm.dirty
      })
      console.log(addressForm);
    if(this.getUserDetails.status == 2000) {
      query['appointmentByRefNo'] = this.appointmentForm.value.appointmentByRefNo;
      query['patientRefNo'] = this.appointmentForm.value.patientRefNo;
      query['appointmentTime'] = this.appointmentForm.value.appointmentTime;
      if(this.associateUser) {
        if(this.associateUser.name == 'Other') {
          // query['userName'] = this.associateUser.guardianName;
          // query['userContactNo'] = this.getUserDetails.data.user.contactNo;
          // query['minorRelationship'] = 'Guardian';
          query['patientContactNo'] = null;//this.appointmentForm.value.patientContactNo;
        }
      }
    } /*else if (this.getUserDetails.status == 5001) {
      // query['userName'] = this.appointmentForm.value.guardianName,
      // query['userEmailAddress'] = this.appointmentForm.value.guardianEmailId,
      // query['userContactNo'] = this.appointmentForm.value.guardianContactNo
      // query['minorRelationship'] = 'Guardian';
    } */
    query["dateOfBirth"] = this.appointmentForm.value.patientDateOfBirth;
  
      this._doctorService.makeAppointmentV4(this.makeRequestBodyJson(query)).subscribe(data => {
      if (data['status'] == '2000') {
       if (data['data'].appointmentState === this.APP_STATE.CONFIRMED || data['data'].appointmentState === this.APP_STATE.REQUESTED) {
          if (data['data'].appointmentState === this.APP_STATE.CONFIRMED) {
            this._toastService.showI18nToastFadeOut('APPOINTMENT.APPOINTMENT_CREATED', "success");
            this.router.navigate(['searchPatient']);
          }
          if (data['data'].appointmentState === this.APP_STATE.REQUESTED) {
            this._toastService.showI18nToastFadeOut('APPOINTMENT.APPOINTMENT_REQUEST_CREATED', "success");
          }     
        }
      }
      else {
        this._toastService.showI18nToast(data['message'], "error");
      }
    });
  }//end of method

  //method to return request body
  makeRequestBodyJson(query,cancel?:boolean): any{
    console.log(query);



    let appHour = query.appointmentTime.hour;
    let appMinute = query.appointmentTime.minute;

    if(appHour != undefined){
      if(appHour < 10){
        appHour = "0"+ appHour.toString();
      }else{
        appHour =  appHour.toString();
      }
    }

    if(appMinute != undefined){
      if(appMinute < 10){
        appMinute = "0"+ appMinute.toString();
      }else{
        appMinute =  appMinute.toString();
      }
    }


    if(appHour && appMinute){
        query.appointmentTime = appHour+":"+appMinute;
    }




    let requestBodyObj: any = {
      "patientDateOfBirth": query.patientDateOfBirth,
      "patientGender": query.patientGender,
      "patientAgeInMonth": (parseInt(query.patientAgeInMonth) > 0)? ((+query.patientAgeInMonth) * 12): null,
      "isSerial": query.isSerial,
      "patientContactNo": query.patientContactNo,
      "patientName": query.patientName,
      "entityName": query.entityName,	
      "appointmentDateStr": query.appointmentDateStr,
      "appointmentTime": query.appointmentTime+":"+"00",
      "chamberRefNo": query.chamberRefNo,
      "doctorRefNo": query.doctorRefNo,
      "patientRefNo": query.patientRefNo,
      "appointmentByRefNo": query.appointmentByRefNo,
      "referredBy" : query.referredBy, //app#1430
      "userRefNo": query.appointmentByRefNo,//app#2086
      "userAddressPk" : query.userAddressPk, //app#2367
      "addressForm": this.appointmentForm.controls.addressForm.value, //app#2367
      "onlineConsultation": this.appointmentForm.controls.onlineConsultationFlag.value ? SBISConstants.YES_NO_CONST.YES_ENUM : SBISConstants.YES_NO_CONST.NO_ENUM
    };
    
    return requestBodyObj;   
  }//end of method

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), day, mnth].join("-");
  }
  
  emitUserDetails(event){
    this.getUserDetails = event;
  }

  emitAssociateUser(event){
    this.associateUser = event
  }
  emitDisplaySidebar(event){
    this.displaySidebar = event;
  }


  convertTiming(event, label) {
    let startTime: any;
    let endTime: any;
    if (label == 'stTime') {
      this.fromTime = event.substring(0, 5);
    }
    if (label == 'ndTime') {
      this.toTime = event.substring(0, 5) ;
    }
    console.log(event);
    this.appointmentForm.value.appointmentTime = event.toString();
    console.log(this.appointmentForm.value)
  }

  backToMyAppointments(){
    this.router.navigate(['searchPatient']);
  }

  emitUserAddressDetails(selectedAddress){
    this.appointmentForm.patchValue({
      userAddressPk: selectedAddress == null ? null : selectedAddress.id,
    })
    
  }

}

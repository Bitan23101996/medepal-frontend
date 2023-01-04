import { Component, OnInit } from '@angular/core';
import { CustomFormService } from '../custom-form.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ToastService } from '../../../core/services/toast.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DoctorService } from '../../doctor/doctor.service';
import { SBISConstants } from '../../../SBISConstants';

@Component({
  selector: 'app-custom-form-fillup',
  templateUrl: './custom-form-fillup.component.html',
  styleUrls: ['./custom-form-fillup.component.css']
})
export class CustomFormFillupComponent implements OnInit {
  saveFlag: boolean = false;
  formList: any = [];
  customForm: any;
  questionList: any = [];
  answerSet: any = [];
  formRefNo: any = null;
  userForm: FormGroup;
  masterGender: any;
  isExistMultiRole: boolean = false;
  isDob: boolean = false;
  isGender: boolean = false;
  isPopulated: boolean = false;
  displaySidebar: boolean= false;
  associatedUserDetailsList: any[] = [];
  isExistingMinorPatient: boolean = false;
  getUserDetails: any;
  submitted: boolean = false;

  constructor(
    private customFormService: CustomFormService,
    private broadcastService: BroadcastService,
    private toastService: ToastService,
    private fb: FormBuilder,
    private doctorService: DoctorService
  ) { }

  ngOnInit() {
    this.broadcastService.setHeaderText("Fill up the form");
    this.saveFlag = false;
    this.isExistMultiRole = false;
    this.loadAllMasterData();
    this.getFormList();
    this.userForm = this.fb.group({
      patientRefNo: [null],
      patientMobile: [null, Validators.required],
      patientEmail: [null],
      patientName: [null, Validators.required],
      patientGender: [null, Validators.required],
      patientAgeInMonth: [null],
      patientDateOfBirth: [null],
      isExistingInUser:  [null],
      isSerial:  [null],
      forMinor:  [null]
    })
  }

  getFormList() {
    this.customFormService.GetFormList().subscribe((res) => {
      this.formList = res.data;
    })
  }

  getForm(form){
    if(form!=0){
      this.formRefNo = form;
      this.saveFlag = true;
    }
  }
  
  loadAllMasterData() {
    this.doctorService.getMasterDataGender({ q: SBISConstants.MASTER_DATA.GENDER }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
      }
    });
  }

  populatePatientDetailsByPhone(mobile) {
    this.isExistingMinorPatient = false;
    this.isExistMultiRole = false;
    if (mobile.length > 12) {
      this.isPopulated = false;
      this.doctorService.getAssociateUserByEaddress(mobile).subscribe(resp => {
        this.getUserDetails = resp;
        
        if (resp.status == 2000) {
          
          this.associatedUserDetailsList = [];
          (resp.data.individualUserBasicInfo) ? this.associatedUserDetailsList.push(resp.data.individualUserBasicInfo) : null;// add user to show in display list
          if (resp.data.associatedUserDetailsList.length != 0) {
            for (let associatedUserDetailsList of resp.data.associatedUserDetailsList) {
              this.associatedUserDetailsList.push(associatedUserDetailsList);
            }
          }
          if(resp.data.individualUserBasicInfo!=null){
            let other = {
              'name': 'Other',
              'userContactNo': resp.data.individualUserBasicInfo.contactNo ? resp.data.individualUserBasicInfo.contactNo : null,
              'dateOfBirth': null
            }
            this.associatedUserDetailsList.push(other);
            this.displaySidebar = true;
            this.isPopulated = true;
          }
          else{
            this.userForm.patchValue({
              'patientName': null,
              'patientGender': null,
              'patientRefNo': null,
              'isExistingInUser': null,
              'isSerial': null,
              'forMinor': null,
              'patientDateOfBirth': null
            });
          }
         
         
        } else if (resp.status == 5001) {
          this.isDob = false;         
  
        }
      });
    }
    else {
      
    }
  }

  isGuardian: boolean;
  isNewMinor: boolean = false;
  associateUser: any;
  setPatientIfMinorHave(associateUser) {
    this.associateUser = associateUser;
    let user = JSON.parse(localStorage.getItem('user'));
    this.userForm.patchValue({
      'patientName': associateUser.name=="Other"?null:associateUser.name,
      'patientGender': associateUser.gender,
      'patientRefNo': associateUser.refNo ? associateUser.refNo : null,
      'isExistingInUser': true,
      'isSerial': false,
      'forMinor': true,
      'patientDateOfBirth': associateUser.dateOfBirth ? associateUser.dateOfBirth : null
    });
    if(associateUser.name!="Other")
      this.isExistMultiRole = true;
    
    this.displaySidebar = false;
  }

  setAnswerSet(answerSet){
    this.answerSet = answerSet;
  }

  // setFormRefNo(formRefNo){
  //   this.formRefNo = formRefNo;
  // }

  saveResponse() {
    this.submitted = true;
    console.log(this.userForm.value);
    if (this.userForm.invalid) {
      return false;
    }
    if ((this.userForm.controls.patientAgeInMonth.value == null
      || this.userForm.controls.patientAgeInMonth.value.trim == '')
      && this.userForm.controls.patientDateOfBirth.value == null) {
      this.toastService.showI18nToastFadeOut("You must have to enter date of birth or age.", "error");
      return;
    }
    if(this.formRefNo==null){
      this.toastService.showI18nToastFadeOut("You must have to select a form.", "error");
      return;
    }
    if(this.answerSet.length==0){
      this.toastService.showI18nToastFadeOut("You have not attempt any questions. Hence can not save..", "error");
      return;
    }
    let payload = {
      userRefNo: this.userForm.value.patientRefNo,
      patientMobile: this.userForm.value.patientMobile,
      patientEmail: this.userForm.value.patientEmail,
      patientName: this.userForm.value.patientName,
      patientGender: this.userForm.value.patientGender,
      patientAgeInMonth: this.userForm.value.patientAgeInMonth,
      patientDateOfBirth: this.userForm.value.patientDateOfBirth,
      formRefNo: this.formRefNo,
      appointmentRefNo: null,
      admissionRefNo: null,
      responseDtoList: this.answerSet
    }
    this.customFormService.saveFilledUpForm(payload).subscribe((res) => {
        console.log(res.data);
        this.toastService.showI18nToastFadeOut("Form successfully submitted", "success");
       
        this.ngOnInit();
        this.submitted = false;
        this.saveFlag = false;
    })
  }

  backToPrevious(){
    window.history.back();
  }
}

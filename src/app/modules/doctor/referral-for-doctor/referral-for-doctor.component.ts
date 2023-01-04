import { Component, OnInit } from '@angular/core';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { DoctorService } from '../doctor.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, EmailValidator, FormControl } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-referral-for-doctor',
  templateUrl: './referral-for-doctor.component.html',
  styleUrls: ['./referral-for-doctor.component.css']
})
export class ReferralForDoctorComponent implements OnInit {


  referralDoc = {
    name: '',
    mobileNo: '',
    emailId: '',
    newDocArr: []
  }
  user_refNo: string;
  referralDoctorForm: FormGroup;
  isSendMail: boolean = false;
  user_name: any;

  constructor(
    private broadcastService: BroadcastService,
    private doctorService: DoctorService,
    private frb: FormBuilder,
    private toastService: ToastService
  ) {
    this.initialFormGroup();
   }

  ngOnInit() {
    this.broadcastService.setHeaderText('Doctor Referral');
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_name = user.firstName;
    this.user_refNo = user.refNo;
    this.createReferalDocField();
  }

  initialFormGroup() {
    this.referralDoctorForm = this.frb.group({
      referralDoctor: this.frb.array([])
    });
  }

  get referralDoctor(): FormArray {
    return this.referralDoctorForm.get('referralDoctor') as FormArray;
  }

  createReferalDocField() {
    let ctrl = <FormArray>this.referralDoctorForm.controls.referralDoctor as FormArray;
    ctrl.push(this.frb.group({
      'name': '',
      'mobileNo': '',
      'emailId': '',
    }));
  }

  deleteReferalDocField(index, referralDocDetails) {
    let ctrl = <FormArray>this.referralDoctorForm.controls.referralDoctor;
    if(ctrl.value.length > 1) {
      ctrl.removeAt(index);
      //this.checkMobileEmailValidation();
    } else {
      this.initialFormGroup();
      this.createReferalDocField();
    }
  }

  //retrieve user details
  getUserDetails(mobile) {
    console.log(mobile);
    // let mobileNo = this.referralDoc.
    this.doctorService.getIndividualUserData(mobile).subscribe((resp) => {
      console.log(resp.data);
    });
  } //end of method

  //send mail
  sendMail() {
    let ctrl = <FormArray>this.referralDoctorForm.controls.referralDoctor;
    for(let userDetails of ctrl.value) {
      if(userDetails.emailId != "" || userDetails.mobileNo != "") {
        if(userDetails.name == "") {
          this.toastService.showI18nToast("please fill the requied fields", 'warning');
          return;
        }
      }
    }
    let query = [];
    ctrl.value.forEach(element => {
      if(element.mobileNo == "") {
        element.mobileNo = null;
      }
      if(element.emailId == "") {
        element.emailId = null;
      }
      query.push({
        'referralByRefNo': this.user_refNo,
        'nameOfReferralDoctor': element.name,
        'contactNumberOfReferralDoctor': element.mobileNo,
        'emailOfReferralDoctor': element.emailId
      });
    });
    this.doctorService.doctorReferralSave(query).subscribe((resp) => {
      if(resp.status == 2000) {
        this.toastService.showI18nToast("Referral Send Successfully","success");
        if(ctrl.value.length != resp.data.length) {
          let userData = [];
          let formData = [];
          resp.data.forEach(element => {
            if(element.emailOfReferralDoctor) {
              userData.push(element.emailOfReferralDoctor);
            }
            if(element.contactNumberOfReferralDoctor) {
              userData.push(element.contactNumberOfReferralDoctor);
            }
          }); //resp dada array
          ctrl.value.forEach(element => {
            if(element.mobileNo) {
              formData.push(element.mobileNo);
            }
            if(element.emailId) {
              formData.push(element.emailId);
            }
          }); //ui form data arrayY
          let filterData = formData.filter(
            function(e) {
              return this.indexOf(e) < 0;
            }, userData
          )
          let dataString: string = "";
          if(filterData.length > 0) {
            filterData.forEach(element => {
              dataString = dataString? (dataString+","+element): element;
            });
            // this.toastService.showI18nToast("User/s " +dataString + " is already referred/exist", 'warning');
          }
        }
        this.referralDoctorForm.reset();
        this.initialFormGroup();
        this.createReferalDocField();
        this.isSendMail = false;
      }
    });
  } //end of method

  //validation check
  checkMobileEmailValidation(refDoc) {
    let ctrl = <FormArray>this.referralDoctorForm.controls.referralDoctor;
    let lastElement = ctrl.value.length - 1;
    let arrElement = ctrl.value[lastElement];

    // if (refDoc.value.name == "") {
    //   this.toastService.showI18nToast('enter the name of doctor', 'warning');
    //   this.isSendMail = false;
    //   return;
    // } else {
      if(refDoc.value.mobileNo == '' && refDoc.value.emailId == '') {
        this.toastService.showI18nToast('enter your email/mobile no', 'warning');
        this.isSendMail = false;
        return;
      } else {
        if(refDoc.value.mobileNo != '' && refDoc.value.emailId == '') {
          if(refDoc.value.mobileNo.length != 13) {
            this.toastService.showI18nToast('PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT', 'warning');
            this.isSendMail = false;
            return;
          }
        } else if(refDoc.value.emailId != '' && refDoc.value.mobileNo == '') {
          if(isNaN(refDoc.value.emailId)) {
            const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(refDoc.value.emailId) == false) {
              this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_EMAIL', 'error');
              this.isSendMail = false;
              return;
            }
          }
        } else if(refDoc.value.emailId != '' && refDoc.value.mobileNo != '') {
          if(refDoc.value.mobileNo.length != 13) {
            this.toastService.showI18nToast('PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT', 'warning');
            this.isSendMail = false;
            return;
          } else if(isNaN(refDoc.value.emailId)) {
            const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
            if (reg.test(refDoc.value.emailId) == false) {
              this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_EMAIL', 'error');
              this.isSendMail = false;
              return;
            }
          }
        }
      }
    //}
    if(refDoc.value.emailId != "" || refDoc.value.mobileNo != "") {
      let query = {
        "referralByRefNo" : this.user_refNo,
        "nameOfReferralDoctor" : refDoc.value.name,
        "emailOfReferralDoctor": refDoc.value.emailId ? refDoc.value.emailId : null,
        "contactNumberOfReferralDoctor": refDoc.value.mobileNo ? refDoc.value.mobileNo : null
      }
      this.checkUserExistance(query);
    }
  } //end of method

  checkContactNumber(refDoc) {
    let ctrl = <FormArray>this.referralDoctorForm.controls.referralDoctor;
    let lastElement = ctrl.value.length - 1;
    let arrElement = ctrl.value[lastElement];

    for(let userDetails of ctrl.value) {
      if(userDetails.mobileNo != "") {
        if(userDetails.mobileNo.length != 13) {
          this.toastService.showI18nToast('PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT', 'warning');
          this.isSendMail = false;
          return;
        } else {
          this.isSendMail = true;
        }
      }
    }
    if(refDoc.value.emailId != "" || refDoc.value.mobileNo != "") {
      let query = {
        "referralByRefNo" : this.user_refNo,
        "nameOfReferralDoctor" : refDoc.value.name,
        "emailOfReferralDoctor": refDoc.value.emailId ? refDoc.value.emailId : null,
        "contactNumberOfReferralDoctor": refDoc.value.mobileNo ? refDoc.value.mobileNo : null
      }
      this.checkUserExistance(query);
    }
  }

  checkNameValidation(refDoc) {
    let ctrl = <FormArray>this.referralDoctorForm.controls.referralDoctor;
    let lastElement = ctrl.value.length - 1;
    let arrElement = ctrl.value[lastElement];

    for(let userDetails of ctrl.value) {
      if(userDetails.emailId != "" || userDetails.mobileNo != "") {
        if(userDetails.name == "") {
          this.toastService.showI18nToast("please fill the requied fields", 'warning');
          this.isSendMail = false;
          return;
        } else {
          this.isSendMail = true;
        }
      } else {
        this.isSendMail = false;
      }
    }
    if(refDoc.value.emailId != "" || refDoc.value.mobileNo != "") {
      let query = {
        "referralByRefNo" : this.user_refNo,
        "nameOfReferralDoctor" : refDoc.value.name,
        "emailOfReferralDoctor": refDoc.value.emailId ? refDoc.value.emailId : null,
        "contactNumberOfReferralDoctor": refDoc.value.mobileNo ? refDoc.value.mobileNo : null
      }
      this.checkUserExistance(query);
    }
  }

  checkUserExistance(query) {
    this.doctorService.checkDoctorUser(query).subscribe((resp) => {
      if(resp.status == 2000) {
        //do nothing
      }
      if(resp.status == 2012) {
        this.toastService.showI18nToast(resp.message, 'error');
      }
      if(resp.status == 5059) {
        this.toastService.showI18nToast(resp.message, 'error');
      }
      if(resp.status == 5060) {
        this.toastService.showI18nToast(resp.message, 'error');
      }
    });
    this.isSendMail = true;
  }

}

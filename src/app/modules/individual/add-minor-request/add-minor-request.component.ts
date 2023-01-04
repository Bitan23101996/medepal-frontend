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


import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, EmailValidator } from '@angular/forms';
import { Location } from '@angular/common';
import { IndividualService } from './../individual.service';
import { ToastService } from './../../../core/services/toast.service';
import * as moment from 'moment';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../auth/auth.service';
import { GetSet } from '../../../core/utils/getSet';


@Component({
  selector: 'app-add-minor-request',
  templateUrl: './add-minor-request.component.html',
  styleUrls: ['./add-minor-request.component.css']
})
export class AddMinorRequestComponent implements OnInit {
  user: any;
  user_id: any;
  user_refNo: any;
  addMinorCtrl: FormGroup;
  maxDate: any;
  minDate: any;
  emailAdd: any = [];
  dateFormat = "";
  masterGender: any = [];
  genderList: any = [];
  masterBloodGroup: any = [];
  //  eAddressArr: any = [];
  inviteDocs: any = [];
  minorGuardianDetails: any = {
    gName: "",
    gContact: "",
    gEmail: "",
    // guardianRelation:"",
    newGuardianArr: []
  };
  minorUser: any;
  minorGender: any;

  relationshipArr: any = ['Parents', 'Guardain'];

  constructor(
    private broadcastService: BroadcastService,
    private frb: FormBuilder,
    private router: Router,
    private _location: Location,
    private toastService: ToastService,
    private individualService: IndividualService,
    private authService: AuthService

  ) {
    this.addMinorCtrl = frb.group({
      'name': [null, [Validators.required, Validators.maxLength(50), Validators.minLength(0)]],
      'dateOfBirth': [null, Validators.required],
      'relationship': [null, Validators.required],
      'emailAddress': [null], //For email Validation:-> [Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$'),EmailValidator]
      'contactNo': [null], //For Phone validation:-> [Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]
      'gender': [null, Validators.required],
      'bloodGroup': [null, Validators.required],
      'isSubmit': [false],
      'isEdit': [false],

      //other: this.frb.array([ this.addOtherSkillFormGroup()]),
      // itemRows: this.frb.array([ this.initItemRows()])
    });

  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.user_id = this.user.id;
    this.user_refNo = this.user.refNo;
    this.maxDate = new Date();
    this.dateFormat = environment.DATE_FORMAT;
    this.loadAllMasterData();
    this.minorUser = GetSet.getMinorUser();
    if(this.minorUser) {
      this.broadcastService.setHeaderText('EDIT MINOR');
    } else {
      this.broadcastService.setHeaderText('ADD MINORS');
    }

    // this.getMinorUserEditState();
  }

  getMinorUserEditState() {
    if (this.addMinorCtrl.get('gender').value == 'Female') {
      this.minorGender = 'F';
    } else if (this.addMinorCtrl.get('gender').value == 'Male') {
      this.minorGender = 'M'
    } else {
      this.minorGender = 'O'
    }
    if (this.minorUser) {
      console.log(this.minorUser);
      this.addMinorCtrl.patchValue({
        'name': this.minorUser.minor.name,
        'dateOfBirth': new Date(this.minorUser.minor.dateOfBirth),
        'gender': this.setGender(this.minorUser.minor.gender),//this.minorUser.minor.gender,
        'contactNo': this.minorUser.minor.contactNo,
        'emailAddress': this.minorUser.minor.emailAddress,
        'bloodGroup': this.minorUser.minor.bloodGroup,
        'relationship': this.minorUser.minor.relationshipName,
        'isSubmit': true
      });
      for (let guardian of this.minorUser.guardianList) {
        let guardianCtrl = {
          gName: guardian.name,
          gContact: guardian.contactNo,
          gEmail: guardian.emailAddress,
          mainUserRefNo: guardian.userRefNo ? guardian.userRefNo : '',
          isEdit: true
        };
        console.log(guardianCtrl);
        this.minorGuardianDetails.newGuardianArr.push(guardianCtrl);
      }
    } else {
      this.addMinorCtrl.patchValue({
        'name': '',
        'dateOfBirth': '',
        'gender': '',
        'contactNo': '',
        'emailAddress': '',
        'bloodGroup': '',
        'relationship': ''
      });
      this.minorGuardianDetails.newGuardianArr = [];
    }
  }//end of method

  //UPDATE MINOR:-->
  updateMinor() {
    let dob = this.addMinorCtrl.get('dateOfBirth').value;
    //new add to check date 
    let maxDate = new Date(this.maxDate);
    var d = new Date(dob);

    let diff = maxDate.getFullYear() - d.getFullYear();
    if (this.addMinorCtrl.get('gender').value == 'Female') {
      this.minorGender = 'F';
    } else if (this.addMinorCtrl.get('gender').value == 'Male') {
      this.minorGender = 'M'
    } else {
      this.minorGender = 'O'
    }
    let updatedValue = {
      'groupId': null,
      'userRefNo': this.minorUser.minor.userRefNo,
      'firstName': this.addMinorCtrl.get('name').value,
      'gender': this.minorGender,
      'contactNo': this.addMinorCtrl.get('contactNo').value,
      'emailAddress': this.addMinorCtrl.get('emailAddress').value,
      'bloodGroup': this.addMinorCtrl.get('bloodGroup').value,
      'dateOfBirth': this.addMinorCtrl.get('dateOfBirth').value,
      'relationship': "guardian",
    };
    if (diff > 18) {
      this.toastService.showI18nToast('Age Shoud be below 18 years', 'error');
    } else {
      this.individualService.updateUserProfile(updatedValue).subscribe((data) => {
        if (data.status === 2000) {
          this.addMinorCtrl.patchValue({
            'isEdit': false
          });
          this.broadcastService.setProfileModificationData(updatedValue);
          // this.loadUserProfile();
          this.router.navigate(['/individual/minor-list']);
        }
        // this.toastService.showI18nToast("USER_PROFILE_TOAST.UPDATE_USER_DETAILS", 'success');
      });
    }
  }
  //method to det genmder
  setGender(selectedGender: string): string {
    let genderDisplayValue: string = "";
    this.masterGender.forEach(el => {
      if (el.attributeValue == selectedGender) {
        genderDisplayValue = el.displayValue;
      }
    });
    return genderDisplayValue;

  }

  //Back Button
  goBack() {
    this._location.back();
  }
  //Name Input Validation:-->
  onKeydown($event) {
    if ($event.key == '"' || $event.key == '<' || $event.key == '>' || $event.key == '?' || $event.key == '@' || $event.key == '#' || $event.key == '$' || $event.key == '%' || $event.key == '^' || $event.key == '&' || $event.key == '*' || $event.key == '(' || $event.key == ')' || $event.key == '-' || $event.key == '_' || $event.key == '+' || $event.key == '=' || $event.key == '~' || $event.key == "." || $event.key == "," || $event.key == "/" || $event.key == "'" || $event.key == ":" || $event.key == ";" || $event.key == "`" || $event.key == "~" || $event.key == "{" || $event.key == "}" || $event.key == "[" || $event.key == "]" || $event.key == "|" || $event.key == "!") {
      return false;
    }
  }

  createSearchInputField() {
    let guardianCtrl = {
      gName: "",
      gContact: "",
      gEmail: "",
      // guardianRelation:""
    }
    this.minorGuardianDetails.newGuardianArr.push(guardianCtrl);
  }//end of method

  //Check Input Email or Phone for existing member detail:
  addEAddress() {
    let pathData: any;
    let lastIndex: number = this.minorGuardianDetails.newGuardianArr.length - 1;
    let formControl = this.minorGuardianDetails.newGuardianArr[lastIndex];

    if (!formControl.gName && !formControl.gContact && !formControl.gEmail) {
      this.toastService.showI18nToast("PEER_CONSLT.PLEASE_FILLOUT_FIELDS", 'warning');
      return;
    } else if (!formControl.gContact && !formControl.gEmail) {
      this.toastService.showI18nToast("PEER_CONSLT.ENTER_EMAIL_MOBILE", 'warning');
      return;
    } else if (formControl.gContact && !formControl.gEmail) {
      if (formControl.gContact.length != 13) {
        this.toastService.showI18nToast("PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT", 'warning');
        return;
      }
      pathData = formControl.gContact;
    } else if (!formControl.gContact && formControl.gEmail) {
      if (isNaN(formControl.gEmail)) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(formControl.gEmail) == false) {
          this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_EMAIL', 'error');
          return;
        }
      }
      pathData = formControl.gEmail;
    } else if (formControl.gContact && formControl.gEmail) {
      if (formControl.gContact.length != 13) {
        this.toastService.showI18nToast("PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT", 'warning');
        return;
      }
      if (isNaN(formControl.gEmail)) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(formControl.gEmail) == false) {
          this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_EMAIL', 'error');
          return;
        }
      }
      pathData = formControl.gContact;
    }
    this.individualService.listOfEaddress(pathData).subscribe((result) => {
      if (result.data == null) {
        if (formControl.gEmail) {
          this.toastService.showI18nToast('user not found', 'error');
          formControl.gName = '';
          formControl.gContact = '';
          formControl.gEmail = '';
          return;
        } else if (formControl.gContact) {
          this.toastService.showI18nToast('user not found', 'error');
          formControl.gName = '';
          formControl.gContact = '';
          formControl.gEmail = '';
          return;
        }
        else if (formControl.gName && formControl.gContact && formControl.gEmail) {
          let pathData = formControl.gEmail;
          this.individualService.listOfEaddress(pathData).subscribe(resp => {
            if (resp.data != null) {
              formControl.gName = resp.data.name;              
              formControl['mainUserRefNumber'] = resp.data.userRefNo;
              if (this.minorUser) {
                this.addMoreGuardian(resp);
              } else {
                let queryForInviteDoc = {
                  'userRefNo': resp.data.userRefNo,
                  'relationship': "guardian"
                }
                this.inviteDocs.push(queryForInviteDoc);
              }
              console.log(this.inviteDocs);
              if (formControl.gEmail == pathData) {
                formControl.gContact = "";
              }
              if (formControl.gContact == pathData) {
                formControl.gEmail = "";
              }
            } else {
              this.toastService.showI18nToast('user not found', 'error');
              formControl.gName = '';
              formControl.gContact = '';
              formControl.gEmail = '';
              return;
            }
          })
        } else {
          formControl.gName = result.data.name;
          if (this.minorUser == null || !this.minorUser) {
            let queryForInviteDoc = {
              'userRefNo': result.data.userRefNo,
              'relationship': "guardian"
            }
            this.inviteDocs.push(queryForInviteDoc);
          }
          if (this.minorUser) {
            this.addMoreGuardian(result);
          }
          // console.log(this.inviteDocs);
        }
      } else {
        if(result.data.userRefNo == this.user_refNo) {
          this.toastService.showI18nToast("you can't able to set youself as a guardian!" , 'error');
          formControl.gName = '';
          formControl.gContact = '';
          formControl.gEmail = '';
          return;
        }
        formControl.gName = result.data.name;
        formControl.gContact = result.data.contactNo;//new add to set gcontact
        if (this.minorUser == null || !this.minorUser) {
          let queryForInviteDoc = {
            'userRefNo': result.data.userRefNo,
            'relationship': "guardian"
          }
          this.inviteDocs.push(queryForInviteDoc);
        }
        if (this.minorUser) {
          this.addMoreGuardian(result);
        }
        // console.log(this.inviteDocs);
        formControl.gName = result.data.name;
        formControl.gContact = result.data.contactNo;//new add to add contact
        if (formControl.gEmail == pathData) {
          formControl.gContact = "";
        }
        if (formControl.gContact == pathData) {
          formControl.gEmail = "";
        }
        //this.toastService.showI18nToast('successfull!', 'success');
      }
    });
    //this.createSearchInputField();
  }//end of method

  addMoreGuardian(result) {
    if (this.user_refNo == result.data.userRefNo) {
      this.toastService.showI18nToast('Failed', 'error');
      return;
    } else {
      let queryForInviteDoc = {
        'userRefNo': result.data.userRefNo,
        'minorRefNo': this.minorUser.minor.userRefNo,
        'relationship': "guardian"
  
      }
      this.inviteDocs.push(queryForInviteDoc);
      this.individualService.addMoreGuardain(this.inviteDocs).subscribe((addGuardian) => {
        if (addGuardian.status == 2000) {
          //do nothing
          console.log(addGuardian.data);
        }
      });
    }

  }

  deleteGuardianList(selectedUserMinor) {
    // console.log("selectedUserMinor::", selectedUserMinor);
    if (confirm('Are you sure you want to cancel this appointment?')) {
    if (selectedUserMinor.mainUserRefNo) {
      let query = [{
        'userRefNo': selectedUserMinor.mainUserRefNo, //this.user_refNo,
        'minorRefNo': this.minorUser.minor.userRefNo,
      }];
      this.individualService.deleteGuardian(query).subscribe((data) => {
        if (data.status === 2000) {
          this.deleteUserMinorRow(selectedUserMinor);//calling the method to delete row      
          this.toastService.showI18nToast("Guardian Deleted", 'success');
        }

      });
    } else {
      this.deleteUserMinorRow(selectedUserMinor);//calling the method to delete row      
    }
  }//end of confirm msg check

  }//end of method

  deleteUserMinorRow(selectedUserMinor) {//mnethod to delete row
    let index: number = 0;
    for (let guardianEl of this.minorGuardianDetails.newGuardianArr) {
      if (guardianEl.mainUserRefNo == selectedUserMinor.mainUserRefNo) {
        this.minorGuardianDetails.newGuardianArr.splice(index, 1);
        break;
      }
      index++;
    }
  }//end of method
  //SAVE MINOR:-->
  saveMinorDetails() {
    if(!this.addMinorCtrl.get('name').value){
      this.toastService.showI18nToast('Please write the name!', 'warning');
      return;
    } else if(!this.addMinorCtrl.get('dateOfBirth').value) {
      this.toastService.showI18nToast('Please enter Date of Birth', 'warning');
      return;
    } else if(this.addMinorCtrl.get('contactNo').value) {
        if(this.addMinorCtrl.get('contactNo').value.length != 13) {
          this.toastService.showI18nToast('PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT', 'warning');
          return;
        } else {
          //this.checkContactNumber(this.addMinorCtrl.get('contactNo').value);
          let phoneNo = this.addMinorCtrl.get('contactNo').value.replace('+', '%2B');
          this.authService.checkMobileNoExist(phoneNo).subscribe((data) => {
              if (data.status === 5051) {
                this.toastService.showI18nToast("USER_PROFILE_TOAST.MOBILE_NUMBER_EXIST", 'error');
                this.addMinorCtrl.patchValue({
                'contactNo': ''
                });
              return;
            }
          });
        }
    } else if(this.addMinorCtrl.get('emailAddress').value) {
      if (isNaN(this.addMinorCtrl.get('emailAddress').value)) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(this.addMinorCtrl.get('emailAddress').value) == false) {
          this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_EMAIL', 'error');
          return;
        }
      } else {
          let email = this.addMinorCtrl.get('emailAddress').value.replace('@', '%40');
            this.authService.checkEmailExist(email).subscribe((data) => {
                if (data.status === 5050) {
                  this.toastService.showI18nToast("USER_PROFILE_TOAST.EMAIL_ADDRESS_EXIST", 'error');
                  this.addMinorCtrl.patchValue({
                  'emailAddress': ''
                  });
              return;
            }
        });
      }
    } else if(!this.addMinorCtrl.get('relationship').value) {
      this.toastService.showI18nToast('Please enter your relationship', 'warning');
      return;
    }
    if (this.minorUser) {
      this.updateMinor();
    } else {
      
      let dob = this.addMinorCtrl.get('dateOfBirth').value;
      //new add to check date 
      let maxDate = new Date(this.maxDate);
      var d = new Date(dob);

      let diff = maxDate.getFullYear() - d.getFullYear();
      if (this.addMinorCtrl.get('gender').value == 'Female') {
        this.minorGender = 'F';
      } else if (this.addMinorCtrl.get('gender').value == 'Male') {
        this.minorGender = 'M'
      } else {
        this.minorGender = 'O'
      }

      let query = {
        'name': this.addMinorCtrl.get('name').value,
        'contactNo': this.addMinorCtrl.get('contactNo').value,
        'emailAddress': this.addMinorCtrl.get('emailAddress').value,
        'dateOfBirth': this.addMinorCtrl.get('dateOfBirth').value,
        'relationship': this.addMinorCtrl.get('relationship').value,
        'gender': this.minorGender,
        'bloodGroup': this.addMinorCtrl.get('bloodGroup').value,
        'userRefNum': this.user_refNo,
        "guardianDto": this.inviteDocs
      }
      if (diff > 18) {
        this.toastService.showI18nToast('Age Shoud be below 18 years', 'error');
      }//end of oninit
      else {
        this.individualService.addMinorReq(query).subscribe((data) => {
          if (data.status === 2000) {
            this.individualService.getUserFullProfile(this.user_refNo).subscribe((response) => {
              GetSet.setMinorCount(response.data.minorCount);
            })
            this.toastService.showI18nToast(data.message, 'success');
            this.router.navigate(['/individual/minor-list']);
          }

        }, (error) => {
          // handle error
        });
      }
    }
  }

  checkContactNumber(contactNo: any) {
    // if (this.lControls.phoneNo.errors !== null) {
    //   // show error msg
    // } else {
    if(contactNo.length != 13) {
      this.toastService.showI18nToast('PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT', 'warning');
      return;
    }
    let phoneNo = contactNo.replace('+', '%2B');
    this.authService.checkMobileNoExist(phoneNo).subscribe((data) => {
      if (data) {
        if (data.status === 5051) {
          this.toastService.showI18nToast("USER_PROFILE_TOAST.MOBILE_NUMBER_EXIST", 'error');
          this.addMinorCtrl.patchValue({
            'contactNo': ''
          });
          return;
        }
        // show msg
      }
    },
      (error) => {
        // show error
      });
    // }
  }

  checkUserName(emailAddress: any) {
    // if (this.controls.emailAddress.errors !== null) {
    //   // show error msg
    // } else {
    if (isNaN(emailAddress)) {
        const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(emailAddress) == false) {
          this.toastService.showI18nToast('USER_GROUP_TOAST.INVALID_EMAIL', 'error');
          return;
        }
    }
    let email = emailAddress.replace('@', '%40');
    this.authService.checkEmailExist(email).subscribe((data) => {
      if (data) {
        if (data.status === 5050) {
          this.toastService.showI18nToast("USER_PROFILE_TOAST.EMAIL_ADDRESS_EXIST", 'error');
          this.addMinorCtrl.patchValue({
            'emailAddress': ''
          });
          return;
        }
        // show msg
      }
    },
      (error) => {
        // show error
      });
    // }
  }

  //gender list
  getGender() {
    this.individualService.getMasterDataGender({ q: 'GENDER' }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
        this.genderList = data.data;
        //console.log("masterGender::", this.masterGender);
      }
      this.getMinorUserEditState();
    });
  }

  loadAllMasterData() {

    this.individualService.getMasterDataGender({ q: 'BLOOD_GROUP' }).subscribe(data => {
      if (data.status === 2000) {
        this.masterBloodGroup = data.data;
      }
      this.getGender();
    });
  }
  

  getRelations(relationshipArr: string) {
    let displayRelation = this.relationshipArr.filter(x => x["attributeValue"] == relationshipArr)[0];
    if (displayRelation) {
      return displayRelation["displayValue"];
    } else {
      return;
    }
  }//end of method



}//end of class
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
import { IndividualService } from '../../../modules/individual/individual.service';
import { ToastService } from './../../../core/services/toast.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GetSet } from '../../../core/utils/getSet';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, EmailValidator, FormGroupDirective } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { setYear } from 'date-fns';
import { SBISConstants } from "../../../../app/SBISConstants";

@Component({
  selector: 'app-add-minor',
  templateUrl: './add-minor.component.html',
  styleUrls: ['./add-minor.component.css'],
  providers: [FormGroupDirective]
})
export class AddMinorComponent implements OnInit {

  user: any;
  user_id: any;
  user_refNo: any;
  headerText: any;
  minorUser: any[] = [];
  refNoOfMinor: any;
  minorUserDate: any;
  addMinorCtrl: FormGroup;
  isEdit: boolean = false;

  userLengthFetch: any = false;
  saveMinor: Boolean = true;
  masterGender: any = [];
  genderList: any = [];
  masterBloodGroup: any = [];
  relationshipArr: any;
  minorGuardianDetails: any = {
    gName: "",
    gContact: "",
    gEmail: "",
    // guardianRelation:"",
    newGuardianArr: []
  };
  inviteDocs: any = [];
  minorGender: any;
  maxDate: any;
  minDate: any;
  isAdd: boolean = false;

  constructor(
    private broadcastService: BroadcastService,
    private individualService: IndividualService,
    private toastService: ToastService,
    private router: Router,
    private frb: FormBuilder,
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
      'isEdit': [false]
    });
  }

  ngOnInit() {
    this.broadcastService.setHeaderText('MINORS');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.user_id = this.user.id;
    this.user_refNo = this.user.refNo;
    this.maxDate = new Date();
    let year = this.maxDate.getFullYear() - 18;
    //this.maxDate.setYear(year);
    this.minDate = new Date();
    this.minDate.setYear(year);
    this.loadMinorUserByRefNo();
    this.loadAllMasterData();
    this.getGender();
    this.getGuardianType();
  }

  getGuardianType() {
    this.individualService.getGuardianAttributeByName({ q: SBISConstants.MASTER_DATA.GUARDIAN_TYPE_MINOR }).subscribe(resp => {
      if(resp.status == 2000) {
        this.relationshipArr = resp.data;
      }
    });
  }

  loadMinorUserByRefNo() {
    this.minorUser = [];
    this.individualService.listViewOfMinor(this.user_refNo)
      .subscribe(data => {
        if (data.status === 2000) {
          let minorGuardians = data.data;
          let index = -1;
          for (let minorGuardian of minorGuardians) {
            index = index + 1;
            for (let guardian of minorGuardian.guardianList) {
              if (guardian.userRefNo == this.user_refNo) {
                data.data[index].minor.relationshipName = guardian.relationshipName;
              }
            }
          }
          this.userLengthFetch = true;
          for (let minor of data.data) {
            minor.guardianList = minor.guardianList.filter(x => x.userRefNo != this.user_refNo);
            minor['isEdit'] = false;
            this.minorUser.push(minor);
          }          
        }
      }, (error) => {

      });
    // this.allDataFetched = true;
  }

  editMinor(member, index) {
    this.minorGuardianDetails.newGuardianArr = [];
    this.isEdit = true;
    this.isAdd = false;
    this.saveMinor = true;
    this.minorUser[index].isEdit = true;
    GetSet.setMinorUser(member);
    this.addMinorCtrl.patchValue({
      'name': member.minor.name,
      'dateOfBirth': new Date(member.minor.dateOfBirth),
      'gender': this.setGender(member.minor.gender),//this.minorUser.minor.gender,
      'contactNo': member.minor.contactNo,
      'emailAddress': member.minor.emailAddress,
      'bloodGroup': member.minor.bloodGroup,
      'relationship': member.minor.relationshipName,
      'isSubmit': true
    });
    for (let guardian of member.guardianList) {
      let guardianCtrl = {
        gName: guardian.name,
        gContact: guardian.contactNo,
        gEmail: guardian.emailAddress,
        mainUserRefNo: guardian.userRefNo ? guardian.userRefNo : '',
        isEdit: true
      };
      this.minorGuardianDetails.newGuardianArr.push(guardianCtrl);
    }
    //this.minorUser[index]['minorEdit'] = 'editMinor';
    // this.router.navigate(['/individual/add-minor-request']);
  }

  addMinor() {
    // GetSet.setMinorUser(null);
    // this.router.navigate(['/individual/add-minor-request']);
    this.isAdd = true;
    this.inviteDocs = [];
    this.minorGuardianDetails.newGuardianArr = [];
    this.addMinorCtrl.reset();
  }

  cancelAddMinor() {
    this.isAdd = false;
  }

  cancelMinorEdit(index) {
    this.minorUser[index].isEdit = false;
    this.isEdit = false;
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

  //gender list
  getGender() {
    this.individualService.getMasterDataGender({ q: SBISConstants.MASTER_DATA.GENDER }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
        this.genderList = data.data;
      }
      // this.getMinorUserEditState();
    });
  }

  loadAllMasterData() {

    this.individualService.getMasterDataGender({ q: SBISConstants.MASTER_DATA.BLOOD_GROUP }).subscribe(data => {
      if (data.status === 2000) {
        this.masterBloodGroup = data.data;
      }
    });
  }

  checkContactNumber(contactNo: any) {
    let phoneNo: string;
    if(this.isEdit) {
      if(contactNo.length != 13) {
        this.toastService.showI18nToast('PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT', 'warning');
        this.saveMinor = false;
        return;
      } else {
        this.saveMinor = true;
        phoneNo = contactNo.replace('+', '%2B');
      }
    } else {
      if (contactNo.internationalNumber.length != 13) {
        this.toastService.showI18nToast('PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT', 'warning');
        this.saveMinor = false;
        return;
      } else {
        phoneNo = contactNo.internationalNumber.replace('+', '%2B');
        this.saveMinor = true;
      }
    }
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

  // getRelations(relationshipArr: string) {
  //   let displayRelation = this.relationshipArr.filter(x => x["attributeValue"] == relationshipArr)[0];
  //   if (displayRelation) {
  //     return displayRelation["displayValue"];
  //   } else {
  //     return;
  //   }
  // }//end of method

  deleteGuardianList(selectedUserMinor, member) {
    if (confirm('Are you sure you want to delete this guardian?')) {
      if (selectedUserMinor.mainUserRefNo) {
        let query = [{
          'userRefNo': selectedUserMinor.mainUserRefNo, //this.user_refNo,
          'minorRefNo': member.minor.userRefNo,
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

  createSearchInputField() {
    if(this.minorGuardianDetails.newGuardianArr.length > 0) {
      if(this.minorGuardianDetails.newGuardianArr[this.minorGuardianDetails.newGuardianArr.length -1].gName == '') {
        this.toastService.showI18nToast('Please fillup your associate guardian details','warning');
        return;
      }
    }
    let guardianCtrl = {
      gName: "",
      gContact: "",
      gEmail: "",
      // guardianRelation:""
    }
    this.minorGuardianDetails.newGuardianArr.push(guardianCtrl);
  }//end of method

  //Check Input Email or Phone for existing member detail:
  addEAddress(member) {
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
                this.addMoreGuardian(resp, member);
              } else {
                let queryForInviteDoc = {
                  'userRefNo': resp.data.userRefNo,
                  'relationship': "guardian"
                }
                // this.inviteDocs.push(queryForInviteDoc);
                this.checkArrayHasUserRefNo(this.inviteDocs, queryForInviteDoc.userRefNo) == -1 ? this.inviteDocs.push(queryForInviteDoc): null;
              }
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
          if (this.isAdd) {
            let queryForInviteDoc = {
              'userRefNo': result.data.userRefNo,
              'relationship': "guardian"
            }
            this.checkArrayHasUserRefNo(this.inviteDocs, queryForInviteDoc.userRefNo) == -1 ? this.inviteDocs.push(queryForInviteDoc): null;
            // this.inviteDocs.push(queryForInviteDoc);
          }
          if (!this.isAdd) {
            this.addMoreGuardian(result, member);
          }
        }
      } else {
        if (result.data.userRefNo == this.user_refNo) {
          this.toastService.showI18nToast("you can't able to set youself as a guardian!", 'error');
          formControl.gName = '';
          formControl.gContact = '';
          formControl.gEmail = '';
          return;
        }
        formControl.gName = result.data.name;
        formControl.gContact = result.data.contactNo;//new add to set gcontact
        if (this.isAdd) {
          let queryForInviteDoc = {
            'userRefNo': result.data.userRefNo,
            'relationship': "guardian"
          }
          this.checkArrayHasUserRefNo(this.inviteDocs, queryForInviteDoc.userRefNo) == -1 ? this.inviteDocs.push(queryForInviteDoc): null;
          // this.inviteDocs.push(queryForInviteDoc);
        }
        if (!this.isAdd) {
          this.addMoreGuardian(result, member);
        }
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

  addMoreGuardian(result, member) {
    if (this.user_refNo == result.data.userRefNo) {
      this.toastService.showI18nToast('Failed', 'error');
      return;
    } else {
      let queryForInviteDoc = {
        'userRefNo': result.data.userRefNo,
        'minorRefNo': member.minor.userRefNo,
        'relationship': "guardian"

      }
      this.checkArrayHasUserRefNo(this.inviteDocs, queryForInviteDoc.userRefNo) == -1 ? this.inviteDocs.push(queryForInviteDoc): null;
      this.individualService.addMoreGuardain(this.inviteDocs).subscribe((addGuardian) => {
        if (addGuardian.status == 2000) {
          //do nothing
        }
      });
    }
  }//end of method

  //method to check a array has user ref number or not
  checkArrayHasUserRefNo(array:any[], userRefNo:string): number{
    return array.findIndex(element=>element.userRefNo == userRefNo);
  }//end of method

  //SAVE MINOR:-->
  saveMinorDetails(member, index) {
    if (!this.addMinorCtrl.get('name').value) {
      this.toastService.showI18nToast('Please write the name!', 'warning');
      return;
    } else if (!this.addMinorCtrl.get('dateOfBirth').value) {
      this.toastService.showI18nToast('Please enter Date of Birth', 'warning');
      return;
    } else if (this.addMinorCtrl.value.contactNo) {
      if(this.isAdd) {
        if (this.addMinorCtrl.value.contactNo.internationalNumber.length != 13) {
          this.toastService.showI18nToast('PEER_CONSLT.MOBILE_NUMBER_HAVE_TEN_DIGIT', 'warning');
          return;
        }
      } else {
        if (this.isAdd) {
          let phoneNo = this.addMinorCtrl.value.contactNo.internationalNumber.replace('+', '%2B');
          this.authService.checkMobileNoExist(phoneNo).subscribe((data) => {
            if (data.status === 5051) {
              this.toastService.showI18nToast("USER_PROFILE_TOAST.MOBILE_NUMBER_EXIST", 'error');
              // this.addMinorCtrl.patchValue({
              //   'contactNo': null
              // });
              this.addMinorCtrl.value.contactNo.internationalNumber = "";
              return;
            }
          });
        } else {
          let formNumber = this.addMinorCtrl.value.contactNo.internationalNumber ? this.addMinorCtrl.value.contactNo.internationalNumber : this.addMinorCtrl.value.contactNo;
          if(member.minor.contactNo != formNumber.replace(/\s/g, "")) {
          // let number = this.addMinorCtrl.value.contactNo.internationalNumber ? this.addMinorCtrl.value.contactNo.internationalNumber : this.addMinorCtrl.value.contactNo;
          let phoneNo = formNumber.replace('+', '%2B');
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
        }
      }
    } else if (this.addMinorCtrl.get('emailAddress').value) {
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
    } else if (!this.addMinorCtrl.get('relationship').value) {
      this.toastService.showI18nToast('Please enter your relationship', 'warning');
      return;
    }
    if (!this.isAdd) {
      this.updateMinor(member, index);
    } else {
      if(this.minorGuardianDetails.newGuardianArr.length > 0) {
        if(this.minorGuardianDetails.newGuardianArr[this.minorGuardianDetails.newGuardianArr.length -1].gName == '') {
          this.toastService.showI18nToast('Please fillup your associate guardian details','warning');
          return;
        }
      }
      
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
      this.saveMinor = false;
      let query = {
        'name': this.addMinorCtrl.get('name').value,
        'contactNo': this.addMinorCtrl.value.contactNo?this.addMinorCtrl.value.contactNo.internationalNumber:null,
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
            this.saveMinor = true;
            this.individualService.getUserFullProfile(this.user_refNo).subscribe((response) => {
              GetSet.setMinorCount(response.data.minorCount);
             
            })
            this.toastService.showI18nToast(data.message, 'success');
            this.isAdd = false;
            this.loadMinorUserByRefNo();
            
          }

        }, (error) => {
          // handle error
        });
      }
    }
  }

  //UPDATE MINOR:-->
  updateMinor(member, index) {
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
      'userRefNo': member.minor.userRefNo,
      'firstName': this.addMinorCtrl.get('name').value,
      'gender': this.minorGender,
      'contactNo': (this.addMinorCtrl.value.contactNo && typeof this.addMinorCtrl.value.contactNo == 'object') ? this.addMinorCtrl.value.contactNo.internationalNumber.replace(/\s/g, "") : this.addMinorCtrl.value.contactNo,
      'emailAddress': this.addMinorCtrl.get('emailAddress').value,
      'bloodGroup': this.addMinorCtrl.get('bloodGroup').value,
      'dateOfBirth': this.addMinorCtrl.get('dateOfBirth').value,
      'relationship': "guardian",
    };
    // if (diff > 18) {
    //   this.toastService.showI18nToast('Age Shoud be below 18 years', 'error');
    // } else {
      if(this.minorGuardianDetails.newGuardianArr.length > 0) {
        if(this.minorGuardianDetails.newGuardianArr[this.minorGuardianDetails.newGuardianArr.length - 1].gName == '') {
          this.toastService.showI18nToast('Please fillup your guardian details','warning');
          return;
        }
      }
      
      this.individualService.updateUserProfile(updatedValue).subscribe((data) => {
        if (data.status === 2000) {
          this.addMinorCtrl.patchValue({
            'isEdit': false
          });
          this.loadMinorUserByRefNo();
          this.isEdit = false;
          this.broadcastService.setProfileModificationData(updatedValue);
          // this.loadUserProfile();
          //this.router.navigate(['/individual/minor-list']);
        }
        // this.toastService.showI18nToast("USER_PROFILE_TOAST.UPDATE_USER_DETAILS", 'success');
      });
    // }
  }

  //Name Input Validation:-->
  onKeydown($event) {
    if ($event.key == '"' || $event.key == '<' || $event.key == '>' || $event.key == '?' || $event.key == '@' || $event.key == '#' || $event.key == '$' || $event.key == '%' || $event.key == '^' || $event.key == '&' || $event.key == '*' || $event.key == '(' || $event.key == ')' || $event.key == '-' || $event.key == '_' || $event.key == '+' || $event.key == '=' || $event.key == '~' || $event.key == "." || $event.key == "," || $event.key == "/" || $event.key == "'" || $event.key == ":" || $event.key == ";" || $event.key == "`" || $event.key == "~" || $event.key == "{" || $event.key == "}" || $event.key == "[" || $event.key == "]" || $event.key == "|" || $event.key == "!") {
      return false;
    }
  }
  
  changeName(event, type , index) {
    if(type == 'guardianName') {
      this.minorGuardianDetails.newGuardianArr[index].gName = event;
    }
  }

}


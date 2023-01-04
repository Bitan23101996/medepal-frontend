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

import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { IndividualService } from './../individual.service';
import { ModalService } from './../../../shared/directive/modal/modal.service'
import { ToastService } from './../../../core/services/toast.service';
import { BroadcastService } from './../../../core/services/broadcast.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-user-profile-edit',
  templateUrl: './user-profile-edit.component.html',
  styleUrls: ['./user-profile-edit.component.css']
})
export class UserProfileEditComponent implements OnInit {
  panelOpenState = false;
  userProfile: FormGroup;
  addressForm: FormGroup;
  occupationForm: FormGroup;
  exerciseForm: FormGroup;
  user_id: any;
  user_refNo: any;
  ms_user_id: any;
  profileData: any;
  previousAddressType: any;
  masterGender: any = [];
  masterSTATE: any = [];
  masterCOUNTRY: any = [];
  masterEXERCISE: any = [];
  // exerciseFRE: any = ['Weekly','Daily'];
  multipleOccupation: any = [];
  addressT: any;
  addressId: any;
  exerciseId: any;
  occupationId: any;
  editType: any;
  paramId: any;
  multiExercise: any = [];
  addressSubmitted: any = false;
  occupationSubmitted: any = false;
  exerciseSubmitted: any = false;
  userProfileubmitted: any = false;
  exerciseTime = { hour: 10, minute: 10 };
  isTimerReady = true;
  userAdressUpdateObj: any = [];
  addressTypeList: any = [];
  natureOfExercise: any;
  natureOfJob: any = ['Sedentary Job', 'Non Sedentary Job', 'Semi Sedentary Job'];
  profileImageSrc = "";
  domSanitizer: any;
  minDate = { year: 1900, month: 1, day: 1 };
  progress: { percentage: number } = { percentage: 0 };
  maxDate = { year: new Date().getFullYear(), month: new Date().getMonth() + 1, day: new Date().getDate() };
  @ViewChild('tab') tab;
  dateFormat="";
  token:any;
  subscribe: any;
  disabledTab = {
    "tab-personal": false,
    "tab-address": false,
    "tab-occupation": false,
    "tab-exercise": false

  }

  constructor(private route: ActivatedRoute,
    private frb: FormBuilder,
    private translate: TranslateService,
    private _domSanitizer: DomSanitizer,
    private router: Router,
    private _location: Location,
    private toastService: ToastService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private broadcastService: BroadcastService,
    private individualService: IndividualService) {
    this.domSanitizer = _domSanitizer;
    this.userProfile = frb.group({
      'firstName': [null, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      'lastName': [null, [Validators.required, Validators.maxLength(50), Validators.minLength(3)]],
      'gender': [null, Validators.required],
      'dateOfBirth': [null, Validators.required],
      'maritialStatus': [null, Validators.required],
      // 'emailAddress': [{ value: '', disabled: true }, Validators.required],
      'emailAddress': [null, [Validators.required, Validators.pattern('^[a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,15})$')]],
      // 'emailAddress': [null, [Validators.required, Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')]],
      'contactNo': [null, [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
      //'exerciseRegime': [null, Validators.required],
      //'exerciseType': [null, Validators.required],
      //'madicalHistory': [null, Validators.required],
      //'anyChronicDisease': [null, Validators.required],
      //'vaccinationHistory': [null, Validators.required],
      'height': [null, [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')]],
      'weight': [null, [Validators.required, Validators.maxLength(3), Validators.pattern('^[0-9]*$')]],
      //'image': [null],
      'validate': ''
    });
    this.addressForm = frb.group({
      'line1': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      'line2': [null],
      'country': [null, Validators.required],
      'state': [null, Validators.required],
      'city': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      'pinCode': [null, [Validators.required]],
      'addressType': [null, Validators.required],
    });
    this.occupationForm = frb.group({
      'natureOfJob': [null, Validators.required],
      'typeOfJob': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      'workingHours': [null, Validators.required],
    });

    this.exerciseForm = frb.group({
      'natureOfExercise': [null, Validators.required],
      'exerciseFrequency': [null, Validators.required],
      'exerciseTime': [null, null],
    });
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en'); // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  ngOnInit() {
    this.dateFormat=environment.DATE_FORMAT;
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.token = user.token;
    this.ms_user_id = user.userId;
    this.loadAllMasterData();
    this.addressTypeList = [{ id: 1, Type: "Home" }, { id: 2, Type: "Office" }, { id: 3, Type: "Create" }];
    this.loadProfileImage();
  }

  ngAfterViewInit() {
    this.subscribe = this.route.params.subscribe(params => {
      this.paramId = params['paramId'];
      this.editType = params['tabName'];
      this.addressId = '';
      this.exerciseId = '';
      this.occupationId = '';
      if (this.editType == 'tab-address') {
        this.addressId = this.paramId;
      }
      else if (this.editType == 'tab-exercise') {
        this.exerciseId = this.paramId;
      } else if (this.editType == 'tab-occupation') {
        this.occupationId = this.paramId;
      }
      for (let key in this.disabledTab) {
        this.disabledTab[key] = false;
      }
      setTimeout(() => {
        if (this.tab)
          this.tab.select(this.editType);
        for (let key in this.disabledTab) {
          if (key == this.editType) {
            this.disabledTab[key] = false;
          } else {
            this.disabledTab[key] = true;
          }
        }
      });
    });

    this.loadProfileData();
  }


  backClicked() {
    this._location.back();
  }

  returnPreviousPage() {
    this.router.navigate(['/individual/' + this.editType]);
  }

  profileSubmit(profileValue) {
    this.userProfileubmitted = true;
    if (this.userProfile.invalid) {
      return;
    } else {
      this.individualService.updateUserProfile({
        'groupId': null,
        // 'id': this.user_id,
        'userRefNo': this.user_refNo,
        'firstName': profileValue.firstName,
        'lastName': profileValue.lastName,
        'gender': profileValue.gender,
        'contactNo': profileValue.contactNo,
        'emailAddress': profileValue.emailAddress,
        'dateOfBirth': new Date(profileValue.dateOfBirth),
        'maritialStatus': profileValue.maritialStatus,
        'physicalData': {
          'height': profileValue.height,
          'weight': profileValue.weight
        }
      }).subscribe((data) => {
        this.userProfileubmitted = false;
        if (data.status === 2000) {
          this.returnPreviousPage();
        }
        this.toastService.showToast(data.status, data.message);
      },
        (error) => {

        });
      // submit the value get the data show on dashbpard
    }
  }

  loadProfileImage() {
    let roleName = localStorage.getItem("roleName");
    let path: string = this.user_refNo + "/" + roleName;//neew add to download profile pic 
    this.individualService.downloadProfilePhotoV2(path).subscribe(result => {//this.ms_user_id
      if (result.status === 2000 && result.data !=null && result.data.length>0) {
        this.profileImageSrc = "data:image/jpeg;base64," + result.data;
        this.broadcastService.setProfileImage(this.profileImageSrc);
      }
      this.progress.percentage = 0;
    })
  }

  selectFile(event: any) {
    this.progress.percentage = 0;
    const file = event.target.files[0];
    if(Math.round(file.size/1024)>140){
      document.getElementById("profilePhoto")["value"] = "";
      this.toastService.showToast(-1, "Photo should be less then 140KB");
      return;
    }
    let formdata: FormData = new FormData();
    formdata.append('userId', this.ms_user_id);
    formdata.append('file', file);

    this.individualService.uploadProfilePhoto(formdata,this.token).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress.percentage = Math.round(100 * event.loaded / event.total);
        if (this.progress.percentage > 80) {
          this.progress.percentage = this.progress.percentage - 10;
        }
      } else if (event instanceof HttpResponse) {
        this.progress.percentage = 100;
        document.getElementById("profilePhoto")["value"] = "";
        this.loadProfileImage();
      }
    });

  }

  replaceNumber(profile: any) {
    let firstName = profile.firstName;
    firstName = firstName.replace(/\d/g, "");
    this.userProfile.patchValue({
      'firstName': firstName
    });
  }

  validPincode(addressForm: any) {
    const format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (format.test(addressForm.pinCode.charAt(0))) {
      this.addressForm.patchValue({
        'pinCode': addressForm.pinCode.substring(1)
      });
    }
  }

  addNewAddress(addValue: any) {
    this.addressSubmitted = true;
    if (this.addressForm.invalid) {
      return;
    }

    let query = {
      'line1': addValue.line1,
      'line2': addValue.line2,
      'country': addValue.country,
      'city': addValue.city,
      'addressType': addValue.addressType,
      'state': addValue.state,
      'pinCode': addValue.pinCode
    }
    if (this.addressId > 0) {
      query["id"] = this.addressId;
    } else {
      if (this.profileData.addressList.filter(x => x["addressType"] == addValue.addressType).length > 0) {
        this.toastService.showToast(-1, "Address Type: " + addValue.addressType + " is already added");
        return;
      }
    }

    this.individualService.updateUserProfile({
      'updateSection': 'ADDRESS',
      // 'id': this.user_id,
      'userRefNo': this.user_refNo,
      'addressList': [query]
    }).subscribe((data) => {
      this.addressSubmitted = false;
      // this.processUpdateProfile(data);
      // this.addressForm.reset();
      if (data.status === 2000) {
        this.returnPreviousPage();
      }
      this.toastService.showToast(data.status, data.message);
    }, (error) => {
      // handle error
    });

  }



  loadProfileData() {
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((res) => {
      if (res.status === 2000) {
        this.profileData = res.data;
        this.userProfile.patchValue({
          'firstName': res.data.firstName,
          'lastName': res.data.lastName,
          'gender': res.data.gender,
          'maritialStatus': res.data.maritialStatus,
          'emailAddress': res.data.emailAddress,
          'dateOfBirth':new Date(),
          // 'dateOfBirth': res.data.dateOfBirth === null ? '' : {
          //   year: new Date(res.data.dateOfBirth).getFullYear(),
          //   month: new Date(res.data.dateOfBirth).getMonth() + 1, day: new Date(res.data.dateOfBirth).getDate()
          // },
          'contactNo': res.data.contactNo,
          'height': res.data.physicalData ? res.data.physicalData.height : '',
          'weight': res.data.physicalData ? res.data.physicalData.weight : ''
        });

        this.addressForm.patchValue({
          'line1': res.data.addressList.line1,
          'line2': res.data.addressList.line1,
          'country': res.data.addressList.country,
          'state': res.data.addressList.state,
          'city': res.data.addressList.city,
          'pinCode': res.data.addressList.pinCode,
          'addressType': res.data.addressList.addressType,
        });
      }
      this.setPrfileData();
    }, (error) => {
      //  show error
    });
  }
  setPrfileData() {
    if (this.profileData) {
      let address = this.profileData.addressList.filter(x => x["id"] == this.addressId)[0];
      if (address) {
        this.addressT = address.addressType;
        if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == address.addressType.toLowerCase()).length == 0) {
          var newId = this.addressTypeList.length + 1;
          this.addressTypeList.push({ id: newId, Type: address.addressType });
        }
        this.addressForm.patchValue({
          'line1': address.line1,
          'line2': address.line2,
          'country': address.country,
          'city': address.city,
          'addressType': address.addressType,
          'state': address.state,
          'pinCode': address.pinCode
        });
        this.getStateCasCadeToCounntry(address.country);
      } else {
        this.addressForm.patchValue({
          'country': "India"
        });
        this.getStateCasCadeToCounntry("India");
      }

      let occupation = this.profileData.occupationList.filter(x => x["id"] == this.occupationId)[0];
      if (occupation) {
        this.occupationForm.patchValue({
          'natureOfJob': occupation.natureOfJob,
          'typeOfJob': occupation.typeOfJob,
          'workingHours': occupation.workingHours,
        })
      }

      let exercise = this.profileData.exerciseList.filter(x => x["id"] == this.exerciseId)[0];
      if (exercise) {
        this.exerciseForm.patchValue({
          'natureOfExercise': exercise.natureOfExercise,
          'exerciseFrequency': exercise.exerciseFrequency,
          'exerciseTime': exercise.exerciseTime
        })
        this.isTimerReady = false;
        this.exerciseTime.hour = Math.round(exercise.exerciseTime / 60);
        this.exerciseTime.minute = exercise.exerciseTime % 60;
        setTimeout(() => {
          this.isTimerReady = true;
        });
      }

    }

  }
  loadAllMasterData() {
    this.individualService.getMasterDataCountry().subscribe(data => {
      if (data.status === 2000) {
        this.masterCOUNTRY = data.data;

        /*   let countryFilter = this.masterCOUNTRY.filter(x => x["id"] == 1)[0];
          console.log( countryFilter);
          if (countryFilter) {
            this.addressForm.patchValue({
              'country': countryFilter
            });
          } */

        //console.log(this.masterCOUNTRY);
      } else {
        alert(data.message);
      }
    });

    this.individualService.getMasterDataGender({ q: 'GENDER' }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
      } else {
        //alert(data.message);
      }
    });

    this.individualService.getMasterDataExerciseType().subscribe(data => {
      if (data.status === 2000) {
        this.masterEXERCISE = data.data;
      } else {
        alert(data.message);
      }
    });

  }

  getStateCasCadeToCounntry(countryId: any) {
    this.masterSTATE = [];
    this.addressForm.patchValue({
      'state': ""
    });
    if (countryId == "") return;

    this.individualService.getMasterDataState(countryId).subscribe(data => {
      if (data.status === 2000) {
        this.masterSTATE = data.data;
        let address = this.profileData.addressList.filter(x => x["id"] == this.addressId)[0];
        if (address && this.masterSTATE.filter(x => x["stateName"] == address.state).length > 0) {
          this.addressForm.patchValue({
            'state': address.state
          });
        }
      }
      else if (data.status === 5007) {
        this.masterSTATE = [];
        /*  this.addressForm.patchValue({
           'state': address.state
         }); */
      }
    }, (error) => {

    });
  }

  setExercise(exData: any) {
    this.natureOfExercise = exData;
  }

  saveMoreExercise(exercise: any) {
    console.log(exercise);
    this.exerciseSubmitted = true;
    if (this.exerciseForm.invalid) {
      return;
    }
    if (this.profileData.exerciseList.filter(x => x["natureOfExercise"] == exercise.natureOfExercise && x["exerciseFrequency"] == exercise.exerciseFrequency).length > 0) {

      this.toastService.showToast(-1, "This exercise data already exist.");
      return;
    }
    let excData = {
      'exerciseTypeId': this.masterEXERCISE.filter(x => x["exerciseType"] == exercise.natureOfExercise)[0].id,
      'exerciseType': exercise.natureOfExercise,
      'exerciseFrequency': exercise.exerciseFrequency,
      'exerciseTime': (this.exerciseTime && this.exerciseTime.hour && this.exerciseTime.minute) ?
        this.exerciseTime.hour * 60 + this.exerciseTime.minute : null,
    }
    if (Number(this.exerciseId) > 0) {
      excData["id"] = Number(this.exerciseId);
    }
    this.individualService.updateUserProfile({
      'updateSection': 'EXCERCISE',
      // 'id': this.user_id,
      'userRefNo': this.user_refNo,
      'exerciseList': [excData]
    }).subscribe((data) => {
      this.exerciseSubmitted = false;
      this.toastService.showToast(data.status, data.message);
      this.returnPreviousPage();
    }, (error) => {
      // handle error
    });
  }
  // checking errors
  get lControls() { return this.userProfile.controls; }
  get adrsControls() { return this.addressForm.controls; }
  get occupationControls() { return this.occupationForm.controls; }
  get exerciseControls() { return this.exerciseForm.controls; }

  saveOccupation(occuValue: any) {

    this.occupationSubmitted = true;
    // stop here if form is invalid
    if (this.occupationForm.invalid) {
      return;
    }
    if (Number(this.occupationId) > 0 && this.profileData.occupationList.filter(x => x["natureOfJob"] == occuValue.natureOfJob &&
      x["id"] != Number(this.occupationId) &&
      x["typeOfJob"] == occuValue.typeOfJob &&
      x["workingHours"] == occuValue.workingHours).length > 0) {
      this.toastService.showToast(-1, "This occupation is already exist");
      return;
    } else if (Number(this.occupationId) < 1 && this.profileData.occupationList.filter(x => x["natureOfJob"] == occuValue.natureOfJob &&
      x["typeOfJob"] == occuValue.typeOfJob &&
      x["workingHours"] == occuValue.workingHours).length > 0) {
      this.toastService.showToast(-1, "This occupation is already exist");
      return;
    }

    let ocpData = {
      'natureOfJob': occuValue.natureOfJob,
      'typeOfJob': occuValue.typeOfJob,
      'workingHours': occuValue.workingHours
    }
    if (Number(this.occupationId) > 0) {
      ocpData["id"] = Number(this.occupationId);
    }
    this.individualService.updateUserProfile({
      'updateSection': 'OCCUPATION',
      // 'id': this.user_id,
      'userRefNo': this.user_refNo,
      'occupationList': [ocpData]
    }).subscribe((data) => {
      this.occupationSubmitted = false;
      this.toastService.showToast(data.status, data.message);
      this.returnPreviousPage();
    }, (error) => {
      // handle error
    });

  }

  createNewAddressType(ev: any, id: any) {
    if (ev.target.value === 'Create' || ev.target.value === 'create') {
      this.modalService.open(id);
    } else {
      if (this.profileData.addressList.filter(x => x["addressType"] == ev.target.value && x["id"] != this.addressId).length > 0) {
        let currentAddress = this.profileData.addressList.filter(x => x["id"] == this.addressId)[0];
        if (currentAddress) {
          this.addressForm.patchValue({
            'addressType': currentAddress["addressType"]
          });
        }
        this.toastService.showToast(-1, "Address Type is already added");
      }
    }
  }
  closeModal(id: any, type = '') {
    this.modalService.close(id);
    let currentAddress = this.profileData.addressList.filter(x => x["id"] == this.addressId)[0];
    if (currentAddress && type != 'withoutSave') {
      this.addressForm.patchValue({
        'addressType': currentAddress["addressType"]
      });
    }
    if (type == 'withoutSave') {
      this.addressForm.patchValue({
        'addressType': ''
      });
    }

  }

  createAddresType(adParam: any, id: any) {
    this.previousAddressType = '';
    if (adParam != '' && typeof adParam !== 'undefined') {
      if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == adParam.toLowerCase()).length > 0) {
        this.toastService.showToast(-1, 'This type already exist in list');
        return;
      }
      this.closeModal(id);
      this.addressT = adParam;
      let newId = this.addressTypeList.length + 1;
      this.addressTypeList.push({ id: newId, Type: adParam });
      this.addressForm.patchValue({
        'addressType': adParam
      });
    }
    else {
      this.toastService.showToast(-1, "Address Type cannot be blank");
    }
  }

  onTabChange(event) {
    this.router.navigate(['/individual/user-profile-edit/' + event.nextId + '/' + this.paramId]);
  }

  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
}

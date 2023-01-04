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
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IndividualService } from '../../individual.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BroadcastService } from './../../../../core/services/broadcast.service';

@Component({
  selector: 'app-user-life-style',
  templateUrl: './user-life-style.component.html',
  styleUrls: ['./user-life-style.component.css']
})
export class UserLifeStyleComponent implements OnInit {

  userProfileData: any;
  user_id: any;
  user_refNo: any;
  exerciseSubmitted: any = false;
  masterEXERCISE: any = [];
  masterExerciseBackup: any = [];
  profileData: any;
  exerciseTime = { hour: 10, minute: 10 };
  exerciseId: any;
  isTimerReady = true;
  form: FormGroup;
  isAddNewButtonDisableExercise = false;
  isAddNewButtonDisableOccupation = false;
  isExerciseToggle = true;
  isOccupationToggle = false;
  allFetchData: boolean = false;
  occupationSubmitted: any = false;
  occupationId: any;
  saveExercise: boolean = true;
  natureOfJob: any = ['Sedentary Job', 'Non Sedentary Job', 'Semi Sedentary Job'];
  tableEditForOccupation: boolean = false;
  tableEditForExercise: boolean =false;

  excerciseFrb: any;//to store length of excercise formarray controls
  occupationFrb: any;//to store length of occupation formarray controls
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private individualService: IndividualService,
    private toastService: ToastService,
    private frb: FormBuilder,
    private broadcastService: BroadcastService
  ) {
    this.initialFormGroup();
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.loadUserProfile();
    this.loadAllMasterData();
    document.body.classList.add('prescription-screen');//to remove the screen layout
  }

  ngAfterViewInit() {
    this.loadProfileData();
  }

  initialFormGroup() {
    this.form = this.frb.group({
      exercise: this.frb.array([]),
      occupation: this.frb.array([])
    });
  }

  loadUserProfile() {
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((result) => {      
      if (result.status === 2000) {
        this.userProfileData = result.data;
        // this.broadcastService.setHeaderText('Occupation-Exercise');
        this.profileData = result.data;
        this.initialFormGroup();
        this.profileData.exerciseList.forEach(exc => {
          let ctrl = <FormArray>this.form.controls.exercise;
          ctrl.push(this.frb.group({
            'id': [exc.id],
            'exerciseTypeId': [exc.exerciseTypeId],
            'natureOfExercise': [exc.natureOfExercise, Validators.required],
            'exerciseFrequency': [exc.exerciseFrequency, Validators.required],
            'exerciseTime': [exc.exerciseTime, Validators.required],
            'isEdit': [false],
            'isSubmit': [false]
          }))
        })
        this.profileData.occupationList.forEach(occu => {
          let ctrl = <FormArray>this.form.controls.occupation;
          ctrl.push(this.frb.group({
            'id': [occu.id],
            'natureOfJob': [occu.natureOfJob, Validators.required],
            'workingHours': [occu.workingHours, [Validators.required, Validators.min(1), Validators.max(24)]],
            'typeOfJob': [occu.typeOfJob, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
            'isEdit': [false],
            'isSubmit': [false]
          }))
        });
        this.excerciseFrb = this.form.get('exercise') as FormArray;
        this.occupationFrb = this.form.get('occupation') as FormArray;
      } else {
        // handle response
      }
      this.allFetchData = true;
    }, (error) => {
      // show error
    });
  }
  oldItems: any[] = [];

  updateExerciseDropDown(ctrl: any) {
    let arrayControl = this.form.get('exercise') as FormArray;
    let tempExerArray = [];
    this.masterEXERCISE = [];
    for (let i = 0; i < arrayControl.length; i++) {
      let itemCtrl = arrayControl.at(i);
      let item = itemCtrl.value;
      tempExerArray.push(item["natureOfExercise"]);
    }

    this.masterExerciseBackup.forEach(item => {
      if (tempExerArray.filter(x => (x == item["exerciseType"] && x != ctrl.value["natureOfExercise"])).length == 0) {
        this.masterEXERCISE.push(item);
      }
    });
  }

  editExercise(ctrl: any) {
    this.tableEditForExercise = true;
    this.updateExerciseDropDown(ctrl);
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit
    });
    //this.oldItem = ctrl.value;
    this.oldItems.push(ctrl.value);
    this.isAddNewButtonDisableExercise = true;
  }

  onTabChange(event) {
    this.router.navigate(['/individual/user-profile-view', event.nextId]);
  }

  editOccupation(ctrl: any) {
    this.tableEditForOccupation = true;
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit
    });
    this.isAddNewButtonDisableOccupation = true;
    this.oldItems.push(ctrl.value);
  }

  deleteOccupation(ctrl: any, index: number) {
    if (ctrl.value.id < 1) {
      let arrayControl = this.form.get('occupation') as FormArray;
      arrayControl.removeAt(index);
      this.isAddNewButtonDisableOccupation = false;
      return;
    }
    if (confirm('are you sure you want to delete this occupation ?')) {
      let query = {
        // 'userId': this.user_id,
        'userRefNo': this.user_refNo,
        'occupationList': [ctrl.value.id]
      }
      this.individualService.deleteOccupation(query).subscribe(data => {
        if (data.status === 2000) {
          this.loadUserProfile();
          this.toastService.showI18nToast(data.message, 'success');
          if (this.isAddNewButtonDisableOccupation) {
            this.isAddNewButtonDisableOccupation = false;
          }
        }
       
      });
    } else {
      // do nothing
    }
  }

  onKeydownOCP($event) {

    if ($event.key == '-') {
      return false;
    }
  }

  backButtonOCPOp(ctrl, inx, iconType) {
    this.tableEditForOccupation = false;
    this.isAddNewButtonDisableOccupation = false;
    let arrayControl = this.form.get('occupation') as FormArray;
    arrayControl.removeAt(inx);
    if (iconType == 'edit') {
      let oldIm = this.oldItems.filter(x => x["id"] == ctrl.value.id)[0];
      let formControl = this.frb.group({
        'id': oldIm.id,
        'natureOfJob': oldIm.natureOfJob,
        'workingHours': oldIm.workingHours,
        'typeOfJob': oldIm.typeOfJob,
        'isEdit': [false],
        'isSubmit': [false]
      });
      arrayControl.insert(inx, formControl);
    }
    ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
  }

  addOccupation() {
    this.tableEditForOccupation = true;
    this.saveExercise = true;
    let ctrl = <FormArray>this.form.controls.occupation;
    // if (ctrl.length == 0) {
    //   this.initialFormGroup();
    // }
    let formControl = this.frb.group({
      'id': [0],
      'natureOfJob': [null, Validators.required],
      'workingHours': [null, [Validators.required, Validators.min(1), Validators.max(24)]],
      'typeOfJob': [null, [Validators.required, Validators.pattern('[a-zA-Z ]*$')]],
      'isEdit': [true],
      'isSubmit': [false]
    });

    let formGroupArray = this.frb.array([]);
    formGroupArray.push(formControl);
    let arrayControl = this.form.get('occupation') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      let item = arrayControl.at(i);
      // item.patchValue({
      //   'isEdit': [false]
      // })
      formGroupArray.push(item);
    }
    this.form.setControl('occupation', formGroupArray);
    this.isAddNewButtonDisableOccupation = true;
  }

  addExercise() {
    this.tableEditForExercise = true;
    this.saveExercise = true;
    let ctrl = <FormArray>this.form.controls.exercise;
    let formControl = this.frb.group({
      'id': [0],
      'exerciseTypeId': [0],
      'natureOfExercise': [null, Validators.required],
      'exerciseFrequency': [null, Validators.required],
      'exerciseTime': [null, Validators.required],
      'isEdit': [true],
      'isSubmit': [false]
    });

    let formGroupArray = this.frb.array([]);
    formGroupArray.push(formControl);
    let arrayControl = this.form.get('exercise') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      let item = arrayControl.at(i);
      formGroupArray.push(item);
    }
    this.form.setControl('exercise', formGroupArray);
    this.isAddNewButtonDisableExercise = true;

    this.updateExerciseDropDown(formControl);
  }

  deleteExercise(ctrl: any, index: number) {
    if (ctrl.value.id < 1) {
      let arrayControl = this.form.get('exercise') as FormArray;
      arrayControl.removeAt(index);
      this.isAddNewButtonDisableExercise = false;
      return;
    }
    if (confirm('are you sure you want to delete this exercise ?')) {
      let query = {
        // 'userId': this.user_id,
        'userRefNo': this.user_refNo,
        'exerciseList': [ctrl.value.id]
      }
      this.individualService.deleteExercise(query).subscribe(data => {
        if (data.status === 2000) {
          this.ngOnInit();
          this.toastService.showI18nToast(data.message, 'success');
        }
        if (this.isAddNewButtonDisableExercise) {
          this.isAddNewButtonDisableExercise = false;
        }
        
      });
    } else {
      // do nothing
    }
  }

  loadProfileData() {
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((res) => {
      if (res.status === 2000) {
        this.profileData = res.data;
      }
      this.setPrfileData();
    }, (error) => {
      //  show error
    });
  }

  setPrfileData() {
    if (this.profileData) {
      let exercise = this.profileData.exerciseList.filter(x => x["id"] == this.exerciseId)[0];
      if (exercise) {
        this.userProfileData.patchValue({
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
    this.individualService.getMasterDataExerciseType().subscribe(data => {
      if (data.status === 2000) {
        this.masterExerciseBackup = data.data;
      } else {
        alert(data.message);
      }
    });

  }

  returnPreviousPage() {
    this.router.navigate(['/individual/tab-exercise']);
  }

  saveOccupation(ctrl: any) {  
    let occuValue = ctrl.value;
    let totalWorkingHourse = 0;
    ctrl.patchValue({
      'isSubmit': true
    });
    if (ctrl.invalid) {
      return;
    }

    let arrayControl = this.form.get('occupation') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      let itemCtrl = arrayControl.at(i);
      let item = itemCtrl.value;
      totalWorkingHourse = totalWorkingHourse + item["workingHours"];
    }
    if (occuValue.id > 0 && this.profileData.occupationList.filter(x => x["natureOfJob"] == occuValue.natureOfJob &&
      x["id"] != occuValue.id &&
      x["typeOfJob"] == occuValue.typeOfJob &&
      x["workingHours"] == occuValue.workingHours).length > 0) {
      this.toastService.showI18nToast("This occupation is already exist", 'error');
      return;
    } else if (this.profileData.occupationList.filter(x => x["natureOfJob"] == occuValue.natureOfJob &&
      x["typeOfJob"] == occuValue.typeOfJob && x["id"] != occuValue.id).length > 0) {
      this.toastService.showI18nToast("This occupation is already exist", 'error');
      return;
    } else if (occuValue.id < 1 && this.profileData.occupationList.filter(x => x["natureOfJob"] == occuValue.natureOfJob &&
      x["typeOfJob"] == occuValue.typeOfJob &&
      x["workingHours"] == occuValue.workingHours).length > 0) {
      this.toastService.showI18nToast("This occupation is already exist", 'error');
      return;
    } else if (totalWorkingHourse > 24) {
      this.toastService.showI18nToast("You can use working-hours total max 24", 'warning');
      return;
    }
    this.saveExercise = false;
    let ocpData = {
      'natureOfJob': occuValue.natureOfJob,
      'typeOfJob': occuValue.typeOfJob,
      'workingHours': occuValue.workingHours,
      'id': occuValue.id
    }
    if (occuValue.id < 1) {
      delete ocpData["id"];
    }
    this.individualService.updateUserProfile({
      'updateSection': 'OCCUPATION',
      'userRefNo': this.user_refNo,
      'occupationList': [ocpData]
    }).subscribe((data) => {
      if (data.status === 2000) {
        this.saveExercise = true;
        this.loadUserProfile();
        this.isAddNewButtonDisableOccupation = false;
      }
      this.toastService.showI18nToast(data.message, 'success');
    });
    this.oldItems = [];
  }

  saveMoreExercise(ctrl: any) {
    let exercise = ctrl.value;
    ctrl.patchValue({
      'isSubmit': true
    });
    if (ctrl.invalid) {
      return;
    }

    if (exercise.id > 0 && this.profileData.exerciseList.filter(x => x["natureOfExercise"] == exercise.natureOfExercise &&
      x["id"] != exercise.id &&
      x["exerciseFrequency"] == exercise.exerciseFrequency).length > 0) {
      this.toastService.showI18nToast("This exercise data already exist.", 'error');
      return;
    } else if (exercise.id < 1 && this.profileData.exerciseList.filter(x => x["natureOfExercise"] == exercise.natureOfExercise &&
      x["exerciseFrequency"] == exercise.exerciseFrequency).length > 0) {
      this.toastService.showI18nToast("This exercise data already exist.", 'error');
      return;

    }
    let excData = {
      'exerciseTypeId': this.masterEXERCISE.filter(x => x["exerciseType"] == exercise.natureOfExercise)[0].id,
      'exerciseType': exercise.natureOfExercise,
      'exerciseFrequency': exercise.exerciseFrequency,
      'exerciseTime': exercise.exerciseTime,
      'id': exercise.id
    }
    if (exercise.id < 1) {
      delete excData["id"];
    }
    this.saveExercise = false;
    this.individualService.updateUserProfile({
      'updateSection': 'EXCERCISE',
      'userRefNo': this.user_refNo,
      'exerciseList': [excData]
    }).subscribe((data) => {
      if (data.status === 2000) {
        this.saveExercise = true;
        this.loadUserProfile();
        this.toastService.showI18nToast(data.message, 'success');
        this.isAddNewButtonDisableExercise = false;
      }
      
    });
    this.oldItems = [];
  }

  backButtonOp(ctrl, inx, icontype) {
    this.isAddNewButtonDisableExercise = false;
    this.tableEditForExercise = false;
    let arrayControl = this.form.get('exercise') as FormArray;
    arrayControl.removeAt(inx);
    if (icontype == 'edit') {
      let oldIm = this.oldItems.filter(x => x["id"] == ctrl.value.id)[0];
      let formControl = this.frb.group({
        'id': oldIm.id,
        'exerciseTypeId': oldIm.exerciseTypeId,
        'natureOfExercise': oldIm.natureOfExercise,
        'exerciseFrequency': oldIm.exerciseFrequency,
        'exerciseTime': oldIm.exerciseTime,
        'isEdit': [false],
        'isSubmit': [false]
      });
      arrayControl.insert(inx, formControl);
    }
    ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
    //this.oldItem = null;
  }

  onKeydown($event) {
    if ($event.key == '-' || $event.key == '.' || $event.key == 'e' || $event.key == 'E') {
      return false;
    }
  }

  onKeyup(event) {
    if(event.target.value > 1440) {
      event.target.value = 1440;
      this.form.patchValue({
        'exerciseTime': event.target.value
      });
    }
  }

}

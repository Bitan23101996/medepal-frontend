import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { IndividualService } from '../../individual.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BroadcastService } from './../../../../core/services/broadcast.service';

@Component({
  selector: 'app-user-occupation',
  templateUrl: './user-occupation.component.html',
  styleUrls: ['./user-occupation.component.css']
})
export class UserOccupationComponent implements OnInit {

  user_id: any;
  user_refNo: any;
  userProfileData: any;
  occupationSubmitted: any = false;
  occupationId: any;
  profileData: any;
  natureOfJob: any = ['Sedentary Job', 'Non Sedentary Job', 'Semi Sedentary Job'];
  form: FormGroup;
  isAddNewButtonDisable = false;
  allDataFetched: boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private frb: FormBuilder,
    private toastService: ToastService,
    private individualService: IndividualService,
    private broadcastService: BroadcastService
  ) {
    this.initialFormGroup();
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.loadUserProfile();
  }

  initialFormGroup() {
    this.form = this.frb.group({
      occupation: this.frb.array([])
    });
  }

  loadUserProfile() {
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((result) => {
      if (result.status === 2000) {
        this.profileData = result.data;
        this.broadcastService.setHeaderText('Occupation');
        this.initialFormGroup();
        this.profileData.occupationList.forEach(occu => {
          let ctrl = <FormArray>this.form.controls.occupation;
          ctrl.push(this.frb.group({
            'id': [occu.id],
            'natureOfJob': [occu.natureOfJob, Validators.required],
            'workingHours': [occu.workingHours, [Validators.required, Validators.min(1), Validators.max(24)]],
            'typeOfJob': [occu.typeOfJob, [Validators.required, Validators.pattern('[A-Za-z]*')]],
            'isEdit': [false],
            'isSubmit': [false]
          }))
        })
      }
    });
    this.allDataFetched  = true;
  }

  onTabChange(event) {
    this.router.navigate(['/individual/user-profile-view', event.nextId]);
  }
  oldItems: any[] = [];
  editOccupation(ctrl: any) {
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit
    });
    this.isAddNewButtonDisable = true;
    this.oldItems.push(ctrl.value);
  }

  addOccupation() {
    let ctrl = <FormArray>this.form.controls.occupation;
    if (ctrl.length == 0) {
      this.initialFormGroup();
    }
    let formControl = this.frb.group({
      'id': [0],
      'natureOfJob': [null, Validators.required],
      'workingHours': [null, [Validators.required, Validators.min(1), Validators.max(24)]],
      'typeOfJob': [null, [Validators.required, Validators.pattern('[A-Za-z]*')]],
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
    this.isAddNewButtonDisable = true;
  }

  deleteOccupation(ctrl: any, index: number) {
    if (ctrl.value.id < 1) {
      let arrayControl = this.form.get('occupation') as FormArray;
      arrayControl.removeAt(index);
      this.isAddNewButtonDisable = false;
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
          if (this.isAddNewButtonDisable) {
            this.isAddNewButtonDisable = false;
          }
        }
        this.toastService.showI18nToast(data.message, 'success');
      });
    } else {
      // do nothing
    }
  }

  returnPreviousPage() {
    this.router.navigate(['/individual/tab-occupation']);
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
console.log(occuValue);
    if (occuValue.id > 0 && this.profileData.occupationList.filter(x => x["natureOfJob"] == occuValue.natureOfJob &&
      x["id"] != occuValue.id &&
      (x["typeOfJob"] == occuValue.typeOfJob.toLowerCase() || x["typeOfJob"] == occuValue.typeOfJob.toUpperCase()) &&
      x["workingHours"] == occuValue.workingHours).length > 0) {
      this.toastService.showI18nToast('USER_OCCUPATION_TOAST.OCCUPATION_EXIST', 'error');
      return;
    } else if (this.profileData.occupationList.filter(x => x["natureOfJob"] == occuValue.natureOfJob &&
    (x["typeOfJob"] == occuValue.typeOfJob.toLowerCase() || x["typeOfJob"] == occuValue.typeOfJob.toUpperCase()) && x["id"] != occuValue.id).length>0 ) {
      this.toastService.showI18nToast('USER_OCCUPATION_TOAST.OCCUPATION_EXIST', 'error');
      return;
    } else if (occuValue.id < 1 && this.profileData.occupationList.filter(x => x["natureOfJob"] == occuValue.natureOfJob &&
    (x["typeOfJob"] == occuValue.typeOfJob.toLowerCase() || x["typeOfJob"] == occuValue.typeOfJob.toUpperCase()) &&
      x["workingHours"] == occuValue.workingHours).length > 0) {
      this.toastService.showI18nToast('USER_OCCUPATION_TOAST.OCCUPATION_EXIST', 'error');
      return;
    } else if (totalWorkingHourse > 24) {
      this.toastService.showI18nToast('USER_OCCUPATION_TOAST.WORKING_HOURS_MAX_24', 'error');
      return;
    }

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
      // 'id': this.user_id,
      'userRefNo': this.user_refNo,
      'occupationList': [ocpData]
    }).subscribe((data) => {
      if (data.status === 2000) {
        this.loadUserProfile();
        this.isAddNewButtonDisable = false;
      }
      this.toastService.showI18nToast(data.message, 'success');
    });
    this.oldItems = [];
  }

  onKeydown($event) {

    if ($event.key == '-') {
      return false;
    }
  }

  backButtonOp(ctrl, inx) {
    this.isAddNewButtonDisable = false;
    let arrayControl = this.form.get('occupation') as FormArray;
    arrayControl.removeAt(inx);
    let oldIm = this.oldItems.filter(x => x["id"] == ctrl.value.id)[0];
    let formControl = this.frb.group({
      'id': oldIm.id,
      'natureOfJob': oldIm.natureOfJob,
      'workingHours': oldIm.workingHours,
      'typeOfJob': oldIm.typeOfJob,
      'isEdit': [false],
      'isSubmit': [false]
    });
    //console.log(ctrl);
    //console.log(oldIm);
    arrayControl.insert(inx, formControl);
    ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
  }

}

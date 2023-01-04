import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { IndividualService } from '../../individual.service';
import { ToastService } from '../../../../core/services/toast.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BroadcastService } from './../../../../core/services/broadcast.service';

@Component({
  selector: 'app-user-exercise',
  templateUrl: './user-exercise.component.html',
  styleUrls: ['./user-exercise.component.css']
})
export class UserExerciseComponent implements OnInit {

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
  isAddNewButtonDisable = false;
  allDataFetched: boolean = false;
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
  }

  ngAfterViewInit() {
    this.loadProfileData();
  }

  initialFormGroup() {
    this.form = this.frb.group({
      exercise: this.frb.array([])
    });
  }

  loadUserProfile() {
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((result) => {
      if (result.status === 2000) {
        this.userProfileData = result.data;
        this.broadcastService.setHeaderText('Exercise');
        this.profileData = result.data;
        this.initialFormGroup();
        this.profileData.exerciseList.forEach(exc => {
          let ctrl = <FormArray>this.form.controls.exercise;
          ctrl.push(this.frb.group({
            'id': [exc.id],
            'exerciseTypeId': [exc.exerciseTypeId],
            'natureOfExercise': [exc.natureOfExercise, Validators.required],
            'exerciseFrequency': [exc.exerciseFrequency, Validators.required],
            'exerciseTime': [exc.exerciseTime,[ Validators.required, Validators.min(1), Validators.max(300),Validators.maxLength(3)]],
            'isEdit': [false],
            'isSubmit': [false]
          }))
        })
      } else {
        // handle response
      }
    }, (error) => {
      // show error
    });
    this.allDataFetched = true;
  }
  oldItems:any[] = [];

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
    this.updateExerciseDropDown(ctrl);
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit
    });
    //this.oldItem = ctrl.value;
    this.oldItems.push(ctrl.value);
    this.isAddNewButtonDisable = true;
  }

  onTabChange(event) {
    this.router.navigate(['/individual/user-profile-view', event.nextId]);
  }

  addExercise() {
    let ctrl = <FormArray>this.form.controls.exercise;
    let formControl = this.frb.group({
      'id': [0],
      'exerciseTypeId': [0],
      'natureOfExercise': [null, Validators.required],
      'exerciseFrequency': [null, Validators.required],
      'exerciseTime': [null,[ Validators.required, Validators.min(1), Validators.max(300), Validators.maxLength(3)]],
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
    this.isAddNewButtonDisable = true;

    this.updateExerciseDropDown(formControl);
  }

  deleteExercise(ctrl: any, index: number) {
    if (ctrl.value.id < 1) {
      let arrayControl = this.form.get('exercise') as FormArray;
      arrayControl.removeAt(index);
      this.isAddNewButtonDisable = false;
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
        }
        if (this.isAddNewButtonDisable) {
          this.isAddNewButtonDisable = false;
        }
        this.toastService.showI18nToast(data.message, 'success');
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
      this.toastService.showI18nToast('USER_EXERCISE_TOAST.EXERCISE_EXIST', 'error');
      return;
    } else if (exercise.id < 1 && this.profileData.exerciseList.filter(x => x["natureOfExercise"] == exercise.natureOfExercise &&
      x["exerciseFrequency"] == exercise.exerciseFrequency).length > 0) {
        this.toastService.showI18nToast('USER_EXERCISE_TOAST.EXERCISE_EXIST', 'error');
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
    this.individualService.updateUserProfile({
      'updateSection': 'EXCERCISE',
      // 'id': this.user_id,
      'userRefNo': this.user_refNo,
      'exerciseList': [excData]
    }).subscribe((data) => {
      if (data.status === 2000) {
        this.loadUserProfile();
        this.isAddNewButtonDisable = false;
      }
      this.toastService.showI18nToast(data.message, 'success');
    });
    this.oldItems = [];
  }

  backButtonOp(ctrl, inx) {
    this.isAddNewButtonDisable = false;
    let arrayControl = this.form.get('exercise') as FormArray;
    arrayControl.removeAt(inx);
    let oldIm = this.oldItems.filter(x=>x["id"]==ctrl.value.id)[0];
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
    ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
    //this.oldItem = null;
  }

  onKeydown($event) {

    if ($event.key == '-'|| $event.key == '.' || $event.key == 'e' || $event.key == 'E') {
      return false;
    }
  }

}

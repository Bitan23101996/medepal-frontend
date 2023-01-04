import { Component, OnInit, OnDestroy } from '@angular/core';
import { IndividualService } from '../individual.service';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { SBISConstants } from 'src/app/SBISConstants';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-permission-to-view-record',
  templateUrl: './permission-to-view-record.component.html',
  styleUrls: ['./permission-to-view-record.component.css']
})
export class PermissionToViewRecordComponent implements OnInit, OnDestroy {

  user: any;
  permissionDetails: any[] = [];
  finalPermissionData: any[] = [];
  panelVisible = false;
  permissionForm: FormGroup;
  permissionFormFilterData: FormGroup;
  minDate: Date;
  date: Date;
  maxDate: Date;
  fromDate: any = "";
  toDate: any = "";

  constructor(
    public individualService: IndividualService,
    private frb: FormBuilder,
    private datePipe: DatePipe,
    private toastService: ToastService
  ) {
    this.fromDate = JSON.parse(localStorage.getItem("fromDatePrevious"));
    this.toDate = JSON.parse(localStorage.getItem("toDatePrevious"));
    this.permissionFormFilterData = frb.group({
      'doctorName': [''],
      'fromDate': [new Date()],
      'toDate': [new Date()]
    });
    this.customiseDesignOfBodyAcordingToUrl();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getAuthorization();
    this.minDate = new Date();
    this.date = new Date();
    this.date.setDate(this.minDate.getDate() + 60);
    this.maxDate = this.date;
  }

  initialFormGroup() {
    this.permissionForm = this.frb.group({
      permission: this.frb.array([])
    });
  }

  customiseDesignOfBodyAcordingToUrl() {
    const url = window.location.href.toString();
    if (url.endsWith("/permission-to-view-record"))
      document.body.classList.add('prescription-screen');
    else
      document.body.classList.remove('prescription-screen');
  }//end of method

  ngOnDestroy() {
    document.body.classList.remove('prescription-screen');
  }//end of method

  getAuthorization() {
    let query = {
      authorizationby: this.user.refNo
    }
    this.individualService.getPermission(query).subscribe(resp => {
      if (resp.status == 2000) {
        this.permissionDetails = resp.data;
        this.finalPermissionData = resp.data;
        this.initialFormGroup();
        if(resp.data) {
          resp.data.forEach(element => {
            element['isEdit'] = false;
          });
          this.permissionDetails.forEach(per => {
            let ctrl = this.permissionForm.controls.permission as FormArray;
            ctrl.push(this.frb.group({
              // 'name': [per.natureOfJob, Validators.required],
              'refNo': [per.refNo],
              'doctorName': [per.doctorName],
              'permissionCheck': [per.refNo ? true : false],
              'authorizationDateFrom': [new Date(this.transformDate(per.authorizationDateFrom, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER))],//[new Date(per.authorizationDateFrom)],
              'authorizationDateTo': [new Date(this.transformDate(per.authorizationDateTo, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER))], //[new Date(per.authorizationDateTo)],
              'isEdit': [false],
              'authorizationByRefNo': [per.authorizationByRefNo],
              'authorizationForRefNo': [per.authorizationForRefNo]
            }))
          });
        }
      }
    });
  }

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

  editPermission(users, index) {
    users.patchValue({
      'isEdit': !users.value.isEdit
    });
  }

  backToViewMode(users, index) {
    // this.permissionDetails = this.finalPermissionData;
    this.permissionForm.reset();
    this.initialFormGroup();
    this.finalPermissionData.forEach(per => {
      let ctrl = this.permissionForm.controls.permission as FormArray;
      ctrl.push(this.frb.group({
        // 'name': [per.natureOfJob, Validators.required],
        'refNo': [per.refNo],
        'doctorName': [per.doctorName],
        'permissionCheck': [per.authorizationDateFrom ? true : false],
        'authorizationDateFrom': [new Date(this.transformDate(per.authorizationDateFrom, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER))],//[new Date(per.authorizationDateFrom)],
        'authorizationDateTo': [new Date(this.transformDate(per.authorizationDateTo, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER))], //[new Date(per.authorizationDateTo)],
        'isEdit': [false],
      }))
    });
    users.patchValue({
      'isEdit': !users.value.isEdit
    });
  }

  savePermission(users) {
    console.log(users.value.permissionCheck);
    
    if (users.value.permissionCheck) {
      let query = {
        "authorizationDateFrom": this.transformDate(users.value.authorizationDateFrom, SBISConstants.GLOBAL_DATE_FORMAT_FOR_PERMISSION),
        "authorizationDateTo": this.transformDate(users.value.authorizationDateTo, SBISConstants.GLOBAL_DATE_FORMAT_FOR_PERMISSION)
      }
      if(users.value.refNo) {
        query['refNo'] = users.value.refNo
      } else {
        query['authorizationByRefNo'] = users.value.authorizationByRefNo;
        query['authorizationForRefNo'] = users.value.authorizationForRefNo;
      }
      this.individualService.setPermission(query).subscribe(result => {
        if (result.status == 2000) {
          this.toastService.showI18nToast('Permission Updated Successfully', 'success');
          users.patchValue({
            'isEdit': !users.value.isEdit
          });
          this.getAuthorization();
        }
      });
    } else {
      this.individualService.revokePermission({ 'refNo': users.value.refNo }).subscribe(res => {
        if (res.status == 2000) {
          console.log(res.data);
          users.patchValue({
            'isEdit': !users.value.isEdit
          });
          this.toastService.showI18nToast('Permission Revoked Successfully', 'success');
          this.getAuthorization();
        }
      });
    }
  }

  //method to transform Date
  transformDate(date, dateFormat: string): string {
    return this.datePipe.transform(new Date(date), dateFormat); //SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER
  }//end of method

  applyDateFilter() {
    let filterFormValue = this.permissionFormFilterData.value;
    let filterResult;

    if (filterFormValue.fromDate != "" && filterFormValue.toDate != "") {
      filterResult = this.finalPermissionData.filter(x =>
        new Date(this.transformDate(x.authorizationDateFrom, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER)) >= new Date(this.transformDate(filterFormValue.fromDate, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER)) && new Date(this.transformDate(x.authorizationDateTo, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER)) <= new Date(this.transformDate(filterFormValue.toDate, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER)));
    } else if (filterFormValue.fromDate != "") {
      filterResult = this.finalPermissionData.filter(x =>
        new Date(this.transformDate(x.authorizationDateFrom, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER)) >= new Date(this.transformDate(filterFormValue.fromDate, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER)));
    } else if (filterFormValue.toDate != "") {
      filterResult = this.finalPermissionData.filter(x =>
        new Date(this.transformDate(x.authorizationDateFrom, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER)) <= new Date(this.transformDate(filterFormValue.toDate, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER)));
    }

    if (filterFormValue.doctorName || filterFormValue.doctorName == '') {
      this.permissionDetails = filterResult.filter(name => name.doctorName.toLowerCase().replace(/\s/g, '').includes(filterFormValue.doctorName.toLowerCase()));
    } else {
      this.permissionDetails = filterResult;
    }
    this.permissionForm.reset();
    this.initialFormGroup();
    this.permissionDetails.forEach(per => {
      let ctrl = this.permissionForm.controls.permission as FormArray;
      ctrl.push(this.frb.group({
        // 'name': [per.natureOfJob, Validators.required],
        'refNo': [per.refNo],
        'doctorName': [per.doctorName],
        'permissionCheck': [per.authorizationDateFrom ? true : false],
        'authorizationDateFrom': [new Date(this.transformDate(per.authorizationDateFrom, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER))],//[new Date(per.authorizationDateFrom)],
        'authorizationDateTo': [new Date(this.transformDate(per.authorizationDateTo, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER))], //[new Date(per.authorizationDateTo)],
        'isEdit': [false],
      }))
    });
  }

  changeDate(evt, dateType) {
    dateType == 'from' ? this.permissionFormFilterData.value.fromDate = evt : this.permissionFormFilterData.value.toDate = evt;
    if (evt == null) return;

    //console.log(evt)
    if (this.permissionFormFilterData.value.fromDate != null && this.permissionFormFilterData.value.fromDate.toString() == 'Invalid Date') {
      setTimeout(() => {
        this.permissionFormFilterData.value.fromDate = "";
        this.applyDateFilter()
      })
    } else if (this.permissionFormFilterData.value.toDate != null && this.permissionFormFilterData.value.toDate.toString() == 'Invalid Date') {
      setTimeout(() => {
        this.permissionFormFilterData.value.toDate = "";
        this.applyDateFilter()
      })
    } else {
      setTimeout(() => {
        this.applyDateFilter()
      })
    }
  }//end of method

  //method to return max from date
  returnMaxFromDate(): any {
    let maxDate: any = this.maxDate;
    if (this.permissionFormFilterData.value.toDate != "")
      return new Date(this.permissionFormFilterData.value.toDate);
    else
      return maxDate;
  }//end of method

  //method to transform Date
  transformDateFromDateFilter(date): string {
    return this.datePipe.transform(new Date(date), SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER);
  }//end of method

  nameInputFilter(event) {
    if (event.target.value.replace(/\s/g, "") != '' || event.target.value != null) {
      this.permissionFormFilterData.patchValue({
        'doctorName': (event.target.value.replace(/\s/g, ""))
      });
    } else {
      this.permissionFormFilterData.patchValue({
        'doctorName': ''
      });
    }

    this.applyDateFilter();
  }

  resetAllFilter() {
    this.permissionFormFilterData.patchValue({
      'doctorName': '',
      'fromDate': new Date(),
      'toDate': new Date()
    });
    this.permissionForm.reset();
    this.initialFormGroup();
    this.finalPermissionData.forEach(per => {
      let ctrl = this.permissionForm.controls.permission as FormArray;
      ctrl.push(this.frb.group({
        // 'name': [per.natureOfJob, Validators.required],
        'refNo': [per.refNo],
        'doctorName': [per.doctorName],
        'permissionCheck': [per.authorizationDateFrom ? true : false],
        'authorizationDateFrom': [new Date(this.transformDate(per.authorizationDateFrom, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER))],//[new Date(per.authorizationDateFrom)],
        'authorizationDateTo': [new Date(this.transformDate(per.authorizationDateTo, SBISConstants.GLOBAL_DATE_FORMAT_FOR_FILTER))], //[new Date(per.authorizationDateTo)],
        'isEdit': [false],
      }))
    });
  }

  resetDateRange() {
    this.permissionFormFilterData.patchValue({
      'fromDate': new Date(),
      'toDate': new Date()
    });
  }
}

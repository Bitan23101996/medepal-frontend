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

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { ModalService } from './../../../shared/directive/modal/modal.service';
import { IndividualService } from './../individual.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ChartModule } from 'primeng/chart';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { SBISConstants } from './../../../SBISConstants';
import { DatePipe } from '@angular/common';
import { GetSet } from '../../../core/utils/getSet';

@Component({
  selector: 'app-medical-details',
  templateUrl: './medical-details.component.html',
  styleUrls: ['./medical-details.component.css']
})
export class MedicalDetailsComponent implements OnInit {
  @ViewChild('showChart') showChart: TemplateRef<any>;
  @ViewChild('createViewMedicalRecordsModal') createViewMedicalRecordsModal: TemplateRef<any>;
  addMedicalAttributeForm: FormGroup;
  attributeItems: FormArray;
  modalRef: BsModalRef;//modal
  text: string;
  results: any[] = [
    { label: 'Select Medical Attribute', value: null },
  ];
  resultsToDisplay: any[];
  user_id: any;
  widgets: any[] = [];
  user_refNo:string;
  previousMedicalDetailsList: any[] = [];//taking any arr to store medical details json response 
  dateFormat = "";//to store the date format
  sourceValues: any = [];
  currDate: any;//to store current date 
  defaultmedDetAttr: any;//to set default value in p-dropdown
  maxDate = new Date();//to validate date
  mygroupFlag: boolean = false;//to show group btn n dropdown
  myGroupMedicalDet: any[] = [];//to store latest medical details of my group
  selectedMinorMemberName: string;
  myGroupUserNameArr: any[] = [{ userRefNo: '', userName: 'Select group member' }];//to store all user name of my group
  addMEdRecordBtnShowFlag: boolean = true;//to show add med records
  selectedGrpMemberName: string = '';//to show selected group member name
  minorCount: any = false;
  minorFlag: any = false;
  minorNamelist: any[] = [];
  config = {
    class: 'custom-modal-medical-details modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  
  showMedicalTestReport: boolean = false;//working on issue number  #214, #210
  userDet: any = {};
  selectedUsersRefNo: string;
  typeIconArr: any = [
    {'path':  '../../../../assets/image/blood-count-test.svg', 'label': 'Blood Count'},
    {'path':  '../../../../assets/image/cholesterol.svg', 'label': 'Cholesterol'},
    {'path':  '../../../../assets/image/diabetes-test.svg', 'label': 'Glucose'},
    {'path':  '../../../../assets/image/heart.svg', 'label': 'Heart'},
    {'path':  '../../../../assets/image/kidney.svg', 'label': 'Kidney'},
    {'path':  '../../../../assets/image/liver.svg', 'label': 'Liver'},
    {'path':  '../../../../assets/image/mineral-water.svg', 'label': 'Mineral'},
    {'path':  '../../../../assets/image/pancreas.svg', 'label': 'Pancreas'},
    {'path':  '../../../../assets/image/therapy.svg', 'label': 'Physical'},
    {'path':  '../../../../assets/image/thyroid.svg', 'label': 'Thyroid'},
    {'path':  '../../../../assets/image/vitamine-c.svg', 'label': 'Vitamin'}
  ];
  typeIconForOther: any = {'path':  '', 'label': 'Other'}
  initialState: boolean = false;
  masterDataTestFor: any[] = [];
  logoOptionEnabled: boolean = false;

  constructor(
    private frb: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private translate: TranslateService,
    private _location: Location,
    private modalService: ModalService,
    private individualService: IndividualService,
    private toastService: ToastService,
    private bsModalService: BsModalService,
    private chartModule: ChartModule,
    private broadcastService: BroadcastService

  ) {
    this.dateFormat = environment.DATE_FORMAT;
    this.addMedicalAttributeForm = frb.group({
      //source: [null, Validators.required],
      attributeItems: this.frb.array([])
    })
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }//end of constructor

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.logoOptionEnabled = true;
    this.user_refNo = user.refNo;
    this.selectedUsersRefNo = user.refNo;
    this.broadcastService.setHeaderText('MY HEALTH METRICS');
    this.getallMedAttributeList();//to get all med attribute list
    this.loadUserMedicalRecords(user.refNo);//to get all medical records
    this.getSourceValues();//to get source values
    this.getCurrentDate();//to get current date
    this.getAllTestForMasterData(); //to get all test for data
    if(GetSet.getMinorCount() == 0) {
      this.minorCount = false;
     } else {
      this.minorCount = true;
     }
  }//end of oninit

  getCurrentDate() {
    let now = new Date();
    this.currDate = this.datePipe.transform(now, 'yyyy-MM-dd');//"dddd, mmmm dS, yyyy, h:MM:ss TT");
  }//end of method

  clearForm() {
    this.addMedicalAttributeForm = this.frb.group({
      attributeItems: this.frb.array([])
    });
  }//end of method

  closeModalByCheckingArrLength(modalPurpose: string) {
    let attributeItems = this.addMedicalAttributeForm.controls['attributeItems'] as FormArray;
    switch (modalPurpose) {
      case 'update':
        attributeItems.length == 1 ? this.modalRef.hide() : null;
        break;
      case 'delete':
        attributeItems.length == 0 ? this.modalRef.hide() : null;
        break;
    }
  }//end of close modal

  //method to change dropdown val
  onChangeMyGroup(event) {
    this.selectedUsersRefNo = event.target.value;
    if(event.target.value == "") {
      this.logoOptionEnabled = false;
    }
    if (event.target.value) {
      let findJsonObj = this.myGroupMedicalDet.find(myGrpEl =>
        myGrpEl['userRefNo'] == event.target.value
      );
      if (findJsonObj) {
        this.logoOptionEnabled = true;
        this.initialState = false;
        this.addMEdRecordBtnShowFlag = findJsonObj.editEnabled ? true : false;
        this.selectedGrpMemberName = findJsonObj.userName;
        // findJsonObj.medicalFindings.length > 0 ? this.modifyMedicalDetailDisplayArrWithBP(findJsonObj.medicalFindings) : this.widgets = [];
        // this.loadUserMedicalRecords(this.setUserIdAccordingToGroup());
      } else {
        this.addMEdRecordBtnShowFlag = true;
        this.selectedGrpMemberName = '';
      }
    } else {
      this.selectedGrpMemberName = '';
      this.widgets = [];//cs user select 'select any name' <-- value
    }
  }//end of method

  //method to change dropdown val
  onChangeMinor(event) {
    this.selectedUsersRefNo = event.target.value;
    if(event.target.value == "") {
      this.logoOptionEnabled = false;
    }
    if (event.target.value) {
      let findJsonObj = this.minorNamelist.find(myGrpEl =>
        myGrpEl['userRefNo'] == event.target.value
      );
      if (findJsonObj) {
        this.initialState = false;
        this.logoOptionEnabled = true;
        this.addMEdRecordBtnShowFlag = findJsonObj.userRefNo ? true : false;
        this.selectedMinorMemberName = findJsonObj.forUserName;
        // findJsonObj.medicalFindings.length > 0 ? this.modifyMedicalDetailDisplayArrWithBP(findJsonObj.medicalFindings) : this.widgets = [];
        // this.loadUserMedicalRecords(this.setUserIdAccordingToGroup());
      } else {
        this.addMEdRecordBtnShowFlag = true;
        this.selectedGrpMemberName = '';
      }
      //this.loadUserMedicalRecords(event.target.value);
    } else {
      this.selectedMinorMemberName = '';
      this.widgets = [];
    }
  }//end of method

  onMyGroupBtnClick(funcAl) {
    if (funcAl == 'group') {
      this.logoOptionEnabled = false;
      this.selectedGrpMemberName = '';
      this.broadcastService.setHeaderText('Group member Health Metrics');
      this.widgets = [];//bcz user clicked on mygroup btn to view his/her group member med data
      this.individualService.getMedFindingsGroupDetails(this.user_refNo).subscribe((res) => {
        if (res.status == 2000) {
          this.mygroupFlag = true;
          this.minorFlag = false;
          this.addMEdRecordBtnShowFlag = false;
          this.myGroupUserNameArr = [{ userRefNo: '', userName: 'Select group member' }];
          this.myGroupMedicalDet = res.data;
         
          this.myGroupMedicalDet.forEach((myGrpMEdDetEl) => {
            if (myGrpMEdDetEl['userRefNo']) {
              this.myGroupUserNameArr.push({ userRefNo: myGrpMEdDetEl.userRefNo, userName: myGrpMEdDetEl.userName });
            }
          });
        }//end of if status check
      });
    } 
    if(funcAl == 'minor') {
      this.logoOptionEnabled = false;
      this.broadcastService.setHeaderText('Minor Health Metrics');
        this.widgets = [];
        this.individualService.listViewOfMinor(this.user_refNo).subscribe((resp) => {
          if(resp.status == 2000) {
            this.mygroupFlag = false;
            this.minorFlag = true;
            this.addMEdRecordBtnShowFlag = false;
            this.minorNamelist = [{ forUserName: 'Select minor member', userRefNo: '' }];
            for(let minorMember of resp.data) {
              if (minorMember.minor.id != this.user_id) {
                this.minorNamelist.push({forUserName: minorMember.minor.name, userRefNo: minorMember.minor.userRefNo});
              }
            }
          }
        })
    }
    if(funcAl == 'my') {
      this.initialState = false;
      this.logoOptionEnabled = true;
      this.selectedUsersRefNo = this.user_refNo;
      this.broadcastService.setHeaderText('MY HEALTH METRICS');
      this.addMEdRecordBtnShowFlag = true;
      this.loadUserMedicalRecords(this.user_refNo);
      this.mygroupFlag = false;
      this.minorFlag = false;
    }
  }//end of method

  // //negetive value avoid:
  // numberOnly(event): boolean {
  //   const charCode = (event.which) ? event.which : event.keyCode;
  //   if (charCode > 31 && (charCode < 48 || charCode > 57)) {
  //     return false;
  //   }
  //   return true;
  // }//end of method

 //negetive value avoid:
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    let a = event.target.value;
    let checkDecimalCount = a.split(".");
    let returnFlag: boolean = false;
    if ((charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46)) {
      return false;
    }else{
      (checkDecimalCount.length > 1)? ((charCode == 46)? returnFlag = false: ((checkDecimalCount[checkDecimalCount.length-1].length>1)?returnFlag = false: returnFlag = true)): returnFlag = true;
    }
    return returnFlag;
  }//end of method

  

  getallMedAttributeList() {
    this.individualService.getMedicalDetailsAttributeList().subscribe((res) => {
      if (res.status == 2000) {
        // this.results = 
        res.data.forEach(element => {
          if (element.longName) {
            this.results.push({ label: element.longName, value: element.longName, id: element.id, shortName: element.shortName });
          }
        });
      }
    });
  }//end of method

  getSourceValues() {
    this.individualService.getMEdicalDetailsSourceValues({ q: SBISConstants.MASTER_DATA.MEDICAL_DATA_SRC_TYPE }).subscribe((res) => {
      if (res.status == 2000) {
        this.sourceValues = res.data;
      }
    });
  }//end of method

  /**
   * modifyMedicalDetailDisplayArrWithBP ==> method to modify medical detail array
   */
  public modifyMedicalDetailDisplayArrWithBP(medFindingsArr) {
    this.widgets = medFindingsArr.filter(clbckFn => clbckFn.parentName != SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME);
    this.widgets.forEach((medDetEl) => {
      if (medDetEl.referenceRangeFrom || medDetEl.referenceRangeTo) {
        if (medDetEl.result < medDetEl.referenceRangeFrom || medDetEl.result > medDetEl.referenceRangeTo) {
          medDetEl.color = 'red';
        } else {
          medDetEl.color = 'green';
        }
      } else {
        medDetEl.color = 'black';
      }
    });
    let bpDiaObj: any = medFindingsArr.find(findElOfDia => findElOfDia.longName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME);
    let bpSysObj: any = medFindingsArr.find(findElOfSys => findElOfSys.longName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME);
    if (bpDiaObj || bpSysObj) {
      let bpObj: any = {
        attributeBPDiaId: bpDiaObj.attributeId,
        attributeBPSysId: bpSysObj.attributeId,
        createdDate: bpDiaObj.createdDate,
        endDate: bpDiaObj.endDate ? bpDiaObj.endDate : null,
        bpSysLongName: bpSysObj.longName,
        bpDiaLongName: bpDiaObj.longName,
        longName: bpDiaObj.parentName,
        parentName: bpDiaObj.parentName,
        valueOfDia: bpDiaObj.result,
        valueOfSys: bpSysObj.result,
        result: bpSysObj.result + "/" + bpDiaObj.result,
        shortNameForBPDia: bpDiaObj.shortName ? bpDiaObj.shortName : null,
        source: bpDiaObj.source,
        startDate: bpDiaObj.startDate ? bpDiaObj.startDate : null,
        triggerPk: bpDiaObj.triggerPk ? bpDiaObj.triggerPk : null,
        unitName: bpDiaObj.unitName,
        userPk: null,
        medicalFindingsPkForDia: bpDiaObj.medicalFindingsPkForDia,
        medicalFindingsPkForSys: bpDiaObj.medicalFindingsPkForSys
      };
      this.widgets.push(bpObj);
    }//end of if bp sys/dia check
  }//end of method

  loadUserMedicalRecords(userRefNo) {
    this.individualService.loadUserVitalMedicalAttributes(userRefNo).subscribe((data) => {
      if (data.status == 2000) {
        this.previousMedicalDetailsList = data.data;
        let index = -1;
        for(let date of data.data) {
          let dateLastMeasured = new Date(date.dateStr);
          index = index+1;
          data.data[index].dateStr = dateLastMeasured;
        }
        this.modifyMedicalDetailDisplayArrWithBP(data.data);//calling the method to modify medical details array
      }
    });
  }

  loadUserMedicalRecordsTestFor(userRefNo, testFor ) {
    this.individualService.loadUserVitalMedicalAttributesTestFor(userRefNo, testFor).subscribe((data) => {
      if (data.status == 2000) {
        this.previousMedicalDetailsList = data.data;
        this.initialState = true;
        this.logoOptionEnabled = false;
        let index = -1;
        for(let date of data.data) {
          let dateLastMeasured = new Date(date.dateStr);
          index = index+1;
          data.data[index].dateStr = dateLastMeasured;
        }
        this.modifyMedicalDetailDisplayArrWithBP(data.data);//calling the method to modify medical details array
      }
    });
  }

  createItem(item): FormGroup {
    let frbGrpBody: any = {};
    if (item.bpShortName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SHORT_NAME) {//
      frbGrpBody = {
        attributeName: item.longName,
        attributeId: '',//item.id, 
        attributeBPSysId: item.attributeBPSysId,
        attributeBPDiaId: item.attributeBPDiaId,
        bpDiaLongName: item.bpDiaLongName,
        bpSysLongName: item.bpSysLongName,
        value: '',//item.result,
        valueOfSys: item.valueOfSys,
        valueOfDia: item.valueOfDia,
        unit: item.unit,
        source: item.source ? item.source : '',
        date: item.dateStr,//this.convertForDisplayDate(item.dateStr),//(item.dateStr),
        medicalFindingsPkForDia: item.medicalFindingsPkForDia,
        medicalFindingsPkForSys: item.medicalFindingsPkForSys,
      };
    } else {
      frbGrpBody = {
        attributeName: item.longName,
        attributeId: item.id,
        attributeBPSysId: '',
        attributeBPDiaId: '',
        value: item.result,
        unit: item.unit,
        medicalFindingsPk: item.medicalFindingsPk,
        source: item.source ? item.source : '',
        date: item.dateStr//this.convertForDisplayDate(item.dateStr)//(item.dateStr)
      }
    }
    return this.frb.group(frbGrpBody);
  }//end of Create formGrp

  addMedicalRecords(ev: any, id: any) {
    this.isEditable = false;		    // this.isEditable = false;
    this.clearForm();		    // this.clearForm();
    this.addMedicalAttributeForm.reset();		    // this.addMedicalAttributeForm.reset();
    // this.modalRef = this.bsModalService.show(this.createViewMedicalRecordsModal, this.config);		    // this.modalRef = this.bsModalService.show(this.createViewMedicalRecordsModal, this.config);
    this.defaultmedDetAttr = this.results.find(x => x.label == 'Select Medical Attribute');		    // this.defaultmedDetAttr = this.results.find(x => x.label == 'Select Medical Attribute');
    this.showMedicalTestReport = true;
    this.userDet['refNo'] = this.selectedUsersRefNo;
  }//end of method		  }//end of method

  closeModal(id: any, type = '') {
    this.attributeItems = this.addMedicalAttributeForm.controls['attributeItems'] as FormArray;
    while (this.attributeItems.length !== 0) {
      this.attributeItems.removeAt(0);
    }
    this.text = null;
    this.modalService.close(id);
  }//end of method

  //method to show msg to the toast service during the time of add health attributes
  setToastMesseges(element) {
    if (!(element.value || (element.valueOfDia && element.valueOfSys)) || !element.source) {
      let valueValidationMsg: string = (element.value || (element.valueOfDia && element.valueOfSys)) ? '' : 'value ';
      let sourceValidationMsg: string = element.source ? '' : (valueValidationMsg ? 'and source' : 'source');
      let validationMsg: string = 'Please add Health Attribute ' + valueValidationMsg + sourceValidationMsg;
      this.toastService.showI18nToast(validationMsg, 'warning');
    }
  }//end of method

  //validation msg for dia and sys 
  checkBPUpperLowerValues(dia, sys): boolean {
    let diaSysvalueCheckflag: boolean = false;
    if (+dia > +sys) {
      diaSysvalueCheckflag = true;
    } else {
      diaSysvalueCheckflag = false;
    }

    return diaSysvalueCheckflag;
  }//end of method

  //method to create health attribute
  createNewHealthRecord(healthAttributeValue: any, id: any) {
    let healthRecords = healthAttributeValue.attributeItems;
    if (healthRecords.length == 0) {
      this.modalRef.hide();
      return;
      // this.toastService
    }//end of if
    let validationFlag: Boolean = true;
    let index: number = 0;
    for (let element of healthRecords) {
      if ((element.value || (element.valueOfDia && element.valueOfSys)) && element.source && element.date) {// && this.attributeItems.controls[0].value.date
        let bpUpperLower: boolean = false;
        if ((element.valueOfDia && element.valueOfSys)) {
          let validationMsg = this.checkBPUpperLowerValues(element.valueOfDia, element.valueOfSys) ? 'Upper value should be greater than lower value' : '';
          this.checkBPUpperLowerValues(element.valueOfDia, element.valueOfSys) ? bpUpperLower = true : bpUpperLower = false;
          bpUpperLower ? this.toastService.showI18nToast(validationMsg, 'warning') : null;
        }
        if (bpUpperLower) {
          validationFlag = true;
          break;
        } else {
          validationFlag = ((index + 1) == healthRecords.length) ? false : true;
        }
      } else {
        validationFlag = true;
        this.setToastMesseges(element);
        break;
      }
      index++;
    }//end of for
    if (!validationFlag) {
      let bPJson = healthAttributeValue.attributeItems.find(bpEl => bpEl['attributeName'] == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME);
      //checking if test res is for bloodpressure
      if (bPJson) {
        if (bPJson.attributeBPSysId || bPJson.attributeBPDiaId) {
          let bpDiajsonBody: any = {
            value: bPJson.valueOfDia,
            source: bPJson.source,
            attributeId: bPJson.attributeBPDiaId,
            date: bPJson.date
          }
          healthRecords.push(bpDiajsonBody);
          let bpSysjsonBody: any = {
            value: bPJson.valueOfSys,
            source: bPJson.source,
            attributeId: bPJson.attributeBPSysId,
            date: bPJson.date
          }
          healthRecords.push(bpSysjsonBody);
        }//end of if
        let healthRecordArr = healthRecords.filter(el => el['attributeId'] != '');
        healthRecords = healthRecordArr;
      }//end of bpindex check
      let query = healthRecords.map(x => ({
        'result': x.value,
        'source': x.source,
       // 'userPk': this.setUserIdAccordingToGroup(),//this.user_id,
        'refNo': this.setUserIdAccordingToGroup(),
        'attributeId': x.attributeId,
        'dateStr': this.convert(x.date.toString())//x.date// this.datePipe.transform(x.date,this.dateFormat),//'yyyy-dd-MM')
      }));
      this.individualService.saveMedicalRecords(query).subscribe((data) => {
        // this.previousMedicalDetailsList = data.data;
        this.modifyMedicalDetailDisplayArrWithBP(data.data);
        this.toastService.showI18nToast(data.message, 'success');
      });
      this.attributeItems = this.addMedicalAttributeForm.controls['attributeItems'] as FormArray;
      while (this.attributeItems.length !== 0) {
        this.attributeItems.removeAt(0)
      }
      this.text = null;
      this.modalRef.hide();
    }
  }//end of method
  //method to set userRefNo according to group or myself
  setUserIdAccordingToGroup(): string {
    let user_refNo: string;
    if (this.mygroupFlag) {
      if (this.selectedGrpMemberName) {
        let findInd = this.myGroupUserNameArr.findIndex(el => el.userName == this.selectedGrpMemberName);
        user_refNo = this.myGroupUserNameArr[findInd].userRefNo;
      } else {
        this.toastService.showI18nToast('Select group member', 'warning');
      }
    } else if(this.minorFlag) {
      if(this.selectedMinorMemberName) {
        let findInd = this.minorNamelist.findIndex(el => el.forUserName == this.selectedMinorMemberName);
        user_refNo = this.minorNamelist[findInd].userRefNo;
      } else {
        this.toastService.showI18nToast('Select minor member', 'warning');
      }
    } else {
      user_refNo = this.user_refNo;
    }
    return user_refNo;
  }//end of method
  convert(str) {//method to convert date field to proper 
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), day, mnth].join("-");
  }//end of method

  convertForDisplayDate(str) {//method to convert date field to proper 
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-").toString();
  }//end of method

  addItem(item): void {
    this.attributeItems = this.addMedicalAttributeForm.controls['attributeItems'] as FormArray;
    this.attributeItems.push(this.createItem(item));
  }//end of method
  //method to 
  onSelectEvent(event, medAttrArr) {
    medAttrArr;
    if (event.value) {
      this.individualService.getMedicalAttributeList({ searchText: event.value }).subscribe((data) => {
        this.resultsToDisplay = data.data;
        this.resultsToDisplay.filter(x => x['parentDiagnosticsPk'] == null);
        let showAttributes: any[];
        showAttributes = this.resultsToDisplay.filter((x, index) =>
          x['parentDiagnosticsPk'] == medAttrArr[index].id != null);//event.id);
        if (event.value == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {//checking if shortname is BP--> blood pressure
          let showAttributesForBP: any = {};
          let bpDiaDet = showAttributes.find(bpDiaDet => bpDiaDet['shortName'] == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESURE_DIA_SHORT_NAME);//find the bp-dia det
          let bpSysDet = showAttributes.find(bpSysDet => bpSysDet['shortName'] == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESURE_SYS_SHORT_NAME);//find bp-sys det
          showAttributesForBP['attributeBPDiaId'] = bpDiaDet.id;
          showAttributesForBP['longName'] = event.value;
          showAttributesForBP['bpDiaShortName'] = bpDiaDet.shortName;
          showAttributesForBP['bpDiaLongName'] = bpDiaDet.longName;
          showAttributesForBP['unit'] = bpDiaDet.unit;
          showAttributesForBP['attributeBPSysId'] = bpSysDet.id;
          showAttributesForBP['bpSysShortName'] = bpSysDet.shortName;
          showAttributesForBP['bpSysLongName'] = bpSysDet.longName;
          showAttributesForBP['bpShortName'] = SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SHORT_NAME;
          showAttributes = [];
          showAttributes.push(showAttributesForBP);
        }
        if (showAttributes.length > 0) {
          showAttributes.forEach((element) => {
            element.dateStr = element.dateStr ? element.dateStr : this.currDate;
            let findIndex = this.sourceValues.findIndex(el => el.attributeValue == SBISConstants.MEDICAL_DETAILS_CONST.DEFAULT_SELECTED_SOURCE_FIELD);
            findIndex != -1 ? element.source = this.sourceValues[findIndex].displayValue : null;
            this.addItem(element);
          });
        } else {
          this.addItem(this.resultsToDisplay.filter(x => x['id'] == event.id)[0]);
        }
      });
    }
  }//end of method

  deleteRecords(i, formVal?: any) {
    this.attributeItems = this.addMedicalAttributeForm.controls['attributeItems'] as FormArray;
    if (formVal) {
      let healthRecords: any = formVal.attributeItems[i];//storing json data to health records json
      let medicalFindingsPK = healthRecords.medicalFindingsPk ? healthRecords.medicalFindingsPk : healthRecords.medicalFindingsPkForDia;
      this.individualService.deleteMedicalFindingsSingleData(medicalFindingsPK).subscribe((res) => {
        if (res.status == 2000) {
          if (healthRecords.attributeName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
            this.individualService.deleteMedicalFindingsSingleData(healthRecords.medicalFindingsPkForSys).subscribe((res) => {
              if (res.status == 2000) {
                this.attributeItems.removeAt(i);
                this.loadUserMedicalRecords(this.setUserIdAccordingToGroup());//to get all medical records==>>to get updated records
                this.toastService.showI18nToast(res.message, 'success');
                this.closeModalByCheckingArrLength('delete');
              }
            });
          } else {
            this.attributeItems.removeAt(i);
            this.loadUserMedicalRecords(this.setUserIdAccordingToGroup());//to get all medical records==>>to get updated records
            this.toastService.showI18nToast(res.message, 'success');
            this.closeModalByCheckingArrLength('delete');
          }
        }
      });
    } else {
      this.attributeItems.removeAt(i);
    }
  }
  updateSingleMedicalData(formVal, index) {
    this.attributeItems = this.addMedicalAttributeForm.controls['attributeItems'] as FormArray;
    let healthRecords: any = formVal.attributeItems[index];//storing json data to health records json

    if ((healthRecords.value || (healthRecords.valueOfDia && healthRecords.valueOfSys)) && healthRecords.source && healthRecords.date) {
      let query = {
        'medicalFindingsPk': healthRecords.medicalFindingsPk ? healthRecords.medicalFindingsPk : healthRecords.medicalFindingsPkForDia,
        'result': healthRecords.value ? healthRecords.value : healthRecords.valueOfDia,
        'source': healthRecords.source,
        'dateStr': this.convert(healthRecords.date.toString()),//x.date// this.datePipe.transform(x.date,this.dateFormat),//'yyyy-dd-MM')      
      }
      let bpUpperLower: boolean = false;

      if((healthRecords.valueOfDia && healthRecords.valueOfSys)){
        // let validationMsg = this.checkBPUpperLowerValues(healthRecords.valueOfDia, healthRecords.valueOfSys) ? 'Upper value should be greater than lower value' : '';
        this.checkBPUpperLowerValues(healthRecords.valueOfDia, healthRecords.valueOfSys) ? bpUpperLower = true : bpUpperLower = false;
        // bpUpperLower ? this.toastService.showI18nToast(validationMsg, 'warning') : null;
      }
      if(!bpUpperLower){
        this.individualService.updateMedicalFindingsSingleData(query).subscribe((res) => {
        if (res.status == 2000) {
          if (healthRecords.attributeName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
            let queryForBPSys = {
              'medicalFindingsPk': healthRecords.medicalFindingsPkForSys,
              'result': healthRecords.valueOfSys,
              'source': healthRecords.source,
              'dateStr': this.convert(healthRecords.date.toString()),//x.date// this.datePipe.transform(x.date,this.dateFormat),//'yyyy-dd-MM')      
            }
            this.individualService.updateMedicalFindingsSingleData(queryForBPSys).subscribe((resOfBPSys) => {
              if (resOfBPSys.status == 2000) {
                this.loadUserMedicalRecords(this.setUserIdAccordingToGroup());//to get all medical records==>>to get updated records
                this.toastService.showI18nToast(res.message, 'success');
                this.closeModalByCheckingArrLength('update');
              }//end of status
            });
          } else {
            this.loadUserMedicalRecords(this.setUserIdAccordingToGroup());//to get all medical records==>>to get updated records
            this.closeModalByCheckingArrLength('update');//close modal by checking array length
            this.toastService.showI18nToast(res.message, 'success');
          }
        }//end of status 2000
      });
    }else{
      let validationMsg =  'Upper value should be greater than lower value';
      this.toastService.showI18nToast(validationMsg, 'warning')
    }
    } else {
      this.toastService.showI18nToast('Please fill all data.', 'warning');
    }
  }//end of method
  isEdit: false;
  widgetHeader: any;

  //Edit/Update <>
  openMedHistoryModalByEditIconClick(widget: any, id: any) {
    this.attributeItems = this.addMedicalAttributeForm.controls['attributeItems'] as FormArray;
    while (0 !== this.attributeItems.length) {
      this.attributeItems.removeAt(0);
    }
    let path = this.setUserIdAccordingToGroup() + '/' + ((widget.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) ? widget.attributeBPDiaId : widget.attributeId);
    this.individualService.getMedicalDetailsByUserIdNAttrId(path).subscribe((res) => {
      if (res.status == 2000) {
        if (widget.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
          let pathForBPSys = this.setUserIdAccordingToGroup() + '/' + widget.attributeBPSysId;
          this.individualService.getMedicalDetailsByUserIdNAttrId(pathForBPSys).subscribe((resOfBPSys) => {
            if (resOfBPSys.status == 2000) {
              let bpArr: any = [];
              resOfBPSys.data.forEach((bpSysEL, index) => {
                let bpObj: any = {
                  attributeBPDiaId: res.data[index].attributeId,
                  attributeBPSysId: resOfBPSys.data[index].attributeId,
                  createdDate: res.data[index].createdDate,
                  endDate: res.data[index].endDate ? res.data[index].endDate : null,
                  bpSysLongName: resOfBPSys.data[index].longName,
                  bpDiaLongName: res.data[index].longName,
                  longName: res.data[index].parentName,
                  parentName: resOfBPSys.data[index].parentName,
                  valueOfDia: res.data[index].result,
                  valueOfSys: resOfBPSys.data[index].result,
                  shortNameForBPDia: res.data[index].shortName ? res.data[index].shortName : null,
                  source: resOfBPSys.data[index].source,
                  // startDate: bpDiaObj.startDate ? bpDiaObj.startDate : null,
                  // triggerPk: bpDiaObj.triggerPk ? bpDiaObj.triggerPk : null,
                  unitName: resOfBPSys.data[index].unitName,
                  userPk: null,
                  dateStr: resOfBPSys.data[index].dateStr,
                  medicalFindingsPkForSys: resOfBPSys.data[index].medicalFindingsPk,
                  medicalFindingsPkForDia: res.data[index].medicalFindingsPk,

                }
                bpArr.push(bpObj);
              });
              this.buildMedicalHistoryObjForModal(bpArr);
            }
          });
        } else {//if edit value is not blood pressure
          this.buildMedicalHistoryObjForModal(res.data);
        }
      }//end of status check 
    });
  }//end of method
  //method to display modal n build the object
  buildMedicalHistoryObjForModal(res) {
    res.sort((a, b) => {
      const d1 = new Date(a.dateStr);
      const d2 = new Date(b.dateStr);
      return (d1.getTime() - d2.getTime()) * -1;
    });
    this.isEditable = true;
    this.modalRef = this.bsModalService.show(this.createViewMedicalRecordsModal, this.config);
    let previousMEdDetailsArr: any = [];
    previousMEdDetailsArr = res;
    previousMEdDetailsArr.forEach(prervMedDetArrEl => {
      if (prervMedDetArrEl.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
        prervMedDetArrEl.bpShortName = SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SHORT_NAME;
        prervMedDetArrEl["medicalFindingsPkForDia"] = prervMedDetArrEl.medicalFindingsPkForDia;
        prervMedDetArrEl["medicalFindingsPkForSys"] = prervMedDetArrEl.medicalFindingsPkForSys;
      }
      prervMedDetArrEl["id"] = prervMedDetArrEl.attributeId;
      prervMedDetArrEl["unit"] = prervMedDetArrEl.unitName;
      prervMedDetArrEl["medicalFindingsPk"] = prervMedDetArrEl.medicalFindingsPk;
      this.addItem(prervMedDetArrEl);
    });
  }
  //Edit closed </>
  chartData: any;
  isEditable: any;
  showHealthAttributeProgress(widget: any, id: any) {
    this.chartData = {};
    this.modalService.open(id);
    let queryForChart = {
      refNo: this.setUserIdAccordingToGroup(),//this.user_id,
      attributeId: widget.attributeId,
      startDate: widget.startDate,
      endDate: widget.endDate
    }
    let queryForChartBpDia = {};
    if (widget.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
      queryForChart.attributeId = widget.attributeBPSysId;
     // queryForChartBpDia['userPk'] = this.setUserIdAccordingToGroup();//this.user_id;
      queryForChartBpDia['attributeId'] = widget.attributeBPDiaId;
      queryForChartBpDia['startDate'] = widget.startDate;
      queryForChartBpDia['endDate'] = widget.endDate;
      queryForChartBpDia['refNo'] =this.setUserIdAccordingToGroup();
    }
    let labelsArray: string[] = [];
    let dataArray = [];//to store all result value for chart
    let referenceRangeToValArr = [];//to store all refRange to values
    let referenceRangeFromValArr = [];//to store all ref range from values
    this.individualService.loadMedicalAttributeDataForChart(queryForChart).subscribe((data) => {
      if (data.status === 2000) {
        let resArrOfChartData = data.data;
        resArrOfChartData.reverse();
        resArrOfChartData.forEach(function (x) {
          let mydate = new Date(x['dateStr']);
          let year = mydate.getFullYear();
          let month = (1 + mydate.getMonth()).toString();
          month = month.length > 1 ? month : '0' + month;
          let day = mydate.getDate().toString();
          day = day.length > 1 ? day : '0' + day;
          // labelsArray.push(month + '/' + day + '/' + year);
          labelsArray.push(day + '-' + month + '-' + year);
          dataArray.push(x['result']);
          x['referenceRangeFrom'] ? referenceRangeFromValArr.push(x['referenceRangeFrom']) : null;
          x['referenceRangeTo'] ? referenceRangeToValArr.push(x['referenceRangeTo']) : null;

        });
        let label = widget.longName;
        if (widget.parentName == SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_LONG_NAME) {
          this.individualService.loadMedicalAttributeDataForChart(queryForChartBpDia).subscribe((res) => {
            if (res.status == 2000) {
              let dataArrForDia: any[] = [];
              let refRangeFromValArrForBPDia: any[] = [];
              let refRangeToValArrForBPDia: any[] = [];
              res.data.reverse();
              res.data.forEach(function (x) {
                dataArrForDia.push(x['result']);
                x['referenceRangeFrom'] ? refRangeFromValArrForBPDia.push(x['referenceRangeFrom']) : null;
                x['referenceRangeTo'] ? refRangeToValArrForBPDia.push(x['referenceRangeTo']) : null;
              });
              this.chartData = {
                labels: labelsArray,
                datasets: [{
                  label: widget.bpSysLongName,//attributeBPSysId,
                  data: dataArray,
                  fill: false,
                  borderColor: '#4bc0c0'
                },
                {
                  label: widget.bpDiaLongName,//attributeBPDiaId,
                  data: dataArrForDia,
                  fill: false,
                  borderColor: '#565656'
                }]
              }//end of chartdata
              referenceRangeToValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range To(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME + ')', referenceRangeToValArr) : null;
              referenceRangeFromValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range From(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_SYS_LONG_NAME + ')', referenceRangeFromValArr) : null;
              refRangeToValArrForBPDia.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range To(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME + ')', referenceRangeToValArr) : null;
              refRangeFromValArrForBPDia.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range From(' + SBISConstants.MEDICAL_DETAILS_CONST.BLOOD_PRESSURE_DIA_LONG_NAME + ')', referenceRangeFromValArr) : null;

            }//end of if status check            
          });
        } else {
          this.chartData = {
            labels: labelsArray,
            datasets: [{
              label: label,
              data: dataArray,
              fill: false,
              borderColor: '#4bc0c0'
            }]
          }//end of chartdata
          referenceRangeToValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range To', referenceRangeToValArr) : null;
          referenceRangeFromValArr.length > 0 ? this.buildChartDataByRefRangeArr('Reference Range From', referenceRangeFromValArr) : null;
        }//end of else bp check
      }//end of res status match
    });//end of wscall
  }//end of method

  //to build chartData if ref range arr is available
  buildChartDataByRefRangeArr(refRangeChartLebelName, refRangeArr) {
    let refRangeJson: any = {};
    refRangeJson.label = refRangeChartLebelName;
    refRangeJson.data = refRangeArr;
    refRangeJson.fill = false;
    refRangeJson.borderColor = 'green';
    this.chartData.datasets.push(refRangeJson);
  }//end of build chart data

  closeNewModal(id: any) {
    this.closeModal(id);
  }

  getFormattedDate(date) {
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return month + '/' + day + '/' + year;
  }
  
  //issue number 214
  medicalDetailsClose(){
    this.showMedicalTestReport = false;
    this.loadUserMedicalRecords(this.user_refNo);
  }//end of method

  getAllTestForMasterData() {
    this.individualService.retrieveAllTestFor().subscribe(resp => {
      if(resp.status == 2000) {
        this.masterDataTestFor = resp.data;
        this.masterDataTestFor.push('Other');
      }
    });
  }

  getMedicalRecordsByName(type) {
    let typeForPathName = this.masterDataTestFor.filter(x => x.toLowerCase() == type.label.toLowerCase());
    this.loadUserMedicalRecordsTestFor(this.selectedUsersRefNo, typeForPathName[0]);
  }

}//end of class

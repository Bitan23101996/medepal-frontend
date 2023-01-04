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

import { Component, OnInit, Pipe, PipeTransform, ViewChild, TemplateRef } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { ServiceProviderService } from '../service-provider.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';
import { DoctorService } from '../../doctor/doctor.service';

@Component({
  selector: 'app-edit-lab-test',
  templateUrl: './edit-lab-test.component.html',
  styleUrls: ['./edit-lab-test.component.css']
})
export class EditLabTestComponent implements OnInit {

  alphabet: any;
  testList: any = [];
  testData: any;
  searchText: any;
  user: any;
  labTestForm: FormGroup;
  submitted: boolean = false;
  @ViewChild('addEditTestModal') addEditTestModal: TemplateRef<any>;
  modalRef: BsModalRef;
  config = {
    // class: 'custom-modal-width modal-lg',
    // backdrop: true,
    // ignoreBackdropClick: true
    class: 'modal-lg',
  };
  dtFormat: any;
  minDate: any;
  labTestList: any;
  isHomeCollection: any;

  form: FormGroup;
  buttonEnableobj: any = {
    edit: false,
    add: false
  };
  allFetchData: boolean;
  testAddDisableFlag: boolean;
  oldItems: any[] = [];
  testHistoryList: any;

  constructor(private _fb: FormBuilder,
    private _broadcastService: BroadcastService,
    private _toastService: ToastService,
    private _serviceProviderService: ServiceProviderService,
    private _bsModalService: BsModalService,
    private _doctorService: DoctorService) { }

  ngOnInit() {
    this._broadcastService.setHeaderText("Edit Diagnostic Test");
    this.dtFormat = environment.DATE_FORMAT;
    this.minDate = new Date();
    this.alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    this.user = JSON.parse(localStorage.getItem('user'));

    this.initialFormGroup();
    this.getAllLabTest();
    this.testData = this.testList;
    this.isHomeCollection = 'N';
    //this.editable = [];

  }

  initialFormGroup() {
    this.form = this._fb.group({
      labTest: this._fb.array([]),
    });
  }

  createLabTestForm() {
    // Service provider ref no - issue app#604
    this.labTestForm = this._fb.group({
      labTestMapPk: [null],
      labPk: [null],
      testPk: [null],
      testNameLab: [null],
      testNameCode: [null],
      homeCollectionFlag: [false],
      status: ['NRM'],
      refNo: [null],
      price: [null],
      fromDate: [null],
      toDate: [null],
      labRefNo: [this.user.serviceProviderRefNo],
      priceDirty: [false],
      fromDateDirty: [false]
    })
  }

  getAllLabTest() {
    // Service provider ref no - issue app#604
    let payLoad = {
      labRefNo: this.user.serviceProviderRefNo
    }
    this._serviceProviderService.getAllLabTest(payLoad).subscribe(res => {
      if (res['status'] == '2000') {
        this.testList = res['data']
        let tests = res['data'];
        console.log(this.testList);
        this.testData = this.testList;
        this.testHistoryList = res['data'];

        tests.forEach(t => {
          let ctrl = <FormArray>this.form.controls.labTest;
          ctrl.push(this._fb.group({
            'labTestMapPk': [t.labTestMapPk],
            'testNameLab': [t.testNameLab],
            'testNameCode': [t.testNameCode],
            'homeCollectionFlag': [t.homeCollectionFlag == 'Y' ? 'Yes' : 'No'],
            'fromDate': [new Date(t.fromDate)],
            'price': [t.price],
            'labPk': [t.labPk],
            'testPk': [t.testPk],
            'status': [t.status],
            'refNo': [t.refNo],
            'toDate': [t.toDate],
            'priceDirty': [false],
            'fromDateDirty': [false],
            'isEdit': [false],
            'isSubmit': [false]
          }));
        });
        this.allFetchData = true;
      }
    });
  }

  saveTests() {
    if (this.labTestForm.get('price').dirty) {
      this.labTestForm.patchValue({
        priceDirty: true
      })
    }
    if (this.labTestForm.get('fromDate').dirty) {
      this.labTestForm.patchValue({
        fromDateDirty: true
      })
    }
    this.labTestForm.patchValue({
      homeCollectionFlag: this.isHomeCollection
    })
    this.submitted = true;
    if (this.labTestForm.valid) {
      console.log(this.labTestForm.value);

      this._serviceProviderService.saveLabTest(this.labTestForm.value).subscribe(res => {
        if (res['status'] == '2000')
          this._toastService.showI18nToast(res['message'], "success");
        this.closeModal();
        this.ngOnInit();
      });
    }
  }

  openAddEditTestModal() {
    this.createLabTestForm();
    this.modalRef = this._bsModalService.show(this.addEditTestModal, this.config);
  }
  closeModal() {
    this.modalRef.hide();
    this.submitted = false;
    this.resetForm();
  }
  resetForm() {
    this.labTestForm.patchValue({
      labTestMapPk: null,
      testPk: null,
      testNameLab: null,
      testNameCode: null,
      homeCollectionFlag: false,
      status: 'NRM',
      refNo: null,
      price: null,
      fromDate: null,
      toDate: null,
      priceDirty: false,
      fromDateDirty: false
    })
  }
  openEditTestModal(query) {
    this.labTestForm = this._fb.group({
      labTestMapPk: query.labTestMapPk,
      labPk: query.labPk,
      testPk: query.testPk,
      testNameLab: query.testNameLab,
      testNameCode: query.testNameCode,
      homeCollectionFlag: query.homeCollectionFlag == "Y" ? true : false,
      status: query.status,
      refNo: query.refNo,
      price: query.price,
      fromDate: new Date(query.fromDate),
      toDate: query.toDate,
      priceDirty: false,
      fromDateDirty: false
    })
    console.log(this.labTestForm.value);

    this.modalRef = this._bsModalService.show(this.addEditTestModal, this.config);
  }

  deleteTests(i, testData) {
    if (confirm("Are you sure to delete " + testData.testNameLab + "?")) {
      let payLoad = {

        labTestMapPk: testData.labTestMapPk,
        labPk: testData.labPk,
        testPk: testData.testPk,
        testNameLab: testData.testNameLab,
        testNameCode: testData.testNameCode,
        homeCollectionFlag: testData.homeCollectionFlag,
        status: 'CXL',
        refNo: testData.refNo,
        price: testData.price,
        fromDate: testData.fromDate,
        toDate: testData.toDate,
        priceDirty: false,
        fromDateDirty: false


      }
      this._serviceProviderService.saveLabTest(payLoad).subscribe(res => {
        if (res['status'] == '2000') {
          this._toastService.showI18nToast(testData.testNameLab + " deleted successfully.", "success");
          this.ngOnInit();
        }
      });
    }
  }
  clearFormArray = (formArray: FormArray) => {
    while (formArray.length !== 0) {
      formArray.removeAt(0)
    }
  }
  filterByAlphabet(alphabet) {
    this.searchText = alphabet;
    let arrayControl = this.form.get('labTest') as FormArray;
    console.log(arrayControl.length)
  }

  // filterByName(event) {
  //   let text = event.target.value;
  //   this.testList = this.testData;
  //   this.testList = this.testList.filter(row => {
  //     return String(row.testNameLab).toLowerCase().includes(text)
  //   });
  // }


  getTestList(event) {
    console.log(event.query);
    this._doctorService.getLabTestList(event.query).subscribe((data) => {
      console.log("Lab Test: ");
      console.log(data.data);
      this.labTestList = data.data;

    });
  }

  // setTestName(event) {
  //   this.labTestForm.patchValue({
  //     testPk: event.id,
  //     testNameLab: event.longName,
  //   })
  // }
  // managePk(testName) {
  //   if (testName != this.labTestForm.value.testNameLab) {
  //     this.labTestForm.patchValue({
  //       testPk: null
  //     });
  //   }
  // }

  toggleHomeCollection(event) {
    if (event.target.checked) {
      this.isHomeCollection = 'Y';
    }
    else {
      this.isHomeCollection = 'N'
    }
  }

  // editable: any;
  // onRowEditInit(x: any, i) {
  //  // this.clonedCars[x.testNameCode] = {...x};
  //  this.editable[i] = true;
  // }
  // onRowEditSave(rowData,i){
  //   this.editable[i] = false;
  //   console.log(rowData);

  // }



  addTest() {
    let ctrl = <FormArray>this.form.controls.labTest;
    // Service provider ref no - issue app#604
    let formControl = this._fb.group({
      'labTestMapPk': [0],
      'testNameLab': [null, Validators.required],
      'testNameCode': [null, Validators.required],
      'homeCollectionFlag': [null],
      'fromDate': [null, Validators.required],
      'price': [null, Validators.required],
      'labRefNo': [this.user.serviceProviderRefNo],
      'testPk': [null],
      'labPk': [null],
      'status': ['NRM'],
      'refNo': [null],
      'toDate': [null],
      'priceDirty': [false],
      'fromDateDirty': [false],
      'isEdit': [true],
      'isSubmit': [false]
    });

    let formGroupArray = this._fb.array([]);
    formGroupArray.push(formControl);
    let arrayControl = this.form.get('labTest') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      let item = arrayControl.at(i);
      formGroupArray.push(item);
    }
    this.form.setControl('labTest', formGroupArray);
    this.testAddDisableFlag = true;
  }//end of method


  cancelTest(ctrl, inx, iconType) {
    this.testAddDisableFlag = false;
    let arrayControl = this.form.get('labTest') as FormArray;
    arrayControl.removeAt(inx);
    if (iconType == 'edit') {
      let oldIm = this.oldItems.filter(x => x["labTestMapPk"] == ctrl.value.labTestMapPk)[0];
      let formControl = this._fb.group({
        'labTestMapPk': oldIm.labTestMapPk,
        'testNameLab': oldIm.testNameLab,
        'testNameCode': oldIm.testNameCode,
        'homeCollectionFlag': oldIm.homeCollectionFlag?"Yes":"No",
        'fromDate': oldIm.fromDate,
        'price': oldIm.price,
        'testPk': oldIm.testPk,
        'status': oldIm.status,
        'refNo': oldIm.refNo,
        'toDate': oldIm.toDate,
        'priceDirty': false,
        'fromDateDirty': false,
        'isEdit': false,
        'isSubmit': false
      });
      arrayControl.insert(inx, formControl);
    }
    ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
  }//end of method

  editTest(ctrl: any) {
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit,
      'homeCollectionFlag': ctrl.value.homeCollectionFlag=="Yes"?true:false,
    });
    this.testAddDisableFlag = true;
    this.oldItems.push(ctrl.value);
  }//end of method

  deleteTest(ctrl: any, index: number) {
    if (ctrl.value.labTestMapPk < 1) {
      let arrayControl = this.form.get('labTest') as FormArray;
      arrayControl.removeAt(index);
      this.testAddDisableFlag = false;
      return;
    }
    if (confirm('are you sure you want to delete this test ?')) {
      let query = ctrl.value.labTestMapPk;

      this._serviceProviderService.deleteTest(query).subscribe(data => {
        if (data.status === 2000) {
          this.initialFormGroup();
          this.getAllLabTest();
          if (this.testAddDisableFlag) {
            this.testAddDisableFlag = false;
          }
        }
        this._toastService.showI18nToast("Record deleted successfully", "success");
      });
    } else {
      // do nothing
    }
  }//end of method

  saveTest(ctrl: any) {
    let testValues = ctrl.value;
    if (ctrl.get('price').dirty) {
      ctrl.patchValue({
        'priceDirty': true
      });
    }
    if (ctrl.get('fromDate').dirty) {
      ctrl.patchValue({
        'fromDateDirty': true
      });
    }
    ctrl.patchValue({
      'isSubmit': true
    });
    if (ctrl.invalid) {
      return;
    }
    // console.log(testValues);
    if (this.testHistoryList.length > 0) {
      if (testValues.labTestMapPk > 0 &&
        this.testHistoryList.filter(x => x["testNameLab"] == testValues.testNameLab &&
          x["labTestMapPk"] != testValues.labTestMapPk &&
          x["testNameCode"] == testValues.testNameCode).length > 0) {
        this._toastService.showToast(-1, "This test is already exist");
        return;
      } else if (this.testHistoryList.filter(x => x["testNameCode"] == testValues.testNameCode &&
        x["testNameLab"] == testValues.testNameLab && x["labTestMapPk"] != testValues.labTestMapPk).length > 0) {
        this._toastService.showToast(-1, "This test is already exist");
        return;
      } else if (testValues.labTestMapPk < 1 && this.testHistoryList.filter(x => x["testNameLab"] == testValues.testNameLab &&
        x["testNameCode"] == testValues.testNameCode).length > 0) {
        this._toastService.showToast(-1, "This test is already exist");
        return;
      }
    }
    // Service provider ref no - issue app#604
    let testDataObj = {
      'labTestMapPk': testValues.labTestMapPk > 0 ? testValues.labTestMapPk : null,
      'testNameLab': testValues.testNameLab,
      'testNameCode': testValues.testNameCode,
      'homeCollectionFlag': testValues.homeCollectionFlag?'Y':'N',
      'fromDate': testValues.fromDate,
      'price': testValues.price,
      'labRefNo': this.user.serviceProviderRefNo,
      'labPk': testValues.labPk,
      'testPk': testValues.testPk,
      'status': testValues.status,
      'refNo': testValues.refNo,
      'toDate': testValues.toDate,
      'priceDirty': ctrl.value.priceDirty,
      'fromDateDirty': ctrl.value.fromDateDirty
    };
    //testValues.labTestMapPk > 0 ? testDataObj['labTestMapPk'] = testValues.labTestMapPk : testDataObj['userRefNo'] = testValues.userRefNo;
    // if (allergyValues.userAllergyId < 1) {
    //   delete allergyData["userAllergyId"];
    // }
    // let testData: any[] = [];
    // testData.push(testDataObj);
    // console.log(testDataObj);
    console.log(testDataObj);

    this._serviceProviderService.saveTest(testDataObj
    ).subscribe((data) => {
      if (data.status === 2000) {
        this.initialFormGroup();
        this.getAllLabTest();
        this.testAddDisableFlag = false;
      }
      this._toastService.showI18nToast(data.message, "success");
    });
    this.oldItems = [];
  }//end of method

  setTestName(event, i) {
    let testList = this.form.get('labTest') as FormArray;
    let testForm = testList.controls[i] as FormGroup;
    testForm.controls.testPk.patchValue(event.id);
    testForm.controls.testNameLab.patchValue(event.longName);
    testForm.controls.testNameCode.patchValue(event.systemCode);
    // this.labTestForm.patchValue({
    //   testPk: event.id,
    //   testNameLab: event.longName,
    // })
  }
  managePk(testName, i) {
    let testList = this.form.get('labTest') as FormArray;
    let testForm = testList.controls[i] as FormGroup;
    if(testName != testForm.controls.testNameLab.value){
      testForm.controls.testPk.patchValue(null);
      testForm.controls.testNameCode.patchValue(null);
    }
    // if (testName != this.labTestForm.value.testNameLab) {
    //   this.labTestForm.patchValue({
    //     testPk: null
    //   });
    // }
  }
  

}

@Pipe({ name: 'filterByName' })
export class FilterByName implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) return [];
    if (!searchText) return items;

    let result  = items.filter(item => {
      return Object.keys(item.value).some(key => {
        return String(item.value.testNameLab).toLowerCase().startsWith(searchText.toLowerCase());
        //return String(item[key]).toLowerCase().startsWith(searchText.toLowerCase());
      });
    });
    if(result.length === 0) {
      return [-1];
    }
    return result;

  }
}
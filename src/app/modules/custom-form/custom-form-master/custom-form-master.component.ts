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
import { DoctorService } from '../../doctor/doctor.service';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SBISConstants } from '../../../SBISConstants';
import { CustomFormService } from '../custom-form.service';
import { ToastService } from '../../../core/services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-custom-form-master',
  templateUrl: './custom-form-master.component.html',
  styleUrls: ['./custom-form-master.component.css']
})
export class CustomFormMasterComponent implements OnInit {

  optionTypeList: any = [];
  customForm: FormGroup;
  selectedOptionType: any = [];
  formRefNo: any = null;

  constructor(
    private broadcastService: BroadcastService,
    private _doctorService: DoctorService,
    private _fb : FormBuilder,
    private customFormService: CustomFormService,
    private _toastService: ToastService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.broadcastService.setHeaderText("Custom Form");
    this.getOptionTypeList();
    this.formRefNo = this.route.snapshot.paramMap.get('formRefNo');
    if(this.formRefNo!=null){
      this.editCustomForm();
    }
    this.createCustomForm();
    
    
  }

  getOptionTypeList(){
    this.customFormService.getOptionTypeList()
    .subscribe(res =>{
      console.log(res);
      this.optionTypeList = res.masterDataAttributeValues;
      
    });
  }

  get questionList(): FormArray {
    return this.customForm.get('questionList') as FormArray;
  }

  // get answerList(): FormArray {
  //   return this.customForm.get('questionList').value.controls.answerList.value as FormArray;
  // }

  createCustomForm(){
    let questionArray: FormGroup[] = [];
    questionArray.push(this.createQuestionList());
    this.selectedOptionType[0]=SBISConstants.OPTION_TYPE.RADIO
    this.customForm = this._fb.group({
      formRefNo: [null],
      formName: [null],
      questionList: this._fb.array(questionArray),
      status: ["NRM"]
    })
    console.log(this.customForm.value);
    
  }

  createQuestionList(): FormGroup {
    let optionArray: FormGroup[] = [];
    optionArray.push(this.createOptionList());
    return this._fb.group({
      questionRefNo: [null],
      question: [null],
      answerType: [SBISConstants.OPTION_TYPE.RADIO],
      sequenceNo: [null],
      mandatoryFlag: [false],
      answerList: this._fb.array(optionArray),
      status: ["NRM"]
    });
  }
  createOptionList(): FormGroup {
    return this._fb.group({
      answerPk: [null],
      answer: [null],
      sequenceNo: [null],
      status: ["NRM"]
    });
  }

  editCustomForm(){
    let payload = {
      formRefNo: this.formRefNo
    }
    this.customFormService.GetCustomFormByRefNo(payload).subscribe((res) => {
      console.log(res.data);
      this.setCustomForm(res.data);
    })
  }
  setCustomForm(res){
    this.customForm = this._fb.group({
      formRefNo: [res.formRefNo],
      formName: [res.formName],
      questionList: this._fb.array([]),
      status: [res.status]
    })
    let questionList: any
    for (let i = 0; i < res["questionList"].length; i++) {
      this.selectedOptionType[i]=res["questionList"][i].answerType;
      questionList = this.customForm.get('questionList') as FormArray;
      questionList.push(this.editQuestionList(res["questionList"][i]));
    }
    console.log(this.customForm.value);
    
  }

  editQuestionList(question): FormGroup {
    let answerList: FormGroup[] = [];
    for (let i = 0; i < question["answerList"].length; i++) {
      //answerList = this.customForm.get('answerList') as FormArray;
      answerList.push(this.editAnswerList(question["answerList"][i]));
    }
    let q = this._fb.group({
      questionRefNo: [question.questionRefNo],
      question: [question.question],
      answerType: [question.answerType],
      sequenceNo: [null],
      mandatoryFlag: [question.mandatoryFlag],
      answerList: this._fb.array(answerList),
      status: [question.status]
    })

    // let answerList: FormGroup[] = []
    // for (let i = 0; i < question["answerList"].length; i++) {
    //   //answerList = this.customForm.get('answerList') as FormArray;
    //   answerList.push(this.editAnswerLists(question["answerList"][i]));
    // }

    return q;
  }

  editAnswerList(answer): FormGroup{
    return this._fb.group({
      answerPk: [answer.answerPk],
      answer: [answer.answer],
      sequenceNo: [null],
      status: [answer.status]
    })
  }

  addQuestion() {
    this.questionList.push(this.createQuestionList());
    this.selectedOptionType[this.questionList.length-1] = SBISConstants.OPTION_TYPE.RADIO;
  }
  addOption(question) {
    question.get("answerList").push(this.createOptionList());
  }

  deleteQuestionArray: FormGroup[] = [];
  deleteOptionArray: FormGroup[] = [];
  deleteQuestion(index) {
    if (this.questionList.controls[index].get('questionRefNo').value === null) {
      this.questionList.controls.splice(index, 1);
      this.questionList.value.splice(index, 1);
    }
    else {
      this.questionList.value[index].status = "CXL";
      this.questionList.controls.splice(index, 1);
      this.deleteQuestionArray.push(this.questionList.value[index]);
      this.questionList.value.splice(index, 1);
    }
  }

  deleteOption(question, index){
    if (question.get('answerList').controls[index].get('answerPk').value === null) {
      question.get('answerList').controls.splice(index, 1);
      question.get('answerList').controls.value.splice(index, 1);
    }
    else {
      question.get('answerList').controls[index].value.status = "CXL";
      this.deleteOptionArray.push(question.get('answerList').controls[index].value);
      question.get('answerList').controls.splice(index, 1);
     // question.get('answerList').controls.value.splice(index, 1);
    }
    console.log(this.customForm.value);
    
  }

  setOptionType(question: FormGroup, type, i){
    this.selectedOptionType[i]=type;
    
    let qList = this.customForm.get('questionList') as FormArray;
    let qForm = qList.controls[i] as FormGroup;
    if(type==SBISConstants.OPTION_TYPE.LONG_TEXT || type==SBISConstants.OPTION_TYPE.SHORT_TEXT){
      const control = <FormArray>qForm.controls['answerList'];
        for(let j = control.length-1; j >= 0; j--) {
            control.removeAt(j)
        }
    }
    else{
      const control = <FormArray>qForm.controls['answerList'];
      control.removeAt(i);
      control.push(this.createOptionList());
    }
  }

  assignCLXForQuestionList() {
    var questionList = this.customForm.get('questionList') as FormArray;
    let value = questionList.value;
    for(let i=0; i<this.deleteQuestionArray.length; i++)
    {
      let existingPk = false;
      for(let j=0; j < value.length; j++) {
        var qa: any = this.deleteQuestionArray[i];
        if(value[j].questionRefNo != '' && value[j].questionRefNo == qa.questionRefNo)
        {
          existingPk = true;
          break;
        }
      }
      if (!existingPk) {
        questionList.value.push(this.deleteQuestionArray[i]);
      }
    }
  }

  assignCLXForOptionList(question, index) {
    //var optionList = this.customForm.get('questionList') as FormArray;
    let value = question.get('answerList').controls;
    for(let i=0; i<this.deleteOptionArray.length; i++)
    {
      let existingPk = false;
      for(let j=0; j < value.length; j++) {
        var oa: any = this.deleteOptionArray[i];
        if(value[j].value.answerPk != '' && value[j].value.answerPk == oa.answerPk) {
          existingPk = true;
          break;
        }
      }
      if (!existingPk) {
        question.get('answerList').controls.push(this.deleteOptionArray[i]);
      }
    }
  }

  saveCustomForm(){
    this.assignCLXForQuestionList();
    let qList = this.customForm.get('questionList') as FormArray;
    // for (let i = 0; i < qList.length; i++) {
    //   let qForm = qList.controls[i] as FormGroup;
    //   this.assignCLXForOptionList(qForm, i);
    // }
    
    console.log(this.customForm.value);
    this.customFormService.saveCustomForm(this.customForm.value).subscribe((res) => {
      console.log(res);
      if(res.status==2000){
        this._toastService.showI18nToast("Custom Form Saved Successfully", 'success');
        this.ngOnInit();
      }
    })
  }

  backToList(){
    this.router.navigate(['custom-form/list']);
  }
}

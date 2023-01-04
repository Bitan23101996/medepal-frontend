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
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CustomFormService } from '../../../modules/custom-form/custom-form.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ToastService } from '../../../core/services/toast.service';
import { SBISConstants } from '../../../SBISConstants';

@Component({
  selector: 'app-custom-form-response',
  templateUrl: './custom-form-response.component.html',
  styleUrls: ['./custom-form-response.component.css']
})
export class CustomFormResponseComponent implements OnInit {

  @Input() saveFlag:any;
  @Input() formRefNo: any;
  @Input() questionResponse: any;
  @Output() getAnswerSet = new EventEmitter<any>();

  //@Output() getFormRefNo = new EventEmitter<any>();
  formList: any = [];
  customForm: any;
  questionList: any = [];
  answerSet: any = [];
  hideForm: boolean = false;
  answer: any = {
    responseRefNo: null,
    questionRefNo: null,
    answerPk: null,
    response: null,
    answerStatus: null
  };
  constructor(
    private customFormService: CustomFormService,
    private broadcastService: BroadcastService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    //this.populateForm(this.formRefNo);

  }

  ngOnChanges(){
    if(this.questionResponse!=null){
      console.log("For Edit");
      
      let qList = this.questionResponse.customFormDto.questionList;
      for(let i=0;i<qList.length;i++){
        if(qList[i].answerType==SBISConstants.OPTION_TYPE.CHECKBOX){
          let ansList = qList[i].answerList;
          let resList = qList[i].reponseList;
          for(let j=0;j<ansList.length;j++){
            for(let x=0;x<resList.length;x++){
              if(ansList[j].answerPk == resList[x].answerPk){
                ansList[j]["checked"] = true;
              }
            }
            
          }
        }
      }

      console.log(this.questionResponse.customFormDto);
      
      this.customForm = this.questionResponse.customFormDto;
      this.answerSet = this.questionResponse.responseDtoList;
    }
    else{
      this.populateForm(this.formRefNo);
    }

    
    if(this.saveFlag){
      this.ngOnInit();
      this.hideForm = true;
    }
  }

  getFormList() {
    this.customFormService.GetFormList().subscribe((res) => {
      this.formList = res.data;
    })
  }

  populateForm(formRefNo) {
    this.saveFlag = false;
    if (formRefNo == 0) {
      this.customForm = null;
      return false;
    }
    let payload = {
      formRefNo: formRefNo
    }
    this.customFormService.GetCustomFormByRefNo(payload).subscribe((res) => {
      console.log(res.data);
      this.customForm = res.data;
      this.questionList = res.data.questionList;
      //this.getFormRefNo.emit(res.data.formRefNo);
    })
  }

  setTextToAnswerset(txt, question){
    let addFlag: boolean = true;
    this.answer = {
      responseRefNo: null,
      questionRefNo: null,
      answerPk: null,
      response: null,
      answerStatus: null
    };
    for (let i = 0; i < this.answerSet.length; i++) {
      if (this.answerSet[i]["questionRefNo"] == question.questionRefNo) {
        this.answerSet[i]["response"] = txt;
        addFlag = false;
      }
      else {
        continue;
      }
    }
    if(txt!="" && addFlag){
      this.answer.questionRefNo = question.questionRefNo;
      this.answer.answerPk = null;
      this.answer.response = txt;
      this.answer.answerStatus = "N";
     
      this.answerSet.push(this.answer);
    }
    console.log(this.answerSet);
    this.getAnswerSet.emit(this.answerSet);
  }

  setAnswerForDropdown(val, question){
    let addFlag: boolean = true;
    this.answer = {
      responseRefNo: null,
      questionRefNo: null,
      answerPk: null,
      response: null,
      answerStatus: null
    };
    for (let i = 0; i < this.answerSet.length; i++) {
      if (this.answerSet[i]["questionRefNo"] == question.questionRefNo) {
        this.answerSet[i]["answerPk"] = parseInt(val);
        addFlag = false;
      }
      else {
        continue;
      }
    }
    if(addFlag){
      this.answer.questionRefNo = question.questionRefNo;
      this.answer.answerPk = parseInt(val);
      this.answer.response = null;
      this.answer.answerStatus = "Y";
     
      this.answerSet.push(this.answer);
    }
    console.log(this.answerSet);
    this.getAnswerSet.emit(this.answerSet);
  }

  setAnswerForRadio(question, answer) {
    this.answer = {
      responseRefNo: null,
      questionRefNo: null,
      answerPk: null,
      response: null,
      status: null
    };
    let addFlag: boolean = true;
    for (let i = 0; i < this.answerSet.length; i++) {
      if (this.answerSet[i]["questionRefNo"] == question.questionRefNo && question.answerType == "RD") {
        this.answerSet[i]["answerPk"] = answer.answerPk;
        addFlag = false;
      }
      else {
        continue;
      }
    }
    if (addFlag) {
      this.answer.questionRefNo = question.questionRefNo;
      this.answer.answerPk = answer.answerPk;
      this.answer.response = null;
      this.answer.answerStatus = "Y";
      this.answerSet.push(this.answer);
    }

    if (this.answerSet.length == 0) {
      this.answer.questionRefNo = question.questionRefNo;
      this.answer.answerPk = answer.answerPk;
      this.answer.response = null;
      this.answer.answerStatus = "Y";
      this.answerSet.push(this.answer);
    }
    console.log(this.answerSet);
    this.getAnswerSet.emit(this.answerSet);
  }

  setAnswerForCheckbox(question, answer, event){
    this.answer = {
      responseRefNo: null,
      questionRefNo: null,
      answerPk: null,
      response: null,
      status: null
    };
    let addFlag: boolean = true;
    if(event.target.checked){
      for (let i = 0; i < this.answerSet.length; i++) {
        if (this.answerSet[i]["questionRefNo"] == question.questionRefNo && question.answerType == "RD") {
          this.answerSet[i]["answerPk"] = answer.answerPk;
          addFlag = false;
        }
        else {
          continue;
        }
      }
  
      if (addFlag) {
        this.answer.questionRefNo = question.questionRefNo;
        this.answer.answerPk = answer.answerPk;
        this.answer.response = null;
        this.answer.answerStatus = "Y";
        this.answerSet.push(this.answer);
      }
  
      if (this.answerSet.length == 0) {
        this.answer.questionRefNo = question.questionRefNo;
        this.answer.answerPk = answer.answerPk;
        this.answer.response = null;
        this.answer.answerStatus = "Y";
        this.answerSet.push(this.answer);
      }
    }
    else{
      let index = this.findIndexToUpdateLabel(answer.answerPk);
      if(this.answerSet[index].responseRefNo==null){
        this.answerSet.splice(index, 1);
      }
      else{
        this.answerSet[index]["status"]="CXL";
      }
      console.log("Answer", this.answerSet);
      
    }
    this.getAnswerSet.emit(this.answerSet);
  }
  findIndexToUpdateLabel(answerPk) {
    for (let i = 0; i < this.answerSet.length; i++) {
      if (this.answerSet[i]["answerPk"] == answerPk)
        return i;
    }
  }


}

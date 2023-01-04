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
// /sbis-poc/app/issues/936
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router ,ParamMap} from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { CustomAnalysticQueryService } from '../custom-analystic-query.service';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { JsonPipe } from '@angular/common';
import { QueryFrameworkService } from '../../query-framework/query-framework.service';

@Component({
  selector: 'app-custom-analystic-query',
  templateUrl: './custom-analystic-query.component.html',
  styleUrls: ['./custom-analystic-query.component.css']
})
export class CustomAnalysticQueryComponent implements OnInit {
  title: any;
  role:string;
  isPaginator = false;
  panelVisible: boolean;
  customAnalysticQuery: FormGroup = new FormGroup({});
  queryScenario:{'label', 'value'}[] = [];
  queryParams:any[] = [];
  filterList:any[] = [];
  dateFormat: any;
  isAnyColumnChecked: boolean = false;
  isCustomeSelected: boolean = false;
  user:any;
  recordSet:[];
  tableColumns:[];
  queryGroups:[];
  recordList:[];
  referenceNo:string;
  loading: boolean = false;
  filterOutsideClick: boolean = false;
  refinePanelPreboolean: boolean = false;

  // Working on app/issue/2202
  queryId:any;isDefaultRequest:boolean=false
  recordSetBackUp:any=[];
  // End Working on app/issue/2202

  constructor(private route: ActivatedRoute, private translate: TranslateService, private fb:FormBuilder,
        private _toastService: ToastService, private broadcastService: BroadcastService, private router: Router,
        private customAnalysticQueryService:CustomAnalysticQueryService,private service: QueryFrameworkService){
        translate.setDefaultLang('en');
        translate.use('en');
  }

  refinePanelhide() {
    this.refinePanelPreboolean = true;
    this.panelVisible = false;
  }

  refinePanelDisplay(){
    this.refinePanelPreboolean = this.panelVisible;
      this.panelVisible = !this.panelVisible;
  }

  outsideDivClick(ev) {
    if(ev.target.classList.contains('filterBtn')){
      return false;
    }else if(ev.target.nodeName=="SPAN" && ev.target.classList.contains('is-highlighted')){
      return false;
    }else{
      //console.log(ev);
      this.filterOutsideClick = true;
      this.panelVisible = false;
    }

  }

  insideDivClick() {
    console.log("inside click true");
    this.filterOutsideClick = false;
  }

  ngOnInit() {
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    this.dateFormat = environment.DATE_FORMAT;
    // Working on app/issue/2202
    this.route.paramMap.subscribe((param: ParamMap) => {
      this.queryId = param['params'].queryId;
      this.isDefaultRequest=true;
    });
     this.getDefaultParamList();
    // End Working on app/issue/2202
   
    this.customAnalysticQuery = this.fb.group({
      "queryScenario":[null],
      "queryId":this.queryId
    });
    // this.title = this.title;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.role = this.user.roleName;
    // Working on app/issue/2202
   /* 
     this.customAnalysticQueryService.getQueryScenario(this.user.entityName).subscribe(res => {
        if(res.status == 2000){
          let dataList = res.data;
          
          
          dataList.forEach(data => {
           
            this.queryScenario.push({"label": data.scenario, "value": data.refNo});
            this.fetchQueryParamsData(res.data.refNo)
            
          });
        } else{
          console.log(JSON.stringify(res))
        }
    }); */ 
    // End Working on app/issue/2202
  }

  


  resetAll(){
       this.customAnalysticQuery.reset();
      /*this.customAnalysticQuery = this.fb.group({
        "queryScenario":[null]
      });
      this.fetchColumns(null); */
      this.searchResult()
  }


  fetchColumns(data){
    
    this.title=this.queryScenario.find(q=>q.value=data.value).label;
    
    let scenarioRefNo = (typeof data === "undefined" || data == null)? null: data.value;
    this.queryParams = [];
    this.filterList = [];
    this.isAnyColumnChecked = false;
    if(scenarioRefNo != null){
      this.customAnalysticQueryService.fetchQueryColumnsScenarioRefNo({"refNo": scenarioRefNo}).subscribe(res => {
        if(res.status == 2000){
          console.log(res.data);          
          this.queryParams = res.data;         
        }
        else{
          console.log(JSON.stringify(res))
        }
      })
    }
    
  }

fetchQueryParamsData(scenarioRefNo){
    if(scenarioRefNo != null){
        this.queryParams=[];
        this.customAnalysticQueryService.fetchQueryColumnsScenarioRefNo({"refNo": scenarioRefNo}).subscribe(res => {
        if(res.status == 2000){
          this.queryParams = res.data;
          console.log("fetchQueryParamsData:",res.data);
          
          for(let  queryParam of  this.queryParams){
            if(queryParam.paramName=="Doctor" ||queryParam.paramName=="Date" ){
              this.createFilterSection(queryParam)
            }
          }
        }
        else{
          console.log(JSON.stringify(res))
        }
      })
    }
    
}
 



  isFilterListExist(data):number{
    for(let i=0; i < this.filterList.length; i++){
      if(this.filterList[i].paramName == data.paramName){
        return i;
      }
    }
    return -1;
  }

  isCustomDatePeriod(e, filterData){
    console.log("EVENT::",e,"   DATA::",filterData);

    if(this.customAnalysticQuery.get(filterData.paramName)==null){
      this.customAnalysticQuery.addControl("from"+filterData.paramName, this.fb.control(null));
      this.customAnalysticQuery.addControl("to"+filterData.paramName, this.fb.control(null));
      
    }

    if(e.value != null && e.value.ref.length==2){
      let unit=e.value.ref.charAt(1);
      let parameter=parseInt(e.value.ref.charAt(0));
      let today=new Date();  
      if(unit=="W")
        today.setDate(today.getDate() - parameter);
      else if(unit=="M")
        today.setMonth(today.getMonth() - parameter);
      else if(unit=="Y")
        today.setFullYear(today.getFullYear() - parameter);
     

        this.customAnalysticQuery.get('from'+filterData.paramName).setValue(today);
        this.customAnalysticQuery.get('to'+filterData.paramName).setValue(new Date());
    }
    else if(e.value != null && e.value.ref == 'CUSTOM'){
      this.isCustomeSelected = true;
      this.customAnalysticQuery.addControl("from"+filterData.paramName, this.fb.control(null));
      this.customAnalysticQuery.addControl("to"+filterData.paramName, this.fb.control(null));

      this.customAnalysticQuery.get('from'+filterData.paramName).setValue(null);
      this.customAnalysticQuery.get('to'+filterData.paramName).setValue(null);
    }
    /* if(e.value != null && e.value.ref == 'CUSTOM'){
      this.customAnalysticQuery.addControl("from"+filterData.paramName, this.fb.control(null));
      this.customAnalysticQuery.addControl("to"+filterData.paramName, this.fb.control(null));
       this.isCustomeSelected = true;
    }  else if(this.isCustomeSelected){
      this.customAnalysticQuery.removeControl("from"+filterData.paramName);
      this.customAnalysticQuery.removeControl("to"+filterData.paramName);
      this.isCustomeSelected = false;
    }  */
    
  }

  removeFromFilterArray(queryParam){
    delete queryParam.itemsArr;
  }

  removeTypeAheadFilter(filterData, data){
    filterData.itemsArr = filterData.itemsArr.filter(flData => {
      return flData !== data;
    });

    const items = this.customAnalysticQuery.get(filterData.paramName+"Arr") as FormArray;

    for (let index = 0; index < items.length; index++) {
      let obj = items.controls[index].value
      let itemdata:string = null;
      if(typeof obj === "object"){
        itemdata = obj.value;
      } else{
        itemdata = obj;
      }
      if(itemdata == data){
        items.removeAt(index);
        index = items.length - 1;
      }
    }
  }

  createFilterSection(queryParam){

    let index = this.isFilterListExist(queryParam);
    let paramName = queryParam.paramName;
    if(index != -1){
      // If parameters is already exist then delete and remove the control
      this.filterList.splice(index, 1);
      if(this.filterList.length == 0){
        this.isAnyColumnChecked = false;
      }
      
      if(queryParam.displayType == 'range'){
        if(queryParam.dataType == 'period'){
          this.customAnalysticQuery.removeControl(paramName);
          if(this.isCustomeSelected){
            this.customAnalysticQuery.removeControl("from"+paramName);
            this.customAnalysticQuery.removeControl("to"+paramName);
            this.isCustomeSelected = false;
          }
        }
        else{
          this.customAnalysticQuery.removeControl("from"+paramName);
          this.customAnalysticQuery.removeControl("to"+paramName);
        }
        
      } else if(queryParam.displayType == 'typeahead'){
        this.customAnalysticQuery.removeControl(paramName);
        this.customAnalysticQuery.removeControl(paramName+"Arr");
        //delete queryParam.data
      } else{
        this.customAnalysticQuery.removeControl(paramName);
      }

      this.removeFromFilterArray(queryParam);
    } else{
      this.isAnyColumnChecked = true;
      // If parameters is not exist then create and the control
      
      if(queryParam.displayType == 'range'){
        if(queryParam.dataType == 'period'){
          this.customAnalysticQueryService.fetchAllParamsDataByParam({"entityRefNo": this.user.refNo, "paramRefNo": queryParam.refNo}).subscribe(res => {
            if(res.status == 2000){
              queryParam["data"] = res.data;
              this.customAnalysticQuery.addControl(paramName, this.fb.control(null));              
              this.filterList.push(queryParam);
              if(this.isDefaultRequest){
                this.generateReportWithDefaultParams(queryParam);// Working on app/issue/2202
              }
            }
            else{
              console.log(JSON.stringify(res))
            }
          });
        }
        else{
          this.customAnalysticQuery.addControl("from"+paramName, this.fb.control(null));
          this.customAnalysticQuery.addControl("to"+paramName, this.fb.control(null));
          this.filterList.push(queryParam);
        }
      } else if(queryParam.displayType == "checkbox"){
        this.customAnalysticQueryService.fetchAllParamsDataByParam({"entityRefNo": this.user.refNo, "paramRefNo": queryParam.refNo}).subscribe(res => {
          if(res.status == 2000){
            queryParam["data"] = res.data;
            var dataList = res.data;
            this.customAnalysticQuery.addControl(paramName, this.fb.array([]));
            let items = this.customAnalysticQuery.get(paramName) as FormArray;
            dataList.forEach(data => {
              let myFbGroup={};
              myFbGroup[data.ref]=false;


              items.push(this.fb.group(myFbGroup));
            });
            this.filterList.push(queryParam);
            if(this.isDefaultRequest){
              this.generateReportWithDefaultParams(queryParam);// Working on app/issue/2202
            }
          }
          else{
            console.log(JSON.stringify(res))
          }
        });
      } else if(queryParam.displayType == "dropdown" || queryParam.displayType == "radio"){
        this.customAnalysticQueryService.fetchAllParamsDataByParam({"entityRefNo": this.user.refNo, "paramRefNo": queryParam.refNo}).subscribe(res => {
          if(res.status == 2000){
            queryParam["data"] = res.data;
            queryParam["data"].push({"ref":"ALL","value":"All"})
            if(queryParam.displayType == "radio"){
              this.customAnalysticQuery.addControl(paramName, this.fb.control(queryParam["data"][0]['ref']));
            } else{
              this.customAnalysticQuery.addControl(paramName, this.fb.control(null));
            }
            
            
            this.filterList.push(queryParam);
            if(this.isDefaultRequest){
              this.generateReportWithDefaultParams(queryParam);// Working on app/issue/2202
            }
          }
          else{
            console.log(JSON.stringify(res))
          }
        });
      } else if(queryParam.displayType == "typeahead"){
        this.customAnalysticQuery.addControl(paramName, this.fb.control(null));
        this.customAnalysticQuery.addControl(paramName+"Arr", this.fb.array([]));
        this.filterList.push(queryParam);
        if(this.isDefaultRequest){
          this.generateReportWithDefaultParams(queryParam);// Working on app/issue/2202
        }
      } else{
        this.customAnalysticQuery.addControl(paramName, this.fb.control(null));
        this.filterList.push(queryParam);
        if(this.isDefaultRequest){
          this.generateReportWithDefaultParams(queryParam);// Working on app/issue/2202
        }
      }
      
      console.log();
      
    } 
    
    
  }

  getFromControlName(frmcntrl){
    return Object.keys(frmcntrl.value)[0];
  }

  fetchDateFromTime(time: string): Date{
    let timeArr:string[] = time.split(":");
    let dateObj:Date = new Date();
    dateObj.setHours(Number(timeArr[0]));
    dateObj.setMinutes(Number(timeArr[1]));
    dateObj.setSeconds(Number(timeArr[2]));
    return dateObj;
 }

 fetchDecimalPoint(str: string, type: string):string{
    let format = Number(type.replace(")","").split(",")[1]);
    let num = Number(str);
    let resultStr = num.toFixed(format);
    return resultStr;
  }

  fetchTypeaheadData(event, filterData){
    if(this.user.entityName !=='HOSPITAL'){
    this.customAnalysticQueryService.fetchAllParamsDataByParam({"entityRefNo": this.user.refNo, "paramRefNo": filterData.refNo, "query": event.query}).subscribe(res => {
      if(res.status == 2000){
        filterData.data = res.data;
      }
      else{
        console.log(JSON.stringify(res));
      }
    
    })
  }
    else{
   this.customAnalysticQueryService.fetchAllParamsDataByParam({"entityRefNo": this.user.refNo,"paramRefNo": filterData.refNo,"query": event.query}).subscribe(res => {
        if(res.status == 2000){
          filterData.data = res.data;
          
        }
        else{
          console.log(JSON.stringify(res));
        }
      
      })
    }
  }

  
  
  
  
  selectedListGen(filterData){
    const fromControl = this.customAnalysticQuery.get(filterData.paramName);
    const items = this.customAnalysticQuery.get(filterData.paramName+"Arr") as FormArray;
    const fb = this.fb
    



    setTimeout(function(){
      let dataStr = "";
      if(fromControl.value != null){
        if(typeof fromControl.value == "string"){
          dataStr = fromControl.value;
        } else{
          dataStr = fromControl.value.value;
        }
      }
      

      let itemsArr = filterData.itemsArr;
      if(typeof itemsArr === "undefined"){
        itemsArr = [];
        filterData.itemsArr = itemsArr;
      }

      if(filterData.paramName != dataStr && dataStr != "" && typeof dataStr !== "undefined" && itemsArr.indexOf(dataStr) == -1){
        
          items.push(fb.control(fromControl.value))
          
          
          itemsArr.push(dataStr);
          
          
      }
      fromControl.patchValue([null]);
    }, 250, fromControl, items, fb, filterData);
  }

  ymdTodmy(dt: string){
    return dt.split("-").reverse().join("/");
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  refineByColumnList:any=[];
  searchResult(){ // Various changes for #1793
    
    // Working on app/issue/2202
   var queryObj:any={};
   queryObj["queryId"]=this.queryId
    // queryObj ={...this.customAnalysticQuery.value};

    if(this.isDefaultRequest){     
      for(let qp of this.queryParams){
        for(let formObj of Object.entries(this.customAnalysticQuery.value)){
          let formControlName=formObj[0];
          let formControlValue=formObj[1];
          console.log("formControlName::",formControlName ," formControlValue::",formControlValue);
          
          if(formControlName.toLowerCase().includes(qp.paramName.toLowerCase()) && qp.defaultParameterValue!=null){ 
            queryObj[formControlName]=formControlValue;
          }
          
        }
      }

      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');

    }else{
     queryObj = {...this.customAnalysticQuery.value};
    }   
    queryObj["entityRefNo"] = this.user.refNo;
    queryObj["entityName"] = this.user.entityName;
    queryObj["isDefaultRequest"]=this.isDefaultRequest
    console.log(queryObj);
    console.log(":customAnalysticQuery:::",this.customAnalysticQuery);
    
    this.customAnalysticQueryService.fetchCustomAnalysticResultList(queryObj).subscribe(res => {  
      if(res.status == 2000){
        this.title=res.data.querytitle 
        this.tableColumns = res.data.queryColumns;
        this.queryGroups =  res.data.queryGroups;
        this.recordSet = res.data.rows;
        this.recordSetBackUp=res.data.rows;
        let fromControll: any = {};
        this.refineByColumnList=[];
      const queryFrameWork =  new FormGroup({});
      for(let col of res.data["queryColumns"]){
               
           if(col['isRefinable']=="Y"){
            let formControlName:string = this.camelize(col["columnHeading"]);
            col["formControlName"] = formControlName;
            let columnType = col["displayType"];
            
            if(columnType == "String" || columnType == "Datetime" || columnType == "Date"){
                fromControll[formControlName] = [''];
            } else if(columnType == "Checkbox"){               
                fromControll[formControlName] = [];
            }
            queryFrameWork.addControl(formControlName, this.fb.control(null)); 
            this.refineByColumnList.push(col);

            
           }
      }      
      this.customAnalysticQuery.addControl("queryFrameWork", queryFrameWork);      
      console.log(this.refineByColumnList);

      // End Working on app/issue/2202
      /*  if(this.recordSet.length > 15){
          this.isPaginator = true;
        } else{
          this.isPaginator = false;
        } */

        for(let i =0; i < this.queryGroups.length ; i++){
          let queryGroup:any = this.queryGroups[i];
          let primaryColoumnName:string = queryGroup["primaryColoumnName"];
          let primaryColoumnDisplayType:string = queryGroup["primaryColoumnDisplayType"];
          let barWidth = queryGroup["barWidth"];
          let primaryLabels = new Set<string>();
          let pAllValues = [];
          for(let j = 0; j < this.recordSet.length; j++){
            let record = this.recordSet[j];
            let pValue = "";
            pValue = record[primaryColoumnName];
            if(typeof pValue !== "undefined" && pValue != null && pValue != 'null' && pValue != ""){
              if (primaryColoumnName.toLowerCase().indexOf("medicine") >= 0) {
                let medicineSet = new Set(pValue.split(","));
                medicineSet.forEach(m => primaryLabels.add(m));
              }
              else {
                primaryLabels.add(pValue);
              }
              pAllValues.push(pValue);
            }
          }
          if(typeof barWidth == "undefined" || barWidth == null || barWidth == 'null' || barWidth == ""){
            barWidth = 0;
          }
          let pVArr:string[] = Array.from(primaryLabels);
          let backgroundColor = [];
          pVArr.sort((obj1, obj2) => {
            if(primaryColoumnDisplayType.indexOf("Decimal") != -1){
              let num1 = Number(obj1);
              let num2 = Number(obj2);
              return (num1 - num2);
            } else if(primaryColoumnDisplayType.indexOf("Date") != -1){
              let date1 = new Date(obj1);
              let date2 = new Date(obj2);
              return (date1.getTime() - date2.getTime());
            } else{
              let str1 = String(obj1);
              let str2 = String(obj2);
              return str1.localeCompare(str2);
            }
          });
          console.log(pVArr);
          let pValueGroupCount = [];
          let pSmlValue = pVArr[0];
          let pHighestValue = pVArr[pVArr.length - 1];
          if(primaryColoumnDisplayType.indexOf("Decimal") >= 0){ // Case decimal
            let highValDec = Number(pHighestValue);
            let lowValDec = 0;
            if (primaryColoumnName.toLowerCase().indexOf("age") != -1) { // Separate treatment for Age
              if (barWidth == 5) {
                lowValDec = 5 * Math.floor(Number(pSmlValue) / 5);
              }
              else if (barWidth == 10) {
                lowValDec = 10 * Math.floor(Number(pSmlValue) / 10);
              }
              else {
                lowValDec = Math.floor(Number(pSmlValue));
              }
            }
            else {
              lowValDec = Math.floor(Number(pSmlValue));
            }
            if(lowValDec == highValDec){
              backgroundColor.push(this.getColor());
              pValueGroupCount.push(pAllValues.length);
            } else{
              pVArr = [];
              for(let i = lowValDec; i <= highValDec; i += barWidth){
                backgroundColor.push(this.getColor());
                pVArr.push(i + " - " + (i + barWidth));
                let count = 0;
                pAllValues.forEach(element => {
                  if(element >= i && element < i + barWidth){
                    count++;
                  }
                });
                if(count == 0){
                  pValueGroupCount.push(null);
                }else{
                  pValueGroupCount.push(count);
                }
              }
            }
          } else if(primaryColoumnDisplayType.indexOf("Date") >= 0){ // Case date
            let highDate = new Date(pHighestValue);
            let lowDate = new Date(pSmlValue);
              
            if(lowDate.getTime() == highDate.getTime()){
              backgroundColor.push(this.getColor());
              pValueGroupCount.push(pAllValues.length);
            } else{
              pVArr = [];
              let nextDate = new Date;
              if (barWidth == 1) { // Case: year interval
                let yearCount = lowDate.getFullYear();
                let startDate = new Date(yearCount + "-01-01");
                for (let i = startDate; i <= highDate; i = nextDate) {
                  pVArr.push(yearCount + "");
                  let count = 0;
                  yearCount++;
                  nextDate = new Date(yearCount + "-01-01");
                  pAllValues.forEach(element => {
                    element = new Date(element);
                    if (element.getTime() >= i.getTime() && element.getTime() < nextDate.getTime()){
                      count++;
                    }
                  });

                  pValueGroupCount.push(count);
                  backgroundColor.push(this.getColor());
                }
              }
              else if (barWidth == 2) { // Case: month interval
                let yearCount = lowDate.getFullYear();
                let monthCount = lowDate.getMonth();
                let startDate = new Date(yearCount + "-" + (monthCount + 1) +  "-01");
                let monthStr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                for (let i = startDate; i <= highDate; i = nextDate) {
                  pVArr.push(monthStr[monthCount] + "-" + yearCount + "");
                  let count = 0;
                  if (monthCount == 11) {
                    monthCount = 0;
                    yearCount++;
                  }
                  else {
                    monthCount++;
                  }
                  nextDate = new Date(yearCount + "-" + (monthCount + 1) +  "-01");
                  pAllValues.forEach(element => {
                    element = new Date(element);
                    if (element.getTime() >= i.getTime() && element.getTime() < nextDate.getTime()){
                      count++;
                    }
                  });

                  pValueGroupCount.push(count);
                  backgroundColor.push(this.getColor());
                }
              }
              else if (barWidth == 3) { // Case: day interval
                for (let i = lowDate; i <= highDate; i = new Date(i.getTime() + (1000 * 60 * 60 * 24))) {
                  pVArr.push(i.getDate() + "-" + i.getMonth() + "-" + i.getFullYear());
                  let count = 0;
                  pAllValues.forEach(element => {
                    element = new Date(element);
                    if (element == i){
                      count++;
                    }
                  });

                  pValueGroupCount.push(count);
                  backgroundColor.push(this.getColor());
                }
              }
            }
          } else{ // Case string
            if(pVArr.length == 1){
              if (primaryColoumnName.toLowerCase().indexOf("gender") >= 0) {
                if (pVArr[0] == "F") {
                  pValueGroupCount= [pAllValues.length, 0, 0];
                }
                else if (pVArr[0] == "M") {
                  pValueGroupCount= [0, pAllValues.length, 0];
                }
                if (pVArr[0] == "F") {
                  pValueGroupCount= [0, 0, pAllValues.length];
                }
                pVArr = ["Female", "Male", "Others"];
                backgroundColor = [this.getColor(), this.getColor(), this.getColor()];
              }
              else {
                backgroundColor.push(this.getColor());
                pValueGroupCount.push(pAllValues.length);
              }
            }
            else {
              if (primaryColoumnName.toLowerCase().indexOf("gender") >= 0) {
                pVArr = ["F","M","O"];
              }
              if (primaryColoumnName.toLowerCase().indexOf("medicine") >= 0) { // Special case for medicine
                let pAllMedicineValues = [];
                pAllValues.forEach(element => {
                  let medicineSet = new Set(element.split(","));
                  medicineSet.forEach(e => pAllMedicineValues.push(e));
                })
                pAllValues = pAllMedicineValues;
              }

              for(let i = 0; i < pVArr.length; i++){
                backgroundColor.push(this.getColor());
                let count = 0;
                pAllValues.forEach(element => {
                  if(element == pVArr[i]){
                    count++;
                  }
                });
                pValueGroupCount.push(count);
              }
              if (primaryColoumnName.toLowerCase().indexOf("gender") >= 0) {
                pVArr = ["Female", "Male", "Others"];
              }
            }
          }
            
          queryGroup["chartData"] = {
            labels: pVArr,
            datasets: [
              {
                data: pValueGroupCount,
                backgroundColor: backgroundColor,
                hoverBackgroundColor: backgroundColor
              }
            ]
          };
        } 
        
        console.log(this.queryGroups);
 
      } else{
        this.tableColumns = [];
        this.recordSet = [];
      }

      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');


    });
  }
  
  getColor() {
    let color = "#";
    for(let i=0; i < 6; i++){
      let n = this.getRandomInt(0, 15);
      color += (n).toString(16);
    }
    return color;
  }
  // Working on app/issue/2202
  filterByParams:any=[];
  isDefaultAvailable:boolean=false;
  getDefaultParamList(){
    let payload={
      queryId:this.queryId
    }

    this.customAnalysticQueryService.getDefaultParamsByQueryId(payload).subscribe(res => {    
      if(res.data.length>0){
        for(let qp of res.data){
          
            if(qp['defaultParameterValue']==null){
              qp['isApplied']=true;
              this.filterByParams.push(qp);             
              this.searchResult();
            }else{
              qp['isApplied']=true;
              this.queryParams.push(qp);
              this.isDefaultAvailable=true;             
              this.createFilterSection(qp);
            }
        }
      }
      else{
        this.searchResult();
      }
      
      

    });
  }

  generateReportWithDefaultParams(queryParam){
  
    if(queryParam.displayType=="checkbox"){        
      this.searchResult(); 
    }   
    else if(queryParam.dataType=="period"){
      let defaultParamValue; 
       if(queryParam.defaultParameterDataType=='number'){
        defaultParamValue=parseInt(queryParam.defaultParameterDataType);
       }     
       this.isCustomeSelected == true
       let e={ value:{ref:'CUSTOM'}}
       this.isCustomDatePeriod(e, queryParam);
        let today=new Date();
        today.setDate(today.getDate() - 90);
        this.customAnalysticQuery.get('from'+queryParam.paramName).setValue(new Date(queryParam.defaultStartDate));
        this.customAnalysticQuery.get('to'+queryParam.paramName).setValue(new Date(queryParam.defaultEndDate));
        if( this.customAnalysticQuery.value['fromDate']!=null && this.customAnalysticQuery.value['toDate']!=null){
          this.customAnalysticQuery.get('Date').setValue({ref:"CUSTOM",value:"CUSTOM"});         
        }
        this.searchResult();
       
    }
    else if(queryParam.dataType=="string"){
      this.customAnalysticQuery.get(queryParam.paramName).setValue(queryParam.defaultParameterValue);
      this.searchResult();
      
    }
   

    
  }


  camelize(str) {
    str = str.replace(/[,;.-/]/g, "");
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index == 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }
  minDate:Date;  checkBoxObj: any = {};
  filterData(){   
    let filterObj = this.customAnalysticQuery.value.queryFrameWork;
    
    let keys:string[] = Object.keys(filterObj);
    let cloneSet = Object.assign([], this.recordSetBackUp);
    try {
        for(let i=0; i < keys.length; i++){
            let key = keys[i];
            if(typeof filterObj[key] === "undefined" || filterObj[key] == null
             || (typeof filterObj[key] === "object" && filterObj[key] == "")
             || (typeof filterObj[key] === "string" && filterObj[key].trim() == "")){
                continue;
            }
            cloneSet = cloneSet.filter(obj => {
                let columnIndex = 0;
                let filterColumnNoFun = (arr)=>{
                    for(var i = 0; i < arr.length; i++) {
                        let str = this.camelize(arr[i]["columnHeading"]);
                        if(str === key || str+"From" == key || str+"To" == key) {
                            columnIndex = i;
                            return arr[i]["columnHeading"];
                        }
                    }
                    return null;
                };           

                let columnHeading = filterColumnNoFun(this.refineByColumnList);
                if(columnHeading != null){
                  let filterStr = filterObj[key];
                  let columnType = this.refineByColumnList[i]["displayType"];
                  if(columnType=="String"){
                    if(obj[columnHeading].toLowerCase().includes(filterStr.toLowerCase())){
                      return true;
                    }
                  }

                else if(key == "dateTime" || key == "date" || columnType == "Date" || columnType == "Datetime"){
                    let filterObj = filterStr;                  
                    
                    let tableDate:Date = this.dateTimeToOnlyDate(new Date(obj[columnHeading]));
                    if(filterObj.attrValue != "CUSTOM"){
                        let fromDate = this.dateTimeToOnlyDate(new Date());
                        let toDate = this.dateTimeToOnlyDate(new Date());
                        switch(filterObj.attrValue){
                            case "1W":
                                    fromDate.setDate(fromDate.getDate()-7);
                                    break;
                            case "1M":
                                    fromDate.setMonth(fromDate.getMonth()-1);
                                    break;
                            case "3M":
                                    fromDate.setMonth(fromDate.getMonth()-3);
                                    break;
                            case "6M":
                                    fromDate.setMonth(fromDate.getMonth()-6);
                                    break;
                            case "1Y":
                                    fromDate.setFullYear(fromDate.getFullYear()-1);
                                    break;                                    
                        }
                        return (tableDate.getTime() >= fromDate.getTime()  && tableDate.getTime() <= toDate.getTime());
                    } else{
                        let fromDateStr = this.queryFrameWork.get(key + "From").value;
                        let toDateStr = this.queryFrameWork.get(key + "To").value;
                       /*  if (fromDateStr != null && fromDateStr != ""){
                            let fromDate:Date = this.dateTimeToOnlyDate(new Date(fromDateStr));
                            this.minDate[columnIndex] = fromDate;
                            return tableDate.getTime()>=fromDate.getTime();
                        }
                        else if (toDateStr != null && toDateStr != ""){
                            let toDate:Date = this.dateTimeToOnlyDate(new Date(toDateStr));
                            return tableDate.getTime()<=toDate.getTime();
                        } */
                        // else {
                      /*       let fromDate:Date = this.queryFrameWork.get(key + "From").value;
                            let toDate:Date = this.queryFrameWork.get(key + "To").value; */

                            let fromDate =  this.dateTimeToOnlyDate(new Date(this.queryFrameWork.get(key + "From").value));
                            let toDate = this.dateTimeToOnlyDate(new Date(this.queryFrameWork.get(key + "To").value));
                            if(this.queryFrameWork.get(key + "From").value==null && this.queryFrameWork.get(key + "To").value==null){
                              return true;
                            }else{
                              console.log("fromDate::",fromDate," toDate::",toDate," tableDate::",tableDate);                            
                              if(tableDate >= fromDate  && tableDate <= toDate){
                                // console.log(obj);
                                return true;                              
                              }
                            }
                           
                            
                            // return (tableDate.getTime() >= fromDate.getTime()  && tableDate.getTime() <= toDate.getTime());
                        // }
                    }
                   
                }
                else if(key.endsWith("From")){
                  // date from
                  let fromDate:Date = this.dateTimeToOnlyDate(new Date(filterStr));
                  let toDateFromControlName = key.replace("From", "To");
                  let toDate:Date = null
                  if(this.queryFrameWork.get(toDateFromControlName).value != ""){
                      toDate = this.queryFrameWork.get(toDateFromControlName).value;
                  }                 

                  this.minDate[columnIndex] = fromDate;
                  
                  let tableDate:Date = this.dateTimeToOnlyDate(new Date(obj[columnHeading]));

                  return tableDate.getTime()>=fromDate.getTime();
                }
                else if(key.endsWith("To")){
       
                  let toDate:Date = this.dateTimeToOnlyDate(new Date(filterStr));
                  let fromDateFromControlName = key.replace("From", "To");
                  let fromDate:Date = null;
                  if(this.queryFrameWork.get(fromDateFromControlName).value != ""){
                      fromDate = this.queryFrameWork.get(fromDateFromControlName).value;
                  }
                  toDate.setHours(23);
                  toDate.setMinutes(59);
                  toDate.setSeconds(0);
                  toDate.setMilliseconds(0);
          
                  let tableDate:Date = this.dateTimeToOnlyDate(new Date(obj[columnHeading]));


                  return tableDate.getTime()<=toDate.getTime();
              } 
                  
                }
               
                return false;
            });
        }
    } catch(err) {
        console.log("textbox>>>"+err);
    }


         // checkbox filter start
         try{
          keys = Object.keys(this.checkBoxObj);
          for(let i=0; i < keys.length; i++){
              let key = keys[i];
              let valuesArr = this.checkBoxObj[key];
              cloneSet = cloneSet.filter(obj => {
                  let filterColumnNoFun = (arr)=>{
                      for(var i = 0; i < arr.length; i++) {
                          let str = arr[i]["columnHeading"];
                          if(str === key) {
                              return arr[i]["columnHeading"];
                          }
                      }
                      return null;
                  };
                  let columnHeading = filterColumnNoFun(this.refineByColumnList);
                  if(columnHeading != null){
                    
                      if(valuesArr.includes(obj[columnHeading])){
                          return true;
                      }
                  }

                  return false;
              });
          }
      } catch(err){
          console.log("checkbox>>>"+err);
      }
 
    this.recordSet = cloneSet; 
    if (this.recordSet.length > 15) this.isPaginator = true;
    else this.isPaginator = false;
   
}
dateTimeToOnlyDate(dateAndTime:Date):Date{
  dateAndTime = new Date(dateAndTime.getFullYear(), dateAndTime.getMonth(), dateAndTime.getDate());
  return dateAndTime;
}

isCustomeRefineSelected:boolean=false;

get queryFrameWork() { return this.customAnalysticQuery.get('queryFrameWork') as FormGroup; }

isCustomRefineByDatePeriod(e, formControlName){
  if(e.value == null){
      this.queryFrameWork.removeControl(formControlName+"From");
      this.queryFrameWork.removeControl(formControlName+"To");
      this.isCustomeRefineSelected = false;
      this.filterData();
  } 
  else{
      let attrCode = e.value.attrValue;
      if(attrCode == 'CUSTOM'){
          this.queryFrameWork.addControl(formControlName+"From", this.fb.control(null));
          this.queryFrameWork.addControl(formControlName+"To", this.fb.control(null));
          this.isCustomeRefineSelected = true;
          
      } else{
          this.isCustomeRefineSelected = false;
          this.queryFrameWork.removeControl(formControlName+"From");
          this.queryFrameWork.removeControl(formControlName+"To");
          this.filterData();
      }
  }
}

setCheckBoxArr(event, headerName: string){
  let arr = this.checkBoxObj[headerName];
  if(typeof arr === "undefined"){
      arr = [];
  }
  
  if(event.target.checked){
      arr.push(event.target.value);
      this.checkBoxObj[headerName] = arr;
  }
  else{
      var index = arr.indexOf(event.target.value);
      if (index > -1) {
          arr.splice(index, 1);
      }
      if(arr.length == 0){
          delete this.checkBoxObj[headerName];
      }
  }
  
}
// End Working on app/issue/2202

  backToPrevious(){
    this.router.navigate(['query-framework/queryByCategory']);
  }
// Working on app/issue/2348
  submitSearchRequest(){
    this.isDefaultRequest=false
    this.searchResult();
  }

  patchDateValue(date,fromControlName){
    console.log(fromControlName);
    console.log(date);
    this.queryFrameWork.patchValue({
      fromControlName: this.convert(date)
    })
    console.log(this.queryFrameWork);
    this.filterData();

  }

  convert(d) {
    var date = new Date(d);
   return new Date(date.setTime(date.getTime() + (6*60*60*1000)))
  }
  // End Working on app/issue/2348
}

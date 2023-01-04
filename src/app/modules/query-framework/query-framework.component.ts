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
//sbis-poc/app/issues/603
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { QueryFrameworkService } from './query-framework.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { from } from 'rxjs';
import { ToastService } from 'src/app/core/services/toast.service';
import { Table } from 'primeng/table';
import { BroadcastService } from 'src/app/core/services/broadcast.service';

@Component({
    selector: 'app-query-framework',
    templateUrl: './query-framework.component.html',
    styleUrls: ['./query-framework.component.css']
})
export class QueryFramworkComponent implements OnInit { 
    data: any;
    queryId: string;
    todate: Date = new Date();
    recordSet: any[];
    actionList: any[];
    tableColumns: any[];
    refineByColumnList: any[];
    queryFrameWork: FormGroup = new FormGroup({});
    minDate: Date[];
    onDaySelection: string[];// = "btn btn-dark";
    durationSelection: string[];// = "btn btn-light";
    @ViewChild(Table) dt: Table;
    dateFormat:any;
    checkBoxObj: any = {};
    title: any;
    isPaginator = false;
    panelVisible: boolean;
    // /sbis-poc/app/issues/1301
    isCustomeSelected: boolean = false;
    loading: boolean = false;

    exportDataSet: any[] = [];

    // @ViewChild('pTableId') pTableRef: Table;

    // ngAfterViewInit() {
    //     const table = this.pTableRef.el.nativeElement.querySelector('table');
    //     table.setAttribute('id', 'myTableId');
    // }

    constructor(private route: ActivatedRoute, private service: QueryFrameworkService,private translate: TranslateService, private fb:FormBuilder,
        private _toastService: ToastService, private broadcastService: BroadcastService, private router: Router){
        translate.setDefaultLang('en');
        translate.use('en');
    }
    
    
    backToPrevious(){
        this.router.navigate(['query-framework/queryByCategory']);
    }
    
    refinePanelhide() {
        this.panelVisible = false;
    }

    refinePanelDisplay(){
        this.panelVisible = !this.panelVisible;
    }

    camelize(str) {
        str = str.replace(/[,;.-/]/g, "");
        return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
          if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
          return index == 0 ? match.toLowerCase() : match.toUpperCase();
        });
    }

    fetchDecimalPoint(str: string, type: string):string{
        let format = Number(type.replace(")","").split(",")[1]);
        let num = Number(str);
        let resultStr = num.toFixed(format);
        return resultStr;
    }

    fetchDateFromTime(time: string): Date{
        let timeArr:string[] = time.split(":");
        let dateObj:Date = new Date();
        dateObj.setHours(Number(timeArr[0]));
        dateObj.setMinutes(Number(timeArr[1]));
        dateObj.setSeconds(Number(timeArr[2]));
        return dateObj;
    }

    ngOnInit(){
      this.loading = true;
      document.body.classList.add('hide-bodyscroll');
        this.dateFormat = environment.DATE_FORMAT;

        this.route.paramMap.subscribe((param: ParamMap) => {
            this.queryId = param['params'].queryId;

            ///sbis-poc/app/issues/1301
            let user = JSON.parse(localStorage.getItem('user'));
            // this.queryId = this.route.params['value'].queryId;
            this.service.fetchAllQueryResult(this.queryId, user.parentRoleName).subscribe(data => {
                this.data = data;
                this.tableColumns = this.data["resultColumnList"];
                this.title = this.data.title;
                this.recordSet = this.data["resultList"];//    fetch records from api
                if (this.recordSet.length > 15) this.isPaginator = true;
                else this.isPaginator = false;
                
                this.dt.reset();
                if(this.recordSet.length > 0){
                    this.actionList = this.recordSet[0].singleRecordAction
                }

                this.exportData();
    
                this.refineByColumnList = this.data["refineByColumnList"];
                this.onDaySelection = Array(this.refineByColumnList.length).fill("btn btn-dark");
                this.durationSelection = Array(this.refineByColumnList.length).fill("btn btn-light");
                this.minDate = Array(this.refineByColumnList.length).fill(new Date());
                let fromControll: any = {};
                for(let i:number=0; i < this.refineByColumnList.length; i++){
                    let formControlName:string = this.camelize(this.refineByColumnList[i]["columnHeading"]);
                    this.refineByColumnList[i]["formControlName"] = formControlName;
                    let columnType = this.refineByColumnList[i]["displayType"]
                    ///sbis-poc/app/issues/1301
                    if(columnType == "String" || columnType == "Datetime" || columnType == "Date"){
                        fromControll[formControlName] = [''];
                    } else if(columnType == "Checkbox"){
                        // checkbox control not created because it is handeled by other things
                        // let checkBoxDefaltValueArr = [];
                        // for(let j:number=0; j<this.refineByColumnList[i]["refineByValues"].length; j++){
                        //     checkBoxDefaltValueArr.push(false)
                        // }
                        fromControll[formControlName] = [];
                    }
                }
                this.queryFrameWork = this.fb.group(fromControll);
                this.loading = false;
                document.body.classList.remove('hide-bodyscroll');
            });
        })
    }

    exportData(){
       this.exportDataSet = [];

       this.recordSet.forEach(datas => {
            let obj = {};
            let singleRecordValues = datas.singleRecordValue;
            for(let i = 0; i < singleRecordValues.length; i++){
                let data = singleRecordValues[i];
                obj[this.getColumnNameByColumnNo(data.columnNo)] = data.value;
            }
            this.exportDataSet.push(obj);
        });
    }

    getColumnNameByColumnNo(colNo: number): string{
        let len = this.tableColumns.length;
        let columnName = null;
        for(let i = 0; i < len && columnName == null; i++){
            if(this.tableColumns[i].columnNo == colNo){
                columnName = this.tableColumns[i].columnHeading
            }
        }
        return columnName;
    }

   

    ///sbis-poc/app/issues/1301 start
    dateTimeToOnlyDate(dateAndTime:Date):Date{
        dateAndTime = new Date(dateAndTime.getFullYear(), dateAndTime.getMonth(), dateAndTime.getDate());
        return dateAndTime;
    }
    ///sbis-poc/app/issues/1301 end

    filterData(){
        // textbox filter start
        this.refinePanelhide();
        let filterObj = this.queryFrameWork.value;
        let keys:string[] = Object.keys(filterObj);
        let cloneSet = Object.assign([], this.data["resultList"]);
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
                                return arr[i]["columnNo"];
                            }
                        }
                        return -1;
                    };
                    let filterIndexByColumnNoFun = (arr, columnNo)=>{
                        for(var i = 0; i < arr.length; i++) {
                            let cn = arr[i]["columnNo"];
                            if(cn === columnNo) {
                                return i;
                            }
                        }
                        return -1;
                    };
                    let arr = obj["singleRecordValue"];
                    let columnNumber = filterColumnNoFun(this.refineByColumnList);
                    if(columnNumber != -1){
                        let index = filterIndexByColumnNoFun(arr, columnNumber)
                        ///sbis-poc/app/issues/1301 start
                        let filterStr = filterObj[key];
                        let columnType = this.refineByColumnList[i]["displayType"] // app#1363
                        if(key == "dateTime" || key == "date" || columnType == "Date" || columnType == "Datetime"){
                            let filterObj = filterStr;
                            let tableDate:Date = this.dateTimeToOnlyDate(new Date(arr[index]["value"]));
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
                                if (fromDateStr != null && fromDateStr != "" && (toDateStr == "" || toDateStr == null)){
                                    let fromDate:Date = this.dateTimeToOnlyDate(new Date(fromDateStr));
                                    this.minDate[columnIndex] = fromDate;
                                    return tableDate.getTime()>=fromDate.getTime();
                                }
                                else if ((fromDateStr == "" || fromDateStr == null) && toDateStr != null && toDateStr != ""){
                                    let toDate:Date = this.dateTimeToOnlyDate(new Date(toDateStr));
                                    return tableDate.getTime()<=toDate.getTime();
                                }
                                else {
                                    let fromDate:Date = this.dateTimeToOnlyDate(new Date(fromDateStr));
                                    let toDate:Date = this.dateTimeToOnlyDate(new Date(toDateStr));
                                    return tableDate.getTime()>=fromDate.getTime() && tableDate.getTime()<=toDate.getTime();
                                }
                            }
                            ///sbis-poc/app/issues/1301 end
                        } else if(key.endsWith("From")){
                            // date from
                            ///sbis-poc/app/issues/1301
                            let fromDate:Date = this.dateTimeToOnlyDate(new Date(filterStr));
                            let toDateFromControlName = key.replace("From", "To");
                            let toDate:Date = null
                            if(this.queryFrameWork.get(toDateFromControlName).value != ""){
                                toDate = this.queryFrameWork.get(toDateFromControlName).value;
                            }
                            
                            if(toDate == null || fromDate.getTime() == toDate.getTime()){
                                this.onDaySelection[columnIndex] = "btn btn-dark";
                                this.durationSelection[columnIndex] = "btn btn-light";
                            }
                            else{
                                this.onDaySelection[columnIndex] = "btn btn-light";
                                this.durationSelection[columnIndex] = "btn btn-dark";
                            }

                            this.minDate[columnIndex] = fromDate;
                            ///sbis-poc/app/issues/1301
                            let tableDate:Date = this.dateTimeToOnlyDate(new Date(arr[index]["value"]));

                            return tableDate.getTime()>=fromDate.getTime();
                        } else if(key.endsWith("To")){
                            // date to
                            ///sbis-poc/app/issues/1301
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
                            ///sbis-poc/app/issues/1301
                            let tableDate:Date = this.dateTimeToOnlyDate(new Date(arr[index]["value"]));


                            return tableDate.getTime()<=toDate.getTime();
                        } else{
                            // textbox
                            if(index!=-1 && arr[index]["value"].toLowerCase().includes(filterStr.toLowerCase())){
                                return true;
                            }
                        }
                        
                    }
                    ///sbis-poc/app/issues/1301
                    return false;
                });
            }
        } catch(err) {
            console.log("textbox>>>"+err);
        }
        
        // textbox filter end

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
                                return arr[i]["columnNo"];
                            }
                        }
                        return -1;
                    };
                    let filterIndexByColumnNoFun = (arr, columnNo)=>{
                        for(var i = 0; i < arr.length; i++) {
                            let cn = arr[i]["columnNo"];
                            if(cn === columnNo) {
                                return i;
                            }
                        }
                        return -1;
                    };
                    let arr = obj["singleRecordValue"];
                    let columnNumber = filterColumnNoFun(this.refineByColumnList);
                    if(columnNumber != -1){
                        let index = filterIndexByColumnNoFun(arr, columnNumber)
                        if(index!=-1 && valuesArr.includes(arr[index]["value"])){
                            return true;
                        }
                    }

                    return false;
                });
            }
        } catch(err){
            console.log("checkbox>>>"+err);
        }
        // checkbox filter end

        this.recordSet = cloneSet;
        this.exportData();
        if (this.recordSet.length > 15) this.isPaginator = true;
        else this.isPaginator = false;
        this.dt.reset();
    }
///sbis-poc/app/issues/1301 start
    isCustomDatePeriod(e, formControlName){
        if(e.value == null){
            this.queryFrameWork.removeControl(formControlName+"From");
            this.queryFrameWork.removeControl(formControlName+"To");
            this.isCustomeSelected = false;
            this.filterData();
        } else{
            let attrCode = e.value.attrValue;
            if(attrCode == 'CUSTOM'){
                this.queryFrameWork.addControl(formControlName+"From", this.fb.control(null));
                this.queryFrameWork.addControl(formControlName+"To", this.fb.control(null));
                this.isCustomeSelected = true;
            } else{
                this.isCustomeSelected = false;
                this.queryFrameWork.removeControl(formControlName+"From");
                this.queryFrameWork.removeControl(formControlName+"To");
                this.filterData();
            }
        }
    }
    ///sbis-poc/app/issues/1301 end

    resetAll(){
        this.queryFrameWork.reset();
        this.checkBoxObj = {};
        this.filterData();
    }

    resetSearchDate(indx){
        let formControlNameStartstr = this.camelize(this.refineByColumnList[indx]["columnHeading"]);
        this.queryFrameWork.get(formControlNameStartstr+"From").reset();
        this.queryFrameWork.get(formControlNameStartstr+"To").reset();
        this.filterData();
    }

    resetCheckBox(indx){
        let formControlNameStartstr = this.camelize(this.refineByColumnList[indx]["columnHeading"]);
        this.queryFrameWork.get(formControlNameStartstr).reset();
        this.checkBoxObj = {};
        this.filterData();
    }

    handleNotification(rowInd, index){
        let singleRecordValues = this.recordSet[rowInd]["singleRecordValue"];
        let dataArr:string[] = [];
        for(let i=0; i < singleRecordValues.length; i++){
            dataArr.push(singleRecordValues[i]["value"]);
        }
        let apiDataObj = {data:dataArr};
        
        apiDataObj["notificationEventTypeName"] = this.recordSet[rowInd]["singleRecordAction"][index]["notificationEventTypeName"];

        let columns:string[] = [];
        for(let i=0; i< this.tableColumns.length; i++){
            columns.push(this.tableColumns[i]["columnHeading"])
        }
        apiDataObj["columns"] = columns;

        console.log(apiDataObj);

        this.service.handleNotification(apiDataObj).subscribe(data => {
            console.log(data);
            this._toastService.showI18nToast("Successfully Notified.", "success");
        });
    }

    handleAction(rowInd, index){
        let singleRecordValues = this.recordSet[rowInd]["singleRecordValue"];
        let dataArr:string[] = [];
        for(let i=0; i < singleRecordValues.length; i++){
            dataArr.push(singleRecordValues[i]["value"]);
        }
        let apiDataObj = {data:dataArr};
        
        apiDataObj["api"] = this.recordSet[rowInd]["singleRecordAction"][index]["api"];
        
        let columns:string[] = [];
        for(let i=0; i< this.tableColumns.length; i++){
            columns.push(this.tableColumns[i]["columnHeading"])
        }
        apiDataObj["columns"] = columns;

        console.log(apiDataObj);

        this.service.handleAction(apiDataObj).subscribe(data => {
            console.log(data);
            this.ngOnInit();
        });
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
}

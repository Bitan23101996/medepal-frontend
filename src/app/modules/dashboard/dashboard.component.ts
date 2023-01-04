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
// import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { DashboardService } from './dashboard.service';
import { SBISConstants } from './../../SBISConstants';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardArr: any[] = [];//to store dashboard-widget data from rest
  widgetTypeConstObj: any = {
    text: SBISConstants.DASHBOARD_WIDGET_CONST.WIDGET_TYPE_TEXT,
    table: SBISConstants.DASHBOARD_WIDGET_CONST.WIDGET_TYPE_TABLE
  }

  constructor(
    private dashboardService: DashboardService
  ) {
    console.log("dashboard component..");

  }//end of constructor

  ngOnInit() {
    this.getDashboardWidgetList();
  }//end of oninit
  createjsonFromArrayBysliceMap(arr, startingindex, size): any {
    let retobj: any = {};
    arr.slice(startingindex, size).map((i, index) => {
      retobj[index] = i;
      // retobj = ob[index]; 
      return retobj;
    });
    return retobj;
  }//end of oninit

  getDashboardWidgetList() {
    let user = JSON.parse(localStorage.getItem('user'));
   // console.log(user);
   let req = {};//https://gitlab.com/sbis-poc/app/issues/853 --[dashboard issue]  
    this.dashboardService.getDashboardWidgetList(req).subscribe(res => {
      if (res.status == 2000) {
        let dashboardList: any = res.data;
        // console.log(dashboardList);
        this.dashboardArr = dashboardList;
        this.methodToModifyTilesArr();
      }
    }, err => {

    });
  }//end of method

  methodToModifyTilesArr() {
    this.dashboardArr.filter((el) => {
      let maxRowNo = Math.max.apply(Math, el.widgetDtos.map(function (o) { return o.rowNo; }));
      let rowsArr: any[] = [];
      el.widgetDtos.forEach(widgetArrel => {
        if (rowsArr.length == 0) {
          rowsArr.push({ rowNo: widgetArrel.rowNo, count: 1 });
        } else {
          let index = rowsArr.findIndex(x => x.rowNo === widgetArrel.rowNo);
          if (index != -1) {
            rowsArr[index].count = rowsArr[index].count + 1;
          } else {
            rowsArr.push({ rowNo: widgetArrel.rowNo, count: 1 });
          }
        }//end of else
      });
      el.widgetDtos.forEach((element) => {
        rowsArr.forEach((rowel, index) => {
          if (rowel.rowNo == element.rowNo) {
            if (element.columnWidth > 0) {
              element.colMdClass = 'col-md-' + element.columnWidth;
            } else {
              // element.colMdClass = 'col-md-' + 12 / rowel.count;
              let findcolmd = el.widgetDtos.find(fI => fI['columnWidth'] > 0);
              let customColWidth = 0;
              if (findcolmd) {
                if (rowel.rowNo == findcolmd.rowNo) {
                  customColWidth = 12 - findcolmd.columnWidth;
                  element.colMdClass = 'col-md-' + customColWidth / (rowel.count - 1);
                } else {
                  element.colMdClass = 'col-md-' + 12 / rowel.count;
                }
              } else {
                element.colMdClass = 'col-md-' + 12 / rowel.count;
              }
            }
          }
        });
      });
      el.widgetDtos.forEach(element => {
        if (element.widgetType != SBISConstants.DASHBOARD_WIDGET_CONST.WIDGET_TYPE_TEXT) {//'text'
          element.customCSSStyle = "dashboard-widget-custom-style";
        } else {
          if ((element.widgetType == SBISConstants.DASHBOARD_WIDGET_CONST.WIDGET_TYPE_TEXT) && (element.chartData.datasets.length == 1)) {
            element.customCSSStyle = "dashboard-widget-custom-style";
          } else {
            element.customCSSStyle = "";
          }
        }
      });
      // let findIndexOfDataSets = el.widgetDtos.findIndex(findEL => ((findEL.chartData.datasets.length > 1) && (findEL.widgetType == SBISConstants.DASHBOARD_WIDGET_CONST.WIDGET_TYPE_TEXT)));
      // let rownoforminheight: number;
      // if (findIndexOfDataSets != -1) {
      //   rownoforminheight = el.widgetDtos[findIndexOfDataSets].rowNo;
      //   el.widgetDtos[findIndexOfDataSets].customMinHeightStyleForCol = 200 / el.widgetDtos[findIndexOfDataSets].chartData.datasets.length + 'px';
      // }
      // el.widgetDtos.forEach(elForMinHeightset => {
      //   if(elForMinHeightset.rowNo == rownoforminheight){
      //     elForMinHeightset.customMinHeight = 'customHeightPerRow';
      //     elForMinHeightset.customcolMdnMnHeightStyle = elForMinHeightset.customCSSStyle + " "+ elForMinHeightset.customMinHeight;
      //   }else{
      //     elForMinHeightset.customcolMdnMnHeightStyle = elForMinHeightset.customCSSStyle;
      //   }
      // });

      // console.log(rowsArr);
      el.widgetDtos.forEach(element => {
        if (element.widgetType == SBISConstants.DASHBOARD_WIDGET_CONST.WIDGET_TYPE_TABLE && element.chartData.datasets.length>0) {
          var size = element.chartData.datasets[0].noOfCol;
          //console.log(element.chartData);
          let colNoArr: string[] = new Array(element.chartData.datasets[0].noOfCol);
          colNoArr.length = element.chartData.datasets[0].noOfCol ? element.chartData.datasets[0].noOfCol : 0;

          element.arrbyColNo = colNoArr;
          // console.log(colNoArr);
          let arr: any[] = [];
          let sliceStartingindex = 0;
          let noOfRow = element.chartData.datasets[0].data.length / colNoArr.length;
          for (let i = 0; i < noOfRow; i++) {
            let obj1 = {};
            obj1 = this.createjsonFromArrayBysliceMap(element.chartData.datasets[0].data, sliceStartingindex, sliceStartingindex + size);//0,size);
            arr.push({ key: obj1 });
            sliceStartingindex = sliceStartingindex + colNoArr.length;
          };
          // console.log(arr);
          element.colarr = arr;
        }
      });
      el.maxRow = maxRowNo;
      let rowArr: any[] = [];
      rowArr.length = maxRowNo;
      el.rowArray = rowArr;
    });
    console.log("this.dashboardArr::::", this.dashboardArr);

      let oldFeeValue = this.dashboardArr[0].widgetDtos[0].chartData.datasets[0].value.replace(/\n/g, '');
      //console.log(oldValue.split(".")[1].length);
      if(oldFeeValue.indexOf(".") != -1 && oldFeeValue.split(".")[1].length == 1){
        let newFeeValue = oldFeeValue+"0";
        this.dashboardArr[0].widgetDtos[0].chartData.datasets[0].value = newFeeValue;
      }


  }//end of method

}//end of class

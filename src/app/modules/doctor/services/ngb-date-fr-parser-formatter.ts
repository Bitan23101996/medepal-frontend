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

import { Injectable } from "@angular/core";
import { NgbDateParserFormatter, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { HttpClient } from "@angular/common/http";

function padNumber(value: number) {
    if (isNumber(value)) {
        return `0${value}`.slice(-2);
    } else {
        return "";
    }
}

function isNumber(value: any): boolean {
    return !isNaN(toInteger(value));
}

function toInteger(value: any): number {
    return parseInt(`${value}`, 10);
}


@Injectable()
export class NgbDateFRParserFormatter extends NgbDateParserFormatter {
    dateFormat: any;

    constructor(private http: HttpClient)
    {
        super();
        this.getvalue();
    }
    public getvalue() {
        this.http.get('./assets/dateConfig/dateConfig.json').subscribe(
          data => {
            this.dateFormat = data;
            console.log("YYY", this.dateFormat);
          }
        );
      }
    parse(value: string): NgbDateStruct {
        if (value) {
            const dateParts = value.trim().split('/');
            if (dateParts.length === 1 && isNumber(dateParts[0])) {
                return {day: null, month: null, year: toInteger(dateParts[0])  };
            } else if (dateParts.length === 2 && isNumber(dateParts[0]) && isNumber(dateParts[1])) {
                return {day: null, month: toInteger(dateParts[0]), year: toInteger(dateParts[1])  };
            } else if (dateParts.length === 3 && isNumber(dateParts[0]) && isNumber(dateParts[1]) && isNumber(dateParts[2])) {
                return {day: toInteger(dateParts[0]), month: toInteger(dateParts[1]), year: toInteger(dateParts[2]) };
            }
        }   
        return null;
    }

    format(date: NgbDateStruct): string {
        let stringDate: string = ""; 
        if(date) {
            if(this.dateFormat.DateConfig == 'dd/mm/yyyy')
            {
                stringDate += isNumber(date.day) ? padNumber(date.day) + "/" : "";
                stringDate += isNumber(date.month) ? padNumber(date.month) + "/" : "";
                stringDate += date.year;
            }

            if(this.dateFormat.DateConfig == 'yyyy/mm/dd')
            {
                stringDate += date.year + "/";
                stringDate += isNumber(date.month) ? padNumber(date.month) + "/" : "";
                stringDate += date.day ;
            }

            if(this.dateFormat.DateConfig == 'yyyy-mm-dd')
            {
                stringDate += date.year + "-";
                stringDate += isNumber(date.month) ? padNumber(date.month) + "-" : "";
                stringDate += date.day ;
            }

            if(this.dateFormat.DateConfig == 'dd-mm-yyyy')
            {
                stringDate += isNumber(date.day) ? padNumber(date.day) + "-" : "";
                stringDate += isNumber(date.month) ? padNumber(date.month) + "-" : "";
                stringDate += date.year;
            } 
        }
        return stringDate;
    }
}
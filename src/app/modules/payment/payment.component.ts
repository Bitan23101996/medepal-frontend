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

import { Component, OnInit, ElementRef, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { PaymentService } from './payment.service';


@Component({
    selector: 'app-payment',
    templateUrl: './payment.component.html',
    styleUrls: ['./payment.component.css']
})


export class PaymentComponent implements AfterViewInit, OnInit {

    @ViewChild('someVar') el:ElementRef;

    status:String = '';

    appointmentId: any = null;

    paymentMode: String = '';

    paytmRespObj: any = null;

    visibleSection:String = 'loader';

    paymentFor:any = null;

    constructor(private rd:Renderer2,private router: Router, private route:ActivatedRoute, private PaymentService:PaymentService) {
    }

    ngOnInit() {

        this.visibleSection = 'none';
        this.paypalPaytmPaymentHandling();
    }

    paypalPaytmPaymentHandling() {
        this.status = this.route.snapshot.queryParamMap.get("status");
        this.appointmentId = this.route.snapshot.queryParamMap.get("appointmentId") || 2;
        this.paymentMode = this.route.snapshot.queryParamMap.get("paymentMode");
       this.paymentFor = this.route.snapshot.queryParamMap.get("paymentFor");

       if(this.status || (this.appointmentId && this.paymentMode)) {

        
            switch (this.status.toString()) {
                case '2000':
                    this.visibleSection = 'success';
                    break;
                case '5014':
                    this.visibleSection = 'fail';
                    break;
                case 'payment':
                    this.visibleSection = 'payment';
                    break;
                default:
                    this.visibleSection = 'loader';
            }

            if(this.appointmentId && this.paymentMode){
                var paymentObj = {appointmentId: this.appointmentId, paymentMode: this.paymentMode};

                this.PaymentService.paymentInitiate(paymentObj).subscribe((resp: any)=>{
                    if(resp && resp.status == 2000){
                        if(this.paymentMode == 'PAYTM'){
                            this.paytmRespObj = resp.data;
                            console.log(this.paytmRespObj)
                        }
                    }
                })
            }
        }
    }


    ngAfterViewInit() {

        if (this.visibleSection == 'payment') {
            this.el.nativeElement.submit();
        }else if (this.visibleSection == 'success') {
            console.log(this.paymentFor);
            let routeUrL= this.paymentFor == 'APPOINTMENT' ? "/appoinment" : "/individual/my-order";
            this.router.navigate([routeUrL]);
            


        }else if (this.visibleSection == 'fail') {
            this.router.navigate(["/search"]);
        }

        if (this.visibleSection == 'fail') {
            //this.router.navigate(["/appoinment"]);
            let routeUrL= this.paymentFor == 'APPOINTMENT' ? "/appoinment" : "/individual/my-order";
            this.router.navigate([routeUrL]);
        }

    }

}

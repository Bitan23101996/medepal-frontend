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

import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'chart-component',
    templateUrl: './charts.component.html'
})

export class ChartsComponent implements OnInit {

    @Input() chartType: string
    @Input() data: any;
    barOptions: any;
    lineOptions: any;
    constructor() {
    }//end of constructor
    ngOnInit(): void {
        this.barOptions = {
            legend: {
                display: false
            },
            responsive: false,
            maintainAspectRatio: false,

            scales: {
                yAxes: [{
                    display: true,
                    barThickness: 2,
                    gridLines: {
                        display: true,
                        offsetGridLines: false,
                        drawBorder: true


                    },
                    ticks: {
                        beginAtZero: true,
                    }

                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                        offsetGridLines: false,
                        drawBorder: false
                    }
                }]
            }
        };//end of bar option
        this.lineOptions = {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        };//end of line options
    }//end of onInit


}//end of class
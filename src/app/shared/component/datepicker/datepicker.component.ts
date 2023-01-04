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

import { Component, Input, EventEmitter, Output, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validator } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  //styleUrls: ['./working-schedule.component.css']
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatepickerComponent),
      multi: true,
    }]

})



export class DatepickerComponent implements OnInit, ControlValueAccessor, Validator {
  @Output() valueChange:EventEmitter<string> = new EventEmitter<string>()

  @Input() position:string;
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() minMode: BsDatepickerViewMode;
  @Input() dateInputFormat: string;
  @Input() disabled: boolean;
  // Added for app#916
  @Input() readonly: boolean = false;
 
  private parseError: boolean=false;
  isMinModeOpen: boolean=false;
  selectedDate: Date;
  bsConfig: Partial<BsDatepickerConfig>;
  dateFormat="DD-MM-YYYY";

  constructor(){

  }

  ngOnInit(): void {
    this.dateFormat = environment.DATE_FORMAT;
  }

  public writeValue(obj: any) {
    if (typeof this.minMode !== 'undefined') {
      this.isMinModeOpen= true;
      this.bsConfig = Object.assign({}, {
        minMode : this.minMode,
        dateInputFormat: this.dateInputFormat? this.dateInputFormat: 'YYYY'
      });
    }else{
      this.isMinModeOpen= false;
    }
    
    if(!(obj===null || obj ==="") && !(obj instanceof Date)){
      this.selectedDate = new Date(obj);
     }else{
      this.selectedDate = obj;
     }

    this.updateControl();
  }

  update(event) {
    this.valueChange.emit(event);
    this.updateControl();
  }

  updateWithViewMode(eventDate){
    if(eventDate !=null){
      this.updateControl();
      this.valueChange.emit(eventDate);
    }
  }

  updateControl() {
    // if(!(this.selectedDate===null) && (this.selectedDate instanceof Date)){
    //   this.parseError=false;
    // }else{
    //   this.parseError=true;
    // }
    this.propagateChange(this.selectedDate);
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  public validate(c: FormControl) {
    // return (!this.parseError) ? null : {
    //   jsonParseError: {
    //     valid: false,
    //   },
    // };
    return null;
  }

  public registerOnTouched() { }

  private propagateChange = (_: any) => { };

  onKeydown($event) {
    if(($event.keyCode >= 65 && $event.keyCode <= 90) || ($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 106 && $event.keyCode <= 111) || ($event.keyCode >= 48 && $event.keyCode <= 57)) {
      return false;
    }
  }
}

/*
 import { Component, Input,OnInit, forwardRef, AfterViewInit, OnChanges, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter} from '@angular/core';
 import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl,ControlContainer,FormGroupDirective, FormsModule } from '@angular/forms';
 import { environment } from '../../../../environments/environment';
 import { BsDatepickerConfig, BsDatepickerViewMode } from 'ngx-bootstrap/datepicker';


 export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
     provide: NG_VALUE_ACCESSOR,
     useExisting: forwardRef(() => DatepickerComponent),
     multi: true,
	 
 };



@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  //styleUrls: ['./working-schedule.component.css']
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]

})



export class DatepickerComponent implements OnInit, ControlValueAccessor {
  @Input() formControlName: string;
  @Input() position:string;
  @Input() ngModel: any;
  @Input() maxDate: Date;
  @Input() minDate: Date;
  @Input() minMode: BsDatepickerViewMode;
  @Input() dateInputFormat: string;
  @Input() disabled: boolean;
  
  @Output() valueChange:EventEmitter<string> = new EventEmitter<string>()

  dateFormat: any;
  bsConfig: Partial<BsDatepickerConfig>;
  inputDate: Date;
  isMinModeOpen=false;
  
  update(date) {
    this.valueChange.emit(date);
  }

  ngOnInit(): void {
    if (typeof this.minMode !== 'undefined') {
      this.isMinModeOpen= true;
      this.bsConfig = Object.assign({}, {
        minMode : this.minMode,
        dateInputFormat: this.dateInputFormat? this.dateInputFormat: 'YYYY'
      });
    }else{
      this.isMinModeOpen= false;
    }
   if(!(this.ngModel ===null || this.ngModel ==="") && !(this.ngModel instanceof Date)){
    this.ngModel = new Date(this.ngModel);
   }

   console.log(this.formControlName)
  }

  updateWithViewMode(eventDate){
    if(eventDate !=null){
      this.valueChange.emit(eventDate);
    }
  }
  
  writeValue(value: any) {
  this.dateFormat = environment.DATE_FORMAT;

  this.inputDate= value;
  // this.maxDate = new Date();
  };

  propagateChange = (_: any) => {};


  registerOnChange(fn) {
	this.propagateChange = fn;
  };

  registerOnTouched = (_: any) => {};


	
} */
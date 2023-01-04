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

 import { Component, Input,OnInit, forwardRef, AfterViewInit, OnChanges, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter,ViewChildren} from '@angular/core';
 import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl,ControlContainer,FormGroupDirective, FormsModule,FormGroup, FormBuilder,Validators} from '@angular/forms';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';




 export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
     provide: NG_VALUE_ACCESSOR,
     useExisting: forwardRef(() => TelephoneComponent),
     multi: true
	 
 };



@Component({
  selector: 'app-telephone',
  templateUrl: './telephone.component.html',
  //styleUrls: ['./working-schedule.component.css']
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]

})




export class TelephoneComponent implements ControlValueAccessor  {
  @Input() formControlName: string;
  @Input() ngModel: string;
  @Input() disabled: boolean;
  @Output() onPhoneNumberChange = new EventEmitter<any>();
  
  
  update(phone) {
    this.onPhoneNumberChange.emit(phone);
	  if(phone!= null || phone!= undefined){
		//console.log(typeof phone);
		if(typeof phone == 'object'){
			phone.internationalNumber = phone.internationalNumber.replace(/ +/g, "");
		}
	}
  }
  
  //@ViewChildren('telComp') abc:NgModel;
  
  
  ngAfterViewInit(phone){
	  var list, index;
	list = document.getElementsByClassName("custom");
	for (index = 0; index < list.length; ++index) {
		list[index].setAttribute("placeholder","Mobile Number");
	}
	  //document.getElementsByClassName("custom").setAttribute("placeholder","Mobile Number");
   }
  
 
  
  writeValue(phoneNumber: any) {
	
  };

  propagateChange = (_: any) => {};


  registerOnChange(fn) {
	this.propagateChange = fn;
  };

  registerOnTouched = (_: any) => {};


	
}
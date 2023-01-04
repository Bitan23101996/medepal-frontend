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

import { Component, Input,OnInit, forwardRef, AfterViewInit, OnChanges, ViewEncapsulation, ViewChild, ElementRef, Output, EventEmitter, HostListener} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl,ControlContainer,FormGroupDirective, FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';
 

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextareaComponent),
    multi: true,
};

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})

export class TextareaComponent implements OnInit,ControlValueAccessor,OnChanges{
  notAllowed:boolean;
  key:any;
  @Input() formControlName: string;
  @Input() ngModel: any;
  @Input() placeholder: string;
  @Output() valueChange:EventEmitter<string> = new EventEmitter<string>()

  txtForm: FormGroup = this.fb.group({
    briefresume: ['', Validators.required]
  });
  
  
  constructor(private fb: FormBuilder){	
  }
  
  @HostListener('document:click', ['$event.target'])
  onClick(btn:any) {
    if(btn.id == "save"){
      let encodeVal = this.txtForm.controls.briefresume.value;
      encodeVal = encodeVal.replace(/</g, "&lt;").replace(/'/g, "&apos;");
      
      //console.log(this.txtForm.controls.briefresume.value);
      this.valueChange.emit(encodeVal);
      this.txtForm.controls.briefresume.setValue(encodeVal);
    }
  }

  ngOnInit(): void {
    // Rectify null pointer issue - app#855
    var readOntyTxt = document.getElementById('non-editable-value') == null? "":
        document.getElementById('non-editable-value').textContent;
	  
	  if(readOntyTxt != "" && readOntyTxt != null && readOntyTxt != undefined){
		  this.txtForm.controls.briefresume.setValue(readOntyTxt);
	  }else{
		  readOntyTxt == ""
	  }
  }
  
  ngOnChanges(): void {
  }
  
  writeValue(value: any) {
  };

  propagateChange = (_: any) => {};
  registerOnChange(fn) {
	this.propagateChange = fn;
  };

  registerOnTouched = (_: any) => {};
}
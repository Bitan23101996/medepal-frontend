import { Component, OnInit, EventEmitter, Output, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl,ControlContainer,FormGroupDirective, FormsModule,FormGroup, FormBuilder,Validators} from '@angular/forms';
import { SBISConstants } from '../../../SBISConstants';


export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NameComponent),
  multi: true

};


@Component({
  selector: 'app-name',
  templateUrl: './name.component.html',
  // styleUrls: ['./name.component.css']
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective
    }
  ]
})
export class NameComponent implements ControlValueAccessor {

  writeValue(obj: any): void {
    //throw new Error("Method not implemented.");
  }
  registerOnChange(fn: any): void {
    //throw new Error("Method not implemented.");
  }
  registerOnTouched(fn: any): void {
    //throw new Error("Method not implemented.");
  }
  setDisabledState?(isDisabled: boolean): void {
    //throw new Error("Method not implemented.");
  } 

  constructor() { }

  @Input() formControlName: string;
  @Input() ngModel: string;
  @Input() placeholder: string;
  @Input() required: any;
  @Input() autofocus: any;
  @Input() preventType: any;
  @Input() readonly: boolean;
  @Input() disabled: boolean;
  @Output() onNameChange = new EventEmitter<any>();

  update(name) {
    this.onNameChange.emit(name);
	  if(name!= null || name!= undefined){
	  }
  }

  onKeydown($event) {
    if($event.key == ' ') {
      return true;
    }
    if(this.preventType == "all") {
      if(($event.keyCode >= 48 && $event.keyCode <= 57) || ($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 96 && $event.keyCode <= 111)) {
        return false;
      }
    }
    if(this.preventType == "onlyNumaric") {
      if(($event.key == "!" || $event.key == "@" || $event.key == "#" || $event.key == "$" || $event.key == "%" || $event.key == "^" || $event.key == "&" || $event.key == "*" || $event.key == "(" || $event.key == ")") ||($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 106 && $event.keyCode <= 111)) {
        return false;
      }
    }
    if(this.preventType == "none") {
      return true;
    }
  }

}

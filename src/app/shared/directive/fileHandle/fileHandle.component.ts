import { Component, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS, FormControl, Validator } from '@angular/forms';

@Component({
  selector: 'file-handle',
  templateUrl: './fileHandle.component.html',
  styleUrls: ['./fileHandle.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileHandleComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileHandleComponent),
      multi: true,
    }]
})
export class FileHandleComponent implements ControlValueAccessor, Validator {

  @Input('multiple') multiple: false;
  @Input('remove') remove: false;

  @Output() onUpload = new EventEmitter();

  fileId = 'singleFile' + Math.floor((Math.random() * 1000) + 1);
  singleFile = {
    id: "",
    documentDescription: "",
    fileName: "",
    file: File
  }

  multipleFil = [];

  private parseError: boolean;

  public writeValue(obj: any) {
    console.log("WRITE VALUE::",obj);
    
    if (this.multiple) {
      this.multipleFil = [];
      if (obj && (obj instanceof Array)) {
        obj.forEach(item => {
          if (obj && (typeof item.documentRoleMapPk != "undefined")) {
          item["id"] = item.documentRoleMapPk ;
          }else{
            item["id"] ='multipleFile'+ Math.floor((Math.random() * 10000) + 1); 
          }console.log("PER ITEM::",item);
         
            item["editMode"]=item.uploaded;
          this.multipleFil.push(item);
        })
        if(this.multipleFil.length==0){
          this.addMultipleFile();
        }
      }
    } else {
      this.singleFile.id = this.fileId;
      if (obj && (typeof obj.patientName != "undefined")) {

        this.singleFile.documentDescription = obj.patientName;
        if ((typeof obj.fileName != "undefined")) {
          this.singleFile.fileName = obj.fileName;
        }
      }
    }

    this.updateSingleControl();
  }

  public registerOnChange(fn: any) {
    this.propagateChange = fn;
  }

  upload(item){
    console.log("ITEM:::",item);
    
    this.onUpload.emit(item);
  }

  public validate(c: FormControl) {
    return (!this.parseError) ? null : {
      jsonParseError: {
        valid: false,
      },
    };
  }

  public registerOnTouched() { }

  updateSingleControl() {
    this.validateSingleUpload();
    this.propagateChange(this.singleFile);
  }

  updateMultipleControl() {
    this.validateMultipleUpload();
    this.propagateChange(this.multipleFil);
  }

  validateMultipleUpload() {
    let filterOb = this.multipleFil.filter(x => x["documentDescription"] == "" || x["fileName"] == "")[0];
    if (filterOb) {
      this.parseError = true;
    } else {
      this.parseError = false;
    }
  }

  validateSingleUpload() {

    if (this.singleFile.documentDescription == "" || this.singleFile.fileName == "") {
      this.parseError = true;
    } else {
      this.parseError = false;
    }
  }

  closeSingleFile() {
    this.singleFile.fileName = "";
    document.getElementById(this.singleFile.id)["value"] = "";
    this.updateSingleControl();
  }

  closeMultipleFile(item) {
    item.fileName = "";
    document.getElementById(item.id)["value"] = "";
    this.updateMultipleControl();
  }

  onChangeSingleFile(event) {
    try {
      this.singleFile.documentDescription = event.target.value;
    } catch (ex) {
      this.parseError = true;
    }

    this.updateSingleControl();
  }

  onChangeMultipleFile(event, item) {
    try {
      item.documentDescription = event.target.value;
    } catch (ex) {
      this.parseError = true;
    }

    this.updateMultipleControl();
  }

  selectSingleFile(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.singleFile.fileName = file.name;
      this.singleFile.file = file;

      this.updateSingleControl();
    }
  }

  deleteMultipleFile(index) {
    this.multipleFil.splice(index, 1);
    if(this.multipleFil.length==0){
      this.addMultipleFile();
    }
    this.updateMultipleControl();
  }

  addMultipleFile() {
    let itemObj = {
      documentDescription: "",
      documentType:"",
      fileName: "",
      id: 'multipleFile'+ Math.floor((Math.random() * 10000) + 1),
      documentNumber:"",
      printInInvoice:true
    }

    this.multipleFil.push(itemObj);
  }

  selectMultipleFile(event: any, item) {
    const file = event.target.files[0];
    if (file) {
      item.fileName = file.name;
      item["file"] = file;

      this.updateMultipleControl();
    }
  }

  private propagateChange = (_: any) => { };

  changeValue(fieldName,item,event){
    console.log("EVENT::",event);
    if(event.target.type=="checkbox"){
      item[fieldName]=event.target.checked
    }
    else{
      item[fieldName]=event.target.value;
    }
    console.log("item::",item);
  }


  editDocument(item,i){
    item["editMode"]=false;
  }
  cancelDocument(item,i){
    item["editMode"]=true;
  }
}

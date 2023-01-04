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

import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { DoctorService } from 'src/app/modules/doctor/doctor.service';
import { GetSet } from 'src/app/core/utils/getSet';
import { ToastService } from '../../../core/services/toast.service';
import { SBISConstants } from 'src/app/SBISConstants';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { HttpRequest, HttpClient, HttpResponse,HttpEventType } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';//show downloaded image
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-procedure',
  templateUrl: './procedure.component.html',
  styleUrls: ['./procedure.component.css']
})
export class ProcedureComponent implements OnInit , OnChanges{ 

  @Input('fromSidebar') fromSidebar: boolean;
  @Input('admissionRefNo') admissionRefNo: any;
  @Input('selectedProcedureFromSideBar') selectedProcedureFromSideBar: any;
  @Output() procedureSavedFromSidebar = new EventEmitter();
  procedureInputFile: ElementRef;//to clear input file
  disableTiming: boolean = false;//for disable time
  fromTime: any;
  toTime: any;
  startTimingErrorFlag: boolean = false;
  endTimingErrorFlag: boolean = false;
  procedureForm: FormGroup;
  assintants: FormArray;
  previousDrewImage: any = {};
  procedureNoteRefNo: any = {};
  prescriptionForm: any;
  canvasDetailsFromProcedure: any = {};
  procedureImages: any[] = [];
  patientDetails: any = {};
  doctorDetails: any = {};
  patientNameAndAgeToDisplay: string;
  assistanceDropdownValue: any[] = [];
  show_canvas_paint: boolean = true;
  hospitalList; any;//to get hospital name list by search
  domSanitizer: any;//to show image
  procedureSelectFiles: any = [];//to store selected file
  isEdit: boolean = false;//to control edit or view
  downloadedCanvasImgShow: boolean = false;//to show downloaded image
  startTimeDisplay: string = "";
  endTimeDisplay: string = "";
  uploadedDocFileList: any[] = [];//to store uploaded file
  fileSelected: boolean = false;
  constructor(
    private broadcastService: BroadcastService, private _location: Location, private formBuilder: FormBuilder, private doctorService: DoctorService,
    private toastService: ToastService, private http: HttpClient, private _domSanitizer: DomSanitizer, private router: Router, private route: ActivatedRoute
  ) {
    this.buildForm();
    let doctor = JSON.parse(localStorage.getItem('user'));
    let patient = GetSet.getPatientDetails();
    this.patientDetails = JSON.parse(patient);
    if(this.patientDetails){
      this.patientNameAndAgeToDisplay = this.patientDetails.name + " (" + this.patientDetails.age + "/" + this.patientDetails.gender + ")";
      this.doctorDetails = doctor;
      this.canvasDetailsFromProcedure["fromProcedure"] = true;
      this.canvasDetailsFromProcedure["doctorRefNo"] = doctor.refNo;
      this.canvasDetailsFromProcedure["userRefNo"] = this.patientDetails.ref_no;
    }
    this.procedureImages.length = 1;
    this.domSanitizer = _domSanitizer;
  }//end of constructor

  ngOnInit(): void {
    this.fileSelected = false;
    this.broadcastService.setHeaderText('Create Procedure Note');
    if(this.admissionRefNo==null){
      this.admissionRefNo=GetSet.getAdmissionRefNo();
    }
    if(this.fromSidebar)
      this.show_canvas_paint = false; 
    else
      this.getProcedureAssistantsValues();
    this.getRouteParam();
    // this.downloadImage("PI0466329669");//download image
  }//end of oninit

  getRouteParam() {//method to get route param
    this.procedureNoteRefNo = (this.route.params['value'].procedureRefNo) ? this.route.params['value'].procedureRefNo : '';//subscribe(params =>{params['procedureRefNo']});
    if (this.procedureNoteRefNo)
      this.getProcedureNotesData();
    else
      this.isEdit = true;
  }

  ngOnChanges(changes: import("@angular/core").SimpleChanges): void {
    if(this.fromSidebar && this.selectedProcedureFromSideBar && this.selectedProcedureFromSideBar.procedureRefNo){
      this.procedureNoteRefNo = this.selectedProcedureFromSideBar.procedureRefNo;
      this.setFormData(this.selectedProcedureFromSideBar);
    }
  }//end of on changes
   
  //method to get assistants values
  getProcedureAssistantsValues() {
    this.doctorService.getAssistantsValues({ q: SBISConstants.MASTER_DATA.ASSISTANTS }).subscribe((res) => {
      if (res.status == 2000) {
        this.assistanceDropdownValue = res.data;
      }
    });
  }//end of method 

  //method to downlad file
  download = {
    downloadImageSrc: "",
    contentType: "",
    doctorName: "",
    forUserName: ""
  };

  downloadImage(procedureImageRefNo, isDocDownload: boolean, docDetails: any) {
    let query = {
      'downloadFor': SBISConstants.IMAGE_UPLOAD_CONST.PROCEDURE_IMAGE,
      'procedureImageRefNo': procedureImageRefNo
    }
    this.doctorService.downloadDocument(query).subscribe((result) => {
      if (result.status != 2000) {
        return;
      }
      let imgSrc = "data:" + ";base64," + result.data.data;
      if (isDocDownload) {
        const link = document.createElement('a');
        link.href = "data:" + ";base64," + result.data.data;
        link.download = docDetails.fileName;//this.download.forUserName.replace(/\./g, '_') + "_" + this.download.doctorName.replace(/\./g, '_');
        link.click();
      } else {
        this.download.downloadImageSrc = imgSrc;
        this.procedureSelectFiles.push({ filetype: "canvas", file: this.download.downloadImageSrc });
        this.downloadedCanvasImgShow = true;
      }
    });
  }//end of method

  buildForm() {//method to build form        
    this.procedureForm = this.formBuilder.group({
      procedureName: new FormControl(),
      hospitalName: new FormControl(),
      date: new FormControl(),
      startTime: new FormControl(),
      endTime: new FormControl(),
      note: new FormControl(),
      assintants: this.formBuilder.array([this.createAssistants()]),
    });
  }//end of method

  createAssistants(): FormGroup {//to 
    return this.formBuilder.group({
      id: null,
      name: '',
      role: ''
    });
  }//end of method

  addImages() {
    this.procedureImages.push(this.procedureImages.length + 1);
  }

  addItem(): void {
    this.assintants = this.procedureForm.get('assintants') as FormArray;
    this.assintants.push(this.createAssistants());
  }

  timeValidate(label, time) {
    this.endTimingErrorFlag = false;
    this.startTimingErrorFlag = false;
    let startTime: any;
    let endTime: any;
    let startTimeM: any;
    let endTimeM: any;
    if (label == 'stTime') {
      endTime = this.procedureForm.controls["endTime"].value;
      if (endTime != null || endTime != "" || isNaN(endTime)) {
        startTimeM = parseInt(time.split(':')[1]);
        endTimeM = parseInt(endTime.split(':')[1]);
        startTime = parseInt(time.split(':')[0]);
        endTime = parseInt(endTime.split(':')[0]);

        if (startTime > endTime) {
          this.startTimingErrorFlag = true;
          this.procedureForm.controls["startTime"].patchValue("");
        }
        else {
          if (startTime == endTime) {
            if (startTimeM >= endTimeM) {
              this.startTimingErrorFlag = true;
              this.procedureForm.controls["startTime"].patchValue("");
            }
            else {
              this.startTimingErrorFlag = false;
              this.endTimingErrorFlag = false;
            }
          }
          else {
            this.startTimingErrorFlag = false;
            this.endTimingErrorFlag = false;
          }

        }
      }
    }
    if (label == 'ndTime') {
      endTime = time;
      startTime = this.procedureForm.controls["startTime"].value;
      if (startTime != null || startTime != "" || isNaN(startTime)) {
        endTimeM = parseInt(time.split(':')[1]);
        startTimeM = parseInt(startTime.split(':')[1]);
        endTime = parseInt(time.split(':')[0]);
        startTime = parseInt(startTime.split(':')[0]);
        if (startTime > endTime) {
          this.endTimingErrorFlag = true;
          this.procedureForm.controls["endTime"].patchValue("");
        }
        else {
          if (startTime == endTime) {
            if (startTimeM >= endTimeM) {
              this.endTimingErrorFlag = true;
              this.procedureForm.controls["endTime"].patchValue("");
            }
            else {
              this.endTimingErrorFlag = false;
              this.startTimingErrorFlag = false;
            }
          }
          else {
            this.endTimingErrorFlag = false;
            this.startTimingErrorFlag = false;
          }
        }
      }
    }
  }
  showValidationError:boolean=false;// Working on app/issue/2299
  //method to save procedure notes
  saveProcedureNotes() {
    // Working on app/issue/2299
    if (this.procedureForm.controls['note'].value==null && this.fromSidebar){ 
      this.showValidationError=true;     
      return false;
    }else{
      this.showValidationError=false;     
    }
    // End Working on app/issue/2299
    let procedureNotes: any =  this.constructProcedureSubmitDataAccordingToConditions();  
    let flag:boolean=false;
    if(procedureNotes.procedureLocation) flag=true
    else if(this.admissionRefNo) flag=true
    else flag=false 

    if (procedureNotes.procedureName && flag && procedureNotes.procedureDate) {
      this.doctorService.saveAndUpdateProcedureNotes(procedureNotes).subscribe(res => {
        if (res.status == 2000) 
         this.afterProcedureSubmission(res);        
      });
    } else 
      this.toastService.showI18nToast("Please fill mandatory fields", 'error');    
  }//end of method

  //method to construct a json for procedure submit according to conditions
  constructProcedureSubmitDataAccordingToConditions(): any {
    let procedureNotesObj: any = {};
    if(this.fromSidebar){
      procedureNotesObj["procedureName"]= "IPD PROCEDURE";
      procedureNotesObj["procedureDate"]= new Date();
      procedureNotesObj["procedureStartTime"]= null;
      procedureNotesObj["procedureEndTime"]= null;
      procedureNotesObj["procedureLocation"]= "IPD";//
      procedureNotesObj["doctorName"]= null;
      procedureNotesObj["doctorRefNo"]= null;
      procedureNotesObj["noteType"]= SBISConstants.PROCEDURE_CONST.PROCEDURE_IPD_CONST;
      procedureNotesObj["forAddingNewAssistant"] = false;
      procedureNotesObj["admissionRefNo"] = this.admissionRefNo; 
      if(this.selectedProcedureFromSideBar && this.selectedProcedureFromSideBar.procedureRefNo)
        procedureNotesObj["procedureRefNo"] = this.selectedProcedureFromSideBar.procedureRefNo;
    }else{
      let assistants = this.procedureForm.get('assintants') as FormArray;
      let assistantList: any[] = [];
      if (assistants.length > 0) {
        assistants.controls.forEach(assistant => {
          assistantList.push({ procedureAssistantRefNo: ((assistant['controls']['id'].value) ? assistant['controls']['id'].value : null), name: assistant['controls']['name'].value, role: assistant['controls']['role'].value });
        });
      }
      procedureNotesObj["procedureName"]= this.procedureForm.controls["procedureName"].value;
      procedureNotesObj["procedureStartTime"]= (this.procedureForm.controls["startTime"].value) ? this.procedureForm.controls["startTime"].value : null;// + ":00",
      procedureNotesObj["procedureEndTime"]= (this.procedureForm.controls["endTime"].value) ? this.procedureForm.controls["endTime"].value : null;// + ":00",
      procedureNotesObj["procedureLocation"]= this.procedureForm.controls["hospitalName"].value;
      procedureNotesObj["procedureDate"]= (this.procedureForm.controls["date"].value) ? this.procedureForm.controls["date"].value : null;
      procedureNotesObj["doctorName"]= this.doctorDetails.firstName;
      procedureNotesObj["doctorRefNo"]= this.doctorDetails.refNo;
      procedureNotesObj["noteType"]= SBISConstants.PROCEDURE_CONST.PROCEDURE_NOTE_CONST;
      if(this.admissionRefNo!=null){
        procedureNotesObj["admissionRefNo"] = this.admissionRefNo; 
      }
      if (procedureNotesObj.procedureStartTime && procedureNotesObj.procedureEndTime) {
        procedureNotesObj.procedureStartTime = (procedureNotesObj.procedureStartTime.length == "8") ? procedureNotesObj.procedureStartTime : procedureNotesObj.procedureStartTime + ":00";
        procedureNotesObj.procedureEndTime = (procedureNotesObj.procedureEndTime.length == "8") ? procedureNotesObj.procedureEndTime : procedureNotesObj.procedureEndTime + ":00";
      }
      
      if (assistantList.length > 0 && assistantList[0].name && assistantList[0].role) {
        procedureNotesObj["assistant"] = assistantList;
      }      
      procedureNotesObj["forAddingNewAssistant"] = true;  
      if (this.previousProcedureDetails) {
        if (this.previousProcedureDetails.procedureName != procedureNotesObj.procedureName ||
          this.previousProcedureDetails.procedureLocation != procedureNotesObj.procedureLocation ||
          // this.previousProcedureDetails.procedureDate != procedureNotes.procedureDate ||
          this.previousProcedureDetails.procedureStartTime != procedureNotesObj.procedureStartTime ||
          this.previousProcedureDetails.procedureEndTime != procedureNotesObj.procedureEndTime ||
          this.previousProcedureDetails.notes != procedureNotesObj.notes) {
            procedureNotesObj["forAddingNewAssistant"] = false;
          }
        }
      }//end of sidebar check
      
      procedureNotesObj["procedureCode"]= null;
      procedureNotesObj["notes"]= (this.procedureForm.controls["note"].value) ? this.procedureForm.controls["note"].value : null;
      procedureNotesObj["userRefNo"]= this.patientDetails.ref_no;
      if (this.previousProcedureDetails && this.previousProcedureDetails.procedureRefNo) {
        procedureNotesObj["procedureRefNo"] = this.previousProcedureDetails.procedureRefNo;
      }

      return procedureNotesObj;
    }//end of method

    //method to do some thing after procedure done
    afterProcedureSubmission(res){
      let procedureFilesUploadIndex: number = 0;
      this.procedureSelectFiles.forEach((images,index) => {
        let procedureRefNo = (this.previousProcedureDetails && this.previousProcedureDetails.procedureRefNo) ? this.previousProcedureDetails.procedureRefNo : res.data;
        this.uploadImageByProcedureReferenceNo(images, procedureRefNo);
        procedureFilesUploadIndex = index;
      });
      this.toastService.showI18nToast("Procedure saved successfully", 'success');
      this.procedureForm.reset();
      if(document.getElementById('chooseFileVal'+0) && document.getElementById('chooseFileVal'+0).innerHTML)
        document.getElementById('chooseFileVal'+0).innerHTML = '<i class="fa fa-upload" style="font-size:12px;" aria-hidden="true"></i>&nbsp;&nbsp;'+'Choose a file';
      
      this.fileSelected = false;
      this.buildForm();//build form
      //this.procedureInputFile.nativeElement.value = "";
      this.procedureImages = [];
      this.procedureImages.length = 1;
      if(this.fromSidebar){
        (this.procedureSelectFiles.length>0)?
          ((procedureFilesUploadIndex+1) ==  this.procedureSelectFiles.length)? this.procedureSavedFromSidebar.emit("Saved"): null
          :this.procedureSavedFromSidebar.emit("Saved");
          this.uploadedDocFileList = [];
      }else{
        if(this.admissionRefNo==null){
          this.show_canvas_paint = true;
          this.router.navigate(['searchProcedureByDoctor']);
        }
        else{
          this.router.navigate(['opd/inpatient-summary']);
        }
        
      }
      this.procedureSelectFiles = [];
    }//end of method
    
  getHospitalList(event) {
    this.doctorService.getHospitalListByCategoryV2('H', event.query).subscribe((data) => {
      this.hospitalList = data;
    });
  }//end of method

  populateHospitalAddress(chamberType) {
    this.procedureForm.patchValue({
      hospitalName: chamberType.hospitalName
    });
  }//end of method  

  previousProcedureDetails: any = {};
  getProcedureNotesData() {//method to get procedure data    
    let path = this.procedureNoteRefNo;
    this.doctorService.getProcedureNotes(path).subscribe(res => {
      if (res.status == 2000) {
        let lastIndex = (res.data.length - 1);
        this.previousProcedureDetails = res.data[lastIndex];
        (res.data[lastIndex]) ? this.setFormData(res.data[lastIndex]) : null;
      }
    });
  }//end of method

  convertTimeToDisplay(startTime, endTime) {
    let sT = startTime.substring(3, 5);
    let eT = endTime.substring(3, 5);

    let stSub = startTime.substring(0, 2);
    let etSub = endTime.substring(0, 2);

    this.startTimeDisplay = (((+stSub) > 12) ? ((+stSub) - 12) : stSub) + ":" + sT + (((+stSub) > 12) ? " PM" : " AM");
    this.endTimeDisplay = (((+etSub) > 12) ? ((+etSub) - 12) : etSub) + ":" + eT + (((+etSub) > 12) ? " PM" : " AM");
  }
  setFormData(res) {
    this.procedureForm.controls["procedureName"].setValue(res.procedureName);
    this.procedureForm.controls["startTime"].setValue(res.procedureStartTime);
    this.procedureForm.controls["endTime"].setValue(res.procedureEndTime);
    this.procedureForm.controls["hospitalName"].setValue(res.procedureLocation);
    this.procedureForm.controls["date"].setValue(res.procedureDate);
    this.procedureForm.controls["note"].setValue(res.notes);
    if (res.procedureStartTime || res.procedureEndTime)
      this.convertTimeToDisplay(res.procedureStartTime, res.procedureEndTime);
    let assistants = this.procedureForm.get('assintants') as FormArray;
    if (res.assistant.length > 0) {
      assistants.removeAt(0);
      res.assistant.forEach(element => {
        assistants.push(this.addPreviousAssistants(element));
      });
    }
    this.show_canvas_paint = false;
    if (res.procedureUploadDtoList.length > 0) {
      let findIndex = res.procedureUploadDtoList.findIndex(selectedFile => selectedFile.canvasImage == 'Y');
      if (findIndex != -1) {
        this.downloadImage(res.procedureUploadDtoList[findIndex].procedureUploadRefNo, false, null);
      }
      this.uploadedDocFileList = res.procedureUploadDtoList.filter(selectedFile => selectedFile.canvasImage == 'N');
    }
  }//end of method

  addPreviousAssistants(element): FormGroup {//to 
    return this.formBuilder.group({
      name: element.name,
      role: element.role,
      id: element.procedureAssistantRefNo
    });
  }//end of method

  //method to get prescriptionRefNo by event emiter --susmita
  getCanvasData(imagesFromCanvas) {
    this.downloadedCanvasImgShow = false;
    // console.log("susmita-->>canvasJson result by event emiter::",canvasJson);
    if (imagesFromCanvas) {
      let findIndex = this.procedureSelectFiles.findIndex(selectedFile => selectedFile.filetype == 'canvas');
      if (findIndex != -1)
        this.procedureSelectFiles[findIndex].file = imagesFromCanvas.canvasImg;
      else
        this.procedureSelectFiles.push({ filetype: "canvas", file: imagesFromCanvas.canvasImg });
      this.show_canvas_paint = false;
    } else
      this.show_canvas_paint = true;
  }//end of method

  //method to upload document by prescription reference number
  uploadImageByProcedureReferenceNo(imageToUpload: any, procedureRefNo) {
    //base64 image to blob    
    //end of base64 image to blob
    let formdata = new FormData();
    let procedureFileUpload = JSON.stringify({
      "originalFileName": procedureRefNo + ".img",
      "procedureRefNo": procedureRefNo,
      "canvasImage": (imageToUpload.filetype == 'canvas') ? 'Y' : 'N',
      "fileUploadFor": SBISConstants.IMAGE_UPLOAD_CONST.PROCEDURE_IMAGE,//"PROCEDURE_IMAGE",
      "documentType": 'image/jpg'
    });
    if (imageToUpload.filetype == "upload") {
      formdata.append('file', imageToUpload.file);
    } else {
      var myFile: File = this.dataURItoBlob(imageToUpload.file);
      formdata.append('file', myFile);
    }
    formdata.append('document', procedureFileUpload);
    this.saveDocument(formdata).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        // This is an upload progress event. Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        if(document.getElementById('fileNames') != null){
          document.getElementById('fileNames').innerHTML = "Uploading...";
          console.log(percentDone);
        }

      }else if (event instanceof HttpResponse) {
        if(document.getElementById('fileNames') != null){
          document.getElementById('fileNames').classList.add('progress-complete');
          document.getElementById('fileNames').innerHTML = "Upload Complete";
        }

        let response = JSON.parse(event.body);
        if (response.status != 2000)
          this.toastService.showI18nToast("Sorry couldn't upload the files.", "warning");        
      }
    });//end of save document
  }//end of method

  //base64 to blob
  dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return <File>(new Blob ([new Uint8Array(array)]));
  }//end of method

  //to save canvas 
  saveDocument(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {
      responseType: 'text',
      reportProgress: true
    });
    return this.http.request(req);
  }

  //method to select file
  fileSelect(event) {//to store selected files
    let file = event.target.files[0];
    this.procedureSelectFiles.push({ filetype: "upload", file: file });

    if(this.fromSidebar){
      let filePath = event.target.value;
      let filename = event.target.value.substring(filePath.lastIndexOf('/')+1);
      //console.log(filename);
      //document.getElementById('chooseFileVal').innerHTML = event.target.value.split(/(\\|\/)/g).pop();
      if(filename){
        //this.fileSelected = true;
        //console.log('chooseFileVal'+(this.procedureImages.length-1));
        //let targetFile = event.target.getAttribute('id');
        //console.log(targetFile);
        event.target.nextElementSibling.innerHTML = event.target.files[0].name;
      }
    }


  }








  back() {//back button click
    this._location.back();
    // this.router.navigate(['searchPatientByDoctor']);
    // this.router.navigate(['searchPatientByDoctor/patientDetailForDoctor',{refno: this.patientDetails.ref_no}]);
  }

  //method to edit canvas file
  editImage(canvasImg) {
    this.previousDrewImage['url'] = canvasImg.file;
    this.show_canvas_paint = true;
  }//end of method

  //method to delete assistant
  deleteAssistant(index) {
    let assistants = this.procedureForm.get('assintants') as FormArray;
    assistants.removeAt(index);
  }//end of method

  deleteFile(index) {
    this.procedureImages.splice(index, 1);
  }

  

  //update procedure click
  updateProcedure() {
    this.isEdit = true;

    let findIndex = this.procedureSelectFiles.findIndex(selectedFile => selectedFile.filetype == 'canvas');
    if (findIndex == -1)
      this.show_canvas_paint = true;
  }

  //button disable according to condition
  procedureSaveValidation(){
    if (this.procedureForm.controls['note'].value){      
      return false;
    }else{   
      return true;
    }
  }

  onKeydown($event) {
    if($event.key == ' ') {
      return true;
    }
    if(($event.keyCode >= 48 && $event.keyCode <= 57) || ($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 96 && $event.keyCode <= 111)) {
      return false;
    }
  }

}//end of class

import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { ToastService } from '../../../core/services/toast.service';
import { ServiceProviderService } from '../service-provider.service';

import { DomSanitizer } from '@angular/platform-browser';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { Observable } from 'rxjs/Observable';
import { SBISConstants } from 'src/app/SBISConstants';
import { HttpResponse } from '@angular/common/http';
import { HttpClient, HttpRequest } from "@angular/common/http";
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-service-provider-image-upload',
  templateUrl: './service-provider-image-upload.component.html',
  styleUrls: ['./service-provider-image-upload.component.css']
})
export class ServiceProviderImageUploadComponent implements OnInit {
  domSanitizer: any;
  user:any;
  SBISConstantsRef = SBISConstants;
  prescriptionHeaderImage="";
  prescriptionFooterImage="";
  providerFileSource:any={PRESCRIPTION_HEADER:"",PRESCRIPTION_FOOTER:""}

  fileTypeSource:any=[];
  fileTypesArray:any=[];
  constructor(private fb: FormBuilder, private toastService: ToastService,
    private serviceProviderService: ServiceProviderService, private http: HttpClient, private _domSanitizer: DomSanitizer,
    private broadcastService: BroadcastService,
  ) {
    this.domSanitizer = _domSanitizer;
    
  }

  ngOnInit() {
    
    this.broadcastService.setHeaderText('PRESCRIPTION CONFIGURATION');
    this.user = JSON.parse(localStorage.getItem('user'));

    let fileTypeSource=[]
    Object.keys(this.providerFileSource).forEach(function(key) {
      fileTypeSource.push(key)        
    });
    this.fileTypeSource=fileTypeSource;



    let fileTypes=this.SBISConstantsRef.SERVICEE_PROVIDER_FILE_TYPE;   
    let fileTypesArray=[];
    Object.keys(fileTypes).forEach(function(key) { 
      fileTypesArray.push(key);
    });
    this.fileTypesArray=fileTypesArray;

    this.getServiceProviderUploadedFiles();
  }

  getServiceProviderUploadedFiles(){  
    
    for(let type of this.fileTypesArray){
      this.getFileInfoByFileType(type);
    }
    
     
  }

  uploadHeader(event: any){
    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 500) {
      document.getElementById("prescriptionHeaderPhoto")["value"] = "";
      this.toastService.showI18nToast("SERVICE_PROVIDER.IMAGE_LESS_THAN" , 'warning');
      return;
    }
    let formdata = new FormData();

    let documentDtoList = JSON.stringify({
      "fileUploadFor": this.SBISConstantsRef.SERVICEE_PROVIDER_FILE_TYPE.PRESCRIPTION_HEADER,
      "serviceProviderRefNo":this.user.serviceProviderRefNo
    });

    formdata.append('file', file);
    formdata.append('document', documentDtoList);
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.getServiceProviderUploadedFiles();
          this.toastService.showI18nToast("SERVICE_PROVIDER.PRESCRIPTION_HEADER_UPLOADED" , 'success');
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  uploadFooter(event: any){

    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 500) {
      document.getElementById("prescriptionFooterPhoto")["value"] = "";
      this.toastService.showI18nToast("SERVICE_PROVIDER.IMAGE_LESS_THAN" , 'warning');
      return;
    }
    let formdata = new FormData();

    let documentDtoList = JSON.stringify({
      "fileUploadFor": this.SBISConstantsRef.SERVICEE_PROVIDER_FILE_TYPE.PRESCRIPTION_FOOTER,
      "serviceProviderRefNo":this.user.serviceProviderRefNo
    });

    formdata.append('file', file);
    formdata.append('document', documentDtoList);
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.ngOnInit();
          this.toastService.showI18nToast("SERVICE_PROVIDER.PRESCRIPTION_FOOTER_UPLOADED" , 'success');
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  saveDocument(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
      responseType: 'text'
    });
    return this.http.request(req);
   
  }


  getFileInfoByFileType(fileType){
    let requestPayLoad={
      providerFileType:fileType
    }
    console.log("Request Payload::",requestPayLoad);
    
    this.serviceProviderService.getFileInfoByFileType(requestPayLoad).subscribe(res => {
      if(res.status==2000){
        let currentFileTypeInfo=res.data;
        if(currentFileTypeInfo.data!=null){

       
          for(let srcKey of this.fileTypeSource){
            if(fileType==srcKey){
              this.providerFileSource[srcKey]="data:image/jpeg;base64,"+currentFileTypeInfo.data;
            }
          }
        }
      console.log("providerFileSource:::",this.providerFileSource);
      console.log("currentFileTypeInfo:::",currentFileTypeInfo);
     
      }
       
    });
  }


}

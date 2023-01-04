import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormGroupDirective } from '@angular/forms';
import { DeliveryService } from '../../delivery.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PharmacyService } from '../../../pharmacy/pharmacy.service';
import { HttpResponse, HttpRequest, HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-outstanding-form',
  templateUrl: './outstanding-form.component.html',
  styleUrls: ['./outstanding-form.component.css'],
  providers: [FormGroupDirective]
})
export class OutstandingFormComponent implements OnInit {

  @Input() orderData:any;
  @Input() fromList:any;
  @Input() index:any;
  @Output() emitResponse = new EventEmitter<Boolean>();
  outstandingForm: FormGroup;
  submitted:boolean = false;
  fileName: any;
  domSanitizer: any;
  idForFile: any;

  constructor(private fb: FormBuilder,
              private _deliveryService: DeliveryService,
              private toastService: ToastService,
              private _pharmacyService: PharmacyService,
              private _domSanitizer: DomSanitizer,
              private http: HttpClient) { 
                this.domSanitizer = _domSanitizer;
              }

  ngOnInit() {
    this.fileName = "";
    this.idForFile = "uploadInv"+this.index
    this.outstandingForm = this.fb.group({
      noOfPackage: [1],
      file: [null]
    })
  }

  saveOutToPacked(){
    this.submitted = true;
    if(this.fileName == ""){
      return;
    }
    if(this.outstandingForm.valid){
      let valueData = this.outstandingForm.value;
      let formdata = new FormData();
      
      let documentDtoList = JSON.stringify({
          "deliveryRefNo": this.orderData.deliveryRefNo,
          "deliveryStatus": this.orderData.nextStateCode,
          "noOfPackage": valueData.noOfPackage,
          "triggerRequestPk": this.orderData.pharmacyRequestPk,
          "fileUploadFor": "INVOICE",
          "entityOrderRefNo": this.orderData.entityOrderRefNo,
          "workflowId": "MED_ORDER",
          "entityType" : "pharmacy"
      });

      formdata.append('file', valueData.file);
      formdata.append('document', documentDtoList);
      this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          this.toastService.showI18nToast(response.message,"success");
          if(this.fromList){
            this.emitResponse.emit(this.fromList);
          }
          else{
            this.emitResponse.emit(this.fromList);
          }
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }

      }
    });
      // let payload = {};
      // payload = {
      //   deliveryRefNo: this.orderData.deliveryRefNo,
      //   deliveryStatus: 'PCK',
      //   noOfPackage: this.outstandingForm.value.noOfPackage,
      //   triggerRequestPk: this.orderData.pharmacyRequestPk
      // }
      // console.log(payload);
      //this.emitResponse.emit(this.fromList);
      // this._deliveryService.saveDelivery(payload).subscribe(res => {
      //   if(res['status']=='2000')
      //     this.toastService.showI18nToast(res['message'],"success");
      //     if(this.fromList){
      //       this.emitResponse.emit(this.fromList);
      //     }
      //     else{
      //       this.emitResponse.emit(this.fromList);
      //     }
      // });
    }

  }

  saveDocument(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
     // reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
   
  }

  selectSingleFile(event: any) {
    const file = event.target.files[0];
    if((file.type == "image/jpeg") || (file.type == "application/pdf")) {
      //do nothing
    } else {
      this.toastService.showI18nToast("File type should be jpg/pdf", "warning");
      return;
    }
    
    if (Math.round(file.size / 1024) > 140) {
      document.getElementById(this.idForFile)["value"] = "";
      this.outstandingForm.patchValue({
        file: null
      });
      this.fileName = "";
      this.toastService.showI18nToast("Uploaded file should be less than 140 KB", "warning");
      return;
    }
    
    if (file) {
      this.outstandingForm.patchValue({
        file: event.target.files[0]
      });
      this.fileName = file.name; 
    }
  }

  closeSingleFile() {
    //this.singleFile.fileName = "";
    this.fileName = "";
    // document.getElementById(this.singleFile.id)["value"] = "";
    // this.updateSingleControl();
  }

  // updateSingleControl() {
  //   this.validateSingleUpload();
  //   this.propagateChange(this.singleFile);
  // }

  // validateSingleUpload() {

  //   if (this.singleFile.documentDescription == "" || this.singleFile.fileName == "") {
  //     this.parseError = true;
  //   } else {
  //     this.parseError = false;
  //   }
  // }

  // private propagateChange = (_: any) => { };

}

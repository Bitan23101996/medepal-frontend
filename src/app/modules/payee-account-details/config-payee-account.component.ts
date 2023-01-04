import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs'
import { CoreService } from 'src/app/core/core.service';
import { HttpClient, HttpResponse, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { PayeeAccountDetailsService } from './payee-account-details.service';

@Component({
  selector: 'app-config-payee-account',
  templateUrl: './config-payee-account.component.html',
  styleUrls: ['./config-payee-account.component.css']
})
export class ConfigPayeeAccountComponent implements OnInit {
  
  domSanitizer: any;
  user: any;
  payeeAccountDetailsArr: any[] = [];
  payeeDetailForm: FormGroup;
  isAddPayee: boolean = false;
  download = {
    downloadImageSrc: "",
    contentType: "",
    fileName: ""
  }

  constructor(
    private payeeAccountDetailsService: PayeeAccountDetailsService,
    // private broadcastService: BroadcastService,
    private toastService: ToastService,
    private frb: FormBuilder,
    private http: HttpClient,
    private _domSanitizer: DomSanitizer
  ) { 
    this.payeeDetailForm = frb.group({
      'name': [null, [Validators.required]],
      'acnNo': [null, [Validators.required]],
      'confirmAcnNo': [null, [Validators.required]],
      'ifscCode': [null, [Validators.required]],
      'payeeAcnPk': [null],
      'refNo': [null],
      'isSubmit': false
    }, {validator: this.checkIfMatchingAccountNo('acnNo', 'confirmAcnNo')});
    this.domSanitizer = _domSanitizer;
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.retrievePayeeAccountDetails();
  }

  checkIfMatchingAccountNo(accNoKey: string, confAccNoKey: string) {
    return (group: FormGroup) => {
      let accNoInput = group.controls[accNoKey],
          confAccNoInput = group.controls[confAccNoKey];
      if (accNoInput.value !== confAccNoInput.value) {
        return confAccNoInput.setErrors({notEquivalent: true})
      }
      else {
          return confAccNoInput.setErrors(null);
      }
    }
  }

  retrievePayeeAccountDetails() {
    this.payeeAccountDetailsService.getPayeeAccountDetails({ 'spRefNo': this.user.serviceProviderRefNo }).subscribe(resp => {
      if (resp.status == 2000) {
        resp.data.forEach(element => {
          element['isEdit'] = false;
          element['disabled'] = false;
        });
        this.payeeAccountDetailsArr = resp.data;
        if(resp.data.length > 0) {
          if(resp.data[0].fileExist) {
            this.downloadDrewImageFile();
          }
        }
        console.log(this.payeeAccountDetailsArr);
      }
    });
  }

  deleteAccountDetails(payeeAcnDetail) {
    if (confirm('are you sure you want to delete this details ?')) {
      this.payeeAccountDetailsService.deletePayeeAccountDetails({ 'refNo': payeeAcnDetail.refNo }).subscribe(deleteResp => {
        if (deleteResp.status == 2000) {
          this.toastService.showI18nToast("Details deleted successfully", 'success');
          this.retrievePayeeAccountDetails();
        }
      });
    }
  }

  addPayeeAccountDetails() {
    this.isAddPayee = true;
    this.payeeDetailForm.patchValue({
      'acnNo': null,
      'confirmAcnNo': null,
      'ifscCode': null,
      'payeeAcnPk': null,
      'name': null,
      'refNo': null
    });
    let query = {
      "name": null,
      "acnNo": null,
      "confirmAcnNo": null,
      "ifscCode": null,
      "upiId": null,
      "spRefNo": null,
      "isEdit": true
    }
    let retrivedData = this.payeeAccountDetailsArr;
    this.payeeAccountDetailsArr = [];
    this.payeeAccountDetailsArr.push(query);
    retrivedData.forEach(ele => {
      this.payeeAccountDetailsArr.push(ele);
    });
    this.payeeAccountDetailsArr = this.payeeAccountDetailsArr.map( (item, index)=> {
      item.disabled = true;
      return item;
    });
  }

  editAccountDetails(payeeAcnDetail, index1) {
    this.isAddPayee = true;
    this.payeeDetailForm.patchValue({
      'name': payeeAcnDetail.name,
      'acnNo': payeeAcnDetail.acnNo,
      'confirmAcnNo':  payeeAcnDetail.acnNo,
      'ifscCode': payeeAcnDetail.ifscCode,
      'payeeAcnPk': payeeAcnDetail.payeeAcnPk,
      'refNo': payeeAcnDetail.refNo
    });
    this.payeeAccountDetailsArr[index1].isEdit = true;
    console.log(this.payeeDetailForm.value);
    this.payeeAccountDetailsArr = this.payeeAccountDetailsArr.map((item, index) => {
      item.disabled = index != index1 ? true : false
      return item;
    });
    console.log(this.payeeAccountDetailsArr);
  }

  saveAccountDetails() {
    this.payeeDetailForm.patchValue({
      'isSubmit': true
    });
    if (!this.payeeDetailForm.valid) {
      return;
    }
    let query = {
      "upiId": null,
      "name": this.payeeDetailForm.get('name').value,
      "ifscCode": this.payeeDetailForm.get('ifscCode').value,
      "acnNo": this.payeeDetailForm.get('acnNo').value,
      "spRefNo": this.user.serviceProviderRefNo,
      // "payeeAcnPk": this.payeeDetailForm.get('payeeAcnPk').value
      "refNo": this.payeeDetailForm.get('refNo').value
    }
    this.payeeAccountDetailsService.savePayeeAccountDetails(query).subscribe(saveResp => {
      if (saveResp.status == 2000) {
        this.isAddPayee = false;
        this.payeeDetailForm.patchValue({
          'isSubmit': false
        });
        this.toastService.showI18nToast("Details saved successfully", 'success');
        this.retrievePayeeAccountDetails();
      }
    });
  }

  cancelAccountDetails(payeeAcnDetail, index) {
    this.isAddPayee = false;
    payeeAcnDetail.refNo ? this.payeeAccountDetailsArr[index].isEdit = false : this.payeeAccountDetailsArr.splice(index, 1);
    this.payeeAccountDetailsArr.length > 0 ? this.payeeAccountDetailsArr[index].isEdit = false : null;
    this.payeeDetailForm.patchValue({
      'isSubmit': false
    });
    this.payeeAccountDetailsArr = this.payeeAccountDetailsArr.map(item => {
      item.disabled = false;
      return item;
    });
  }

  saveDocument(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
      responseType: 'text'
    });
    return this.http.request(req);
  }

  selectFile(event: any){

    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 500) {
      // document.getElementById("signaturePhoto")["value"] = "";
      this.toastService.showI18nToast("DOCTOR_PROFILE.IMAGE_LESS_THAN" , 'warning');
      return;
    }
    let formdata = new FormData();

    let documentDtoList = JSON.stringify({
      "fileUploadFor": "PAYEE_ACCOUNT",
      "refNo": this.payeeAccountDetailsArr[0].refNo
    });

    formdata.append('file', file);
    formdata.append('document', documentDtoList);
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          // this.ngOnInit();
          this.toastService.showI18nToast("Document uploaded successfully" , 'success');
          this.retrievePayeeAccountDetails();
        } else {
          this.toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  //method to downlad file
  downloadDrewImageFile() {
    let query = {
      'downloadFor': 'PAYEE_ACCOUNT',
      'documentRefNo': this.payeeAccountDetailsArr[0].refNo
    }
    this.payeeAccountDetailsService.fileDownload(query).subscribe((result) => {
      if (result.status != 2000) {
        return;
      }
      this.download.contentType = result.data.contentType;
      this.download.downloadImageSrc = "data:" + result.data.contentType + ";base64," + result.data.data;
      this.download.fileName = result.data.fileName;
      // this.downloadFile();
    });
    // this.downloadFile();
  }//end of method

  downloadFile() {
    const link = document.createElement('a');
    link.href = this.download.downloadImageSrc;
    link.download = this.download.fileName;
    link.click();
  }

}

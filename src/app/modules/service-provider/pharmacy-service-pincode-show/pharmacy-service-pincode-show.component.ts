import { Component, OnInit } from '@angular/core';
import { ServiceProviderService } from '../service-provider.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { FormGroupDirective, FormBuilder, FormGroup, Validators, FormsModule, FormControl, FormArray } from '@angular/forms';
import { Router, Event as RouterEvent, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';

@Component({
  selector: 'app-pharmacy-service-pincode-show',
  templateUrl: './pharmacy-service-pincode-show.component.html',
  styleUrls: ['./pharmacy-service-pincode-show.component.css']
})
export class PharmacyServicePincodeShowComponent implements OnInit {

  user: any;
  pincodes: any[] = [];
  fullRespPin: any[] = [];
  tableSheet: any = [];
  finalSheetData: any[] = [];
  addPincodeForm: FormGroup;

  constructor(
    private _broadcastService: BroadcastService,
    private _serviceProviderService: ServiceProviderService,
    private toastService: ToastService,
    private frb: FormBuilder,
    private router: Router
  ) { 
    this.addPincodeForm = frb.group({
      'pinCode': [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this._broadcastService.setHeaderText("service pin code list");
    this.user = JSON.parse(localStorage.getItem('user'));
    this.retrievePincode();
  }

  retrievePincode() {
    this._serviceProviderService.retrieveServiceProviderPincode().subscribe(resp => {
      if(resp.status == 2000) {
        this.pincodes = resp.data;
        this.fullRespPin = resp.data;
        this.calculateTable();
      }
    });
  }

  calculateTable() {
    this.tableSheet = [];
    this.finalSheetData = [];
    this.pincodes.forEach((element, index) => {
      this.finalSheetData.push({'pincode': element, 'index': index+1});
    });
    let array1 = [];
    let array2 = [];
    let array3 = [];
    if(this.pincodes.length <= 10) {
      this.pincodes.forEach((ele, index) => {
        array1.push(this.finalSheetData[index]);
      });
      this.tableSheet.push(array1);
      this.tableSheet.push(array2);
      this.tableSheet.push(array3);
    } else if (this.pincodes.length > 10 && this.pincodes.length <= 20) {
      let itemsPerArr = Math.round((this.pincodes.length / 2));
      let i, j;
      for(i=0;i < itemsPerArr;i++) {
        array1.push(this.finalSheetData[i]);
      }
      for(j=itemsPerArr;j <= (this.pincodes.length - 1);j++) {
        array2.push(this.finalSheetData[j]);
      }
      this.tableSheet.push(array1);
      this.tableSheet.push(array2);
      this.tableSheet.push(array3);
    } else if (this.pincodes.length > 20) {
      let itemsPerArr = Math.round((this.pincodes.length / 3));
      let i, j, k;
      for(i=0;i < itemsPerArr;i++) {
        array1.push(this.finalSheetData[i]);
      }
      for(j=itemsPerArr;j < (itemsPerArr*2);j++) {
        array2.push(this.finalSheetData[j]);
      }
      for(k=(itemsPerArr*2);k <= (this.pincodes.length -1); k++) {
        array3.push(this.finalSheetData[k]);
      }
      this.tableSheet.push(array1);
      this.tableSheet.push(array2);
      this.tableSheet.push(array3);
    }
  }

  deleteRecord(rowData) {
    this.pincodes.splice((rowData.index - 1), 1);
    this.saveRecords();
  }

  saveRecords() {
    let query = {
      'pinCodeList': this.pincodes
    }
    this._serviceProviderService.saveServiceProviderPincode(query).subscribe(resp => {
      if(resp.status == 2000) {
        this.toastService.showI18nToast('Successful!','success');
        this.retrievePincode();
      }
    });
  }

  addRecord() {
    this.addPincodeForm.patchValue({
      'pinCode': ''
    });
    if(this.pincodes[this.pincodes.length -1] != '') {
      this.pincodes.push('');
      this.calculateTable();
    }
  }

  recordAddApiCall() {
    if(this.addPincodeForm.controls.pinCode.value.toString().length == 6) {
      let pincodeLength = this.pincodes.length;
      this.pincodes[pincodeLength - 1] = this.addPincodeForm.controls.pinCode.value;
      this.saveRecords();
    }
  }

  cancel() {
    this.router.navigate(['opd/opdPharmacyView/pharmacy']);
  }

  searchByPincode(event) {
    if(event.target.value) {
      this.pincodes = this.fullRespPin.filter(x => x.includes(event.target.value));
    } else {
      this.pincodes = this.fullRespPin;
    }
    this.calculateTable();
  }

}

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { IndividualService } from '../../individual/individual.service';
import { ModalService } from '../../../shared/directive/modal/modal.service';
// import { ToastService } from '../../../core/services/toast.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { DoctorService } from '../doctor.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-doctor-address',
  templateUrl: './doctor-address.component.html',
  styleUrls: ['./doctor-address.component.css']
})
export class DoctorAddressComponent implements OnInit {

  @ViewChild('addressTypeTemp') addressTypeTemp: TemplateRef<any>;

  doctorProfileData: any;
  addressForm: FormGroup;
  user_id: any;
  msUserPk: any;
  profileData: any;
  addressId: any;
  addressT: any;
  addressTypeList: any = [];
  masterSTATE: any = [];
  addressSubmitted: any = false;
  masterCOUNTRY: any = [];
  previousAddressType: any;
  form: FormGroup;
  modalRef: BsModalRef;
  activeIds:any[];
  addressHeader:any;
  filteredAddressTypesSingle: any[];
  options: string[] = [];               //||---For address typeahead
  user_refNo:any;
  constructor(
    private individualService: IndividualService,
    private _doctorService: DoctorService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private toastService: ToastService,
    private bsModalService: BsModalService,
    private broadcastService: BroadcastService
  ) {
    this.addressForm = fb.group({
      'line1': [null, [Validators.required, Validators.maxLength(100)]],
      'line2': [null],
      'country': [null, Validators.required],
      'state': [null, Validators.required],
      'city': [null, [Validators.required, Validators.maxLength(50)]],
      'pinCode': [null, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
      'addressType': [null, Validators.required],
    });
    this.initialFormGroup();
  }

  ngOnInit() {
    //this.broadcastService.setIsCommonTemplate(true);
    this.broadcastService.setHeaderText('Address');
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.msUserPk = user.userId;
    this.user_refNo=user.refNo;
    this.loadUserProfile();
    this.loadAllMasterData();
    this.addressTypeList = [{ id: 1, Type: "Home" }, { id: 2, Type: "Office" }];
    this._doctorService.GetAddressType()
      .subscribe(res => {
        for (let i = 0; i < res['masterDataAttributeValues'].length; i++) {
          this.options.push(res['masterDataAttributeValues'][i].displayValue);
        }
      });
  }

  initialFormGroup() {
    this.form = this.fb.group({
      addreses: this.fb.array([])
    });
  }

  ngAfterViewInit() {
    // this.loadProfileData();
  }

  get addreses(): FormArray {
    return this.form.get('addreses') as FormArray;
  }

  loadUserProfile() {
    this.activeIds = [0]
    var request={
      "refNo":this.user_refNo
    }
    this._doctorService.getAddressesForDoctor(request).subscribe((result) => {
      console.log(result);
      
      if (result["status"] === 2000 && result["data"] != null) {
        this.doctorProfileData = result["data"];
        this.profileData = result["data"];
        this.broadcastService.setHeaderText('Address');
        this.initialFormGroup();
        this.doctorProfileData.doctorAddressList.forEach(address => {
          let ctrl = <FormArray>this.form.controls.addreses;
          ctrl.push(this.fb.group({
            'id': [address.doctorAddressPk],
            'line1': [address.line1, [Validators.required, Validators.maxLength(100)]],
            'line2': [address.line2],
            'country': [address.country, Validators.required],
            'state': [address.state, Validators.required],
            'city': [address.city, [Validators.required, Validators.maxLength(50)]],
            'pinCode': [address.pinCode, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
            'addressType': [address.addressType, Validators.required],
            'isEdit': [false],
            'isSubmit': [false],
            // 'createdBy': [address.createdBy],
            // 'createdDate': [address.createdDate],
            // 'modifiedBy': [address.modifiedBy],
            // 'modifiedDate': [address.modifiedDate],
          }))
          if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == address.addressType.toLowerCase()).length == 0) {
            var newId = this.addressTypeList.length + 1;
            this.addressTypeList.push({ id: newId, Type: address.addressType });
          }

        });

      } else {
        // handle response
      }
    }, (error) => {
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
    });
  }
  isEditDeleteAllowed:boolean = true;
  
  addNewAddress() {
    this.addressHeader = "Add address";
    this.activeIds = [0]
    let ctrl = <FormArray>this.form.controls.addreses;
    if(ctrl.length==0){
      this.initialFormGroup();
    }
    let formControl = this.fb.group({
      'id': [0],
      'line1': [null, [Validators.required, Validators.maxLength(100)]],
      'line2': [null],
      //Working on app/issues/630
      'country': ['India', Validators.required],
      'state': [null, Validators.required],
      'city': [null, [Validators.required, Validators.maxLength(50)]],
      'pinCode': [null, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
      'addressType': [null, Validators.required],
      'isEdit': [true],
      'isSubmit': [false],
      // 'createdBy': [null],
      // 'createdDate': [null],
      // 'modifiedBy': [null],
      // 'modifiedDate': [null]
    });

    let formGroupArray=this.fb.array([]);
    formGroupArray.push(formControl);
    let arrayControl = this.form.get('addreses') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      let item=arrayControl.at(i);
      formGroupArray.push(item);
    }
    this.form.setControl('addreses', formGroupArray);
    this.isEditDeleteAllowed = false;
  }

  loadAllMasterData() {
    this.individualService.getMasterDataCountry().subscribe(data => {
      if (data.status === 2000) {
        this.masterCOUNTRY = data.data;
      } else {
        alert(data.message);
      }
    });
  }

  getStateCasCadeToCounntry(ctrl: any) {
    this.masterSTATE = [];
    ctrl.patchValue({
      'state': ""
    });
    if (ctrl.value.country == "") return;

    // Commented for issue app#597
    // this.individualService.getMasterDataState(ctrl.value.country).subscribe(data => {
      // if (data.status === 2000) {
        // this.masterSTATE = data.data;
        let address = this.profileData.doctorAddressList.filter(x => x["doctorAddressPk"] == ctrl.value.id)[0];
        // if (address && this.masterSTATE.filter(x => x["stateName"] == address.state).length > 0) {
        if (address) {
          ctrl.patchValue({
            'state': address.state
          });
        }
    //   }
    // }, (error) => {
    //   this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
    // });
  }

  setPrfileData() {
    if (this.profileData) {
      let address = this.profileData.doctorAddressList.filter(x => x["id"] == this.addressId)[0];
      if (address) {
        this.addressT = address.addressType;
        if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == address.addressType.toLowerCase()).length == 0) {
          var newId = this.addressTypeList.length + 1;
          this.addressTypeList.push({ id: newId, Type: address.addressType });
        }
        this.addressForm.patchValue({
          'line1': address.line1,
          'line2': address.line2,
          'country': address.country,
          'city': address.city,
          'addressType': address.addressType,
          'state': address.state,
          'pinCode': address.pinCode
        });
      } else {
        this.addressForm.patchValue({
          'country': "India"
        });
      }
    }
  }

  createNewAddressType(ev: any, ctrl: any) {
    if (ev.target.value === 'Create' || ev.target.value === 'create') {
      this.modalRef = this.bsModalService.show(this.addressTypeTemp, { class: 'modal-lg', backdrop: 'static' });
      this.modalRef["ctrl"] = ctrl;
    } else {
      if (this.profileData.doctorAddressList.filter(x => x["addressType"] == ev.target.value && x["id"] != ctrl.value.id).length > 0) {
        let currentAddress = this.profileData.doctorAddressList.filter(x => x["id"] == ctrl.value.id)[0];
        if (currentAddress) {
          ctrl.patchValue({
            'addressType': currentAddress["addressType"]
          });
        }else{
          ctrl.patchValue({
            'addressType': null
          }); 
        }
        this.toastService.showI18nToast("Address Type is already added", "warning");
      }
    }
  }
  closeModal() {
    let ctrl = this.modalRef["ctrl"];
    let currentAddress = this.profileData.doctorAddressList.filter(x => x["id"] == ctrl.value.id)[0];
    console.log(currentAddress);
    if (currentAddress) {
      ctrl.patchValue({
        'addressType': currentAddress["addressType"]
      });
    }else{
      ctrl.patchValue({
        'addressType': ''
      });
    }
    this.modalRef.hide();
  }

  createAddresType() {
    let ctrl = this.modalRef["ctrl"];
    if (this.addressT != '') {
      if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == this.addressT.toLowerCase()).length > 0) {
        this.toastService.showI18nToast('This type already exist in list', "error");
        return;
      }
      let newId = this.addressTypeList.length + 1;
      this.addressTypeList.push({ id: newId, Type: this.addressT });
      ctrl.patchValue({
        'addressType': this.addressT
      });
      this.modalRef.hide();
    }
    else {
      this.toastService.showI18nToast("Address Type cannot be blank", "error");
    }
  }

  oldItem:any;
  isAnyAddressInEditState:boolean;
  oldItems:any[] = [];

  editToggleAddress(ctrl: any) {
    this.addressHeader = "Edit address";
    this.oldItems.push(ctrl.value);
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit
    });
    if(ctrl.value.isEdit){
      this.getStateCasCadeToCounntry(ctrl);
    }
    
    this.isEditDeleteAllowed = false;
    this.isAnyAddressInEditState = true;
  }

  saveAddress(ctrl: any) {
    let addValue = ctrl.value;
    ctrl.patchValue({
      'isSubmit': true
    });
    if (ctrl.invalid) {
      return;
    }
   
    let query = {
      'doctor': {'doctorPk':this.user_id},
      'line1': addValue.line1,
      'line2': addValue.line2,
      'country': addValue.country,
      'city': addValue.city,
      'addressType': addValue.addressType,
      'state': addValue.state,
      'pinCode': addValue.pinCode,
      'doctorAddressPk': addValue.id,
      'status': 'NRM',
      // 'createdBy': addValue.createdBy,
      // 'createdDate': addValue.createdDate,
      // 'modifiedBy': addValue.modifiedBy,
      // 'modifiedDate': addValue.modifiedDate,
    }
    if(addValue.id<1){
      delete query["doctorAddressPk"];
    }
    this.isAnyAddressInEditState = false;
    console.log(query);
    
    this._doctorService.saveDoctorAddress(query).subscribe((data) => {
      if (data.status === 2000) {
        this.loadUserProfile();
      }
      this.toastService.showI18nToast("Address saved successfully", "success");
    }, (error) => {
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
    });
    this.oldItems = [];
    this.isEditDeleteAllowed = true;
  }

  loadProfileData() {
    var request={
      "refNo":this.user_refNo
    }
    this._doctorService.fetchUserDtls(request).subscribe((res) => {
      if (res!=null) {
        this.profileData = res;

        this.addressForm.patchValue({
          'line1': res.doctorAddressList.line1,
          'line2': res.doctorAddressList.line1,
          'country': res.doctorAddressList.country,
          'state': res.doctorAddressList.state,
          'city': res.doctorAddressList.city,
          'pinCode': res.doctorAddressList.pinCode,
          'addressType': res.doctorAddressList.addressType,
          // 'createdBy': res.doctorAddressList.createdBy,
          // 'createdDate': res.doctorAddressList.createdDate,
          // 'modifiedBy': res.doctorAddressList.modifiedBy,
          // 'modifiedDate': res.doctorAddressList.modifiedDate,
        });
      }
      this.setPrfileData();
    }, (error) => {
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
    });
  }

  deleteAddress(ctrl: any, index: number) {
    let addValue = ctrl.value;
    let query = {
      'doctor': {'doctorPk':this.user_id},
      'line1': addValue.line1,
      'line2': addValue.line2,
      'country': addValue.country,
      'city': addValue.city,
      'addressType': addValue.addressType,
      'state': addValue.state,
      'pinCode': addValue.pinCode,
      'doctorAddressPk': addValue.id,
      'status': 'CXL',
      // 'createdBy': addValue.createdBy,
      // 'createdDate': addValue.createdDate,
      // 'modifiedBy': addValue.modifiedBy,
      // 'modifiedDate': addValue.modifiedDate,
    }
    if(ctrl.value.id<1){
      let arrayControl = this.form.get('addreses') as FormArray;
      arrayControl.removeAt(index);
      return;
    }
    if (confirm('are you sure you want to delete this address ?')) {
      this._doctorService.saveDoctorAddress(query).subscribe((data) => {
        if (data.status === 2000) {
          this.ngOnInit();
        }
        this.toastService.showI18nToast("Address removed successfully.", "success");
      });
    } else {
      // do nothing
    }
    this.isAnyAddressInEditState = false;
  }
  onBackOperation(ctrl: any, index: number){
    let arrayControl = this.form.get('addreses') as FormArray;
     arrayControl.removeAt(index);
     let oldIm = this.oldItems.filter(x=>x["id"]==ctrl.value.id)[0];
     if(oldIm){
      let formControl = this.fb.group({
        'id': oldIm.id,
        'line1': oldIm.line1,
        'line2': oldIm.line2,
        'country': oldIm.country,
        'state': oldIm.state,
        'city': oldIm.city,
        'pinCode': oldIm.pinCode,
        'addressType': oldIm.addressType,
        'isEdit': [false],
        'isSubmit': [false],
      });
      arrayControl.insert(index, formControl);
     }
    this.isAnyAddressInEditState = false;

    this.isEditDeleteAllowed = true;
  }

  onKeydown($event){
    if(($event.key == "!" || $event.key == "@" || $event.key == "#" || $event.key == "$" || $event.key == "%" || $event.key == "^" || $event.key == "&" || $event.key == "*" || $event.key == "(" || $event.key == ")") ||($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 106 && $event.keyCode <= 111)) 
    return false;
  }

  filterAddressTypeSingle(event) {
    let query = event.query;
    this.filteredAddressTypesSingle = this.filterAddress(query, this.options);

  }

  filterAddress(query, address: any[]): any[] {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered: any[] = [];
    for (let i = 0; i < address.length; i++) {
      let addressvalue = address[i];
      if (addressvalue.toLowerCase().toString().indexOf(query.toLowerCase()) == 0) {
        filtered.push(addressvalue);
      }
    }
    return filtered;
  }

  // Added for issue app#597
  fetchCountryStateCityByPin(ctrl: any, ev) {
    //Working on app/issues/630
    ctrl.patchValue({
      'isSubmit': false
    });
    //End Working on app/issues/630
    if (ev.code.indexOf('Arrow') != -1) return;
    if(ctrl.value.pinCode.length == 6) {
      let payload = {
        "pincode" : ctrl.value.pinCode
      }

      this._doctorService.findCountryStateCityByPin(payload).subscribe(data =>{
        console.log(data.data);
        if(data.status == 2000){
          if(data.data.country == null && data.data.state == null && data.data.city == null){
            this.toastService.showI18nToast("Invalid PIN Code", 'error');
            ctrl.patchValue({
              pinCode: "",
              country: "India",
              state: "",
              city: ""
            });
          }else{
            ctrl.patchValue({
              'country': data.data.country,
              'state': data.data.state,
              'city': data.data.city
            });
          }
        }else{
          this.toastService.showI18nToast(data['message'], 'error');
        }
      });
    }
  }
    
}

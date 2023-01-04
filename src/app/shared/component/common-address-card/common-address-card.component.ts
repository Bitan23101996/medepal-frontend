import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter, OnChanges,AfterViewInit, DoCheck } from '@angular/core';
import { IndividualService } from '../../../modules/individual/individual.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../shared/directive/modal/modal.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BroadcastService } from './../../../core/services/broadcast.service';

@Component({
  selector: 'app-common-address-card',
  templateUrl: './common-address-card.component.html',
  styleUrls: ['./common-address-card.component.css']
})
export class CommonAddressCardComponent implements OnInit, OnChanges {

@Input() ctrl: any;
@Input() i: any;
@Input() isEditDeleteAllowed: boolean;
@Input() form: FormGroup;
@Input() getaddressTypes: any;
addressT: any;
@Output() emitGetAddressDetails: EventEmitter<any> = new EventEmitter<any>();
@Output() emitCreateAddressModal: EventEmitter<any> = new EventEmitter<any>();
@Output() emitBackOperation: EventEmitter<any> = new EventEmitter<any>();
@Output() emitSaveAddress: EventEmitter<any> = new EventEmitter<any>();
@Output() emitOldItems: EventEmitter<any> = new EventEmitter<any>();
@ViewChild('addressTypeTemp') addressTypeTemp: TemplateRef<any>;
modalRef: BsModalRef;

user_id: any;
user_refNo: any;
@Input() addressHeader: any;
isAnyAddressInEditState: boolean;
oldItems: any[] = [];
addressTypeList: any = [];
newId: any;
masterSTATE: any = [];
profileData: any;
workflow: any;
isRegistrationWorkflowCompleted: boolean = false;
activeIds: any[];
addressFirstLoad: any = false;
userProfileData: any;
addressForm: FormGroup;
masterCOUNTRY: any = [];
addressCardForm: FormGroup;

  constructor(
    private individualService: IndividualService,
    private frb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private modalService: ModalService,
    private toastService: ToastService,
    private bsModalService: BsModalService,
    private broadcastService: BroadcastService
  ) { 
    // this.addressForm = frb.group({
    //   'name': [null],
    //   'contactNo': [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
    //   'line1': [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
    //   'line2': [null],
    //   'country': [null, Validators.required],
    //   'state': [null, Validators.required],
    //   'city': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],//, Validators.pattern(/^[a-zA-Z]*$/)
    //   'pinCode': [null, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
    //   'addressType': [null, Validators.required],
    // });
    this.addressCardForm = frb.group({
      'name': [null],
      'contactNo': [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      'line1': [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      'line2': [null],
      'country': [null, Validators.required],
      'state': [null, Validators.required],
      'city': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],//, Validators.pattern(/^[a-zA-Z]*$/)
      'pinCode': [null, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
      'addressType': [null, Validators.required],
    });
    this.initialFormGroup();
  }

  ngOnChanges() {
    
  }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.addressTypeList = [{ id: 1, Type: "Home" }, { id: 2, Type: "Office" }, { id: 3, Type: "Custom Address Type" }];
    this.loadAllMasterData();
    this.loadUserProfile();
    this.workflow = JSON.parse(localStorage.getItem('regw'));
    //this.workflowSteps = workflow.registrationWorkflowSteps;
    this.isRegistrationWorkflowCompleted = this.workflow.registrationWorkflowCompleted;
    // this.isValidProfile = this.workflow.validProfile;
    this.broadcastService.setRegistrationWorkflow(this.workflow);
    this.addressCardForm = this.ctrl;
  }

  addedCustomAddressType() {
    console.log(this.addressT);
    if(this.addressT) {
      this.addressTypeList.push({id: this.addressTypeList.length+1, Type: this.addressT});
      this.addressCardForm.patchValue({
        'addressType': this.addressT
      });
      this.addressT = null;
    }
    console.log(this.addressTypeList);
  }

  initialFormGroup() {
    this.form = this.frb.group({
      addreses: this.frb.array([])
    });
  }

  loadUserProfile() {
    this.activeIds = [0];
    this.form.value.addreses.forEach(address => {
      if(address.addressType) {
        if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == address.addressType.toLowerCase()).length == 0) {
          if (this.addressTypeList.filter(x => x['Type'] != "Custom Address Type")) {
            this.newId = this.addressTypeList.length + 1;
          }
        }
      }
    });
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

  addressCreateMiddleDlt() {
    this.addressTypeList.forEach((element, index) => {
      if (element['Type'] == "Custom Address Type") {

        this.addressTypeList.splice(index, 1);
      }
    });
  }

  addNewAddress() {
    this.addressHeader = "Add address";
    //to set country default
    let defaultCountryName: string = '';//this.masterCOUNTRY[0];
    this.masterCOUNTRY.filter((elm) => {
      if (elm.countryName == 'India') {
        defaultCountryName = elm.countryName;
      };
    });
    this.activeIds = [0]
    let ctrl = <FormArray>this.form.controls.addreses;
    if (ctrl.length == 0) {
      this.initialFormGroup();
    }
    let formControl = this.frb.group({
      'id': [0],
      'name': [null, Validators.required],
      'contactNo': [null, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
      'line1': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      'line2': [null],
      'country': [defaultCountryName, Validators.required],
      'state': [null, Validators.required],
      'city': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],//, Validators.pattern(/^[a-zA-Z]*$/)
      'pinCode': [null, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
      'addressType': [null, Validators.required],
      'isEdit': [true],
      'isSubmit': [false],
    });

    let formGroupArray = this.frb.array([]);
    formGroupArray.push(formControl);
    let arrayControl = this.form.get('addreses') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      let item = arrayControl.at(i);
      formGroupArray.push(item);
    }
    this.form.setControl('addreses', formGroupArray);
    this.isEditDeleteAllowed = false;
    // console.log("data" + this.form)
    this.getStateCasCadeToCounntry(formControl);
    let result = this.addressTypeList.find(cstAd => cstAd.Type === 'Custom Address Type');
    if (!result) {
      this.addressTypeList.push({ id: this.newId + 1, Type: "Custom Address Type" });
    }

  }//End of method

  editToggleAddress(ctrl: any, index: any) {
    this.addressHeader = "Edit address";
    if (this.isAnyAddressInEditState) {
      alert('Please save your alrady modified address type')
      return;
    }
    this.addressCardForm.patchValue({
      'state': ctrl.value.state
    });
    this.emitOldItems.emit(ctrl);
    this.oldItems.push(ctrl.value);
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit
    });
    this.isAnyAddressInEditState = true;
    let existingType = this.addressTypeList.findIndex(x => x.Type === ctrl.value.addressType);
    if(existingType == -1) {
      this.addressTypeList.push({ id: this.newId + 1, Type: ctrl.value.addressType });
    }
    let result = this.addressTypeList.find(cstAd => cstAd.Type === 'Custom Address Type');
    if (!result) {
      this.addressTypeList.push({ id: this.newId + 1, Type: "Custom Address Type" });
    }
  }

  deleteAddress(ctrl: any, index: number) {
    if (ctrl.value.id < 1) {
      let arrayControl = this.form.get('addreses') as FormArray;
      arrayControl.removeAt(index);
      return;
    }
    if (confirm('are you sure you want to delete this address ?')) {
      let query = {
        'userRefNo': this.user_refNo,
        'addressList': [ctrl.value.id]
      }
      this.individualService.deleteAddress(query).subscribe(data => {
        if (data.status === 2000) {
          this.emitGetAddressDetails.emit();
        }
        this.toastService.showI18nToast(data.message, 'success');
      });
    } else {
      // do nothing
      this.isAnyAddressInEditState = false;
    }
    //this.isAnyAddressInEditState = true;
  }

  getStateCasCadeToCounntry(ctrl: any, index?: any) {
    this.masterSTATE = [];
    ctrl.patchValue({
      'state': ""
    });
    if (ctrl.value.country == "") return;
    if (index != undefined) {
      if (ctrl.value.country == "India") {
        this.form.controls.addreses['controls'][index].controls.contactNo.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13)]);
        this.form.controls.addreses['controls'][index].controls.pinCode.setValidators([Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]);
      } else {
        this.form.controls.addreses['controls'][index].controls.contactNo.setValidators(null);
        this.form.controls.addreses['controls'][index].controls.pinCode.setValidators([Validators.required]);
      }
      this.form.controls.addreses['controls'][index].controls.pinCode.updateValueAndValidity();
    }

    let address = this.form.value.addreses.filter(x => x["id"] == ctrl.value.id)[0];
    if (address) {
      ctrl.patchValue({
        'state': address.state
      });
    }
  }

  saveAddress(ctrl: any) {
    this.emitSaveAddress.emit(ctrl);
  }

  onKeydown($event) {
    if ($event.key == ' ') {
      return true;
    }
    if (($event.keyCode >= 48 && $event.keyCode <= 57) || ($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 96 && $event.keyCode <= 111)) {
      return false;
    }
  }

  createNewAddressType(ev: any, ctrl: any) {
    if (ev.target.value === 'Custom Address Type' || ev.target.value === 'create') {
      this.addressT = "";
      // this.emitCreateAddressModal.emit(ctrl);
      this.modalRef = this.bsModalService.show(this.addressTypeTemp, { class: 'modal-lg', backdrop: 'static' });
    } else {
      if (this.form.value.addreses.filter(x => x["addressType"] == ev.target.value && x["id"] != ctrl.value.id).length > 0) {
        let currentAddress = this.form.value.addreses.filter(x => x["id"] == this.ctrl.value.id)[0];
        if (currentAddress) {
          this.addressCardForm.patchValue({
            'addressType': null
          });
          this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_TYPE_EXIST', 'error');
        }
      }
    }
  }

  closeModal() {
    // let ctrl = this.modalRef["ctrl"];
    // let currentAddress = this.profileData.addressList.filter(x => x["id"] == ctrl.value.id)[0];
    // console.log(currentAddress);
    // if (currentAddress) {
    //   ctrl.patchValue({
    //     'addressType': currentAddress["addressType"]
    //   });
    // } else {
    //   ctrl.patchValue({
    //     'addressType': ''
    //   });
    // }
    this.modalRef.hide();
  }

  createAddresType(address, modalname) {
    let ctrl = this.modalRef["ctrl"];
    console.log(this.getaddressTypes);
    
    if (this.addressT != '') {
      if (this.getaddressTypes.filter(x => x.toLowerCase() == this.addressT.toLowerCase()).length > 0) {
        this.toastService.showI18nToast('USER_ADDRESS_TOAST.TYPE_ALREADY_EXIST_IN_LIST', 'error');
        return;
      } else if (this.addressT.length > 25) {
        this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_TYPE_SHOULD_BE_BETWEEN_25', 'warning')
        return;
      }
      let newId = this.addressTypeList.length + 1;
      this.getaddressTypes.push(this.addressT);
      // this.addressTypeList.push({ id: newId, Type: this.addressT });
      // ctrl.patchValue({
      //   'addressType': this.addressT
      // });
      this.modalRef.hide();
      this.addedCustomAddressType();
    }
    else {
      this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_NOT_BE_BLANK', 'warning');
    }
  }

  changeCountryEvent(ctrl: any, index?: any) {
    this.masterSTATE = [];
    this.addressCardForm.patchValue({
      'state': "",
      'pinCode': "",
      'city': ""
    });
    if (ctrl.value.country == "") return;
    if (index != undefined) {
      if (ctrl.value.country == "India") {
        this.addressCardForm.controls.contactNo.setValidators([Validators.required, Validators.minLength(13), Validators.maxLength(13)]);
        this.addressCardForm.controls.pinCode.setValidators([Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]);
        this.addressCardForm.controls.city.setValidators([Validators.required]);
        this.addressCardForm.controls.state.setValidators([Validators.required]);
      } else {
        this.addressCardForm.controls.contactNo.setValidators(null);
        this.addressCardForm.controls.pinCode.setValidators(null);
        this.addressCardForm.controls.state.setValidators(null);
        this.addressCardForm.controls.city.setValidators(null);
      }
      this.addressCardForm.controls.pinCode.updateValueAndValidity();
      this.addressCardForm.controls.contactNo.updateValueAndValidity();
      this.addressCardForm.controls.city.updateValueAndValidity();
      this.addressCardForm.controls.state.updateValueAndValidity();
      this.addressCardForm = this.ctrl;
    }
  }

  fetchCountryStateCityByPin(ctrl: any, ev) {
    if (ev.code.indexOf('Arrow') != -1) return;
    if (ctrl.value.country == "India") {
      if (ctrl.value.pinCode.length == 6) {
        let payload = {
          "pincode": ctrl.value.pinCode
        }
        this.individualService.findCountryStateCityByPin(payload).subscribe(data => {
          if (data.status == 2000) {
            if (data.data.country == null && data.data.state == null && data.data.city == null) {
              this.toastService.showI18nToast("Invalid PIN Code", 'error');
              ctrl.patchValue({
                pinCode: "",
                country: "India",
                state: "",
                city: ""
              });
            } else {
              ctrl.patchValue({
                'country': data.data.country,
                'state': data.data.state,
                'city': data.data.city
              });
            }
          } else {
            this.toastService.showI18nToast(data['message'], 'error');
          }
        });
      }
    }
  }

  onBackOperation(ctrl: any, index: number) {
    let emitEvent = {
      'ctrl': ctrl,
      'index': index
    }
    this.emitBackOperation.emit(emitEvent);
  }

}

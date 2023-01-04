import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { IndividualService } from '../../individual.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { ModalService } from '../../../../shared/directive/modal/modal.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BroadcastService } from './../../../../core/services/broadcast.service';
import { CommonAddressCardComponent } from '../../../../shared/component/common-address-card/common-address-card.component';

@Component({
  selector: 'app-user-address',
  templateUrl: './user-address.component.html',
  styleUrls: ['./user-address.component.css']
})
export class UserAddressComponent implements OnInit {
  @ViewChild('addressTypeTemp') addressTypeTemp: TemplateRef<any>;
  @ViewChild('commonAddressCardForm') commonAddressCardForm: CommonAddressCardComponent;

  userProfileData: any;
  addressForm: FormGroup;
  user_id: any;
  user_refNo: any;
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
  activeIds: any[];
  addressHeader: any;
  allDataFetched: boolean = false;
  newId: any;
  addressFirstLoad: any = false;
  /* Working on app/issues/782 */
  isRegistrationWorkflowCompleted: boolean = false;
  // isValidProfile: boolean = false;
  workflowSteps: any = [];
  workflow: any;
  redirectFlag: boolean = true;
  successMsgFor = "userRegistration";
  /*End Working on app/issues/782 */
  getaddressTypes: any[] = [];

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
    this.addressForm = frb.group({
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

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.user_refNo = user.refNo;
    this.loadUserProfile();
    this.broadcastService.setHeaderText('Address');
    this.loadAllMasterData();
    this.addressTypeList = [{ id: 1, Type: "Home" }, { id: 2, Type: "Office" }, { id: 3, Type: "Custom Address Type" }];
    /* Working on app/issues/782 */
    this.workflow = JSON.parse(localStorage.getItem('regw'));
    //this.workflowSteps = workflow.registrationWorkflowSteps;
    this.isRegistrationWorkflowCompleted = this.workflow.registrationWorkflowCompleted;
    // this.isValidProfile = this.workflow.validProfile;
    this.broadcastService.setRegistrationWorkflow(this.workflow);

    /*End Working on app/issues/782 */
  }

  initialFormGroup() {
    this.form = this.frb.group({
      addreses: this.frb.array([])
    });
  }

  ngAfterViewInit() {
    this.loadProfileData();
  }

  emitGetAddressDetails() {
    this.ngOnInit();
  }

  emitCreateAddressModal(event) {
    this.modalRef = this.bsModalService.show(this.addressTypeTemp, { class: 'modal-lg', backdrop: 'static' });
    this.modalRef["ctrl"] = event;
  }

  emitBackOperation(event) {
    this.onBackOperation(event.ctrl, event.index);
  }

  emitSaveAddress(event) {
    this.saveAddress(event);
  }

  emitOldItems(event) {
    this.isEditDeleteAllowed = false;
    this.oldItems.push(event.value);
  }

  myPrescriptionPage(){
    this.router.navigate(['/individual/my-prescription']);
  }

  myGroupPage(){
    this.router.navigate(['/individual/group-details']);
  }

  searchDoctor()
  {
    this.router.navigate(['/search']);
  }



  loadUserProfile() {
    this.activeIds = [0]
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((result) => {
      if (result.status === 2000) {
        this.getaddressTypes = [];
        this.addressFirstLoad = true;
        this.userProfileData = result.data;
        this.profileData = result.data;
        //this.broadcastService.setHeaderText('Address');
        this.initialFormGroup();
        this.userProfileData.addressList.forEach(address => {
          this.getaddressTypes.push(address.addressType);
          let ctrl = <FormArray>this.form.controls.addreses;
          ctrl.push(this.frb.group({
            'id': [address.id],
            'name': [address.name],
            'contactNo': [address.contactNo, [Validators.required, Validators.minLength(13), Validators.maxLength(13)]],
            'line1': [address.line1, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
            'line2': [address.line2],
            'country': [address.country, Validators.required],
            'state': [address.state, Validators.required],
            'city': [address.city, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],//, Validators.pattern(/^[a-zA-Z]*$/)
            'pinCode': [address.pinCode, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
            'addressType': [address.addressType, Validators.required],
            'isEdit': [false],
            'isSubmit': [false],
          }))
          if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == address.addressType.toLowerCase()).length == 0) {
            if (this.addressTypeList.filter(x => x['Type'] != "Custom Address Type")) {

              this.newId = this.addressTypeList.length + 1;
              // this.addressTypeList.push({ id: this.newId, Type: address.addressType });
            }
            this.addressCreateMiddleDlt();
          }
        });
        result.data.addressList.length == 0 ? this.addNewAddress() : ''; //do nothing

      } else {
        // handle response
      }
    }, (error) => {
      // show error
    });
    this.allDataFetched = true;
  }
  isEditDeleteAllowed: boolean = true;

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

  loadAllMasterData() {
    this.individualService.getMasterDataCountry().subscribe(data => {
      if (data.status === 2000) {
        this.masterCOUNTRY = data.data;

        /*   let countryFilter = this.masterCOUNTRY.filter(x => x["id"] == 1)[0];
          console.log( countryFilter);
          if (countryFilter) {
            this.addressForm.patchValue({
              'country': countryFilter
            });
          } */

        //console.log(this.masterCOUNTRY);
      } else {
        alert(data.message);
      }
    });
  }

  changeCountryEvent(ctrl: any, index?: any) {
    this.masterSTATE = [];
    ctrl.patchValue({
      'state': "",
      'pinCode': "",
      'city': ""
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
  }

  getStateCasCadeToCounntry(ctrl: any, index?: any) {
    this.masterSTATE = [];
    ctrl.patchValue({
      'state': ""
    });
    if (ctrl.value.country == "") return;
    // Commented for issue app#597
    // this.individualService.getMasterDataState(ctrl.value.country).subscribe(data => {
    //   if (data.status === 2000) {
    //     this.masterSTATE = data.data;
    // console.log(this.form.controls.addreses['controls'][index].controls.pinCode);

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

    // this.profileData.addressList.controls.pinCode.updateValueAndValidity([ctrl.value.pinCode]);
    let address = this.profileData.addressList.filter(x => x["id"] == ctrl.value.id)[0];
    // if (address && this.masterSTATE.filter(x => x["stateName"] == address.state).length > 0) {
    if (address) {
      ctrl.patchValue({
        'state': address.state
      });
    }
    // }
    // }, (error) => {

    // });
  }

  setPrfileData() {
    if (this.profileData) {
      let address = this.profileData.addressList.filter(x => x["id"] == this.addressId)[0];
      if (address) {
        this.addressT = address.addressType;
        if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == address.addressType.toLowerCase()).length == 0) {
          var newId = this.addressTypeList.length + 1;
          this.addressTypeList.push({ id: newId, Type: address.addressType });
        }
        this.addressForm.patchValue({
          'name': address.name,
          'contactNo': address.contactNo,
          'line1': address.line1,
          'line2': address.line2,
          'country': address.country,
          'city': address.city,
          'addressType': address.addressType,
          'state': address.state,
          'pinCode': address.pinCode
        });
        //this.getStateCasCadeToCounntry(address.country);
      } else {
        this.addressForm.patchValue({
          'country': "India"
        });
        //this.getStateCasCadeToCounntry("India");
      }
    }
  }

  createNewAddressType(ev: any, ctrl: any) {
    if (ev.target.value === 'Custom Address Type' || ev.target.value === 'create') {
      this.addressT = "";
      this.modalRef = this.bsModalService.show(this.addressTypeTemp, { class: 'modal-lg', backdrop: 'static' });
      this.modalRef["ctrl"] = ctrl;
    } else {
      if (this.profileData.addressList.filter(x => x["addressType"] == ev.target.value && x["id"] != ctrl.value.id).length > 0) {
        let currentAddress = this.profileData.addressList.filter(x => x["id"] == ctrl.value.id)[0];
        if (currentAddress) {
          ctrl.patchValue({
            'addressType': currentAddress["addressType"]
          });
        } else {
          ctrl.patchValue({
            'addressType': null
          });
        }
        this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_TYPE_EXIST', 'error');
      }
    }
  }
  closeModal() {
    let ctrl = this.modalRef["ctrl"];
    let currentAddress = this.profileData.addressList.filter(x => x["id"] == ctrl.value.id)[0];
    console.log(currentAddress);
    if (currentAddress) {
      ctrl.patchValue({
        'addressType': currentAddress["addressType"]
      });
    } else {
      ctrl.patchValue({
        'addressType': ''
      });
    }
    this.modalRef.hide();
  }

  createAddresType(address, modalname) {
    let ctrl = this.modalRef["ctrl"];
    if (this.addressT != '') {
      if (this.addressTypeList.filter(x => x["Type"].toLowerCase() == this.addressT.toLowerCase()).length > 0) {
        this.toastService.showI18nToast('USER_ADDRESS_TOAST.TYPE_ALREADY_EXIST_IN_LIST', 'error');
        return;
      } else if (this.addressT.length > 25) {
        this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_TYPE_SHOULD_BE_BETWEEN_25', 'warning')
        return;
      }
      let newId = this.addressTypeList.length + 1;
      this.addressTypeList.push({ id: newId, Type: this.addressT });
      ctrl.patchValue({
        'addressType': this.addressT
      });
      this.modalRef.hide();
      this.commonAddressCardForm.addedCustomAddressType();
    }
    else {
      this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_NOT_BE_BLANK', 'warning');
    }
  }

  onTabChange(event) {
    this.router.navigate(['/individual/user-profile-view', event.nextId]);
  }


  returnPreviousPage() {
    this.router.navigate(['/individual/tab-address']);
  }
  oldItem: any;
  isAnyAddressInEditState: boolean;
  oldItems: any[] = [];

  editToggleAddress(ctrl: any, index: any) {
    this.addressHeader = "Edit address";
    if (this.isAnyAddressInEditState) {
      alert('Please save your alrady modified address type')
      return;
    }
    //this.oldItem = ctrl.value;
    this.oldItems.push(ctrl.value);
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit
    });
    if (ctrl.value.isEdit) {
      this.getStateCasCadeToCounntry(ctrl, index);
    }

    this.isEditDeleteAllowed = false;
    this.isAnyAddressInEditState = true;
    this.addressTypeList.push({ id: this.newId + 1, Type: ctrl.value.addressType });
    let result = this.addressTypeList.find(cstAd => cstAd.Type === 'Custom Address Type');
    if (!result) {
      this.addressTypeList.push({ id: this.newId + 1, Type: "Custom Address Type" });
    }
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
      'name': addValue.name,
      'contactNo': addValue.contactNo,
      'line1': addValue.line1,
      'line2': addValue.line2,
      'country': addValue.country,
      'city': addValue.city,
      'addressType': addValue.addressType,
      'state': addValue.state,
      'pinCode': addValue.pinCode,
      'id': addValue.id
    }
    if (addValue.id < 1) {
      delete query["id"];
    }
    this.isAnyAddressInEditState = false;
    this.individualService.updateUserProfile({
      'updateSection': 'ADDRESS',
      'userRefNo': this.user_refNo,
      'addressList': [query]
    }).subscribe((data) => {
      if (data.status === 2000) {

        /* Working on app/issues/782 */
        let payloadWorkflow = JSON.parse(localStorage.getItem('regw'));
        if (payloadWorkflow.registrationWorkflowCompleted) {
          this.redirectFlag = true;
        }
        else {
          this.redirectFlag = false;
        }

        //payloadWorkflow.isChabmerOrAddressExist = true;
        payloadWorkflow.registrationWorkflowCompleted = true;
        //payloadWorkflow.validProfile = true;
        this.broadcastService.setRegistrationWorkflow(payloadWorkflow);
        localStorage.setItem('regw', JSON.stringify(payloadWorkflow));
        this.loadUserProfile();
        if (this.redirectFlag) {
        }
        else {
          this.broadcastService.setHeaderText("Registration Completed");
        }
        /*End Working on app/issues/782 */
        //this.editToggleAddress(ctrl);
      }
      this.toastService.showI18nToast(data.message, 'success');

    }, (error) => {
      // handle error
    });
    this.oldItems = [];
    this.isEditDeleteAllowed = true;
    this.addressCreateMiddleDlt();
    // if(this.addressTypeList.length > 2) {
    //   this.addressTypeList.push({id: this.newId+1, Type: "Custom Address Type"});
    // }
  }

  loadProfileData() {
    this.individualService.getUserFullProfile(this.user_refNo).subscribe((res) => {
      if (res.status === 2000) {
        this.profileData = res.data;

        this.addressForm.patchValue({
          'name': res.data.addressList.name,
          'contactNo': res.data.addressList.contactNo,
          'line1': res.data.addressList.line1,
          'line2': res.data.addressList.line1,
          'country': res.data.addressList.country,
          'state': res.data.addressList.state,
          'city': res.data.addressList.city,
          'pinCode': res.data.addressList.pinCode,
          'addressType': res.data.addressList.addressType,
        });
      }
      this.setPrfileData();
    }, (error) => {
      //  show error
    });
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
          this.ngOnInit();
        }
        this.toastService.showI18nToast(data.message, 'success');
      });
    } else {
      // do nothing
      this.isAnyAddressInEditState = false;
    }
    //this.isAnyAddressInEditState = true;
  }
  onBackOperation(ctrl: any, index: number) {
    let arrayControl = this.form.get('addreses') as FormArray;
    arrayControl.removeAt(index);
    let oldIm = this.oldItems.filter(x => x["id"] == ctrl.value.id)[0];
    if (oldIm) {
      let formControl = this.frb.group({
        'id': oldIm.id,
        'name': oldIm.name,
        'contactNo': oldIm.contactNo,
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
    let lastAddedAddressTypeIndex = this.addressTypeList.findIndex(x => x.Type == ctrl.value.addressType);
    this.addressTypeList.splice(lastAddedAddressTypeIndex, 1);
    this.isEditDeleteAllowed = true;
    //this.oldItem = null;
    //ctrl.get('isEdit').value = !ctrl.get('isEdit').value
  }

  // Added for issue app#597
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

  checkContactNumber(event, contact) {
    console.log(event);
  }

  onKeydown($event) {
    if ($event.key == ' ') {
      return true;
    }
    if (($event.keyCode >= 48 && $event.keyCode <= 57) || ($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 96 && $event.keyCode <= 111)) {
      return false;
    }
  }

}

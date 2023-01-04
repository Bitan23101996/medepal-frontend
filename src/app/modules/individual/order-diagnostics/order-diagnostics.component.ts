import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { IndividualService } from '../individual.service';
import { ApiService } from '../../../core/services/api.service';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl, FormGroupDirective } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { GetSet } from '../../../core/utils/getSet';
import { DomAdapter } from '@angular/platform-browser/src/dom/dom_adapter';
import { DoctorService } from '../../doctor/doctor.service';

@Component({
  selector: 'app-order-diagnostics',
  templateUrl: './order-diagnostics.component.html',
  styleUrls: ['./order-diagnostics.component.css'],
  providers: [FormGroupDirective]
})
export class OrderDiagnosticsComponent implements OnInit, OnDestroy {

  @ViewChild('addressTypeTemp') addressTypeTemp: TemplateRef<any>;
  appoinmentTypeLists = [
    { id: "1", label: "For me", isChecked: false },
    { id: "4", label: "Minor", isChecked: false },
    { id: "2", label: "For my group user", isChecked: false },
    { id: "3", label: "Person Known to me", isChecked: false }
  ];
  appoinmentUser = {
    userType: null,
    userName: "",
    emailAddress: "",
    contactNo: "",
    firstName: "",
    lastName: "",
    searchText: "",
    existingUser: null
  }
  appSIgnUp: any = {
    userName: '',
    mobileNo: '',
    firstName: '',
    password: 'test1234',
    registrationProvider: 'SBIS',
    userType: 'SUDO'
  };
  addressList = [];
  user: any;
  user_id: any;
  isEdit: any = false;
  masterCOUNTRY: any = [];
  masterSTATE: any = [];
  user_refNo: string;
  addressForm: FormGroup;
  selectedAddress: any;
  appointmentForSeelection: any;
  userGroupMembers: any[] = [];
  userForMinor: any[] = [];
  addressData: any = [];
  showAppoinmentForMe: boolean = false;
  showAppoinmentForGroup: boolean = false;
  showAppoinmentForMinor: boolean = false;
  labTestList: any[] = [];
  diagnosticsList: any[] = [];
  addressT: any;
  modalRef: BsModalRef;
  addressTypeList: any = [];
  patientRefNo: string;
  addressId: number;
  isLab: boolean = false;
  bookDiagnosticsQuery: any;
  labs: any;
  labRefNo: string;
  selectedLab: any;
  diagnosticsFromPrescription: any;
  tax: any;

  constructor(
    private broadcastService: BroadcastService,
    private _individualService: IndividualService,
    private _doctorService: DoctorService,
    private apiService: ApiService,
    private frb: FormBuilder,
    private toastService: ToastService,
    private bsModalService: BsModalService,
    private router: Router
  ) {
    this.addressForm = frb.group({
      'line1': [null, [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      'line2': [null],
      'country': [null, Validators.required],
      'state': [null, Validators.required],
      'city': [null, [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],//, Validators.pattern(/^[a-zA-Z]*$/)
      'pinCode': [null, [Validators.required, Validators.minLength(6), Validators.min(0), Validators.pattern(/^[0-9a-zA-Z]+$/)]],
      'addressType': [null, Validators.required],
      'isSubmit': false
    });
  }

  ngOnInit() {
    this.broadcastService.setHeaderText('Book Diagnostics');
    this.user = JSON.parse(localStorage.getItem('user'));
    this.user_id = this.user.id;
    this.user_refNo = this.user.refNo;
    this.getOrderCountById();
    this.loadAllMasterData();
    this.addressTypeList = [{ id: 1, Type: "Home" }, { id: 2, Type: "Office" }, { id: 3, Type: "Custom Address Type" }];
    this.diagnosticsFromPrescription = GetSet.getDiagnosticsFromPrescription();
    if(this.diagnosticsFromPrescription) {
      this.diagnosticsFromPrescription.doctorRecommendedTestList.forEach(element => {
        this.diagnosticsList.push({
          'longName': element.medicalAttributeName,
          'id': element.medicalAttributePk
        });
      });
      let userType;
      this.patientRefNo = this.diagnosticsFromPrescription.prescriptionForUserRefNo;
      if(this.diagnosticsFromPrescription.prescriptionFor == 'me') {
        userType = 1;
        this.selectUser(userType);
      } else if (this.diagnosticsFromPrescription.prescriptionFor == 'group') {
        userType = 2;
        this.selectUser(userType);
      } else if (this.diagnosticsFromPrescription.prescriptionFor == 'minor') {
        userType = 4;
        this.selectUser(userType);
      }
      this.getAppoinmentType(userType);
    }
  }

  ngOnDestroy() {
    GetSet.setDiagnosticsFromPrescription(null);
  }

  selectUser(userType) {
    let i = 0;
    for(let type of this.appoinmentTypeLists) {
      if(type.id == userType) {
        this.appoinmentTypeLists[i].isChecked = true;
      } else {
        this.appoinmentTypeLists[i].isChecked = false;
      }
      i = i + 1;
    }
  }

  getAppoinmentType(appointFor: any) {
    this.appointmentForSeelection = appointFor.toString();
    switch (appointFor.toString()) {
      case '1': {// For me selection  `
        this.showAppoinmentForMe = true;
        this.showAppoinmentForGroup = false;
        this.showAppoinmentForMinor = false;
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);
        this.patientRefNo = user.refNo;
        this._individualService.getUserFullProfile(user.refNo).subscribe(res => {
          this.appSIgnUp.userName = res.data.firstName;
          this.appSIgnUp.mobileNo = res.data.contactNo;
        });
        break;
      }
      case '2': {// group member selection
        this.userGroupMembers = [];
        this.showAppoinmentForMinor = false;
        this.showAppoinmentForMe = false;
        this.showAppoinmentForGroup = true;
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);

        this._individualService.getGroupMember(user.refNo + '?permission=ALL').subscribe((groups) => {
          for (let groupMember of groups.data) {
            if (groups) {
              if(this.diagnosticsFromPrescription) {
                if(groupMember.userRefNo == this.diagnosticsFromPrescription.prescriptionForUserRefNo) {
                  groupMember['isChecked'] = true;
                } else {
                  groupMember['isChecked'] = false;
                }
              }
              this.userGroupMembers.push(groupMember);
              this.userGroupMembers = this.userGroupMembers.filter(member => member.id != user.id);
            }
          }
          //new add for sorting by member name--10.05.2019
          this.userGroupMembers.sort((a, b) => a.name.localeCompare(b.name));
        });
        break;
      }
      case '3': {// known member selection
        this.showAppoinmentForMe = true;
        this.showAppoinmentForGroup = false;
        this.showAppoinmentForMinor = false;
        this.appSIgnUp.userName = '';
        this.appSIgnUp.mobileNo = '';
        break;
      }
      case '4': {//Minor User selection
        this.userForMinor = [];
        this.showAppoinmentForMinor = true;
        this.showAppoinmentForMe = false;
        this.showAppoinmentForGroup = false;
        let user: any = localStorage.getItem('user');
        user = JSON.parse(user);
        this._individualService.listViewOfMinor(this.user_refNo)
          .subscribe(data => {
            if(data.status == 2000) {
              if(this.diagnosticsFromPrescription) {
                let i = 0;
                for(let minor of data.data) {
                  if(minor.minor.userRefNo == this.diagnosticsFromPrescription.prescriptionForUserRefNo) {
                    data.data[i].minor['isChecked'] = true;
                  } else {
                    data.data[i].minor['isChecked'] = false;
                  }
                i = i + 1;
                }
              }
              this.userForMinor = data.data;
            }
          }, (error) => {

          });
        break;
      }
    }
  }

  getOrderCountById() {
    // let user = JSON.parse(localStorage.getItem('user'));
    if (this.user) {
      this.apiService.AddressById.getByPath(this.user.refNo).subscribe((result) => {
        this.addressList = result.data;

        for (let address of this.addressList) {
          this._individualService.getValidateDeliverAddress("MEDICINE/" + address.pinCode).subscribe(response => {
            address['service_available'] = response.data;
            // this.addressList.push(address);
            // this.addressData.push(address);
            address['customCssClass'] = this.setcustomCssClass(address);
            address['customCssClassCursor'] = this.setcustomCssClassCursor(address);
            //this.defaultSelectAddressOnReorderMed();//calling the method to default select address if reorder medicine
          });
        }//end of for
        this.addressData = this.addressList;
      });
    }//end of user check
  }//end of method

  setcustomCssClass(address): string {
    address['selected'] ? address['customcssforselected'] = 'selected-card' : address['customcssforselected'] = '';
    if (!address.service_available) {
      address['customcssforselected'] = '';
      address['customcssfordisable'] = 'disabledDeliverAddressForDiagnosis';
      // address['customcssfordisablecursor'] = 'disabledDeliverAddressCursor';
    } else {
      address['customcssfordisable'] = '';
      // address['customcssfordisablecursor'] = '';
    }
    // address.service_available? address['customcssfordisable'] = '': ( address['customcssforselected'] = '' address['customcssfordisable'] = 'disabledDeliverAddress';)
    let customCssStr = address['customcssforselected'] + ' ' + address['customcssfordisable'];
    return customCssStr;
  }//end of method

  setcustomCssClassCursor(address) {
    address['selected'] ? address['customcssforselected'] = 'selected-card' : address['customcssforselected'] = '';
    if (!address.service_available) {
      address['customcssforselected'] = '';
      address['customcssfordisablecursor'] = 'disabledDeliverAddressCursor';
    } else {
      address['customcssfordisablecursor'] = '';
    }
    let customCssStrCursor = address['customcssforselected'] + ' ' + address['customcssfordisablecursor'];
    return customCssStrCursor;
  } //end of method

  selectAddress(addresses) {
    this.reSetSelrctedAddress();
    this.addressId = addresses.id;
    this.selectedAddress = addresses;
    addresses["customCssClass"] = 'selected-card';
    addresses['customCssClassCursor'] = '';//to remove disable class
    addresses['customCssStr']
    addresses["selected"] = true;
  }//end of method

  reSetSelrctedAddress() {
    this.addressList.forEach(item => {
      item["selected"] = false;
      item['customCssClass'] = this.setcustomCssClass(item);
    });
  }

  onclickGroupUser(groupMember: any) {
    this.patientRefNo = groupMember.userRefNo;
  }
  onclickMinorUser(userForMinor: any) {
    this.patientRefNo = userForMinor.minor.userRefNo;
  }

  addNewAddress() {
    this.addressForm.patchValue({
      'line1': "",
      'line2': "",
      'country': "",
      'state': "",
      'city': "",
      'pinCode': "",
      'addressType': ""
    })
    this.isEdit = true;
    let defaultCountryName: string = '';
    this.masterCOUNTRY.filter((elm) => {
      if (elm.countryName == 'India') {
        defaultCountryName = elm.countryName;
      };
    });
    this.addressForm.patchValue({
      'country': defaultCountryName
    });
    this._individualService.getMasterDataState(this.addressForm.get('country').value).subscribe((data) => {
      this.masterSTATE = data.data;
      let address = this.addressData.filter(x => x["id"] == this.addressForm.value.id)[0];
      if (address && this.masterSTATE.filter(x => x["stateName"] == address.state).length > 0) {
        this.addressForm.patchValue({
          'state': address.state
        });
      }
    })
  }

  search(event) {
    this._individualService.getDiagnostics(event.query).subscribe((data) => {
      // this._doctorService.getInvestigationTypeAheadList(event.query).subscribe((data)=>{ 
      this.labTestList = data.data;
    });
  }

  onClickMedAddByMedSearchDrpDwn(diagnostics) {
    if(this.diagnosticsList.find(x => x.id == diagnostics.id)) {
      this.toastService.showI18nToast('You have already added the same DIAGNOSTIC TEST', 'error');
      return;
    } else {
      this.diagnosticsList.push(diagnostics);
    }
  }

  deleteDiagnostics(diagnostics, index) {
    this.diagnosticsList.splice(index, 1);
  }

  onBackOperation() {
    this.isEdit = false;
    this.addressForm.reset();
  }

  loadAllMasterData() {
    this._individualService.getMasterDataCountry().subscribe(data => {
      if (data.status === 2000) {
        this.masterCOUNTRY = data.data;
      } else {
        alert(data.message);
      }
    });
  }

  getStateCasCadeToCounntry(ctrl: any) {
    this.masterSTATE = [];
    this.addressForm.patchValue({
      'state': ""
    });
    // if (this.addressForm.value.country == "") return;

    this._individualService.getMasterDataState(this.addressForm.value.country).subscribe(data => {
      if (data.status === 2000) {
        this.masterSTATE = data.data;
        let address = this.addressData.filter(x => x["id"] == this.addressForm.value.id)[0];
        if (address && this.masterSTATE.filter(x => x["stateName"] == address.state).length > 0) {
          ctrl.patchValue({
            'state': address.state
          });
        }
      }
    }, (error) => {

    });
  }

  saveAddress(addressForm: any) {
    // let addValue = addressForm.value;
    addressForm.patchValue({
      'isSubmit': true
    });
    if (addressForm.invalid) {
      return;
    }


    let query = {
      'line1': this.addressForm.get('line1').value,
      'line2': this.addressForm.get('line2').value,
      'country': this.addressForm.get('country').value,
      'city': this.addressForm.get('city').value,
      'addressType': this.addressForm.get('addressType').value,
      'state': this.addressForm.get('state').value,
      'pinCode': this.addressForm.get('pinCode').value,
      // 'id': this.addressForm.get('id').value
    }
    // if(addValue.id<1){
    //   delete query["id"];
    // }
    //this.isAnyAddressInEditState = false;
    this._individualService.updateUserProfile({
      'updateSection': 'ADDRESS',
      'userRefNo': this.user_refNo,
      'addressList': [query]
    }).subscribe((data) => {
      if (data.status === 2000) {
        this.getOrderCountById();
        //this.editToggleAddress(ctrl);
        this.addressForm.reset();
      }
      this.toastService.showI18nToast(data.message, 'success');

    }, (error) => {
      // handle error
    });
    //this.oldItems = [];
    //this.isEditDeleteAllowed = true;
    this.isEdit = false;
    // if(this.addressTypeList.length > 2) {
    //   this.addressTypeList.push({id: this.newId+1, Type: "Custom Address Type"});
    // }
  }

  createNewAddressType(ev: any, ctrl: any) {
    if (ev.target.value === 'Custom Address Type' || ev.target.value === 'create') {
      this.addressT = "";
      this.modalRef = this.bsModalService.show(this.addressTypeTemp, { class: 'modal-lg', backdrop: 'static' });
      this.modalRef["ctrl"] = ctrl;
    } else {
      if (this.addressData.filter(x => x["addressType"] == ev.target.value && x["id"] != ctrl.value.id).length > 0) {
        let currentAddress = this.addressData.filter(x => x["id"] == ctrl.value.id)[0];
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

  createAddresType() {
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
    }
    else {
      this.toastService.showI18nToast('USER_ADDRESS_TOAST.ADDRESS_NOT_BE_BLANK', 'warning');
    }
  }

  onKeydown($event) {
    if(($event.key == "!" || $event.key == "@" || $event.key == "#" || $event.key == "$" || $event.key == "%" || $event.key == "^" || $event.key == "&" || $event.key == "*" || $event.key == "(" || $event.key == ")") ||($event.keyCode >= 186 && $event.keyCode <= 222) || ($event.keyCode >= 106 && $event.keyCode <= 111)) 
      return false;
  }

  proceedDiagnostics() {
    if(this.diagnosticsList.length == 0) {
      this.toastService.showI18nToast('please add a diagnostics!', 'warning');
      return;
    } else if (!this.patientRefNo && !this.addressId) {
      this.toastService.showI18nToast('please select address and for whom you want to book!', 'warning');
      return;
    } else if (this.patientRefNo && !this.addressId) {
      this.toastService.showI18nToast('please select address to book', 'warning');
      return;
    } else if (!this.patientRefNo && this.addressId) {
      this.toastService.showI18nToast('please choose whom you wanted to book diagnostics', 'warning');
      return;
    }
    // if(!this.patientRefNo) {
    //   this.toastService.showI18nToast('please select a patient', 'warning');
    //   return;
    // }
    this.isLab = true;

    let diagnosticsArr = [];
    this.diagnosticsList.forEach(element => {
      diagnosticsArr.push(element.id);
    });
    let query = {
      "userAddress": this.addressId,
      "diagonasticTestList": diagnosticsArr
    }
    this._individualService.findDiagnosticLab(query).subscribe(resp => {
      if(resp.status == 2000) {
        this.labs = resp.data;
        let index = 0;
        for(let lab of this.labs) {
          this.labs[index]['isSelected'] = false;
          index = index + 1;
        }
        let lowestDistance = this.labs.map(x => (+x.distance_in_km)).reduce((a, b)=>Math.min(a, b));
        this.selectLab(this.labs.find(x => (+x.distance_in_km) === lowestDistance));
      }
    });
  }

  orderDiagnostics() {
    if(!this.labRefNo) {
      this.toastService.showI18nToast("Please select a lab", "warning");
      return;
    } else {
      let orderItems = [];
      this.diagnosticsList.forEach(element => {
      orderItems.push({
        itemId: element.id,
        numUnits: 1,
        prescriptionRequired: false,
        medicine: "",
        itemName: element.longName,
        discount: 0,
        tax: 0,
        netAmount: element.price,
        patientRefNo: this.patientRefNo,
        prescriptionRefNo: null,
        price: element.price
      });
    });
    this.bookDiagnosticsQuery = {
      "userRefNo": this.user_refNo,
      "requisitionRefNo": null,
      "netAmount": orderItems.map(data => (+parseInt(data['netAmount']))).reduce((a, b) => a + b, 0),
      "grossAmount": orderItems.map(data => (+parseInt(data['netAmount']))).reduce((a, b) => a + b, 0),
      "charges": 0,
      "discount": 0,
      "taxAmount": 0,
      "addressId": this.addressId,
      "deliveryOption": "STANDARD",
      "labRefNo": this.labRefNo,
      "deliveryCharge": 0,
      "orderItems": orderItems
    }
    this.getAllFeesByItem(orderItems);
      // this._individualService.bookDiagnostics(this.bookDiagnosticsQuery).subscribe(result => {
      //   if(result.status == 2000) {
      //     GetSet.setAddress(this.selectedAddress);
      //     GetSet.setDiagnostics(this.diagnosticsList);
      //     GetSet.setDiagnosticsResp(result.data);
      //     GetSet.setPlaceOrderData(result.data);
      //     this.router.navigate(['/individual/review-diagnostics']);
      //   }
      // });
    }
  }

  getAllFeesByItem(orderItems) {
    let query = {
      "itemType": "DIAGNOSTIC",
	    "amount": orderItems.map(data => (+parseInt(data['netAmount']))).reduce((a, b) => a + b, 0),
	    "deliveryTypeId":"STANDARD",
    }
    this._individualService.getAllFees(query).subscribe((resp) => {
      // this.deliveryCharge = (+resp.data.deliveryCharge.fees);
      // this.discount = (+resp.data.discount.fees);
      // for(let tax of resp.data.taxes) {
      //   this.tax = this.tax + (+tax.fees);
      // }
      // this.getGrandTotal();
      if(resp.status == 2000) {
        this.bookDiagnosticsQuery.discount = (+resp.data.discount.fees);
        this.bookDiagnosticsQuery.deliveryCharge = (+resp.data.deliveryCharge.fees);
        if(resp.data.taxes.length != 0) {
          for(let tax of resp.data.taxes) {
            this.tax = this.tax + (+tax.fees);
          }
        } else {
          this.tax = 0;
        }
        this.bookDiagnosticsQuery.taxAmount = this.tax;
        this.bookDiagnosticsQuery.netAmount = this.bookDiagnosticsQuery.netAmount-this.bookDiagnosticsQuery.discount;
        GetSet.setAddress(this.selectedAddress);
        GetSet.setDiagnostics(this.diagnosticsList);
        GetSet.setDiagnosticsQuery(this.bookDiagnosticsQuery);
        this.router.navigate(['/individual/review-diagnostics']);
      }
    });
  }

  selectLab(selectedLab) {
    this.labRefNo = selectedLab.lab_ref_no;
    let index = 0;
    let labIndex = 0;
    for(let lab of this.labs) {
      if(selectedLab.lab_ref_no == lab.lab_ref_no) {
        this.labs[labIndex].isSelected = true;
        // this.selectedLab = true;
      } else {
        this.labs[labIndex].isSelected = false;
      }
      labIndex = labIndex + 1;
    }
    for(let diagnostics of this.diagnosticsList) {
      let i = selectedLab.diagnosticTestDetails.findIndex(x => x.test_pk === diagnostics.id);
      this.diagnosticsList[index]['price'] = selectedLab.diagnosticTestDetails[i].price;
      index = index + 1;
    }
  }
  
  changeName(event, type) {
    if(type == 'userName') {
      this.appSIgnUp.userName = event;
    }
  }

  //for mobile component
  changeNumber(event, type , i) {
    if(event) {
      if(type == 'signupUserNumber') {
        this.appSIgnUp.mobileNo = event.internationalNumber.replace(/\s/g, "");
      }
    }
  } // end of method
  
}

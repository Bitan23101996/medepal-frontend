/*******************************************************************************
 * * |///////////////////////////////////////////////////////////////////////|
 * * |                                                                       |
 * * | Copyright (C) STELLABLUE INTERACTIVE SERVICES PVT. LTD.               |
 * * | All Rights Reserved                                                   |
 * * |                                                                       |
 * * | This document is the sole property of StellaBlue Interactive          |
 * * | Services Pvt. Ltd.                                                    |
 * * | No part of this document may be reproduced in any form or             |
 * * | by any means - electronic, mechanical, photocopying, recording        |
 * * | or otherwise - without the prior written permission of                |
 * * | StellaBlue Interactive Services Pvt. Ltd.                             |
 * * |                                                                       |
 * * |///////////////////////////////////////////////////////////////////////|
 ******************************************************************************/
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { SBISConstants } from 'src/app/SBISConstants';
import { Router } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { environment } from '../../../../environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { AppoinmentService } from '../../appoinment/appoinment.service';
import { ToastService } from '../../../core/services/toast.service';
import { HttpClient, HttpResponse, HttpRequest } from '@angular/common/http';
import { ApiService } from 'src/app/core/services/api.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { DoctorService } from '../../doctor/doctor.service';
import { ServiceProviderService } from '../service-provider.service';
import { JsonTranslation } from '../../../shared/translation';
import { GetSet } from '../../../core/utils/getSet';
//import { ServiceProviderService } from '../service-provider.service';

@Component({
  selector: 'app-manage-room',
  templateUrl: './manage-room.component.html',
  styleUrls: ['./manage-room.component.css']
})
export class ManageRoomComponent implements OnInit {

  //Room
  addRoom: any;
  saveRoomForm: FormGroup;
  todate: Date = new Date();
  buttonClassAnother: any;
  visibleSidebarRoom: boolean = false;
  roomCategory: any;
  buttonClassCurrent: any;
  description: any;
  noOfRooms: any;
  isAc: any;
  isExtraPersonAllowed: any;
  isDayRental: any;
  bedChargePerDay: any;
  isDayCharge: any;
  extraPeersonChergPerDay: any;
  fromDate: any;
  minDate: Date;
  title: any;
  submitted: any = false;
  showNextPanel: boolean = false;
  noOfBeds: boolean = true;
  disabledExtraPersonAllowed: boolean = true;
  disableDayRental: boolean = true;
  dateFormat: any;
  showMsg: boolean = false;
  showMsgDay: boolean = false;
  resdata: any = [];
  query: any
  currentRoomDetails: any;
  isEdit: boolean = false;
  isDisabledNext: boolean = false;
  isPaginator = false;
  isCheckBoxDisbl = false;
  referenceNo: string;
  status: any;
  panelVisible: boolean = false;
  isDisablSave: boolean = true;
  hideChkBox: boolean = false;
  disabeledCalender: boolean = true;
  roomCategoryList: any = [];
  confirmationMsg: any = [];
  departmentList: any = [];
  isChecked : boolean = false;
  shwMsg : boolean = false;
  shwDayMsg : boolean = false;
  shwExtraChargeMsg : boolean = false;
  showDayCharge : boolean = false;
  showExtraPersonCharge : boolean = false;
  rateEffectiveFrom : any;
    loading : boolean = false;



  constructor(private fb: FormBuilder, private translate: TranslateService,
    private manageRoomService: ServiceProviderService,
    private toastService: ToastService,
    private jsonTranslate: JsonTranslation,
    private router: Router) {
    translate.setDefaultLang('en');
    translate.use('en');
    this.minDate = new Date();
  }




  ngOnInit() {
    this.loading= true;
    document.body.classList.add('hide-bodyscroll');
    this.dateFormat = environment.DATE_FORMAT;
    // this.stat = [];
    // this.user = JSON.parse(localStorage.getItem('user'));
    // this.userRefNo = this.user.refNo;
    // this.rolePk = this.user.rolePk;
    // this.roleName = this.user["roleName"];
    this.addRoom = this.createForm();
    const url = window.location.href.toString();
    this.title = "Room Category"
    this.getAllRoomSummeryDetails();
    this.getDepartmentDetails();
    this.roomDto.valueChanges.subscribe(data => {
      let cnt = 0;
      for (let i = 0; i < data.length; i++) {
        if (data[i].noBeds != null) {
          if (data[i].noBeds != "") {
            cnt++;
          }
        }
      }
      if (cnt > 1 || cnt == 0) {
        this.isCheckBoxDisbl = true;
      } else {
        this.isCheckBoxDisbl = false;
      }
    });

    this.deleteRoomArray = [];
  }

  get roomDto(): FormArray {
    return this.saveRoomForm.get('roomDto') as FormArray;
  }

  goToNext() {
    this.shwDayMsg = false;
     this.saveRoomForm.controls.isModified.patchValue(this.saveRoomForm.dirty);

    if (this.saveRoomForm.value.noOfRooms == '' || this.saveRoomForm.value.noOfRooms == null) {
      this.submitted = true;
      this.isDisabledNext = false;
      this.showNextPanel = false;
    } else { //app issue 1560

      this.showNextPanel = true;
    }
    if(this.saveRoomForm.value.rateEffectiveFrom == '' || this.saveRoomForm.value.rateEffectiveFrom == null) {
           this.shwMsg = false;
        }else{
           this.shwMsg = true;
       }
      //END app issue 1560
      


    let noOfRooms = this.saveRoomForm.value.noOfRooms;
    // let roomArr: FormGroup[] = [];
    // this.saveRoomForm.patchValue({
    //   roomDto: this.fb.array(roomArr)
    // })
    let rooms = this.saveRoomForm.get('roomDto') as FormArray;

    while (rooms.length !== 0) {
      rooms.removeAt(0)
    }


    let roomList = this.saveRoomForm.get('roomDto') as FormArray;
    for (let i = 0; i < noOfRooms; i++) {
      this.roomDto.push(this.createRoomList());
    }
    return
  }

  createRoomList(): FormGroup {
    return this.fb.group({
      roomNo: [null, [Validators.required]],
      noBeds: [null, [Validators.required]],
      department: [null],
      refNo: [null]
    })
  }

  createForm() {
    let roomArr: FormGroup[] = [];
    this.saveRoomForm = this.fb.group({
      refNo: this.referenceNo,
      roomCatagory: [null, Validators.required],
      description: [null],
      noOfRooms: [null, [Validators.required]],
      acFlag: [null],
      extraPersonAllowedFlag: [null],
      dayRentalFlag: [null],
      bedChargesPerDay: [null, [Validators.required]],
      extraPersonChargePerDay: [null],
     // rateEffectiveFrom: [this.fromDate, [Validators.required]],
     rateEffectiveFrom: [new Date(), [Validators.required]],
      dayCharges: [null],
      noOfBeds: [null],
      roomDto: this.fb.array(roomArr),
      isModified: [false],
      status: ['NRM']
    })
  }
  saveRoomDetails() {

  }
  closeSideBar() {
    this.visibleSidebarRoom = false;
    this.isDisabledNext = false;
    this.showNextPanel = false;
    this.saveRoomForm.reset();
    this.saveRoomForm.patchValue({
      rateEffectiveFrom : new Date()
    })
  }


  chkBedNo(event) {
    let filledValueObj = this.roomDto.value.find(room => room.noBeds != null)

    if (event.target.checked) {
      for (let room of this.roomDto.controls) {
        room.patchValue({
          noBeds: filledValueObj.noBeds
        })
      }
    }
    else {
      for (let room of this.roomDto.controls) {
        room.patchValue({
          noBeds: null
        })
      }
    }
  }



  submit() {

    this.submitted = true;
    this.shwMsg  = true;
    
      if(this.saveRoomForm.value.dayRentalFlag && this.saveRoomForm.value.dayCharges == null){
        this.submitted = true;
        this.saveRoomForm.get('dayCharges').setValidators([Validators.required]);
      }
    
    
    if(this.saveRoomForm.value.dayRentalFlag){
      this.saveRoomForm.get('dayCharges').setValidators([Validators.required]);
      this.disableDayRental = false;
      
    } else{
      this.disableDayRental = true;
      this.saveRoomForm.get('dayCharges').clearValidators();
      this.saveRoomForm.get('extraPersonChargePerDay').setValidators(null);
     
      this.saveRoomForm.patchValue({
        dayCharges: null
      });
    }

    if(this.saveRoomForm.value.extraPersonAllowedFlag){
      this.saveRoomForm.get('extraPersonChargePerDay').setValidators([Validators.required]);
      this.disabledExtraPersonAllowed = false;
    }else{
      this.disabledExtraPersonAllowed = true;
      this.saveRoomForm.get('extraPersonChargePerDay').clearValidators();
     
      this.saveRoomForm.patchValue({
        extraPersonChargePerDay: null
      });
    
    }
    

    this.saveRoomForm.controls.isModified.patchValue(this.saveRoomForm.dirty);
   
    if (this.saveRoomForm.invalid) {
      return false;
    }
    if (this.saveRoomForm.value.acFlag)
      this.saveRoomForm.value.acFlag = "Y";
    else
      this.saveRoomForm.value.acFlag = "N";
    if (this.saveRoomForm.value.extraPersonAllowedFlag) {
      this.saveRoomForm.value.extraPersonAllowedFlag = "Y";
    
    }
    else {
      this.saveRoomForm.value.extraPersonAllowedFlag = "N";
    }

    if (this.saveRoomForm.value.dayRentalFlag) {
      this.saveRoomForm.value.dayRentalFlag = "Y";
     

    }
    else {
      this.saveRoomForm.value.dayRentalFlag = "N";
    
    }
    this.assignCLXForRoom();

    this.manageRoomService.saveRoom(this.saveRoomForm.value).subscribe(result => {
      this.getAllRoomSummeryDetails();

      if (result.status == 2000) {
        if (this.referenceNo == null || this.referenceNo == '') {
        //  this.toastService.i18nToast("en", result.message, "success");
          let confMsg = this.jsonTranslate.translateJson('ROOM.SAVE_ROOM');
          this.confirmationMsg.push(confMsg);
          let confirmationInfo = {};

          confirmationInfo['confirmationMsg'] = this.confirmationMsg;
          confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
          confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.ROOM;
          confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME_FOR_ROOM_CATEGORY.SAVE;
          // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME_FOR_ROOM_CATEGORY.SAVE;

          //confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.DIAGNOSTICS;
          //confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.DIAGNOSTICS;
          //confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.DIAGNOSTICS;
          GetSet.setConfirmationInfo(confirmationInfo);

          //end of confirm page info set
          this.router.navigate(['confirmation']);
        } else {
          //this.toastService.i18nToast("en", result.message , "success");
          let confMsg = this.jsonTranslate.translateJson('ROOM.UPDATE_ROOM');
          this.confirmationMsg.push(confMsg);
          let confirmationInfo = {};

          confirmationInfo['confirmationMsg'] = this.confirmationMsg;
          confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
          confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.ROOM;
          confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME_FOR_ROOM_CATEGORY.UPDATE;
          // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME_FOR_ROOM_CATEGORY.UPDATE;

          //confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.DIAGNOSTICS;
          //confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME.DIAGNOSTICS;
          //confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.DIAGNOSTICS;
          GetSet.setConfirmationInfo(confirmationInfo);

          //end of confirm page info set
          this.router.navigate(['confirmation']);
        }
   

      }


      else {
        this.toastService.i18nToast("en", result.message, "error");
      }

      this.ngOnInit();
    }, (error) => {
      this.submitted = false;
      this.ngOnInit();
      return
    });

    this.visibleSidebarRoom = false;
   
    //this.changeExtraPersonFlag(event);
  }


  changeExtraPersonFlag(event) {
    if (event.target.checked) {
      this.showExtraPersonCharge = true;
      this.saveRoomForm.get('extraPersonChargePerDay').setValidators([Validators.required]);
      this.disabledExtraPersonAllowed = false;
    } else {
      this.showExtraPersonCharge = false;
      this.disabledExtraPersonAllowed = true;
      this.saveRoomForm.get('extraPersonChargePerDay').clearValidators();
      this.saveRoomForm.patchValue({
        extraPersonChargePerDay: null
      });
    }
  }

  processDuplicateCheck(e,index){
        for(let i = 0; i < this.roomDto.length; i++){
    
            if(i!=index && e.target.value == this.roomDto.controls[i].value.roomNo){
           this.toastService.showI18nToast("Duplicate Room No/Name not allowed", 'error');
            this.roomDto.controls[index].patchValue({
              roomNo : null
            })
            break;
         }
       }
    
    }
    

  changeDayRentalFlag(event) {
    if (event.target.checked) {
      this.showDayCharge = true;
      this.saveRoomForm.get('dayCharges').setValidators([Validators.required]);
      this.disableDayRental = false;
    } else {
      this.showDayCharge = false;
      this.disableDayRental = true;
      this.saveRoomForm.get('dayCharges').clearValidators();
      //this.saveRoomForm.get('extraPersonChargePerDay').setValidators(null);
      this.saveRoomForm.patchValue({
        dayCharges: null
      });
    }
  }

  getAllRoomSummeryDetails() {
    this.manageRoomService.getAllHospitalRoomDetails(this.query)
      .subscribe(data => {
        if (data.data != null)
          this.resdata = data.data;
          // if(this.resdata.length == 0){
          //     this.title="Sorry! No Records Found!"
          // }
        this.roomCategoryList = data.data
        if (this.resdata.length > 5) {
          this.isPaginator = true;
        } else {
          this.isPaginator = false;
        }
      }, (error) => {

      });
  };


  fillSaveRoomFormField(currentRoomDetails) {
    this.title = "";
    this.title = "UPDATE ROOM CATEGORY";
    this.disabeledCalender = false;
    this.isDisabledNext = true;
    this.hideChkBox = false;
    this.referenceNo = currentRoomDetails.refNo;
    var request = {
      "refNo": currentRoomDetails.refNo
    }

    let hospitalRfNo = currentRoomDetails.refNo;
    this.manageRoomService.getAllHospitalRoomCatrgoryDetails(request)
      .subscribe(data => {
        this.currentRoomDetails = data.data;

        if(this.currentRoomDetails.acFlag == "N"){
                 this.isChecked = false;
              }
              else if(this.currentRoomDetails.acFlag == "Y"){
                 this.isChecked = true;
              }

        if (data.data.dayRentalFlag == "N") {

          this.disableDayRental = true;
        }

        else if (data.data.dayRentalFlag == "Y") {
          this.showDayCharge = true;
          this.disableDayRental = false;
        }


        if (data.data.extraPersonAllowedFlag == "N") {
        
          this.disabledExtraPersonAllowed = true;
        } else if (data.data.extraPersonAllowedFlag == "Y") {
          this.showExtraPersonCharge = true;
          this.showMsg = true;
          this.disabledExtraPersonAllowed = false;
          

        }
        this.editForm(this.currentRoomDetails);
      }, (error) => {

      });

    this.openEditSideBar()

  }

  editForm(currentRoomDetails) {

    this.isEdit = true;
    let roomArr: FormGroup[] = [];
    if (currentRoomDetails.roomDto.length > 0) {
      // for(let i = 0; i < currentRoomDetails.roomDto.length; i++){
      //   roomArr.push(currentRoomDetails.roomDto[i]);
      // }
      this.showNextPanel = true;
    }
    this.saveRoomForm = this.fb.group({
      refNo: this.referenceNo,
      roomCatagory: [currentRoomDetails.roomCatagory, Validators.required],
      description: [currentRoomDetails.description],
      noOfRooms: [currentRoomDetails.noOfRooms, [Validators.required]],
      acFlag: [currentRoomDetails.acFlag == "N" ? false : true],
      extraPersonAllowedFlag: [currentRoomDetails.extraPersonAllowedFlag == "N" ? false : true],
      dayRentalFlag: [currentRoomDetails.dayRentalFlag == "N" ? false : true],
      bedChargesPerDay: [currentRoomDetails.bedChargesPerDay, [Validators.required]],
      extraPersonChargePerDay: [currentRoomDetails.extraPersonChargePerDay,[Validators.required]],
      rateEffectiveFrom: [new Date(currentRoomDetails.rateEffectiveFrom), [Validators.required]],
      dayCharges: [currentRoomDetails.dayCharges],
      roomDto: this.fb.array(roomArr),
      isModified: [false]

    })

    let roomArrList: any
    for (let i = 0; i < currentRoomDetails['roomDto'].length; i++) {
      roomArrList = this.saveRoomForm.get('roomDto') as FormArray;
      roomArrList.push(this.editRoomList(currentRoomDetails['roomDto'][i]));
    }
  }

  editRoomList(res): FormGroup {
    return this.fb.group({
      roomNo: [res.roomNo, [Validators.required]],
      noBeds: [res.noBeds, [Validators.required]],
      refNo: [res.refNo],
      department: [res.department],
      status: [res.status]
    })
  }

  openEditSideBar() {
    this.visibleSidebarRoom = true;

  }

  addRooms() {
    this.title = "ADD ROOM CATEGORY";
    this.showDayCharge = false;
    this.showExtraPersonCharge = false;
    this.hideChkBox = true;
    this.visibleSidebarRoom = true;
    this.isEdit = false;
    this.submitted = false;
    this.isDayRental = true;
    this.isExtraPersonAllowed = true;
    this.disabeledCalender = true;
  }
  goTocancel() {
    this.isEdit = false;
    this.isDisabledNext = false;
    this.showNextPanel = false;
    this.isCheckBoxDisbl = false;
  }



 
  deleteRoomCategory(index, rowData) {
     // app/issues/1561
   if (confirm("Are you sure you want to delete room category "+rowData.category +"?")) {
     // end app/issues/1561

      this.manageRoomService.deleteRoom(rowData).subscribe(res => {
        // alert("deleteted")

        this.getAllRoomSummeryDetails();
        //this.toastService.showI18nToast("Room  Deleted Successfully", 'success');
        let confMsg = this.jsonTranslate.translateJson('ROOM.DELETE_ROOM');
        this.confirmationMsg.push(confMsg);
        let confirmationInfo = {};

        confirmationInfo['confirmationMsg'] = this.confirmationMsg;
        confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
        confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.ROOM;
        confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME_FOR_ROOM_CATEGORY.SAVE;
        //confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.DIAGNOSTICS;
        // confirmationInfo['buttonTwoName'] = SBISConstants.ACTION_BUTTON_NAME_FOR_ROOM_CATEGORY.SAVE;
        //confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.DIAGNOSTICS;
        GetSet.setConfirmationInfo(confirmationInfo);

        //end of confirm page info set
        this.router.navigate(['confirmation']);
      },
        (error) => {
          this.toastService.showI18nToast("Room Deletion Deletion Failed", 'error');
        });

    }
  }

  enableEffectiveDate(e) {
    if (e.target.value == null || e.target.value == "") {
      this.disabeledCalender = true;

    } else if(e.target.value != null) {
      this.disabeledCalender = false;
     
    }

  }



  addRoomData() {
    this.roomDto.push(this.createRoomList());
    let noOfRooms = parseInt(this.saveRoomForm.get('noOfRooms').value);
    noOfRooms++;
    this.saveRoomForm.patchValue({
      noOfRooms: noOfRooms
    })
  }

  deleteRoomArray: FormGroup[] = [];
  deleteRoom(index, room) {
    let noOfRooms = parseInt(this.saveRoomForm.get('noOfRooms').value);
    noOfRooms--;
    this.saveRoomForm.patchValue({
      noOfRooms: noOfRooms
    });
    if (this.roomDto.controls[index].get('refNo').value === null) {
      this.roomDto.controls.splice(index, 1);
      this.roomDto.value.splice(index, 1);
    }
    else {
      this.roomDto.value[index].status = "CXL";
      this.roomDto.controls.splice(index, 1);
      this.deleteRoomArray.push(this.roomDto.value[index]);
      this.roomDto.value.splice(index, 1);
    }
    this.saveRoomForm.markAsDirty();
  }

  assignCLXForRoom() {
    var roomList = this.saveRoomForm.get('roomDto') as FormArray;
    let value = roomList.value;
    for (let i = 0; i < this.deleteRoomArray.length; i++) {
      let existingPk = false;
      for (let j = 0; j < value.length; j++) {
        var deleteRoom: any = this.deleteRoomArray[i];
        if (value[j].refNo != '' && value[j].refNo == deleteRoom.refNo) {
          existingPk = true;
          break;
        }
      }
      if (!existingPk) {
        roomList.value.push(this.deleteRoomArray[i]);
      }
    }
  }


  resetAll() {

  }

  statusChange(event) {

  }

  filterTable(event, type) {
    this.resdata = this.roomCategoryList;
    if (type == 'ac') {
      if (event.target.checked) {
        this.resdata = this.resdata.filter(data => data.acFlag == "Y")
      }
      else {
        this.resdata = this.resdata;
      }
    }
    if (type == 'category') {
       if(event.target.value == "" || event.target.value == null){
          this.resdata = this.resdata;
  
       }
        else {
          this.resdata = this.resdata.filter(data => data.category.toLowerCase().startsWith(event.target.value.toLowerCase()));
    }
  
    }
  }

  changeEntity(entity) {
    // if(entity == "R"){
    //   this.showSettings = false;
    //   this.opdForm.controls.appointmentManagedBy.setValue("");
    //   this.opdForm.controls.feesPayableTo.setValue("");
    // } else if(entity == "D"){
    //   this.showSettings = false;
    //   this.opdForm.controls.appointmentManagedBy.setValue("");
    //   this.opdForm.controls.feesPayableTo.setValue("");
    // }
    // else{
    //   this.showSettings = true;
    //   this.opdForm.controls.appointmentManagedBy.setValue("H");
    //   this.opdForm.controls.feesPayableTo.setValue("H");
    // }
  }

  getDepartmentDetails() {
    this.manageRoomService.getDepartmentList()
      .subscribe(res => {
        for(let i = 0; i < res.length; i++ ){
          let data = {label: null, value: null};
          data.label = res[i].department;
          data.value = res[i].departmentPk;
          this.departmentList.push(data);
        }
        //this.departmentList = res;
        this.loading = false;
        document.body.classList.remove('hide-bodyscroll');
      });
  }

  checkDuplicateCategory(category){
    let payload = {
      category: category
    }
    this.manageRoomService.checkDuplicateCategory(payload).subscribe(res => {
      if(res.data!=null){
        this.toastService.showI18nToastFadeOut('ROOM.ROOM_CATEGORY_EXISTS', "error");
        this.saveRoomForm.patchValue({
          roomCatagory: null
        });
        // this.fillSaveRoomFormField(res.data)
        return;
      }
    });
  }

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

}//end of class

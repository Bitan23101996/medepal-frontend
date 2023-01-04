import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { SBISConstants } from '../../../SBISConstants';
import { ToastService } from '../../../core/services/toast.service';
import { DoctorService } from '../doctor.service';
import { BroadcastService } from '../../../core/services/broadcast.service';

@Component({
  selector: 'app-configure-online-consultation',
  templateUrl: './configure-online-consultation.component.html',
  styleUrls: ['./configure-online-consultation.component.css']
})
export class ConfigureOnlineConsultationComponent implements OnInit {

  configureOnlineConsultation: FormGroup;
  loggedInUser: any;
  saveStatus = false;
  submitted = false;
  timingValidationMsg: any;
  dayOfWeek: any;
  timingDataFromResponse: any = [];
  isNew: boolean;

  constructor(private fb: FormBuilder,private _toastService: ToastService, private _doctorService: DoctorService, 
    private broadcastService: BroadcastService) {
   
   }

  ngOnInit() {
    this.broadcastService.setHeaderText('CONFIGURE ONLINE CONSULTING');
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    this.createOnlineConsultationForm();
    this.setDays();
    this.getOnlineConsultationConfiguration();
    

  }

  setDays(){
    this.dayOfWeek = [
      {
        'key': '1',
        'value': 'Mon',
        'day': 'Monday'
      },
      {
        'key': '2',
        'value': 'Tue',
        'day': 'Tuesday'
      },
      {
        'key': '3',
        'value': 'Wed',
        'day': 'Wednesday'
      },
      {
        'key': '4',
        'value': 'Thu',
        'day': 'Thursday'
      },
      {
        'key': '5',
        'value': 'Fri',
        'day': 'Friday'
      },
      {
        'key': '6',
        'value': 'Sat',
        'day': 'Saturday'
      },
      {
        'key': '7',
        'value': 'Sun',
        'day': 'Sunday'
      }
    ];
  }

  createOnlineConsultationForm(){
    this.configureOnlineConsultation = this.fb.group({
      chamberRef: [null],
      refNo: [null],
      doctorRef: [this.loggedInUser.refNo],
      opdType: [SBISConstants.CHAMBER.ONLINE_CONSULTANCY_ENABLE],
      fees: [null, Validators.required],
      prepayAmount: [0.00],
      chamberTimingWeekViewList: []

    })
  }

  isConfigure: boolean = false;
  getOnlineConsultationConfiguration(){
    let payload = {
      "doctorRef": this.loggedInUser.refNo
    }
    this._doctorService.getOnlineConsultancyProvidedDoctor(payload).subscribe(res=>{
        if(res.data==null){
            this.isConfigure = false;
        }
        else{
            this.isConfigure = true;
        }
        this._doctorService.getOnlineConsultancyDetailsByDoctorRefNo(payload).subscribe(result=>{
          let res = result.data;
          console.log("res",res);
          if(res != null){
            this.isNew = true;
            let timingList: FormGroup[] = [];
            this.configureOnlineConsultation = this.fb.group({
              doctorRef: [this.loggedInUser.refNo],
              chamberRef: [res['refNo']],
              refNo: [res['refNo']],
              opdType: [res['opdType']],
              fees: [res['fees'], Validators.required],
              chamberTimingWeekViewList: [],
              prepayAmount : [res['prepayAmount']==null?"":res['prepayAmount']],
              doctorFeesPk: res.doctorFeesList ? 
                res.doctorFeesList[0].doctorFeesPk==null? null: res.doctorFeesList[0].doctorFeesPk : null
            });
            let chamberTimingData : any = [];
            this.timingDataFromResponse = [];
            for(let i = 0; i < res['chamberTimingWeekViewList'].length; i++){
              let payload = {
                  "mon":  res['chamberTimingWeekViewList'][i].mon,
                  "tue": res['chamberTimingWeekViewList'][i].tue,
                  "wed": res['chamberTimingWeekViewList'][i].wed,
                  "thu": res['chamberTimingWeekViewList'][i].thu,
                  "fri": res['chamberTimingWeekViewList'][i].fri,
                  "sat": res['chamberTimingWeekViewList'][i].sat,
                  "sun": res['chamberTimingWeekViewList'][i].sun,
                  "startTime": res['chamberTimingWeekViewList'][i].startTime.substring(0,5),
                  "endTime":  res['chamberTimingWeekViewList'][i].endTime.substring(0,5),
                  "rowIndex":  res['chamberTimingWeekViewList'][i].rowIndex,
              }
              this.timingDataFromResponse.push(payload)
            }
            console.log(this.timingDataFromResponse);
          }
          else{
            this.isNew = false;
          }
          
        })
    });
  }

  get lControls() { return this.configureOnlineConsultation.controls; }

  saveOnlineConsultationConfiguration(){
    var timingList = this.configureOnlineConsultation.get('chamberTimingWeekViewList') as FormArray;
    this.submitted =  true;
    if(this.configureOnlineConsultation.invalid) {
      if(timingList.value == null){
        this.timingValidationMsg = "Please enter chamber timing details";
      }
      else{
        this.timingValidationMsg = "";
      }
      this._toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.INCORRECT_ENTRY',"error");
      return;
    }

    if(timingList.value == null){
      this.timingValidationMsg = "Please enter chamber timing details";
      return;
    }
    else{
      this.timingValidationMsg = "";
    }

    for (let i = 0; i < timingList.value.length; i++) {
      let timing = timingList.value[i];
      if(timing.mon==false && timing.tue==false && timing.wed==false && timing.thu==false && timing.fri==false && timing.sat==false && timing.sun==false){
        this.timingValidationMsg = "Please select proper day of week";
        return;
      }
      else{
        this.timingValidationMsg = "";
      }
      if(timing.startTime==":00" || timing.startTime=="" || timing.endTime==":00" || timing.endTime==""){
        this.timingValidationMsg = "Please enter start time or end time properly";
        return;
      }
      else{
        this.timingValidationMsg = "";
      }
    }

    if (this.validateOverlappingChamberTiming() == 'false') {
      return false;
    }
    else {
      this.validateOverlappingChamberTimingAtServer();
    }

  }

  validateOverlappingChamberTiming(): string {
    var timingList = this.configureOnlineConsultation.get('chamberTimingWeekViewList') as FormArray;
    for (let i = 0; i < timingList.value.length; i++) {
      let timing = timingList.value[i];
      let startTime = timing.startTime.replace(/:/g, '');
      let endTime = timing.endTime.replace(/:/g, '');
      for (let j = 0; j < timingList.value.length; j++) {
        if (i == j) { continue; }
        let otherTiming = timingList.value[j];
        let otherStartTime = otherTiming.startTime.replace(/:/g, '');
        let otherEndTime = otherTiming.endTime.replace(/:/g, '');
        let dayOfWeekTiming = [];
        let dayOfWeekOtherTiming = [];
        if (timing.mon==true) dayOfWeekTiming.push(1); else dayOfWeekTiming.push(0);
        if (timing.tue==true) dayOfWeekTiming.push(2); else dayOfWeekTiming.push(0);
        if (timing.wed==true) dayOfWeekTiming.push(3); else dayOfWeekTiming.push(0);
        if (timing.thu==true) dayOfWeekTiming.push(4); else dayOfWeekTiming.push(0);
        if (timing.fri==true) dayOfWeekTiming.push(5); else dayOfWeekTiming.push(0);
        if (timing.sat==true) dayOfWeekTiming.push(6); else dayOfWeekTiming.push(0);
        if (timing.sun==true) dayOfWeekTiming.push(7); else dayOfWeekTiming.push(0);

        if (otherTiming.mon==true) dayOfWeekOtherTiming.push(1); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.tue==true) dayOfWeekOtherTiming.push(2); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.wed==true) dayOfWeekOtherTiming.push(3); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.thu==true) dayOfWeekOtherTiming.push(4); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.fri==true) dayOfWeekOtherTiming.push(5); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.sat==true) dayOfWeekOtherTiming.push(6); else dayOfWeekOtherTiming.push(0);
        if (otherTiming.sun==true) dayOfWeekOtherTiming.push(7); else dayOfWeekOtherTiming.push(0);

        console.log(this.diff(dayOfWeekTiming,dayOfWeekOtherTiming));
        //Get the matched day index
        let res = this.diff(dayOfWeekTiming,dayOfWeekOtherTiming);
        let result = 0;

        //if result is 0 => no matched day
        //if result is not 0 => matched day
        for(let i = 0; i <  res.length; i++){
          if(res[i] == 0) continue;
          else result = res[i];
        }


        if (parseInt(endTime) >= parseInt(otherStartTime)
          &&
          parseInt(startTime) <= parseInt(otherEndTime)
          &&
          result != 0
        ) {
          for (let k = 0; k < this.dayOfWeek.length; k++) {
            if (this.dayOfWeek[k].key == result) {
              this._toastService.showI18nToast('Overlapped record found at ' + this.dayOfWeek[k].day, "error");
              return 'false';
            }
          }

        }
      }
    }
  }

  validateOverlappingChamberTimingAtServer() {
    let reqObj: any = this.configureOnlineConsultation.value;
    reqObj['isOpd'] = SBISConstants.YES_NO_CONST.YES_ENUM;
    reqObj.prepayAmount = reqObj.fees; // new add for add advance fees in online consultation
    reqObj.chamberFeesList = []; 
    reqObj.chamberFeesList.push({
      amount: reqObj.fees.toString(), 
      description: "OPD FEES", 
      chamberType: SBISConstants.CHAMBER_TYPE.OPD,
      doctorFeesPk: reqObj.doctorFeesPk? reqObj.doctorFeesPk : null
    });
      reqObj['isIPD'] = SBISConstants.YES_NO_CONST.YES_ENUM;

    this._doctorService.validateChamberTimingList2(reqObj)
      .toPromise()
      .then(res => {
        console.log(JSON.stringify(res));
        let response: any = res;
        if (response.status == 2000) {
          this._toastService.showI18nToast(response.message, "error"); // app#1369
          return false;
        }
        else {
          this.saveOnlineConsultation();
        }
      })
      ,
      (error) => {
        this._toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
        this.submitted = false;
        return;
      }
  }

  saveOnlineConsultation() {
    console.log("request",this.configureOnlineConsultation.value);
    this._doctorService.saveDoctorChamber(this.configureOnlineConsultation.value)
      .toPromise()
      .then(res => {
        console.log(JSON.stringify(res));
        this._toastService.showI18nToast('DOCTOR_CHAMBER_VALIDATION.SAVE_SUCCESS' , 'success');
        //this.saveStatus = true;
        //this.getOnlineConsultationConfiguration();
        //this.router.navigate(['/doctor/myChamber']);
      });
  }

  diff(arr1,arr2) {
    var ret = [];
    for(var i in arr1) {   
        if(arr2.indexOf(arr1[i]) > -1){
            ret.push(arr1[i]);
        }
    }
    return ret;
  }

  getWorkScheduleData(workScheduleData){
    console.log(workScheduleData);
    let chamberTimingData : any = [];
    for(let i = 0; i < workScheduleData.length; i++){
      let payload = {
        "mon": workScheduleData[i].mon,
        "tue": workScheduleData[i].tue,
        "wed": workScheduleData[i].wed,
        "thu": workScheduleData[i].thu,
        "fri": workScheduleData[i].fri,
        "sat": workScheduleData[i].sat,
        "sun": workScheduleData[i].sun,
        "startTime": workScheduleData[i].startTime+":00",
        "endTime": workScheduleData[i].endTime+":00", //+":00"
        "rowIndex": workScheduleData[i].rowIndex,       
      }
      chamberTimingData.push(payload)
    }
    this.configureOnlineConsultation.patchValue({
      chamberTimingWeekViewList: chamberTimingData
    })
  }

  discontinueOnlineConsultancy(){
    if(confirm("Are you sure to discontinue Online Consultancy configuration?")){
      let payload = {
        "chamberRef": this.configureOnlineConsultation.value.chamberRef,
        "doctorRef": this.loggedInUser.refNo,
        "onlineConsultancyApplicable": 'N',
      }
  
      this._doctorService.discontinueOnlineConsultancy(payload).subscribe(result=>{
        //let res = result.data;
        if(result.status == 2000){
          this._toastService.showI18nToast('Online Consultancy discontinued successfully.' , 'success');
          //this.createOnlineConsultationForm();
          //this.getOnlineConsultationConfiguration();
          this.isConfigure = false;

        }
      })
    }
    
  }

  reConfigureOnlineConsultation(){
    if(confirm("Are you sure to re-configure Online Consultancy?")){
      let payload = {
        "chamberRef": this.configureOnlineConsultation.value.chamberRef,
        "doctorRef": this.loggedInUser.refNo,
        "onlineConsultancyApplicable": 'Y',
      }
  
      this._doctorService.discontinueOnlineConsultancy(payload).subscribe(result=>{
        //let res = result.data;
        if(result.status == 2000){
          this._toastService.showI18nToast('Online Consultancy configured successfully.' , 'success');
          //this.createOnlineConsultationForm();
          //this.getOnlineConsultationConfiguration();
          this.isConfigure = true;

        }
      })
    }
  }


}

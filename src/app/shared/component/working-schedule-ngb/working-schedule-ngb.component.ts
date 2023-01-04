import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { SBISConstants } from '../../../SBISConstants';// Working on app/issues/1193



@Component({
  selector: 'app-working-schedule-ngb',
  templateUrl: './working-schedule-ngb.component.html',
  styleUrls: ['./working-schedule-ngb.component.css']
})
export class NGBWorkingScheduleComponent implements OnInit {
  @Input() screenType: string;// Working on app/issues/1193
  @Input() timingDataFromResponse: any;
  @Input() saveStatus: boolean;
  @Output() workScheduleData = new EventEmitter<any>();
  dayOfWeek: any;
  doctorMockTimingRow: FormGroup[];
  timingForm: FormGroup;
  startTimingErrorFlag: any = [];
  endTimingErrorFlag: any = [];
  disableTiming: any  = [];
  SBISConstantsRef:any=SBISConstants; // Working on app/issues/1193
  meridian:boolean = true;
  closingTime: any = [];
  time : any = [];
  spinners = false;

  constructor(private  fb: FormBuilder,  private toastService: ToastService) {
    //config.disabled = true;

   }



  ngOnInit() {
    this.startTimingErrorFlag = [];
    this.endTimingErrorFlag = [];
    this.disableTiming = [];



      // this.createTimingForm();






    //this.doctorMockTimingRow = [];
  }

  ngOnChanges() {
    let doctorChamberList:any
    if(this.timingDataFromResponse.length == 0){

      //console.log(this.timingForm.value.workingTimingList.length);

      this.time[0] = {hour:0 , minute:0};

      this.closingTime[0] = {hour:0 , minute:0 };

      this.createTimingForm();
    }
    else{
      this.doctorMockTimingRow = [];
      if(this.timingDataFromResponse.length > 0){
        for(let i =0; i <this.timingDataFromResponse.length; i++){
          (this.timingForm) ? null: this.createTimingForm();
          doctorChamberList = this.timingForm.get('workingTimingList') as FormArray;
          doctorChamberList.push(this.createTimingForUpdate(this.timingDataFromResponse[i], i));
          this.doctorMockTimingRow.push(this.createTimingForUpdate(this.timingDataFromResponse[i], i));
          this.disableTiming[i] = false;

          let startTimeHour = this.doctorMockTimingRow[i].value.startTime.substring(0,2);
          let startTimeMinute = this.doctorMockTimingRow[i].value.startTime.substring(3,5);
          let endTimeHour = this.doctorMockTimingRow[i].value.endTime.substring(0,2);
          let endTimeMinute = this.doctorMockTimingRow[i].value.endTime.substring(3,5);

          startTimeHour = parseInt(startTimeHour);
          startTimeMinute = parseInt(startTimeMinute);

          endTimeHour = parseInt(endTimeHour);
          endTimeMinute = parseInt(endTimeMinute);
          this.time[i] = {hour:startTimeHour , minute:startTimeMinute};
          this.closingTime[i] = {hour:endTimeHour , minute:endTimeMinute };
        }
      }
      this.timingForm.patchValue({
        workingTimingList: this.doctorMockTimingRow
      });
      this.workingTimingList.controls.splice(0, 1);
      this.timingForm.value.workingTimingList.splice(0, 1);
      this.workScheduleData.emit(this.timingForm.value.workingTimingList);
    }
    console.log(this.timingForm); 
  }



  //time = JSON.stringify(this.time);



  get workingTimingList(): FormArray {
    return this.timingForm.get('workingTimingList') as FormArray;
  }

  createTimingForUpdate(res, index): FormGroup {
    console.log(res);
    return this.fb.group({
      all: [res['all'] ? res['all'] : false],
      mon: [res['mon']],
      tue: [res['tue']],
      wed: [res['wed']],
      thu: [res['thu']],
      fri: [res['fri']],
      sat: [res['sat']],
      sun: [res['sun']],
      startTime: [res['startTime']],
      endTime: [res['endTime']],
      rowIndex: [res['rowIndex']],
    })
  }

  createTimingForm(){
    let workingTimingList: FormGroup[] = [];
      workingTimingList.push(this.fb.group({
          all: [false],
          mon: [false],
          tue: [false],
          wed: [false],
          thu: [false],
          fri: [false],
          sat: [false],
          sun: [false],
          startTime: '',
          endTime: '',
          rowIndex: [1]
    }));
    this.disableTiming[0] = true;
    //timingList.push(this.createMockTimingRow());
    this.timingForm = this.fb.group({
      workingTimingList: this.fb.array(workingTimingList)
    })

  }

  // addMockTimingRow() {
  //   this.doctorMockTimingRow.push(this.createMockTimingRow());
  // }

  // createMockTimingRow(): FormGroup {
  //   return this.fb.group({
  //     dayOfWeek: '',
  //     startTime: '',
  //     endTime: ''
  //   })
  // }

  /**************************/

addMockTimingRow() {
    var workingTimingList = this.timingForm.get('workingTimingList') as FormArray;
    workingTimingList.push(this.createMockTimingRow());
    //console.log(workingTimingList.length);
    this.time[workingTimingList.length-1]= {hour:0 , minute:0};
    this.closingTime[workingTimingList.length-1]= {hour:0 , minute:0};
  }

  createMockTimingRow(): FormGroup {
    let index:any = 0;
    var workingTimingList = this.timingForm.get('workingTimingList') as FormArray;
    this.disableTiming[workingTimingList.length] = true;
    if(workingTimingList.length !=0)
    index =  (workingTimingList.value[workingTimingList.length-1].rowIndex);
    return this.fb.group({
      all: [false],
      mon: [false],
      tue: [false],
      wed: [false],
      thu: [false],
      fri: [false],
      sat: [false],
      sun: [false],
      startTime: '',
      endTime: '',

      rowIndex: [index+1]
    })


    // return this.fb.group({
    //   dayOfWeek: '',
    //   startTime: '',
    //   endTime: ''
    // })
  }

  // addTimingRow() {
  //   var doctorChamberList = this.timingForm.get('workingTimingList') as FormArray;
  //   doctorChamberList.push(this.createTiming());
  // }

  createTimingForEdit(result): FormGroup {
    return this.fb.group({
      pk:[result['pk']],
      dayOfWeek: [result['dayOfWeek']],
      startTime: [result['startTime']],
      endTime: [result['endTime']],
      status: [result['status']],
      rowIndex: [result['rowIndex']],
      serviceProviderPk: [],
      createdBy: [result['createdBy']],
      createdDate: [result['createdDate']],
      modifiedBy: [result['modifiedBy']],
      modifiedDate: [result['modifiedDate']]
    })
  }


deleteRow(index) {

if(this.timingForm.value.workingTimingList.length!=1){
    if (confirm('Are you sure to remove Timing Schedule?')) {

    this.workingTimingList.controls.splice(index, 1);
    this.timingForm.value.workingTimingList.splice(index, 1);
    this.workScheduleData.emit(this.timingForm.value.workingTimingList);
    }
    else{

    }
  }else{
    this.toastService.i18nToast("en", "Atleast One Timing Schedule Needed", "error");
  }
  }



  timeValidation(startTime, endTime, label)
  {
    let startTimeTmp = startTime.replace(/:/g, '');
    startTimeTmp = startTimeTmp.substring(0,4);
    let endTimeTemp = endTime.replace(/:/g, '');
    endTimeTemp = endTimeTemp.substring(0,4);
    let hourStartTime = startTimeTmp.substring(0,2);
    let minuteStartTime = startTimeTmp.substring(2,4);
    let totalMinuteStartTime = parseInt(hourStartTime)*60 + parseInt(minuteStartTime);

    let hourEndTime = endTimeTemp.substring(0,2);
    let minuteEndTime = endTimeTemp.substring(2,4);
    let totalMinuteEndTime = parseInt(hourEndTime)*60 + parseInt(minuteEndTime);
    //let timeDiff =  totalMinuteEndTime- totalMinuteStartTime;
    if(totalMinuteStartTime >= totalMinuteEndTime)
    {
      return true;
    }
    else
    {
      return false;
    }
  }







  convertTiming(labelValue,labelValue2, rowIndex, label, event) {

    //this.timeValidate(label,labelValue,labelValue2, rowIndex);
    let startTime: any;
    let endTime: any;
    let startTimeM: any;
    let endTimeM: any;

    labelValue = labelValue.toString();
    labelValue2 = labelValue2.toString();

    if (label == 'stTime' || label == 'ndTime') {

      var timingList = this.timingForm.get('workingTimingList') as FormArray;
      for (let i = 0; i < timingList.length; i++) {
        let timing = timingList.controls[i] as FormGroup;


        //let control = this.doctorMockTimingRow[rowIndex];
        // if(this.timeValidation(timing.value.startTime, timing.value.endTime, label)){
        //   this.startTimingErrorFlag[i] = true;
        //   this.endTimingErrorFlag[i] = true;
        // }
        // else{
        //   this.startTimingErrorFlag[i] = false;
        //   this.endTimingErrorFlag[i] = false;
        // }
        if (timing.value.rowIndex == rowIndex+1) {
          if (label == 'stTime') {
            //console.log(timing.value);
            startTime = labelValue + ":" + labelValue2;
            //console.log(startTime);
            //alert(event.getHours())
            //timing.controls.startTime.setValue(labelValue);
            //timing.controls.startTime.setValue(event.substring(0,5)+":00");
            //timing.controls.startTime.patchValue(labelValue);

           // flag = true;
          }
          else if (label == 'ndTime') {
            //timing.controls.endTime.setValue(event.substring(0,5)+":00");
            //timing.controls.endTime.patchValue(labelValue);
            //flag = true;
            endTime = labelValue + ":" + labelValue2;
            //console.log(endTime);
          }
        }



      }
      this.workScheduleData.emit(this.timingForm.value.workingTimingList);
      //console.log(this.workScheduleData);
    }


  }




  count = 0;
  setDayOfWeek(labelValue, rowIndex, event){

    var timingList = this.timingForm.get('workingTimingList') as FormArray;
    if(!event.target.checked){
      this.count--;
      for (let i = 0; i < timingList.length; i++) {
        let timing = timingList.controls[i] as FormGroup;
        let control = this.doctorMockTimingRow[rowIndex];

        if (timing.value.rowIndex == control.value.rowIndex && timing.value.dayOfWeek == labelValue) {
          if(timing.value.pk == '')
          {
            timingList.controls.splice(i,1);
            timingList.value.splice(i,1);
          }
          else
          timing.controls.status.setValue('CLX');
          //timing.controls.status.setValue('CLX');
          //this.disableTiming[] = true;
          //break;
        }
      }
    }
    else{
      this.count++;
      var startTime = "";
      var endTime = "";
      let existingTimingRecord = false;
      for (let i = 0; i < timingList.length; i++) {
        let timing = timingList.controls[i] as FormGroup;
        let control = this.doctorMockTimingRow[rowIndex];
        if (timing.value.rowIndex == control.value.rowIndex) {
          startTime = timing.value.startTime;
          endTime = timing.value.endTime;
          if (timing.value.dayOfWeek == labelValue) {
            existingTimingRecord = true;
            timing.value.status = 'NRM';
          }
          break;
        }
      }
      if (existingTimingRecord == false) {
        let control = this.doctorMockTimingRow[rowIndex];
        let index = control.value.rowIndex;
        var row = this.fb.group({
          pk: '',
          dayOfWeek: labelValue,
          startTime: startTime,
          endTime: endTime,
          status: 'NRM',
          rowIndex: index,
        });
        timingList.push(row);
      }
    }
    //alert(this.count)
    // if(this.count>0){
    //   this.disableTiming[rowIndex] = false;
    // }
    // else{
    //   this.disableTiming[rowIndex] = true;
    // }
    this.workScheduleData.emit(this.timingForm.value.workingTimingList);

  }

  fromTime: any;
  toTime: any;


  changeDayofweekAll(rowCtrl: any, index: any, event) {
    console.log(rowCtrl);
    
    let rowCtrlValue = rowCtrl.value;
    if (event.target.checked) {
      this.disableTiming[index] = false;
    }
    else{
      this.disableTiming[index] = true;
    }

    rowCtrl.patchValue({
      mon: rowCtrl.value.all,
      tue: rowCtrl.value.all,
      wed: rowCtrl.value.all,
      thu: rowCtrl.value.all,
      fri: rowCtrl.value.all,
      sat: rowCtrl.value.all,
      sun: rowCtrl.value.all,
    })
    this.workScheduleData.emit(this.timingForm.value.workingTimingList);
  }

  changeDayofweek(rowCtrl: any, index: any, event) {
    let rowCtrlValue = rowCtrl.value;
    if (rowCtrlValue.mon || rowCtrlValue.tue || rowCtrlValue.wed || rowCtrlValue.thu || rowCtrlValue.fri ||
      rowCtrlValue.sat || rowCtrlValue.sun) {
      this.disableTiming[index] = false;
      //console.log(this.timingForm.controls);
      //document.getElementById("time"+index).setAttribute('readonlyInputs','false');
      //this.time.disabled = false;
    }
    else{
      this.disableTiming[index] = true;
    }
    //let rowCtrlValue = rowCtrl.value;
    if (rowCtrlValue.mon && rowCtrlValue.tue && rowCtrlValue.wed && rowCtrlValue.thu && rowCtrlValue.fri &&
      rowCtrlValue.sat && rowCtrlValue.sun) {
      rowCtrl.patchValue({
        all: true
      })
    } else {
      rowCtrl.patchValue({
        all: false
      })
    }
    this.workScheduleData.emit(this.timingForm.value.workingTimingList);
  }


  digitOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    //console.log(charCode);
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      //event.preventDefault();
      return false;
    }
    return true;

  }


}

import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { SBISConstants } from '../../../SBISConstants';// Working on app/issues/1193
@Component({
  selector: 'app-working-schedule',
  templateUrl: './working-schedule.component.html',
  styleUrls: ['./working-schedule.component.css']
})
export class WorkingScheduleComponent implements OnInit {
  @Input() screenType: string;// Working on app/issues/1193    
  @Input() timingDataFromResponse: any;
  @Input() saveStatus: boolean;
  @Output() workScheduleData = new EventEmitter<any>();
  dayOfWeek: any;
  doctorMockTimingRow: FormGroup[];
  timingForm: FormGroup;
  startTimingErrorFlag: any = [];
  endTimingErrorFlag: any = [];
  disableTiming: any  = [];;
  SBISConstantsRef:any=SBISConstants; // Working on app/issues/1193 

  constructor(private  fb: FormBuilder,  private toastService: ToastService) { }

  ngOnInit() {
    this.startTimingErrorFlag = [];
    this.endTimingErrorFlag = [];
    this.disableTiming = [];

    // this.doctorMockTimingRow = [];
    //     this.doctorMockTimingRow.push(this.fb.group({
    //       //dayOfWeek: '',
    //       all: [false],
    //       mon: [false],
    //       tue: [false],
    //       wed: [false],
    //       thu: [false],
    //       fri: [false],
    //       sat: [false],
    //       sun: [false],
    //       startTime: '',
    //       endTime: '',
    //       rowIndex: [1]
    //     }));
    
    // this.dayOfWeek = [
    //   {
    //     'key': '1',
    //     'value': 'Mon',
    //     'day': 'Monday'
    //   },
    //   {
    //     'key': '2',
    //     'value': 'Tue',
    //     'day': 'Tuesday'
    //   },
    //   {
    //     'key': '3',
    //     'value': 'Wed',
    //     'day': 'Wednesday'
    //   },
    //   {
    //     'key': '4',
    //     'value': 'Thu',
    //     'day': 'Thursday'
    //   },
    //   {
    //     'key': '5',
    //     'value': 'Fri',
    //     'day': 'Friday'
    //   },
    //   {
    //     'key': '6',
    //     'value': 'Sat',
    //     'day': 'Saturday'
    //   },
    //   {
    //     'key': '7',
    //     'value': 'Sun',
    //     'day': 'Sunday'
    //   }
    // ];
    
      this.createTimingForm();
   
    
    //this.doctorMockTimingRow = [];
  }

  ngOnChanges() {
    let doctorChamberList:any
    if(this.timingDataFromResponse.length == 0){
      //this.timingDataFromResponse = [];
      // this.doctorMockTimingRow = [];
      //   this.doctorMockTimingRow.push(this.fb.group({
      //     //dayOfWeek: '',
      //     all: [false],
      //     mon: [false],
      //     tue: [false],
      //     wed: [false],
      //     thu: [false],
      //     fri: [false],
      //     sat: [false],
      //     sun: [false],
      //     startTime: '',
      //     endTime: ''
      //   }));
      this.createTimingForm();
    }
    else{
      this.doctorMockTimingRow = [];
      if(this.timingDataFromResponse.length > 0){
        for(let i =0; i <this.timingDataFromResponse.length; i++){
          doctorChamberList = this.timingForm.get('workingTimingList') as FormArray;
          doctorChamberList.push(this.createTimingForUpdate(this.timingDataFromResponse[i], i));
          this.doctorMockTimingRow.push(this.createTimingForUpdate(this.timingDataFromResponse[i], i));
          this.disableTiming[i] = false;
        }
      }
      this.timingForm.patchValue({
        workingTimingList: this.doctorMockTimingRow
      });
      this.workingTimingList.controls.splice(0, 1);
      this.timingForm.value.workingTimingList.splice(0, 1);
      this.workScheduleData.emit(this.timingForm.value.workingTimingList);
    }
    // if(this.timingDataFromResponse.length > 0){
    //   this.createTimingForm();
    // }
    // let doctorChamberList:any
    // if(this.saveStatus == true){
    //   //this.timingDataFromResponse = [];
    //   this.doctorMockTimingRow = [];
    //     this.doctorMockTimingRow.push(this.fb.group({
    //       //dayOfWeek: '',
    //       all: [false],
    //       mon: [false],
    //       tue: [false],
    //       wed: [false],
    //       thu: [false],
    //       fri: [false],
    //       sat: [false],
    //       sun: [false],
    //       startTime: '',
    //       endTime: ''
    //     }));
    // }
    // else{
    //   this.doctorMockTimingRow = [];
    //   if(this.timingDataFromResponse.length > 0){
    //     for(let i =0; i <this.timingDataFromResponse.length; i++){
    //       doctorChamberList = this.timingForm.get('workingTimingList') as FormArray;
    //       doctorChamberList.push(this.createTimingForUpdate(this.timingDataFromResponse[i], i));
    //       this.doctorMockTimingRow.push(this.createTimingForUpdate(this.timingDataFromResponse[i], i));
    //     }
    //   }
    //   this.timingForm.patchValue({
    //     workingTimingList: this.doctorMockTimingRow
    //   })
    //   this.workScheduleData.emit(this.timingForm.value.workingTimingList);
    // }
  }

  get workingTimingList(): FormArray {
    return this.timingForm.get('workingTimingList') as FormArray;
  }

  createTimingForUpdate(res, index): FormGroup {
    return this.fb.group({
      all: [res['all']],
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
  // createTiming(): FormGroup {
  //   return this.fb.group({
  //     pk: '',
  //     dayOfWeek: '',
  //     startTime: '',
  //     endTime: '',
  //     status: '',
  //     rowIndex: [1],
  //   })
  // }
  
deleteRow(index) {
    //alert('Work pending');
    //alert(index);
    // var timingList = this.timingForm.get('workingTimingList') as FormArray;
    // for (let i = 0; i < timingList.length; i++) {
    //   var timing = timingList.controls[i] as FormGroup;
    //   if(timing.controls.status.value == 'NRM')
      
    //   {
    //     //timing.controls.status.setValue('CLX');
    //     let control = this.doctorMockTimingRow[index];
    //     if (timing.value.rowIndex == control.value.rowIndex) 
    //     if(timing.value.pk == '')
    //       {
    //         timingList.controls.splice(control.value.rowIndex,1);
    //         timingList.value.splice(control.value.rowIndex,1);
    //       }
    //       else
    //       timing.controls.status.setValue('CLX');
        
        
    //     //timingList.controls.splice(index, 1);
        
    //   }
    // }
    // this.doctorMockTimingRow.splice(index, 1);
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

  // convertTiming(labelValue, rowIndex, label, event) {

  //   if (label == 'stTime' || label == 'ndTime') {
      
  //     var timingList = this.timingForm.get('workingTimingList') as FormArray;
  //     for (let i = 0; i < timingList.length; i++) {
  //       let timing = timingList.controls[i] as FormGroup;
  //       if (timing.value.rowIndex == rowIndex) {
  //         if (label == 'stTime') {
  //           //alert(event.getHours())
  //           //timing.controls.startTime.setValue(labelValue);
  //           timing.controls.startTime.setValue(event.substring(0,5)+":00");
  //           flag = true;
  //         }
  //         else if (label == 'ndTime') {
  //           timing.controls.endTime.setValue(event.substring(0,5)+":00");
  //           flag = true;
  //         }
  //       }
  //     }
  //   }
  //   //if (!(event instanceof Date) && event.target.type == 'checkbox' && !event.target.checked) {
  //   if (label == 'dow' && event.target.type == 'checkbox' && !event.target.checked) {  
  //     alert()
  //     var timingList = this.timingForm.get('workingTimingList') as FormArray;
  //     for (let i = 0; i < timingList.length; i++) {
  //       let timing = timingList.controls[i] as FormGroup;
  //       if (timing.value.rowIndex == rowIndex && timing.value.dayOfWeek == labelValue) {
  //         timing.controls.status.setValue('CLX');
  //        // this.disableTiming = true;
  //         //break;                          
  //       }
  //     }
  //   }
  //   else {
  //     //this.disableTiming = false;
  //     var flag = false;
  //     var timingList = this.timingForm.get('workingTimingList') as FormArray;
  //     var startTime = '';
  //     var endTime = '';
  //     //alert(event);
  //     for (let i = 0; i < timingList.length; i++) {
  //       let timing = timingList.controls[i] as FormGroup;
  //       if (timing.value.rowIndex == rowIndex) {
  //         if (label == 'stTime') {
  //           //alert(event.getHours())
  //           //timing.controls.startTime.setValue(labelValue);
  //           timing.controls.startTime.setValue(event.substring(0,5)+":00");
  //           flag = true;
  //         }
  //         else if (label == 'ndTime') {
  //           timing.controls.endTime.setValue(event.substring(0,5)+":00");
  //           flag = true;
  //         }
  //       }
  //     }

  //     if (!flag) {
  //       if (label == 'dow') {
  //         for (let i = 0; i < timingList.length; i++) {
  //           let timing = timingList.controls[i] as FormGroup;
  //           //alert("timing");
  //           //alert(timing.value.startTime);
  //           if (timing.value.rowIndex == rowIndex) {
  //             startTime = timing.value.startTime;
  //             endTime = timing.value.endTime;
  //             break;
  //           }
  //         }
  //         var row = this.fb.group({
  //           pk: '',
  //           dayOfWeek: labelValue,
  //           startTime: startTime,
  //           endTime: endTime,
  //           status: 'NRM',
  //           rowIndex: rowIndex,
  //           serviceProviderPk: null
  //         });
  //         timingList.push(row);
  //       }
  //       else if (label == 'stTime') {
  //         var row = this.fb.group({
  //           pk: '',
  //           dayOfWeek: '',
  //           startTime: event.substring(0,5)+":00",
  //           endTime: '',
  //           status: 'NRM',
  //           rowIndex: rowIndex,
  //           serviceProviderPk: null
  //         });
  //         //timingList.push(row);
  //       }
  //       else if (label == 'ndTime') {
  //         var row = this.fb.group({
  //           pk: '',
  //           dayOfWeek: '',
  //           startTime: '',
  //           endTime: event.substring(0,5)+":00",
  //           status: 'NRM',
  //           rowIndex: rowIndex,
  //           serviceProviderPk: null
  //         });
  //         //timingList.push(row);
  //       }
  //     }
  //   }
  //   this.workScheduleData.emit(this.timingForm.value.workingTimingList);
  // }

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
  convertTiming(labelValue, rowIndex, label, event) {
    let startTime: any;
    let endTime: any;
    let startTimeM: any;
    let endTimeM: any;

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
            //alert(event.getHours())
            //timing.controls.startTime.setValue(labelValue);
            //timing.controls.startTime.setValue(event.substring(0,5)+":00");
            timing.controls.startTime.patchValue(labelValue);
           // flag = true;
          }
          else if (label == 'ndTime') {
            //timing.controls.endTime.setValue(event.substring(0,5)+":00");
            timing.controls.endTime.patchValue(labelValue);
            //flag = true;
          }
        }

        // if(label=='stTime'){
        //   endTime = timing.value.endTime;
        //   if(endTime!=null || endTime!="" || isNaN(endTime)){
        //     let startTimeTmp = labelValue.replace(/:/g, '');
        //     startTimeTmp = startTimeTmp.substring(0,4);
        //     let endTimeTemp = endTime.replace(/:/g, '');
        //     endTimeTemp = endTimeTemp.substring(0,4);
        //     let hourStartTime = startTimeTmp.substring(0,2);
        //     let minuteStartTime = startTimeTmp.substring(2,4);
        //     let totalMinuteStartTime = parseInt(hourStartTime)*60 + parseInt(minuteStartTime);

        //     let hourEndTime = endTimeTemp.substring(0,2);
        //     let minuteEndTime = endTimeTemp.substring(2,4);
        //     let totalMinuteEndTime = parseInt(hourEndTime)*60 + parseInt(minuteEndTime);

        //     if(totalMinuteStartTime > totalMinuteEndTime){
        //       this.startTimingErrorFlag[i] = true;
        //     }
        //     else{
        //       this.startTimingErrorFlag[i] = false;
        //     }
        //     if(totalMinuteStartTime == totalMinuteEndTime){
        //       this.startTimingErrorFlag[i] = true;
        //     }
        //     else{
        //       this.startTimingErrorFlag[i] = false;
        //     }
        //   }
        // }
        // if(label=='ndTime'){
        //   startTime = timing.value.startTime;
        //   if(startTime!=null || startTime!="" || isNaN(startTime)){
        //     let startTimeTmp = startTime.replace(/:/g, '');
        //     startTimeTmp = startTimeTmp.substring(0,4);
        //     let endTimeTemp = labelValue.replace(/:/g, '');
        //     endTimeTemp = endTimeTemp.substring(0,4);
        //     let hourStartTime = startTimeTmp.substring(0,2);
        //     let minuteStartTime = startTimeTmp.substring(2,4);
        //     let totalMinuteStartTime = parseInt(hourStartTime)*60 + parseInt(minuteStartTime);

        //     let hourEndTime = endTimeTemp.substring(0,2);
        //     let minuteEndTime = endTimeTemp.substring(2,4);
        //     let totalMinuteEndTime = parseInt(hourEndTime)*60 + parseInt(minuteEndTime);

        //     if(totalMinuteStartTime > totalMinuteEndTime){
        //       this.startTimingErrorFlag[i] = true;
        //     }
        //     else{
        //       this.startTimingErrorFlag[i] = false;
        //     }
        //     if(totalMinuteStartTime == totalMinuteEndTime){
        //       this.startTimingErrorFlag[i] = true;
        //     }
        //     else{
        //       this.startTimingErrorFlag[i] = false;
        //     }
        //   }
        // }
        
      }
      this.workScheduleData.emit(this.timingForm.value.workingTimingList);
    }
    //if (!(event instanceof Date) && event.target.type == 'checkbox' && !event.target.checked) {
    // if (label == 'dow' && event.target.type == 'checkbox' && !event.target.checked) {  
    //   alert()
    //   var timingList = this.timingForm.get('workingTimingList') as FormArray;
    //   for (let i = 0; i < timingList.length; i++) {
    //     let timing = timingList.controls[i] as FormGroup;
    //     if (timing.value.rowIndex == rowIndex && timing.value.dayOfWeek == labelValue) {
    //       if(timing.value.pk == '')
    //       {
    //         timingList.controls.splice(rowIndex,1);
    //       }
    //       else
    //       timing.controls.status.setValue('CLX');
    //       //this.disableTiming = true;
    //       //break;                          
    //     }
    //   }
    // }
    // else {
    //  // this.disableTiming = false;
    //   var flag = false;
    //   var timingList = this.timingForm.get('workingTimingList') as FormArray;
    //   var startTime = '';
    //   var endTime = '';
    //   //alert(event);
    //   for (let i = 0; i < timingList.length; i++) {
    //     let timing = timingList.controls[i] as FormGroup;
    //     let control = this.doctorMockTimingRow[rowIndex];
    //     if (timing.value.rowIndex == control.value.rowIndex) {
    //       if (label == 'stTime') {
    //         //alert(event.getHours())
    //         //timing.controls.startTime.setValue(labelValue);
    //         timing.controls.startTime.setValue(event.substring(0,5)+":00");
    //         flag = true;
    //       }
    //       else if (label == 'ndTime') {
    //         timing.controls.endTime.setValue(event.substring(0,5)+":00");
    //         flag = true;
    //       }
    //     }
    //   }

    //   if (!flag) {
    //     if (label == 'dow') {
    //       for (let i = 0; i < timingList.length; i++) {
    //         let timing = timingList.controls[i] as FormGroup;
    //         //alert("timing");
    //         //alert(timing.value.startTime);
    //         let control = this.doctorMockTimingRow[rowIndex];
    //         if (timing.value.rowIndex == control.value.rowIndex) {
    //           startTime = timing.value.startTime;
    //           endTime = timing.value.endTime;
    //           break;
    //         }
    //       }
    //       var row = this.fb.group({
    //         pk: '',
    //         dayOfWeek: labelValue,
    //         startTime: startTime,
    //         endTime: endTime,
    //         status: 'NRM',
    //         rowIndex: rowIndex+1,
    //       });
    //       timingList.push(row);
    //     }
    //     else if (label == 'stTime') {
    //       let control = this.doctorMockTimingRow[rowIndex];
    //       let index = control.value.rowIndex;
    //       var row = this.fb.group({
    //         pk: '',
    //         dayOfWeek: '',
    //         startTime: event.substring(0,5)+":00",
    //         endTime: '',
    //         status: 'NRM',
    //         rowIndex: index,
    //       });
    //       //timingList.push(row);
    //     }
    //     else if (label == 'ndTime') {
    //       let control = this.doctorMockTimingRow[rowIndex];
    //       let index = control.value.rowIndex;
    //       var row = this.fb.group({
    //         pk: '',
    //         dayOfWeek: '',
    //         startTime: '',
    //         endTime: event.substring(0,5)+":00",
    //         status: 'NRM',
    //         rowIndex: index,
    //       });
    //       //timingList.push(row);
    //     }
    //   }
    // }
   
  }

  // setDayOfWeek(labelValue, rowIndex, event){
    
  //   var timingList = this.timingForm.get('workingTimingList') as FormArray;
  //   if(!event.target.checked){
  //     for (let i = 0; i < timingList.length; i++) {
  //       let timing = timingList.controls[i] as FormGroup;
  //       if (timing.value.rowIndex == rowIndex && timing.value.dayOfWeek == labelValue) {
  //         timing.controls.status.setValue('CLX');
  //       }
  //     }
  //   }
  //   else{
  //     var startTime = "";
  //     var endTime = "";
  //     for (let i = 0; i < timingList.length; i++) {
  //       let timing = timingList.controls[i] as FormGroup;
  //       if (timing.value.rowIndex == rowIndex) {
  //         startTime = timing.value.startTime;
  //         endTime = timing.value.endTime;
  //         break;
  //       }
  //     }
  //     var row = this.fb.group({
  //       pk: '',
  //       dayOfWeek: labelValue,
  //       startTime: startTime,
  //       endTime: endTime,
  //       status: 'NRM',
  //       rowIndex: rowIndex,
  //       serviceProviderPk: null
  //     });
  //     timingList.push(row);
  //   }
    
  //   this.workScheduleData.emit(this.timingForm.value.workingTimingList);
    
  // }


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
  timeValidate(label, time, i){

    let startTime: any;
    let endTime: any;
    let startTimeM: any;
    let endTimeM: any;

    var timingList = this.timingForm.get('workingTimingList') as FormArray;
    let timing = timingList.controls[i] as FormGroup;
    
    if(label=='stTime'){
      //this.timingForm.controls.appointmentTime.setValue(time.substring(0,5)+":00");
      
      endTime = timing.value.endTime;
      if(endTime!=null || endTime!="" || isNaN(endTime)){
        startTimeM = parseInt(time.split(':')[1]);
        endTimeM=parseInt(endTime.split(':')[1]);
        startTime = parseInt(time.split(':')[0]);
        endTime=parseInt(endTime.split(':')[0]);
        

        if(startTime > endTime){
          this.startTimingErrorFlag[i] = true;
          let timingForm = timingList.controls[i] as FormGroup;
          timingForm.controls.startTime.patchValue("");
          //alert("Start time can not be greater than end time.")
          // timing.value.startTime = "";
          // //timing.value.startTime.setValue("");
          // timingList.at(i).patchValue({
          //   startTime: ""
          // })
        }
        else{
          if(startTime == endTime){
            if(startTimeM >= endTimeM){
              this.startTimingErrorFlag[i] = true;
              // timingList.at(i).patchValue({
              //   startTime: ""
              // })
              let timingForm = timingList.controls[i] as FormGroup;
              timingForm.controls.startTime.patchValue("");
            }
            else{
              //timing.value.startTime.setValue(time.substring(0,5)+":00");
              this.startTimingErrorFlag[i] = false;
              this.endTimingErrorFlag[i] = false;    
            }
          }
          else{
            //timing.value.startTime.setValue(time.substring(0,5)+":00");
            this.startTimingErrorFlag[i] = false;
            this.endTimingErrorFlag[i] = false;
          }
          
        }
      }
    }
    if(label=='ndTime'){
      endTime = time;
      startTime = timing.value.startTime;
      if(startTime!=null || startTime!="" || isNaN(startTime)){
        endTimeM=parseInt(time.split(':')[1]);
        startTimeM = parseInt(startTime.split(':')[1]);
        endTime = parseInt(time.split(':')[0]);
        startTime=parseInt(startTime.split(':')[0]);
        if(startTime > endTime){
          this.endTimingErrorFlag[i] = true;
          let timingForm = timingList.controls[i] as FormGroup;
          timingForm.controls.endTime.patchValue("");
          //alert("End time can not be less than Start time.")
          //timing.value.endTime = "";
          //timing.value.endTime.setValue("");
        }
        else{
          if(startTime == endTime){
            if(startTimeM >= endTimeM){
              this.endTimingErrorFlag[i] = true;
              let timingForm = timingList.controls[i] as FormGroup;
              timingForm.controls.endTime.patchValue("");
            }
            else{
              this.endTimingErrorFlag[i] = false;
              this.startTimingErrorFlag[i] = false;
            }
          }
          else{
            this.endTimingErrorFlag[i] = false;
            this.startTimingErrorFlag[i] = false;
          }
          
         // timing.value.endTime.setValue(time.substring(0,5)+":00");
        }
      }
    }
    this.workScheduleData.emit(this.timingForm.value.workingTimingList);
  }

  changeDayofweekAll(rowCtrl: any, index: any, event) {
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
  

}

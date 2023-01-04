import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { ServiceProviderService } from '../service-provider.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarWeekViewBeforeRenderEvent,
  CalendarDayViewBeforeRenderEvent
} from 'angular-calendar';
import { Subject } from 'rxjs';
import { ToastService } from '../../../core/services/toast.service';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { DoctorService } from '../../doctor/doctor.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-resource-availability-calendar',
  templateUrl: './resource-availability-calendar.component.html',
  styleUrls: ['./resource-availability-calendar.component.css']
})
export class ResourceAvailabilityCalendarComponent implements OnInit {

  resourceList:any=[];
  resourceScheduleList:any=[];
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  daysOfWeekModel: { 1: string; 2: string; 3: string; 4: string; 5: string; 6: string; 7: string; };
  timeSlotDetails: any[] = [];
  fromDate: any;
  toDate: any;
  activeDayIsOpen: boolean = false;
  private events: CalendarEvent[] = [ ];
  maxDayEndTime = 23;
  minDayStartTime = 6;
  hourSegments: number=60/15;
  refresh: Subject<any> = new Subject();
  weekViewEvent:CalendarWeekViewBeforeRenderEvent;
  dayViewRenderEvent:CalendarDayViewBeforeRenderEvent;
  resourceRefNo:string;

  otBookingForm:FormGroup;
  

  constructor(private serviceProviderService: ServiceProviderService,
    private broadcastService: BroadcastService,
    private toastService: ToastService,
    private doctorService: DoctorService,private fb: FormBuilder) { }

  ngOnInit() {
    this.broadcastService.setHeaderText('Resource Availability');
    this.getResourceListByEntity();
    
  }

  getResourceListByEntity(){
    let payload={
      isRateInfoRequired:true
     }
    this.serviceProviderService.getAllOperationTheaterDetails(payload).subscribe((res) => {
      console.clear();
    
     this.resourceList=res.data;
     for(let ot of this.resourceList){
       for(let otBed of ot.otBedResourceList){
        otBed['cssClass']="row  refine-panel-border-bottom mb-0 padding10";
       }
     }
     console.log("resourceList::",this.resourceList);
     
    },(error) => {
      
     });
  }


  getAvailabilityCalendarForResource(requestRefNo){
    this.resourceRefNo=requestRefNo
    let requestQuery={
      refNo:requestRefNo
    }
    this.resourceRefNo=requestRefNo;

     for(let ot of this.resourceList){
      for(let otBed of ot.otBedResourceList){
        if(otBed.refNo==requestRefNo)
        otBed['cssClass']="row  refine-panel-border-bottom mb-0 padding10 selected-refine-by-div";
      else
        otBed['cssClass']="row  refine-panel-border-bottom mb-0 padding10";
        
      
      }
    }

    this.serviceProviderService.getAvailabilityCalendarForResource(requestQuery).subscribe((res) => {
     
     console.log("RES::",res);
     this.resourceScheduleList=res.data;  
     if(this.resourceScheduleList.length>0)
      this.hourSegments= 60/ 15;
    this.refresh.next();
     
    },(error) => {
      this.resourceScheduleList=[];
     });

  }

  getDaysOfWeeksNTimeSlot() {
    this.daysOfWeekModel = {
      1: "MON",
      2: "TUE",
      3: "WED",
      4: "THU",
      5: "FRI",
      6: "SAT",
      7: "SUN"
    };
    this.timeSlotDetails = [
      { label: "Morning (6:00 - 12:00)", value: "Morning" },
      { label: "Afternoon (12:00 - 16:00)", value: "Afternoon" },
      { label: "Evening (16:00 - 20:00)", value: "Evening" },
      { label: "Night (20:00 - 0:00)", value: "Night" }
    ];
  }


  nextPrevDateChange(d) {
    this.activeDayIsOpen = false
    var stDate = null;
    var endDate = null;
    if (this.view == CalendarView.Month) {
      stDate = new Date(d.getFullYear(), d.getMonth(), 1);
      endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      this.fromDate = new Date(stDate).getFullYear() + '-' + ('0' + (new Date(stDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(stDate).getDate()).slice(-2);
      this.toDate = new Date(endDate).getFullYear() + '-' + ('0' + (new Date(endDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(endDate).getDate()).slice(-2);
      console.log(this.fromDate);
      console.log(this.toDate);
    }
    if (this.view == CalendarView.Week) {

      var day = d.getDay();
      stDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + ((day == 0 ? 0 : 7) - day) - 7);
      endDate = new Date(d.getFullYear(), d.getMonth(), d.getDate() + ((day == 0 ? 0 : 6) - day));
      this.fromDate = new Date(stDate).getFullYear() + '-' + ('0' + (new Date(stDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(stDate).getDate()).slice(-2);
      this.toDate = new Date(endDate).getFullYear() + '-' + ('0' + (new Date(endDate).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(endDate).getDate()).slice(-2);
      console.log(this.fromDate);
      console.log(this.toDate);
    }
    if (this.view == CalendarView.Day) {
      this.fromDate = new Date(d).getFullYear() + '-' + ('0' + (new Date(d).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(d).getDate()).slice(-2);
      this.toDate = new Date(d).getFullYear() + '-' + ('0' + (new Date(d).getMonth() + 1)).slice(-2) + '-' + ('0' + new Date(d).getDate()).slice(-2);
      console.log(this.fromDate);
      console.log(this.toDate);
    }
   
  }

  handleEvent( event: CalendarEvent): void {
    // Handle Slot event;
    console.log("event::",event);
    
    let requestQuery={
      resourceRefNo:""
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd
  }: CalendarEventTimesChangedEvent): void {
    event.start = newStart;
    event.end = newEnd;
    this.handleEvent( event);
    this.refresh.next();
  }

 

  monthView() {
    this.view = CalendarView.Month;
    console.log(this.viewDate);
    this.nextPrevDateChange(this.viewDate);
  }
  weekView() {
    this.view = CalendarView.Week;
    console.log(this.viewDate);
    this.nextPrevDateChange(this.viewDate);
  }

  setResourceTimeSlot(){

    for(let resourceSchedule of this.resourceScheduleList){
      for (let timeSlot of resourceSchedule.timeSlots) {
        let stTime =timeSlot.fromTime
        
        stTime = stTime.substring(0, 2);
        let endTime = timeSlot.toTime;
  
        endTime = endTime.substring(0, 2);
      }
    }
    this.refresh.next();
  }

  

  beforeWeekViewRender(renderEvent: CalendarWeekViewBeforeRenderEvent) {
    console.log("renderEvent::",renderEvent);
    this.weekViewEvent=renderEvent
    let weekStartDay=new Date(renderEvent.period.start)
    let weekEndDay=new Date(renderEvent.period.end)
    // console.log("START::",weekStartDay,"   DATE:",weekStartDay.getDate(),"  DAY::",weekStartDay.getTime());
    // console.log("END::",weekEndDay,"   DATE:",weekEndDay.getDate(),"  DAY::",weekEndDay.getTime());
    
    for(let resourceSchedule of this.resourceScheduleList){

      if(weekStartDay.getTime()>=new Date(resourceSchedule.calendarDate).getTime() || new Date(resourceSchedule.calendarDate).getTime()<=weekEndDay.getTime()){
        // console.log("resourceSchedule.calendarDate::",resourceSchedule.calendarDate);
        
      
    
      for (let timeSlot of resourceSchedule.timeSlots) {
        
        
      let stTime = (timeSlot.fromTime).split(":")
      stTime = new Date(0, 0, 0, stTime[0], stTime[1], 0);
      let endTime = (timeSlot.toTime).split(":");
      endTime = new Date(0, 0, 0, endTime[0], endTime[1], 0);

      let dayOfWeek = new Date(resourceSchedule.calendarDate).getDay();

      renderEvent.hourColumns.forEach(hourColumn => {
        hourColumn.hours.forEach(hour => {
          hour.segments.forEach(segment => {
            let segmentDateObj = segment.date;
            if (dayOfWeek == segmentDateObj.getDay()) {
              let segmentTime = new Date(0, 0, 0, segmentDateObj.getHours(), segmentDateObj.getMinutes(), 0);

              let now = new Date();
              let todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              let segmentDate = new Date(segmentDateObj.getFullYear(), segmentDateObj.getMonth(), segmentDateObj.getDate())
              if (segmentTime.getTime() >= stTime.getTime() &&
                segmentTime.getTime() < endTime.getTime() &&
                segmentDate >= todayDate) {
                  if(timeSlot.occupied){
                  console.log("DATE",resourceSchedule.calendarDate,"occupied slot:::",timeSlot);
                    segment.cssClass = 'occupied-slot';
                  }                  
                   else{
                     console.log("NON occupied slot:::",timeSlot);
                    segment.cssClass = 'free-slot';
                  }
                   
              }
              
            }
          });
        });
      });
    }
   }
  }
}


hourClicked(event){

if (this.resourceRefNo == null) {
  this.toastService.showI18nToast("Please select a Operation Theater first", "error");
  return;
}


let allowToAllocate:boolean=false
for(let resourceSchedule of this.resourceScheduleList){
  let scheduleDate= new Date(resourceSchedule.calendarDate)
  for (let timeSlot of resourceSchedule.timeSlots) {
    console.log("occupied:",timeSlot.occupied);
    
    let startHour = timeSlot.fromTime.substring(0, 2);
    let startMinutes = timeSlot.fromTime.substring(3, 5);
    let currentSegment =new Date( scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate(), startHour, startMinutes, 0);
    if(currentSegment.getTime()==event.date.getTime() && !timeSlot.occupied){
      allowToAllocate=true;
      break;
    }
  }
  if(allowToAllocate) break;
}



if(allowToAllocate){

    let clickedDay = new Date(event.date);
    let previousSegemnet = null;
    let currentSegemnet = null;
    let dayOfWeek = new Date(event.date).getDay();
    if(this.view==this.CalendarView.Week){
      this.weekViewEvent.hourColumns.forEach(hourColumn => {
        hourColumn.hours.forEach(hour => {
          hour.segments.forEach(segment => {
            let segmentDateObj = segment.date;
            if (dayOfWeek == segmentDateObj.getDay()) {
              if(previousSegemnet!=null && currentSegemnet==null){              
                currentSegemnet=segment;
              }
              if ((previousSegemnet==null) && (segmentDateObj.getTime() == clickedDay.getTime()))        
                {              
                previousSegemnet=segment;
                }
                
            }
          });
        });
      });
    }
    if(this.view==this.CalendarView.Day){

      this.dayViewRenderEvent.body.hourGrid.forEach(hour => {    
        hour.segments.forEach(segment => {
          let segmentDateObj = segment.date;
          if (dayOfWeek == segmentDateObj.getDay()) {
         
            if(previousSegemnet!=null && currentSegemnet==null){              
              currentSegemnet=segment;
            }
            if ((previousSegemnet==null) && (segmentDateObj.getTime() == clickedDay.getTime()))        
              {              
              previousSegemnet=segment;
              }
              
          }
        });
      });

    }
    
    
      let requestQuery={
        startTime: this.zeroPad(previousSegemnet.date.getHours()) + ":" + this.zeroPad(previousSegemnet.date.getMinutes()) + ":" + this.zeroPad(previousSegemnet.date.getSeconds()),
        endTime:this.zeroPad(currentSegemnet.date.getHours()) + ":" + this.zeroPad(currentSegemnet.date.getMinutes()) + ":" + this.zeroPad(currentSegemnet.date.getSeconds()),
        date:clickedDay,
        resourceRefNo:this.resourceRefNo
      }
      console.log("requestQuery::",requestQuery);
      this.serviceProviderService.allocateResourceSlot(requestQuery).subscribe((res) => {   
        this.toastService.showI18nToast("Slot Allocated Successfully", "success");   
        this.getAvailabilityCalendarForResource(this.resourceRefNo);
      },(error) => {
        console.log(error);    
      }); 
}
else{
  this.toastService.showI18nToast("Allocation Part Comming Soon", "Warning");
}

}

zeroPad(num) {
  if (num.toString().length == 1) {
    num = '0' + num;
  }
  return num;
}

 setDay() {
  this.view = CalendarView.Day;  
  this.nextPrevDateChange(this.viewDate);
  this.refresh.next();

} 

beforeDayViewRender(renderEvent: CalendarDayViewBeforeRenderEvent) {
  this.dayViewRenderEvent = renderEvent;
let eventDate=new Date(renderEvent.period.start.getFullYear(),renderEvent.period.start.getMonth(),renderEvent.period.start.getDate(),0,0,0)
  
for(let resourceSchedule of this.resourceScheduleList){
  let scheduleDate= new Date(resourceSchedule.calendarDate);
  let scheduleDateAT0 =new Date( scheduleDate.getFullYear(), scheduleDate.getMonth(), scheduleDate.getDate(), 0, 0, 0);
  
    if(eventDate.getTime() == scheduleDateAT0.getTime()){

     for (let timeSlot of resourceSchedule.timeSlots) {
      let stTime = (timeSlot.fromTime).split(":")
      stTime = new Date(0, 0, 0, stTime[0], stTime[1], 0);
      let endTime = (timeSlot.toTime).split(":");
      endTime = new Date(0, 0, 0, endTime[0], endTime[1], 0);

      let dayOfWeek = new Date().getDay();
      renderEvent.body.hourGrid.forEach(hour => {    
        hour.segments.forEach(segment => {
          let segmentDateObj = segment.date;
          if (dayOfWeek == segmentDateObj.getDay()) {
            let segmentTime = new Date(0, 0, 0, segmentDateObj.getHours(), segmentDateObj.getMinutes(), 0);
    
            let now = new Date();
            let todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            let segmentDate = new Date(segmentDateObj.getFullYear(), segmentDateObj.getMonth(), segmentDateObj.getDate())
            if (segmentTime.getTime() >= stTime.getTime() &&
              segmentTime.getTime() < endTime.getTime() &&
              segmentDate >= todayDate) {
                if(timeSlot.occupied){
                  segment.cssClass = 'occupied-slot';
                }                  
                else{
                  segment.cssClass = 'available-slot';
                }
                 
            }
            
          }
        });
      });
    } 
  }
  }
  
 
}


}




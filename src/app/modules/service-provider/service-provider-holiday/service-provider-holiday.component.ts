import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceProviderService } from '../service-provider.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ToastService } from '../../../core/services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common'
import { DoctorService } from 'src/app/modules/doctor/doctor.service';
@Component({
  selector: 'app-service-provider-holiday',
  templateUrl: './service-provider-holiday.component.html',
  styleUrls: ['./service-provider-holiday.component.css']
})
export class ServiceProviderHolidayComponent implements OnInit {
  title: String = "Holiday List";
  isPaginator = false;
  user: any;
  holidayList: any;
  allDataFetched = false;
  holidayData: any;
  minDate = new Date();
  minDateTo: any;
  updateHolidayForm: FormGroup;
  dateFormat: any;
  holidayFrom: any;
  holidayTo: any;
  allFetchData: boolean = false;
  holidayAddDisableFlag: boolean;
  doctorholidayAddDisableFlag: boolean;
  oldItems: any[] = [];
  newRow: boolean = false;
  isAddBtnClicked:boolean= false;
// --------------------------------------- DOCTOR HOLIDAY Variables Part -----------------------------------------------
  doctorListForOPDToDisplay: any[] = ["abcdsghk"];//to display doc list
  doctorListForOPD: any[] = [];
  optionsDoctor: any = [];
  optionsDoctorToDisplay: any = [];
  specializationsList: any[] = [];
  specializationsListToDisplay: any[] = [];
  htmlElements: any = { showHospitalHolidaySection: true, showDoctorHolidaySection: false };
  fromMaxDate: Date;
  toMinDate: Date;
  maxDate: Date;

  doctorHolidayForm: FormGroup;
  doctorRefNo:string="";
  doctorHolidays:any=[];
  providerHolidays:any=[];
  constructor(private fb: FormBuilder,
    private router: Router,
    private _serviceProviderService: ServiceProviderService,
    private broadcastService: BroadcastService,
    private bsModalService: BsModalService,
    private toastService: ToastService,
    private translate: TranslateService,
    public datepipe: DatePipe,
    private cd: ChangeDetectorRef,
    private _doctorService: DoctorService,) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log("USER::", this.user);
    this.dateFormat = environment.DATE_FORMAT;

    //console.log("Length::",this.updateHolidayForm.controls.holiday['controls'].length);
   this.broadcastService.setHeaderText('HOLIDAY CALENDAR - INSTITUTE');//#ISSUE:2087
    
    let query = {
      refNo: this.user.refNo
    }
    this.initialFormGroup();
    this.getHolidays();
    this.getOPDDoctorListANDSpecialization();
    this.initialDoctorHolidayFormGroup();
    this.holidayDateInitialState();
  }

  initialFormGroup() {
    this.updateHolidayForm = this.fb.group({
      holiday: this.fb.array([]),
    });
  }

  holidayDateInitialState() {
    let date = new Date();
    this.fromMaxDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDay());
    this.toMinDate = new Date();
    this.maxDate = new Date(date.getFullYear() + 1, date.getMonth(), date.getDay());
  }

  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }


  getHolidays() {
    console.log("Value:: ", this.updateHolidayForm.controls.holiday['controls'].length)
    this._serviceProviderService.fetchHoliday().subscribe(data => {
      console.log("Fetch Holiday::", data);

      if (data['status'] == '2000') {
       this.providerHolidays= data['data'];
        let holidayList = data['data'];
        if (data.length > 5) {
          this.isPaginator = true;
        }
        this.allDataFetched = true;
        holidayList.forEach(t => {
          let holidayArr = <FormArray>this.updateHolidayForm.controls.holiday;

          holidayArr.push(this.fb.group({
            'holidayPk': t.holidayPk,
            'holidayFrom': new Date(t.holidayFrom),
            'holidayTo': new Date(t.holidayTo),
            'isEdit': [false],
            'isSubmit': [false]
          }));
        });
        this.allFetchData = true;
        
      } else
        this.toastService.showI18nToast(data['message'], 'error');
    });
  }

  editHoliday(ctrl: any, index) {
    console.log("Edit::", ctrl.value);
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit,
    });
    this.fromMaxDate = this.updateHolidayForm.value.holiday[index].holidayTo;
    this.toMinDate = this.updateHolidayForm.value.holiday[index].holidayFrom;
    this.holidayAddDisableFlag = true;
    this.oldItems.push(ctrl.value);
    this.newRow = false;


  }

/*   cancelHoliday(ctrl, inx, iconType) {
    this.holidayAddDisableFlag = false;
    let arrayControl = this.updateHolidayForm.get('holiday') as FormArray;
    arrayControl.removeAt(inx);
    if (iconType == 'edit') {
      let data = ctrl.value;
      let formControl = this.fb.group({
        'holidayFrom': new Date(data.holidayFrom),
        'holidayTo': new Date(data.holidayTo),
        'isEdit': [false],
        'isSubmit': [false]
      });
      arrayControl.insert(inx, formControl);
    }
    ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
    this.newRow = false;

  } */
  cancelHoliday(ctrl, inx, iconType) {
  //  console.log("XYZZ:",ctrl)
    this.holidayAddDisableFlag = false;
    this.holidayDateInitialState();
    console.log("holiday PK:::",ctrl.value.holidayPk)
    if(ctrl.value.holidayPk==null){
      this.holiday.controls.splice(inx, 1);
      this.holiday.value.splice(inx, 1);
      this.updateHolidayForm.controls.holiday['controls'].splice(inx,1);
      return false;
    }
    else{
      let arrayControl = this.updateHolidayForm.get('holiday') as FormArray;
      let currentHoliday=this.providerHolidays.find(holiday=>holiday.holidayPk===ctrl.value.holidayPk);
      console.log("Holiday:::",currentHoliday)
      this.updateHolidayForm.controls.holiday['controls'].splice(inx,1);
          let formControl = this.fb.group({
         'holidayPk': currentHoliday.holidayPk,
        'holidayFrom' : new Date(currentHoliday.holidayFrom),
        'holidayTo' : new Date(currentHoliday.holidayTo),
        'isEdit': [false],
        'isSubmit': [false]
  });
 
  arrayControl.insert(inx, formControl); 
    }
    ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
    this.newRow = false;
    
  }//end of method


  deleteHoliday(ctrl: any, index: number) {
    let data = ctrl.value;
    console.log(data);
    if (confirm('Are you want to cancel this holiday?')) {
      let payload = {
        "holidayPk": data.holidayPk,
        "holidayFromDateStr": this.convert(data.holidayFrom.toString()),
        "holidayToDateStr": this.convert(data.holidayTo.toString()),
        "action": "DELETE"
      }
      this._serviceProviderService.saveHoliday(payload).subscribe(data => {
        if (data['status'] == '2000') {
          this.toastService.showI18nToast("Holiday Canceled Successfully.", 'success');
          this.initialFormGroup();
          this.getHolidays();
         /*  if (this.holidayAddDisableFlag) {
            this.holidayAddDisableFlag = false;
          } */
        } else
          this.toastService.showI18nToast("Internal Server Error Occurred.", 'error');
      });
    } else {

    }
    this.newRow = false;


  }

  saveHoliday(ctrl: any, action: any) {

    let data = ctrl.value;
    console.log("Data::", data);

    if (data.holidayFrom == null) {
      this.toastService.showI18nToast("Holiday date not specified", 'error');
      return;
    }

    if (data.holidayFrom == null && data.holidayTo == null) {
      this.toastService.showI18nToast("Holiday date not specified", 'error');
      return;
    }

    if (data.holidayFrom != null && data.holidayTo == null) {
      data.holidayTo = data.holidayFrom
    }

    ctrl.patchValue({
      'isSubmit': true
    });

    if (ctrl.invalid) {
      return;
    }

    let payload = {
      "holidayPk": data.holidayPk,
      "holidayFrom": this.convert(data.holidayFrom.toString()),
      "holidayTo": data.holidayTo == null ? this.convert(data.holidayFrom.toString()) : this.convert(data.holidayTo.toString()),
      "status": data.status,
      "action": action,
    }
    console.log("payload::", payload);

    this._serviceProviderService.saveHoliday(payload).subscribe(data => {
      this.holidayDateInitialState();
      if (data['status'] == '2000') {
        this.toastService.showI18nToast(data['message'], 'success');
        this.initialFormGroup();
        this.getHolidays();
        this.holidayAddDisableFlag = false;

      } else
        this.toastService.showI18nToast(data['message'], 'error');
    });

    this.oldItems = [];
    this.newRow = false;

  }

  addHoliday() {
    this.isAddBtnClicked=true;
    let ctrl = <FormArray>this.updateHolidayForm.controls.holiday;

    let formControl = this.fb.group({
      'holidayPk': [null],
      'holidayFrom': [null],
      'holidayTo': [null],
      'isEdit': [true],
      'isSubmit': [false]
    });

    let formGroupArray = this.fb.array([]);
    formGroupArray.push(formControl);
    let arrayControl = this.updateHolidayForm.get('holiday') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      let item = arrayControl.at(i);
      formGroupArray.push(item);
    }
    this.updateHolidayForm.setControl('holiday', formGroupArray);
    this.holidayAddDisableFlag = true;
    this.newRow = true;
  }


  getOPDDoctorListANDSpecialization() {
    this._serviceProviderService.fetchDoctorListByOPD('opd').subscribe(res => {
      console.log("getOPDDoctorListANDSpecialization::",res);
      
      if (res.status === 2000) {
        this.doctorListForOPDToDisplay = res.data;
        this.setCustomCssToTheDocList(null);
        this.doctorListForOPD = res.data;
        this.cd.detectChanges();//it has been added because doctorListForOPDToDisplay array is not being displayed on html
        this.doctorListForOPD.forEach((element,index)=>{
          var obj = {
            'key': element['ref_no'],
            'value': element['name']
          };
          this.optionsDoctor.push(obj.value);
          this.optionsDoctorToDisplay.push(obj.value);
        });
        this._serviceProviderService.getSpecializationList().subscribe(res => {
          if (res.status === 2000) {
            this.specializationsListToDisplay = res.data;
            this.specializationsList = res.data;
          }
        });
      }
    });
  }


  setCustomCssToTheDocList(index: number) {
    this.doctorListForOPDToDisplay.forEach((el, ind) => {
      if (ind === index) {
        el.cssClass = "row refine-panel-border-bottom mb-0 padding10 selected-refine-by-div";
      } else {
        el.cssClass = "row refine-panel-border-bottom mb-0 padding10";
      }
    });
  }


  getDoctorHolidaysByRefNo(doctorRefNo){
    this.doctorRefNo=doctorRefNo;
  
    let payload = {
      "doctorRefNo" : this.doctorRefNo  
    }
    this._doctorService.getDoctorHolidayListByHospitalRefNo(payload).subscribe(data =>{
     
      
      if (data['status'] == '2000') {
 
        if(data.data.length>5){
          this.isPaginator = true;
        }
        this.doctorHolidays = data['data'];
        console.log("DOCTOR Holidays:::",this.doctorHolidays);
        
        let holidayArr = this.fb.array([]);
        this.doctorHolidays.forEach(t =>{
          
         console.log("holidayArr::",holidayArr);
           holidayArr.push(this.fb.group({
            'holidayFrom' : new Date(t.holidayFrom),
            'holidayTo' : new Date(t.holidayTo),            
            "doctorHolidayPk":t.doctorHolidayPk,
            'isEdit': [false],
            'isSubmit': [false]
          }));
        });
        this.doctorHolidayForm.setControl('holiday', holidayArr); 
        console.log("holidayArr::",this.doctorHolidayForm.value);
        this.allFetchData = true;
        /*#ISSUE:2087 */
        if(this.doctorHolidays.length==0){
          let ctrl = <FormArray>this.doctorHolidayForm.controls.holiday;
   
          let formControl = this.fb.group({
            'holidayFrom' : [null],
            'holidayTo' : [null],
            "doctorHolidayPk" : [null],
            'isEdit': [true],
            'isSubmit': [false]
          });
          let holidayArr = this.fb.array([]);
          holidayArr.push(formControl);
          this.doctorHolidayForm.setControl('holiday', holidayArr);
          this.doctorholidayAddDisableFlag = true;
          this.newRow = true;
        }else{
          this.doctorholidayAddDisableFlag = false;
        }
         /*#ISSUE:2087 End */
      }
    });

    
  }

  showHolidayByEntity(entityName:string){
    if(entityName.toUpperCase()=='HOSPITAL'){
      this.htmlElements.showHospitalHolidaySection=true;
      this.htmlElements.showDoctorHolidaySection=false;
      this.doctorRefNo="";
      this.broadcastService.setHeaderText('HOLIDAY CALENDAR - INSTITUTE');//#ISSUE:2087
    
    }
      

    if(entityName.toUpperCase()=='DOCTOR'){
      this.htmlElements.showHospitalHolidaySection=false;
      this.htmlElements.showDoctorHolidaySection=true;
      this.initialDoctorHolidayFormGroup();
      this.broadcastService.setHeaderText('HOLIDAY CALENDAR - DOCTORS');//#ISSUE:2087
      this.setCustomCssToTheDocList(null);
    
    }
    
  }

  // --------------------------------------- DOCTOR HOLIDAY CRUD PART -----------------------------------------------

  initialDoctorHolidayFormGroup() {
    let holidayList: FormGroup[] = [];    
    this.doctorHolidayForm = this.fb.group({
      holiday: this.fb.array(holidayList),
    });
    console.log("doctorHolidayForm::",this.doctorHolidayForm);
    
  }

  editDoctorHoliday(ctrl: any, index) {
    ctrl.patchValue({
      'isEdit': !ctrl.value.isEdit,
    });
    this.fromMaxDate = this.doctorHolidayForm.value.holiday[index].holidayTo;
    this.toMinDate = this.doctorHolidayForm.value.holiday[index].holidayFrom;
 //   console.log("ctrl:: editDoctorHoliday() Before",ctrl.get('isEdit').value);
   // this.holidayAddDisableFlag = true;
    this.doctorholidayAddDisableFlag = true; 
    this.oldItems.push(ctrl.value);
    //ctrl.get('isEdit').value = true; //
    this.newRow = false;  
 //   console.log("ctrl:: editDoctorHoliday() After",ctrl.get('isEdit').value);
  }

  cancelDoctorHoliday(ctrl, inx, iconType) {
    console.log("Cancel:::",ctrl)
   // this.holidayAddDisableFlag = false;
   this.doctorholidayAddDisableFlag = false;
   this.holidayDateInitialState();
    //console.log("cancelDoctorHoliday before::",ctrl.get('isEdit').value);
    if(ctrl.value.doctorHolidayPk==null){
      this.holiday.controls.splice(inx, 1);
      this.holiday.value.splice(inx, 1);
      return false;
    }
    else{
      let arrayControl = this.doctorHolidayForm.get('holiday') as FormArray;
      let holiday=this.doctorHolidays.find(doctorHoliday=>doctorHoliday.doctorHolidayPk===ctrl.value.doctorHolidayPk);
      console.log("Holiday:::",holiday)
      this.holiday.controls.splice(inx,1);
          let formControl = this.fb.group({
        'holidayFrom' : new Date(holiday.holidayFrom),
        'holidayTo' : new Date(holiday.holidayTo),
        'doctorHolidayPk': holiday.doctorHolidayPk,
        'isEdit': [false],
        'isSubmit': [false]
  });
 
  arrayControl.insert(inx, formControl); 
    }
     ctrl.get('isEdit').value = !ctrl.get('isEdit').value;
    this.newRow = false;
  
    
  }//end of method


  deleteDoctorHoliday(ctrl: any, index: number) {
    let data = ctrl.value;
    console.log(data);
    if (confirm('Are you want to cancel this holiday?')){
      let payload = {
        "doctorHolidayPk" : data.doctorHolidayPk,
        "doctorRefNo" : this.doctorRefNo,        
        "action" : "DELETE" 
      }
      console.log(payload);
      this._doctorService.updateDoctorHoliday(payload).subscribe(data =>{
        if(data['status']=='2000'){
          this.toastService.showI18nToast("Holiday Canceled Successfully.", 'success');
        //  this.initialFormGroup();
          this.getDoctorHolidaysByRefNo(this.doctorRefNo);
         /*  if (this.holidayAddDisableFlag) {
            this.holidayAddDisableFlag = false;
          } */
          this.doctorholidayAddDisableFlag = false; 
        }else 
          this.toastService.showI18nToast("Internal Server Error Occurred.", 'error');   
      });
    }else{

    }
    this.newRow = false;
    
    
  }//end of method

  saveDoctorHoliday(ctrl: any, action: any) {
    console.log("CTRL::",ctrl);
    let data = ctrl.value;

    if (data.holidayFrom == null || data.holidayTo == null) {
      this.toastService.showI18nToast("Please select date", 'error');
      return;
    }

    if (data.holidayFrom == null && data.holidayTo == null) {
      this.toastService.showI18nToast("Please select date", 'error');
      return;
    }
    
    
    ctrl.patchValue({
      'isSubmit': true
    });
    if (ctrl.invalid) {
      return;
    }

    if(data.doctorHolidayPk){
      action="UPDATE";
    }else{
      action="SAVE";
    }
    
    let payload = {
      "doctorHolidayPk" : data.doctorHolidayPk,      
      "holidayFrom" :this.convert(data.holidayFrom.toString()),
      "holidayTo" : data.holidayTo==null?this.convert(data.holidayFrom.toString()):this.convert(data.holidayTo.toString()),
      
      "doctorRefNo" : this.doctorRefNo,
      "action" : action
      
    }
  
    
    this._doctorService.updateDoctorHoliday(payload).subscribe(data =>{
      this.holidayDateInitialState();
      if(data['status']=='2000'){
        this.toastService.showI18nToast(data['message'], 'success');
        this.initialDoctorHolidayFormGroup();
        this.getDoctorHolidaysByRefNo(this.doctorRefNo);
        //this.holidayAddDisableFlag = false;
        this.doctorholidayAddDisableFlag = false; 
      }else 
        this.toastService.showI18nToast(data['message'], 'error');   
    });

    this.oldItems = [];
    this.newRow = false;
  }//end of method


  
  addDoctorHoliday(){
    let ctrl = <FormArray>this.doctorHolidayForm.controls.holiday;
   
    let formControl = this.fb.group({
      'holidayFrom' : [null],
      'holidayTo' : [null],
      "doctorHolidayPk" : [null],
      'isEdit': [true],
      'isSubmit': [false]
    });

    let formGroupArray = this.fb.array([]);
    formGroupArray.push(formControl);
    let arrayControl = this.doctorHolidayForm.get('holiday') as FormArray;
    for (let i = 0; i < arrayControl.length; i++) {
      let item = arrayControl.at(i);
      formGroupArray.push(item);
    }
    this.doctorHolidayForm.setControl('holiday', formGroupArray);
  //  this.holidayAddDisableFlag = true;
  this.doctorholidayAddDisableFlag = true; 
    this.newRow = true;
  }

  get holiday(): FormArray { // Used to get doctorHolidayList from main form
    return this.doctorHolidayForm.get('holiday') as FormArray;
  }

  findDoctorHolidayAndMakeSelected(doctorRefNo,index){
    this.getDoctorHolidaysByRefNo(doctorRefNo);
    this.setCustomCssToTheDocList(index);
  }

  onDateChange(type, index, formType) {
    if(type == 'from') {
      if(formType == 'updateHolidayForm') {
        this.toMinDate = this.updateHolidayForm.value.holiday[index].holidayFrom; 
      } else {
        this.toMinDate = this.doctorHolidayForm.value.holiday[index].holidayFrom;
      }
    } else {
      if(formType == 'updateHolidayForm') {
        this.fromMaxDate = this.updateHolidayForm.value.holiday[index].holidayTo;
      } else {
        this.fromMaxDate = this.doctorHolidayForm.value.holiday[index].holidayTo;
      }
    }
  }

}

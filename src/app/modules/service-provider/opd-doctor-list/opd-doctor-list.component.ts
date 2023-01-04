import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { HttpRequest } from "@angular/common/http";
import { BroadcastService } from '../../../core/services/broadcast.service';
import { ServiceProviderService } from '../service-provider.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';
import { DoctorService } from '../../doctor/doctor.service';
import { environment } from 'src/environments/environment';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-opd-doctor-list',
  templateUrl: './opd-doctor-list.component.html',
  styleUrls: ['./opd-doctor-list.component.css']
})
export class OpdDoctorListComponent implements OnInit, OnDestroy {

  user_id: any;
  doctorForm: FormGroup;
  fetchDoctorList: any;
  opdDoctorList: any[] = [];
  isPaginator = false;
  loggedInUser: any;
  showResult = false;
  noResultFound = false;
  refinePanelSearchMsgShow: boolean = false;
  panelVisible = false;
  daysOfWeekModel: { 1: string; 2: string; 3: string; 4: string; 5: string; 6: string; 7: string; };
  specifications: any[] = [];//to store Specializations
  daysOfWeek: any[] = [];//to store days of week 
  qualifications: any[] = [];//to store qualifications
  opdDoctorListFormGroup: FormGroup;
  showErrorMSgFlag: boolean = false;
  timeSlotDetails: any[] = [];
  loading: boolean = false;
  selectedDoctor: any;
  modalRef: BsModalRef;
  @ViewChild('doctorSignatureUploadModal') doctorSignatureUploadModal: TemplateRef<any>;
  domSanitizer: DomSanitizer;
  constructor(private _serviceProviderService: ServiceProviderService, private fb: FormBuilder, private _doctorService: DoctorService,private http: HttpClient,    private bsModalService: BsModalService,
    private _domSanitizer: DomSanitizer,private route: ActivatedRoute, private router: Router, private toastService: ToastService, private broadcastService: BroadcastService) { 
      this.buildForm();
      this.domSanitizer = _domSanitizer;
  }//end of constructor

  ngOnInit() {
    //this.showResult = false;
    this.loading = true;
    document.body.classList.add('hide-bodyscroll');
    document.body.classList.add('prescription-screen');//to remove the screen layout
    const user = JSON.parse(localStorage.getItem('user'));
    this.loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (user) 
      this.user_id = user.userId;
    this.getDaysOfWeeksNTimeSlot();
    this.getOpdDoctorListByWSCall();
  }//end of oninit

  ngOnDestroy(): void {
    document.body.classList.remove('prescription-screen');//to remove the screen layout
  }//end of on destroy

  buildForm() {// method to build form
    let opdDoctorListFormGroup: any ={
      "patientName": new FormControl()
    }
    this.opdDoctorListFormGroup =  new FormGroup(opdDoctorListFormGroup);
  }//end of method

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

  //method to get opd doctor list by ws call
  getOpdDoctorListByWSCall(){
    this._serviceProviderService.fetchDoctorListByOPD('all').subscribe(res => {
      this.fetchDoctorList = res.data;
      this.opdDoctorList = res.data;
      this.specifications = this.getSpecializationsAndDaysOfWeek('specifications');
      this.qualifications = this.getSpecializationsAndDaysOfWeek('qualifications');
      // this.daysOfWeek = this.getSpecializationsAndDaysOfWeek('dayofweeks');
      //this.showResult = true;
      this.loading = false;
      document.body.classList.remove('hide-bodyscroll');
      this.searchByKeyboardInput();//filter
      if (this.fetchDoctorList.length > 10) {
        this.isPaginator = true;
      } else {
        this.isPaginator = false;
      }
    });
  }//end of method

  //method to get specialization n daysofweek 
  getSpecializationsAndDaysOfWeek(checkedElement): any[] {
    let localArray: any[] = [];
    this.fetchDoctorList.forEach(element => {
      if (element[checkedElement]) {
        if (element[checkedElement].indexOf(',') === -1) {
          ((localArray.indexOf(element[checkedElement].trim()) === -1) ? localArray.push(element[checkedElement].trim()) : null);
        } else {
          let splitArr = element[checkedElement].split(',');
          splitArr.forEach(el => {
            (el) ? ((localArray.indexOf(el.trim()) === -1) ? localArray.push(el.trim()) : null) : null;
          });
        }
      }
    });
    return localArray.map(element=>({
      'value':element,
      'selected': false
    }));
  }//end of method

  // method to map checkbox value with the filter array
  mapFilterArray(localArray: any[]){
    localArray.forEach(el=>el.selected = false);
    return localArray;
  }//end of method

  //method to filter data
  allCheckboxFilter(selectedObj){
    selectedObj["selected"] = !selectedObj["selected"];
    this.fetchDoctorList = this.updateOPDDoctorList();
  }//end of method

  //method to reset filter
  resetFilter(resetField){
    switch(resetField){
      case "specification":{
        this.specifications = this.mapFilterArray(this.specifications);
        this.fetchDoctorList = this.updateOPDDoctorList();
        break;
      }
      case "qualification":{
        this.qualifications = this.mapFilterArray(this.qualifications);
        this.fetchDoctorList = this.updateOPDDoctorList();
        break;
      }
      case "daysOfWeek":{
        this.daysOfWeek = this.mapFilterArray(this.daysOfWeek);
        this.fetchDoctorList = this.updateOPDDoctorList();
        break;
      }
      case "patientName":{
        this.opdDoctorListFormGroup.patchValue({'patientName': ""});
        this.fetchDoctorList = this.updateOPDDoctorList();
        break;
      }
      case "all":{
        this.specifications = this.mapFilterArray(this.specifications);
        this.qualifications = this.mapFilterArray(this.qualifications);
        this.daysOfWeek = this.mapFilterArray(this.daysOfWeek);
        this.opdDoctorListFormGroup.patchValue({'patientName': ""});
        this.fetchDoctorList = this.updateOPDDoctorList();
        break;
      }
    }
  }//end of method

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }
  
  //method to update opd doctor list
  updateOPDDoctorList(): any[] {
    let specificationsLocalArr: any = this.specifications.filter(el=>el.selected);
    let quallificationsLocalArr: any = this.qualifications.filter(el=>el.selected);
    let daysOfWeekLocalArr: any = this.daysOfWeek.filter(el=>el.selected);
    let opdDoctorListLocalArr: any = this.opdDoctorList;
    (this.opdDoctorListFormGroup.controls["patientName"].value)? 
      (opdDoctorListLocalArr = opdDoctorListLocalArr.filter(opdDocListEl=>(opdDocListEl.name.toLocaleLowerCase().includes(this.opdDoctorListFormGroup.controls["patientName"].value.toString().toLocaleLowerCase()))))
      : opdDoctorListLocalArr;
    if(specificationsLocalArr.length > 0){
      opdDoctorListLocalArr = this.updateDoctorListAccordingToCheckbox(opdDoctorListLocalArr,"specifications",specificationsLocalArr);
    }
    if(quallificationsLocalArr.length > 0){
      opdDoctorListLocalArr = this.updateDoctorListAccordingToCheckbox(opdDoctorListLocalArr,"qualifications",quallificationsLocalArr);
    }
    if(daysOfWeekLocalArr.length > 0){
      opdDoctorListLocalArr = this.updateDoctorListAccordingToCheckbox(opdDoctorListLocalArr,"dayofweeks",daysOfWeekLocalArr);
    }    

   (opdDoctorListLocalArr.length > 0) ? this.showErrorMSgFlag = false: this.showErrorMSgFlag = true;
    return opdDoctorListLocalArr;
  }//end of method
  
  //method to search By keyboard input
  searchByKeyboardInput(){
    this.opdDoctorListFormGroup.controls["patientName"].valueChanges.subscribe(value=>{
      let opdDoctorList: any[] = this.updateOPDDoctorList();
      this.fetchDoctorList = opdDoctorList.filter(opdDocListEl=>(opdDocListEl.name.toLocaleLowerCase().includes(value.toString().toLocaleLowerCase())));
    });
  }

  //method to update the list according to filter
  updateDoctorListAccordingToCheckbox(arrayToBeSorted:any[],fieldName: string,searchArr:string[]): any[]{
   let returnArr: any = [];
   arrayToBeSorted.forEach(element=> {
     let searchFlag = false;
     for(let searchEL of searchArr){
        searchFlag = false;
        if(element[fieldName].includes(searchEL['value'])){
          searchFlag = true;
          break;
        }
      }//end of for
      if(searchFlag)
        returnArr.push(element);
    });
    return returnArr;
  }//end of method

  editDoctor(q) {
    this.router.navigate(['opd/addDoctor', { ref_no: q.ref_no }]);
  }
  deleteDoctor(index, query) {
    // console.log(index, query);
    let request = {
      "contactNo": query.contactNo,
      "ref_no": query.ref_no,
      "msUserPk": query.msUserPk,
      "name": query.name,
      "userId": this.user_id,
      "serviceRefNo": this.loggedInUser.serviceProviderRefNo //https://gitlab.com/sbis-poc/app/-/issues/2615
    };
    // Service provider ref no - issue app#604
    let payload = {
      "refNo": query.ref_no,
      "entityName": this.loggedInUser.entityName,
      "roleName": this.loggedInUser.roleName,
      "opdRefNo": this.loggedInUser.serviceProviderRefNo,
    };
    // console.log("request", request);
    if (confirm('Are you sure to remove the doctor from your OPD?')) {
      this._doctorService.getDoctorAppointmentsV2(payload).subscribe(res => {
        console.log(res);
        let appointmentList = res['data'].appointmentList;
        if (appointmentList != null && appointmentList.length != 0) {
          if (confirm('Are you sure to cancel all ' + appointmentList.length + ' appointment(s)?')) {
            this._serviceProviderService.getDoctorAppointmentAndChamberUpdate(request).subscribe(res => {
              console.log("request ", res);
              this.fetchDoctorList.splice(index, 1);
              this.toastService.showI18nToast('OPD_MESSAGE.DOCTOR_REMOVED_FROM_OPD', "success");
            }, (error) => {
              this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
              return;
            });
          } else { }
        } else {
          this._serviceProviderService.getDoctorAppointmentAndChamberUpdate(request).subscribe(res => {
            console.log("request ", res);
            this.fetchDoctorList.splice(index, 1);
            this.toastService.showI18nToast('OPD_MESSAGE.DOCTOR_REMOVED_FROM_OPD', "success");
          }, (error) => {
            this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
            return;
          });
        }
      }, (error) => {
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
        return;
      });
    } else { }
  }



  selectSignatureFile(event: any,rowData:any){
    const file = event.target.files[0];
    if (Math.round(file.size / 1024) > 500) {
      document.getElementById("signaturePhoto")["value"] = "";
      this.toastService.showI18nToast("DOCTOR_PROFILE.IMAGE_LESS_THAN" , 'warning');
      return;
    }
    let formdata = new FormData();
    let documentDtoList = JSON.stringify({
      "fileUploadFor": "DOCTOR",
      "doctor_RefNo":rowData.ref_no
    });

    formdata.append('file', file);
    formdata.append('document', documentDtoList);
    this.saveDocument(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) 
          this.toastService.showI18nToast("DOCTOR_PROFILE.DOCTOR_PROFILE_SIGNATURE_UPLOADED" , 'success');
         else 
          this.toastService.showI18nToast(response.message, 'error')
        
        this.modalRef.hide();
      }
    });
  }//end of method
  saveDocument(formData:any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl+'gen/v1/upload-document', formData, {
      responseType: 'text'
    });
    return this.http.request(req);   
  }//end of method

  //method to fetch doctor signature
  getDoctorUploadedUmages(refNo:string){        
      var request={
        "refNo":refNo
      }
      this._doctorService.fetchUserDtls(request).subscribe(
        res => {
          // console.log("res",res);
          this.selectedDoctor.signatureSrc = "";
          if(res.signatureFilePath!=null)
            this.selectedDoctor.signatureSrc = "data:image/jpeg;base64," + res.signatureImage; 
          else{}

          this.modalRef = this.bsModalService.show(this.doctorSignatureUploadModal, { class: 'modal-md' });

        },err=>{
          this.toastService.showI18nToast("Some error has been occured. Please try again","error");
        });
  }//end of method

  openUploadDoctorSignatureModal(selectedDoctor: any){
    this.selectedDoctor = selectedDoctor;
    this.getDoctorUploadedUmages(this.selectedDoctor.ref_no);
    
  }//end of method


  resetDoctorSignatureHeaderFooterImage(imageType:string){
    let query: any = {
      imageType: imageType,
      drRefNo: this.selectedDoctor.ref_no
    }
    this._doctorService.resetDoctorSignatureHeaderFooterImage(query).subscribe(res => {
      this.selectedDoctor.signatureSrc="";
      this.toastService.showI18nToast('TOAST_MSG.IMAGE_DELETE_SUCCESS_MSG',"success");
    },
    (error) => { 
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR',"error");
      return;
    });
  }//end of method

}//end of class

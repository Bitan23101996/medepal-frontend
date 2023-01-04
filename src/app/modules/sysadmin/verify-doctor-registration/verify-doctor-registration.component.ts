import { Component, OnInit } from '@angular/core';
import { DoctorService } from '../../doctor/doctor.service';
import { ToastService } from '../../../core/services/toast.service';
import { DeliveryService } from '../../delivery/delivery.service';
import { SBISConstants } from '../../../SBISConstants';
import { environment } from '../../../../environments/environment';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-verify-doctor-registration',
  templateUrl: './verify-doctor-registration.component.html',
  styleUrls: ['./verify-doctor-registration.component.css']
})
export class VerifyDoctorRegistrationComponent implements OnInit {

  title: any;
  doctorList: any =[];
  reasonMnd: any;
  uploadMnd: any;
  resonList: any = [];
  panelVisible = false;
  dateFormat: any;
  refineDoctorForm: FormGroup;
  searchList: any;
  searchStr: any;

  constructor(
    private _doctorService: DoctorService,
    private _toastService: ToastService,
    private _deliveryService: DeliveryService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.title = "Verify Doctor";
    this.dateFormat = environment.DATE_FORMAT;
    this.reasonMnd = [];
    this.uploadMnd = [];
    this.createRefineDoctorForm();
    this.refineDoctorList();
  }
createRefineDoctorForm(){
    this.refineDoctorForm = this.fb.group({
      doctorName: [null],
      yearOfRegistration: [null],
    });
  }

  getAllNonVerifiedDoctor(){
    this._doctorService.getAllNonVerifiedDoctor().subscribe(res => {
      if(res['status']=='2000')
         this.doctorList =  res['data'];
         console.log("*******Doctor List*********");
         console.log(this.doctorList);      
    });
  }

  refineDoctorList(){
    console.log(this.refineDoctorForm.value);
    
    this._doctorService.filterAllNonVerifiedDoctor(this.refineDoctorForm.value).subscribe(res => {
      if(res['status']=='2000')
         this.doctorList =  res['data'];
         console.log("*******Doctor List*********");
         console.log(this.doctorList);      
         console.log(this.doctorList.length);    
    });
  }

  getResponse(response){
    if(response){
      this.ngOnInit();
    }
  }

  refinePanelDisplay() {
    this.panelVisible = !this.panelVisible;
  }

  refinePanelhide() {
    this.panelVisible = false;
  }

  resetAll(){
    this.refineDoctorForm.patchValue({
      doctorName: null,
      yearOfRegistration: null,
    });
    this.refineDoctorList();
  }

}

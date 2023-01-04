import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DoctorService } from '../../doctor/doctor.service';
import { ToastService } from '../../../core/services/toast.service';
import { DeliveryService } from '../../delivery/delivery.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-search-doctor-to-verify',
  templateUrl: './search-doctor-to-verify.component.html',
  styleUrls: ['./search-doctor-to-verify.component.css']
})
export class SearchDoctorToVerifyComponent implements OnInit {

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
  approvalStatusList: any = [];
  approvalStatusArr = [];
  searchListLength; any;
  allDataFetched: boolean = false;

  constructor(
    private _doctorService: DoctorService,
    private _toastService: ToastService,
    private _deliveryService: DeliveryService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.title = "Search Doctor";
    this.dateFormat = environment.DATE_FORMAT;
    this.reasonMnd = [];
    this.uploadMnd = [];
    this.searchList= [];
    this.getRegistrationApprovalStatusList();
    this.createRefineDoctorForm();
    this.searchDoctorList();
  }
createRefineDoctorForm(){
    this.refineDoctorForm = this.fb.group({
      doctorName: [""],
      registrationNo: [""],
      verificationStatus: [""],
      approvalStatus: [null],
    });
  }
  getRegistrationApprovalStatusList(){
    this._doctorService.getRegistrationApprovalStatusList()
    .subscribe(res =>{
      console.log("*******Approval Status List*********");
      console.log(res);
      this.approvalStatusList = res.masterDataAttributeValues;
      
    });
  }
  approvalStatusChange(e, type){
    if(e.target.checked){
      console.log(type.attributeValue);
      let index = this.findIndexToUpdateMode(type.attributeValue);
      if(index >= 0){

      }else{
        this.approvalStatusArr.push(type.attributeValue);
      }  
      console.log(this.approvalStatusArr);
    }
    else{ 
     let index =this.findIndexToUpdateMode(type.attributeValue); 
     console.log("index = "+index)
     this.approvalStatusArr.splice(index, 1);

     console.log(this.approvalStatusArr);
    }
    console.log("stat = "+this.approvalStatusArr);
  }

  findIndexToUpdateMode(attributeValue) { 
    for(let i=0;i<this.approvalStatusArr.length;i++){
      if(this.approvalStatusArr[i]==attributeValue)
        return i;
    }      
  }
  getAllNonVerifiedDoctor(){
    this._doctorService.getAllNonVerifiedDoctor().subscribe(res => {
      if(res['status']=='2000')
         this.doctorList =  res['data'];
         console.log("*******Doctor List*********");
         console.log(this.doctorList);      
    });
  }

  searchDoctorList(){
    console.log(this.refineDoctorForm.value);
    this.searchList= [];
    this.searchStr = "";

    if(this.refineDoctorForm.value.doctorName!="")
      this.searchStr=this.searchStr+"doctorName:"+ this.refineDoctorForm.value.doctorName;

    if(this.refineDoctorForm.value.registrationNo!="")
      this.searchStr=this.searchStr+";registrationNo:"+ this.refineDoctorForm.value.registrationNo;
     
    if(this.refineDoctorForm.value.verificationStatus!="")
      this.searchStr=this.searchStr+";verificationStatus:"+ this.refineDoctorForm.value.verificationStatus;
  
    if(this.approvalStatusArr.length !=0) 
      this.searchStr=this.searchStr+";approvalStatus:"+ this.approvalStatusArr; 
    
    // this._doctorService.filterAllNonVerifiedDoctor(this.refineDoctorForm.value).subscribe(res => {
    //   if(res['status']=='2000')
    //      this.doctorList =  res['data'];
    //      console.log("*******Doctor List*********");
    //      console.log(this.doctorList);      
    //      console.log(this.doctorList.length);    
    // });
    console.log("********Search String*******");
    console.log(this.searchStr);
    this._doctorService.getDoctorListForVerification('?search='+this.searchStr).subscribe(data => {
      console.log(data); 
      if(data['status']=='2000' && data.data.length!=0){
        this.searchList=data.data;
        console.log(this.searchList);        
        this.searchListLength = data.data.length;
        this.allDataFetched = true;
      }else if(data['status']=='2000' && data.data.length==0){
        this.searchList=null;
        this.allDataFetched = true;
        this.searchListLength = 0;
      }else if(data['status']=='2500'){
        alert(data.message);
        this.searchList=null;
        this.allDataFetched = true;
        this.searchListLength = 0;
      }
     
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
    // Working on app/issue/1974
   /*  this.refineDoctorForm.patchValue({
      doctorName: null,
      yearOfRegistration: null,
    }); */
    this.createRefineDoctorForm();
    // End Working on app/issue/1974
    this.searchDoctorList();
  }

  resetApprovalStatus(){
    console.log("reset");
  }
  resetVerification(){
    console.log("reset");
  }
}

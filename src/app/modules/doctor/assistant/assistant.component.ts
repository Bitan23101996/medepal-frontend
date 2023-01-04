import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { DoctorService } from '../doctor.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ServiceProviderService } from '../../service-provider/service-provider.service';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { GetSet } from '../../../core/utils/getSet';
import { JsonTranslation } from '../../../shared/translation';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { SBISConstants } from '../../../SBISConstants';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['./assistant.component.css']
})
export class AssistantComponent implements OnInit, OnDestroy {
  assistant: FormGroup;
  isPhExist: any;
  isEdit: boolean=false;
  ifEmailExist: any;
  submitted: any = false;
  isReadOnlyEmail:any = false;
  isReadOnlyContact:any =false;
  isExistMultiRole:any =false;
  roleList: any = [];
  msUserPk: any;
  userRolePk: any;
  addNewUserList:any= [];
  user:any;
  resdata:any[] = [];
  isPaginator=false;
  @ViewChild('assistantModal')
  assistantModal: TemplateRef<any>;

  modalRef: BsModalRef;
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  confirmationMsg: any = [];
  
  constructor(private fb:FormBuilder,  private authService: AuthService,
    private toastService: ToastService, private _opdService: ServiceProviderService,
    private _doctorService: DoctorService,private bsModalService: BsModalService,private broadcastService: BroadcastService,
    private jsonTranslate: JsonTranslation,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.broadcastService.setHeaderText('LIST OF ASSISTANTS');
    // Added refNo for issue app#620
    this.assistant= this.fb.group({
      userRole: ['ASSISTANT'],
      userName: [null,[ Validators.required]],
      email: [null, [ Validators.email]],
      contact: [null],
      status: [null],
      msUserPk:[null],
      miscUserMappingPk: [null],
      parentRoleName: ['DOCTOR'],
      roleName: ['ASSISTANT'],
      refNo: [null],
      doctorPk:[this.user.id],
      userId: [null],
      entityName:["DOCTOR"],
      email_verification_status:[null],
      contact_verification_status:[null],
      otp:[null],
     
    });
    this._opdService.UserRolesList({
      "contact": "",
      "designation":"" ,
      "email": "",
      "parentRoleName": "ASSISTANT",
      "roleName": "",
      "status": "",
      "userId": this.user.userId,
      "userName":"" ,
      "doctorPk":this.user.id,
      "userRole": ""
    }).subscribe(data => {
      if(data.status == 2000) {
        this.resdata=data.data;

        if(this.resdata.length>5){
          this.isPaginator=true;
        }else{
          this.isPaginator=false;
        }
        if(data.status!=2000){
          this.toastService.i18nToast("en", data.message , "error");
        }
      }
    },(error) => {
      this.toastService.i18nToast("en", "Internal Server Problem" , "error");
      this.submitted = false;
      return;
    });

    if(GetSet.getAddAnotherAssistantBoolean()) {
      this.openModal();
    }
    
  }

  ngOnDestroy() {
    GetSet.setAddAnotherAssistantBoolean(false);
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
 

  checkDuplicateEmail()
  {

if(this.assistant.value.email!='' && this.assistant.value.email!=null){
    if(!this.isReadOnlyEmail){
      if (this.isEdit) {
        this._doctorService.GetEmail(this.assistant.value.email).subscribe(
        (res) => {
          let response: any = res;
          console.log("emailcheck",res);
          
          this.ifEmailExist = response.status;
          this.isExistMultiRole=false;
          if (this.ifEmailExist == 2000) {
            this.submitted = false;
            this.toastService.i18nToast("en", response.message , "error");
            this.assistant.patchValue({
              email: ""
            });
            return;
          }
        },
        (error) => {
          this.toastService.i18nToast("en", "Email already exist" , "error");
          this.submitted = false;
          return;
        })
      } else {

        let query = {
          'eaddress':this.assistant.value.email,
          'roleName': "ASSISTANT",
          'entityName': "DOCTOR",
        }

      
        this.authService.checkUsername(query).subscribe((result) => {
        console.log("emailcheck_multirole",result);
        if (result.data.eaddressAvailableCode == 2102) {
          //success
        } else if (result.data.eaddressAvailableCode == 2101) {
          this.toastService.i18nToast("en", result.data.message , "error");
          this.assistant.patchValue({
            email: ""
          });
        } else if (result.data.eaddressAvailableCode == 2103) {
          this.roleList.length = 0;
          this.msUserPk = result.data.msUserPk;
          let list = result.data.eAddressDetails;
          this.isExistMultiRole=true;
          let role1;
          for(let role of list) {
            this.userRolePk = role.rolePk;
            role['userName']=this.assistant.value.email;
            role['addNewRole']= this.assistant.value.userRole;
            this.roleList.push(role);
            role1=role.roleName;
            if(role1==='ADMIN' || role1==='OPERATOR' || role1==='ASSISTANT'){
              this.toastService.showI18nToast('DOCTOR_PROFILE.ASSISTANT_EMAIL_EXISTS', 'error');
              this.assistant.patchValue({
                email: ""
              });
            }
            console.log(this.roleList);
          }
        }
      },(error) => {
        this.submitted = false;
        this.toastService.i18nToast("en", "Internal Server Problem" , "error");
        this.submitted = false;
        return;
      });
    }
  }
}
}

checkContactNumber() {
  if(!this.isReadOnlyContact){
  if(this.isEdit){
    if(this.assistant.value.contact.length>12){
    this.isEdit=false;
    this._doctorService.GetPh('' + this.assistant.value.contact).subscribe(res => {
      let response: any = res;
      this.isPhExist = response.status;
      if (this.isPhExist == 2000) {
        this.submitted = false;
        this.toastService.i18nToast("en", response.message , "error");
        this.assistant.patchValue({
          contact: ""
        });
        return;
      }
    },
      (error) => {
        this.toastService.showI18nToast('DOCTOR_PROFILE.ASSISTANT_PHONE_EXISTS',"error"); // app#817
        this.submitted = false;
        return;
      });
    }
  }else{

    if(this.assistant.value.contact.length>12){
      console.log(this.assistant.value.contact);
      let query = {
        'eaddress': this.assistant.value.contact,
        'roleName': "ASSISTANT",
        'entityName': "DOCTOR"
      }
    
      console.log(query);
      this.authService.checkContactno(query).subscribe((result) => {
        console.log(result);
        if (result.data.eaddressAvailableCode == 2102) {
          //success
          console.log("2102",result);
        } else if (result.data.eaddressAvailableCode == 2101) {
         
          this.toastService.i18nToast("en", result.data.message , "error");
          this.assistant.patchValue({
            contact: ""
          });
        } else if (result.data.eaddressAvailableCode == 2103) {
          this.roleList.length = 0;
          this.msUserPk = result.data.msUserPk;
          let list = result.data.eAddressDetails;
          let role1;
          this.isExistMultiRole=true;
          for(let role of list) {
            this.userRolePk = role.rolePk;
            role['userName']=this.assistant.value.contact;
            role['addNewRole']=this.assistant.value.userRole;
            this.roleList.push(role);
            role1=role.roleName;
            // app#817
            if(role1==='ADMIN' || role1==='OPERATOR' || role1==='ASSISTANT'){
              this.toastService.showI18nToast('DOCTOR_PROFILE.ASSISTANT_CONTACT_EXISTS',"error");
              this.assistant.patchValue({
                contact: ""
              });
            }
          }
        }
      },(error) => {
        this.submitted = false;
        this.toastService.i18nToast("en", "Internal Server Problem" , "error");
        this.submitted = false;
        return;
      });
    }
  }
}
} 
openModal() {
  //Working on app/issues/893
  this.assistant= this.fb.group({
    userRole: ['ASSISTANT'],
    userName: [null,[ Validators.required]],
    email: [null, [ Validators.email]],
    contact: [null],
    status: [null],
    msUserPk:[null],
    miscUserMappingPk: [null],
    parentRoleName: ['DOCTOR'],
    roleName: ['ASSISTANT'],
    refNo: [null],
    doctorPk:[this.user.id],
    userId: [null],
    entityName:["DOCTOR"],
    email_verification_status:[null],
    contact_verification_status:[null],
    otp:[null],
  });
  //End Working on app/issues/893
  this.isReadOnlyContact=false;
  this.isReadOnlyEmail=false;
  this.modalRef = this.bsModalService.show(this.assistantModal, this.config);
}

closeModal() {
  this.ngOnInit();
   this.modalRef.hide();
 }

 checkEmailorMobileExistance()
  {
  
    if((this.assistant.value.email == null || this.assistant.value.email == '')  && (this.assistant.value.contact == null || this.assistant.value.contact == ''))
    return false;
    else
    return true;
  }
 
 submit() {
    if(!this.checkEmailorMobileExistance())
    {
      this.toastService.i18nToast("en", "Please enter email or mobile number" , "warning");
      return;
    }

    this.submitted = true;
    if(this.assistant.invalid){
      this.toastService.i18nToast("en", "There are some incorrect entries in the form - please check" , "warning");
      return;
    }
    if(this.isExistMultiRole){
      this.isExistMultiRole=false;
      let usersignuprequest = {
        'msUserPk': this.msUserPk,
        'rolePk': this.userRolePk,
        'roleName': "ASSISTANT",
        'entityName': "DOCTOR",
        'doctorPk': this.user.id,
        'isOpd': false,

      }
      this.authService.userSignUpRequestV2(usersignuprequest).subscribe(result=>{ // app#2070
        this.modalRef.hide();
        if(result.status==2000){
          this.toastService.i18nToast("en", result.message , "success");
          this.goToConfirmationPage(result);
        }else{
          this.toastService.i18nToast("en", result.message , "error");
        }
        // this.ngOnInit();
      },
      error => {
        this.toastService.i18nToast("en", "Internal Server Problem" , "error");
        this.submitted = false;
        return;
      });
    }else{
      this.addNewUserList=[];
      this.addNewUserList.push(this.assistant.value);
      this._opdService.saveRolesForHospital(this.addNewUserList).subscribe(data => {
        this.submitted = false;
        this.modalRef.hide();
        if(data.status==5051){
          this.toastService.i18nToast("en", data.message , "warning");
        }else if(data.status!=2000){
          this.toastService.i18nToast("en", "Assistant created Unsuccessful" , "error");
        }else {
            this.toastService.i18nToast("en", "Assistant saved successfully" , "success"); //Working on app/issues/893 - Msg change
            this.goToConfirmationPage(data);
        }
        // this.ngOnInit();
      },(error) => {
        this.submitted = false;
        this.toastService.i18nToast("en", "Internal Server Problem" , "error");
        this.submitted = false;
        return;
      });
    }
  }

  goToConfirmationPage(info) {
    GetSet.setAddAnotherAssistantBoolean(false);
    this.confirmationMsg = [];
    this.confirmationMsg.push(info.data.name + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ADDED_AS_AN') + info.data.roleName);
    if(info.data.contactNo) {
      this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.ACCOUNT_PASS_SEND_BY_SMS') + info.data.name + this.jsonTranslate.translateJson('CONFIRMATION_MSG.S_MOBILE'));
      this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.ASK_YOU') + info.data.roleName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.TO_LOGIN_USING_MOBILE'));
    } else {
      this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.ACCOUNT_PASS_SEND_BY_MAIL') + info.data.name + this.jsonTranslate.translateJson('CONFIRMATION_MSG.S_EMAIL'));
      this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.ASK_YOU') + info.data.roleName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.TO_LOGIN_USING_EMAIL'));
    }
    
    let confirmationInfo = {};
    confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
    confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.ASSISTANT_LIST;
    confirmationInfo['confirmationMsg'] = this.confirmationMsg;
    confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.ADD_ASSISTANT;
    confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.ADD_ASSISTANT;
    confirmationInfo['buttonTwoName'] = SBISConstants.SECONDARY_ACTION_BUTTON_NAME.ADD_ANOTHER_ASSISTANT;
    GetSet.setConfirmationInfo(confirmationInfo);
    //end of confirm page info set
    this.router.navigate(['confirmation']);
  }

  deleteUser(query)
  {
      if (confirm('Are you sure to remove ?')) {
      this.addNewUserList=[];
      // Added refNo for issue app#620
      this.assistant.patchValue({
        userName:query.userName,
        contact: query.contact,
        email:query.email,
        status:"CXL",
        msUserPk:query.msUserPk,
        miscUserMappingPk:query.miscUserMappingPk,
        parentRoleName:"DOCTOR",
        roleName:"ASSISTANT",
        entityName:"DOCTOR",
        refNo:query.refNo,
        doctorPk:this.user.id,
        userId:query.userId,
        email_verification_status:query.email_verification_status,
        contact_verification_status:query.contact_verification_status,
        otp:"",
        userRole:"ASSISTANT"
    
      });
       
       this.addNewUserList.push(this.assistant.value);
       console.log("request",this.addNewUserList);
       this._opdService.saveRolesForHospital(this.addNewUserList).subscribe(data => {
        console.log(data);
        if(data.status==5051){
          this.toastService.i18nToast("en", data.message , "warning");
        }else if(data.status!=2000){
          this.toastService.i18nToast("en", "Assistant removed Unsuccessful" , "error");
        }else{
          this.toastService.i18nToast("en", "Assistant removed successfully" , "success");
          this.ngOnInit();    
        }
       
      },(error) => {
        this.submitted = false;
        this.toastService.i18nToast("en", "Internal Server Problem" , "error");
        this.submitted = false;
        return;
      });
    }
    else{
      
    }   
}

openEditModal(query){
   console.log("query",query);
   this.isEdit=true;
   if(query.email!=null && query.email!=""){

     this.isReadOnlyEmail=true;
   }else{
     this.isReadOnlyEmail=false;
   }
   if(query.contact!=null && query.contact!=""){
     this.isReadOnlyContact=true;
   }else{
     this.isReadOnlyContact=false;
   }
   this.addNewUserList=[];
   // Added refNo for issue app#620
   this.assistant.patchValue({
    userName:query.userName,
    contact: query.contact,
    email:query.email,
    status:query.status,
    msUserPk:query.msUserPk,
    miscUserMappingPk:query.miscUserMappingPk,
    parentRoleName:"DOCTOR",
    roleName:"ASSISTANT",
    entityName:"DOCTOR",
    refNo:query.refNo,
    doctorPk:this.user.id,
    userId:query.userId,
    email_verification_status:query.email_verification_status,
    contact_verification_status:query.contact_verification_status,
    otp:"",
    userRole:"ASSISTANT"

  });
   
   this.addNewUserList.push(this.assistant.value);
   this.modalRef = this.bsModalService.show(this.assistantModal, this.config);
   
 }

}

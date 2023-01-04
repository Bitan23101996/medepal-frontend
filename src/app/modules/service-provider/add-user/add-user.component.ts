import { Component, OnInit,ViewChild,TemplateRef, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ServiceProviderService } from '../service-provider.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BroadcastService } from 'src/app/core/services/broadcast.service';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { DoctorService } from '../../doctor/doctor.service';
import { GetSet } from '../../../core/utils/getSet';
import { SBISConstants } from '../../../SBISConstants';
import { JsonTranslation } from '../../../shared/translation';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit, OnDestroy {

  resdata:any
  addUserForm: FormGroup;
  addUserFormArray: FormGroup[];
  addUserArray:any
  userRole:any;
  email = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  user:any;
  entityName:any;
  addNewUserForm: FormGroup;
  submitted: any = false;
  isReadOnlyEmail:any = false;
  isReadOnlyContact:any =false;
  isReadOnlyUserRole:any=false;
  roleList: any = [];
  msUserPk: any;
  userRolePk: any;
  isExistMultiRole:any =false;
  isEnabelSubmit:any=false;
  ms_user_id:any;
  roleName:any;
  otpVerify: any = false;
  otpVerifySuccess: any = false;
  admincount:any;

  @ViewChild('adduserModal')
  adduserModal: TemplateRef<any>;

  @ViewChild('confirmationAlert') 
  confirmationAlert: TemplateRef<any>;
  
  modalRef: BsModalRef;
  isPhExist: any;
  isEdit: boolean=false;
  ifEmailExist: any;
  serviceProviderName: any;
  isPaginator=false;
  config = {
    class: 'custom-modal-width modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };
  confirmationMsg: any = [];
  parentRoleName: String;
  
  constructor(private fb:FormBuilder, 
    private _opdService: ServiceProviderService,
    private bsModalService: BsModalService, 
    private authService: AuthService,
    private toastService: ToastService,
    private _doctorService: DoctorService, 
    private broadcastService: BroadcastService,
    private jsonTranslate: JsonTranslation,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.broadcastService.setHeaderText("User List");
    this._opdService.getRolesForHospital('Hospital').subscribe(data =>{
      this.userRole = [];
      this.userRole = data;
    })
    this.user = JSON.parse(localStorage.getItem('user'));
    const url = window.location.href.toString();
    if (url.toLowerCase().indexOf('/adduser/opd') > 0) {
      if(this.user.parentRoleName == "DIAGNOSTICS") {
        this.entityName = "DIAGNOSTICS";
      } else {
        this.entityName = "HOSPITAL";      
      }
    } else if(url.indexOf('diagnostics/addUser')>0){
      this.entityName = "DIAGNOSTICS";
    }else {
      this.entityName = "PHARMACY";
    } 
    this.parentRoleName = this.user.parentRoleName;
    console.log("user_role = ",this.entityName);
    this.addUserFormArray =  [];
    this.addUserForm = this.fb.group({
      addUserList: this.fb.array([])
    })
    this._opdService.UserRolesList({
      "contact": "",
      "designation":"" ,
      "email": "",
      "parentRoleName": this.entityName,
      "roleName": "",
      "status": "",
      "userId": this.user.userId,
      "userName":"" ,
      "userRole": ""
    }).subscribe(data => {
      console.log(data);
      this.resdata=data.data;

      if(this.resdata.length>5){
        this.isPaginator=true;
      }else{
        this.isPaginator=false;
      }
      if(data.status!=2000){
        this.toastService.i18nToast("en", data.message, "error");
      }
      this.createForm(data);
    },(error) => {
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
      this.submitted = false;
      return;
    });
    this._opdService.AdminCount(
      this.user.userId,
      this.entityName
    ).subscribe(data=>{
      this.admincount=data.data;
    },(error) => {
      this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
      this.submitted = false;
      return;
    });
    if( this.entityName == "HOSPITAL"){
      // Service provider ref no - issue app#604
      let request={
        "serviceProviderRef":this.user.serviceProviderRefNo
      }
      this._opdService.findOPDByMiscUserMsUserPk(request).subscribe(data => {
        this.serviceProviderName = data.data.name;
        console.log("serviceProviderName",data.data.name);
      },(error) => {
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
        return;
      })
    }

    this.addNewUserForm = this.fb.group(
    {
      addNewUserList: this.fb.array([])
    })

    if(GetSet.getAddAnotherUserBoolean()) {
      this.openModal();
    }
  }

  ngOnDestroy() {
    GetSet.setAddAnotherUserBoolean(false);
  }

  get addUserList(): FormArray {
    return this.addUserForm.get('addUserList') as FormArray;
  }

  get addNewUserList(): FormArray {
    return this.addNewUserForm.get('addNewUserList') as FormArray;
  }

  createForm(res) {
    let userArr: FormGroup[] = [];
    this.addUserForm = this.fb.group({
      addUserList: this.fb.array(userArr)
    })

    if(res['data'].length==0){
      this.addUserList.push(this.createUserArr());
    }else{
      for (let i = 0; i < res['data'].length; i++) {
        this.addUserList.push(this.listUserArr(res['data'][i]));
      }
    }
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  addNewUser() {
    var userArr = this.addNewUserForm.get('addNewUserList') as FormArray;
    this.addNewUserList.push(this.createUserArr());
  }

  createUserArr(): FormGroup {
    return this.fb.group({
      userRole: ['OPERATOR'],
      oldUserRole: [null],
      userName: [null,[ Validators.required]],
      email: [null, [ Validators.email]],
      contact: [null],
      designation: [null],
      status: [null],
      msUserPk:[null],
      miscUserMappingPk: [null],
      parentRoleName: [this.entityName],
      roleName: [this.user.roleName],
      miscUserPk: [null],
      userId: [this.user.userId],
      email_verification_status:[null],
      contact_verification_status:[null],
      otp:[null],
    });
  }
  

  listUserArr(resdata): FormGroup {
    // Added refNo for issue app#620
    return this.fb.group({
      userRole: [resdata.userRole],
      oldUserRole: [resdata.userRole],
      userName: [resdata.userName,[ Validators.required]],
      email: [resdata.email,[Validators.email]],
      contact: [resdata.contact],
      designation: [resdata.designation],
      status: [resdata.status],
      msUserPk:[resdata.msUserPk],
      parentRoleName: [this.entityName],
      roleName: [this.user.roleName],
      miscUserPk: [resdata.miscUserPk],
      refNo: [resdata.refNo],
      miscUserMappingPk: [resdata.miscUserMappingPk],
      userId: [this.user.userId],
      email_verification_status:[resdata.email_verification_status],
      contact_verification_status:[resdata.contact_verification_status],
      otp:[null],
    });
  }

  checkDuplicateEmail(value, index) {

    if(this.addNewUserList.value[0].email!='' && this.addNewUserList.value[0].email!=null){
      if(!this.isReadOnlyEmail){
        if (this.isEdit) {
          this._doctorService.GetEmail(this.addNewUserList.value[0].email).subscribe(res => {
          let response: any = res;
          this.ifEmailExist = response.status;
          this.isExistMultiRole=false;
          if (this.ifEmailExist == 2000) {
            this.submitted = false;
            this.toastService.i18nToast("en", response.message , "error");
            this.addNewUserList.controls[0].patchValue({
              email: ""
            });
            return;
          }
        },
        (error) => {
          this.toastService.i18nToast("en", "Email already exists" , "error");
          this.submitted = false;
          return;
        })
      } else {
          let query = {
            'eaddress':this.addNewUserList.value[0].email,
            'roleName': this.addNewUserList.value[0].userRole,
            'entityName': this.entityName,
          }
        
          this.authService.checkUsername(query).subscribe((result) => {
            if (result.data.eaddressAvailableCode == 2102) {
            } else if (result.data.eaddressAvailableCode == 2101) {
              this.toastService.i18nToast("en", result.data.message , "error");
              this.addNewUserList.controls[0].patchValue({
                email: ""
              });
            } else if (result.data.eaddressAvailableCode == 2103) {
              this.roleList.length = 0;
              this.msUserPk = result.data.msUserPk;
              let list = result.data.eAddressDetails;
              this.isExistMultiRole=true;
              let role1;
              let userName1;
              for(let role of list) {
                this.userRolePk = role.rolePk;
                role['userName']=this.addNewUserList.value[0].email;
                role['addNewRole']= this.addNewUserList.value[0].userRole;
                this.roleList.push(role);
                role1=role.roleName;
                userName1 = role.name;
                if(role1==='ADMIN'){
                  this.toastService.i18nToast("en", "Already Exits" , "error");
                  this.addNewUserList.controls[0].patchValue({
                    email: ""
                  });
                }else if(role1==='OPERATOR'){
                  this.toastService.i18nToast("en", "Already Exits" , "error");
                  this.addNewUserList.controls[0].patchValue({
                    email: ""
                  });
                }
                console.log(this.roleList);
                }
              this.addNewUserList.controls[0].patchValue({
                userName: userName1
              });
            }
          },(error) => {
            this.submitted = false;
            this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
            this.submitted = false;
            return;
          });
        }
      }
    }
  }

  checkDuplicatePhNo(value, index) {
    for(let i =0; i < this.addUserList.length; i++)
    {
      if( i == index)
      {
        continue;
      }
      if(this.addUserList.value[i].contact == value)
      {
        this.toastService.i18nToast("en", "Ph No Duplicate" , "warning");
        return false;
      }
      return true;
    }
  }

  deleteUser(index,query) {
    if(this.user.userId!=query.msUserPk){
      this.isReadOnlyUserRole=false;
      if(query.userRole=="ADMIN"){
        this._opdService.AdminCount(
          this.user.userId,
          this.entityName
        ).subscribe(data=>{
          this.admincount=data.data;
          if(this.admincount==1){
            this.toastService.i18nToast("en", "This Admin is last admin. Atleast one admin should be there" , "warning");
            this.isReadOnlyUserRole=true;
            return;
          }
        },(error) => {
          this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
          this.submitted = false;
          return;
        });
      }

      if (confirm('Are you sure to remove ?')) {
        query.status='CXL';
        this.addNewUserForm = this.fb.group({
          addNewUserList: this.fb.array([])
        })
        this.addNewUserList.push(this.listUserArr(query));

        this._opdService.saveRolesForHospital(this.addNewUserForm.get("addNewUserList").value).subscribe(data => {
          console.log(data);
          if(data.status==5051){
            this.toastService.i18nToast("en", data.message , "warning");
          }else if(data.status!=2000){
            this.toastService.i18nToast("en", "User removal unsuccessful" , "error");
          }else{
            this.toastService.i18nToast("en", "User removed successfully" , "success");
            this.ngOnInit();
          }
        },(error) => {
          this.submitted = false;
          this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
          this.submitted = false;
          return;
        });
      }
      else{}
    }else{
      this.isReadOnlyUserRole=true;
      this.toastService.i18nToast("en", "You are not allowed to remove your own user account" , "warning");
    }
  }

  get lControls() { return this.addNewUserForm.controls; }

  submit() {
    if(!this.checkEmailorMobileExistance())
    {
      this.toastService.i18nToast("en", "Please enter email or mobile number" , "warning");
      return;
    }

    this.submitted = true;
    if(this.addNewUserForm.invalid){
      this.toastService.i18nToast("en", "There are some incorrect entries in the form - please check" , "warning");
      return;
    }
    console.log("request",this.addNewUserForm.get("addNewUserList").value);
    if(this.isExistMultiRole){
     // this.isExistMultiRole=false;
      let usersignuprequest = {
        'msUserPk': this.msUserPk,
        'rolePk': this.userRolePk,
        'roleName': this.addNewUserList.value[0].userRole,
        'entityName': this.entityName,
        'designation': this.addNewUserList.value[0].designation,
        'serviceProviderName': this.serviceProviderName,
        'isOpd': false,
        'serviceProviderRefNo': this.user.serviceProviderRefNo, // app#1389
      }
      console.log("usersignuprequest",usersignuprequest);
      this.authService.userSignUpRequestV2(usersignuprequest).subscribe(result=>{ //Working on #1813
      //this.authService.userSignUpRequest(usersignuprequest).subscribe(result=>{
        console.log("userSignUpRequest",result);
        if(result.status==2000){
          this.toastService.i18nToast("en", result.message , "success");
        }else{
          this.toastService.i18nToast("en", result.message , "error");
        }
        this.msUserPk=null;
        this.modalRef.hide();
        this.goToConfirmationPage(result);
        this.isExistMultiRole=false;
        
        // this.ngOnInit();
      },
      error => {
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
        this.submitted = false;
        return;
      });
      //this.isExistMultiRole=false;
    }else{
      this._opdService.saveRolesForHospital(this.addNewUserForm.get("addNewUserList").value).subscribe(data => {
        this.submitted = false;
        console.log("response_saveRole",data);
        if(data.status==5051){
          this.toastService.i18nToast("en", data.message , "warning");
        }else if(data.status!=2000){
          this.toastService.i18nToast("en", "User creation unsuccessful" , "error");
        
        }else{
          if(this.addNewUserForm.get("addNewUserList").value[0].miscUserPk!=null){
            this.toastService.i18nToast("en", "User Updated successfully" , "success");
          }else{
            this.toastService.i18nToast("en", "User created successfully" , "success");
             console.log("request_Notification",data);
          }
        }
        this.modalRef.hide();
        
        this.goToConfirmationPage(data);

        
        console.log(data);
      },(error) => {
        this.submitted = false;
        this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
        this.submitted = false;
        return;
      });
    }
  }

  goToConfirmationPage(info) {
    console.log('info:' + info.data);
    GetSet.setAddAnotherUserBoolean(false);
    this.confirmationMsg = [];
     if(info.data.userName == null){
       if(info.data.name == null){
        var name1 = info.data[0].userName;
        var role2 = info.data[0].roleName;
       }else{
        var name1 = info.data.name;
        var role2 = info.data.roleName
       }
     }else{
      var name1 = info.data[0].userName;
      var role2 = info.data[0].roleName;

     }
     this.confirmationMsg.push(name1 + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ADDED_AS_AN') + role2) ;
    if(this.isExistMultiRole)
    {
    if(info.data.contactNo) {
      
      this.confirmationMsg.push( this.jsonTranslate.translateJson('CONFIRMATION_MSG.EXISTING_USER_LOGIN_USING_MOBILE') + ' ' + info.data.roleName);
    } else {
     
      this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.EXISTING_USER_LOGIN_USING_EMAIL') + ' ' +  info.data.roleName) ;
    }

  }

  else
  {
     if(info.data.contactNo) {
      this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.ACCOUNT_PASS_SEND_BY_SMS') + name1 + this.jsonTranslate.translateJson('CONFIRMATION_MSG.S_MOBILE')) ;
      this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.ASK_YOU') + role2 + this.jsonTranslate.translateJson('CONFIRMATION_MSG.TO_LOGIN_USING_MOBILE'));
    } else {
      this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.ACCOUNT_PASS_SEND_BY_MAIL') + name1 + this.jsonTranslate.translateJson('CONFIRMATION_MSG.S_EMAIL'));
      this.confirmationMsg.push(this.jsonTranslate.translateJson('CONFIRMATION_MSG.ASK_YOU') + role2 + this.jsonTranslate.translateJson('CONFIRMATION_MSG.TO_LOGIN_USING_EMAIL'));
    }

  }
  
 

    let confirmationInfo = {};
    confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
    confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME.USER_LIST;
    confirmationInfo['confirmationMsg'] = this.confirmationMsg;
    confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.ADD_USER;
    if(this.parentRoleName == 'PHARMACY') {
      confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.ADD_USER_PHA;
    } else {
      confirmationInfo['paymentFor'] = SBISConstants.PAYMENT_FOR.ADD_USER_OPD;
    }
    confirmationInfo['buttonTwoName'] = SBISConstants.SECONDARY_ACTION_BUTTON_NAME.ADD_ANOTHER_USER;
    GetSet.setConfirmationInfo(confirmationInfo);
    //end of confirm page info set
    this.router.navigate(['confirmation']);
  }

  checkEmailorMobileExistance() {
    if((this.addNewUserForm.value.addNewUserList[0].email == null || this.addNewUserForm.value.addNewUserList[0].email == '')  && (this.addNewUserForm.value.addNewUserList[0].contact == null || this.addNewUserForm.value.addNewUserList[0].contact == ''))
      return false;
    else
      return true;
  }

  openModal() {
    let userArr: FormGroup[] = [];
    this.isReadOnlyContact=false;
    this.isReadOnlyEmail=false;
    this.isReadOnlyUserRole=false;
    this.addNewUserForm = this.fb.group({
      addNewUserList: this.fb.array(userArr)
    })
    this.addNewUserList.push(this.createUserArr());
    this.modalRef = this.bsModalService.show(this.adduserModal, this.config);
  }

  openEditModal(query){
    if(query.userRole=="ADMIN"){
      this._opdService.AdminCount(
        this.user.userId,
        this.entityName
        ).subscribe(data=>{
          this.admincount=data.data;
          console.log("AdminCount",data);
          if(this.admincount==1){
            this.toastService.i18nToast("en", "This user is the last one with Admin role, so cannot change the role." , "warning");
            this.isReadOnlyUserRole=true;
          }
          },(error) => {
          this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
          this.submitted = false;
        });
    }
    this.ms_user_id=query.msUserPk;
    this.roleName=query.roleName;
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
    this.addNewUserForm = this.fb.group({
      addNewUserList: this.fb.array([])
    })
    this.addNewUserList.push(this.listUserArr(query));
    this.modalRef = this.bsModalService.show(this.adduserModal, this.config);
    
    
  }

  checkContactNumber(query1) {
    if(!this.isReadOnlyContact){
      if(this.isEdit){
        // Null check added
        if (this.addNewUserList.value[0].contact == null) return;
        if(this.addNewUserList.value[0].contact.length>12){
          this.isEdit=false;
          this._doctorService.GetPh('' + this.addNewUserList.value[0].contact).subscribe(res => {
            let response: any = res;
            this.isPhExist = response.status;
            if (this.isPhExist == 2000) {
              this.submitted = false;
              this.toastService.i18nToast("en", response.message , "error");
              this.addNewUserList.controls[0].patchValue({
                contact: ""
              });
              return;
            }
          },
          (error) => {
            this.toastService.i18nToast("en", "Phone No. already exists" , "error");
            this.submitted = false;
            return;
          });
        }
      }else{
        // Null check added
        if (this.addNewUserList.value[0].contact == null) return;
        if(this.addNewUserList.value[0].contact.length>12){
          let query = {
            'eaddress': this.addNewUserList.value[0].contact,
            'roleName': this.addNewUserList.value[0].roleName,
            'entityName': this.entityName,
            'designation': this.addNewUserList.value[0].designation
          }
          this.authService.checkContactno(query).subscribe(result => {
            if (result.data.eaddressAvailableCode == 2102) {
            }
            else if (result.data.eaddressAvailableCode == 2101) {
              this.toastService.i18nToast("en", result.data.message , "error");
              this.addNewUserList.controls[0].patchValue({
                contact: ""
              });
            } 
            else if (result.data.eaddressAvailableCode == 2103) {
              this.roleList.length = 0;
              this.msUserPk = result.data.msUserPk;
              let list = result.data.eAddressDetails;
              let role1;
              let userName1;
              this.isExistMultiRole=true;
              this.isEnabelSubmit=true;
              for(let role of list) {
                this.userRolePk = role.rolePk;
                role['userName']=this.addNewUserList.value[0].contact;
                role['addNewRole']=this.addNewUserList.value[0].userRole;
                this.roleList.push(role);
                role1=role.roleName;
                userName1 = role.name;
                if(role1==='ADMIN'){
                  this.toastService.i18nToast("en", "Already Exits" , "error");
                  this.addNewUserList.controls[0].patchValue({
                    contact: ""
                  });
                }else if(role1==='OPERATOR'){
                  this.toastService.i18nToast("en", "Already Exits" , "error");
                  this.addNewUserList.controls[0].patchValue({
                    contact: ""
                  });
                }else if(role1==='ASSISTANT'){
                  this.toastService.i18nToast("en", "Already Exits" , "error");
                  this.addNewUserList.controls[0].patchValue({
                    contact: ""
                  });
                }
              }
              this.addNewUserList.controls[0].patchValue({
                userName: userName1
              });
            }
          },(error) => {
            this.submitted = false;
            this.toastService.showI18nToast('SERVER_ERROR.INTERNAL_SERVER_ERROR', "error");
            this.submitted = false;
            return;
          });
        }
      }
    }
  }

  closeModal() {
    this.modalRef.hide();
  }

  emailVerify() {
    let roleName = this.roleName;
    var path = roleName+ '/' + this.ms_user_id;
    this.authService.resendVerifyMail(path).subscribe((result) => {
      if (result.status === 2000) {
        this.toastService.showI18nToast("USER_PROFILE_TOAST.VERIFICATION_SENT", 'success');
      }
    })
  }
  cancelSection() {
    this.otpVerify = false;
  }
  
  mobileVerify() {
    let number = this.addNewUserList.value[0].contact;
    let query = {
      'contactNo': number,
      'smsActionType': "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      if (result.status === 2000) {
        this.toastService.showI18nToast("USER_PROFILE_TOAST.OTP_SENT" , 'success');
      }
    })
    this.otpVerify = true;
  }
  otpSubmit() {
    let number = this.addNewUserList.value[0].contact;
    let otp = this.addNewUserList.value[0].otp;
    let query = {
      "contactNo": number,
      "verificationCode": otp
    }
    if (otp != null) {
      this.authService.mobileVerification(query).subscribe((result) => {
        if (result.status === 2009) {
          this.toastService.showI18nToast("USER_PROFILE_TOAST.MOBILE_NUMBER_VERIFIED" , 'success');
          this.otpVerifySuccess = true;
        } else {
          this.toastService.showI18nToast(result.message , 'error');
        }
      })
    } else {
      this.toastService.showI18nToast("USER_PROFILE_TOAST.PLEASE_ENTER_OTP" , 'warning');
    }
  }

  resendOtp() {
    let number =this.addNewUserList.value[0].contact;
    let query = {
      'contactNo': number,
      'smsActionType': "OTPSEND"
    }
    this.authService.sentOTP(query).subscribe((result) => {
      this.toastService.showI18nToast("USER_PROFILE_TOAST.OTP_RESEND" , 'success');
    })
  }

  goToConfirmationPage1(info) {
    GetSet.setAddAnotherUserBoolean(false);
    this.confirmationMsg = [];
    this.confirmationMsg.push(info.data[0].userName + this.jsonTranslate.translateJson('CONFIRMATION_MSG.ADDED_AS_AN') + info.data[0].roleName) ;

  }
  
}



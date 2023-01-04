import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { DoctorService } from '../../doctor/doctor.service';
import { ServiceProviderService } from '../service-provider.service';
import { SBISConstants } from '../../../SBISConstants';
import { AuthService } from '../../../auth/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { IndividualService } from '../../individual/individual.service';
import { Location } from '@angular/common';
import { JsonTranslation } from '../../../shared/translation';
import { GetSet } from '../../../core/utils/getSet';
@Component({
  selector: 'app-inpatient-admission',
  templateUrl: './inpatient-admission.component.html',
  styleUrls: ['./inpatient-admission.component.css']
})
export class InpatientAdmissionComponent implements OnInit {

  user: any;
  dtFormat: any;
  masterGender: any;
  submitted = false;
  showMsg = false;
  showMsgInsurer = false;
  admissionForm: FormGroup;
  masterCOUNTRY: any = [];
  masterSTATE: any = [];
  departmentList: any = [];
  roomList: any = [];
  bedList: any = [];
  admissionRefNo: any = null;
  isEdit: boolean = false;
  isEditBtn: boolean = true;
  categoryList: any = [];
  addRefNo : any =null;
  currentDetails : any;
  isdiabled : boolean = true;
  departmentRefNo: any = null;
  @Input() displaySidebar: boolean;
  isExistingMinorPatient: boolean = false;
  @Input() getUserDetails: any;
  @Output() emitUserDetails: EventEmitter<any> = new EventEmitter<any>();
  @Input() associatedUserDetailsList: any[] = [];
  @Output() emitAssociateUser = new EventEmitter();
  associateUser: any;

  allRoomRelatedInfoList:any;// Working on app/issues/1656
  showRoomDetail:boolean=false;// Working on app/issues/1656
  bedAllocation:any;// Working on app/issues/1656
  // Working on app/issues/1656
  isAdmin:boolean=false;
  isDoctor:boolean=false;
  // End Working on app/issues/1844
  maxDate = new Date(); // app#2006
  roomCategoryRefNo: any; // app#2222
  roomName: any; // app#2222
  bedNo: any; // app#2222

   // Working on app/issue/2232
   isPreviewScreenVisible: boolean = false; //preview page
   previewFoodPreference: any;//preview page
   patientAgePreview: number;//preview page
   previewPatientGender: any;//preview
   bedInfo: any = { departmentName: "", roomCategoryName: "", roomNo: "", bedNo: "" }
   confirmationMsg: any = [];
   // End Working on app/issue/2232

  constructor(
    private broadcastService: BroadcastService, private fb: FormBuilder,
    private translate: TranslateService, private router: Router,
    private doctorService: DoctorService, private serviceProviderService: ServiceProviderService,
    private authService: AuthService,
    private _doctorService: DoctorService,
    private _toastService: ToastService,
    private individualService: IndividualService,
    private route: ActivatedRoute,private _location: Location,
    private jsonTranslate: JsonTranslation,
  ) {
    translate.setDefaultLang('en');
    translate.use('en');
  }

  ngOnInit() {
  //  this.isEdit = true;
   this.isEditBtn = false;
    this.broadcastService.setHeaderText("In-patient Admission");
    this.user = JSON.parse(localStorage.getItem("user"));
    this.createAdmissionForm();
    
    this.getDepartmentDetails();
    this.getRoomCategoryDetailsWithRole();
    //this.fetchRoomListByHospital(); // Also get the entire room list since department may be null
   
    this.dtFormat = environment.DATE_FORMAT;
    this.loadAllMasterData();
    if (this.admissionRefNo == null)
      this.getDoctorName();
    this.admissionRefNo = this.route.snapshot.paramMap.get("refNo");
    if (this.admissionRefNo != null)
      this.getInpatientAdmissionDetails(this.admissionRefNo);
    // this.getRoomCategoryDetailsWithRole(); 

    if(this.user.roleName=="ADMIN"){
      this.isAdmin=true;
    }  
    else if(this.user.roleName=="INDIVIDUAL"){
      this.isEditBtn = false;
    }
    else if(this.user.roleName=="DOCTOR"){
      this.isDoctor=true; 
    }
   
    // this.getRoomCategoryDetailsWithBedResource();
  }

  getInpatientAdmissionDetails(refNo) {
    this.isEditBtn = false;
    let payload = {
      admissionRefNo: refNo
    }
    console.log("payload:::",payload);
    this.serviceProviderService.getInpatientAdmissionDetails(payload).subscribe(res => {
      console.log("RESPONSE ON EDIT:::",res);
      
      if (res.status === 2000) {
        // this.isEdit = false;
        this.isExistMultiRole = true;
        this.editAdmissionForm(res.data);
        console.clear();
        console.log(res.data);
        
      }
    });
   
    // setTimeout(()=> this.admissionForm.disable(),100);
   
  }

  editAdmissionForm(res) {
    this.currentDetails = res.data;
    this.addRefNo = res.admissionRefNo;
    this.departmentRefNo=res.departmentRefNo;
    this.roomCategoryRefNo=res.roomCategoryRefNo
    this.roomName=res.roomNo
    this.bedNo=res.bedNo
    this.bedInfo.roomNo =this.roomName;
    this.bedInfo.bedNo = this.bedNo;
    // this.fetchRoomList(res.departmentRefNo);
    // this.fetchBedList(res.roomRefNo);

    console.log("EDIT RESPONSE::",res);

    this.admissionForm = this.fb.group({
      admissionRefNo: [res.admissionRefNo],
      patientMobile: [res.patientMobile, Validators.required],
      patientEmail: [res.patientEmail],
      patientName: [res.patientName, Validators.required],
      patientGender: [res.patientGender, Validators.required],
      nationality: [res.nationality],
      patientDateOfBirth: [res.patientAgeInMonth != null ? null : new Date(res.patientDateOfBirth)],
      patientAgeInMonth: [res.patientAgeInMonth != null ? Math.floor((res.patientAgeInMonth) / 12) : ''],
      occupation: [res.occupation],
      foodPreference: [res.foodPreference],
      doctorRefNo: [res.doctorRefNo, Validators.required],
      department: [res.departmentRefNo],
      referredBy: [res.referredBy],

      //admissionTime: [null],
      roomNo: [res.roomRefNo],

      bedNo: [res.bedNo],
      bedPk: [res.bedPk],
      insurancePk: [res.insurancePk],
      bedRefNo: [res.bedRefNo, Validators.required],
      admittedBy: [res.admittedBy, Validators.required],
      admittedByRelation: [res.admittedByRelation],
      admittedByMobile: [res.admittedByMobile],
      admittedByContact2: [res.admittedByContact2],
      admittedByEmail: [res.admittedByEmail],
      admittedByAddress: [res.admittedByAddress],
      insurer: [res.insurer],
      policyNo: [res.policyNo],
      tpa: [res.tpa],
      roomCategory:[res.roomCategoryRefNo],
      paymentMode: [res.paymentMode],
      isExistingInUser: [res.isExistingInUser],
      msUserPk: [res.msUserPk],
      userRefNo: [res.userRefNo],
      patientType: [res.patientType],
      admissionDate: [new Date(res.admissionDate), Validators.required],
      doctorName: [res.doctorName],
      // admissionDate:[null],
      admissionReason: [res.admissionReason],
      patientAddress: this.fb.group({
        id: [res.patientAddress.id],
        addressType: [res.patientAddress.addressType],
        country: [res.patientAddress.country],
        pinCode: [res.patientAddress.pinCode],
        state: [res.patientAddress.state],
        city: [res.patientAddress.city],
        line1: [res.patientAddress.line1],
        line2: [res.patientAddress.line2],
        isDirty: [false]
      }),
    

    })
    
    console.log(this.admissionForm);
  
    if(this.user.roleName=="ADMIN"){
      this.isAdmin=true;     
      // setTimeout(()=> this.admissionForm.disable(),100)
     
  }
    
    if(this.user.roleName=="INDIVIDUAL"){
      this.isEditBtn = false;
      // setTimeout(()=> this.admissionForm.disable(),100)
       
    }

    if(this.user.roleName=="DOCTOR"){
      this.isDoctor=true;
    //  setTimeout(()=> this.admissionForm.disable(),100)
    
 }
    else{
      this.getDoctorName();
    }
    
  }


  loadAllMasterData() {
    this.doctorService.getMasterDataGender({ q: SBISConstants.MASTER_DATA.GENDER }).subscribe(data => {
      if (data.status === 2000) {
        this.masterGender = data.data;
      }
    });

    this.individualService.getMasterDataCountry().subscribe(data => {
      if (data.status === 2000) {
        this.masterCOUNTRY = data.data;
      } else {
        alert(data.message);
      }
    });
  }

  fetchCountryStateCityByPin(pin, ev) {
    if (ev.code.indexOf('Arrow') != -1) return;
    if (pin.length == 6) {
      let payload = {
        "pincode": pin
      }

      this._doctorService.findCountryStateCityByPin(payload).subscribe(data => {
        if (data.status == 2000) {
          let ctrl = this.admissionForm.get("patientAddress")
          if (data.data.country == null && data.data.state == null && data.data.city == null) {
            this._toastService.showI18nToast("Invalid PIN Code", 'error');
            ctrl.patchValue({
              pinCode: "",
              country: "India",
              state: "",
              city: ""
            });
          } else {
            ctrl.patchValue({
              'country': data.data.country,
              'state': data.data.state,
              'city': data.data.city
            });
          }
        } else {
          this._toastService.showI18nToast(data['message'], 'error');
        }
      });
    }
  }


  doctorList: any = [];
  optionsDoctorToDisplay: any = [];
  getDoctorName() {
     this.doctorList=[];
    if (this.user.entityName == "HOSPITAL") {
      this.serviceProviderService.fetchDoctorListByOPD('ipd').subscribe(res => {
        if (res.status === 2000) {
          this.doctorList = res.data;         
        }
      }); 
    }
    else if (this.user.entityName == "DOCTOR") {
      let query = {
        requestType: 'ipd',
        admissionRefNo: this.admissionRefNo
      }
       this.serviceProviderService.fetchDoctorListByOPDDoctor(query).subscribe(res => {
        if (res.status === 2000) {
          this.doctorList = res.data;        
        }
      }); 
    }
  }

  createAdmissionForm() {
    this.admissionForm = this.fb.group({
      admissionRefNo: [null],
      patientMobile: [null, Validators.required],
      patientEmail: [null],
      insurancePk : [null],
      patientName: [null, Validators.required],
      patientGender: [null, Validators.required],
      nationality: [null],
      patientDateOfBirth: [null],
      patientAgeInMonth: [null],
      occupation: [null],
      foodPreference: [null],
      doctorRefNo: [null, Validators.required],
      doctorName: [null],
      department: [null],
      roomCategory: [null,Validators.required],
      referredBy: [null],
      admissionDate: [new Date(), Validators.required],
      //admissionTime: [null],
      roomNo: [null],
      bedNo: [null],
      bedPk: [null],
      bedRefNo: [null, Validators.required],
      admittedBy: [null, Validators.required],
      admittedByRelation: [null, Validators.required],
      admittedByMobile: [null, Validators.required],
      admittedByContact2: [null],
      admittedByEmail: [null],
      admittedByAddress: [null],
      insurer: [null],
      policyNo: [null],
      tpa: [null],
      paymentMode: [null],
      isExistingInUser: [null],
      msUserPk: [null],
      userRefNo: [null],
      patientType: ["Direct"],
      admissionReason: [null],
      isOtherAssociateUser:[false],// Working on app/issues/1889

      patientAddress: this.fb.group({
        id: [null],
        addressType: ["Inpatient"],
        country: ["India"],
        pinCode: [null],
        state: [null],
        city: [null, Validators.required],
        line1: [null, Validators.required],
        line2: [null],
        isDirty: [false]
      })
    })
  }

  isExistMultiRole: boolean = false;
  isDob: boolean = false;
  isGender: boolean = false;
  isPopulated: boolean = false;
 
  // setPatientDetails(mobile) {
    
  //   if (mobile.length > 12) {
  //     let query = {
  //       'eaddress': mobile,
  //       'roleName': "INDIVIDUAL",
  //       'entityName': "INDIVIDUAL",
  //     }
  //     this.isExistMultiRole = false;
  //     this.authService.checkContactno(query).subscribe((result) => {

  //       if (result.data.eaddressAvailableCode == 2102) {
  //         //success
  //         //   this.toastService.i18nToast("en", result.data.message ,"");
  //       } else if (result.data.eaddressAvailableCode == 2101) {
  //         // this.toastr.error(result.data.message);
  //         this.isExistMultiRole = true;
  //         this.isDob = false;
  //         this.isGender = false;
  //         this.isPopulated = true;


  //         this.admissionForm.patchValue({
  //           isExistingInUser: true,
  //           msUserPk: result.data.msUserPk,
  //           patientName: result.data.name
  //         })
  //         this._doctorService.getIndividualUserData(mobile).subscribe(res => {


  //           if (res.data.dateOfBirth != null) {
  //             this.isDob = true;
  //           } else {
  //             this.isDob = false;
  //           }
  //           if (res.status == 1701) {
  //             var dob = null;
  //             var gnd = null;
  //             // if(res.data.name!=null)
  //             //   this.isName=true;
  //             // else
  //             //   this.isName=false;
  //             if (res.data.dateOfBirth != null) {
  //               // app#1374
  //               if (res.data.userType == "PSEUDO" && res.data.age) {
  //                 let age = 0;
  //                 const bdate = new Date(res.data.dateOfBirth);
  //                 const timeDiff = Math.abs(Date.now() - bdate.getTime());
  //                 age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  //                 this.admissionForm.patchValue({
  //                   'patientAgeInMonth': age,
  //                   'patientDateOfBirth': null
  //                 });
  //                 this.isDob = true;

  //               }
  //               // app#1374
  //               else {

  //                 this.admissionForm.patchValue({
  //                   'patientAgeInMonth': null,
  //                   'patientDateOfBirth': res.data.dateOfBirth
  //                 });
  //                 dob = res.data.dateOfBirth;
  //               }
  //             }
  //             else
  //               this.isDob = false;
  //             if (res.data.gender != null) {
  //               this.isGender = true;
  //               gnd = res.data.gender;
  //             }
  //             else
  //               this.isGender = false;

  //             this.admissionForm.patchValue({
  //               userRefNo: res.data.userRefNo,

  //               patientGender: gnd,
  //             })

  //           }
  //         });

  //       } else if (result.data.eaddressAvailableCode == 2103) {
  //         let msUserPk = result.data.msUserPk;
  //         let list = result.data.eAddressDetails;
  //         let role1;
  //         this.isExistMultiRole = true;
  //         let userRolePk = null;
  //         for (let role of list) {
  //           userRolePk = role.rolePk;
  //           role['userName'] = mobile;
  //           role['addNewRole'] = "INDIVIDUAL";
  //           role1 = role.roleName;
  //         }

  //         this.admissionForm.patchValue({
  //           isExistingInUser: false,
  //           msUserPk: msUserPk,
  //           existingrolePk: userRolePk,
  //           patientName: result.data.name
  //         })
  //         // this.modalRef = this.bsModalService.show(this.confirmationAlert, { class: 'modal-lg' });
  //         // this.toastr.warning(result.data.message);
  //         this._toastService.i18nToast("en", result.data.message + " " + role1, "warning");
  //       }
  //     }, (error) => {
  //       this.submitted = false;
  //       this._toastService.i18nToast("en", "Internal Server Problem", "error");
  //       //alert("Internal Server Problem");
  //       this.submitted = false;
  //       return;
  //     });
  //   }
  //   else {
  //     this.admissionForm.patchValue({
  //       //userPk: null,
  //       patientName: null,
  //       patientDateOfBirth: null,
  //       patientGender: null,
  //       patientAgeInMonth: null
  //     })
  //   }
  // }

  setPatientDetails(mobile) {
    
    if (mobile.length > 12) {
      let query = {
        'eaddress': mobile,
        'roleName': "INDIVIDUAL",
        'entityName': "INDIVIDUAL",
      }
      this.isExistMultiRole = false;
      this.authService.checkContactno(query).subscribe((result) => {

        if (result.data.eaddressAvailableCode == 2102) {
          //success
          //   this.toastService.i18nToast("en", result.data.message ,"");
        } else if (result.data.eaddressAvailableCode == 2101) {
          // this.toastr.error(result.data.message);
          this.isExistMultiRole = true;
          this.isDob = false;
          this.isGender = false;
          this.isPopulated = true;


          this.admissionForm.patchValue({
            isExistingInUser: true,
            msUserPk: result.data.msUserPk,
            patientName: result.data.name
          })
          this._doctorService.getIndividualUserData(mobile).subscribe(res => {


            if (res.data.dateOfBirth != null) {
              this.isDob = true;
            } else {
              this.isDob = false;
            }
            if (res.status == 1701) {
              var dob = null;
              var gnd = null;
              // if(res.data.name!=null)
              //   this.isName=true;
              // else
              //   this.isName=false;
              if (res.data.dateOfBirth != null) {
                // app#1374
                if (res.data.userType == "PSEUDO" && res.data.age) {
                  let age = 0;
                  const bdate = new Date(res.data.dateOfBirth);
                  const timeDiff = Math.abs(Date.now() - bdate.getTime());
                  age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
                  this.admissionForm.patchValue({
                    'patientAgeInMonth': age,
                    'patientDateOfBirth': null
                  });
                  this.isDob = true;

                }
                // app#1374
                else {

                  this.admissionForm.patchValue({
                    'patientAgeInMonth': null,
                    'patientDateOfBirth': res.data.dateOfBirth
                  });
                  dob = res.data.dateOfBirth;
                }
              }
              else
                this.isDob = false;
              if (res.data.gender != null) {
                this.isGender = true;
                gnd = res.data.gender;
              }
              else
                this.isGender = false;

              this.admissionForm.patchValue({
                userRefNo: res.data.userRefNo,

                patientGender: gnd,
              })

            }
          });

        } else if (result.data.eaddressAvailableCode == 2103) {
          let msUserPk = result.data.msUserPk;
          let list = result.data.eAddressDetails;
          let role1;
          this.isExistMultiRole = true;
          let userRolePk = null;
          for (let role of list) {
            userRolePk = role.rolePk;
            role['userName'] = mobile;
            role['addNewRole'] = "INDIVIDUAL";
            role1 = role.roleName;
          }

          this.admissionForm.patchValue({
            isExistingInUser: false,
            msUserPk: msUserPk,
            existingrolePk: userRolePk,
            patientName: result.data.name
          })
          // this.modalRef = this.bsModalService.show(this.confirmationAlert, { class: 'modal-lg' });
          // this.toastr.warning(result.data.message);
          this._toastService.i18nToast("en", result.data.message + " " + role1, "warning");
        }
      }, (error) => {
        this.submitted = false;
        this._toastService.i18nToast("en", "Internal Server Problem", "error");
        //alert("Internal Server Problem");
        this.submitted = false;
        return;
      });
    }
    else {
      this.admissionForm.patchValue({
        //userPk: null,
        patientName: null,
        patientDateOfBirth: null,
        patientGender: null,
        patientAgeInMonth: null
      })
    }
  }


  populatePatientDetailsByPhone(mobile) {
    this.isExistingMinorPatient = false;
    this.isExistMultiRole = false;
    if (mobile.length > 12) {
      this.isPopulated = false;
      this._doctorService.getAssociateUserByEaddress(mobile).subscribe(resp => {
        this.getUserDetails = resp;
        this.emitUserDetails.emit(this.getUserDetails);
        if (resp.status == 2000) {
          console.log("associatedUserDetailsList Response:",this.getUserDetails);
          
          // this.admissionForm.patchValue({
          //   'appointmentByRefNo': resp.data.individualUserBasicInfo ? (resp.data.individualUserBasicInfo.refNo ? resp.data.individualUserBasicInfo.refNo : null): null
          // });
          // if (resp.data.associatedUserDetailsList.length != 0 && !this.appointmentForm.value.forMinor && !this.isPopulateOnlyPatientDetails) {
          this.associatedUserDetailsList = [];
          (resp.data.individualUserBasicInfo) ? this.associatedUserDetailsList.push(resp.data.individualUserBasicInfo) : null;// add user to show in display list
          if (resp.data.associatedUserDetailsList.length != 0) {
            for (let associatedUserDetailsList of resp.data.associatedUserDetailsList) {
              this.associatedUserDetailsList.push(associatedUserDetailsList);
            }
          }
          let other = {
            'name': 'Other',
            'userContactNo': resp.data.individualUserBasicInfo.contactNo ? resp.data.individualUserBasicInfo.contactNo : null,
            'dateOfBirth': null
          }
          this.associatedUserDetailsList.push(other);
          this.displaySidebar = true;
          this.isPopulated = true;
        } else if (resp.status == 5001) {
          this.isDob = false;         
  
          // this.appointmentForm.patchValue({
          //   'isExistingInUser': false,
          //   'isSerial': false,
          //   'appointmentByRefNo': null,
          //   'guardianEmailId': null
          // });
        }
      });
    }
    else {
      // if (!this.appointmentForm.value.forMinor) {
      //   this.appointmentForm.patchValue({
      //     userPk: null,
      //     patientName: null,
      //     patientDateOfBirth: null,
      //     patientGender: null,
      //     patientAgeInMonth: null
      //   });
      //   this.isDob = false;
      //   this.isGender = false;
      // }
    }
  }//end of method  

  setPatientIfMinorHave(associateUser) {
       this.associateUser = associateUser;
    // (associateUser.refNo == this.getUserDetails.data.individualUserBasicInfo.refNo) ? this.appointmentForUserItself = true : this.appointmentForUserItself = false;
    // Working on app/issues/1889
    if(!(associateUser.name.toLowerCase()=="other" && associateUser.dateOfBirth==null)){
    this.emitAssociateUser.emit(this.associateUser);
     let user = JSON.parse(localStorage.getItem('user'));
     this.admissionForm.patchValue({
      'patientName': associateUser.name,
      'patientGender': associateUser.gender,
      'userRefNo': associateUser.refNo ? associateUser.refNo : null,
      'patientAgeInMonth':this.admissionForm.value.patientAgeInMonth,
      'patientDateOfBirth': associateUser.dateOfBirth ? associateUser.dateOfBirth : null,
      'isOtherAssociateUser':false
    });
    this.admissionForm.get('patientName').disable();
    this.admissionForm.get('patientDateOfBirth').disable();
    this.admissionForm.get('patientAgeInMonth').disable();
    this.admissionForm.get('patientEmail').disable();
    this.admissionForm.get('patientGender').disable();
    this.admissionForm.get('nationality').disable();
    this.admissionForm.get('occupation').disable();
   this.getUserAddresBtRefNoAndAddressType(associateUser.refNo,"Inpatient");
  }
  else{
    this.admissionForm.get('patientName').enable();
    this.admissionForm.get('patientDateOfBirth').enable();
    this.admissionForm.get('patientAgeInMonth').enable();
    this.admissionForm.get('patientEmail').enable();
    this.admissionForm.get('patientGender').enable();
    this.admissionForm.get('nationality').enable();
    this.admissionForm.get('occupation').enable();
    this.admissionForm.patchValue({
      'isOtherAssociateUser':true,
      'userRefNo':this.getUserDetails.data.individualUserBasicInfo.refNo,
      'patientName': '',
      'patientGender': '',      
      'patientAgeInMonth':'',
      'patientDateOfBirth': '',
    });
  }
  console.log("admissionForm:",this.admissionForm.value);
  
  // End Working on app/issues/1889
    
    // if (associateUser.isMinor) {
    //   this.isGuardian = true;
    //   this.isNewMinor = true;
    //   this.isExistingMinorPatient = true;
    // } else {
    //   associateUser.gender ? this.isGender = true : this.isGender = false;
    //   if (associateUser.dateOfBirth != null)
    //     this.appointmentForm.patchValue({ 'patientAgeInMonth': null });

    //   this.appointmentForm.patchValue({ 'forMinor': false });
    //   this.isExistingMinorPatient = false;
    //   if (associateUser.name == 'Other') {
    //     this.appointmentForm.patchValue({
    //       'forMinor': true,
    //       'patientName': '',
    //       'patientGender': '',
    //       'patientRefNo': ''
    //     });
    //   } else {
    //     this.isGuardian = false;
    //     this.isNewMinor = false;
    //   }
    //   if (associateUser.dateOfBirth != null) {
    //     this.isDob = true;
    //   } else {
    //     this.isDob = false;
    //   }
    // }//end of else
      //this.isGuardian = false;
     this.displaySidebar = false;
  }//end of method
  

  fetchRoomList(dept) {
    this.departmentRefNo = dept;
    // this.getRoomCategoryDetailsWithBedResource();
    // this.roomList = [];
    // this.bedList = [];
    // let payload = {
    //   departmentRefNo: dept,
    //   roomCategoryRefNo: roomcat
    // }
    // if (roomcat != null && roomcat != '') {
    //   this.serviceProviderService.fetchRoomList(payload).subscribe(res => {
    //     if (res.status == 2000) {
    //       this.roomList = res["data"];
    //       if (this.admissionForm.controls.roomCategory.dirty)
    //       this.admissionForm.patchValue({
    //         roomNo:null
    //       })
    //     }
    //   })
    // }
    // if(dept==null){
    //   this.departmentRefNo=null;
    //   this.admissionForm.patchValue({
    //     bedRefNo:null,
    //     roomNo:null,
    //     department: null
    //   });
    //   this.roomName=null;
    //   this.bedNo=null;
    // }
  }

  //app#2222
  setRoomCategory(category){
    this.roomCategoryRefNo = category;
    // if(category==null){
    //   this.roomCategoryRefNo=null;
    //   this.admissionForm.patchValue({
    //     bedRefNo:null,
    //     roomCategory:null,
    //     roomNo:null
    //   });
    //   this.roomName=null;
    //   this.bedNo=null;
    // }
  }

  fetchRoomListByHospital() {
    this.roomList = [];
    this.bedList = [];
    this.serviceProviderService.fetchRoomListByHospital().subscribe(res => {
      if (res.status == 2000) {
        this.roomList = res["data"];
      }
    })
  }

  fetchBedList(room) {
    this.bedList = [];
    let payload = {
      roomRefNo: room
    }
    this.serviceProviderService.fetchBedList(payload).subscribe(res => {
      if (res.status == 2000) {
        this.bedList = res["data"];
      }
    })
  }

  checkBedOccupancy(bed) {
    let payload = {
      bedRefNo: bed
    }
    this.serviceProviderService.checkBedOccupancy(payload).subscribe(res => {
      if (res.status == 2000) {
        if (res.data == "Y"){
          this._toastService.showI18nToastFadeOut('ADMISSION.BED_OCCUPIED', "error");
          this.admissionForm.patchValue({
            bedRefNo: null
          })
          return;
        }
      }
    })
  }
    
  saveInpatientAdmission() {

    this.submitted = true;
    //this.showMsg = false;
    if (this.admissionForm.value.insurer =="" && this.admissionForm.value.policyNo == "" && 
        this.admissionForm.value.tpa =="" && this.admissionForm.value.paymentMode && "") {
          this.showMsg = false;
    }
    else if (this.admissionForm.value.insurer != null || this.admissionForm.value.policyNo != null || 
             this.admissionForm.value.tpa != null || this.admissionForm.value.paymentMode != null) {
                this.showMsg = true;
            }

    if(this.roomName==null && this.bedNo==null){
      this._toastService.showI18nToastFadeOut("Please select Room/Bed from the list.", "error");
      return;
    }
    if (this.admissionForm.invalid) {
      return false;
    }
    if ((this.admissionForm.controls.patientAgeInMonth.value == null
      || this.admissionForm.controls.patientAgeInMonth.value.trim == '')
      && this.admissionForm.controls.patientDateOfBirth.value == null) {
      this._toastService.showI18nToastFadeOut("You must have to enter date of birth or age.", "error");
      return;
    }
    this.admissionForm.controls.patientAddress.patchValue({
      isDirty: this.admissionForm.controls.patientAddress.dirty
    })

    this.serviceProviderService.saveInpatientAdmission(this.admissionForm.value).subscribe(res => {
      if (res.status == 2000) {
        // this._toastService.showI18nToastFadeOut("Admission record saved", "success");

        let confMsg = this.jsonTranslate.translateJson('ADMISSION.SAVE_ADDMISSION');
        this.confirmationMsg.push(confMsg);
        let confirmationInfo = {};

        confirmationInfo['confirmationMsg'] = this.confirmationMsg;
        confirmationInfo['paymentState'] = SBISConstants.PAYMENT_STATE.CONFIRM;
        confirmationInfo['headerText'] = SBISConstants.CONFIRMATION_HEADER_TEXT.ADDMISSION;
        confirmationInfo['buttonName'] = SBISConstants.ACTION_BUTTON_NAME_FOR_INPATIENT_ADMISSION.SAVE_UPDATE;
        GetSet.setConfirmationInfo(confirmationInfo);
        this.router.navigate(['confirmation']);
        // this.router.navigate(['opd/inpatient-summary']);
      }
    })
    this.submitted = false;
  }

  getDepartmentDetails() {
    this.serviceProviderService.getDepartmentList()
      .subscribe(res => {
        //this.departmentList = res;
        for(let i = 0; i < res.length; i++ ){
          let data = {label: null, value: null};
          data.label = res[i].department;
          data.value = res[i].deptRefNo;
          this.departmentList.push(data);
        }
      });
  }

  


  getRoomCategoryDetailsWithRole() {
    let query = {
      admissionRefNo: this.admissionRefNo
    }
    this.categoryList=[];
   if (this.user.entityName == "HOSPITAL") {
    this.serviceProviderService.getRoomCategoryDetailsWithBedResource(query).subscribe(res => {
          //this.categoryList = res;
          this.allRoomRelatedInfoList=res;
          for(let i = 0; i < res.length; i++ ){
            let data = {label: null, value: null};
            data.label = res[i].roomCatagory;
            data.value = res[i].refNo;
            this.categoryList.push(data);
          }
          if (this.admissionRefNo != null) {
            this.getInpatientAdmissionDetails(this.admissionRefNo);
          }
          
        });
   }
   else if (this.user.entityName == "DOCTOR") {
    
      this.serviceProviderService.getRoomCategoryDetailsWithBedResource(query).subscribe(res => {
       
        for(let i = 0; i < res.length; i++ ){
          let data = {label: null, value: null};
          data.label = res[i].roomCatagory;
          data.value = res[i].refNo;
          this.categoryList.push(data);
        }
        if (this.admissionRefNo != null) {
          this.getInpatientAdmissionDetails(this.admissionRefNo);
        }        
       
     }); 
   }

   else if (this.user.entityName == "INDIVIDUAL") {
    
    this.serviceProviderService.getRoomCategoryDetailsWithBedResource(query).subscribe(res => {
      for(let i = 0; i < res.length; i++ ){
        let data = {label: null, value: null};
        data.label = res[i].roomCatagory;
        data.value = res[i].refNo;
        this.categoryList.push(data);
      }
      if (this.admissionRefNo != null) {
        this.getInpatientAdmissionDetails(this.admissionRefNo);
      }        
     
   }); 
 }
}


  // backToAdmissionSummary() {
  //   if(this.user.roleName == SBISConstants.ROLE_NAMES.INDIVIDUAL)
  //     this.router.navigate(['individual/inpatient-summary']);
  //   else
  //     this.router.navigate(['opd/inpatient-summary']);
  // }
  backToAdmissionSummary() {
    if (this.isPreviewScreenVisible) {
      this.isPreviewScreenVisible = !this.isPreviewScreenVisible;
    } else {
      this._location.back();
    }

    // this.router.navigate(['opd/inpatient-summary']);
  }
  doctorNameList: any = [];// Working on app/issues/937
  referralNameList: string[];// Working on app/issues/937
  doctorDetails: any = [];
  // Working on app/issues/937
  filteredReferralSingle(event) {
    this.doctorDetails = [];
        for(let i = 0; i < this.doctorList.length; i++) {
            let d = this.doctorList[i];
            if(event.query==""){
              if(d.name.toLowerCase().indexOf(event.query.toLowerCase()) == 0) {
                let data = {refNo: null, name: null};
                data.refNo = d.ref_no;
                data.name = d.name
                this.doctorDetails.push(data);
              }
            }
            else{
              if(d.name.toLowerCase().indexOf(event.query.toLowerCase()) >= 0) {
                let data = {refNo: null, name: null};
                data.refNo = d.ref_no;
                data.name = d.name
                this.doctorDetails.push(data);
              } 
            }
            
        }
    // this.serviceProviderService.fetchDoctorListByOPD('ipd').subscribe(res => {
    //   if (res.status === 2000) {
    //     this.doctorList = res.data;
    //   }
    // });
    // this.doctorDetails = this.doctorList;
    // let query = event.query;
    //this.referralNameList = this.filterReferralName(query, this.doctorList);
    // this.referralNameList = this.doctorDetails;

  }

  referredNameSelect(doctor) {
    this.admissionForm.patchValue({
      doctorName: doctor.name,
      doctorRefNo: doctor.refNo

    })

  }

  filterReferralName(query, referralName: any[]): any[] {
    let filtered: any[] = [];
    for (let i = 0; i < referralName.length; i++) {
      let referred = referralName[i];
      if (referred.toLowerCase().toString().indexOf(query.toLowerCase()) != -1) {
        filtered.push(referred);
      }
    }
    return filtered;
  }

  processInsuranceData(e) {
    if ((this.admissionForm.value.insurer =="" || this.admissionForm.value.insurer ==null) && 
    (this.admissionForm.value.policyNo == "" || this.admissionForm.value.policyNo == null) && 
    (this.admissionForm.value.tpa =="" || this.admissionForm.value.tpa == null) && 
    (this.admissionForm.value.paymentMode == "" || this.admissionForm.value.paymentMode == null)) {
        this.showMsgInsurer = false;
    }
    else if (this.admissionForm.value.insurer != null && this.admissionForm.value.insurer != "" &&
    this.admissionForm.value.policyNo != null && this.admissionForm.value.policyNo != "" && 
    this.admissionForm.value.tpa != null && this.admissionForm.value.tpa != "" &&
    this.admissionForm.value.paymentMode != null && this.admissionForm.value.paymentMode != "") {
        this.showMsgInsurer = false;
     }
     else
       this.showMsgInsurer = true;
}

clearDepartment(){
  this.roomList = [];
  this.bedList = [];
  this.departmentRefNo=null;
  this.admissionForm.patchValue({
    bedRefNo:null,
    roomCategory:null,
    roomNo:null,
    department: null
  });
  this.roomName=null;
  this.bedNo=null;
}

clearCategory(){
  this.roomList = [];
  this.bedList = [];
  this.roomCategoryRefNo=null;
  this.admissionForm.patchValue({
    bedRefNo:null,
    roomCategory:null,
    roomNo:null,
    department: null
  });
  this.roomName=null;
  this.bedNo=null;
}

editAdmission(){
//  this.isEdit = false;
 this.isEditBtn = false;
 if(this.user.roleName == "ADMIN"){
 setTimeout(()=> this.admissionForm.enable(),100)

 }else if(this.user.roleName == "DOCTOR"){
  // console.log(this.admissionForm);
   this.admissionForm.get('doctorName').enable();

 }
 
}

//  Working on app/issues/1656

bedCnt: any = 0;
getRoomCategoryDetailsWithBedResource(){
  let query = {
    admissionRefNo: this.admissionRefNo,
    departmentRefNo: this.departmentRefNo,
    roomCategoryRefNo: this.roomCategoryRefNo
  }
   this.serviceProviderService.getRoomCategoryDetailsWithBedResource(query).subscribe(res=>{
     console.log("RESOURCE RESPONSE::",res);
     this.allRoomRelatedInfoList=res;
     console.log("allRoomRelatedInfoList::",this.allRoomRelatedInfoList);
     this.bedCnt=0;
    for(let i=0;i<this.allRoomRelatedInfoList.length;i++){
      if(this.allRoomRelatedInfoList[i].bedCount > 0)  {
        this.bedCnt++;
      }
    }
     if (this.admissionRefNo != null) {
      this.getInpatientAdmissionDetails(this.admissionRefNo);
    } 

   },(error)=>{
    console.log("RESOURCE ERROR::",error);
   })
 }


 getBedAvailablity(bed,room,roomCategoryRefNo){
  let query = {
    resourceRefNo:bed.refNo,
    date: new Date()
  }
  // Working on app/issue/2460
  this.admissionForm.patchValue({
    bedRefNo:bed.refNo,
    roomCategory:roomCategoryRefNo,
    roomNo:room.refNo,
    department: room.departmentRefNo
  });
  this.departmentRefNo = room.departmentRefNo;
  this.roomCategoryRefNo = roomCategoryRefNo;
  this.roomName=room.roomNo;
  this.bedNo = bed.resourceName;
  console.log("ADMISSION FORM::",this.admissionForm);
  this.showRoomDetail=false;
  
  /* this.serviceProviderService.getResourceAvailablity(query).subscribe(res=>{
    console.log("CHECK::",res);

    this.bedAllocation=res.data;

    if(this.bedAllocation.startTime!=null){
      this._toastService.showI18nToast("This Bed is occupied","error")
    }
    else{

      this.admissionForm.patchValue({
        bedRefNo:bed.refNo,
        roomCategory:roomCategoryRefNo,
        roomNo:room.refNo,
        // department: room.departmentRefNo
      });
      this.departmentRefNo = room.departmentRefNo;
      this.roomCategoryRefNo = roomCategoryRefNo;
      this.roomName=room.roomNo;
      this.bedNo = bed.resourceName;
      console.log("ADMISSION FORM::",this.admissionForm);
      this.showRoomDetail=false;
    }
  },(error)=>{
   console.log("RESOURCE ERROR::",error);
  }) */
  // End Working on app/issue/2460
 }


 closeRoomSidebar(){
  this.showRoomDetail=false
 }
 openRoomInfoSideBar(){
  this.showRoomDetail=true;
  this.getRoomCategoryDetailsWithBedResource();
 }
 // End Working on app/issues/1656


 getUserAddresBtRefNoAndAddressType(userRefNo,addressType){
   let reQuestPayload={
    userRefNo:userRefNo,
    addressType:addressType
   }
   console.log("payload::",reQuestPayload);
     
  this.individualService.getUserAddresBtRefNoAndAddressType(reQuestPayload).subscribe(res => {
    console.log("RESPONSE::",res);
    
    if (res.status === 2000) {
      if(res.data.id!=null){
        this.admissionForm.controls.patientAddress.patchValue({
          id: res.data.id,
          addressType: res.data.addressType,
          country: res.data.country,
          pinCode: res.data.pinCode,
          state: res.data.state,
          city: res.data.city,
          line1: res.data.line1,
          line2: res.data.line2
        });
        this.admissionForm.controls.patientAddress.markAsDirty();
      }else{
        this.admissionForm.controls.patientAddress.patchValue({
        id: null,
        addressType: "Inpatient",
        country: "India",
        pinCode: null,
        state: null,
        city: null,
        line1: null,
        line2: null,

        });
      }
     
      console.log("admissionForm after Address Fetch::",this.admissionForm);
    } 

  });

 }

// Working on app/issue/2232
 previewPatientAdmissionDetails() {


  this.isPreviewScreenVisible = !this.isPreviewScreenVisible;

  if (this.admissionForm.value.department != null) {
    let selectedDepartment = this.departmentList.find((dept) => dept.value == this.admissionForm.value.department);

    this.bedInfo.departmentName = selectedDepartment.label;
  }

  if (this.admissionForm.value.bedRefNo != null) {
    let selectedRoomCategory = this.allRoomRelatedInfoList.find(rc => rc.refNo == this.admissionForm.value.roomCategory);


    this.bedInfo.roomCategoryName = selectedRoomCategory.roomCatagory;



    let selectedRoom = selectedRoomCategory.roomDto.find(rm => rm.refNo == this.admissionForm.value.roomNo);
    
    this.bedInfo.roomNo = selectedRoom.roomNo;

    let selectedBed = selectedRoom.bedList.find(bed => bed.refNo == this.admissionForm.value.bedRefNo);
  
    if(selectedBed!=undefined)
    this.bedInfo.bedNo = selectedBed.resourceName;
  }




  if (this.admissionForm.controls.patientDateOfBirth.value != null) {
    var calculateAgeDiff = Date.now() - this.admissionForm.controls.patientDateOfBirth.value.getTime();
    var actualAge = new Date(calculateAgeDiff);
    this.patientAgePreview = Math.abs(actualAge.getUTCFullYear() - 1970);
  } else {
    this.patientAgePreview = this.admissionForm.controls.patientAgeInMonth.value;
  }


  /*Gender */
  console.log("admissionForm.controls.patientGender.value",this.admissionForm.controls.patientGender.value);
  
  if (this.admissionForm.controls.patientGender.value == null) {
    this.previewPatientGender = "N/A";
  }
  else if (this.admissionForm.controls.patientGender.value == 'M') {
    this.previewPatientGender = "Male"
  }
  else if (this.admissionForm.controls.patientGender.value == 'F') {
    this.previewPatientGender = "Female"
  }
  else {
    this.previewPatientGender = "Other"
  }
  /*Food Peference */
  console.log("admissionForm.controls.foodPreference.value",this.admissionForm.controls.foodPreference.value);
  if (this.admissionForm.controls.foodPreference.value == null) {
    this.previewFoodPreference = "N/A";
  }
  else if (this.admissionForm.controls.foodPreference.value == 'V') {
    this.previewFoodPreference = "Veg";
  }
  else {
    this.previewFoodPreference = "Non Veg";
  }
}
// End Working on app/issue/2232

}

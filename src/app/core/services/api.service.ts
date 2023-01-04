import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Api } from './api';
import { environment } from '../../../environments/environment';
import { IModel } from './models';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }
    ///auth module
    // UserRegister = new Api<IModel>(this.http, this.apiUrl + 'rest/v1/inusers/register');
    //UserRegister = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/signup');
    DownloadOPDInvoice = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/generateAppointmentInvoice');
    FetchOCRResponseByDocumentRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/retrieve/ocr-nlp-response-by-doc-ref-no');
    UpdateOCRResponseByUser = new Api<IModel>(this.http, this.apiUrl + 'v1/update/ocr-nlp-by-user');
    UserRegister = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/send-app-otp');
    UserLogin = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/login');
    Token = new Api<IModel>(this.http, this.apiUrl + 'v1/generate/refresh-token');
    RetrieveCommonRoles = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/user-roles');//get user role
    UserEmailAddressCheck = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users');
    UserMobileNoAddressCheck = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users');
    RegisterNewUserForProcedure = new Api<IModel>(this.http, this.apiUrl + 'v1/register/new-user');//https://gitlab.com/sbis-poc/app/issues/1471
    UserProfileCheck = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/users/email');
    UserMobileCheck = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/users/contactno');
    //changepassword = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/changepassword');
    changepassword = new Api<IModel>(this.http, this.apiUrl + 'v1/users/changepassword');
    //ForGorPassWord = new Api<IModel>(this.http, this.apiUrl + 'rest/v1/inusers/resetpassword');
    ForGorPassWord = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/forgotpassword');
    //ReSendVarification = new Api<IModel>(this.http, this.apiUrl + 'rest/v1/inusers/resendverification');
    ReSendVarification = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/resendverification');
    MobileVerify = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/verify');
    VerifyEmail = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/verify');
    //VerifyResetPassWord = new Api<IModel>(this.http, this.apiUrl + 'rest/v1/inusers/verifyresetpasswordlink');
    //ResetPassWord = new Api<IModel>(this.http, this.apiUrl + 'rest/v1/inusers/verify');

    VerifyResetPassWord = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/verify-forgotpassword-code');
    ResetPassWord = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/resetpassword');
    SetPassword = new Api<IModel>(this.http, this.apiUrl + 'UserLogin');
    GetUserEmail = new Api<IModel>(this.http,this.apiUrl + 'v1/inusers/get-user-email');//to get user email by ref no
    //group rqst accept
    AcceptGroupInvitation = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/groups/inusers/invitation/accept');
    RejectGroupInvitation = new Api<IModel>(this.http, this.apiUrl + 'v1/group-invitation-reject');
    SendDocumentViaEmail = new Api<IModel>(this.http, this.apiUrl + 'v1/send-document-via-email');//SEND doc via email 
    RetrieveGroupInvitations =new Api<IModel>(this.http, this.apiUrl + 'v1/retrieve/group-invitation-list');
    ////////indivudal module 
    MasterData = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/inusers/masterdata');
    UserProfile = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers');//v1/inusers
    Country = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/inusers/countries');
    ExerciseType = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/inusers/exercisetype');
    DeleteUserAddresses = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/delete/addresses');
    DeleteUserOccupations = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/delete/occupations');
    DeleteUserExercise = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/delete/exercise');
    UserGroup = new Api<IModel>(this.http, this.apiUrl + 'v2/groups/get-user/by-group-id');//v1/groups/get-user/by-group-id
    CreateGroup = new Api<IModel>(this.http, this.apiUrl + 'v2/groups');//v1/groups
    DeleteGroupMember = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/delete-group-member/by-groupId-relationshipId');
    AddUser = new Api<IModel>(this.http, this.apiUrl + 'v2/groups/inusers/invite');
    UserGroupDelete = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/delete');
    LeaveGroup = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/inusers/leave');
    MakeAdmin = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/inusers/makeadmin');
    RevokeAdmin = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/inusers/revokeadmin');
    AddMemberToUserGroup = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/inusers');
    AddExistingUser = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/inusers/add');
    GroupNewUserInvitation = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/inusers/invite');
    SearchUser = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/search');
    CheckExistingUserName = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/inusers/userid');
    UploadProfiePhoto = new Api<IModel>(this.http, this.apiUrl + 'v1/upload/profile-image');
    DownloadProfiePhoto = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/download/profile-image');//need to be closed
    MedicinesFetchByNameList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/medicine/get-medicine-by-name');
    MedicinesFetchByName = new Api<IModel>(this.http, this.apiUrl + 'v1/medicine/get-medicine-by-name');
    MedicinesFetchById = new Api<IModel>(this.http, this.apiUrl + 'v1/medicine/get-medicine-by-id');
    MedicinesFetchByMedicineId = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/medicine/get-medicine-by-id');//new add to fetch medicines by medicine id
    SaveOrderMedicine = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/orders/medicine');//gen/v1/orders/medicine
    SaveOrderMedicineMultiple = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/orders/medicine/multiple-requisions');
    //for view order-med
    getOrderMedicineByUserRefNo = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/orders');//v1/inusers/orders
    DeleteOrderedMedicine = new Api<IModel>(this.http, this.apiUrl + 'v1/cancel/order');
    // Doctor Module
    // Profile
    SaveDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-doctor-info');
    SaveDoctorAddress = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-doctor-address');
    GetAddressType = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/ADDRESS_TYPE');
    GetCountry = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/inusers/countries');
    GetEmail = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/check-duplicate-email');
    GetPh = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/check-duplicate-phNo');
    GetStates = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/inusers/countries');
    GetQualificationList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-qualification-list');
    GetSpecializationList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-specialization-list');
    FetchUserDtls = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/fetch-doctor-info');
    FetchQualification = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/fetch-qualification');
    FetchSpecialization = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/fetch-specialization');
    FetchCityListForDoctorSearch = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/doctor/unique-city');
    DownloadProfilePic = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/users/download/profile-image');

    // Search
    DoctorSearch = new Api<IModel>(this.http, this.apiUrl + 'gen/v4/doctor/search-doctor');//pevious url was v2/doctor/search-doctor - to v4 for app#1062
    DoctorSearchV5 = new Api<IModel>(this.http, this.apiUrl + 'gen/v5/doctor/search-doctor');//pevious url was v2/doctor/search-doctor - to v4 for app#1062
    DoctorQualification = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-qualification-list');
    DoctorSpecialization = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-specialization-list');
    CalendarDoctorChambe = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/get-calendar-doctor-chamber');
    CalendarDoctorChamber = new Api<IModel>(this.http, this.apiUrl + 'v4/doctor/get-calendar-doctor-chamber');//new add to get 
    GetAdditionalDoctorChamberList = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/get-doctor-chambers');//to get additional chamber
    UserReviews = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/reviews');

    // Chamber
    GetOPDCategory = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/OPD_TYPE');
    GetOPDType = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/CHAMBER_TYPE');
    GetHospitalListByCategory = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-hospital-list-by-category');
    GetHospitalByName = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-hospital-by-name');
    ValidateChamberTimingList = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/validate-chamber-timing');
    SaveChamberDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-doctor-chamber');
    GetDoctorAppointmentForMyChamber = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getdoctorappointmentformychamber');
    DeleteChamberListAndApointmentForMyChamber = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getdoctorappointmentandmychamberupdate');
    SaveDoctorChamber = new Api<IModel>(this.http, this.apiUrl + 'v3/doctor/save-doctor-chamber');

    // for menus

    //GetMenus = new Api<IModel>(this.http, this.apiUrl + 'v1/menu/get-menu-structure');
    // GetMenus = new Api<IModel>(this.http, this.apiUrl + 'v2/menu/get-menu-structure');
    GetMenus = new Api<IModel>(this.http, this.apiUrl + 'v3/menu/get-menu-structure');

    //for header
    // GetAlerts = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/alerts');//v1/inusers/alerts //--closed[23.07.2019]
    cancelAlerts = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/alerts/cancel');
    checkNewAlerts = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/alerts/check-new-alerts');

    // Appointment and Payment ///

    // Appointments = new Api<IModel>(this.http, this.apiUrl + 'v1/appointment');//--by userrefno--to fetch appointments
    // AppointmentsV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/appointment');//v1/appointment -- AppointmentsV2 (GET by ref number)
    BookAppointment = new Api<IModel>(this.http, this.apiUrl + 'v3/appointment');//POST -- make an appointment
    BookAppointmentV4 = new Api<IModel>(this.http, this.apiUrl + 'v4/appointment');
    CheckOnlineSessionStatusByAppointmentRef = new Api<IModel>(this.http , this.apiUrl + 'v1/chat/check-online-session-status');

    RetrieveAppointmentsForInUser = new Api<IModel>(this.http,this.apiUrl + 'v1/retrieve-inusers-appointments');
    AppointmentsGroupMember = new Api<IModel>(this.http, this.apiUrl + 'v2/appointmentForGroupMembers');
    PaymentInitiateV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/payment/initiate');
    PaymentInitiate = new Api<IModel>(this.http, this.apiUrl + 'v1/payment/initiate');
    FindPatient = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/my-appointments');
    GetAppStatus = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/getAllAppStatus');
    RatingParam = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/rating-param');
    Rating = new Api<IModel>(this.http, this.apiUrl + 'v1/rating');
    SaveRatingV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/rating');
    RetingV2 = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/retrive-rating-details');
    ViewRating = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/rating');
    ViewRatingV2 = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/retrive-rating-details');


    GetRangedAppointments = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/find-ranged-appointment');

    GetDoctorAppointments = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-doctor-appointment');

    SaveDoctorAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-doctor-appointment');

    GetUserByName = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-user-by-name');

    DeleteAppoinment = new Api<IModel>(this.http, this.apiUrl + 'v2/appointment');//v1/appointment

    UpdateAppoinment = new Api<IModel>(this.http, this.apiUrl + 'v1/appointment');

    FindDoctorById = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/find-doctor-by-id');

    AllModelAttributeValuesForMedication = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getAllModelAttributeValuesForMedication');

    //Prescription
    SavePrescription = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/savePrescriptionDetails');
    GetInfoAndMedicalHistoryForUser = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getInfoAndMedicalHistoryForUser');
    GetPrescriptionByUserId = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/prescriptions');//v1/inusers/prescriptions
    GetPrescriptionForUser = new Api<IModel>(this.http, this.apiUrl + 'v3/retrive-inusers-prescriptions');//its a post call
    PrescriptionUpload = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/upload-document');
    PrescriptionDownload = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/download-document');
    GetGroupMember = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/members');

    GetMedicalAttributeList = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-md-findings-by-long-name');

    GetMedicalAttributeLongName = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-md-findings-long-name');
    GetMedicalAttributeLongNameV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/get-md-findings-long-name');
    GetMedicalAttributeLongNameV3 = new Api<IModel>(this.http, this.apiUrl + 'v1/get-md-medical-attribute');

    GetChildAttributesByParentsId = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-md-child-attributes');
    GetMedicalFindingsGroupDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/groups/latest-md-findings');//new add for med attr
    //to fetch all medicine attribute details
    getAllMedAttributeList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-all-md-attributes');

    //save medical records for individual
    SaveMedicalRecords = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/save-md-findings');
    FetchMedicalTestReports = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/testreports'); //fetch medical records url   
    LoadVitalMedicalRecords = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-latest-md-findings-by-user');//load medical records
    LoadMedicalAttributeDataForChart = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-md-findings-by-date');
    //to update n delete medical details history
    DeleteMedicalFindingsSingleData = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/delete-md-findings');
    UpdateMedicalFindingsSingleData = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/update-md-findings');
    GetMinorTestReport = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/testreports-minor');//v1/inusers/testreports-minor
    //Get User State After login

    GetUserState = new Api<IModel>(this.http, this.apiUrl + 'v1/user-state');
    GetUserStateV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/user-state');

    GetUserProfilePk = new Api<IModel>(this.http, this.apiUrl + 'v1/user/profile-pk');

    //Get Hospital List
    GetHospitalList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/serviceprovider/getHospitalList');
    //Get Parent Entity List
    GetParentEntityList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/serviceprovider/getParentEntityList');

    SaveEntity = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/serviceprovider/saveServiceProviderEntity');

    SaveFavDoctor = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/inusers/favoriteDoctor');

    GetFavDoctorForUser = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/inusers/findfavoriteDoctors');//gen/v1/inusers/findfavoriteDoctors

    //User Vaccination

    //GetVaccinationMasterData = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/vaccine');

    GetVaccinationMasterData = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/vaccine');
    UserVaccinationData = new Api<IModel>(this.http, this.apiUrl + 'v3/vaccine/inusers');//v1/vaccine/inusers  --> v2/vaccine/inusers
    // OPD Add User
    GetRolesForHospital = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/get-roles');
    SaveRolesForHospital = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/save-misc-user');
    Send_Notification = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/roleadd/notification')
    ManageOTP = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/manage-otp');
    AdminCount = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/admincount');
    //working on https://gitlab.com/sbis-poc/app/issues/1036
    GetAppointmentsForServiceProviders = new Api<IModel>(this.http, this.apiUrl + 'v1/serviceprovider/get-appointments');//to get service providers appointments
    GetPendingAppointmentsForServiceProviders = new Api<IModel>(this.http, this.apiUrl + 'v1/serviceprovider/numberOfPendingAppointment');//to get pending appointments number for service providers
    //end of working on https://gitlab.com/sbis-poc/app/issues/1036
    //working on https://gitlab.com/sbis-poc/app/issues/1103
    PatientSearchByOPD = new Api<IModel>(this.http, this.apiUrl + 'v1/get-patient-details-list-from-opd');
    GetPatientPastPrescriptionByOPD = new Api<IModel>(this.http, this.apiUrl + 'v1/get-all-past-prescription-by-opd');
    //end of working on https://gitlab.com/sbis-poc/app/issues/1103

    //get user roles
    GetUserRole = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/roles');

    //Reset Mobile forget password
    ResetPasswordMobile = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/resetpassword');

    ///Pharmacy
    GetDocumentByRole = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/serviceprovider/get-req-document-by-role');

   //OTP
   SendOtp = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/manage-otp');
   SendVerificationCode = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/roleadd/sendverificationcode');
   //EmailVerificationRequestManage = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/roleadd/verifyotp/email');
   //MobileVerificationRequestManage = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/roleadd/verifyotp/mob');
   EmailVerificationRequestManage = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/verify-app-otp-signup');
   MobileVerificationRequestManage = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/verify-app-otp-signup');
   //SignupDiffRole = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/roleadd/signup');
   SignupDiffRole = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers');
   SignupDiffRoleV2 = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/roleadd/signup'); //Working on #1813
    //Fetch Service Provider details by User PK and Parent Role name
    GetServiceProviderEntityValueByPk = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/serviceprovider/getServiceProviderEntityDataByPk');

    ProviderUser = new Api<IModel>(this.http, this.apiUrl + 'v1/serviceprovider/profile');

    SaveGroupUserPermission = new Api<IModel>(this.http, this.apiUrl + 'v1/groups/inusers/permission');

    SaveDoctorHoliday = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-doctor-holiday');
    GetIndividualUserData = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/getUserDetails');
    // Updated for issue app#620
    UserRolesList = new Api<IModel>(this.http, this.apiUrl + 'v2/opd/get-misc-user-list');

    GetDoctorList = new Api<IModel>(this.http, this.apiUrl + 'v2/serviceprovider/getDoctorByMiscellaneousUserPk');

    GenerateReport = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/common/generateReport');

    GetPastPrescription = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getPastPrescription');

    GetPrescriptionByAppoRef = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/get-prescription-by-appointment');
    GetPrescriptionByAppoRefV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/prescription/getPrescriptionByAppointmentRefNo');

    CancelDoctorAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/cancelAppointment');

    ConfirmAllAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/confirmAllAppointment');

    PendingAppointmentNumber = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/pendingAppointmentNumber');
    ResetDoctorSignatureImage = new Api<IModel>(this.http, this.apiUrl + 'v1/reset-doctor-signature-image');//https://gitlab.com/sbis-poc/app/issues/1716
    CheckContactno = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/users/contactno');

    RoleAdd = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/users/roleadd/signup');
    GetDoctorAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getdoctorappointment');
    SaveCreatePrescriptionByDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/createPrescription');
    GetDoctorAppointmentAndChamberUpdate = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/delete-chamber-by-opd');
    //FetchDoctorByOpd = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/fetch-doctor-info');
    GetDoctorProfileByMsUserPk = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/getDoctorProfilePk');

    GetDoctorName = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-doctors-under-opd');
    GetChamberTimingForDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-chamber-timing-opd');
    GetAverageVisitDurationForDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-average-visit-duration-dr-opd');
    GetChamberPkForDoctorMiscUser = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getChamberPkForDoctorMiscUser');

    CheckAppointmentExistsForUserInSelectedTimeRange = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/checkAppointmentExistsForUserInSelectedTimeRange');
    AppointmentExitsForPatient = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/appointmentExitsForPatient');
    CheckOverBookingExcceeded = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/checkOverbookingExcceded');
    // Elastic Search for Medicine List 
    GetMedicineList = new Api<IModel>(this.http, 'http://68.183.80.156:9200/sbis_medicine_idx/_search');

    CheckUniqueHospitalForDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/checkUniqueHospitalForDoctor');
    //get dashboard-widget list
	getDashboardWidgetList = new Api<IModel>(this.http, this.apiUrl + 'v1/dashboards');//gen/v1/dashboards
    //getDashboardWidgetList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/dashboards');

    //get order by id
    GetOrderById = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/cart/items-details');//gen/v1/cart/items-details
    CountOrderById = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/cart/item-count');
    AddressById = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/inusers/addresses');
    PlaceOrderFromCart = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/cart/items/place-order');
    ValidatePinWithItemId = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/validate-delivery-address');

    AutoSavePrescription = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/autoSavePrescriptionDetails');
    GetPharmacyPkByMsUserId = new Api<IModel>(this.http, this.apiUrl + 'v1/pharmacyRequisition/getPharmacyPk');
    GetPrescriptionByAppoRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getPrescriptionByAppointmentRefNo');
    GetVitalData = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getVitalData');
    GetPharmacyRequisitionList = new Api<IModel>(this.http, this.apiUrl + 'v1/pharmacyRequisition/getPharmacyRequisitionList');
    UpdatePharmacyRequestDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/pharmacyRequisition/updatePharmacyRequestDetails');
    RejectPharmacyRequest = new Api<IModel>(this.http, this.apiUrl + 'v1/pharmacyRequisition/rejectPharmacyRequest');
    //new add to get medical details history by id
    GetMedicalDetHistoryByUSerIdNAttrId = new Api<IModel>(this.http, this.apiUrl + 'v1/findings');
    FindOrSaveMedicalAttribute = new Api<IModel>(this.http, this.apiUrl + 'v1/find-or-save-medical-attribute');
    RetrieveMedicalRecordsByTriggerAndAttributeId = new Api<IModel>(this.http, this.apiUrl + 'v1/retrive/unique-medical_recordes');
    SaveMedicalRecordsByPrescription = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/save-md-findings');

    CompleteMedicinePaymentURL = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/payment/razorapay/complete')

    GetLabTestList = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getLabTestList');

    //load medical records
    LoadALLMedicalRecords = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/get-latest-md-findings-by-user');
    //get invoice report
    GetInvoiceReport = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/generate-order-invoice');

    GetAllPastNote = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getPastNoteList');

    DoctorNameList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/doctor/prescription/getDoctorNameList');
    HospitalNameList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/doctor/prescription/getHospitalNameList');

    //review order
    GetAllFees = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/items/get-all-fees');
    GetTaxByItem = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/items/fees/tax');
    GetDiscountAmountByItem = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/items/fees/discount');
    SaveDoctorNote = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/saveDoctorNote');
    SearchPaitientByDoctor = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/searchPaitientByDoctor');
    GetUserPkByRefno = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getUserPkByRefno');
    //    GetAllFees = new Api<IModel>(this.http, this.apiUrl +'gen/v1/items/get-all-fees');


    //re order
    GetReOrderableMedicineDetails = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/reorder/order-details');
    OrderMedicineForMultipleRequisition = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/orders/medicine/multiple-requisions');

    //peer consulting
    PeerConsultingForDoc = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/search');
    PeerConsultingCreate = new Api<IModel>(this.http, this.apiUrl + 'v1/peer-consulting/create');
    GetPeerConsultingByDoc = new Api<IModel>(this.http, this.apiUrl + 'v2/get-peer-consulting/DOCTOR');//v1/get-peer-consulting/DOCTOR
    PeerConsultingComment = new Api<IModel>(this.http, this.apiUrl + 'v1/peer-consulting/write-comment');
    PeerConsultingDownloadFile = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/download-document');
    PatientDiagnosisDetails = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/peer-consulting/get-patient-diagnosis-detail');

    // Pharmacy Requisition / Delivery flow

    GetOrderDeliveryList = new Api<IModel>(this.http, this.apiUrl + 'v1/requisition/get-order-list-for-delivery');
    SaveDelivery = new Api<IModel>(this.http, this.apiUrl + 'v1/delivery/save-delivery');
    GetDeliveryFlow = new Api<IModel>(this.http, this.apiUrl + 'v1/delivery/get-pharmacy-delivery-workflow');
    GetReasonList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/find-reason-codes');
    PeerConsultingValidate = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/peer-consulting/validate-invite-link');

    CheckOverlappingDoctorAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/checkOverlappingDoctorAppointment');

    GetDoctorDetailsByRefNo = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/doctor/get-doctor-basic-profile');
    GetChamberDetailsByRefNo = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/prescription/get-chamber-by-appointmentRefNo');
    GetPatientDetailsByRefNo = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/profile/get-user-basic-profile');
    //Add Minor
    AddMinorRequest = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/minors/add');
    AddminorList = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/minors/get-all-by-refno');//v1/inusers/minors/get-all-by-refno
    MinorUserViewAppoinment = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/minors/get-all-appointment-by-refno');

    DownloadLogo = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/serviceprovider/downloadLogo');
    MinorEaddressList = new Api<IModel>(this.http, this.apiUrl + 'v1/get-user/by-eaddress');
    guardianMinorDelete = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/minor-guardians/delete');
    AddGuardianUpdate = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/minors/addguardian');
    deleteGuardian = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/minor-guardians/delete');
    //allergy-procedure-disease
    GetAllergyHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-allergy');//get
    SaveAllergy = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/allergy/save');//save
    DeleteAllergy = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/allergy/delete');//delete
    SaveProcedure = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/procedure-history/save');//save
    GetProcedure = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-procedure-history');//get
    DeleteProcedure = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/procedure-history/delete');//delete
    GetDisease = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-diseases-history');//get
    DeleteDisease = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/diseases-history/delete');//delete
    UpdateDisease = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/diseases-history/save');//save
    SaveLabTest = new Api<IModel>(this.http, this.apiUrl + 'v1/serviceprovider/labTest/save');
    GetAllLabTest = new Api<IModel>(this.http, this.apiUrl + 'v1/serviceprovider/getAllLabTestByRefNo');
    DeleteTest = new Api<IModel>(this.http, this.apiUrl + 'v1/serviceprovider/labTest/delete');

    SaveLabTestExcelData = new Api<IModel>(this.http, this.apiUrl + 'v1/serviceprovider/saveLabTestExcelData');
    GetMedicalCodeAndName = new Api<IModel>(this.http, this.apiUrl + 'v1/serviceprovider/getMedicalCodeAndName');

    FetchAllChamberByDoctorRefNo = new Api<IModel>(this.http, this.apiUrl + 'v4/doctor/get-doctor-chambers');
    FetchHolidayList = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/fetchDoctorHolidayList');
    UpdateDoctorHoliday = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/updateHoliday');

    FetchUserDtls_v2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/fetch-doctor-info');
    FetchChamberDtls_V2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/getDoctorChambers');
    GetAllChambersv2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/getAllChambers');
    GetDoctorAppointmentForMyChamberv2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/getDoctorAppointmentForMyChamber');
    DeleteChamberListAndApointmentForMyChamberV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/deleteChamberListAndApointmentForMyChamber');
    GetDoctorChamber_v2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/getChamber');
    GetDoctorChamber_v3 = new Api<IModel>(this.http, this.apiUrl + 'v3/doctor/getChamber');
    GetHospitalV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/get-hospital-by-ref');
    GetDocumentByRolev2 = new Api<IModel>(this.http, this.apiUrl + 'v2/serviceprovider/getAllRequiredDocument');
    GetServiceProviderEntityValueByPkv2 = new Api<IModel>(this.http, this.apiUrl + 'gen/v2/serviceprovider/getServiceProviderEntityDataByPk');
    ProviderUserv2 = new Api<IModel>(this.http, this.apiUrl + 'v2/serviceprovider/profile/getServiceProviderProfileDetails');
    FindOPDByMiscUserMsUserPkv2 = new Api<IModel>(this.http, this.apiUrl + 'v2/serviceprovider/getHospital');
    CancelDoctorAppointmentV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/cancelAppointment');
    ConfirmAllAppointmentV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/confirmAllAppointment');
    PendingAppointmentNumberv2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/numberOfPendingAppointment');
    FetchDoctorByOpd = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/fetch-doctor-info-by-opd');
    FetchDoctorByOpdv2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/fetch-doctor-info-by-opd');
    GetDoctorNameV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/getDoctorNameByHosRef');
    CheckUniqueHospitalForDoctorV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/checkUniqueHospitalForDoctor');
    GetAddressesForDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/fetch-doctor-addresses');
    GetPastPrescriptionV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/prescription/getPastPrescription');
    GetAllPastNote2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/prescription/getPastNoteList');
    GetDoctorAppointmentsV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/get-doctor-appointment');
    GetChamberDetailsByOPD = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/get-chamber-details-by-opd');
    GetDosageDurationList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/DOSAGE_DURATION');
    GetDurationUnitList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/DURATION_UNIT');
    DeleteChamber = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/delete-chamber');
    ManageAppoinment = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/save-doctor-appointment');
    CancelMultipleAppointments = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/cancelMultipleAppointment');
    SearchAndCancelAppointmentV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/SearchAndCancelAppointment');
    GetAllChamberListv2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/getAllChambers');
    ValidateChamberTimingList2 = new Api<IModel>(this.http, this.apiUrl + 'v3/doctor/validate-chamber-timing'); // app#1311
    CheckOverlappingDoctorAppointmentV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/checkOverlappingDoctorAppointment');
    CheckAppointmentExistsForUserInSelectedTimeRangeV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/checkAppointmentExistsForUserInSelectedTimeRange');
    CheckOverBookingExcceededV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/checkOverbookingExcceded');
    SaveCreatePrescriptionByDoctorV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/createPrescription');
    SaveCreatePrescriptionByDoctorV3 = new Api<IModel>(this.http, this.apiUrl + 'v3/doctor/createPrescription');
    GetRangedAppointmentsV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/find-ranged-appointment');
    GetHospitalListByCategoryV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/get-hospital-list-by-category');
    GetHospitalListBySearchText = new Api<IModel>(this.http, this.apiUrl + 'v1/get-hospital-list-by-hospital-name');//to fetch hospital list by search text 
  // CancelMultipleAppointments = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/cancelMultipleAppointment');
  CancelMultipleAppointmentsV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/cancelMultipleAppointment'); //  app#1479


    //feedback
    SetFeedback = new Api<IModel>(this.http, this.apiUrl + 'v1/send-feedback');
    GetFeedback = new Api<IModel>(this.http, this.apiUrl + 'v1/get-feedback');

    //logout
    Logout = new Api<IModel>(this.http, this.apiUrl + 'v1/log-out');
    LogoutV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/log-out');
    FeedbackDownloadFile = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/download-document');

    //for view order-med
    getOrderMedicineByUserRefNov3 = new Api<IModel>(this.http, this.apiUrl + 'v3/inusers/orders');
    GetDeliveryFlowv2 = new Api<IModel>(this.http, this.apiUrl + 'v2/delivery/get-pharmacy-delivery-workflow');

    //get doc briff resume
    GetDocResume = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/doctor/get-briefResume');

    GetAllNonVerifiedDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-all-non-verified-doctor');
    FilterAllNonVerifiedDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/filter-all-non-verified-doctor');
    GetRegistrationApprovalStatusList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/REGISTRATION_APPROVAL_STATUS');
    GetDoctorListForVerification = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-doctor-list-for-verification');
    SaveDoctorRegistrationVerificationHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-doctor-verification-history');
    GetDoctorRegistrationVerificationHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-doctor-verification-history');
    // Changed to V2 for below 2 services - issue app#647
    GetFrequentPrescribedTestList = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/prescription/get-frequent-prescribed-test-list');
    GetFrequentPrescribedMedicineList = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/prescription/get-frequent-prescribed-medicine-list');
    //book diagnostics
    BookDiagnostics = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/book/diagnostics');
    FindDiagnosticLab = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/find-diagnostic-lab');
    GetDiagnosticsLabOrders = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/diagnostic-lab-orders');

    GetPastPrescriptionV3 = new Api<IModel>(this.http, this.apiUrl + 'v3/doctor/prescription/getPastPrescription');
    //sbis-poc/app/issues/862
    GetPastPrescriptionV4 = new Api<IModel>(this.http, this.apiUrl + 'v4/doctor/prescription/getPastPrescription');
    GetRecentMedicationByUserRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getRecentMedicationByUserRefNo');

    GetPrescriptionByAppoRefNoV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/prescription/getPrescriptionByAppointmentRefNo');
    GetRepeatMedication = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getRepeatMedication');
    GetRepeatMedicationV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/prescription/getRepeatMedication'); //working on app#1936

    // Added for issue app#597
    FindCountryStateCityByPin = new Api<IModel>(this.http, this.apiUrl + 'v1/getCountryStateCityByPin');

    //role switch
    GetAllRolesByUser = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-user-roles');
    GetUserStateByRoles = new Api<IModel>(this.http, this.apiUrl + 'v1/get-user-state-by-msuser-and-role');


    //Working on app/issues/595
    GetHomeVisitDetailsByDoctorRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getHomeVisitDetailsByDoctorRefNo');
    DiscontinueHomeVisit = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/discontinueHomeVisit');
    PendingHomeVisitCount = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/pendingHomeVisitCount');
    GetHomeVisitableDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getHomeVisitableDoctor');
    //End Working on app/issues/595

    FetchAllQueryResult = new Api<IModel>(this.http, this.apiUrl + 'v1/sysadmin/query/fetch-query-results-by-id');
    HandleNotification = new Api<IModel>(this.http, this.apiUrl + 'v1/sysadmin/query/handle-notification');
    HandleAction = new Api<IModel>(this.http, this.apiUrl + 'v1/sysadmin/query/handle-action');

    //Working on app/issues/591
    GetSubstituteMedicineList = new Api<IModel>(this.http, this.apiUrl + 'v1/medicine/get-medicine-list-by-composition');
    //End Working on app/issues/591

    // sbis-poc/app/issues/594   added for problem Narration
    fetchAllProblemNarration = new Api<IModel>(this.http, this.apiUrl + 'v1/patient/fetch-problem-narration-by-appoinmentRefNo');
    //get Associate user by eaddress
    GetAssociateUserByEaddress = new Api<IModel>(this.http, this.apiUrl + 'v1/retrive-all-associated-users');//v1/inuser/minors/get-all-by-eaddress

    //canvas services
    MasterMedicalImageGroupMap = new Api<IModel>(this.http, this.apiUrl + 'v1/retrive/master-image');//GET call
    DownloadDocument = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/download-document');
    RetrieveDrRecentImages = new Api<IModel>(this.http, this.apiUrl + 'v1/retrive/doctor-image-map');
    PostDrRecentImages = new Api<IModel>(this.http, this.apiUrl + 'v1/create/doctor-image-map');

    //Working on app/issues/688
    GetOnlineConsultancyDetailsByDoctorRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getOnlineConsultancyDetailsByDoctorRefNo');
    DiscontinueOnlineConsultancy = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/discontinueOnlineConsultancy');
    GetOnlineConsultancyProvidedDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getOnlineConsultancyProvidedDoctor');
    //End Working on app/issues/688

    //Working on app/issues/720
    GetInvestigationTypeAheadList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/investigation/get-investigation-by-name');
    //End Working on app/issues/720

    getMedicaleAttrPKBySystemCode = new Api<IModel>(this.http, this.apiUrl + 'v1/patient/get_medicale_attr_pk_by_systemcode');


    GetGuardianAttributeByName = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getOnlineConsultancyProvidedDoctor');

    // //family history
    // GetFamilyHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-family');
    // SaveFamilyHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/family/save');
    // DeleteFamilyHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/family/delete');

    // //current medicine
    // GetMedicineHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-medicine');
    // SaveMedicineHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/medicine/save');
    // DeleteMedicineHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/medicine/delete');

    GetMedicaleAttrPKBySystemCode = new Api<IModel>(this.http, this.apiUrl + 'v1/patient/get_medicale_attr_pk_by_systemcode');

    //Working on app/issues/747
    GetDiagnosisInfoByName = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/investigation/get-diagnosis-by-name');
    //End Working on app/issues/747

    //referral for doctor
    DoctorReferralSave = new Api<IModel>(this.http, this.apiUrl + 'v1/refer-to-doctor');
    DoctorReferralInvitation = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/referral-doctor/invitation/verification');
    RetrieveDoctorReferral = new Api<IModel>(this.http, this.apiUrl + 'v1/retrieve-doctor-referral-invitation');
    CheckDoctorUser = new Api<IModel>(this.http, this.apiUrl + 'v1/check-referral-doctor/existence');
    ResendDoctorReferralMail = new Api<IModel>(this.http, this.apiUrl + 'v1/resend-referral-notification');



    //working on issue number #765
    SaveAndUpdateProcedureNotes = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/procedure/save');
    GetProcedureNotes = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-procedure');
    GetAllUsersProcedureInfoByDocRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-procedure-list-by-doctor-ref-no');
    GetAllUserProcedureByAdmissionRefNo = new Api<IModel>(this.http,this.apiUrl + 'v1/inusers/get-procedure-list-by-admission-ref-no');
    //user family history
    UserFamilyHistorySave = new Api<IModel>(this.http, this.apiUrl + 'v1/save-and-update/user-family-history');
    UserFamilyHistoryRetrieve = new Api<IModel>(this.http, this.apiUrl + 'v1/retrieve/user-family-history');
    UserFamilyHistoryDelete = new Api<IModel>(this.http, this.apiUrl + 'v1/delete/user-family-history');

    //current medicine
    CurrentMedicineSave = new Api<IModel>(this.http, this.apiUrl + 'v1/save-and-update/user-current-medicine');
    CurrentMedicineRetrieve = new Api<IModel>(this.http, this.apiUrl + 'v1/retrieve/user-current-medicine');
    CurrentMedicineDelete = new Api<IModel>(this.http, this.apiUrl + 'v1/delete/user-current-medicine');

    //In-Application Help
    RetrieveTopicByUserRole = new Api<IModel>(this.http, this.apiUrl + 'v1/retrive/all-topic-by-role');
    RetrieveSubTopic = new Api<IModel>(this.http, this.apiUrl + 'v1/retrive/all-sub-topic-by-topic');
    RetrieveAllSubTopicImage = new Api<IModel>(this.http, this.apiUrl + 'v1/retrive-all-sub-topic-images');
    ImageDownload = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/download-document');

    // app/issues/843
    SavePrescriptionTemplate = new Api<IModel>(this.http, this.apiUrl + 'v1/prescriptionTemplate/savePrescriptionTemplate');
    GetAllUsersPrescriptionTemplateByRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/prescriptionTemplate/getPrescriptionTemplateByTemplateRefNo');
    GetAllPrescriptionTemplatesForHospitalByRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/prescriptionTemplate/getAllPrescriptionTemplatesByRefNo');

    //Working on app/issues/937
    GetVaccinationListByUserRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getVaccinationList');
    //End Working on app/issues/937

    // Working on app/issues/861
    GetQueryByCategory = new Api<IModel>(this.http, this.apiUrl + 'v1/query/getQueryBycategory');
    // end Working on app/issues/861

    //working on system admin issue[set password for a user] - [https://gitlab.com/sbis-poc/app/issues/1008]
    GetUserDetailsBySearchData = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/retrieve-user-details-by-search-query');
    SetPasswordBySysAdmin = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/set-password-by-sys-admin');
    SetResetPasswordVerificationURl = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/set-reset-verification-url');

    //quick add
    GetMenuStructureForQuickAdd = new Api<IModel>(this.http, this.apiUrl + 'v1/get-menu-structure-for-quick-add-flag');

    // Working on app/issues/1014
    GetFrequentDiagnosisList = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/get-frequent-diagnosis-list');

    // Working on app/issues/990
    GetBillingPlanList = new Api<IModel>(this.http, this.apiUrl + 'v1/billing/get-billing-plans');
    GetIpAddress = new Api<IModel>(this.http, this.apiUrl + 'v1/get-client-ip-address');
    SaveBillingPlanForDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-billing-plan');
    SaveDoctorContract = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-contract');
    GetMyBillingPlan = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/my-billing-plan');
    GetMyBills = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/my-bills');
    GetMyBillDetailsView = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/my-bill-detail-view');
    GetBillingUnitList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/BILLING_UNIT');
    GenerateMyBill = new Api<IModel>(this.http, this.apiUrl + 'v1/generateMyBill');

    //End Working on app/issues/990

    GetBillingPlanListV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/billing/get-billing-plans'); //Working on app/issues/1758  

    //get calender by doctor chamber
    GetCalenderDoctorChamber = new Api<IModel>(this.http, this.apiUrl + 'v5/doctor/get-calendar-doctor-chamber');

    // Working on app/issues/1185
    GetInvoiceListByAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/invoice-list-by-appointment');
    SaveInvoiceForAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-invoice-for-appointment');
    DeleteInvoiceForAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/delete-invoice-for-appointment');
    GetChargeListByChamber = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-chamber-charge-list');
    //End Working on app/issues/1185

    //working on
    SaveSPBillingPlan = new Api<IModel>(this.http, this.apiUrl + 'v1/sp/save-billing-plan');//post call
    GetSPBillingPlan = new Api<IModel>(this.http, this.apiUrl + 'v1/sp/my-bills');//post call
    GetSPBillingPlanDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/sp/my-billing-plan');//get call
    GetSPBillingSummary = new Api<IModel>(this.http, this.apiUrl + 'v1/sp/my-billing-summary');//get call
    GetSPBillDetailsView = new Api<IModel>(this.http, this.apiUrl + 'v1/sp/my-bill-detail-view');//post call
    //end of working on 

    // Working on app/issues/1058
    FindPatientV3 = new Api<IModel>(this.http, this.apiUrl + 'v3/doctor/my-appointments');
    FindUserDetailsByAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/find-user-details-by-appointment');
    //End Working on app/issues/1058
    // /sbis-poc/app/issues/936 start
    GetQueryScenario = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/customAnalytics/fetch_query_scenario');
    FetchQueryColumnsScenarioRefNo = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/customAnalytics/fetch_query_params_by_scenario');
    FetchAllParamsDataByParam = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/customAnalytics/fetchParamValue');
    FetchCustomAnalysticResultList = new Api<IModel>(this.http, this.apiUrl + 'v1/customAnalytics/fetchResultList');
    FetchAllParamsDataForTypeAhead = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/customAnalytics/fetchParamValueBYTypeahead');
    FetchAllDoctorParamsDataForTypeAhead = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/customAnalytics/fetchParamDoctorValueBYTypeahead');


    // /sbis-poc/app/issues/936 end

    // app/issues/915
    ConfirmPendingDoctorAppointments = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/confirmPendingAppointments');
    // End app/issues/915

    // Working on app/issues/1267
    CreateBlankPrescription = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/create-blank-prescription');
    //End Working on app/issues/1267


    // Working on app/issues/1281
    GetDoctorAppointmentsV3 = new Api<IModel>(this.http, this.apiUrl + 'v3/doctor/get-doctor-appointment');
    GetAppointmentsViewByRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/get-doctor-appointment-view-by-refNo');
    // Working on app/issues/1281

    //https://gitlab.com/sbis-poc/app/issues/1120
    DeleteDocument = new Api<IModel>(this.http, this.apiUrl + 'v1/delete-document');
    //https://gitlab.com/sbis-poc/app/issues/1120

    // Working on app/issues/1323
    SavePrescriptionV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/doctor/prescription/savePrescriptionDetails');
    //End Working on app/issues/1323
    SavePrescriptionV3 = new Api<IModel>(this.http, this.apiUrl + 'v3/doctor/prescription/savePrescriptionDetails'); // app#988

    // Working on app/issues/937
    GetAllVaccineByName = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/get-all-vaccine');
    //End Working on app/issues/937

    //Working on app/issues/1424
    GetPaymentModeList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/PAYMENT_MODE');
    //End Working on app/issues/1424

    //Working on app/issues/1438
    GetIpdServiceCategories = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getIPDServiceCategories');
    GetIpdServiceDetailsByCategory = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getIPDServiceDetailsByCategory');
    DeleteIpdServiceDetailsByHospitalRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/deleteIpdServiceByHospitalRefNo');
    SaveIpdServiceDetailsByHospitalRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/saveIpdServiceByHospitalRefNo');
    GetIpdServiceListByCategory = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getIpdServiceListByCategory');
    GetIpdServiceList = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getIpdServiceList');
    //End Working on app/issues/1438

    //Working on app/issues/1429
    SaveHospitalRoom =  new Api<IModel>(this.http, this.apiUrl + "v1/room/save-room-info");
    GetAllHospitalRoomDetails =  new Api<IModel>(this.http, this.apiUrl + "v1/opd/get-hospital-room-list");
    GetRoomCategoryDetails =  new Api<IModel>(this.http, this.apiUrl + "v1/opd/get-room-category-details");
    UpdateRoomDetails =  new Api<IModel>(this.http, this.apiUrl + "v1/opd/update-room-details");
    DeleteRoom =  new Api<IModel>(this.http, this.apiUrl + "v1/opd/delete-room");
    //End Working on app/issues/1429

    GetDoctorBillingSummary = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/my-billing-summary');
    GetDoctorListByOpd=new Api<IModel>(this.http, this.apiUrl +'v1/get-doctor-list-by-opd');
    GetDoctorListByOpdV2=new Api<IModel>(this.http, this.apiUrl +'v2/get-doctor-list-by-opd');
    GetDoctorListByOpdDoctor=new Api<IModel>(this.http, this.apiUrl +'v1/get-doctor-list-by-opd-doctor');
    SaveUpdateUserVaccinationData = new Api<IModel>(this.http, this.apiUrl + 'v2/vaccine/inusers');//v1/vaccine/inusers
    GetSpecializationByOPD = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/get-specialization-list');//fetch specialization list by opd
     
    GetDepartmentList =   new Api<IModel>(this.http, this.apiUrl + 'v1/get-hospital-department-list');

    SaveInpatientAdmission = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/saveInpatientAdmission');
    FetchRoomList = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/get-room-list-by-department');
    FetchRoomListByHospital = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/get-room-list-by-hospital');
    FetchBedList = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/get-bed-list-by-room');
    BedOccupancy = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/check-bed-occupancy');

    FetchInpatientList = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/get-inpatient-list');
    FetchIndividualUsersInpatientList = new Api<IModel>(this.http, this.apiUrl + 'v1/ind/get-inpatient-list');//https://gitlab.com/sbis-poc/app/issues/1681
    GetInpatientAdmissionDetails =  new Api<IModel>(this.http,this.apiUrl + 'v2/opd/get-inpatient-admission-details');

      // Working on app/issues/1499
    GetIpdServiceBasicInfoList = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getIpdServiceListWithChargeType');
    GetIpdServiceRateByRefNoAndQuantity = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getIpdServiceRateByRefNoAndQuantity');
    GetAssociatedServiceListByServiceRefNo=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getAssociatedServiceListByServiceRefNo');
    GetInpatientBillList=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/get-inpatient-bill-list');
    SaveInpatientBill=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/savePatientInternalBillDetails');
    GetInpatientBillDetailByRefNo=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getInpatientBillDetailByRefNo');
    //End Working on app/issues/1499

    GetHospitalRoomCategoryList=new Api<IModel>(this.http, this.apiUrl + 'v1/get-hospital-category-list');
    CheckDuplicateCategory=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/check-duplicate-room-category');
    

    // Working on app/issues/1496
    GetBedChargeDetailByAdmission=new Api<IModel>(this.http, this.apiUrl + 'v2/opd/getPatientBedChargeHistoryByAdmissionRefNo');// Working on app/issues/1656
    SavePatientInvoiceByAdmission=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/savePatientInvoiceDetails');
    GetAdmissionBasicInfo=new Api<IModel>(this.http, this.apiUrl + 'v2/opd/getAdmissionBasicInfo');// Working on app/issues/1656
    GetInvoiceByAdmissionRefNo=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getInvoiceByAdmissionRefNo');
    // End Working on app/issues/1496

    GetRoomcategoryListByAdmisnRefNo=new Api<IModel>(this.http, this.apiUrl +'v1/get-room-categary-list-by-admisinrefNo');

     //  Working app/issuse/1548
     GetPaymentModeCategory = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/PAYMENT_MODE');
     SaveInPatientPayment = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/saveInPatientPayment');
     CheckInvoiceGenerationByAdmission = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/checkInvoiceGenerationByAdmission');
     GetInPatientPaymentHistory = new Api<IModel>(this.http,this.apiUrl + 'v1/opd/getInPatientPaymentHistory');
     //  End Working app/issuse/1548

     //Working on app/issues/1615
     GetOnlineConsultationDetailsByDoctorRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getOnlineConsultationDetailsByDoctorRefNo');
     //End Working on app/issues/1615

     GetInvoiceListByAppointmentRefNo=new Api<IModel>(this.http, this.apiUrl + 'v1/ipd/invoice-list-by-appointment');
     GetGroupDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/groupDetails');

    //Working on app/issues/1780
    GetOptionTypeList = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/get-attribute-by-name/OPTION_TYPE');
    SaveCustomForm  = new Api<IModel>(this.http, this.apiUrl + 'v1/common/form/save-custom-form');
    GetFormList  = new Api<IModel>(this.http, this.apiUrl + 'v1/common/form/get-form-list');
    GetCustomFormByRefNo  = new Api<IModel>(this.http, this.apiUrl + 'v1/common/form/get-custom-form-by-refno');
    SaveFilledUpForm  = new Api<IModel>(this.http, this.apiUrl + 'v1/common/form/save-filled-up-form');
    DeleteCustomForm  = new Api<IModel>(this.http, this.apiUrl + 'v1/common/form/delete-custom-form');

    GetFormListByUserRefNo  = new Api<IModel>(this.http, this.apiUrl + 'v1/common/form/get-form-list-by-userRefNo');
    GetQuestionResponseByUserRefNo  = new Api<IModel>(this.http, this.apiUrl + 'v1/common/form/get-question-response-by-userRefNo');
    //End Working on app/issues/1780
    
   
 //Working on app/issues/1656
 GetResourceListByEntity=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getResourceListByEntity');
 GetAvailabilityCalendarForResource=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getAvailabilityCalendarForResource');
 AllocateResourceSlot=new Api<IModel>(this.http, this.apiUrl + 'v1/opd/allocateResourceSlot');
 GetRoomCategoryDetailsWithBedResource=new Api<IModel>(this.http, this.apiUrl + 'v1/ipd/getRoomCategoryDetailsWithBedResource');
 GetResourceAvailablity=new Api<IModel>(this.http, this.apiUrl + 'v1/ipd/getResourceAvailablity');
 // End Working on app/issues/1656

 /*Working on #1387*/
 GetProcedureNoteByRefNo = new Api<IModel>(this.http, this.apiUrl + 'v2/inusers/get-procedure');
 /*End Working on #1387*/
 
 //save pincode
 SaveServiceProviderPincode=new Api<IModel>(this.http, this.apiUrl + 'v1/save/service-provider-pincode');
 RetrieveServiceProviderPincode=new Api<IModel>(this.http, this.apiUrl + 'v1/retrieve/service-provider-pincode');
 //end save pincode

 //app#1863
 GetFrequentFindingList  = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/get-frequent-findings-list');
 GetFrequentSymptomList  = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/get-frequent-symptoms-list');
 //End app#1863

  //Working on app/issues/1886           
  SaveUpdateDeleteHoliday = new Api<IModel>(this.http, this.apiUrl + 'v1/admin/updateHoliday');
  FetchHolidayDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/admin/fetchHoliday');
  //Working on app/issues/1886

  //Working on app/issues/1823 
  GetServiceProviderFileInfoByType =new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getFileInfoByFileType'); 
  GetDoctorHolidayListByHospitalRefNo =new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getDoctorHolidayListByHospitalRefNo');
  //Working on app/issues/1823

  GetUserAddresBtRefNoAndAddressType =new Api<IModel>(this.http, this.apiUrl +'v1/inusers/getUserAddresBtRefNoAndAddressType');

  CancelBedHistoryByAdmissionRefNo =new Api<IModel>(this.http, this.apiUrl +'v1/ipd/cancelBedHistoryByAdmissionRefNo');

  GetChatSession = new Api<IModel>(this.http, this.apiUrl + 'v1/chat/get-session');//https://gitlab.com/sbis-poc/app/-/issues/2618
  CloseChatSession = new Api<IModel>(this.http, this.apiUrl + 'v1/chat/close-session');// https://gitlab.com/sbis-poc/app/-/issues/2626
  //Working on app/issues/1615
  GetOrGenerateSessionAndTokenForVideoChat = new Api<IModel>(this.http, this.apiUrl + 'v1/appointment/video-chat/create-session');
  SaveStartSessionForVideoChat = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/video-chat/save-start-session');
  EndSessionForVideoChat = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/video-chat/end-session');
  ChatVerifyLinkForIndividualUser = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/chat/verify-link');//to verify chat link.
  //End Working on app/issues/1615

  //Working on app/issues/1970
  CurrentMedicineListIPD = new Api<IModel>(this.http, this.apiUrl + 'v1/ipd/get-current-medicines');
  DiscontinueCurrentMedicine = new Api<IModel>(this.http, this.apiUrl + 'v1/ipd/discontinue-current-medicines');
  GetPastPrescriptionV5 = new Api<IModel>(this.http, this.apiUrl + 'v5/doctor/prescription/getPastPrescription');// Working on app/issue/1970
  GetPrescriptionByAdmisionOrAppointmentAndPrescriptionRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/getPrescriptionByAdmisionOrAppointmentAndPrescriptionRefNo');// Working on app/issue/1970
   //End Working on app/issues/1970

   CheckOverlappingDoctorAppointmentV3 = new Api<IModel>(this.http, this.apiUrl + 'v3/doctor/checkOverlappingDoctorAppointment'); // Working on app/issue/2086

   // Working on app/issues/2135
   GetFrequentAdviceList = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/get-frequent-advice-list');
   GetFrequentVaccineList = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/prescription/get-frequent-vaccine-list');
   GetHospitalListByDoctorRefNo=new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/getHospitalListByDoctorRefNo'); // Working on app/issue/2009
  //doc permission
  GetPermission = new Api<IModel>(this.http, this.apiUrl + 'v1/entity/get-authorization');
  SetPermission = new Api<IModel>(this.http, this.apiUrl + 'v1/entity/save-authorization');
  RevokePermission = new Api<IModel>(this.http, this.apiUrl + 'v1/entity/revoke-authorization');
  //end of doc permission
 //get prescriptions by medicine name
 GetPrescriptionsByMedicineName=new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-all-prescriptions');
 GetUploadedPrescriptions=new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-all-uploaded-prescriptions');
 //end of get prescriptions by medicine name

 SavePrintGenericNameFlag = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/save-print-generic-name-flag'); // Working on app/issues/2135
 UpdateSpDocumentMapWithoutFile=new Api<IModel>(this.http, this.apiUrl + 'v1/sp/updateSpDocumentMapWithoutFile'); // Working on app/issue/2042

 ChangeDoctorByAdmissionRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/ipd/admission/change-doctor'); // Working on app/issues/2227
 ChangeBedByAdmissionRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/ipd/admission/change-bed'); // Working on app/issues/2228
 DeleteDoctorHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/ipd/admission/delete-doctor-history'); // Working on app/issues/2227
 DeleteBedHistory = new Api<IModel>(this.http, this.apiUrl + 'v1/ipd/admission/delete-bed-history'); // Working on app/issues/2228
 GetDefaultParamsByQueryId =new Api<IModel>(this.http, this.apiUrl + "gen/v1/query/getDefaultParamsByQueryId"); // Working on app/issues/2202

 GetAssociateUserByRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/inusers/get-associated-user-info'); // Working on app/issues/2236

 GetIpdServiceListTypeAhead = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getIpdServices'); // Working on app/issues/2264
 GetIpdServiceByRefNo = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/getIpdServiceByRefNo'); // Working on app/issues/2264

 GetRegistrationTxnDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/get-registration-txn-details-by-appointment'); // Working on app/issues/2264
 CheckHolidayByAppointmentDateAndChamber = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/checkHolidayByAppointmentDateAndChamber');// Working on app/issues/2355

 CheckOverlappingDoctorAppointmentV4 = new Api<IModel>(this.http, this.apiUrl + 'v4/doctor/checkOverlappingDoctorAppointment'); // Working on app/issue/2399
 UpdateAppointment = new Api<IModel>(this.http, this.apiUrl + 'v1/doctor/update-appointment'); // Working on app/issue/2399

 RetrieveAllTestFor = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/retrieve/test-for');

 GetIpdFeesOfDoctor = new Api<IModel>(this.http, this.apiUrl + 'v1/opd/get-ipd-fees-of-doctor');//app#2328

 // Working on app/issue/2471
 SaveOperationTheaterDetails    =new Api<IModel>(this.http, this.apiUrl +"v1/ipd/saveOperationTheaterDetails");
 GetAllOperationTheaterDetails  =new Api<IModel>(this.http, this.apiUrl +"v1/ipd/getAllOperationTheaterDetails");
 DeleteOperationTheaterDetails  =new Api<IModel>(this.http, this.apiUrl +"v1/ipd/deleteOperationTheaterDetails");
 // End Working on app/issue/2471

 CurrentMedicineListIPDV2 = new Api<IModel>(this.http, this.apiUrl + 'v2/ipd/get-current-medicines'); //app#2445

 GetOnlineDoctors = new Api<IModel>(this.http,this.apiUrl + 'gen/v1/doctor/search-online-doctor'); //for online doctors

 GetOtherPrescriptionsOfPatient = new Api<IModel>(this.http, this.apiUrl + 'v1/retrive-prescriptions-by-userref');//query param == individual user number
 GetOtherTestReportOfPatient = new Api<IModel>(this.http,this.apiUrl + 'v1/retrive-testreports-by-userref');//query param == individual user number

 //payee account
 GetPayeeAccountDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/retrieve/payee-acn-details');
 DeletePayeeAccountDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/delete/payee-acn-details');
 SavePayeeAccountDetails = new Api<IModel>(this.http, this.apiUrl + 'v1/save-and-update/payee-acn-details');
 FileDownload = new Api<IModel>(this.http, this.apiUrl + 'gen/v1/download-document');

}

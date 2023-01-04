export class GetSet {
    private static appoinment = null;
    private static address = null;
    private static cartReferenceNumber = null;
    private static placeOrderData = null;
    private static transactionType = null; 
    private static appoinmentPaymentData = null;
    private static prescriptionPk = null;
    private static orderMedicinePage = null;
    private static orderMedicineQuery = null;
    private static myOrderDetails = null;
    private static currentAddress = null;
    private static reOrderDetails = null;
    private static myPatientDetails = null;
    private static peerConsultingCaseDetails = null;
    private static peerConsultingInvitationLogin = null;
    private static previousAddressForReorderMed = null;
    private static minorUser = null;
    private static minorCount = null;
    private static medicineDetails = null;
    private static orderMedicineLabel = null;
    private static prescriptionPreviewFromOrderMedicine = null;
    private static diagnostics = null;
    private static triggeringActionType = null;
    private static diagnosticsResp = null;
    private static requisitionRefNo = null;
    private static diagnosticsFromPrescription = null;
    private static firebaseDbConn = null;
    private static ratingFor = null;
    private static diagnosticsQuery = null;
    private static docReferralInvitationAcceptDetails = null;
    private static advancePay = null;
    private static patientDetailsByDoctor = null;
    private static notificationData = null;
    private static appointmentState = null;
    private static confirmationInfo = null;
    private static medicalFindingsDetailsForLabAdmin = null;
    private static saveDelivery = null;
    private static triggerPkForLab = null;
    private static retrieveOrderListForDelivery = null;
    private static isLabOrderSendReport = null;
    private static paymentRetryBoolean = null;
    private static appointmentResp = null;
    private static addUSerBoolean = null;
    private static addAssistantBoolean = null;
    private static admission = null;
    private static admissionRefNo = null;
    private static sessionExpireBoolean = null;
    private static onlineConsultationBoolean = null;
    private static videoChatData = null;
    private static videoChatBoolean = null;
    private static doctorSearchDitails = null;
    private static hospitalBoolean = null;
    private static reBookData = null;

    private static searchPagelogoName = null;

    public static setFirebaseDbConn(firebaseDbConn) {
        this.firebaseDbConn = firebaseDbConn;
    }
    public static getFirebaseDbConn() {
        return this.firebaseDbConn;
    }

    public static setCurrentAddress(currentAddress) {
        this.currentAddress = currentAddress;
    }
    public static getCurrentAddress(){
        return this.currentAddress;
    }

    public static setAppoinment(appoinment) {
        this.appoinment = appoinment;
    }

    public static getAppoinment() {
        return this.appoinment;
    }

    public static setAddress(address) {
        this.address = address;
    }

    public static getAddress() {
        return this.address;
    }

    public static setCartRefNumber(cartReferenceNumber) {
        this.cartReferenceNumber = cartReferenceNumber
    }

    public static getCartRefNumber() {
        return this.cartReferenceNumber;
    }

    public static setPlaceOrderData(placeOrderData) {
        this.placeOrderData = placeOrderData;
    }

    public static getPlaceOrderData() {
        return this.placeOrderData;
    }

    public static setTransactionType(transactionType) {
        this.transactionType = transactionType;
    }

    public static getTransactionType() {
        return this.transactionType;
    }

    public static setAppointmentPaymentData(appoinmentPaymentData) {
        this.appoinmentPaymentData = appoinmentPaymentData
    }

    public static getAppointmentPaymentData() {
        return this.appoinmentPaymentData;
    }

    public static setPrescriptionPk(prescriptionPk) {
        this.prescriptionPk = prescriptionPk;
    }

    public static getPrescriptionPk() {
        return this.prescriptionPk;
    }
    
    public static setOrderMedicine(orderMedicinePage) {
        this.orderMedicinePage = orderMedicinePage;
    }
    public static getOrderMedicine() {
        return this.orderMedicinePage;
    }

    public static setOrderMedicineQuery(orderMedicineQuery) {
        this.orderMedicineQuery = orderMedicineQuery;
    }
    public static getOrderMedicineQuery() {
        return this.orderMedicineQuery;
    }
    public static setMyOrderDetails(myOrderDetails) {
        this.myOrderDetails = myOrderDetails;
    }
    public static getMyOrderDetails() {
        return this.myOrderDetails;
    }
    public static setReOrderDetails(reOrderDetails) {
        this.reOrderDetails = reOrderDetails;
    }
    public static getReOrderDetails() {
        return this.reOrderDetails;
    }
    public static setPatientDetails(myPatientDetails) {
        this.myPatientDetails = myPatientDetails;
    }
    public static getPatientDetails() {
        return this.myPatientDetails;
    }
    public static setPeerConsultingCaseDetails(peerConsultingCaseDetails) {
        this.peerConsultingCaseDetails = peerConsultingCaseDetails;
    }
    public static getPeerConsultingCaseDetails() {
        return this.peerConsultingCaseDetails;
    }

    public static setPeerConsultingInvitationLogin(peerConsultingInvitationLogin) {
        return this.peerConsultingInvitationLogin = peerConsultingInvitationLogin;
    }

    public static getPeerConsultingInvitationLogin() {
        return this.peerConsultingInvitationLogin;
    }

    public static setPreviousAddressForReorderMed(previousAddressForReorderMed){
        return this.previousAddressForReorderMed =  previousAddressForReorderMed;
    }
    public static getPreviousAddressForReorderMed(){
        return this.previousAddressForReorderMed;
    }

    public static setMinorUser(minorUser) {
        return this.minorUser = minorUser;
    }
    public static getMinorUser() {
        return this.minorUser;
    }

    public static setMinorCount(minorCount) {
        return this.minorCount = minorCount;
    }
    public static getMinorCount() {
        return this.minorCount;
    }

    public static setMedicineDetails(medicineDetails) {
        this.medicineDetails = medicineDetails;
    }
    public static getMedicineDetails() {
        return this.medicineDetails;
    }

    public static setOrderMedicineLabel(orderMedicineLabel) {
        this.orderMedicineLabel = orderMedicineLabel;
    }
    public static getOrderMedicineLabel() {
        return this.orderMedicineLabel;
    }

    public static setPrescriptionPreviewFromOrderMedicine(prescriptionPreviewFromOrderMedicine) {
        this.prescriptionPreviewFromOrderMedicine = prescriptionPreviewFromOrderMedicine;
    }
    public static getPrescriptionPreviewFromOrderMedicine() {
        return this.prescriptionPreviewFromOrderMedicine;
    }

    public static setDiagnostics(diagnostics) {
        this.diagnostics = diagnostics;
    }
    public static getDiagnostics() {
        return this.diagnostics;
    }
    public static setTriggeringActionType(triggeringActionType) {
        this.triggeringActionType = triggeringActionType;
    }
    public static getTriggeringActionType() {
        return this.triggeringActionType;
    }

    public static setDiagnosticsResp(diagnosticsResp) {
        this.diagnosticsResp = diagnosticsResp;
    }
    public static getDiagnosticsResp() {
        return this.diagnosticsResp;
    }

    public static setRequisitionRefNo(requisitionRefNo) {
        this.requisitionRefNo = requisitionRefNo;
    }
    public static getRequisitionRefNo() {
        return this.requisitionRefNo;
    }

    public static setDiagnosticsFromPrescription(diagnosticsFromPrescription) {
        this.diagnosticsFromPrescription = diagnosticsFromPrescription;
    }
    public static getDiagnosticsFromPrescription() {
        return this.diagnosticsFromPrescription;
    }
    public static setRatingFor(ratingFor) {
        this.ratingFor = ratingFor;
    }
    public static getRatingFor() {
        return this.ratingFor;
    }
    public static setDiagnosticsQuery(diagnosticsQuery) {
        this.diagnosticsQuery = diagnosticsQuery;
    }
    public static getDiagnosticsQuery() {
        return this.diagnosticsQuery;
    }

    public static setDocReferralInvitationAcceptDetails(docReferralInvitationAcceptDetails) {
        this.docReferralInvitationAcceptDetails = docReferralInvitationAcceptDetails;
    }
    public static getDocReferralInvitationAcceptDetails() {
        return this.docReferralInvitationAcceptDetails;
    }

    public static setAdvancePay(advancePay) {
        this.advancePay = advancePay;
    }
    public static getAdvancePay() {
        return this.advancePay;
    }

    public static setPatientDetailsByDoctor(patientDetailsByDoctor) {
        this.patientDetailsByDoctor = patientDetailsByDoctor;
    }
    public static getPatientDetailsByDoctor() {
        return this.patientDetailsByDoctor;
    }

    public static setNotificationFirebaseData(notificationData) {
        this.notificationData = notificationData;
    }
    public static getNotificationFirebaseData() {
        return this.notificationData;
    }

    public static setAppointmentState(appointmentState) {
        this.appointmentState = appointmentState;
    }
    public static getAppointmentState() {
        return this.appointmentState;
    }

    public static setConfirmationInfo(confirmationInfo) {
        this.confirmationInfo = confirmationInfo;
    }
    public static getConfirmationInfo() {
        return this.confirmationInfo;
    } 

    public static setMedicalFindingsDetailsForLabAdmin(medicalFindingsDetailsForLabAdmin) {
        this.medicalFindingsDetailsForLabAdmin = medicalFindingsDetailsForLabAdmin;
    }
    public static getMedicalFindingsDetailsForLabAdmin() {
        return this.medicalFindingsDetailsForLabAdmin;
    }

    public static setSaveDelivery(saveDelivery) {
        this.saveDelivery = saveDelivery;
    }
    public static getSaveDelivery() {
        return this.saveDelivery;
    }

    public static setTriggerPkForLab(triggerPkForLab) {
        this.triggerPkForLab = triggerPkForLab;
    }
    public static getTriggerPkForLab() {
        return this.triggerPkForLab;
    }

    public static setRetrieveOrderListForDelivery(retrieveOrderListForDelivery) {
        this.retrieveOrderListForDelivery = retrieveOrderListForDelivery;
    }
    public static getRetrieveOrderListForDelivery() {
        return this.retrieveOrderListForDelivery;
    }

    public static setIsLabOrderSendReport(isLabOrderSendReport) {
        this.isLabOrderSendReport = isLabOrderSendReport;
    }
    public static getIsLabOrderSendReport() {
        return this.isLabOrderSendReport;
    }

    public static setPaymentRetryBoolean(paymentRetryBoolean) {
        this.paymentRetryBoolean = paymentRetryBoolean;
    }
    public static getPaymentRetryBoolean() {
        return this.paymentRetryBoolean;
    }

    public static setAppointmentResp(appointmentResp) {
        this.appointmentResp = appointmentResp;
    }
    public static getAppointmentResp() {
        return this.appointmentResp;
    }

    public static setAddAnotherUserBoolean(addUSerBoolean) {
        this.addUSerBoolean = addUSerBoolean;
    }
    public static getAddAnotherUserBoolean() {
        return this.addUSerBoolean;
    }

    public static setAddAnotherAssistantBoolean(addAssistantBoolean) {
        this.addAssistantBoolean = addAssistantBoolean;
    }
    public static getAddAnotherAssistantBoolean() {
        return this.addAssistantBoolean;
    }
    public static setAdmission(admission) {
        this.admission = admission;
    }

    public static getAdmission() {
        return this.admission;
    }
    public static setAdmissionRefNo(admissionRefNo) {
        this.admissionRefNo = admissionRefNo;
    }
    public static getAdmissionRefNo() {
        return this.admissionRefNo;
    }

    public static setSessionExpireBoolean(sessionExpireBoolean) {
        this.sessionExpireBoolean = sessionExpireBoolean;
    }
    public static getSessionExpireBoolean() {
        return this.sessionExpireBoolean;
    }

    public static setOnlineConsultationBoolean(onlineConsultationBoolean) {
        this.onlineConsultationBoolean = onlineConsultationBoolean;
    }
    public static getOnlineConsultationBoolean() {
        return this.onlineConsultationBoolean;
    }

    public static setVideoChatData(videoChatData) {
        this.videoChatData = videoChatData;
    }
    public static getVideoChatData() {
        return this.videoChatData;
    }

    public static setVideoChatBooleanFromRazorPay(videoChatBoolean) {
        this.videoChatBoolean = videoChatBoolean;
    }
    public static getVideoChatBooleanFromRazorPay() {
        return this.videoChatBoolean;
    }

    public static setDoctorSearchDetails(doctorSearchDitails) {
        this.doctorSearchDitails = doctorSearchDitails;
    }
    public static getDoctorSearchDetails() {
        return this.doctorSearchDitails;
    }

    public static setSearchPagelogoName(searchPagelogoName) {
        this.searchPagelogoName = searchPagelogoName;
    }
    public static getSearchPagelogoName() {
        return this.searchPagelogoName;
    }

    public static setHospitalBoolean(hospitalBoolean) {
        this.hospitalBoolean = hospitalBoolean;
    }
    public static getHospitalBoolean() {
        return this.hospitalBoolean;
    }

    public static setReBookData(reBookData) {
        this.reBookData = reBookData;
    }
    public static getReBookData() {
        return this.reBookData;
    }
}
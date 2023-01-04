import { Component, OnInit } from '@angular/core';
import { ServiceProviderService } from '../service-provider.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { ToastService } from 'src/app/core/services/toast.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CommonService } from '../../doctor/services/commonService'
import { DoctorService } from '../../doctor/doctor.service';// Working on app/issues/1548
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-inpatient-generate-invoice',
  templateUrl: './inpatient-generate-invoice.component.html',
  styleUrls: ['./inpatient-generate-invoice.component.css'],

})
export class InpatientGenerateInvoiceComponent implements OnInit {

  admissionRefNo:string;
  currentUser:any;
  inpatientInvoiceForm: FormGroup;
  isSubmitted:boolean=false;
  bedChargeList:any=[]
  previousBills:any=[];
  totalInvoiceAmount:number=0;
  admitedPatientDetails:any={'patientName':"","bedNo":"","roomNo":"","gender":"","age":""};
  ipdServiceList:any=[];
  associatedServiceList:any=[];
  temporaryBillDetail:any=[];
  existingInvoiceDetails:any;
  // Working on app/issues/1548
  advancePaymentList:any=[]; 
  outstandingAmount:number=0;
  paymentModeCategories:any=[];
  // End Working on app/issues/1548
  manuallyAmountChanged:any=null; // Working on app/issues/2211
  cancelledBedHistories:any=[];
  dtFormat: any;
  // Working on app/issues/2202
  paymentDetailsView: boolean = false;
  paymentDetailsSection: boolean = false; 
  refundDetailsSection: boolean = false;
  // End Working on app/issues/2202
  constructor(private serviceProviderService: ServiceProviderService,
    private broadcastService: BroadcastService,
    private fb: FormBuilder,
    private toastService: ToastService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService:CommonService,
    private doctorService: DoctorService // Working on app/issues/1548
    ) { }

  ngOnInit() {
    this.admissionRefNo=this.route.snapshot.paramMap.get('admissionRefNo');
    this.broadcastService.setHeaderText("GENERATE INVOICE");
    this.currentUser = JSON.parse(localStorage.getItem('user'));
    this.getAdmissionBasicInfo(); 
    this.createInPatientInvoiceForm();   
    this.getDoctorName(); //app#2328
    this.inpatientInvoiceForm.patchValue({
      admissionRefNo: this.admissionRefNo
     });

     let requestQuery={
      admissionRefNo: this.admissionRefNo
     }
     
    this.serviceProviderService.getInvoiceByAdmissionRefNo(requestQuery).subscribe((res) => {
      this.existingInvoiceDetails= res.data;console.log("existingInvoiceDetails:",res.data)
      if(this.existingInvoiceDetails.invoiceNo!=null){
        for(let bedCharge of this.existingInvoiceDetails.bedHistoryDetail){
          this.addBedHistoryForm();
          this.addBedChargeDetailToForm(this.bedHistoryDetail.length-1,bedCharge);
        }

        for(let billDetail of this.existingInvoiceDetails.invoiceDetailList){
          this.addBillDetailForm();
         this.addBillDetailToForm(this.invoiceDetailList.length-1,billDetail);
        }

        //app#2328
        for(let fees of this.existingInvoiceDetails.ipdFeesDetail){
          this.addIpdFeesDetailForm();
         this.addIpdFeesDetailToForm(this.ipdFeesDetail.length-1,fees);
        }

        this.inpatientInvoiceForm.patchValue({
          invoiceNo:this.existingInvoiceDetails.invoiceNo,
          discountDescription:this.existingInvoiceDetails.discountDescription,
          discountAmount:this.existingInvoiceDetails.discountAmount*(-1)
        });
        if(this.existingInvoiceDetails.paymentList!=null)
        this.advancePaymentList=this.existingInvoiceDetails.paymentList;
        this.calculateTotalInvoiceAmount();
        /* this.temporaryBillDetail=this.inpatientInvoiceForm.value.invoiceDetailList */
        console.log("FORM:",this.inpatientInvoiceForm)
      }
       else{        
        this.getInpatientBillList();
        this.getBedChargeDetailByAdmission();
        this.getInPatientPaymentHistoryByAdmission();
        this.addIpdFeesDetailForm();//app#2328
      } 
      
      
    },(error) => {
      ;
     });
     
     this.getPaymentModeCategory(); 
     this.dtFormat = environment.DATE_FORMAT;
  }

  navigateToAdmissionDetails(){
    this.router.navigate(['opd/inpatient-summary']);
  }

  createInPatientInvoiceForm() { // Used to create basic IPD Form
    this.isSubmitted=false;    
    let invoiceDetailList: FormGroup[] = [];
    let bedHistoryDetail: FormGroup[] = [];
    let ipdFeesDetail: FormGroup[] = []; //app#2328
    
    this.inpatientInvoiceForm = this.fb.group({
      invoiceNo:null,      
      admissionRefNo: [null],
      paymentDetail:this.fb.group({
        txnTypeRefNo: this.admissionRefNo,
        paymentDescription: "FINAL PAYMENT",
        amount: [null, Validators.required],
        paymentMode : ["Cash", Validators.required],
        cardNo: [null],
        txnType: ["ADMISSION"],
        paymentType:["FINAL"]
      }),
      hospitalRefNo: [null],
      doctorRefNo: [null],
      totalAmount:[null],
      invoiceDate:[null], 
      discountDescription:null,
      discountAmount:null,
      invoiceDetailList: this.fb.array(invoiceDetailList),
      bedHistoryDetail:this.fb.array(bedHistoryDetail),
      outstandingAmount:null, // Working on app/issues/1548
      ipdFeesDetail:this.fb.array(ipdFeesDetail),//app#2328
    });

  }


  createBillDetailForm(): FormGroup { // This method is Used to add bill Detail form    
    return this.fb.group({ 
      serviceName: [null, Validators.required],
      serviceRefNo: [null, Validators.required],
      usage: null,
      unit: null,
      amount: [null, Validators.required],
      invoiceDetailPk:[null] ,
      hours:null,
      minutes:null,
      serviceType:null,  
      rateType:['FIX'],
      intBillPk:null,
      status:"NRM",
      intBillDetailsPk:null,
      usageDate:new Date(), // Working on app/issue/2386
      itemCode:null // Working on app/issue/2403
    });
  }

  createBedHistoryForm(): FormGroup { // This method is Used to add Bed history form    
    return this.fb.group({ 
      bedNo: [null, Validators.required],
      bedRefNo: [null, Validators.required],     
      startDate: null,
      endDate: null,
      bedChargeStandard:null,
      bedChargePerDay: [null, Validators.required],
      noOfDays:[null, Validators.required] ,
      totalAmount:null,
      bedHistoryPk:null,
      invoiceDetailPk:null,
      status:"NRM",
      bedInfo:null
      
    });
  }

  addBedHistoryForm(){
    this.bedHistoryDetail.push(this.createBedHistoryForm());
  }

  get bedHistoryDetail(): FormArray { // Used to get bill Detail form from main form
    return this.inpatientInvoiceForm.get('bedHistoryDetail') as FormArray;
  }


  addBillDetailForm(){
    this.invoiceDetailList.push(this.createBillDetailForm());
  }
  
  get invoiceDetailList(): FormArray { // Used to get bill Detail form from main form
    return this.inpatientInvoiceForm.get('invoiceDetailList') as FormArray;
  }


  getBedChargeDetailByAdmission(){
       
    let requestQuery={
      admissionRefNo:this.admissionRefNo
    }
   
    this.serviceProviderService.getBedChargeDetailByAdmission(requestQuery).subscribe((res) => {
      this.bedChargeList = res.data;
      
      for(let bedCharge of this.bedChargeList){
        this.addBedHistoryForm();
        this.addBedChargeDetailToForm(this.bedHistoryDetail.length-1,bedCharge);
      }
      
      
      
    },(error) => {
      ;
     });
  }

  addBedChargeDetailToForm(index,bedChargeDetail){   
    console.log("bedChargeDetail::",bedChargeDetail);    
    this.bedHistoryDetail.controls[index].patchValue({
      bedNo: bedChargeDetail.bedNo,
      bedRefNo: bedChargeDetail.bedRefNo,     
      startDate:new Date(bedChargeDetail.startDate),
      endDate:bedChargeDetail.endDate==null?null:new Date(bedChargeDetail.endDate),
      bedChargeStandard:bedChargeDetail.bedChargeStandard,
      bedChargePerDay:bedChargeDetail.bedChargePerDay,
      noOfDays:bedChargeDetail.noOfDays,
      bedHistoryPk:bedChargeDetail.bedHistoryPk,
      invoiceDetailPk:bedChargeDetail.invoiceDetailPk,
      totalAmount:this.calculateBedChargeAmount(bedChargeDetail),
      bedInfo: bedChargeDetail.roomCategory+"/"+bedChargeDetail.roomNo+"/"+bedChargeDetail.bedNo
   
    });
    this.calculateTotalInvoiceAmount()
  }

  calculateBedChargeAmount(bedChargeDetail){
    return bedChargeDetail.bedChargeStandard*bedChargeDetail.noOfDays;
  }

  getInpatientBillList(){
    let requestQuery={
      admissionRefNo:this.admissionRefNo,
      isBillDetailsRequired:true,
    }
    this.serviceProviderService.getInpatientBillList(requestQuery).subscribe((res) => {
      this.previousBills=res.data
      for(let bill of this.previousBills){      
        for(let billDetail of bill.billDetailList){
          this.addBillDetailForm();
          billDetail['billDate']=bill.billDate; // Working on app/issue/2414
         this.addBillDetailToForm(this.invoiceDetailList.length-1,billDetail);
        }
        
      }    
      if(this.previousBills.length==0)
        this.addBillDetailForm();
      else
      this.calculateTotalInvoiceAmount();
      
      
    },(error) => {
     
     });

  }

  addBillDetailToForm(index,billDetail){   
    let hours:number=null;
    let minutes:number=null;
    if(billDetail.usage!=null)
    {
      hours=Math.floor(billDetail.usage/60);
      minutes=billDetail.usage-(hours*60);
    }   
    this.invoiceDetailList.controls[index].patchValue({ 
      serviceName:billDetail.serviceName,
      serviceRefNo: billDetail.serviceRefNo,
      usage: billDetail.usage,
      unit: billDetail.unit,
      amount: billDetail.amount,
      invoiceDetailPk:billDetail.invoiceDetailPk ,
      hours:hours,
      minutes:minutes,  
      rateType:billDetail.rateType,
      serviceType:billDetail.serviceType==null?billDetail.category:billDetail.serviceType,
      status:billDetail.status,
      intBillPk:billDetail.intBillPk,
      intBillDetailsPk:billDetail.detailPk,
      usageDate:billDetail.usageDate==null?new Date(billDetail.billDate):new Date(billDetail.usageDate), // Working on app/issue/2386 // Working on app/issue/2414
      itemCode:billDetail.usageDate==null?"":billDetail.itemCode // Working on app/issue/2403

    });
  }

  saveInPatientInvoice(){
    this.calculateTotalInvoiceAmount();
     for(let i=0;i<this.temporaryBillDetail.length;i++){
      //this.inpatientInvoiceForm.value.invoiceDetailList.push(tempBill)
      this.invoiceDetailList.value.push(this.temporaryBillDetail[i]);
    }

    for(let i=0;i<this.cancelledBedHistories.length;i++){      
      this.bedHistoryDetail.value.push(this.cancelledBedHistories[i]);
    }
    
    // Working on app/issues/2211
    if(this.manuallyAmountChanged!=null){
      this.inpatientInvoiceForm.patchValue({        
        paymentDetail:{
          amount:this.manuallyAmountChanged
        }
      });
    }
    // End Working on app/issues/2211

  
    if(this.inpatientInvoiceForm.value.invoiceNo==null){
      if(confirm("You are going to discharge this patient. Are you sure?")){
        console.log("INVOICE FORM:",this.inpatientInvoiceForm.value);

        this.serviceProviderService.saveInPatientInvoice(this.inpatientInvoiceForm.value).subscribe((res) => {
          if(res.status==2000){
            // this.toastService.showI18nToast("Invoice Saved Successfully", 'success');
            this.generateReport(res.data.invoiceNo);
            this.navigateToAdmissionDetails();
          }
          
          else
          if(res.status==500)
          this.toastService.showI18nToast("Invoice Saved Failed", 'error');
          
        },(error) => {
         
         }); 
      }
    }
    else {
      console.log("INVOICE FORM:",this.inpatientInvoiceForm.value);

      this.serviceProviderService.saveInPatientInvoice(this.inpatientInvoiceForm.value).subscribe((res) => {
        if(res.status==2000){
          // this.toastService.showI18nToast("Invoice Saved Successfully", 'success');
          this.generateReport(res.data.invoiceNo);
          this.navigateToAdmissionDetails();
        }
        
        else
        if(res.status==500)
        this.toastService.showI18nToast("Invoice Saved Failed", 'error');
        
      },(error) => {
       
       }); 
    }

    
  }

  calculateTotalInvoiceAmount(){
    this.totalInvoiceAmount=0;
    for(let i=0;i<this.invoiceDetailList.length;i++){
      if(this.invoiceDetailList.controls[i].value.status=="NRM"){
        let detailCharge=parseInt(this.invoiceDetailList.controls[i].value.amount);
        if(isNaN(detailCharge)) detailCharge=0;
        this.totalInvoiceAmount=this.totalInvoiceAmount+detailCharge
      }
    }
    for(let k=0;k<this.bedHistoryDetail.length;k++){
      let bedCharge=parseInt(this.bedHistoryDetail.controls[k].value.totalAmount);
      if(isNaN(bedCharge)) bedCharge=0;
      this.totalInvoiceAmount=this.totalInvoiceAmount+bedCharge;     
    }

    //app#2328
    for(let k=0;k<this.ipdFeesDetail.length;k++){
      if(this.ipdFeesDetail.controls[k].value.status=="NRM"){
        let ipdCharge=parseInt(this.ipdFeesDetail.controls[k].value.amount);
        if(isNaN(ipdCharge)) ipdCharge=0;
        this.totalInvoiceAmount=this.totalInvoiceAmount+ipdCharge; 
      }    
    }
    //End app#2328

    let discountAmount=parseInt(this.inpatientInvoiceForm.value.discountAmount);
    if(isNaN(discountAmount)) discountAmount=0;
    this.totalInvoiceAmount= this.totalInvoiceAmount-discountAmount;

    
    let totalAdvancePayment:number=0;
    for(let payment of this.advancePaymentList){
      if(payment.paymentType=="REFUND"){
        totalAdvancePayment = totalAdvancePayment - payment.amount;
       }else{
        totalAdvancePayment = totalAdvancePayment + payment.amount;
       }
    }
    
    this.outstandingAmount=this.totalInvoiceAmount-totalAdvancePayment;
    // if(this.outstandingAmount<0)
    // this.outstandingAmount=0
    
    let paymentAmount:number=0;
    paymentAmount=this.outstandingAmount
   /*  if(this.outstandingAmount==0)
      paymentAmount=this.outstandingAmount
    else
     paymentAmount=this.outstandingAmount; */
         
    this.inpatientInvoiceForm.patchValue({
      totalAmount:this.totalInvoiceAmount,
      outstandingAmount: this.outstandingAmount,
      paymentDetail:{
        amount:paymentAmount<0?paymentAmount*(-1):paymentAmount
      }
    });

    if(this.refundDetailsSection){
      this.inpatientInvoiceForm.patchValue({
        
        paymentDetail:{
          amount:null
        }
      });
    }
  }

  deleteBillDetail(index){
    if(this.invoiceDetailList.controls[index].value.intBillDetailsPk==null && this.invoiceDetailList.controls[index].value.invoiceDetailPk==null){
      if(confirm("Do You Want to Delete this New Item?")){
        this.invoiceDetailList.controls.splice(index, 1);        
        this.invoiceDetailList.value.splice(index, 1); 
        this.calculateTotalInvoiceAmount();       
      }
    }
    else{
      if(confirm("Do You Want to Delete this Item?")){
        this.invoiceDetailList.controls[index].get('status').setValue("CXL")
       
       
        this.temporaryBillDetail.push(this.invoiceDetailList.controls[index].value);
        this.invoiceDetailList.controls.splice(index, 1);
        this.invoiceDetailList.value.splice(index, 1); 
        this.calculateTotalInvoiceAmount(); 

      }
    }

    
  }

  
  makeBillDetailSoftDeleteList(index){
   /*  for(let billDetail of this.temporaryBillDetail){
      if(billDetail.detailPk==this.invoiceDetailList.controls[index].value.detailPk)
        billDetail.status=this.invoiceDetailList.controls[index].value.status
    } */
    
  }

  getIpdServiceBasicInfoList(event,index){
    let requestQuery={     
      serviceName:event.query      
    }
    
    this.serviceProviderService.getIpdServiceBasicInfoList(requestQuery).subscribe((res) => {
      this.ipdServiceList = res.data;
      // Working on app/issue/2401
      this.invoiceDetailList.controls[index].patchValue({  
        serviceRefNo:null,
        unit:null,
        serviceType:"OTHER",
        itemCode:null,
        amount:null,
        usage: null,
        detailPk:null ,
        hours:null,
        minutes:null,  
        rateType:null
      });
      // End Working on app/issue/2401
     
    },(error) => {
     ;
    });
  }

  getIpdServiceRateByRefNoAndQuantity(index){

    let requestQuery={
      serviceRefNo:this.invoiceDetailList.controls[index].value.serviceRefNo,
      rateType:this.invoiceDetailList.controls[index].value.rateType,
     // Working on app/issue/1895
     hours:this.invoiceDetailList.controls[index].value.hours,
     minutes:this.invoiceDetailList.controls[index].value.minutes,
     // usage: this.calculateUsage(index),
     // End Working on app/issue/1895
      unit:this.invoiceDetailList.controls[index].value.unit
    }
    

    if(requestQuery.serviceRefNo!=null ){
     
      this.serviceProviderService.getIpdServiceRateByRefNoAndQuantity(requestQuery).subscribe((res) => {
        // Working on app/issue/2489 
        /* if(res.data.rateType=="FIX" ){// Working on app/issue/2386 
          this.addBillDetailForm()
        } */
        // End Working on app/issue/2489
        this.ipdServiceList = res.data;
        this.invoiceDetailList.controls[index].patchValue({
          amount:res.data.totalCharge
        });
        this.calculateTotalInvoiceAmount();       
      },(error) => {
        ;
       });
    }
    
  
  }

  calculateUsage(index){
    let hours=parseInt(this.invoiceDetailList.controls[index].value.hours)
    let minutes=parseInt(this.invoiceDetailList.controls[index].value.minutes)
    if(isNaN(hours)) hours = 0;
    if(isNaN(minutes)) minutes = 0;

    if((minutes>0)&& hours*60>0)  // Both Hour and Minutes Given    
      return (hours*60+minutes);

    else if((minutes<=0)) // Only Hour Given    
      return (hours*60);

    else if((minutes>0)&& hours<=0) // Only Minute Given
      return minutes;

    else if(minutes<=0 && (hours<=0)) // Neither Hour nor Minutes Given
      return 0;  
  }
  
  
  addAssociatedBillDetailToForm(index,serviceObj){
    let currentItemUnit:number=null
    if(serviceObj.rateType=="FIX" ){
      currentItemUnit=1;
    }
    this.invoiceDetailList.controls[index].patchValue({
      serviceName:serviceObj.serviceName,
      serviceRefNo: serviceObj.serviceRefNo,
      usage: null,
      unit: currentItemUnit,
      amount: null,
      invoiceDetailPk:null ,
      hours:null,
      minutes:null,  
      rateType:serviceObj.rateType
    })

    if(currentItemUnit>0)
    this.getIpdServiceRateByRefNoAndQuantity(index)
  }

  setBillDetailForm(serviceClickedEvent,index){// Used to set service reference No. into Bill Detail form
    let currentItemUnit:number=null
    if(serviceClickedEvent.rateType=="FIX"){
      currentItemUnit=1;
    }
    this.invoiceDetailList.controls[index].patchValue({  
      serviceRefNo:serviceClickedEvent.serviceRefNo,
      serviceName: serviceClickedEvent.serviceName,
      rateType:serviceClickedEvent.rateType,
      unit:currentItemUnit,
      serviceType:serviceClickedEvent.category,
      itemCode:serviceClickedEvent.itemCode==null?"":serviceClickedEvent.itemCode // Working on app/issue/2403
    });
    
    this.getIpdServiceRateByRefNoAndQuantity(index)
    let requestQuery={
      serviceRefNo:serviceClickedEvent.serviceRefNo
    }
    this.serviceProviderService.getAssociatedServiceListByServiceRefNo(requestQuery).subscribe((res) => {
      this.associatedServiceList = res.data;
      for(let associateService of this.associatedServiceList){
        this.addBillDetailForm();
        this.addAssociatedBillDetailToForm(this.invoiceDetailList.length-1,associateService);
      }
      
      
    },(error) => {
      ;
     });
    
  }

  getAdmissionBasicInfo(){
    let requestQuery={
      admissionRefNo:this.admissionRefNo
    }
    this.serviceProviderService.getAdmissionBasicInfo(requestQuery).subscribe((res) => {
      this.admitedPatientDetails.patientName=res.data.patientName
      this.admitedPatientDetails.bedNo=res.data.bedNo
      this.admitedPatientDetails.roomNo=res.data.roomNo
      this.admitedPatientDetails.gender=res.data.patientGender
      this.admitedPatientDetails.age=res.data.patientAge

    },(error) => {
      ;
     });
  }


  generateReport(invoiceNo){
    
    let payload = {
     invoiceNo:invoiceNo,
     reportId:"INPATIENT_INVOICE"
    }
    this.serviceProviderService.downloadFile(payload).subscribe(response => {
      //let blob:any = new Blob([response.blob()], { type: 'text/json; charset=utf-8' });
      //const url= window.URL.createObjectURL(blob);
      //window.open(url);
      //window.location.href = response.url;
      var fileName = invoiceNo;
      var a = document.createElement("a");
      var file = new Blob([response], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);

      var w = window.open("about:blank");

      var iframe = document.createElement('iframe');
      iframe.src = fileURL;
      iframe.focus();
      iframe.onload = function() {
        iframe.contentWindow.print();
      };

      w.document.body.appendChild(iframe);
      w.document.body.style.display = "none";




      // a.href = fileURL;
      // a.download = fileName;
      // a.click();
      // window.open(fileURL);
      // this.toastService.showI18nToast("Download successful.","success");
    })
  }


  calculateBedChargeOnNoOfDaysInput(index){
 
    let noOfDays=parseInt(this.bedHistoryDetail.controls[index].value.noOfDays);
    if(isNaN(noOfDays)) noOfDays=0;

    let totalAmount=parseInt(this.bedHistoryDetail.controls[index].value.totalAmount);
    if(isNaN(totalAmount)) totalAmount=0;

    // Working on app/issues/2029
    if(this.bedHistoryDetail.controls[index].get('totalAmount').dirty){
      if(noOfDays!=0 && totalAmount!=0){
        this.bedHistoryDetail.controls[index].patchValue({
          bedChargeStandard:totalAmount/noOfDays
        })
      }
    }
   
    // End Working on app/issues/2029
    this.bedHistoryDetail.controls[index].patchValue({
      totalAmount:noOfDays*this.bedHistoryDetail.controls[index].value.bedChargeStandard
    })
    this.calculateTotalInvoiceAmount(); // Working on app/issue/2016

  }
  // Working on app/issues/1548
  getInPatientPaymentHistoryByAdmission(){       
    let requestQuery={
      admissionRefNo:this.admissionRefNo
    }   
    this.serviceProviderService.getInPatientPaymentHistory(requestQuery).subscribe((res) => {
      this.advancePaymentList=res.data;
      this.calculateTotalInvoiceAmount();
    },(error) => {
      console.log(error);
      
     });
  }
  
  getPaymentModeCategory(){
    this.doctorService.GetPaymentModeCategory()
    .subscribe(res => {
      this.paymentModeCategories=res.masterDataAttributeValues
      

    });
  }

  generatePaymentReport(paymentRefNo){
    
    let payload = {
      paymentRefNo:paymentRefNo,
     reportId:"INPATIENT_PAYMENT_RECEIPT"
    }
    this.serviceProviderService.downloadFile(payload).subscribe(response => {
 
      var fileName = paymentRefNo;
      var a = document.createElement("a");
      var file = new Blob([response], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);

      var w = window.open("about:blank");

      var iframe = document.createElement('iframe');
      iframe.src = fileURL;
      iframe.focus();
      iframe.onload = function() {
        iframe.contentWindow.print();
      };

      w.document.body.appendChild(iframe);
      w.document.body.style.display = "none";

    })
  }
  // End Working on app/issues/1548


  deleteBedHistory(index){
    if(this.bedHistoryDetail.controls[index].value.bedHistoryPk!=null){      
      if(confirm("Do You Want to Delete this Item?")){
        this.bedHistoryDetail.controls[index].get('status').setValue("CXL");
        this.cancelledBedHistories.push(this.bedHistoryDetail.controls[index].value);
        this.bedHistoryDetail.controls.splice(index, 1);
        this.bedHistoryDetail.value.splice(index, 1); 
        this.calculateTotalInvoiceAmount(); 

      }
    }
    else{
      if(confirm("Do You Want to Delete this New Item?")){
        this.bedHistoryDetail.controls.splice(index, 1);        
        this.bedHistoryDetail.value.splice(index, 1); 
        this.calculateTotalInvoiceAmount();       
      }
    }

    
  }

  // Working on app/issue/2211

  allowManualEntryForPaymentAmount(event){  
    if(event.target.value==""){      
      this.manuallyAmountChanged=0;
    }
    else{
      this.manuallyAmountChanged=event.target.value;
    }
  }

  // Working on app/issue/2243
  savePaymentBillDetails() {   
    console.log("PAYMENT PAYLOAD::",this.inpatientInvoiceForm.value.paymentDetail);
    if(this.inpatientInvoiceForm.value.invoiceNo==null && this.inpatientInvoiceForm.value.paymentDetail.paymentType!="REFUND"){
      this.inpatientInvoiceForm.patchValue({
        paymentDetail:{        
         paymentType:"FINAL"
       }
      });
    }
    this.serviceProviderService.saveInPatientPayment(this.inpatientInvoiceForm.value.paymentDetail).subscribe(res => {
      if (res.status == 2000) {
        this.toastService.showI18nToastFadeOut("Payment saved", "success");
        this.paymentDetailsView = false;
        this.paymentDetailsSection = false;
        this.refundDetailsSection = false;
        if(res.data.txnTypeRefNo!=null)
         this.generatePaymentReport(res.data.txnTypeRefNo)
         this.getInPatientPaymentHistoryByAdmission();
      }

      else
        if (res.status == 500) {
          this.toastService.showI18nToast("Payment saved Failed", 'error');
         
        }

    }, (error) => {
      this.toastService.showI18nToast("Payment saved Failed", 'error');
    });

  }

  
  showPaymentRefundSection() {
    this.paymentDetailsView = true;
    let paymentAmount: number = 0;
    paymentAmount = this.outstandingAmount;
    if (this.outstandingAmount > 0) {
      this.paymentDetailsSection = true;
      this.refundDetailsSection = false;
      this.inpatientInvoiceForm.patchValue({
        paymentDetail:{
         amount:paymentAmount>0?paymentAmount:null,
         paymentDescription: "FINAL PAYMENT",
         paymentType:"ADDITIONAL"
       }
     });

     
    } else {
      this.refundDetailsSection = true;
      this.paymentDetailsSection = false;   
      this.inpatientInvoiceForm.patchValue({
         paymentDetail:{
          amount:paymentAmount*(-1),
          paymentDescription:null,
          paymentType:"REFUND"
        }
      });
    }
  }

  togglePaymentOrRefund() {
    let paymentAmount: number = 0;
    paymentAmount = this.outstandingAmount;
    this.paymentDetailsSection = !this.paymentDetailsSection;
    this.refundDetailsSection = !this.refundDetailsSection;
    if(this.refundDetailsSection){
      this.inpatientInvoiceForm.patchValue({
        paymentDetail:{
         amount:null,
         paymentDescription:null,
         paymentType:"REFUND"
       }
     });
    }
    else{
      this.inpatientInvoiceForm.patchValue({
        paymentDetail:{
         amount:paymentAmount>0?paymentAmount:null,
         paymentDescription: "FINAL PAYMENT",
         paymentType:"ADDITIONAL"
       }
     });
    }
    
  }
  hidePaymentDetailsSection() {
    this.paymentDetailsView = false;
  }
  /*END Payment Refund Section */


  // Working on app/issue/2402
  addNewBillItem(index,event){
    if (event.keyCode === 13)
    {
      this.addBillDetailForm()
    }
    this.getIpdServiceRateByRefNoAndQuantity(index);
  }
  // End Working on app/issue/2402

  //app#2328
  get ipdFeesDetail(): FormArray { // Used to get IPD Fee Detail form from main form
    return this.inpatientInvoiceForm.get('ipdFeesDetail') as FormArray;
  }
  createIpdFeesDetailForm(): FormGroup { // This method is Used to add IPD Fees Detail form    
    return this.fb.group({ 
      serviceName: [null, Validators.required], //Here it is Doctor name
      serviceRefNo: [null],//Here it is Doctor Ref No, if exist
      usage: [null],
      unit: [1],
      amount: [null, Validators.required],
      invoiceDetailPk:[null] ,
      hours:[null],
      minutes:[null],
      serviceType:['IPD_FEES'],  
      rateType:['FIX'],
      intBillPk:[null],
      status:"NRM",
      intBillDetailsPk:[null],
      usageDate:[new Date()],
      itemCode:[null],
      baseCharge: [null]
    });
  }

  addIpdFeesDetailToForm(index,billDetail){   
    let hours:number=null;
    let minutes:number=null;
    if(billDetail.usage!=null)
    {
      hours=Math.floor(billDetail.usage/60);
      minutes=billDetail.usage-(hours*60);
    }   
    this.ipdFeesDetail.controls[index].patchValue({ 
      serviceName:billDetail.description,
      serviceRefNo: billDetail.serviceRefNo,
      usage: billDetail.usage,
      unit: billDetail.unit,
      amount: billDetail.amount,
      invoiceDetailPk:billDetail.invoiceDetailPk ,
      hours:null,
      minutes:null,  
      rateType:billDetail.rateType,
      serviceType:billDetail.serviceType==null?billDetail.category:billDetail.serviceType,
      status:billDetail.status,
      intBillPk:billDetail.intBillPk,
      intBillDetailsPk:billDetail.detailPk,
      usageDate:billDetail.usageDate==null?new Date(billDetail.billDate):new Date(billDetail.usageDate),
      itemCode:billDetail.usageDate==null?"":billDetail.itemCode ,
      baseCharge: billDetail.amount/billDetail.unit
    });
  }

  addIpdFeesDetailForm(){
    this.ipdFeesDetail.push(this.createIpdFeesDetailForm());
  }

  cancelledFeeHistories: any = [];
  deleteFee(index){
    if(this.ipdFeesDetail.controls[index].value.bedHistoryPk!=null){      
      if(confirm("Do You Want to Delete this Fee?")){
        this.ipdFeesDetail.controls[index].get('status').setValue("CXL");
        this.cancelledFeeHistories.push(this.ipdFeesDetail.controls[index].value);
        this.ipdFeesDetail.controls.splice(index, 1);
        this.ipdFeesDetail.value.splice(index, 1); 
        this.calculateTotalInvoiceAmount(); 

      }
    }
    else{
      if(confirm("Do You Want to Delete this New Fee?")){
        this.ipdFeesDetail.controls.splice(index, 1);        
        this.ipdFeesDetail.value.splice(index, 1); 
        this.calculateTotalInvoiceAmount();       
      }
    }
  }

  calculateIpdFeesOnUnitInput(index){
 
    let unit=parseInt(this.ipdFeesDetail.controls[index].value.unit);
    if(isNaN(unit)) unit=0;

    let fee=parseInt(this.ipdFeesDetail.controls[index].value.baseCharge);
    if(isNaN(fee)) fee=0;

    // let ipdFeeStandard = 0.0;
    // if(this.ipdFeesDetail.controls[index].get('amount').dirty){
    //   if(unit!=0 && amount!=0){
    //     ipdFeeStandard=amount/unit;
    //     // this.ipdFeesDetail.controls[index].patchValue({
    //     //   bedChargeStandard:amount/unit
    //     // })
    //   }
    // }

    // if(this.ipdFeesDetail.controls[index].get('unit').dirty){
    //     if(unit!=0 && fee!=0){
    //      let baseCharge=this.ipdFeesDetail.controls[index].value.baseCharge;
    //      if(baseCharge==null){
    //       this.ipdFeesDetail.controls[index].patchValue({
    //         baseCharge:fee
    //       })
    //      }
    //      this.ipdFeesDetail.controls[index].patchValue({
    //       amount:unit*baseCharge
    //     })
         
    //     }
    //   }
    //this.ipdFee
   
   
    this.ipdFeesDetail.controls[index].patchValue({
      amount:unit*fee
    })
    this.calculateTotalInvoiceAmount(); 

  }

  doctorList: any = [];
  doctorNameList: any = [];
  doctorDetails: any = [];
  getDoctorName() {
     this.doctorList=[];
    if (this.currentUser.entityName == "HOSPITAL") {
      this.serviceProviderService.fetchDoctorListByOPD('ipd').subscribe(res => {
        if (res.status === 2000) {
          this.doctorList = res.data;         
        }
      }); 
    }
    else if (this.currentUser.entityName == "DOCTOR") {
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
  
  filteredReferralSingle(event, i) {
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
    
  }

  ipdFee: any=null;
  referredNameSelect(doctor, i) {
    this.ipdFeesDetail.controls[i].patchValue({
      serviceName: doctor.name,
      serviceRefNo: doctor.refNo
    });
   console.log(this.inpatientInvoiceForm.value);
   this.ipdFeesDetail.controls[i].patchValue({
    amount:null
  });
   let payload = {
     doctorRefNo: doctor.refNo
   }
   this.serviceProviderService.getIpdFeesOfDoctor(payload).subscribe(res => {
    if (res.status === 2000) {
      if(res.data!=null){
        this.ipdFee = res.data.amount;  
        this.ipdFeesDetail.controls[i].patchValue({
          amount:this.ipdFee,
          baseCharge: this.ipdFee,
          unit: 1
        });
        this.calculateTotalInvoiceAmount(); 
      }            
    }
  }); 
  }

  managePk(doctorName, i){
    let ipdFeesList = this.inpatientInvoiceForm.get('ipdFeesDetail') as FormArray;
    let ipdFeesDetail = ipdFeesList.controls[i] as FormGroup;
    
    if(doctorName != ipdFeesDetail.controls.serviceName.value){
      this.ipdFeesDetail.controls[i].patchValue({
        serviceRefNo: null,
        amount:null,
        baseCharge:null,
        unit: 1
      });
    
    }
    
  }

}

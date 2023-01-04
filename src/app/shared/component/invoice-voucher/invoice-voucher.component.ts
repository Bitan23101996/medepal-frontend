import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DoctorService } from '../../../modules/doctor/doctor.service';
import { SBISConstants } from '../../../SBISConstants';
import { ToastService } from '../../../core/services/toast.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ServiceProviderService } from '../../../modules/service-provider/service-provider.service';

@Component({
  selector: 'app-invoice-voucher',
  templateUrl: './invoice-voucher.component.html',
  styleUrls: ['./invoice-voucher.component.css']
})
export class InvoiceVoucherComponent implements OnInit {

  @Input() appointmentRefNo: any;
  @Input() invoiceList;
  invoiceForm: FormGroup;
  user: any;
  entityName: any;
  totalAmount: any;
  totAmntWithoutDiscount: any;
  chargeAmount: any;
  discountAmount: any;
  editMode: boolean;
  chargeList: any = [];
  submitted: boolean = false;
  @ViewChild('printModal') printModal: TemplateRef<any>;
  modalRef: BsModalRef;
  apiUrl = environment.apiUrl;
  ipdServiceList:any=[];
  associatedServiceList:any=[];
  loading: boolean = false;

  constructor(private fb: FormBuilder, 
          private _doctorService: DoctorService, 
          private _toastService: ToastService,
          private bsModalService: BsModalService,
          private http:HttpClient,
          private serviceProviderService: ServiceProviderService) { }

  ngOnInit() {
    this.submitted = false;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.entityName = this.user.entityName;
    this.getChargeListByChamber();
    this.createInvoiceForm();
    this.totalAmount = 0;
    this.totAmntWithoutDiscount = 0;
    this.chargeAmount = 0;
    this.discountAmount = 0;
    this.editMode = false;
    this.getPaymentModeList(); //Working on app/issues/1424
    this.getRegTxnDetails();
  }

  //Working on app/issues/1424
  paymentModeList: any = [];
  getPaymentModeList(){
    this._doctorService.getPaymentModeList()
    .subscribe(res =>{
      console.log(res);
      this.paymentModeList = res.masterDataAttributeValues;
      
    });
  }
  //End Working on app/issues/1424

  regTxnDetails: any= null;
  getRegTxnDetails(){
    let payload = {
      appointmentRefNo: this.appointmentRefNo
    }
    this._doctorService.getRegistrationTxnDetails(payload).subscribe(res => {
      console.log("Reg Txn Det");
      console.log(res);
      this.regTxnDetails = res["data"];
      
    });
  }

  getChargeListByChamber(){
    let payload = {
      appointmentRefNo: this.appointmentRefNo
    }
    this._doctorService.getChargeListByChamber(payload).subscribe(res => {
      console.log("Charge List");
      console.log(res);
      this.chargeList = res["data"];
      this.createInvoiceForm();

    if(this.chargeList.length > 0){
      //this.calculateCharges();
      this.calculateInvoiceDetail();
    }
    });
  }

  lastInvoiceAmount: any = null;
  lastInvoiceDate: any = null;
  createInvoiceForm() {
    let invoiceDetailArray: FormGroup[] = [];
    //serviceChargeArray.push(this.createInvoiceDetailListList());
    //let chargeDetailsArr: FormGroup[] = [];
    if(this.chargeList.length > 0){
      for (let i = 0; i < this.chargeList.length; i++) {
        if(this.chargeList[i].description ==SBISConstants.REGISTRATION.OPD_REGISTRATION_FEES && this.chargeList[i].paidFlag=="Y"){
          this.lastInvoiceAmount=this.chargeList[i].invoiceAmount;
          this.lastInvoiceDate=this.chargeList[i].invoiceDate;
        }
        invoiceDetailArray.push(this.editInvoiceDetailListList(this.chargeList[i]));
        //chargeDetailsArr.push(this.editChargeDetailsList(this.chargeList[i]));
        // if(this.chargeList[i].paidFlag==null || this.chargeList[i].paidFlag=="N"){
        //   invoiceDetailArray.push(this.editInvoiceDetailListList(this.chargeList[i]));
        // }
        // else{
        //   invoiceDetailArray.push(this.createInvoiceDetailListList());    
        // }
      }
     
    }
    else{
      //chargeDetailsArr.push(this.createChargeDetailsList())
      invoiceDetailArray.push(this.createInvoiceDetailListList());
    }
    
    // let discountDetailsArray: FormGroup[] = [];
    // discountDetailsArray.push(this.createDiscountDetailsList());

    
    this.invoiceForm = this.fb.group({
      appointmentRefNo: [this.appointmentRefNo],
      invoiceNo: [null],
      invoiceDate: [null],
      name: [null],
      address: [null],
      contactNo: [null],
      opdFlag: [this.entityName == "DOCTOR" ? "N" : "Y"],
      totalAmount: [null],
      cxlBy: [null],
      cxlDatetime: [null],
      cxlReason: [null],
      status: [null],
      discountDescription: [null],
      discountAmount: [null],
      //chargeDetails: this.fb.array(chargeDetailsArr),
      invoiceDetailList: this.fb.array(invoiceDetailArray),
      //discountDetails: this.fb.array(discountDetailsArray),
      // paymentMode: ["CASH"], //Working on app/issues/1424
      // cardNo: [null]
      paymentDetail:this.fb.group({
        txnTypeRefNo: [null],
        paymentDescription: [null],
        amount: [null],
        paymentMode : ["CASH"],
        cardNo: [null],
        txnType: ["APPOINTMENT"]
      }),
    })

  }

  // createChargeDetailsList(): FormGroup {
  //   return this.fb.group({
  //     doctorInvoiceDetailPk: [null],
  //     doctorInvoicePk: [null],
  //     doctorInvoiceNo: [null],
  //     itemCode: [null],
  //     description: [null],
  //     amount: [null],
  //     status: [null],
  //   });
  // }

  // createDiscountDetailsList(): FormGroup {
  //   return this.fb.group({
  //     doctorInvoiceDiscountDetailPk: [null],
  //     doctorInvoicePk: [null],
  //     doctorInvoiceNo: [null],
  //     itemCode: [null],
  //     description: [null],
  //     amount: [null],
  //     status: [null],
  //   });
  // }

  createInvoiceDetailListList(): FormGroup {
    return this.fb.group({
      invoiceDetailPk: [null],
      serviceName: [null],
      serviceRefNo: [null],
      usage: null,
      unit: null,
      amount: [null],
      hours:null,
      minutes:null,
      serviceType:["APPOINTMENT"],  
      rateType:['FIX'],
      status:"NRM"
    });
  }

  // get chargeDetails(): FormArray {
  //   return this.invoiceForm.get('chargeDetails') as FormArray;
  // }

  // get discountDetails(): FormArray {
  //   return this.invoiceForm.get('discountDetails') as FormArray;
  // }

  get invoiceDetailList(): FormArray {
    return this.invoiceForm.get('invoiceDetailList') as FormArray;
  }

  // addCharge() {
  //   let chargeDetailsArr = this.invoiceForm.get('chargeDetails') as FormArray;
  //   // Working on Issue app#1316
  //   if(this.chargeDetails.length<4)
  //     this.chargeDetails.push(this.createChargeDetailsList());
  //   else
  //     this._toastService.showI18nToastFadeOut("You Can Add Maximum 4 Charges", "warning");
  //   // End Working on Issue app#1316
  // }

  // addDiscount() {
  //   let discountDetailsArray = this.invoiceForm.get('discountDetails') as FormArray;
  //   // Working on Issue app#1316
  //   if(this.discountDetails.length<4)
  //    this.discountDetails.push(this.createDiscountDetailsList());
  //   else
  //    this._toastService.showI18nToastFadeOut("You Can Add Maximum 4 Discounts", "warning");
  //   // End Working on Issue app#1316

  // }

  addInvoiceDetail() {
    if(this.invoiceDetailList.length>4){
      this._toastService.showI18nToastFadeOut("You can add maximum 5 items. If you need more item, please create new invoice", "warning");
    }
    else{
      let serviceChargeArr = this.invoiceForm.get('invoiceDetailList') as FormArray;
      this.invoiceDetailList.push(this.createInvoiceDetailListList());
    }    
  }

  // deleteChargesArray: FormGroup[] = [];
  // deleteDiscountsArray: FormGroup[] = [];
  // deleteCharge(index) {
  //   if (this.chargeDetails.controls[index].get('doctorInvoiceDetailPk').value === null) {
  //     this.chargeDetails.controls.splice(index, 1);
  //     //this.invoiceForm.value.chargeDetails.splice(index, 1);
  //     this.chargeDetails.value.splice(index, 1);
  //   }
  //   else {
  //     //this.chargeDetails.controls[index].get('status').setValue("CXL");
  //     //this.chargeDetails.controls.splice(index, 1);
  //     this.chargeDetails.value[index].status = "CXL";
  //     this.chargeDetails.controls.splice(index, 1);
  //     this.deleteChargesArray.push(this.chargeDetails.value[index]);
  //     this.chargeDetails.value.splice(index, 1);
  //   }
  //   this.calculateCharges();
  // }

  // deleteDiscount(index) {
  //   if (this.discountDetails.controls[index].get('doctorInvoiceDiscountDetailPk').value === null) {
  //     this.discountDetails.controls.splice(index, 1);
  //     //this.invoiceForm.value.discountDetails.splice(index, 1);
  //     this.discountDetails.value.splice(index, 1);
  //   }
  //   else {
  //     // this.discountDetails.controls[index].get('status').setValue("CXL");
  //     // this.discountDetails.controls.splice(index, 1);
  //     this.discountDetails.value[index].status = "CXL";
  //     this.discountDetails.controls.splice(index, 1);
  //     this.deleteDiscountsArray.push(this.discountDetails.value[index]);
  //     this.discountDetails.value.splice(index, 1);
  //   }

  //   this.calculateDiscount();

  // }

  deleteServiceChargesArray: FormGroup[] = [];
  deleteInvoiceDetail(index) {
    if (this.invoiceDetailList.controls[index].get('invoiceDetailPk').value === null) {
      this.invoiceDetailList.controls.splice(index, 1);
      //this.invoiceForm.value.chargeDetails.splice(index, 1);
      this.invoiceDetailList.value.splice(index, 1);
    }
    else {
      //this.chargeDetails.controls[index].get('status').setValue("CXL");
      //this.chargeDetails.controls.splice(index, 1);
      this.invoiceDetailList.value[index].status = "CXL";
      this.invoiceDetailList.controls.splice(index, 1);
      this.deleteServiceChargesArray.push(this.invoiceDetailList.value[index]);
      this.invoiceDetailList.value.splice(index, 1);
    }
    this.calculateInvoiceDetail();
  }

  // assignCLXForCharges()
  // {
  //   var chargeList = this.invoiceForm.get('chargeDetails') as FormArray;
  //   let value = chargeList.value;
  //   for(let i=0; i<this.deleteChargesArray.length; i++)
  //   {
  //     let existingPk = false;
  //     for(let j=0; j < value.length; j++) {
  //       var deleteCharge: any = this.deleteChargesArray[i];
  //       if(value[j].doctorInvoiceDetailPk != '' && value[j].doctorInvoiceDetailPk == deleteCharge.doctorInvoiceDetailPk)
  //       {
  //         existingPk = true;
  //         break;
  //       }
  //     }
  //     if (!existingPk) {
  //       chargeList.value.push(this.deleteChargesArray[i]);
  //     }
  //   }
  // }
  // assignCLXForDiscount(){
  //   var diccountList = this.invoiceForm.get('discountDetails') as FormArray;
  //   let value = diccountList.value;
  //   for(let i=0; i<this.deleteDiscountsArray.length; i++)
  //   {
  //     let existingPk = false;
  //     for(let j=0; j < value.length; j++) {
  //       var deleteDiscount: any = this.deleteDiscountsArray[i];
  //       if(value[j].doctorInvoiceDiscountDetailPk != '' && value[j].doctorInvoiceDiscountDetailPk == deleteDiscount.doctorInvoiceDiscountDetailPk)
  //       {
  //         existingPk = true;
  //         break;
  //       }
  //     }
  //     if (!existingPk) {
  //       diccountList.value.push(this.deleteDiscountsArray[i]);
  //     }
  //   }
  // }

  assignCLXForInvoiceDetailList()
  {
    var invoiceDetailList = this.invoiceForm.get('invoiceDetailList') as FormArray;
    let value = invoiceDetailList.value;
    for(let i=0; i<this.deleteServiceChargesArray.length; i++)
    {
      let existingPk = false;
      for(let j=0; j < value.length; j++) {
        var deleteServiceCharge: any = this.deleteServiceChargesArray[i];
        if(value[j].invoiceDetailPk != '' && value[j].invoiceDetailPk == deleteServiceCharge.invoiceDetailPk)
        {
          existingPk = true;
          break;
        }
      }
      if (!existingPk) {
        invoiceDetailList.value.push(this.deleteServiceChargesArray[i]);
      }
    }
  }


  // calculateCharges() {

  //   let chargeDetailsList = this.invoiceForm.get('chargeDetails') as FormArray;
  //   this.chargeAmount = 0;
  //   chargeDetailsList.controls.forEach(detail => {
  //     if (detail.value.amount != "") {
  //       this.chargeAmount += parseFloat(detail.value.amount);
  //     }
  //   })

  //   if (this.chargeAmount > this.discountAmount) {
  //     this.totalAmount = this.chargeAmount - this.discountAmount;
  //   }
  //   else {
  //     this.totalAmount = this.chargeAmount - this.discountAmount;
  //     //this._toastService.showI18nToastFadeOut("Charge amount should be higher than discount amount", "warning");
  //   }




  // }

  // calculateDiscount() {
  //   let discountDetailsList = this.invoiceForm.get('discountDetails') as FormArray;
  //   this.discountAmount = 0;
  //   discountDetailsList.controls.forEach(detail => {
  //     if (detail.value.amount != "") {
  //       this.discountAmount += parseFloat(detail.value.amount);
  //     }
  //   })
  //   this.totalAmount = (this.chargeAmount + this.totalServiceChargeAmount) - this.discountAmount;

  //   // if (this.chargeAmount > this.discountAmount) {
  //   //   this.totalAmount = this.chargeAmount - this.discountAmount;
  //   // }
  //   // else {
  //   //   this.totalAmount = this.chargeAmount - this.discountAmount;
  //   //   //this._toastService.showI18nToastFadeOut("Charge amount should be higher than discount amount", "warning");
  //   // }

  // }

  calculateDiscount(discountAmount) {
    //let totalAmount = 0;
    this.discountAmount = discountAmount;
    this.totalAmount = this.totalServiceChargeAmount - parseFloat(discountAmount);
   if(this.discountAmount == ""){
     this.totalAmount = this.totalServiceChargeAmount;
   }
  }
  discountMnd:boolean = false; // Working on app/issues/1316
  saveInvoice() {
    console.log(this.invoiceForm.value);
    this.submitted = true;    
    // Working on app/issues/1316

    // Working on app/issues/1859
    if(this.invoiceForm.value.discountAmount!=null && this.invoiceForm.value.discountAmount!=""){
      if(!isNaN(this.invoiceForm.value.discountAmount)){ // Check it's a number or not

        if(parseInt(this.invoiceForm.value.discountAmount)>0){
          if(this.invoiceForm.value.discountDescription!=null && this.invoiceForm.value.discountDescription!="")
            this.discountMnd = false;
          else{
            this.discountMnd = true;
            return false;
          }
        }
      }
    
    }
    else{
      this.discountMnd = false;
    } 
    // Working on app/issues/1859
    
    //End Working on app/issues/1316
    if(this.invoiceForm.valid){
      this.invoiceForm.patchValue({
        totalAmount: this.totalAmount
      })
      this.invoiceForm.controls.paymentDetail.patchValue({amount: this.totalAmount});
      //this.assignCLXForCharges(); //Working on app/issues/1423
      //this.assignCLXForDiscount() //Working on app/issues/1423
      this.assignCLXForInvoiceDetailList();
      console.log(this.invoiceForm.value);
      this.loading = true;
      document.body.classList.add('hide-bodyscroll');
      this.serviceProviderService.saveInPatientInvoice(this.invoiceForm.value).subscribe((res) => {
        console.log(res);
        if(res.status==2000){
          this.loading = false;
          document.body.classList.remove('hide-bodyscroll');
          this._toastService.showI18nToast("Invoice Saved Successfully", 'success');
          this.getInvoiceList();
          this.ngOnInit();
          this.print('D', res["data"]);
        }
        
        else
        if(res.status==500)
        this._toastService.showI18nToast("Invoice Saved Failed", 'error');
        
      },(error) => {
        console.log(error);
       
       });  
      // this._doctorService.saveInvoiceForAppointment(this.invoiceForm.value).subscribe(res => {
      //   if (res["status"] == 2000) {
      //     console.log("Invoice Save");
      //     console.log(res);
      //     //this._toastService.showI18nToastFadeOut("Invoice saved", "success");
      //     this.getInvoiceList();
      //     this.ngOnInit();
      //     this.print('D', res["data"]);
          
      //   }
      //   else {
      //     this._toastService.showI18nToastFadeOut("Error occurred", "error");
      //   }
  
      // });
    }
  }

  getInvoiceList() {
    let payload = {
      appointmentRefNo: this.appointmentRefNo
    }
    this.serviceProviderService.getInvoiceListByAppointmentRefNo(payload).subscribe(res => {
    //this._doctorService.getInvoiceListByAppointment(payload).subscribe(res => {
      console.log("Invoice");
      console.log(res);
      this.invoiceList = res["data"];

    });
  }

  invoiceNo: any;
  editInvoice(invoice) {
    console.log(invoice);
    this.editInvoiceForm(invoice);
    this.invoiceNo = invoice.invoiceNo;
  }

  editInvoiceForm(invoice) {
    this.editMode = true;
    this.invoiceForm = this.fb.group({
      appointmentRefNo: [this.appointmentRefNo],
      invoiceNo: [invoice.invoiceNo],
      invoiceDate: [invoice.invoiceDate],
      name: [invoice.name],
      address: [invoice.address],
      contactNo: [invoice.contactNo],
      opdFlag: [invoice.opdFlag],
      totalAmount: [invoice.totalAmount],
      cxlBy: [invoice.cxlBy],
      cxlDatetime: [invoice.cxlDatetime],
      cxlReason: [invoice.cxlReason],
      status: [invoice.status],
      discountDescription: [invoice.discountDescription],
      discountAmount: [invoice.discountAmount*(-1)],
      //chargeDetails: this.fb.array([]),
      invoiceDetailList: this.fb.array([]),
      //discountDetails: this.fb.array([]),
      //paymentMode: [invoice.paymentDetail!=null?invoice.paymentDetail.paymentMode:"CASH"], //Working on app/issues/1424
      //cardNo: [invoice.cardNo]
      paymentDetail:this.fb.group({
        txnTypeRefNo: [null],
        paymentDescription: [null],
        amount: [null],
        paymentMode : ["CASH"],
        cardNo: [null],
        txnType: ["APPOINTMENT"]
      }),
    })
    
    
    this.discountAmount = invoice.discountAmount*(-1);
    // let chargeDetailList: any
    // for (let i = 0; i < invoice["chargeDetails"].length; i++) {
    //   chargeDetailList = this.invoiceForm.get('chargeDetails') as FormArray;
    //   chargeDetailList.push(this.editChargeDetailsList(invoice["chargeDetails"][i]));
    // }

    let serviceChargeDetailList: any
    for (let i = 0; i < invoice["invoiceDetailList"].length; i++) {
      serviceChargeDetailList = this.invoiceForm.get('invoiceDetailList') as FormArray;
      serviceChargeDetailList.push(this.editInvoiceDetailListList(invoice["invoiceDetailList"][i]));
    }

    // let discountDetailList: any
    // for (let i = 0; i < invoice["discountDetails"].length; i++) {
    //   discountDetailList = this.invoiceForm.get('discountDetails') as FormArray;
    //   discountDetailList.push(this.editDiscountDetailsList(invoice["discountDetails"][i]));
    // }

    //this.calculateCharges();
    this.calculateInvoiceDetail();
    //this.calculateDiscount();
  }

  // editChargeDetailsList(details): FormGroup {
  //   return this.fb.group({
  //     doctorInvoiceDetailPk: [details.doctorInvoiceDetailPk],
  //     doctorInvoicePk: [details.doctorInvoicePk],
  //     itemCode: [details.itemCode],
  //     description: [details.description],
  //     amount: [details.amount],
  //     status: [details.status]
  //   });
  // }

  editInvoiceDetailListList(details): FormGroup {
    let hours:number=null;
    let minutes:number=null;
    if(details.usage!=null)
    {
      hours=Math.floor(details.usage/60);
      minutes=details.usage-(hours*60);
    }
    return this.fb.group({
      invoiceDetailPk: [details.invoiceDetailPk],
      serviceName: [(details.serviceRefNo==null || details.description==SBISConstants.REGISTRATION.OPD_REGISTRATION_FEES)? details.description : details.serviceName],
      //serviceName: [details.description],
      serviceRefNo: [details.serviceRefNo],
      usage: [details.usage],
      unit: [details.unit],
      amount: [details.amount],
      hours: hours,
      minutes: minutes,
      serviceType:[details.description==SBISConstants.REGISTRATION.OPD_REGISTRATION_FEES?SBISConstants.REGISTRATION.REGISTRATION_FEES_CONSTANT:details.serviceType==null?"APPOINTMENT":details.serviceType],  
      rateType:[details.rateType],
      description: [details.description],
      status: [details.status==null?"NRM":details.status]
    });
  }

  // editDiscountDetailsList(details): FormGroup {
  //   return this.fb.group({
  //     doctorInvoiceDiscountDetailPk: [details.doctorInvoiceDiscountDetailPk],
  //     doctorInvoicePk: [details.doctorInvoicePk],
  //     itemCode: [details.itemCode],
  //     description: [details.description],
  //     amount: [details.amount],
  //     status: [details.status]
  //   });
  // }

  displayOnDelete: boolean = false;
  deleteInvoice(invoice, reason) {
    if (confirm("Are you sure to delete this invoice(Invoice No. - " + invoice.invoiceNo + ")?")) {
      //this.displayOnDelete = true;
      let payload = {
        appointmentRefNo: this.appointmentRefNo,
        invoiceNo: invoice.invoiceNo,
        cxlReason: reason,
      }
      this._doctorService.deleteInvoiceForAppointment(payload).subscribe(res => {
        if (res["status"] == 2000) {
          console.log("Invoice Delete");
          console.log(res);
          this._toastService.showI18nToastFadeOut("Invoice No. - " + invoice.invoiceNo + " deleted", "success");
          this.getInvoiceList();
          this.ngOnInit();
        }
        else {
          this._toastService.showI18nToastFadeOut("Error occurred", "error");
        }
      });

    }
  }

  addNewInvoice() {
    this.getInvoiceList();
    this.ngOnInit();
  }

  currInvoice: any;
  printInvoice(invoice) {
    this.currInvoice = invoice;
    //this.modalRef = this.bsModalService.show(this.printModal, { class: 'modal-sm' });
    this.print('D', this.currInvoice);
  }

  print(printOption, invoice){
    let payload = {
      appointmentRefNo: this.appointmentRefNo,
      invoiceNo: invoice.invoiceNo
     }
     this.serviceProviderService.downloadOPDInvoice(payload).subscribe(result => {
      var file = new Blob([result], {type: 'application/pdf'});
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


  //   return this.http.get(this.apiUrl+"gen/v1/generateAppointmentInvoice/" +  this.appointmentRefNo + "/" + invoice.invoiceNo, { responseType:'blob' }).map((result) => {
       
  //      var file = new Blob([result], {type: 'application/pdf'});
  //      var fileURL = URL.createObjectURL(file);    
  //        var w = window.open("about:blank");
 
  //        var iframe = document.createElement('iframe');
  //        iframe.src = fileURL;
  //        iframe.focus();
  //        iframe.onload = function() {
  //          iframe.contentWindow.print();
  //        };
 
  //        w.document.body.appendChild(iframe);
  //        w.document.body.style.display = "none";
       
  //  }).toPromise();
   
   }


   //Added for Service charge
   getIpdServiceBasicInfoList(event,index){
    let requestQuery={     
      serviceName:event.query      
    }
    console.log(this.invoiceDetailList);
    
    this.serviceProviderService.getIpdServiceBasicInfoList(requestQuery).subscribe((res) => {
      if(res.status==2000){
        if(res.data==null){
          this.ipdServiceList = [];
        }
        else{
          this.ipdServiceList = res.data;
        }
      }
      else{
        this.ipdServiceList = [];
      }
     
    },(error) => {
     console.log(error);
     ;
    });
  }

  setBillDetailForm(serviceClickedEvent,index){// Used to set service reference No. into Bill Detail form
    console.log(this.invoiceDetailList);
    let currentItemUnit:number=null
    if(serviceClickedEvent.rateType=="FIX"){
      currentItemUnit=1;
    }
    this.invoiceDetailList.controls[index].patchValue({  
      serviceRefNo:serviceClickedEvent.serviceRefNo,
      serviceName: serviceClickedEvent.serviceName,
      rateType:serviceClickedEvent.rateType,
      unit:currentItemUnit,
      serviceType:serviceClickedEvent.category
    });
    
    this.getIpdServiceRateByRefNoAndQuantity(index)
    let requestQuery={
      serviceRefNo:serviceClickedEvent.serviceRefNo
    }
    console.log("requestQuery::", requestQuery);
    this.serviceProviderService.getAssociatedServiceListByServiceRefNo(requestQuery).subscribe((res) => {
      this.associatedServiceList = res.data;
      for(let associateService of this.associatedServiceList){
        this.addInvoiceDetail();
        this.addAssociatedBillDetailToForm(this.invoiceDetailList.length-1,associateService);
      }
      console.log("associatedServiceList::",this.associatedServiceList);
      
      
    },(error) => {
      console.log(error);
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
   
    console.log("requestQuery:",requestQuery);
    

    if(requestQuery.serviceRefNo!=null ){
     
      this.serviceProviderService.getIpdServiceRateByRefNoAndQuantity(requestQuery).subscribe((res) => {
        this.ipdServiceList = res.data;
        this.invoiceDetailList.controls[index].patchValue({
          amount:res.data.totalCharge,
          usage: res.data.usage
        });
        this.calculateInvoiceDetail(); 

      },(error) => {
        console.log(error);
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

  totalServiceChargeAmount: number=0;
  calculateInvoiceDetail(){
    this.totalServiceChargeAmount=0;
    for(let i=0;i<this.invoiceDetailList.length;i++){
      if(this.invoiceDetailList.controls[i].value.status=="NRM"){
        let detailCharge=parseInt(this.invoiceDetailList.controls[i].value.amount);
        if(isNaN(detailCharge)) detailCharge=0;
        this.totalServiceChargeAmount = this.totalServiceChargeAmount + detailCharge
      }
    }
    //this.chargeAmount > this.discountAmount
    this.totalAmount = (this.chargeAmount + this.totalServiceChargeAmount) - this.discountAmount;
    // for(let k=0;k<this.bedHistoryDetail.length;k++){
    //   let bedCharge=parseInt(this.bedHistoryDetail.controls[k].value.totalAmount);
    //   if(isNaN(bedCharge)) bedCharge=0;
    //   this.totalInvoiceAmount=this.totalInvoiceAmount+bedCharge;
    // }
   
    // let discountAmount=parseInt(this.inpatientInvoiceForm.value.discountAmount);
    // if(isNaN(discountAmount)) discountAmount=0;
    // this.totalInvoiceAmount= this.totalInvoiceAmount-discountAmount;

    // this.inpatientInvoiceForm.patchValue({
    //   totalAmount:this.totalInvoiceAmount
    // });
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

  showCardNo: boolean = false;
  setPayment(paymentMode){
    if(paymentMode=="DEBIT_CREDIT_CARD"){
      this.showCardNo = true;
    }
    else{
      this.showCardNo = false;
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { BillingService } from '../billing.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-sp-bills',
  templateUrl: './my-sp-bills.component.html',
  styleUrls: ['./my-sp-bills.component.css']
})
export class MySPBillsComponent implements OnInit {

  apiUrl = environment.apiUrl;
  reportType = "CONTRACT";
  user: any;
  viewDate: Date;
  prevDateEnableFlag = false;
  fromDate: any;
  toDate: any;
  myBillingPlan: any;
  billingCycle: any;
  myBill: any;
  appointmentDetList: any = [];
  myBillDetailSummaryView: any = [];
  months: any = [];
  date: any;
  billingMonth: any;
  billingYear: any;
  summaryView: any = 'N';
  myBillingSummary: any;
  myBillingHistory: any =[];
  totalAmount: any;
  admissionDetList: any = [];

  constructor(private _broadcastService: BroadcastService,
    private _billingService: BillingService,
    private _toastService: ToastService,
    private _router: Router,
    private _http: HttpClient
  ) { }

  ngOnInit() {
    this.date = new Date();
    this._broadcastService.setHeaderText('My Bills');
    this.viewDate = new Date();
    //this.getMyBillingPlan();
    
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.billingMonth = this.months[this.date.getMonth()];
    this.billingYear = this.date.getFullYear();
    this.getMyBills();
    this.getMyBillingPlan();
    this.getMyBillingSummary();
    this.user = JSON.parse(localStorage.getItem('user'));
  }


   getMyBillingSummary(){
    this._billingService.GetSPBillingSummary().subscribe(data => {
      console.log(data);

      if (data['status'] == '2000') {
        this.myBillingSummary = data['data'];
        this.myBillingHistory =  data['data'].sPBillDTOList;
      }
    });
   }

   downloadContract(){
    var fileName = "Contract";
		var a = document.createElement("a");
    return this._http.get(this.apiUrl+"gen/v1/billing/generateReport"+ "/" + this.reportType + "/" + this.user.refNo, { responseType:'blob' }).map((result) => {
      var file = new Blob([result], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);
        a.href = fileURL;
        a.download = fileName;
        a.click();
        window.open(fileURL);
        this._toastService.showI18nToastFadeOut("Download successful.","success");
      
      
  }).toPromise();
  }
   //End Working on app/issues/1412

  getMyBillingPlan() {
    this._billingService.GetSPBillingPlanDetails().subscribe(data => {
      // console.log(data);

      if (data['status'] == '2000') {
        this.myBillingPlan = data['data'];
        this.billingCycle = this.myBillingPlan.billingCycle;
      }
    });
  }

  getMyBillDetailsView() {
    let payload = {
      billingMonth: this.billingMonth,
      billingYear: this.billingYear
    };
    this._billingService.GetSPBillDetailsView(payload).subscribe(data => {
      console.log("Bill");
      console.log(data);

      if (data['status'] == '2000') {
        // console.log(data['data'].doctorBillingViewProcedurewise);
        
        this.appointmentDetList = data['data'].spBillingViewAppointmentwise;
        this.admissionDetList = data['data'].spBillingViewAdmissionwise;
        this.calculateTotalAmount(this.appointmentDetList, this.admissionDetList);
      }
    });
  }

  getMyBills() {
    let payload = {
      billingMonth: this.billingMonth,
      billingYear: this.billingYear
    };
    this._billingService.GetSPBillingPlan(payload).subscribe(data => {
      console.log("Bill");
      console.log(data);

      if (data['data'] != null) {
        this.myBill = data['data'];
      }
      else{
        this.myBill = null;        
      }
      this.getMyBillDetailsView();
    });
  }

  goToPreviousDate() {
    if (this.billingCycle == "Month") {
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth() - 1,
        this.viewDate.getDate());

      this.billingMonth = this.months[this.viewDate.getMonth()];
      this.billingYear = this.viewDate.getFullYear();
      console.log(this.billingMonth);

      this.getMyBills();
    }
    else {
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth(),
        this.viewDate.getDate() - 1);
    }


    var mnth = ("0" + (this.viewDate.getMonth() + 1)).slice(-2),
      day = ("0" + this.viewDate.getDate()).slice(-2);
    var tempDate = [this.viewDate.getFullYear(), mnth, day].join("-");

    this.fromDate = tempDate;
    this.toDate = tempDate;

  }

  goToNextDate() {
    if (this.billingCycle == "Month") {
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth() + 1,
        this.viewDate.getDate());

      this.billingMonth = this.months[this.viewDate.getMonth()];
      this.billingYear = this.viewDate.getFullYear();
      console.log(this.billingMonth);
      this.getMyBills();
    }
    else {
      this.viewDate = new Date(
        this.viewDate.getFullYear(),
        this.viewDate.getMonth(),
        this.viewDate.getDate() + 1);
    }


    var mnth = ("0" + (this.viewDate.getMonth() + 1)).slice(-2),
      day = ("0" + this.viewDate.getDate()).slice(-2);
    var tempDate = [this.viewDate.getFullYear(), mnth, day].join("-");

    this.fromDate = tempDate;
    this.toDate = tempDate;
  }

  generateMyBill() {
    var fileName = "Bill.pdf";
    var a = document.createElement("a");
    let query = {
      billingMonth: this.billingMonth,
      billingYear: this.billingYear,
      summaryView: this.summaryView
    }
    this._billingService.generateMyBill(query).subscribe(data => {
      console.log(data);
     let responsedFile = "data:application/pdf;base64," + data.data;
      //  var file = new Blob([responsedFile], { type: 'application/pdf' });
      // var fileURL = URL.createObjectURL(file);
      a.href = responsedFile;
      a.download = fileName;
      a.click();
      // window.open("data:application/pdf;base64," + data);
      // window.open(fileURL);
      this._toastService.showI18nToastFadeOut("Download successful.", "success");
    });

  }

  toggleSummaryView(event){
    if(event.target.checked){
      this.summaryView = "Y";
      this.summaryViewData();
    }
    else{
      this.summaryView = "N";
    }
    
  }

  
  summaryViewData(){
    let data = {};
    this.myBillDetailSummaryView = [];
    if(this.appointmentDetList.length > 0){
      for(let i = 0; i < this.appointmentDetList.length; i++){
        let unit = 0;
        for(let j = 0; j < this.appointmentDetList[i].doctorBillingViewDTOChamberwise.length; j++){
          unit += this.appointmentDetList[i].doctorBillingViewDTOChamberwise[j].unitCnt
        }
        data = {
          chamber : this.appointmentDetList[i].chamber,
          unitCnt : unit
        }
        this.myBillDetailSummaryView.push(data)
      }
      console.log(this.myBillDetailSummaryView);
      
    }
  }

  displaySubtotal(b){
    let subtotal = 0.00;
    for(let i = 0; i<b.length;i++){
      subtotal += b[i].amount;
    }
    return subtotal;
    
  }

  displaySubtotalUnit(b){
    let subtotal = 0.00;
    for(let i = 0; i<b.length;i++){
      subtotal += b[i].unitCnt;
    }
    return subtotal;
  }

  calculateTotalAmount(appointment,admission){
    console.log(appointment);
    let total = 0.00;
    if(appointment.length > 0){
      for(let i = 0; i < appointment.length;i++){
        total += appointment[i].amount;
      }
    }
    console.log(total);
    if(admission.length > 0){
      for(let i = 0; i < admission.length;i++){
        total += admission[i].amount;
      }
    }
    this.totalAmount =  total;
  }

}

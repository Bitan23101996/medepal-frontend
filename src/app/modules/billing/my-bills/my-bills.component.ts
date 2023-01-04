import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { BillingService } from '../billing.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-my-bills',
  templateUrl: './my-bills.component.html',
  styleUrls: ['./my-bills.component.css']
})
export class MyBillsComponent implements OnInit {

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
  myBillDetailView: any = [];
  myBillDetailSummaryView: any = [];
  months: any = [];
  date: any;
  billingMonth: any;
  billingYear: any;
  summaryView: any = 'N';
  myBillingSummary: any;
  myBillingHistory: any =[];
  totalAmount: any;
  procedureList: any = [];

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

    //Working on app/issues/1412
    this.getMyBillingSummary();
    this.user = JSON.parse(localStorage.getItem('user'));
    //End Working on app/issues/1412
  }

   //Working on app/issues/1412
   getMyBillingSummary(){
    this._billingService.getDoctorBillingSummary().subscribe(data => {
      console.log(data);

      if (data['status'] == '2000') {
        this.myBillingSummary = data['data'];
        this.myBillingHistory =  data['data'].doctorBillDTOList;
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
    this._billingService.getMyBillingPlan().subscribe(data => {
      console.log(data);

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
    this._billingService.getMyBillDetailsView(payload).subscribe(data => {
      console.log("Bill");
      console.log(data);

      if (data['status'] == '2000') {
        console.log(data['data'].doctorBillingViewProcedurewise);
        
        this.myBillDetailView = data['data'].doctorBillingView;
        this.procedureList = data['data'].doctorBillingViewProcedurewise;
        this.calculateTotalAmount(this.myBillDetailView, this.procedureList);
      }
    });
  }

  getMyBills() {
    let payload = {
      billingMonth: this.billingMonth,
      billingYear: this.billingYear
    };
    this._billingService.getMyBills(payload).subscribe(data => {
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
    if(this.myBillDetailView.length > 0){
      for(let i = 0; i < this.myBillDetailView.length; i++){
        let unit = 0;
        for(let j = 0; j < this.myBillDetailView[i].doctorBillingViewDTOChamberwise.length; j++){
          unit += this.myBillDetailView[i].doctorBillingViewDTOChamberwise[j].unitCnt
        }
        data = {
          chamber : this.myBillDetailView[i].chamber,
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

  calculateTotalAmount(b,p){
    console.log(b);
    let total = 0.00;
    for(let i = 0; i < b.length;i++){
      if(b[i].chamber!=null){
        for(let j = 0; j < b[i].doctorBillingViewDTOChamberwise.length; j++){
          total += b[i].doctorBillingViewDTOChamberwise[j].amount;
        }
      }
    }
    console.log(total);
    if(p.length > 0){
      for(let i = 0; i < p.length;i++){
        total += p[i].amount;
      }
    }
    this.totalAmount =  total;
  }

}

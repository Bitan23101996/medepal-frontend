import { Component, OnInit } from '@angular/core';
import { BroadcastService } from '../../../core/services/broadcast.service';
import * as XLSX from 'xlsx';
import { ServiceProviderService } from '../service-provider.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Router, Event as RouterEvent, NavigationEnd, NavigationStart, NavigationCancel } from '@angular/router';

@Component({
  selector: 'app-pharmacy-service-pincode',
  templateUrl: './pharmacy-service-pincode.component.html',
  styleUrls: ['./pharmacy-service-pincode.component.css']
})
export class PharmacyServicePincodeComponent implements OnInit {

  file:File;
  dtoArray:any=[];
  sheetData:any=[];
  headerarr:any=[];
  datalist:any=[];
  isPaginator:any=false;
  pincodeData:any=[];
  user:any;
  myChunk: any = [];
  tableSheet: any = [];
  finalSheetData: any[] = [];

  constructor(
    private _broadcastService: BroadcastService,
    private _serviceProviderService: ServiceProviderService,
    private toastService: ToastService,
    private router: Router
    ) { }

  ngOnInit() {
    this._broadcastService.setHeaderText("upload service pin code list");
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  zeroPad(num){
    if(num.toString().length==1){
      num = '0'+num;
    }
    return num;
  }

  selectFile(event:any){
    this.file = null;
    this.file = event.target.files[0];
    this.headerarr=[];
    this.sheetData=[];
    this.dtoArray=[];
    let arr2:any=[];
    const target: DataTransfer = <DataTransfer>(event.target);
		if (target.files.length !== 1) throw new Error('Cannot use multiple files');
		const reader: FileReader = new FileReader();
		reader.onload = (e: any) => {
			/* read workbook */
			const bstr: string = e.target.result;
			const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});

			/* grab first sheet */
			const wsname: string = wb.SheetNames[0];
			const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      this.datalist=XLSX.utils.sheet_to_json(ws, {header: 1});

    for(var j=5;j<=this.datalist.length;j++){
      arr2.push(this.datalist[j]);
    }

 
    for(var k=0;k<=arr2.length-2;k++){
    
      if(arr2[k]!='undefined' && arr2[k]!=null ){
          this.sheetData.push(arr2[k][0]);
      }
    }
    
    if(event==null){
      this.isPaginator=false;
    }else{
      if(this.sheetData.length>10)
        this.isPaginator=true;
      else
        this.isPaginator=false;
    }
    this.calculateTable();
		};
    reader.readAsBinaryString(target.files[0]);
  }

  calculateTable() {
    this.tableSheet = [];
    this.finalSheetData = [];
    this.sheetData.forEach((element, index) => {
      this.finalSheetData.push({'pincode': element, 'index': index+1});
    });
    let array1 = [];
    let array2 = [];
    let array3 = [];
    if(this.sheetData.length <= 10) {
      this.sheetData.forEach((ele, index) => {
        array1.push(this.finalSheetData[index]);
      });
      this.tableSheet.push(array1);
      this.tableSheet.push(array2);
      this.tableSheet.push(array3);
    } else if (this.sheetData.length > 10 && this.sheetData.length <= 20) {
      let itemsPerArr = Math.round((this.sheetData.length / 2));
      let i, j;
      for(i=0;i < itemsPerArr;i++) {
        array1.push(this.finalSheetData[i]);
      }
      for(j=itemsPerArr;j <= (this.sheetData.length - 1);j++) {
        array2.push(this.finalSheetData[j]);
      }
      this.tableSheet.push(array1);
      this.tableSheet.push(array2);
      this.tableSheet.push(array3);
    } else if (this.sheetData.length > 20) {
      let itemsPerArr = Math.round((this.sheetData.length / 3));
      let i, j, k;
      for(i=0;i < itemsPerArr;i++) {
        array1.push(this.finalSheetData[i]);
      }
      for(j=itemsPerArr;j < (itemsPerArr*2);j++) {
        array2.push(this.finalSheetData[j]);
      }
      for(k=(itemsPerArr*2);k <= (this.sheetData.length -1); k++) {
        array3.push(this.finalSheetData[k]);
      }
      this.tableSheet.push(array1);
      this.tableSheet.push(array2);
      this.tableSheet.push(array3);
    }
  }

  generateExcel(){
    var wscols = [
      {wch:40},
      {wch:70}
    ];
    // Fix for issue app/issues/604
    // Service provider ref no - issue app#604
    var topDetails = XLSX.utils.aoa_to_sheet([
      ["LAB NAME",this.user.serviceProviderName],
      ["LAB REFERENCE NO",this.user.serviceProviderRefNo],
      ["DATA PROVIDED BY","SBIS"]
    ],);
    var header=[
      "PINCODE"
    ];
    
    var ws=XLSX.utils.sheet_add_json(topDetails,this.pincodeData,{header:header, origin: "A5"});
     
    ws['!cols'] = wscols;
  
    const wb_1: XLSX.WorkBook = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(wb_1, topDetails, 'SBIS');
    wb_1.Sheets['SBIS'] = ws;
    /* save to file */
    XLSX.writeFile(wb_1,'SBIS.xlsx');    
  }

  deleteRecord(rowData) {
    this.sheetData.splice((rowData.index - 1), 1);
    this.calculateTable();
  }

  saveRecords() {
    let query = {};
    let queryArr = [];
    this.sheetData.forEach(element => {
      queryArr.push(element.toString());
    });
    query = {
      'append': true,
      'pinCodeList': queryArr
    }
    this._serviceProviderService.saveServiceProviderPincode(query).subscribe(resp => {
      if(resp.status == 2000) {
        this.toastService.showI18nToast('Successful!','success');
        this.router.navigate(['opd/pharmacy-service-pincode-show']);
      }
    });
  }

  cancel() {
    this.router.navigate(['opd/opdPharmacyView/pharmacy']);
  }

}

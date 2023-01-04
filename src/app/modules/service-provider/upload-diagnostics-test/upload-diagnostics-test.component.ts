import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { ServiceProviderService } from '../service-provider.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { forEach } from '@angular/router/src/utils/collection';
import { Router } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';
type AOA = any[][];

@Component({
  selector: 'app-upload-diagnostics-test',
  templateUrl: './upload-diagnostics-test.component.html',
  styleUrls: ['./upload-diagnostics-test.component.css']
})
export class UploadDiagnosticsTestComponent implements OnInit {
//https://www.npmjs.com/package/ts-xlsx

arrayBuffer:any;
file:File;
//data: AOA = [ [1, 2], [3, 4] ];
dtoArray:any=[];
filterArray:any=[];
sheetData:any=[];
headerarr:any=[];
user:any;
medicalData:any=[];
datalist:any=[];
isPaginator:any=false;
  constructor(private _serviceProviderService: ServiceProviderService ,private toastService: ToastService,
    private _broadcastService: BroadcastService,private router: Router) { }

  ngOnInit() {
    this._broadcastService.setHeaderText("Upload Diagnostic Test");
    this.user = JSON.parse(localStorage.getItem('user'));
    this.medicaldetail();
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
        if(arr2[k][6]!=null && arr2[k][6] !='undefined' && arr2[k][6]!=""){
          arr2[k][6]=XLSX.SSF.parse_date_code(arr2[k][6]).y+"-"+this.zeroPad(XLSX.SSF.parse_date_code(arr2[k][6]).m)+"-"+this.zeroPad(XLSX.SSF.parse_date_code(arr2[k][6]).d);
        }else{
          arr2[k][6]= new Date();
        }
        if(arr2[k][4]==""){
          //arr2[k][4]==null || arr2[k][4] =='undefined' ||
          arr2[k][4]="Y";
        }
        if( arr2[k][2] ==""){
          arr2[k][2]=arr2[k][1];
        }
        if(arr2[k][3] ==''){
          arr2[k][3]=arr2[k][0];
        }
        if(arr2[k][3] == undefined){
          arr2[k][3]=arr2[k][0];
        }
        // Following If condition added to skip display of records with no price given - issue app#604
        if(arr2[k][5]!="" && arr2[k][5]!=null && arr2[k][5]!='undefined')
          this.sheetData.push(arr2[k]); 
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
   
    console.log("sheetData",this.sheetData);
    console.log(this.headerarr);
      console.log("data",this.datalist);
		};
    reader.readAsBinaryString(target.files[0]);
  }

  submit(){
    // Added to check no records fetched - issue app#604
    if (this.sheetData.length == 0) {
      this.toastService.showI18nToast('DIAGNOSTIC_TEST.NOTHING_TO_SAVE', "warning");
      return;
    }
    for(var m=0;m<=this.sheetData.length-1;m++){
      // Service provider ref no - issue app#604
        let payload={
          "sbisTestCode":this.sheetData[m][0],
          "sbisTestName":this.sheetData[m][1],
          "testNameLab":this.sheetData[m][2],
          "testNameCode":this.sheetData[m][3],
          "homeCollectionFlag":this.sheetData[m][4],
          "price":this.sheetData[m][5],
          "fromDate":this.sheetData[m][6],
          "labRefNo":this.user.serviceProviderRefNo,
          "status":"NRM",
          "priceDirty": true
          }
        
          if(payload.price!="" && payload.price!=null && payload.price!='undefined'){
            this.dtoArray.push(payload);
          }      
     }
     console.log("payload",this.dtoArray);

    if(this.dtoArray.length>0){
      this._serviceProviderService.saveLabTestExcelData(this.dtoArray).subscribe(data=>{

        console.log("response",data);
        this.dtoArray = [];
        if(data.status===2000){
          this.toastService.showI18nToast('DIAGNOSTIC_TEST.SAVE_SUCCESS', "success");
          // Route to Test List scren - issue app#604
          this.router.navigate(['opd/editLabTest']);
        }else{
          this.toastService.showI18nToast('DIAGNOSTIC_TEST.PROBLEM_SAVING', "error");
        }
      });
    }
   
  }


  generateExcel(){

    console.log("medicalData",this.medicalData);
    var wscols = [
      {wch:40},
      {wch:70},
      {wch:70},
      {wch:40},
      {width:20,wch:1},
      {wch:20},
      {wch:20}
    ];
    // Fix for issue app/issues/604
    // Service provider ref no - issue app#604
    var topDetails = XLSX.utils.aoa_to_sheet([
      ["LAB NAME",this.user.serviceProviderName],
      ["LAB REFERENCE NO",this.user.serviceProviderRefNo],
      ["DATA PROVIDED BY","SBIS"]
    ],);
    var header=[
      "TEST CODE","TEST NAME","TEST NAME used by LAB","TEST CODE used by LAB","HOME COLLECTION","PRICE","EFFECTIVE DATE"
    ];
    
    var ws=XLSX.utils.sheet_add_json(topDetails,this.medicalData,{header:header, origin: "A5"});
     
    ws['!cols'] = wscols;
  
    const wb_1: XLSX.WorkBook = XLSX.utils.book_new();
  
    XLSX.utils.book_append_sheet(wb_1, topDetails, 'SBIS');
    wb_1.Sheets['SBIS'] = ws;
    /* save to file */
    XLSX.writeFile(wb_1,'SBIS.xlsx');    
  }


  medicaldetail(){

    this._serviceProviderService.getMedicalCodeAndName().subscribe(data=>{
      console.log("response",data.data);
      let x=data.data;
    
      x.forEach(element => {
        let load={
          "TEST CODE":element.systemCode,
          "TEST NAME":element.longName,
          "TEST NAME used by LAB":"",
          "TEST CODE used by LAB":"",
          "HOME COLLECTION":"Y",
          "PRICE":"",
          "EFFECTIVE DATE":new Date()
        };
        this.medicalData.push(load);
      });  
     })
  }

  //Working on #1764
  backToPrev(){
    window.history.back();
  }
 
}

import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReportDownloadService } from 'src/app/shared/component/report-download/report-download.service'
import { DoctorService } from 'src/app/modules/doctor/doctor.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-report-download',
  templateUrl: './report-download.component.html',
  styleUrls: ['./report-download.component.css']
})
export class ReportDownloadComponent implements OnChanges, OnInit {
  headerArray:string[] = [];
  bodyArray:string[][] = [];
  formatedDate: string;
  @Input() exportDataSet: any[] = [];
  @Input() columnHeaders: any[] = [];
  @Input() title: string;
  @Input() pdfPaperSizeUnit: string = "a4";
  user:any;
  paperSizeUnitArr = ["4A0", "2A0", "A0", "A1", "A2", "A3", "A4", "A5", "A6", "A7", "A8", "A9", "A10"];
  paperSizeUnitValueArr = [1682, 1189, 841, 594, 420, 297, 210, 148, 105, 74, 52, 37, 26];
  selectedPaperSizeIndex = -1;
  profileData:any;
  constructor(private service : ReportDownloadService ,private _doctorService: DoctorService,private datePipe: DatePipe){}

  ngOnInit() {
      let paperSize = -1;
      for (let index = 0; index < this.paperSizeUnitArr.length && paperSize == -1; index++) {
        const paperSizeUnit = this.paperSizeUnitArr[index];
        if(paperSizeUnit.toLowerCase() == this.pdfPaperSizeUnit.toLowerCase()){
          paperSize = index;
        }
      }
      this.selectedPaperSizeIndex = paperSize;
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.pdfPaperSizeUnit){
      let paperSize = -1;
      for (let index = 0; index < this.paperSizeUnitArr.length && paperSize == -1; index++) {
        const paperSizeUnit = this.paperSizeUnitArr[index];
        if(paperSizeUnit.toLowerCase() == this.pdfPaperSizeUnit.toLowerCase()){
          paperSize = index;
        }
      }
      this.selectedPaperSizeIndex = paperSize;
      if(this.selectedPaperSizeIndex == -1){
        this.exportDataSet = [];
        alert("Wrong paper size selected");
      }
    }
    if(changes.exportDataSet){
      this.headerArray = [];
      this.bodyArray = [];
      if(this.exportDataSet != null && this.exportDataSet.length > 0){
        let exportDataObj = this.exportDataSet[0];
        Object.keys(exportDataObj).forEach(key => {
          this.headerArray.push(key);
        });
        for(let i = 0; i < this.exportDataSet.length; i++){
          let exportDataObj = this.exportDataSet[i];
          let arrRowVal = [];
          for(let j=0; j < this.headerArray.length; j++){
            exportDataObj[this.headerArray[j]] = (exportDataObj[this.headerArray[j]] == null || exportDataObj[this.headerArray[j]] == "null")?"":exportDataObj[this.headerArray[j]];
            arrRowVal.push(exportDataObj[this.headerArray[j]]);
          }
          this.bodyArray.push(arrRowVal);
        }
      }
    }
  }
   
  getFormateedDate(){
    
  }
 
  downloadPdf() {

    this.user = JSON.parse(localStorage.getItem("user"));
    console.log(this.user.refNo);
    console.log("User: ", this.user);
    var userName = this.user.userName;
    var dd = new Date().getDate();
    var mm = new Date().getMonth();
    var yy = new Date().getFullYear();

    var hhMM = new Date().getHours() + ":" + new Date().getMinutes();
    //this.formatedDate = mm + "-" + dd + "-" + yy;
    var formatedDateTime = new Date().toISOString().split("T")[0].split("-").reverse().join("-") + "  " + new Date().toLocaleTimeString('en-US',
      { hour12: false, hour: "numeric", minute: "numeric" });

    var doc = new jsPDF('p', 'mm', this.pdfPaperSizeUnit);
    if (typeof this.title === "undefined" || this.title == null || this.title == "null" || this.title.trim() == "") {
      this.title = "Data";
    }
    var pageCenter = this.paperSizeUnitValueArr[this.selectedPaperSizeIndex] / 2;
    var title = this.title;
    var titleUppercase = title.toUpperCase();

    if (this.user.entityName == "HOSPITAL") {
      var header = function (data) {
        doc.setFontSize(18);
        doc.setTextColor(40);
        //  doc.setFontStyle('normal');
        doc.text(titleUppercase, 20, 12, { align: 'left' });
        doc.setFontSize(12);
        doc.text("Generation Date:", 440, 15, { align: 'left' });
        doc.text(formatedDateTime, 500, 15, { align: 'left' });
        doc.text("Generated By:", 440, 21, { align: 'left' });
        doc.text(userName, 500, 21, { align: 'left' });
        doc.text("Generation Criteria:", 440, 27, { align: 'left' });
        doc.text('', 500, 27, { align: 'left' });
        //  doc.text(new Date().toLocaleString() , 500,35, {align:'left'});
      };

      // /sbis-poc/app/issues/1362
      doc.autoTableSetDefaults({

        headStyles: {
          fillColor: [152, 91, 186], lineColor: [136, 80, 167],
          lineWidth: 0.5
        },
        theme: 'grid',
        margin: { left: 20, right: 20, top: 35 }, didDrawPage: header
      });
      doc.autoTable(this.headerArray, this.bodyArray);
      let replaceVal = this.title.replace(/\s+/g, "_");
      doc.save(replaceVal + "_" + new Date().toISOString().split("T")[0].split("-").join("/"));

    }


    //doctor
    if (this.user.entityName == "DOCTOR") {
      let payload = {
        refNo: this.user.refNo
      }
      this._doctorService.fetchUserDtls(payload).subscribe((res) => {
        if (res != null) {
          this.profileData = res;
          console.log("Profile Data::", this.profileData);
          var doctorName = this.profileData.doctorName;
          var regNo = "Reg. No: " + this.profileData.registrationNo;
          console.log("Reg No::", regNo);
          var specializationDetails: string = "";
          var qualificationDetails: string = "";
          for (let doctrSpecialization of this.profileData.doctorSpecializationList) {
            if (doctrSpecialization.specialization != null) {
              if (specializationDetails.length == 0) {
                specializationDetails = specializationDetails + doctrSpecialization.specialization;
              }
              else {
                specializationDetails = specializationDetails + "," + doctrSpecialization.specialization;

                console.log("specializationDetai::", specializationDetails);
              }
            }
          }

          for (let qualification of this.profileData.doctorQualificationList) {
            if (qualification.shortCode != null) {
              if (qualificationDetails.length == 0) {
                qualificationDetails = qualificationDetails + qualification.shortCode;

              }
              else {
                qualificationDetails = qualificationDetails + "," + qualification.shortCode;

                console.log("qualificationDetails ::", qualificationDetails);
              }

            }

          }



          // var header = function (data) {
          //   let formatedDateTime = new Date().toISOString().split("T")[0].split("-").reverse().join("-") + "  " + new Date().toLocaleTimeString('en-US',
          //     { hour12: false, hour: "numeric", minute: "numeric" });
          //   doc.setTextColor(77, 77, 77);
          //   doc.text(20, 20, doctorName);
          //   doc.setFontSize(11);
          //   doc.text(20, 25, qualificationDetails);

          //   doc.text(20, 32, regNo);
          //   doc.text(20, 40, specializationDetails);

          //   doc.rect(10, 10, 574, 35);
          //   //doc.text(10, 55, doctorName);
          //   doc.rect(10, 10, 574, 70);
          //   doc.setFontSize(18);
          //   doc.setTextColor(40);
          //   doc.setFontStyle('normal');
          //   doc.text(20, 55, title);
          //   //doc.text(title,data.settings.margin.left, 50);
          //   doc.text(450, 55, "Generation Date: " + formatedDateTime, { align: 'left' });
          //   doc.text(450, 65, "Generated by: " + userName, { align: 'left' });
          //   doc.text(450, 75, "Generation criteria: ", { align: 'left' });

          // };
          var header = function (data) {


            doc.setTextColor(77, 77, 77);
            doc.text(20, 20, doctorName);
            doc.setFontSize(11);
            doc.text(20, 26, qualificationDetails);
            doc.text(20, 32, specializationDetails);
            doc.text(20, 38, regNo);
            doc.rect(10, 10, 574, 35);
            //doc.text(10, 55, doctorName);



            doc.setFontSize(18);
            doc.setTextColor(40);
            doc.text(titleUppercase, 20, 55, { align: 'left' });
            doc.setFontSize(12);

            doc.text("Generation Date:", 440, 55, { align: 'left' });
            doc.text(formatedDateTime, 500, 55, { align: 'left' });
            doc.text("Generated By:", 440, 61, { align: 'left' });
            doc.text(userName, 500, 61, { align: 'left' });
            doc.text("Generation Criteria:", 440, 67, { align: 'left' });
            doc.text('', 500, 67, { align: 'left' });
            //  doc.text(new Date().toLocaleString() , 500,35, {align:'left'});
          };

          /*         doc.autoTableSetDefaults({
                    headStyles: {
                      fillColor: [152, 91, 186], lineColor: [136, 80, 167],
                      lineWidth: 0.5
                    },
                    theme: 'grid',
                    margin: { top: 80, left: 10, right: 10 }, didDrawPage: header
                  });
                  doc.autoTable(this.headerArray, this.bodyArray);
                  let replaceVal = this.title.replace(/\s+/g, "_");
                  doc.save(replaceVal + "_" + new Date().toISOString().split("T")[0].split("-").join("/")); */


          doc.autoTableSetDefaults({

            headStyles: {
              fillColor: [152, 91, 186], lineColor: [136, 80, 167],
              lineWidth: 0.5
            },
            theme: 'grid',
            styles: {
              cellWidth: 'wrap'
            },
            columnStyles: {
              0: {cellWidth: 10},
              1: {cellWidth: 10},
              2: {cellWidth: 10},
              3: {cellWidth: 60},
              4: {cellWidth: 10},
              5: {cellWidth: 10},
              6: {cellWidth: 60},
              7: {cellWidth: 80},
              8: {cellWidth: 60},
              9: {cellWidth: 80},
              10: {cellWidth: 30},
              11: {cellWidth: 60}
            
              
            },
            margin: { left: 20, right: 20, top: 80 }, didDrawPage: header
          });
          doc.autoTable(this.headerArray, this.bodyArray);
          let replaceVal = this.title.replace(/\s+/g, "_");
          doc.save(replaceVal + "_" + new Date().toISOString().split("T")[0].split("-").join("/"));


        }
      })
    }
    //doctor
  }

downloadExcel(){
    if(typeof this.title === "undefined" || this.title == null || this.title == "null" || this.title.trim() == ""){
      this.title = "data";
    }
    var title = this.title;
    // /sbis-poc/app/issues/1362
    let replaceVal = this.title.replace(/\s+/g, "_");
    console.log("excelData::",this.exportDataSet);
    console.log("columnHeaders::::",this.columnHeaders);
    let excelDataSet: any[] = this.exportDataSet;

    excelDataSet = this.convertAccordingToColumnHeader(excelDataSet);
    
    this.service.exportAsExcelFile(excelDataSet, replaceVal+"_"+Math.floor(Math.random() * 100000000), title);
}

  convertAccordingToColumnHeader(excelDataSet) {
    let headersToBeconvert: any[] = this.columnHeaders.filter(x=> x.displayType != 'String');
    excelDataSet.forEach(x=>
       Object.keys(x).forEach(key => {
         headersToBeconvert.find(fx=> fx.columnHeading == key) ? 
         x[key] = this.dataConversion(x[key],headersToBeconvert[headersToBeconvert.findIndex(fInd=> fInd.columnHeading == key)])
         : (x = x);
       })
    );

    return excelDataSet;
  }//end of method
  
  dataConversion(columnVal: any, headersToBeconvert: any) {
    let displayType = headersToBeconvert.displayType.toLowerCase().search("decimal") != -1? "decimal": headersToBeconvert.displayType;

    switch(displayType.toLowerCase()){
      case "date":{
        columnVal = new Date(columnVal);
        break;
      }
      case "decimal" : {
        columnVal = parseFloat(columnVal);
        break;
      }
      case "number": {
        columnVal = parseInt(columnVal);
        break;
      }
      // case "datetime":{
      //   columnVal = this.datePipe.transform(new Date(columnVal), "MM-dd-yyyy, h:mm:ss a");
      //   break;
      // }
    }

    return columnVal;
  }//end of method




}

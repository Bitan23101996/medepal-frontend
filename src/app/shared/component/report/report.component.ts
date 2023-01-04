import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { ToastService } from '../../../core/services/toast.service';


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  apiUrl = environment.apiUrl;
  @Input() fileName;
  @Input() reportType;
  @Input() pk;
  @Input() isPrint;
  @Input() preprinted;
  @Input() customType;

  constructor(private apiService: ApiService, private http:HttpClient, private toastService: ToastService) { }

  ngOnInit() {
    console.log("ngOnInit=>"+ this.isPrint);
  }

  generatePdf(){
    var fileName = "Report";
    var a = document.createElement("a");
    
    // Issue app#1267 - prescription pad
    if (this.customType == null || this.customType != 'BLANK')
      this.customType = 'PRES';

    return this.http.get(this.apiUrl+"gen/v4/common/generateReport" + "/" + this.reportType + "/" + this.pk + "/"+ this.preprinted + "/"+this.customType, { responseType:'blob' }).map((result) => {
          //return new Blob([result], { type: 'application/pdf' });
          var file = new Blob([result], {type: 'application/pdf'});
          var fileURL = URL.createObjectURL(file);
          
          
          if(this.isPrint == "Y"){
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
            // a.download = this.fileName;
            // a.click();
            // window.open(fileURL);
            //console.log(result);
            //this.toastService.showI18nToast("Download successful.","success");
          }
          else{
            a.href = fileURL;
            a.download = this.fileName;
            a.click();
            window.open(fileURL);
            //console.log(result);
            this.toastService.showI18nToast("Download successful.","success");
          }
          
          
      }).toPromise();
    }
  }


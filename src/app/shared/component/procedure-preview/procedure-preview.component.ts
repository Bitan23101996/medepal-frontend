import { Component, OnInit, Input } from '@angular/core';
import { ServiceProviderService } from '../../../modules/service-provider/service-provider.service';
import { ToastService } from '../../../core/services/toast.service';
import { DoctorService } from '../../../modules/doctor/doctor.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-procedure-preview',
  templateUrl: './procedure-preview.component.html',
  styleUrls: ['./procedure-preview.component.css']
})
export class ProcedurePreviewComponent implements OnInit {

  @Input() procedureNote: any;
  procedure: any;
  age: any = "Not Specified";
  specializations = "";
  qualifications = "";
  doctorQualifications: any = [];
  doctorSpecializations: any = [];
  domSanitizer: any;

  constructor(private serviceProviderService: ServiceProviderService,
              private toastService: ToastService,
              private doctorService: DoctorService,
              private _domSanitizer: DomSanitizer) {
                this.domSanitizer = _domSanitizer;
               }

  ngOnInit() {
    if(this.procedureNote.procedureRefNo!=null){
      this.getProcedureNoteByRefNo(this.procedureNote.procedureRefNo);
    }
      
  }

  downloadedFiles: any = [];
  canvasImage: any;
  getProcedureNoteByRefNo(procedureRefNo){
    let payload = {
      "procedureRefNo" : procedureRefNo
    }
    this.doctorService.getProcedureNoteByRefNo(payload).subscribe((data) => {
      if (data.status == 2000) {      
        console.log(data);
        this.procedure = data['data'];

        for(let i=0;i<this.procedure.procedureUploadDtoList.length;i++){
         if(this.procedure.procedureUploadDtoList[i].canvasImage=="N") {
          if(this.procedure.procedureUploadDtoList[i].filePath!=null){
            let data = {
              fileName: null,
              file: null
            }
            data = {
              fileName: this.procedure.procedureUploadDtoList[i].fileName,
              file: "data:image/jpeg;base64," + this.procedure.procedureUploadDtoList[i].downloadedFile
            }
            this.downloadedFiles.push(data);
          }
         }
         else{
          if(this.procedure.procedureUploadDtoList[i].filePath!=null){
            this.canvasImage = "data:image/jpeg;base64," + this.procedure.procedureUploadDtoList[i].downloadedFile;
          }
         }
        }
        

        if(data['data'].individualUserEntity.dateOfBirth != null){
          const bdate = new Date(data['data'].individualUserEntity.dateOfBirth);
          const timeDiff = Math.abs(Date.now() - bdate.getTime() );

          // app#823 - if age < 1 year show in month; if < 1 month show in days; also handle singular / plural
          let ageInDays = Math.floor(timeDiff / (1000 * 3600 * 24));
          if (ageInDays == 1)
            this.age = "1D";
          else if (ageInDays < 30)
            this.age = ageInDays + "D";
          else if (ageInDays < 60)
            this.age = "M";
          else if (ageInDays < 365)
            this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 30) + "M";
          else if (ageInDays <= 2*365)
            this.age = "Y";
          else
            this.age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365) + "Y";
        }
        // Formulate comma-separated qualifications and specializations
  
        if(data['data'].doctor!=null){
          let spec=[];
          let qual = []
          spec = data['data'].doctor.doctorSpecializations;
          qual = data['data'].doctor.doctorQualifications;
          
          for(let i = 0; i<spec.length; i++){
            this.doctorSpecializations.push(spec[i].specialization)
          }
    
          for(let i = 0; i<qual.length; i++){
            this.doctorQualifications.push(qual[i].qualificationShort);
            
          }
          this.specializations = this.doctorSpecializations.join(', ')
    
          this.qualifications = this.doctorQualifications.join(', ')
        }
        
      }
    });
  }

  downloadFile(downloadedFile){
    const link = document.createElement('a');
    link.href = downloadedFile.file;
    link.download = downloadedFile.fileName;//this.download.forUserName.replace(/\./g, '_') + "_" + this.download.doctorName.replace(/\./g, '_');
    link.click();
  }

  generateReport(procedureRefNo){
    
    let payload = {
     procedureRefNo:procedureRefNo,
     reportId:"PROCEDURE_NOTE"
    }
    this.serviceProviderService.downloadFile(payload).subscribe(response => {
      var fileName = procedureRefNo;
      var a = document.createElement("a");
      var file = new Blob([response], {type: 'application/pdf'});
      var fileURL = URL.createObjectURL(file);

      // var w = window.open("about:blank");

      // var iframe = document.createElement('iframe');
      // iframe.src = fileURL;
      // iframe.focus();
      // iframe.onload = function() {
      //   iframe.contentWindow.print();
      // };

      // w.document.body.appendChild(iframe);
      // w.document.body.style.display = "none";
      a.href = fileURL;
      a.download = fileName;
      a.click();
      window.open(fileURL);
      this.toastService.showI18nToast("Download successful.","success");
    })
  }

}

import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ModalService } from 'src/app/shared/directive/modal/modal.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { CoreService } from '../../core.service';
import { ToastService } from '../../services/toast.service';
import { HttpClient, HttpHeaders, HttpEvent, HttpRequest, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  @ViewChild('feedbackModal') feedbackModal: TemplateRef<any>;
  feedbackForm: FormGroup;
  user_refNo: string;
  user_rolePk: number;
  isUpload: any = false;
  feedbackButton: boolean = false;
  feedbacks: any[] = [];
  selectedFiles: any;
  modalRef: BsModalRef;
  config = {
    class: 'modal-lg',
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(
    private frb: FormBuilder,
    private modalService: ModalService,
    private bsModalService: BsModalService,
    private coreService: CoreService,
    private _toastService: ToastService,
    private http: HttpClient
  ) {
    this.feedbackForm = frb.group({
      'doctorName': [null, [Validators.required]],
      'forUserPk': [null, [Validators.required]],
      'file': [null, [Validators.required]],
      'documents': [null],
      'date': [new Date()],
      'fileUploadFor': ['PRESCRIPTION'],
      'isSubmit': [false],
      'myFeedback': [null, [Validators.required]]
    });
   }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_refNo = user.refNo;
    this.user_rolePk = user.rolePk;
  }

  addFeedback() {
    this.selectedFiles = "";
    this.feedbackForm.reset();
    this.getFeedBack();
    this.modalRef = this.bsModalService.show(this.feedbackModal, this.config);
  }

  setFeedback(event) {
    // console.log(event);
    this.feedbackButton = false;
    let query = {
      "userRefNo": this.user_refNo,
      "rolePk": this.user_rolePk,
      "feedback": this.feedbackForm.get('myFeedback').value
    }
    if(this.isUpload == true) {// comment with attached document
      this.onSubmit(query);
    } else {
      this.coreService.setFeedback(query).subscribe((resp) => {
        if(resp.status == 2000) {
          this.feedbackForm.patchValue({
            'myFeedback': ""
          });
          this.getFeedBack();
          
        }
      });
    }
  }

  getFeedBack() {
    let query = {
      "userRefNo": this.user_refNo
    }
    this.coreService.getFeedback(query).subscribe((result) => {
      if(result.status === 2000) {
        this.feedbackButton = false;
        let index: number = 0;
        for(let feedbackDate of result.data) {
          result.data[index].feedbackTime = new Date(feedbackDate.feedbackTime);
          index = index+1;
        }
        this.feedbacks = result.data.reverse();
      }
    })
  }

  feedbackFileSelected(event) {
    let fileEvent = event.target.files[0];
    if((fileEvent.type == "image/jpeg") || (fileEvent.type == "application/pdf") || (fileEvent.type == "image/png")) {
      //do nothing
    } else {
      this._toastService.showI18nToast("File type should be jpg/png/pdf", "warning");
      return;
    }
    if(fileEvent.size > 2000000) {
      this._toastService.showI18nToast("File size will not more then 2mb", "warning");
      return;
    } 
    this.feedbackForm.patchValue({
      file: event.target.files[0]
    });
    this.selectedFiles = fileEvent.name;
    this.isUpload = true;
  }

  onSubmit(query) {
    let valueData = this.feedbackForm.value;

    let formdata = new FormData();
    let feedbackFileUpload = JSON.stringify({
      "userRefNo": this.user_refNo,
      "rolePk": this.user_rolePk,
      "feedback": this.feedbackForm.get('myFeedback').value,
      "fileUploadFor": "FEEDBACK"      
    });

    formdata.append('file', valueData.file);
    formdata.append('document', feedbackFileUpload);


    this.uploadDocumentWithComment(formdata).subscribe(event => {
      if (event instanceof HttpResponse) {
        let response = JSON.parse(event.body);
        if (response.status = 2000) {
          // this.feedbackForm.patchValue({
          //   'myFeedback': ""
          // });
          this.feedbackForm.reset();
          this.selectedFiles = "";
          this.isUpload = false;
          this.getFeedBack();
        } else {
          this._toastService.showI18nToast(response.message, 'error')
        }
      }
    });
  }

  uploadDocumentWithComment(formData: any): Observable<any> {
    let req = new HttpRequest('POST', environment.apiUrl + 'gen/v1/upload-document', formData, {      
      responseType: 'text'
    });
    return this.http.request(req);   
  }

  downloadFile(feedback){
    let query = {
      downloadFor: "FEEDBACK",
      feedbackRefNo: feedback.refNo
    }
    this.coreService.feedbackDownloadFile(query).subscribe((resp) => {
      if(resp.status == 2000) {
        const link = document.createElement('a');
        link.href =  "data:"+resp.data.contentType+";base64," + resp.data.data;
        link.download = resp.data.fileName;
        link.click();
      }
    });
  }

  feedbackTextField() {
    if(this.feedbackForm.get('myFeedback').value != "") {
      this.feedbackButton = true;
    } else {
      this.feedbackButton = false;
    }
  }

}

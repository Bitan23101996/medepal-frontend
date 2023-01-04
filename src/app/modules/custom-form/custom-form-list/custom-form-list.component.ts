import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';
import { BroadcastService } from '../../../core/services/broadcast.service';
import { CustomFormService } from '../custom-form.service';

@Component({
  selector: 'app-custom-form-list',
  templateUrl: './custom-form-list.component.html',
  styleUrls: ['./custom-form-list.component.css']
})
export class CustomFormListComponent implements OnInit {

  formList: any = [];
  constructor(
    private customFormService: CustomFormService,
    private broadcastService: BroadcastService,
    private toastService: ToastService,
    private router: Router
  ) { }

  ngOnInit() {
    this.broadcastService.setHeaderText("My Form List");
    this.getFormList();
  }

  getFormList() {
    this.customFormService.GetFormList().subscribe((res) => {
      this.formList = res.data;
    })
  }

  backToForm(){
    this.router.navigate(["custom-form/create"]);
  }

  editForm(form){
    this.router.navigate(["custom-form/edit", {formRefNo: form.formRefNo}]);
  }

  deleteForm(f){
    this.customFormService.deleteCustomForm(f).subscribe((res) => {
      if(res.status==2000){
        this.toastService.showI18nToastFadeOut("Form Deleted successfully", "success");
        this.getFormList();
      }
    })
    
  }
}

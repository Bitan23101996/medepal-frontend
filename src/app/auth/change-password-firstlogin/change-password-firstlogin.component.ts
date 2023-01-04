import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { IndividualService } from '../../modules/individual/individual.service';
import { ModalService } from '../../shared/directive/modal/modal.service';
import { ToastService } from '../../core/services/toast.service';
import { BroadcastService } from '../../core/services/broadcast.service';
import { AuthService } from '../auth.service';
import { UserStateRuleService } from '../userStateRuleService';

@Component({
  selector: 'app-change-password-firstlogin',
  templateUrl: './change-password-firstlogin.component.html',
  styleUrls: ['./change-password-firstlogin.component.css']
})
export class ChangePasswordFirstloginComponent implements OnInit {

  user_id: any;
  ms_user_id: any;
  changePasswordForm: FormGroup;
  regProvider: any;
  hasPassword: any;
  changePasswordFormSubmitted: any = false;
  profileVerified: any;

  constructor(private route: ActivatedRoute,  
    private frb: FormBuilder,
    private translate: TranslateService,
    private router: Router,
    private _location: Location,
    private toastService: ToastService,
    private modalService: ModalService,
    private activatedRoute: ActivatedRoute,
    private individualService :IndividualService,
    private broadcastService: BroadcastService,
    private userStateRuleService: UserStateRuleService,
    private authService: AuthService) {
      this.changePasswordForm = frb.group({
        'oldPassword': [null, Validators.required],
        'newPassword': [null, [Validators.required,Validators.pattern(/^[A-Za-z\d]{8,20}/)]],
        'repeatPassword': [null, [Validators.required,Validators.pattern(/^[A-Za-z\d]{8,20}/)]],
        'setPassword': [null, [Validators.required,Validators.pattern(/^[A-Za-z\d]{8,20}/)]]
      });
      // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('en');
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('en'); // this language will be used as a fallback when a translation isn't found in the current language
      translate.setDefaultLang('en');
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('en');
     }

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem('user'));
    this.user_id = user.id;
    this.ms_user_id = user.userId;
    this.regProvider = user.registrationProvider;
    this.hasPassword = user.hasPassword;
    this.profileVerified = user.profileVerified;
  }

  onSubmit(formValue) {
    this.changePasswordFormSubmitted = true;
    // if(this.changePasswordForm.invalid){
    //   return;
    // }
    if (formValue.oldPassword == null && formValue.newPassword == null && formValue.repeatPassword == null) {
      this.toastService.showI18nToast("TOAST_MSG.FILLOUT_FIELDS", 'warning');
    } else if (formValue.newPassword == null) {
      this.toastService.showI18nToast("TOAST_MSG.ENTER_NEW_PASSWORD", 'warning');
    } else if (formValue.repeatPassword == null) {
      this.toastService.showI18nToast('TOAST_MSG.ENTER_NEW_PASSWORD_AGAIN', 'warning');
    } else if(formValue.newPassword!==formValue.repeatPassword){
      this.toastService.showI18nToast('TOAST_MSG.NEW_REPEAT_PASSWORD_NOT_SAME', 'warning');
    }
    else {
    this.individualService.changePassword({
       'oldPassword': formValue.oldPassword,
       'newPassword': formValue.newPassword,
       'repeatPassword': formValue.repeatPassword,
       'userId': this.ms_user_id
      }).subscribe((data) => {
      this.changePasswordFormSubmitted = false;
      if (data.status === 2000) {
        this.toastService.showI18nToast(data.message, 'success');
        if(!this.profileVerified) {
          this.router.navigate(['/auth/verifications']);
        } else {
          let user = JSON.parse(localStorage.getItem('user'));
          // Change to v2 of getUserState (as part of app#974)
          let query = {
            'roleName': user.roleName,
            'entityName': user.entityName,
            'msUserPk': user.userId
          }
          // this.authService.getUserState(user.entityName+'/'+user.roleName + '/' + user.userId).subscribe((result) => {
            this.authService.getUserStateV2(query).subscribe(result => {
            if(result.status == 2000) {
              let nevigate = this.userStateRuleService.userNevigationRules[result.data.stateString];
              if(nevigate.toString().indexOf("/auth/")==-1){
                this.broadcastService.setAuth(true);
              }else{
                this.broadcastService.setAuth(false);
              }
              this.router.navigate([nevigate]);
            }
          });
        }
      } else { this.toastService.showI18nToast(data.message, 'error'); }
    },
      (error) => {

      });
    // submit the value get the data show on dashbpard
   }
  }

}

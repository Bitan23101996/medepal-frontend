import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SysAdminComponent } from './sysadmin.component';
import { SysAdminRoutingModule } from './sysadmin-routing.module';
import { VerifyDoctorRegistrationComponent } from './verify-doctor-registration/verify-doctor-registration.component';
import { SearchDoctorToVerifyComponent } from './search-doctor-to-verify/search-doctor-to-verify.component';
import { SharedModule } from '../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyFormComponent } from './verify-doctor-registration/verify-form/verify-form.component';
import { SearchActionComponent } from './search-doctor-to-verify/search-action/search-action.component';
import { SearchUserComponent } from './search-user/search-user.component';//working on system admin issue[set password for a user]

@NgModule({
  imports: [
    CommonModule,
    SysAdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    
  ],
  declarations: [SysAdminComponent, VerifyDoctorRegistrationComponent, SearchDoctorToVerifyComponent, VerifyFormComponent, SearchActionComponent,
    SearchUserComponent//working on system admin issue[set password for a user]
  ]
})
export class SysadminModule { }

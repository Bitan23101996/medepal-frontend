import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomFormComponent } from './custom-form.component';
import { CustomFormMasterComponent } from './custom-form-master/custom-form-master.component';
import { CustomFormListComponent } from './custom-form-list/custom-form-list.component';
import { CustomFormFillupComponent } from './custom-form-fillup/custom-form-fillup.component';

const routes: Routes = [{
  path: '',
  component: CustomFormComponent,
  children: [
      {
          path: 'create',
          component: CustomFormMasterComponent,
      },
      {
        path: 'edit',
        component: CustomFormMasterComponent,
      },
      {
        path: 'list',
        component: CustomFormListComponent,
      },
      {
        path: 'fillup',
        component: CustomFormFillupComponent,
      },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomFormRoutingModule { }

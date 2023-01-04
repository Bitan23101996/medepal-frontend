import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { PeerConsultingComponent } from './peer-consulting.component';
import { PeerConsultingRequestComponent } from '../peer-consulting/peer-consulting-request/peer-consulting-request.component';
import { PeerConsultingPanelListComponent } from '../peer-consulting/peer-consulting-panel-list/peer-consulting-panel-list.component';
import { PeerConsultingCaseDetailsComponent } from '../peer-consulting/peer-consulting-case-details/peer-consulting-case-details.component';

const routes: Routes = [
  {
    path: '',
    component: PeerConsultingComponent,
    children: [
      {
        path: 'peer-consulting-request',
        component: PeerConsultingRequestComponent
      },
      {
        path: 'peer-consulting-panel-list',
        component: PeerConsultingPanelListComponent
      },
      {
        path: 'peer-consulting-case-details',
        component: PeerConsultingCaseDetailsComponent
      }
    ]
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class PeerConsultingRoutingModule { }

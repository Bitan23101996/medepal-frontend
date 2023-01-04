import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BroadcastService } from '../../../core/services/broadcast.service';

@Component({
  selector: 'app-registration-workflow',
  templateUrl: './registration-workflow.component.html',
  styleUrls: ['./registration-workflow.component.css']
})
export class RegistrationWorkflowComponent implements OnInit {

  @Input() isRegistrationWorkflowCompleted: boolean =false;
  @Input() workflow: any;
  // isValidProfile: boolean =false;
  // isChabmerOrAddressExist: boolean =false;
  workFlowSteps: any = [];
  currentStepNo: any;

  constructor(private _route: Router, private broadcastService: BroadcastService) { }

  ngOnInit() {
    // this.isValidProfile = this.workflow.validProfile;
    // this.isChabmerOrAddressExist = this.workflow.isChabmerOrAddressExist;
    this.workFlowSteps = this.workflow.registrationWorkflowSteps;
    this.currentStepNo = this.workflow.currentStepNo;
    this.broadcastService.getRegistrationWorkflow().subscribe(workflow => {
      this.isRegistrationWorkflowCompleted = workflow.registrationWorkflowCompleted;
      // this.isValidProfile = workflow.validProfile;
      this.currentStepNo = workflow.currentStepNo;
    });
  }

  navigateUrl(url){
    this._route.navigate([url]);
  }

}

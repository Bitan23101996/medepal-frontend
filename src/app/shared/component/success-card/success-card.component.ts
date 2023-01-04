import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-card',
  templateUrl: './success-card.component.html',
  styleUrls: ['./success-card.component.css']
})
export class SuccessCardComponent implements OnInit {

  @Input() successMsgEl : any;
  @Input() successMsgFor : any;
  
  constructor(private router: Router) { }

  ngOnInit() {
  }

  navigate(userType){
    if(userType == 'D'){
      this.router.navigate(["/searchPatient"]);
    }
    if(userType == 'I'){
      this.router.navigate(["/search"]);
    }
  }
}

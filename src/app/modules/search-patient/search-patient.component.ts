import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-patient',
  templateUrl: './search-patient.component.html',
  styleUrls: ['./search-patient.component.css']
})
export class SearchPatientComponent implements OnInit {
 
  constructor( private translate: TranslateService){
    translate.setDefaultLang('en');
    translate.use('en');

  }
  ngOnInit() {
    const url = window.location.href.toString();
    if (url.indexOf('/prescription') > 0) {
      document.body.classList.add('prescription-screen');
    }else{
      document.body.classList.remove('prescription-screen');
    }
  }
  


 
}

import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: 'google-map-modal',
    templateUrl: './google-map.component.html',
    styleUrls: ['./google-map.component.css']
})

export class GoogleMApComponent implements OnInit {
    @Input('lat') lat: number;
    @Input('long') long: number;
    
  

    constructor() { }
    ngOnInit() {        
    }//end of oninit
}//end of class
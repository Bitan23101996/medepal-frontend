import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css']
})
export class PrintComponent implements OnInit {

  constructor() { }

  @Input() printSectionId: any;

  ngOnInit() {
  }

}

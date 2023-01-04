import { Component, OnInit } from '@angular/core';
import { IndividualService } from '../individual.service';
import { BroadcastService } from '../../../core/services/broadcast.service';

@Component({
  selector: 'app-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.css']
})
export class DragAndDropComponent implements OnInit {

  constructor(
    private _individualService: IndividualService,
    private broadcastService: BroadcastService
  ) { }

  availableCars: any[];
    
  selectedCars: any[];
  
  draggedCar: any;
  
  ngOnInit() {
    this.broadcastService.setHeaderText('Drag & Drop');
      let user = JSON.parse(localStorage.getItem('user'));
      this.selectedCars = [];
      this._individualService.getGroupMember(user.refNo + '?permission=ALL').subscribe((resp) => {
        this.availableCars = resp.data;
      })
      // this.carService.getCarsSmall().then(cars => this.availableCars = cars);
  }
  
  dragStart(event,group) {
      this.draggedCar = group;
  }
  
  drop(event) {
      if(this.draggedCar) {
          let draggedCarIndex = this.findIndex(this.draggedCar);
          this.selectedCars = [...this.selectedCars, this.draggedCar];
          this.availableCars = this.availableCars.filter((val,i) => i!=draggedCarIndex);
          this.draggedCar = null;
      }
  }
  
  dragEnd(event) {
      this.draggedCar = null;
  }
  
  findIndex(minor) {
      let index = -1;
      for(let i = 0; i < this.availableCars.length; i++) {
          if(minor.vin === this.availableCars[i].vin) {
              index = i;
              break;
          }
      }
      return index;
  }


}

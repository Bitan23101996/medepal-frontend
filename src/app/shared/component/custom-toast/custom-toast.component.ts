import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { fromEvent, Observable} from 'rxjs';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'custom-toast-component',
  templateUrl: './custom-toast.component.html',
  styleUrls: ['./custom-toast.component.css']
})
export class CustomToastComponent implements OnInit {
  offlineStatus: boolean = false;
  onlineStatus: boolean = false;
  slowStatus: boolean = false;
  verySlowStatus: boolean = false;
  @Input() conStatus: string;
  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  subscriptions: Subscription[] = [];
  connectionStatusMessage: string;
  connectionStatus: string;
  connected: boolean = true;
  connectionStatusMsg: string;
  subscription: Subscription;

  constructor() {


   }


   connection$ = new Observable((observer) => {
      const conn = (navigator as any).connection;
      const  effectiveType  = conn.effectiveType;
      observer.next(effectiveType);

      const onConnectionChange = () => {
        const  effectiveType  = conn.effectiveType;
        observer.next(effectiveType);
      }

      (navigator as any).connection.addEventListener('change', onConnectionChange)

      return () => {
        (navigator as any).connection.removeEventListener('change', onConnectionChange);
        observer.complete();
      }
    });

  //undoString = 'undo';
  ngOnInit(){


    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');


    this.subscriptions.push(this.onlineEvent.subscribe(event => {
            if(this.offlineStatus){
              this.offlineStatus = false;
            }
            this.connectionStatusMessage = 'You are back online';
            this.connectionStatus = 'online';
            this.slowStatus = false;
            this.onlineStatus = true;
           //this.toastService.showI18nToastFadeOut(this.connectionStatusMessage, 'success');
           setTimeout(() => {
               if(this.onlineStatus){
                 this.onlineStatus = false;
               }
           },3000);
    }));

    this.subscriptions.push(this.offlineEvent.subscribe(e => {
            if(this.onlineStatus){
              this.onlineStatus = false;
            }
            this.connectionStatusMessage = 'You are offline';
            this.connectionStatus = 'offline';
          //  this.toastService.showI18nToast(this.connectionStatusMessage, 'error');
            this.offlineStatus = true;
            setTimeout(() => {
                if(this.offlineStatus){
                  this.offlineStatus = false;
                }
            },3000);

    }));

    this.subscription = this.connection$
        .subscribe((effectiveType: string) => {
          //console.log(effectiveType);
        if(effectiveType == "2g"){
            this.verySlowStatus = true;
            setTimeout(() => {
                this.verySlowStatus = false;
            },3000);
            //this.toastService.showI18nToastFadeOut('Slow network connection !!', 'warning');
          }

        })



  }


  ngOnDestroy(){
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }





}

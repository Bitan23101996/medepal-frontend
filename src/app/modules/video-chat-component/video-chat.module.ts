import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { VideoChatComponent } from './components/video-chat.component';
import { PublisherComponent } from './publisher/publisher.component';
import { SubscriberComponent } from './subscriber/subscriber.component';
import { VideoChatService } from './services/video-chat.services';

@NgModule({
  declarations: [VideoChatComponent, PublisherComponent, SubscriberComponent],
  imports: [
    CommonModule,
    FormsModule, 
    ReactiveFormsModule,
    NgbModule
  ],
  exports:[
    VideoChatComponent
  ],
  providers: [
    VideoChatService
  ]
})
export class VideoChatModule { }

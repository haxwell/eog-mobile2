import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialOutgoingRequestMadePageRoutingModule } from './tutorial-outgoing-request-made-routing.module';

import { TutorialOutgoingRequestMadePage } from './tutorial-outgoing-request-made.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TutorialOutgoingRequestMadePageRoutingModule
  ]
  ,declarations: [
  	TutorialOutgoingRequestMadePage
  ]
  ,exports: [
	TutorialOutgoingRequestMadePage
  ]
  ,entryComponents: [
  	TutorialOutgoingRequestMadePage
  ]
})
export class TutorialOutgoingRequestMadePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialAcceptRequestPageRoutingModule } from './tutorial-accept-request-routing.module';

import { TutorialAcceptRequestPage } from './tutorial-accept-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // TutorialAcceptRequestPageRoutingModule
  ]
  ,declarations: [
  	TutorialAcceptRequestPage
  ]
  ,exports: [
  	TutorialAcceptRequestPage
  ]
  ,entryComponents: [
  	TutorialAcceptRequestPage
  ]
})
export class TutorialAcceptRequestPageModule {}

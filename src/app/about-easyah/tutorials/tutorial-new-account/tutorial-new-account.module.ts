import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialNewAccountPageRoutingModule } from './tutorial-new-account-routing.module';

import { TutorialNewAccountPage } from './tutorial-new-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // TutorialNewAccountPageRoutingModule
  ]
  ,declarations: [
  	TutorialNewAccountPage
  ]
  ,exports: [
  	TutorialNewAccountPage
  ]
  ,entryComponents: [
  	TutorialNewAccountPage
  ]
})
export class TutorialNewAccountPageModule {}

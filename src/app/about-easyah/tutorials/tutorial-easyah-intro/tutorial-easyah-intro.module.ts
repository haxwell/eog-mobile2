import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

// import { TutorialEasyahIntroPageRoutingModule } from './tutorial-easyah-intro-routing.module';

import { TutorialEasyahIntroPage } from './tutorial-easyah-intro.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // TutorialEasyahIntroPageRoutingModule
  ]
  ,declarations: [
  	TutorialEasyahIntroPage
  ]
  ,exports: [
	  TutorialEasyahIntroPage
  ]
  ,entryComponents: [
  	TutorialEasyahIntroPage
  ]
})
export class TutorialEasyahIntroPageModule {}

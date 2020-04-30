import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialsListPageModule } from './tutorials-list/tutorials-list.module';
import { TutorialEasyahIntroPageModule } from './tutorial-easyah-intro/tutorial-easyah-intro.module';

import { TutorialService } from './_services/tutorial.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule
    ,TutorialsListPageModule
    ,TutorialEasyahIntroPageModule
  ]
  ,providers: [
  	TutorialService
  ]
})
export class TutorialsModule { }

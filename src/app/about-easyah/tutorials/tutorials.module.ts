import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorialsListPageModule } from './tutorials-list/tutorials-list.module';
import { TutorialEasyahIntroPageModule } from './tutorial-easyah-intro/tutorial-easyah-intro.module';
import { TutorialBasicConceptsPageModule } from './tutorial-basic-concepts/tutorial-basic-concepts.module';
import { TutorialAcceptRequestPageModule } from './tutorial-accept-request/tutorial-accept-request.module';

import { TutorialService } from './_services/tutorial.service'
import { PresentTutorialService } from './_services/present-tutorial.service'

@NgModule({
  declarations: [],
  imports: [
    CommonModule
    ,TutorialsListPageModule
    ,TutorialEasyahIntroPageModule
    ,TutorialBasicConceptsPageModule
    ,TutorialAcceptRequestPageModule
  ]
  ,providers: [
  	TutorialService,
    PresentTutorialService
  ]
})
export class TutorialsModule { }

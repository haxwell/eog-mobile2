import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

// import { AbstractTutorialPage } from './abstract-tutorial.page'
import { OutgoingRequestMadeTutorialPage } from './tutorial-outgoing-request-made/outgoing-request-made-tutorial.page'
// import { TutorialEasyahIntroPage } from './tutorial-easyah-intro/tutorial-easyah-intro'
import { AcceptRequestTutorialPage } from './tutorial-accept-request/accept-request.tutorial'
import { TutorialBasicConceptsPage } from './tutorial-basic-concepts/tutorial-basic-concepts'

@NgModule({
  imports: [
    IonicModule,
    CommonModule
    ,FormsModule
  ]
  ,declarations: [
    OutgoingRequestMadeTutorialPage
    // ,TutorialEasyahIntroPage
    ,AcceptRequestTutorialPage
    ,TutorialBasicConceptsPage
  ]
  ,providers: [

  ],
  exports: [ 
    OutgoingRequestMadeTutorialPage
    // ,TutorialEasyahIntroPage
    ,AcceptRequestTutorialPage
    ,TutorialBasicConceptsPage
  ]
  ,bootstrap: [

  ]
  ,entryComponents: [
    OutgoingRequestMadeTutorialPage
    // ,TutorialEasyahIntroPage
    ,AcceptRequestTutorialPage
    ,TutorialBasicConceptsPage
  ]
})
export class TutorialModule {}

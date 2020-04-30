import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TutorialBasicConceptsPageRoutingModule } from './tutorial-basic-concepts-routing.module';

import { TutorialBasicConceptsPage } from './tutorial-basic-concepts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // TutorialBasicConceptsPageRoutingModule
  ]
  ,declarations: [
  	TutorialBasicConceptsPage
  ]
  ,exports: [
  	TutorialBasicConceptsPage
  ]
  ,entryComponents: [
  	TutorialBasicConceptsPage
  ]
})
export class TutorialBasicConceptsPageModule {}

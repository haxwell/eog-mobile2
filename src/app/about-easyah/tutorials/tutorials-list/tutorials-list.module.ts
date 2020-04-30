import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EasyahHeaderModule } from '../../../easyah-header/easyah-header.module';
import { TutorialEasyahIntroPageModule } from '../tutorial-easyah-intro/tutorial-easyah-intro.module';

import { TutorialsListPageRoutingModule } from './tutorials-list-routing.module';

import { TutorialsListPage } from './tutorials-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EasyahHeaderModule,
    TutorialEasyahIntroPageModule,
    TutorialsListPageRoutingModule
  ]
  ,declarations: [TutorialsListPage]
})
export class TutorialsListPageModule {}

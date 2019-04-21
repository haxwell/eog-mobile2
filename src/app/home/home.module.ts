import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { HomeRoutingModule } from './home-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module'

import { ModalService } from '../_services/modal.service'
import { TutorialService } from '../_services/tutorial.service'

import { HomeService } from './_services/home.service'

import { HomePage } from './home.page';
import { TutorialEasyahIntroPage } from '../tutorials/tutorial-easyah-intro/tutorial-easyah-intro'

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    HttpModule,
    EasyahCommonModule,
    HomeRoutingModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ]
  ,declarations: [
    HomePage
    ,TutorialEasyahIntroPage
  ]
  ,providers: [
    ModalService
    ,TutorialService
    ,HomeService
  ]
  ,entryComponents: [
    TutorialEasyahIntroPage
  ]
})
export class HomePageModule {}

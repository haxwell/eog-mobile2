import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HomeRoutingModule } from './home-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module'
import { TutorialModule } from '../tutorials/tutorial.module'
import { TutorialsModule } from '../about-easyah/tutorials/tutorials.module'

import { ModalService } from '../_services/modal.service'
// import { TutorialService } from '../_services/tutorial.service'

import { HomeService } from './_services/home.service'

import { HomePage } from './home.page';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    EasyahCommonModule,
    HomeRoutingModule,
    TutorialModule,
    TutorialsModule,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ]
  ,declarations: [
    HomePage
  ]
  ,providers: [
    ModalService
    // ,TutorialService
    ,HomeService
  ]
  ,exports: [
    HomePage
  ]
  ,entryComponents: [

  ]
})
export class HomePageModule {}

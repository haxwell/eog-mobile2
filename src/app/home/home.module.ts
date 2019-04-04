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
  ]
  ,providers: [
    ModalService
    ,TutorialService
    ,HomeService
  ]
})
export class HomePageModule {}

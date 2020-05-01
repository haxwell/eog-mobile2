import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecommendationsRoutingModule } from './recommendations-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeaderModule } from '../easyah-header/easyah-header.module'

import { RecommendationsListPage } from './_pages/recommendations-list/recommendations-list.page';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	RecommendationsRoutingModule
    ,EasyahCommonModule
    ,EasyahHeaderModule
    ,RouterModule
    ,FormsModule
  ]
  ,declarations: [
    RecommendationsListPage
  ]
  ,providers: [

  ]
})
export class RecommendationsPageModule {}

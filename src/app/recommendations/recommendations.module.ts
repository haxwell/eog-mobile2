import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RecommendationsRoutingModule } from './recommendations-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeader } from '../common/easyah-header/easyah-header'

import { RecommendationsListPage } from './_pages/recommendations-list/recommendations-list.page';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	RecommendationsRoutingModule
    ,EasyahCommonModule
    ,RouterModule
    ,FormsModule
    ,HttpModule
  ]
  ,declarations: [
    RecommendationsListPage
  ]
  ,providers: [

  ]
})
export class RecommendationsPageModule {}

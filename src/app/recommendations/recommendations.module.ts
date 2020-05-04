import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RecommendationsRoutingModule } from './recommendations-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	RecommendationsRoutingModule
    ,EasyahCommonModule
    ,RouterModule
    ,FormsModule
  ]
  ,declarations: [
    
  ]
  ,providers: [

  ]
})
export class RecommendationsPageModule {}

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { KeywordsRoutingModule } from './keywords-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	KeywordsRoutingModule
    ,EasyahCommonModule
    ,RouterModule
    ,FormsModule
  ]
  ,declarations: [

  ]
  ,providers: [

  ]
})
export class KeywordsPageModule {}

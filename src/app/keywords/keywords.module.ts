import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { KeywordsRoutingModule } from './keywords-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeaderModule } from '../easyah-header/easyah-header.module';
// import { EasyahHeader } from '../common/easyah-header/easyah-header'

import { KeywordsListPage } from './_pages/keywords-list/keywords-list.page';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	KeywordsRoutingModule
    ,EasyahCommonModule
    ,EasyahHeaderModule
    ,RouterModule
    ,FormsModule
  ]
  ,declarations: [
    KeywordsListPage
  ]
  ,providers: [

  ]
})
export class KeywordsPageModule {}

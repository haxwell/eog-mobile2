import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { KeywordsRoutingModule } from './keywords-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeader } from '../common/easyah-header/easyah-header'

import { KeywordsListPage } from './_pages/keywords-list/keywords-list.page';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	KeywordsRoutingModule
    ,EasyahCommonModule
    ,RouterModule
    ,FormsModule
    ,HttpClientModule
  ]
  ,declarations: [
    KeywordsListPage
  ]
  ,providers: [

  ]
})
export class KeywordsPageModule {}

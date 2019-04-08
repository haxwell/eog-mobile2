import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AboutEasyahRoutingModule } from './about-easyah-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeader } from '../common/easyah-header/easyah-header'

import { AboutEasyahPage } from './_pages/about-easyah.page';
import { PrivacyPolicyPage } from './_pages/privacy-policy.page';
import { TutorialsListPage } from './_pages/tutorials-list.page';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	AboutEasyahRoutingModule
    ,EasyahCommonModule
    ,RouterModule
    ,FormsModule
    ,HttpModule
  ]
  ,declarations: [
    AboutEasyahPage
    ,PrivacyPolicyPage
    ,TutorialsListPage
  ]
  ,providers: [

  ]
})
export class  AboutEasyahPageModule {}

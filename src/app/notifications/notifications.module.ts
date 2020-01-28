import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NotificationsRoutingModule } from './notifications-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeader } from '../common/easyah-header/easyah-header'

import { NotificationsListPage } from './_pages/notifications-list/notifications-list.page';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	NotificationsRoutingModule
    ,EasyahCommonModule
    ,RouterModule
    ,FormsModule
    ,HttpClientModule
  ]
  ,declarations: [
    NotificationsListPage
  ]
  ,providers: [

  ]
})
export class NotificationsPageModule {}

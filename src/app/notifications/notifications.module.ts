import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NotificationsRoutingModule } from './notifications-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeaderModule } from '../easyah-header/easyah-header.module';

import { NotificationsListPage } from './_pages/notifications-list/notifications-list.page';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	NotificationsRoutingModule
    ,EasyahCommonModule
    ,EasyahHeaderModule
    ,RouterModule
    ,FormsModule
  ]
  ,declarations: [
    NotificationsListPage
  ]
  ,providers: [

  ]
})
export class NotificationsPageModule {}

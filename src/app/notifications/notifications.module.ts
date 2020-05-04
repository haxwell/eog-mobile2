import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NotificationsRoutingModule } from './notifications-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	NotificationsRoutingModule
    ,EasyahCommonModule
    ,RouterModule
    ,FormsModule
  ]
  ,declarations: [

  ]
  ,providers: [

  ]
})
export class NotificationsPageModule {}

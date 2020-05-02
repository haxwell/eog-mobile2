import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestsOutgoingRoutingModule } from './requests-outgoing-routing.module';

import { EasyahCommonModule } from '../../common/easyah-common.module';

import { RequestsService } from '../../../app/_services/requests.service';

@NgModule({
  imports: [
    IonicModule
    ,CommonModule
    ,FormsModule
    ,EasyahCommonModule
    ,RequestsOutgoingRoutingModule
  ]
  ,declarations: [

  ]
  ,providers: [
    RequestsService
  ]
})
export class RequestsOutgoingPageModule {}

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestsIncomingRoutingModule } from './requests-incoming-routing.module';

import { EasyahCommonModule } from '../../common/easyah-common.module';

import { ModelService } from './_services/model.service';

// TODO is there anything outside of the requests module that uses requests service? If not move it into the module.
import { RequestsService } from '../../../app/_services/requests.service';

@NgModule({
  imports: [
    IonicModule
    ,CommonModule
    ,FormsModule
    ,EasyahCommonModule
    ,RequestsIncomingRoutingModule
  ]
  ,declarations: [

  ]
  ,providers: [
    RequestsService
    ,ModelService
  ]
  ,entryComponents: [

  ]
})
export class RequestsIncomingPageModule {}

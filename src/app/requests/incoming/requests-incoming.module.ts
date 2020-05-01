import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestsIncomingRoutingModule } from './requests-incoming-routing.module';

import { EasyahCommonModule } from '../../common/easyah-common.module';
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { RequestsIncomingView } from './_pages/requests-incoming.page';

import { AcceptRequestPage } from './_pages/accept-request.page';
import { CancelRequestPage } from './_pages/cancel-request.page';
import { CompleteRequestPage } from './_pages/complete-request.page';
import { DeclineRequestPage } from './_pages/decline-request.page';

// TODO is there anything outside of the requests module that uses requests service? If not move it into the module.
import { RequestsService } from '../../../app/_services/requests.service';

@NgModule({
  imports: [
    IonicModule
    ,CommonModule
    ,FormsModule
    ,EasyahCommonModule
    ,EasyahHeaderModule
    ,RequestsIncomingRoutingModule
  ]
  ,declarations: [
  	AcceptRequestPage
  	,CancelRequestPage
  	,CompleteRequestPage
  	,DeclineRequestPage
    ,RequestsIncomingView
  ]
  ,providers: [
    RequestsService
  ]
  ,entryComponents: [
    AcceptRequestPage
  ]
})
export class RequestsIncomingPageModule {}

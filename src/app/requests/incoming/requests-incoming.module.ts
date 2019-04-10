import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RequestsIncomingRoutingModule } from './requests-incoming-routing.module';

import { EasyahCommonModule } from '../../common/easyah-common.module';
import { EasyahHeader } from '../../common/easyah-header/easyah-header';

import { RequestsIncomingView } from './_pages/requests-incoming.page';

import { AcceptRequestPage } from './_pages/accept-request.page';
import { AcceptRequestTutorialPage } from './_pages/accept-request.tutorial';
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
    ,HttpModule
    ,EasyahCommonModule
    ,RequestsIncomingRoutingModule
  ]
  ,declarations: [
  	AcceptRequestPage
  	,AcceptRequestTutorialPage
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
    ,AcceptRequestTutorialPage
  ]
})
export class RequestsIncomingPageModule {}

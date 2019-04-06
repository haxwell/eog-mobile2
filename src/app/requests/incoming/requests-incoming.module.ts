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

  ]
})
export class RequestsIncomingPageModule {}

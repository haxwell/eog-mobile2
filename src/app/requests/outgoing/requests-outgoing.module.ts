import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RequestsOutgoingRoutingModule } from './requests-outgoing-routing.module';

import { EasyahCommonModule } from '../../common/easyah-common.module';
import { EasyahHeader } from '../../common/easyah-header/easyah-header';

import { RequestsOutgoingView } from './_pages/requests-outgoing.page';

import { CancelOutgoingRequestPage } from './_pages/cancel-request.page';
import { CompleteOutgoingRequestPage } from './_pages/complete-request.page';
import { NotCompleteOutgoingRequestPage } from './_pages/not-complete-request.page';
import { PermanentlyDismissUnresolvedRequestPage } from './_pages/permanently-dismiss-unresolved-request.page';

import { RequestsService } from '../../../app/_services/requests.service';

@NgModule({
  imports: [
    IonicModule
    ,CommonModule
    ,FormsModule
    ,HttpModule
    ,EasyahCommonModule
    ,RequestsOutgoingRoutingModule
  ]
  ,declarations: [
  	CancelOutgoingRequestPage
  	,CompleteOutgoingRequestPage
  	,NotCompleteOutgoingRequestPage
  	,PermanentlyDismissUnresolvedRequestPage
  	,RequestsOutgoingView
  ]
  ,providers: [
    RequestsService
  ]
})
export class RequestsOutgoingPageModule {}

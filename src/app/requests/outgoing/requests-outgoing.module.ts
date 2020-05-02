import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RequestsOutgoingRoutingModule } from './requests-outgoing-routing.module';

import { EasyahCommonModule } from '../../common/easyah-common.module';
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { RequestsOutgoingView } from './_pages/requests-outgoing.page';

import { NotCompleteOutgoingRequestPage } from './_pages/not-complete-request.page';
import { PermanentlyDismissUnresolvedRequestPage } from './_pages/permanently-dismiss-unresolved-request.page';

import { RequestsService } from '../../../app/_services/requests.service';

@NgModule({
  imports: [
    IonicModule
    ,CommonModule
    ,FormsModule
    ,EasyahCommonModule
    ,EasyahHeaderModule
    ,RequestsOutgoingRoutingModule
  ]
  ,declarations: [
  	NotCompleteOutgoingRequestPage
  	,PermanentlyDismissUnresolvedRequestPage
  	,RequestsOutgoingView
  ]
  ,providers: [
    RequestsService
  ]
})
export class RequestsOutgoingPageModule {}

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AcceptRequestPage } from './incoming/_pages/accept-request.page';
import { AcceptRequestTutorialPage } from './incoming/_pages/accept-request.tutorial';
import { CancelRequestPage } from './incoming/_pages/cancel-request.page';
import { CompleteRequestPage } from './incoming/_pages/complete-request.page';
import { DeclineRequestPage } from './incoming/_pages/decline-request.page';

import { CancelOutgoingRequestPage } from './outgoing/_pages/cancel-request.page';
import { CompleteOutgoingRequestPage } from './outgoing/_pages/complete-request.page';

import { NotCompleteOutgoingRequestPage } from './outgoing/_pages/not-complete-request.page';
import { PermanentlyDismissUnresolvedRequestPage } from './outgoing/_pages/permanently-dismiss-unresolved-request.page';

import { RequestRoutingModule } from './requests-routing.module';

@NgModule({
  imports: [
  	CommonModule,
  	RequestRoutingModule
  ]
  ,declarations: [
  	AcceptRequestPage
  	,AcceptRequestTutorialPage
  	,CancelRequestPage,
  	,CompleteRequestPage
  	,DeclineRequestPage

  	,CancelOutgoingRequestPage
  	,CompleteOutgoingRequestPage
  	,NotCompleteOutgoingRequestPage
  	,PermanentlyDismissUnresolvedRequestPage
  ]
  ,providers: [

  ]
})
export class RequestPageModule {}

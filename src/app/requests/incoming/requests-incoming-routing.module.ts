import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../../app/_routeguards/can-activate.routeguard'

import { RequestsIncomingView } from './_pages/requests-incoming.page';

import { AcceptRequestPage } from './_pages/accept-request.page';
import { CancelRequestPage } from './_pages/cancel-request.page';
import { CompleteRequestPage } from './_pages/complete-request.page';
import { DeclineRequestPage } from './_pages/decline-request.page';

const routes: Routes = [
  { path: '',                 		component: RequestsIncomingView,   	canActivate: [CanActivateRouteGuard] }
  ,{ path: 'accept', 				component: AcceptRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'cancel', 				component: CancelRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'complete', 			component: CompleteRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'decline', 			component: DeclineRequestPage,		canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
  ,entryComponents: [
    AcceptRequestPage
  ]
})
export class RequestsIncomingRoutingModule {}

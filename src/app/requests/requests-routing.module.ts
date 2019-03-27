import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { AcceptRequestPage } from './incoming/_pages/accept-request.page';
import { CancelRequestPage } from './incoming/_pages/cancel-request.page';
import { CompleteRequestPage } from './incoming/_pages/complete-request.page';
import { DeclineRequestPage } from './incoming/_pages/decline-request.page';

import { CancelOutgoingRequestPage } from './outgoing/_pages/cancel-request.page';
import { CompleteOutgoingRequestPage } from './outgoing/_pages/complete-request.page';
import { NotCompleteOutgoingRequestPage } from './outgoing/_pages/not-complete-request.page';
import { PermanentlyDismissUnresolvedRequestPage } from './outgoing/_pages/permanently-dismiss-unresolved-request.page';


const routes: Routes = [
  { path: 'request/incoming/accept', 				component: AcceptRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'request/incoming/cancel', 				component: CancelRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'request/incoming/complete', 				component: CompleteRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'request/incoming/decline', 				component: DeclineRequestPage,		canActivate: [CanActivateRouteGuard] }

  ,{ path: 'request/outgoing/cancel', 				component: CancelOutgoingRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'request/outgoing/complete', 				component: CompleteOutgoingRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'request/outgoing/not-complete', 				component: NotCompleteOutgoingRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'request/outgoing/permanently-dismiss', 				component: PermanentlyDismissUnresolvedRequestPage,		canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RequestRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../../app/_routeguards/can-activate.routeguard'

import { RequestsOutgoingView } from './_pages/requests-outgoing.page';

import { CancelOutgoingRequestPage } from './_pages/cancel-request.page';
import { CompleteOutgoingRequestPage } from './_pages/complete-request.page';
import { NotCompleteOutgoingRequestPage } from './_pages/not-complete-request.page';
import { PermanentlyDismissUnresolvedRequestPage } from './_pages/permanently-dismiss-unresolved-request.page';

const routes: Routes = [
  { path: '',   					component: RequestsOutgoingView,   					canActivate: [CanActivateRouteGuard] }
  ,{ path: './cancel', 				component: CancelOutgoingRequestPage,				canActivate: [CanActivateRouteGuard] }
  ,{ path: './complete', 			component: CompleteOutgoingRequestPage,				canActivate: [CanActivateRouteGuard] }
  ,{ path: './not-complete', 		component: NotCompleteOutgoingRequestPage,			canActivate: [CanActivateRouteGuard] }
  ,{ path: './permanently-dismiss', component: PermanentlyDismissUnresolvedRequestPage,	canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RequestsOutgoingRoutingModule {}
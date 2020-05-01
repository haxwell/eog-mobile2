import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../../app/_routeguards/can-activate.routeguard'

import { RequestsIncomingView } from './_pages/requests-incoming.page';

import { CancelRequestPage } from './_pages/cancel-request.page';
import { CompleteRequestPage } from './_pages/complete-request.page';

const routes: Routes = [
  { path: '',                 		component: RequestsIncomingView,   	canActivate: [CanActivateRouteGuard] }
  ,{
    path: 'accept',
    loadChildren: () => import('./accept/accept.module').then( m => m.AcceptPageModule)
  }
  ,{
    path: 'decline',
    loadChildren: () => import('./decline/decline.module').then( m => m.DeclinePageModule)
  }
  ,{ path: 'cancel', 				component: CancelRequestPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'complete', 			component: CompleteRequestPage,		canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ]
  ,exports: [
    RouterModule
   ]
})
export class RequestsIncomingRoutingModule {}

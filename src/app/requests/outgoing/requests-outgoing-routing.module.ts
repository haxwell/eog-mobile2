import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../../app/_routeguards/can-activate.routeguard'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  }
  // ,{ path: './not-complete', 		component: NotCompleteOutgoingRequestPage,			canActivate: [CanActivateRouteGuard] }
  // ,{ path: './permanently-dismiss', component: PermanentlyDismissUnresolvedRequestPage,	canActivate: [CanActivateRouteGuard] },
  ,{
    path: 'cancel',
    loadChildren: () => import('./cancel/cancel.module').then( m => m.CancelPageModule)
  }
  ,{
    path: 'complete',
    loadChildren: () => import('./complete/complete.module').then( m => m.CompletePageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RequestsOutgoingRoutingModule {}

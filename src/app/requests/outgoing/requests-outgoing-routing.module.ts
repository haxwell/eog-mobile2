import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../../app/_routeguards/can-activate.routeguard'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  }
  ,{
    path: 'cancel',
    loadChildren: () => import('./cancel/cancel.module').then( m => m.CancelPageModule)
  }
  ,{
    path: 'complete',
    loadChildren: () => import('./complete/complete.module').then( m => m.CompletePageModule)
  },
  {
    path: 'not-complete',
    loadChildren: () => import('./not-complete/not-complete.module').then( m => m.NotCompletePageModule)
  },
  {
    path: 'permanently-dismiss',
    loadChildren: () => import('./permanently-dismiss/permanently-dismiss.module').then( m => m.PermanentlyDismissPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RequestsOutgoingRoutingModule {}

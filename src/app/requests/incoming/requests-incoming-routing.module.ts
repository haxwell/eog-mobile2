import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../../app/_routeguards/can-activate.routeguard'

// import { RequestsIncomingView } from './_pages/requests-incoming.page';

const routes: Routes = [
  
  //  Once the modularization refactor is complete, investigate the routeguard.. is it necessary? 
  //    Presently, it's designed to be sure only logged in users can access a page..
  //    But people can't type a URL in the mobile app anyway.. soo.. maybe just as an extra layer of precaution.
  // { path: '', component: RequestsIncomingView,   	canActivate: [CanActivateRouteGuard] }
  
  {
    path: '',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  }
  ,{
    path: 'accept',
    loadChildren: () => import('./accept/accept.module').then( m => m.AcceptPageModule)
  }
  ,{
    path: 'decline',
    loadChildren: () => import('./decline/decline.module').then( m => m.DeclinePageModule)
  }
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
  ]
  ,exports: [
    RouterModule
   ]
})
export class RequestsIncomingRoutingModule {}

import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  }
  ,{
    path: 'all',
    loadChildren: () => import('./list-all/list-all.module').then( m => m.ListAllPageModule)
  }
  ,{ path: 'new',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }
  ,{
    path: ':offerId',
    loadChildren: () => import('./detail/detail.module').then( m => m.DetailPageModule)
  }
  ,{
    path: ':offerId/edit',
    loadChildren: () => import('./edit/edit.module').then( m => m.EditPageModule)
  }
  ,{
    path: ':offerId/request',
    loadChildren: () => import('./request/request.module').then( m => m.RequestPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OfferRoutingModule {}

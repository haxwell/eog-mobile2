import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { SearchPage } from './search.page';

const routes: Routes = [
  { path: 'search', 				component: SearchPage,		canActivate: [CanActivateRouteGuard] }
  ,{ path: 'search/:searchString',	component: SearchPage,		canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SearchRoutingModule {}

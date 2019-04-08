import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { RecommendationsListPage } from './_pages/recommendations-list/recommendations-list.page'

const routes: Routes = [
  { path: '', 			component: RecommendationsListPage,			canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RecommendationsRoutingModule {}

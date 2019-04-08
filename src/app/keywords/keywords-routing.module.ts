import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { KeywordsListPage } from './_pages/keywords-list/keywords-list.page'

const routes: Routes = [
  { path: '', 			component: KeywordsListPage,			canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class KeywordsRoutingModule {}

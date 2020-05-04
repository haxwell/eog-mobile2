import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./list/list.module').then( m => m.ListPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RecommendationsRoutingModule {}

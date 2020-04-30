import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { HomePage } from './home.page';

const routes: Routes = [
	{ path: '', component: HomePage } 
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class HomeRoutingModule {}

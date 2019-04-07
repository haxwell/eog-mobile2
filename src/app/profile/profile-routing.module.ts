import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { ProfilePage } from './_pages/profile.page';
import { ProfileEditPage } from './_pages/profile-edit.page';

const routes: Routes = [
  { path: '', 			component: ProfilePage,			canActivate: [CanActivateRouteGuard] }
  ,{ path: 'edit', 		component: ProfileEditPage,		canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}

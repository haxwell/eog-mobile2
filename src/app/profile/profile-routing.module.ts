import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { ProfilePage } from './profile.page';
import { ProfileEditPage } from './profile-edit.page';

const routes: Routes = [
  { path: 'profile/:userId', 			component: ProfilePage,			canActivate: [CanActivateRouteGuard] }
  ,{ path: 'profile/:userId/edit', 		component: ProfileEditPage,		canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}

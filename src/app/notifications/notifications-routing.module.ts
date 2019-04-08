import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { NotificationsListPage } from './_pages/notifications-list/notifications-list.page'

const routes: Routes = [
  { path: '', 			component: NotificationsListPage,			canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class NotificationsRoutingModule {}

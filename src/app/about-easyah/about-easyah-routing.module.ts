import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { AboutEasyahPage } from './_pages/about-easyah.page';
import { PrivacyPolicyPage } from './_pages/privacy-policy.page';
import { TutorialsListPage } from './_pages/tutorials-list.page';


const routes: Routes = [
  { path: '', 							component: AboutEasyahPage,				canActivate: [CanActivateRouteGuard] }
  ,{ path: 'privacy-policy', 			component: PrivacyPolicyPage,			canActivate: [CanActivateRouteGuard] }
  ,{ path: 'tutorials-list', 			component: TutorialsListPage,			canActivate: [CanActivateRouteGuard] }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AboutEasyahRoutingModule {}

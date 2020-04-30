import { NgModule } from '@angular/core';
import { PreloadAllModules, Routes, RouterModule } from '@angular/router';

import { CanActivateRouteGuard } from '../../app/_routeguards/can-activate.routeguard'

import { AboutEasyahPage } from './about-easyah.page';

const routes: Routes = [
  {
    path: '',
    component: AboutEasyahPage
  },
  {
    path: 'privacy-policy',
    loadChildren: () => import('./privacy-policy/privacy-policy.module').then( m => m.PrivacyPolicyPageModule)
  },
  {
    path: 'tutorials-list',
    loadChildren: () => import('./tutorials/tutorials-list/tutorials-list.module').then( m => m.TutorialsListPageModule)
  }
  //, {
  //   path: 'tutorial-easyah-intro',
  //   loadChildren: () => import('./tutorials/tutorial-easyah-intro/tutorial-easyah-intro.module').then( m => m.TutorialEasyahIntroPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AboutEasyahPageRoutingModule {}

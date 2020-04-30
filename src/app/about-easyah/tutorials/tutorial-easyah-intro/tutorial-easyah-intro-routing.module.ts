import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialEasyahIntroPage } from './tutorial-easyah-intro.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TutorialEasyahIntroPage
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialEasyahIntroPageRoutingModule {}

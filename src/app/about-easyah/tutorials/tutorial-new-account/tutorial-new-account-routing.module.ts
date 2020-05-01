import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialNewAccountPage } from './tutorial-new-account.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TutorialNewAccountPage
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialNewAccountPageRoutingModule {}

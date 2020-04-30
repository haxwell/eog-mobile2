import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialAcceptRequestPage } from './tutorial-accept-request.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TutorialAcceptRequestPage
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialAcceptRequestPageRoutingModule {}

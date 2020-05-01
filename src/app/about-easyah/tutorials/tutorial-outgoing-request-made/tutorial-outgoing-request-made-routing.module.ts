import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialOutgoingRequestMadePage } from './tutorial-outgoing-request-made.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TutorialOutgoingRequestMadePage
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialOutgoingRequestMadePageRoutingModule {}

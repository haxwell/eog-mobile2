import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialBasicConceptsPage } from './tutorial-basic-concepts.page';

const routes: Routes = [
  // {
  //   path: '',
  //   component: TutorialBasicConceptsPage
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialBasicConceptsPageRoutingModule {}

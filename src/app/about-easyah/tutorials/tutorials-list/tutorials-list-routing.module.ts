import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TutorialsListPage } from './tutorials-list.page';

const routes: Routes = [
  {
    path: '',
    component: TutorialsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorialsListPageRoutingModule {}

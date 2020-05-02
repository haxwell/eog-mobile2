import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NotCompletePage } from './not-complete.page';

const routes: Routes = [
  {
    path: '',
    component: NotCompletePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NotCompletePageRoutingModule {}

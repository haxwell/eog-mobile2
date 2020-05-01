import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeclinePage } from './decline.page';

const routes: Routes = [
  {
    path: '',
    component: DeclinePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeclinePageRoutingModule {}

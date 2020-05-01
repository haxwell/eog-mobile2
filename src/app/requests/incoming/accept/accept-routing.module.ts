import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AcceptPage } from './accept.page';

const routes: Routes = [
  {
    path: '',
    component: AcceptPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AcceptPageRoutingModule {}

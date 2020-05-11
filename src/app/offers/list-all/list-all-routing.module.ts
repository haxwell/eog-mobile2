import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListAllPage } from './list-all.page';

const routes: Routes = [
  {
    path: '',
    component: ListAllPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListAllPageRoutingModule {}

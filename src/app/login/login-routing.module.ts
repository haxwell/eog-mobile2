import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

import { LoginPage } from './login.page';
import { CreateAccountPage } from './_pages/create-account.page';

const routes: Routes = [
  { path: '', 					component: LoginPage }
  ,{ path: 'create-account',	component: CreateAccountPage }
];
@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule {}

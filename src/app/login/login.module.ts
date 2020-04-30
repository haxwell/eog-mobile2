import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginPage } from './login.page';
import { CreateAccountPage } from './_pages/create-account.page';
import { NewAccountTutorialPage } from './_pages/new-account-tutorial.page';


import { ApiService } from '../_services/api.service';
// import { UserService } from '../_services/user.service';
import { GeolocationService } from '../_services/geolocation.service';
import { ModalService } from '../_services/modal.service';

import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    RouterModule.forChild([{ path: '', component: LoginPage }])
  ]
  ,declarations: [LoginPage, CreateAccountPage, NewAccountTutorialPage]
  ,providers: [
  	ApiService,
  	// UserService,
    ModalService,
  	GeolocationService
  ],
  bootstrap: [ NewAccountTutorialPage ]
  ,entryComponents: [ NewAccountTutorialPage ]
})
export class LoginPageModule {}

import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginPage } from './login.page';

import { ApiService } from '../_services/api.service';
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
  ,declarations: [ LoginPage ]
  ,providers: [
  	ApiService,
    ModalService,
  	GeolocationService
  ]
})
export class LoginPageModule {}

import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AcceptRequestPage } from './incoming/_pages/accept-request.page';

import { RequestRoutingModule } from './Request-routing.module';

@NgModule({
  imports: [
  	CommonModule,
  	RequestRoutingModule
  ]
  ,declarations: [
  	RequestPage,
  	RequestEditPage
  ]
  ,providers: [

  ]
})
export class RequestModule {}

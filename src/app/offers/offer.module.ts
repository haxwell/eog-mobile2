import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OfferPage } from './offer.page';
import { OfferEditPage } from './offer-edit.page';

import { OfferRoutingModule } from './offer-routing.module';

@NgModule({
  imports: [
  	CommonModule,
  	OfferRoutingModule
  ]
  ,declarations: [
  	OfferPage,
  	OfferEditPage
  ]
  ,providers: [

  ]
})
export class OfferModule {}

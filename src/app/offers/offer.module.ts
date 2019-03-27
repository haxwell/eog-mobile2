import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OfferPage } from './offer.page';
import { OfferEditPage } from './offer-edit.page';
import { DeleteOfferPage } from './_pages/delete-offer.page'
import { OfferRequestPage } from './_pages/offer-request.page'
import { OutgoingRequestMadeTutorialPage } from './_pages/outgoing-request-made-tutorial.page'
import { RulePage } from './_pages/rule.page'

import { OfferRoutingModule } from './offer-routing.module';

@NgModule({
  imports: [
  	CommonModule,
  	OfferRoutingModule
  ]
  ,declarations: [
  	OfferPage
  	,OfferEditPage
    ,DeleteOfferPage
    ,OfferRequestPage
    ,OutgoingRequestMadeTutorialPage
    ,RulePage
  ]
  ,providers: [

  ]
})
export class OfferPageModule {}

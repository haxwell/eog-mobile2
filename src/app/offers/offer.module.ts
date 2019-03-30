import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';


import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeader } from '../common/easyah-header/easyah-header'


import { OfferPage } from './offer.page';
import { OfferEditPage } from './offer-edit.page';
import { DeleteOfferPage } from './_pages/delete-offer.page'
import { OfferRequestPage } from './_pages/offer-request.page'
import { OutgoingRequestMadeTutorialPage } from './_pages/outgoing-request-made-tutorial.page'
import { RulePage } from './_pages/rule.page'

import { OfferRoutingModule } from './offer-routing.module';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	OfferRoutingModule
    ,EasyahCommonModule
    ,RouterModule
    ,FormsModule
    ,HttpModule
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

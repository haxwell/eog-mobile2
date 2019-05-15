import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { OfferRoutingModule } from './offer-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeader } from '../common/easyah-header/easyah-header'

import { OfferPage } from './_pages/offer.page';
import { OfferEditPage } from './_pages/offer-edit.page';
import { OfferListPage } from './_pages/offer-list/offer-list.page';
import { DeleteOfferPage } from './_pages/delete-offer.page'
import { OfferRequestPage } from './_pages/offer-request.page'
import { OutgoingRequestMadeTutorialPage } from './_pages/outgoing-request-made-tutorial.page'
import { RulePage } from './_pages/rule.page'
import { KeywordEntryPage } from '../common/keyword.entry/keyword.entry'

// TODO: Is this only used in the context of Offers? If so, move it closer to home.
import { OfferCollectionService } from '../../app/_services/offer-collection.service'

// REFACTOR: Do I need to do this here? Or rather, why, do I need to do this.. Isn't there like a global include? So the more specific modules have more specific imports, instead of allll of them?
import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	OfferRoutingModule
    ,EasyahCommonModule
    ,RouterModule
    ,FormsModule
    ,HttpModule
    ,IonicImageLoader
  ]
  ,declarations: [

  	OfferPage
    ,OfferListPage
  	,OfferEditPage
    ,DeleteOfferPage
    ,OfferRequestPage
    ,OutgoingRequestMadeTutorialPage
    ,RulePage
    ,KeywordEntryPage
  ]
  ,providers: [
    OfferCollectionService
  ]
  ,entryComponents: [
    DeleteOfferPage
    ,RulePage
    ,KeywordEntryPage
  ]
})
export class OfferPageModule {}

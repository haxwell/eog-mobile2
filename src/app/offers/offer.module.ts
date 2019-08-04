import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { OfferRoutingModule } from './offer-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeader } from '../common/easyah-header/easyah-header'
import { TutorialModule } from '../tutorials/tutorial.module'
import { ChoosePhotoSourceModule } from '../common/choose-photo-source/choose-photo-source.module'

import { OfferPage } from './_pages/offer.page';
import { OfferEditPage } from './_pages/offer-edit.page';
import { OfferListPage } from './_pages/offer-list/offer-list.page';
import { DeleteOfferPage } from './_pages/delete-offer.page'
import { OfferRequestPage } from './_pages/offer-request.page'
// import { OutgoingRequestMadeTutorialPage } from './_pages/outgoing-request-made-tutorial.page'
import { RulePage } from './_pages/rule.page'
import { KeywordEntryPage } from '../common/keyword.entry/keyword.entry'
import { ChoosePhotoSourcePage } from '../common/choose-photo-source/choose-photo-source'

// TODO: Is this only used in the context of Offers? If so, move it closer to home.
import { OfferCollectionService } from '../../app/_services/offer-collection.service'

@NgModule({
  imports: [
    IonicModule,
  	CommonModule,
  	OfferRoutingModule
    ,EasyahCommonModule
    ,ChoosePhotoSourceModule
    ,RouterModule
    ,FormsModule
    ,HttpModule
    ,TutorialModule
  ]
  ,declarations: [

  	OfferPage
    ,OfferListPage
  	,OfferEditPage
    ,DeleteOfferPage
    ,OfferRequestPage
    // ,OutgoingRequestMadeTutorialPage
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
    ,ChoosePhotoSourcePage
  ]
})
export class OfferPageModule {}

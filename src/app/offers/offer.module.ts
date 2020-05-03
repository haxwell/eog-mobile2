import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { OfferRoutingModule } from './offer-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeaderModule } from '../easyah-header/easyah-header.module';
import { ChoosePhotoSourceModule } from '../common/choose-photo-source/choose-photo-source.module'

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
    ,EasyahHeaderModule
    ,ChoosePhotoSourceModule
    ,RouterModule
    ,FormsModule
    ,ReactiveFormsModule
  ]
  ,declarations: [
    KeywordEntryPage
  ]
  ,providers: [
    OfferCollectionService
  ]
  ,entryComponents: [
    KeywordEntryPage
    ,ChoosePhotoSourcePage
  ]
})
export class OfferPageModule {}

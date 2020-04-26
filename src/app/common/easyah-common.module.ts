import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EasyahHeader } from './easyah-header/easyah-header';
import { UsersLineItem } from './users-line-item/users-line-item';
import { OtherPeoplesOfferList } from './other-peoples-offer-list/other-peoples-offer-list';

import { OfferModelService } from '../_services/offer-model.service'
import { OfferMetadataService } from '../_services/offer-metadata.service'
import { PictureService } from '../_services/picture.service'
import { PictureEXIFService } from '../_services/picture-exif.service'
import { PointsService } from '../_services/points.service'
import { RecommendationService } from '../_services/recommendation.service'
import { DeclineReasonCodeService } from '../_services/declined-reason-codes.service'

@NgModule({
  imports: [
  	CommonModule
  	,IonicModule
  ]
  ,declarations: [
  	EasyahHeader
,UsersLineItem
  	,OtherPeoplesOfferList
  ]
  ,providers: [
    DeclineReasonCodeService
    ,OfferModelService
    ,OfferMetadataService
    ,PictureService
    ,PictureEXIFService
    ,PointsService
    ,RecommendationService
  ]
  ,exports: [
  	EasyahHeader
    ,UsersLineItem
    ,OtherPeoplesOfferList
  ]
})
export class EasyahCommonModule {}

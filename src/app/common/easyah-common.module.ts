import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EasyahHeader } from './easyah-header/easyah-header';
import { ProfileHeader } from './profile-header/profile-header';
import { ProfilePoints } from './profile-points/profile-points';
import { UsersLineItem } from './users-line-item/users-line-item';
import { OtherPeoplesOfferList } from './other-peoples-offer-list/other-peoples-offer-list';

import { OfferModelService } from '../_services/offer-model.service'
import { OfferMetadataService } from '../_services/offer-metadata.service'
import { PictureService } from '../_services/picture.service'
import { PictureEXIFService } from '../_services/picture-exif.service'
import { PointsService } from '../_services/points.service'
import { RecommendationService } from '../_services/recommendation.service'
import { RequestsService } from '../_services/requests.service'
import { DeclineReasonCodeService } from '../_services/declined-reason-codes.service'


@NgModule({
  imports: [
  	CommonModule,
  	IonicModule
  ]
  ,declarations: [
  	EasyahHeader
    ,ProfileHeader
    ,ProfilePoints
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
    ,RequestsService
  ]
  ,exports: [
  	EasyahHeader
    ,ProfileHeader
    ,ProfilePoints
    ,UsersLineItem
    ,OtherPeoplesOfferList
  ]
})
export class EasyahCommonModule {}

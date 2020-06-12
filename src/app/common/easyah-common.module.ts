import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OfferModelService } from '../_services/offer-model.service'
import { OfferMetadataService } from '../_services/offer-metadata.service'
import { PictureEXIFService } from '../_services/picture-exif.service'
import { PointsService } from '../_services/points.service'
import { RecommendationService } from '../_services/recommendation.service'
import { DeclineReasonCodeService } from '../_services/declined-reason-codes.service'

@NgModule({
  imports: [
  	CommonModule
  	,IonicModule
  ]
  ,providers: [
    DeclineReasonCodeService
    ,OfferModelService
    ,OfferMetadataService
    ,PictureEXIFService
    ,PointsService
    ,RecommendationService
  ]
})
export class EasyahCommonModule {}

import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';

import { ContactInfoVisibilityService } from '../../app/_services/contact-info-visibility.service'
import { GeolocationService } from '../../app/_services/geolocation.service'
import { PointsService } from '../../app/_services/points.service'
import { ProfileService } from '../../app/_services/profile.service'
import { RecommendationService } from '../../app/_services/recommendation.service'
import { UserMetadataService } from '../../app/_services/user-metadata.service'

import { ModelServiceP } from './_services/model.service'

@NgModule({
  imports: [
    IonicModule
    ,CommonModule
    ,FormsModule
    ,EasyahCommonModule
  	,ProfileRoutingModule
  ]
  ,declarations: [

  ]
  ,providers: [
    ContactInfoVisibilityService
    ,GeolocationService
    ,PointsService
    ,ProfileService
    ,RecommendationService
    ,UserMetadataService
    ,ModelServiceP
  ]
})
export class ProfilePageModule {}

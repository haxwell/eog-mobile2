import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { ProfileRoutingModule } from './profile-routing.module';

import { ChoosePhotoSourceModule } from '../common/choose-photo-source/choose-photo-source.module'
import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeader } from '../common/easyah-header/easyah-header';

import { ProfilePage } from './_pages/profile.page';
import { ProfileEditPage } from './_pages/profile-edit.page';

import { ChoosePhotoSourcePage } from '../common/choose-photo-source/choose-photo-source';

import { ContactInfoVisibilityService } from '../../app/_services/contact-info-visibility.service'
import { GeolocationService } from '../../app/_services/geolocation.service'
import { PointsService } from '../../app/_services/points.service'
import { ProfileService } from '../../app/_services/profile.service'
import { RecommendationService } from '../../app/_services/recommendation.service'
import { UserMetadataService } from '../../app/_services/user-metadata.service'

@NgModule({
  imports: [
    IonicModule
    ,CommonModule
    ,FormsModule
    ,HttpModule
    ,EasyahCommonModule
  	,ProfileRoutingModule
    ,ChoosePhotoSourceModule
  ]
  ,declarations: [
  	ProfilePage
  	,ProfileEditPage
  ]
  ,providers: [
    ContactInfoVisibilityService
    ,GeolocationService
    ,PointsService
    ,ProfileService
    ,RecommendationService
    ,UserMetadataService
  ]
  ,entryComponents: [
    ChoosePhotoSourcePage
  ]
})
export class ProfilePageModule {}

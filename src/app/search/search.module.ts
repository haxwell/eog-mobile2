import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';

import { SearchRoutingModule } from './search-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeader } from '../common/easyah-header/easyah-header';

import { SearchService } from '../../app/_services/search.service';

import { SearchPage } from './search.page';

import { IonicImageLoader } from 'ionic-image-loader';

@NgModule({
  imports: [
  	IonicModule,
  	EasyahCommonModule,
  	CommonModule,
  	SearchRoutingModule,
    RouterModule.forChild([{ path: '', component: SearchPage }])
    ,IonicImageLoader
  ]
  ,declarations: [
  	SearchPage
  ]
  ,providers: [
    SearchService
  ]
})
export class SearchPageModule {}

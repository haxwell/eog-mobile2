import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';

import { EasyahCommonModule } from '../common/easyah-common.module';
import { EasyahHeaderModule } from '../easyah-header/easyah-header.module';

import { SearchService } from '../../app/_services/search.service';

import { SearchPage } from './search.page';

@NgModule({
  imports: [
  	IonicModule,
  	EasyahCommonModule,
    EasyahHeaderModule,
  	CommonModule,
  	SearchRoutingModule,
    RouterModule.forChild([{ path: '', component: SearchPage }])
  ]
  ,declarations: [
  	SearchPage
  ]
  ,providers: [
    SearchService
  ]
})
export class SearchPageModule {}

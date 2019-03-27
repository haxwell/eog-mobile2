import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SearchPage } from './search.page';

import { SearchRoutingModule } from './search-routing.module';

@NgModule({
  imports: [
  	CommonModule,
  	SearchRoutingModule
  ]
  ,declarations: [
  	SearchPage
  ]
  ,providers: [

  ]
})
export class SearchPageModule {}

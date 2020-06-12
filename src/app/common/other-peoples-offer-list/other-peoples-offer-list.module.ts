import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { OtherPeoplesOfferList } from './other-peoples-offer-list';

@NgModule({
  declarations: [
  	OtherPeoplesOfferList
  ],
  imports: [
  	CommonModule
  	,IonicModule
  ], 
  exports : [
  	OtherPeoplesOfferList
  ]
})
export class OtherPeoplesOfferListModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtherPeoplesOfferListModule } from '../../common/other-peoples-offer-list/other-peoples-offer-list.module'
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';
import { ListAllPageRoutingModule } from './list-all-routing.module';

import { ListAllPage } from './list-all.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OtherPeoplesOfferListModule,
    EasyahHeaderModule,
    ListAllPageRoutingModule
  ],
  declarations: [ListAllPage]
})
export class ListAllPageModule {}

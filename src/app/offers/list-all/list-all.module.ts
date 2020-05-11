import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EasyahCommonModule } from '../../common/easyah-common.module'
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';
import { ListAllPageRoutingModule } from './list-all-routing.module';

import { ListAllPage } from './list-all.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EasyahCommonModule,
    EasyahHeaderModule,
    ListAllPageRoutingModule
  ],
  declarations: [ListAllPage]
})
export class ListAllPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListPageRoutingModule } from './list-routing.module';
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module'

import { ListPage } from './list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EasyahHeaderModule,
    ListPageRoutingModule
  ],
  declarations: [ListPage]
})
export class ListPageModule {}

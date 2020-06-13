import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';
import { UsersLineItemModule } from '../../common/users-line-item/users-line-item.module';

import { DetailPageRoutingModule } from './detail-routing.module';

import { DetailPage } from './detail.page';
import { DeletePageModule } from './delete/delete.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EasyahHeaderModule,
    UsersLineItemModule,
    DeletePageModule,
    DetailPageRoutingModule
  ],
  declarations: [DetailPage]
  // entryComponents: [DeletePage]
})
export class DetailPageModule {}

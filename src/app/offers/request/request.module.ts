import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestPageRoutingModule } from './request-routing.module';
import { UsersLineItemModule } from '../../common/users-line-item/users-line-item.module';

import { RequestPage } from './request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsersLineItemModule,
    RequestPageRoutingModule
  ],
  declarations: [RequestPage]
})
export class RequestPageModule {}

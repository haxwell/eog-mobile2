import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AcceptPageRoutingModule } from './accept-routing.module';

import { AcceptPage } from './accept.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AcceptPageRoutingModule
  ],
  declarations: [AcceptPage]
})
export class AcceptPageModule {}

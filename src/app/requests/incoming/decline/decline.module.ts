import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeclinePageRoutingModule } from './decline-routing.module';

import { DeclinePage } from './decline.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeclinePageRoutingModule
  ],
  declarations: [DeclinePage]
})
export class DeclinePageModule {}

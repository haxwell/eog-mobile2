import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NotCompletePageRoutingModule } from './not-complete-routing.module';

import { NotCompletePage } from './not-complete.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NotCompletePageRoutingModule
  ],
  declarations: [NotCompletePage]
})
export class NotCompletePageModule {}

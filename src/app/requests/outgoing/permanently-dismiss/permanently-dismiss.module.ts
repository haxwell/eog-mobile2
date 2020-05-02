import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PermanentlyDismissPageRoutingModule } from './permanently-dismiss-routing.module';

import { PermanentlyDismissPage } from './permanently-dismiss.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PermanentlyDismissPageRoutingModule
  ],
  declarations: [PermanentlyDismissPage]
})
export class PermanentlyDismissPageModule {}

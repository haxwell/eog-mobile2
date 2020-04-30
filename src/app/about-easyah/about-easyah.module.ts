import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EasyahHeaderModule } from '../easyah-header/easyah-header.module';

import { AboutEasyahPageRoutingModule } from './about-easyah-routing.module';

import { AboutEasyahPage } from './about-easyah.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EasyahHeaderModule,
    AboutEasyahPageRoutingModule
  ],
  declarations: [AboutEasyahPage]
})
export class AboutEasyahPageModule {}

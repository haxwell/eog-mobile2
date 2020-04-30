import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { EasyahHeader } from './easyah-header/easyah-header.component';

@NgModule({
  declarations: [
  	EasyahHeader
  ],
  imports: [
  	CommonModule
  	,IonicModule
  ], 
  exports : [
  	EasyahHeader
  ]
})
export class EasyahHeaderModule { }

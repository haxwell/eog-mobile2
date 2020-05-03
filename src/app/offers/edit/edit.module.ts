import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { EditPageRoutingModule } from './edit-routing.module';

import { EditPage } from './edit.page';
import { RulePage } from './rule/rule.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    EasyahHeaderModule,
    EditPageRoutingModule
  ],
  declarations: [EditPage, RulePage],
  entryComponents: [RulePage]
})
export class EditPageModule {}

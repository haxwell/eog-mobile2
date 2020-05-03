import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChoosePhotoSourceModule } from '../../common/choose-photo-source/choose-photo-source.module'
import { EditPageRoutingModule } from './edit-routing.module';

import { EditPage } from './edit.page';
import { ChoosePhotoSourcePage } from '../../common/choose-photo-source/choose-photo-source';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChoosePhotoSourceModule,
    EditPageRoutingModule
  ],
  declarations: [EditPage]
  ,entryComponents: [
    ChoosePhotoSourcePage
  ]
})
export class EditPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { DeletePage } from './delete.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
  ],
  declarations: [DeletePage],
  entryComponents: [DeletePage]
})
export class DeletePageModule {}

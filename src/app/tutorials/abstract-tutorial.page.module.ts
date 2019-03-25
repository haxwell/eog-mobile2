import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';

import { AbstractTutorialPage } from './abstract-tutorial.page'

@NgModule({
  imports: [
    IonicModule
  ]
  ,declarations: [
  	AbstractTutorialPage
  ]
  ,providers: [

  ],
  exports: [ 
  	AbstractTutorialPage 
  ]
  ,bootstrap: [ AbstractTutorialPage ]
})
export class AbstractTutorialPageModule {}

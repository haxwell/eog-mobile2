import { IonicModule } from '@ionic/angular';
//import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { RequestsIncomingPageModule } from './incoming/requests-incoming.module';
import { RequestsOutgoingPageModule } from './outgoing/requests-outgoing.module';

@NgModule({
  imports: [
    IonicModule
    //,RouterModule.forChild([ ])
    ,CommonModule
    ,FormsModule
    ,HttpModule

    ,RequestsIncomingPageModule
    ,RequestsOutgoingPageModule
  ]
  ,declarations: [

  ]
  ,providers: [

  ]
})
export class RequestPageModule {}

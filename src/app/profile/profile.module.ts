import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProfilePage } from './profile.page';
import { ProfileEditPage } from './profile-edit.page';

import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  imports: [
  	CommonModule,
  	ProfileRoutingModule
  ]
  ,declarations: [
  	ProfilePage,
  	ProfileEditPage
  ]
  ,providers: [

  ]
})
export class ProfilePageModule {}

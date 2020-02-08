import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Push } from '@ionic-native/push/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx'
import { File } from '@ionic-native/file/ngx'
import { FilePath } from '@ionic-native/file-path/ngx'
import { Geolocation } from '@ionic-native/geolocation/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx'

import { Events, IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SavvatoJavascriptServicesModule } from 'savvato-javascript-services'

import { EasyahCommonModule } from './common/easyah-common.module'

import { Constants } from '../_constants/constants'

import { AlertService } from './_services/alert.service'; // Can be pushed down?
import { UserService } from './_services/user.service'; 
import { LoadingService } from './_services/loading.service'; 
import { ApiService } from './_services/api.service'; 
import { AuthService } from './_services/auth.service';
import { PictureService } from './_services/picture.service';

import { CanActivateRouteGuard } from './_routeguards/can-activate.routeguard';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

export class CustomHammerConfig extends HammerGestureConfig {
    overrides = {
        'press': { time: 700 }  //set press delay for .70 seconds
    }
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    CommonModule,
    IonicModule.forRoot(), // Somehow.. this is used for creating singleton services???
    AppRoutingModule,
    HttpClientModule

    ,EasyahCommonModule
    ,SavvatoJavascriptServicesModule.forRoot()    
  ],

  providers: [
    Camera
    ,Events
    ,File
    ,FilePath
    ,FileTransfer
    ,Geolocation
    ,StatusBar
    ,SplashScreen
    ,WebView

    ,Constants
    
    ,AlertService
    ,ApiService
    ,AuthService
    ,LoadingService
    ,PictureService
    ,UserService
    
    ,CanActivateRouteGuard
    
    ,{ provide: RouteReuseStrategy,       useClass: IonicRouteStrategy }
    ,{ provide: HAMMER_GESTURE_CONFIG,    useClass: CustomHammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '../../../_constants/constants';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationService } from '../../_services/geolocation.service'
import { GeolocationServiceMock }  from '../../../../test-config/mocks-easyah'

import { ProfileModelService } from '../../_services/profile-model.service'
import { ProfileModelServiceMock }  from '../../../../test-config/mocks-easyah'

import { EditPage } from './edit.page';

describe('Profile EditPage', () => {
  let component: EditPage;
  let fixture: ComponentFixture<EditPage>;

  let mockProfileModelService = new ProfileModelServiceMock();
  let mockGeolocationService: GeolocationServiceMock;

  beforeEach(async(() => {
    mockGeolocationService = new GeolocationServiceMock();

    TestBed.configureTestingModule({
      declarations: [ EditPage ],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule, EasyahHeaderModule, HttpClientModule, RouterTestingModule]
      ,providers: [
        { provide: Location, useClass: Location }
        ,{ provide: FileTransfer, useClass: FileTransfer }
        ,{ provide: File, useClass: File }
        ,{ provide: Constants, useClass: Constants }
        ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
        ,{ provide: DomSanitizer, useValue: { sanitize: () => { }, bypassSecurityTrustResourceUrl: (val) => { return val; }}}
        ,{ provide: Geolocation, useClass: Geolocation }
        // ,{ provide: ApiService, useValue: mockApiService }
        ,{ provide: GeolocationService, useValue: mockGeolocationService }
        ,{ provide: ProfileModelService, useValue: mockProfileModelService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

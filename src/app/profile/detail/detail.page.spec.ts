import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '../../../_constants/constants';

import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GeolocationService } from '../../_services/geolocation.service'
import { GeolocationServiceMock }  from '../../../../test-config/mocks-easyah'

import { ApiService } from '../../_services/api.service'
import { ApiServiceMock } from '../../../../test-config/mocks-easyah'
import { UserService } from '../../_services/user.service'
import { UserServiceMock } from '../../../../test-config/mocks-easyah'
import { ProfileModelService } from '../../_services/profile-model.service'
import { ProfileModelServiceMock } from '../../../../test-config/mocks-easyah'

import { DetailPage } from './detail.page';

describe('Profile DetailPage', () => {
  let component: DetailPage;
  let fixture: ComponentFixture<DetailPage>;

  let mockUserService: UserServiceMock;
  let mockGeolocationService: GeolocationServiceMock;
  let mockApiService: ApiServiceMock;
  let mockProfileModelService: ProfileModelServiceMock;

  beforeEach(async(() => {
    mockUserService = new UserServiceMock();
    mockGeolocationService = new GeolocationServiceMock();
    mockApiService = new ApiServiceMock();
    mockProfileModelService = new ProfileModelServiceMock();

    TestBed.configureTestingModule({
      declarations: [ DetailPage ],
      imports: [IonicModule.forRoot(), EasyahHeaderModule, HttpClientModule, RouterTestingModule]
      ,providers: [
        { provide: Location, useClass: Location }
        ,{ provide: FileTransfer, useClass: FileTransfer }
        ,{ provide: File, useClass: File }
        ,{ provide: Constants, useClass: Constants }
        ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
        ,{ provide: DomSanitizer, useValue: { sanitize: () => { }, bypassSecurityTrustResourceUrl: (val) => { return val; }}}
        ,{ provide: Geolocation, useClass: Geolocation }
        ,{ provide: ApiService, useValue: mockApiService }
        ,{ provide: GeolocationService, useValue: mockGeolocationService }
        ,{ provide: UserService, useValue: mockUserService }
        ,{ provide: ProfileModelService, useValue: mockProfileModelService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

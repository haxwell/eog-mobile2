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

import { UsersLineItemModule } from '../../common/users-line-item/users-line-item.module'

import { UserPreferencesService } from '../../_services/user-preferences.service'
import { UserPreferencesServiceMock }  from '../../../../test-config/mocks-easyah'
import { OfferModelService } from '../../_services/offer-model.service'
import { OfferModelServiceMock }  from '../../../../test-config/mocks-easyah'

import { RequestPage } from './request.page';

describe('RequestPage', () => {
  let component: RequestPage;
  let fixture: ComponentFixture<RequestPage>;

  let userPreferencesServiceMock = new UserPreferencesServiceMock();
  let offerModelServiceMock = new OfferModelServiceMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPage ],
      imports: [IonicModule.forRoot(), UsersLineItemModule, RouterTestingModule, HttpClientModule]
      ,providers: [
        { provide: Location, useClass: Location }
        ,{ provide: FileTransfer, useClass: FileTransfer }
        ,{ provide: File, useClass: File }
        ,{ provide: Constants, useClass: Constants }
        ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
        ,{ provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: (val) => { return val; }}}
        ,{ provide: UserPreferencesService, useValue: userPreferencesServiceMock }
        ,{ provide: OfferModelService, useValue: offerModelServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

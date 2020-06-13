import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';

// import { PictureService } from '../../../_services/picture.service';

import { Constants } from '../../../../_constants/constants';

import { ApiService } from '../../../../app/_services/api.service'
import { DeclinePageApiServiceMock } from '../../../../../test-config/mocks-easyah'
import { UserPreferencesService } from '../../../_services/user-preferences.service'
import { UserPreferencesServiceMock }  from '../../../../../test-config/mocks-easyah'
import { InteractionsService } from '../_services/interactions.service'
import { InteractionsServiceMock }  from '../../../../../test-config/mocks-easyah'
import { OfferModelServiceMock } from '../../../../../test-config/mocks-easyah'
import { UserServiceMock } from '../../../../../test-config/mocks-easyah'
import { ModelService } from '../_services/model.service'

import { DeclinePage } from './decline.page';

describe('DeclinePage', () => {
  let component: DeclinePage;
  let fixture: ComponentFixture<DeclinePage>;

  let userPreferencesServiceMock = new UserPreferencesServiceMock();
  let mockApiService = new DeclinePageApiServiceMock();

  beforeEach(async(() => {
    let _offerModelServiceMock = new OfferModelServiceMock();
    let _userServiceMock = new UserServiceMock();
    let DeclinePageModelServiceMock = { getModel: () => { return { offer: _offerModelServiceMock.model, directionallyOppositeUser: _userServiceMock.model }}}


    TestBed.configureTestingModule({
      declarations: [ DeclinePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule, FormsModule]
      ,providers: [
           { provide: ApiService, useValue: mockApiService }
          ,{ provide: FileTransfer, useClass: FileTransfer }
          ,{ provide: File, useClass: File }
          ,{ provide: Constants, useClass: Constants }
          ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
          ,{ provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: (val) => { return val; }}}
          // ,{ provide: PictureService, useClass: PictureService }
          ,{ provide: UserPreferencesService, useValue: userPreferencesServiceMock }
          ,{ provide: ModelService, useValue: DeclinePageModelServiceMock }
      ]

    }).compileComponents();

    fixture = TestBed.createComponent(DeclinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

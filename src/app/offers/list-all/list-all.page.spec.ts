import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'

import { OtherPeoplesOfferListModule } from '../../common/other-peoples-offer-list/other-peoples-offer-list.module'
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { Constants } from '../../../_constants/constants';

import { ListAllPage } from './list-all.page';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';

import { ApiService } from '../../../app/_services/api.service'
import { ListAllOffersPageApiServiceMock } from '../../../../test-config/mocks-easyah'
import { UserService } from '../../../app/_services/user.service'
import { UserServiceMock } from '../../../../test-config/mocks-easyah'

import { of as observableOf } from 'rxjs/observable/of'

describe('ListAllPage', () => {

  let component: ListAllPage;
  let fixture: ComponentFixture<ListAllPage>;

  let mockUserService: UserServiceMock;
  let mockApiService: ListAllOffersPageApiServiceMock;

  beforeEach(async(() => {
    mockUserService = new UserServiceMock();
    mockApiService = new ListAllOffersPageApiServiceMock();

    TestBed.configureTestingModule({
      declarations: [ ListAllPage ],
      providers: [ { provide: FileTransfer, useClass: FileTransfer }
            ,{ provide: File, useClass: File }
            ,{ provide: Constants, useClass: Constants }
            ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
            ,{ provide: DomSanitizer, useValue: { sanitize: () => { }, bypassSecurityTrustResourceUrl: (val) => { return val; }}}
            ,{ provide: UserService, useValue: mockUserService }
            ,{ provide: ApiService, useValue: mockApiService }
      ],
      imports: [IonicModule.forRoot(), HttpClientModule, RouterTestingModule, EasyahHeaderModule, OtherPeoplesOfferListModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

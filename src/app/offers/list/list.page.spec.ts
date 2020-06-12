import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';

import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { ListPage } from './list.page';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '../../../_constants/constants';

import { OfferCollectionService } from '../../_services/offer-collection.service'
import { OfferCollectionServiceMock } from '../../../../test-config/mocks-easyah'

describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;

  let _offerCollectionServiceMock = new OfferCollectionServiceMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPage ],
      imports: [IonicModule.forRoot(), EasyahHeaderModule, RouterTestingModule, HttpClientModule],
      providers: [
             { provide: FileTransfer, useClass: FileTransfer }
            ,{ provide: File, useClass: File }
            ,{ provide: Constants, useClass: Constants }
            ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
            ,{ provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: (val) => { return val; }}}
            ,{ provide: OfferCollectionService, useValue: _offerCollectionServiceMock }
        ]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

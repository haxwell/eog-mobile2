import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { Constants } from '../../../_constants/constants';

import { ListPage } from './list.page';

import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { NotificationService } from '../../../app/_services/notification.service'
import { NotificationServiceMock } from '../../../../test-config/mocks-easyah'

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';

describe('ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;

  let mockNotificationService: NotificationServiceMock;

  beforeEach(async(() => {
    mockNotificationService = new NotificationServiceMock();
    TestBed.configureTestingModule({
      declarations: [ ListPage ],
      providers: [             
        { provide: FileTransfer, useClass: FileTransfer }
        ,{ provide: File, useClass: File }
        ,{ provide: Constants, useClass: Constants }
        ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
        ,{ provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: (val) => { return val; }}}
        ,{ provide: NotificationService, useValue: mockNotificationService }
      ],
      imports: [IonicModule.forRoot(), EasyahHeaderModule, HttpClientModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

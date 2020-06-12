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

import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { UserService } from '../../_services/user.service'
import { UserServiceMock }  from '../../../../test-config/mocks-easyah'

import { DetailPage } from './detail.page';

describe('Offers DetailPage', () => {
  let component: DetailPage;
  let fixture: ComponentFixture<DetailPage>;

  let userServiceMock = new UserServiceMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPage ],
      imports: [IonicModule.forRoot(), UsersLineItemModule, EasyahHeaderModule, HttpClientModule, RouterTestingModule]
      ,providers: [
        { provide: Location, useClass: Location }
        ,{ provide: FileTransfer, useClass: FileTransfer }
        ,{ provide: File, useClass: File }
        ,{ provide: Constants, useClass: Constants }
        ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
        ,{ provide: DomSanitizer, useValue: { sanitize: () => { }, bypassSecurityTrustResourceUrl: (val) => { return val; }}}
        ,{ provide: UserService, useValue: userServiceMock }        
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

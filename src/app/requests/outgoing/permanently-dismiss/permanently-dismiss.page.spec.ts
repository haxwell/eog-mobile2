import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '../../../../_constants/constants';

import { RequestsService }   from '../../../../app/_services/requests.service';
import { RequestsServiceMock } from '../../../../../test-config/mocks-easyah'

import { ModelService } from '../_services/model.service';

import { PermanentlyDismissPage } from './permanently-dismiss.page';

describe('Outgoing PermanentlyDismissPage', () => {
  let component: PermanentlyDismissPage;
  let fixture: ComponentFixture<PermanentlyDismissPage>;

  let mockRequestsService: RequestsServiceMock;

  beforeEach(async(() => {
    mockRequestsService = new RequestsServiceMock();

    TestBed.configureTestingModule({
      declarations: [ PermanentlyDismissPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule]
      ,providers: [
           { provide: FileTransfer, useClass: FileTransfer }
          ,{ provide: File, useClass: File }
          ,{ provide: Constants, useClass: Constants }
          ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
          ,{ provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: (val) => { return val; }}}
          ,{ provide: RequestsService, useValue: mockRequestsService }          
          ,{ provide: ModelService, useValue: { getModel: () => { return mockRequestsService.getModel(); }}}
      ]      
    }).compileComponents();

    fixture = TestBed.createComponent(PermanentlyDismissPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

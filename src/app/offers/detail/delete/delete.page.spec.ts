import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { UsersLineItemModule } from '../../../common/users-line-item/users-line-item.module';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'

import { DeletePage } from './delete.page';

import { Constants } from '../../../../_constants/constants';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';

import { RequestsService }   from '../../../../app/_services/requests.service';
import { RequestsServiceMock } from '../../../../../test-config/mocks-easyah'
import { RequestMetadataService }   from '../../../../app/_services/request-metadata.service';
import { RequestMetadataServiceMock } from '../../../../../test-config/mocks-easyah'
import { OfferModelService } from '../../../../app/_services/offer-model.service'
import { OfferModelServiceMock } from '../../../../../test-config/mocks-easyah'

import { ModelService } from '../../_services/model.service'

describe('DeletePage', () => {
  let component: DeletePage;
  let fixture: ComponentFixture<DeletePage>;

  let mockRequestsService: RequestsServiceMock;
  let mockRequestMetadataService: RequestMetadataServiceMock;
  let mockOfferModelService: OfferModelServiceMock;
  let deletePageModelServiceMock;

  beforeEach(async(() => {
    mockRequestsService = new RequestsServiceMock();
    mockRequestMetadataService = new RequestMetadataServiceMock();
    mockOfferModelService = new OfferModelServiceMock();
    deletePageModelServiceMock = { getModel: () => { return { model: mockOfferModelService.model, props: { }, callbackFunc: () => { } }}};

    TestBed.configureTestingModule({
      declarations: [ DeletePage ]
      ,imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule, UsersLineItemModule]
      ,providers: [
             { provide: FileTransfer, useClass: FileTransfer }
            ,{ provide: File, useClass: File }
            ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
            ,{ provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: (val) => { return val; }}}
            ,{ provide: Constants, useClass: Constants }
            ,{ provide: RequestsService, useValue: mockRequestsService }
            ,{ provide: RequestMetadataService, useValue: mockRequestMetadataService }
            ,{ provide: OfferModelService, useValue: mockOfferModelService }
            ,{ provide: ModelService, useValue: deletePageModelServiceMock }            
            ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { Constants } from '../../../../_constants/constants';

import { ListAllOfferService } from './list-all.service';

// import { PictureService } from '../../../../app/_services/picture.service'
// import { PictureServiceMock } from '../../../../../test-config/mocks-easyah'

import { ApiService } from '../../../../app/_services/api.service'
import { ListAllOffersApiServiceMock } from '../../../../../test-config/mocks-easyah'
import { UserService } from '../../../../app/_services/user.service'
import { UserServiceMock } from '../../../../../test-config/mocks-easyah'

// import { WebView } from '@ionic-native/ionic-webview/ngx';
// import { DomSanitizer } from '@angular/platform-browser';

describe('ListAllOfferService', () => {
  let mockUserService: UserServiceMock;
  let mockApiService: ListAllOffersApiServiceMock;
  // let mockPictureService: PictureServiceMock;

  beforeEach(() => {
    mockUserService = new UserServiceMock();
    mockApiService = new ListAllOffersApiServiceMock();
    // mockPictureService = new PictureServiceMock();

    TestBed.configureTestingModule({ 
      imports: [HttpClientModule],
      providers: [ 
        { provide: Constants, useClass: Constants }
        ,{ provide: FileTransfer, useClass: FileTransfer }
        ,{ provide: File, useClass: File }
        // ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
        // ,{ provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: (val) => { return val; }}}
        ,{ provide: UserService, useValue: mockUserService }
        ,{ provide: ApiService, useValue: mockApiService }
        // ,{ provide: PictureService, useValue: mockPictureService }
      ]
    })});

  it('should be created', () => {
    const service: ListAllOfferService = TestBed.get(ListAllOfferService);
    expect(service).toBeTruthy();
  });
});



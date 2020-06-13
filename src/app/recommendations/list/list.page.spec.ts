import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { Constants } from '../../../_constants/constants';

import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { UserService } from '../../../app/_services/user.service'
import { UserServiceMock } from '../../../../test-config/mocks-easyah'
import { RecommendationService } from '../../../app/_services/recommendation.service'
import { RecommendationServiceMock } from '../../../../test-config/mocks-easyah'
import { PictureService } from '../../../app/_services/picture.service'

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';

import { ListPage } from './list.page';

describe('Your Recommendations ListPage', () => {
  let component: ListPage;
  let fixture: ComponentFixture<ListPage>;

  let mockRecommendationService: RecommendationServiceMock;
  let mockUserService: UserServiceMock;

  beforeEach(async(() => {
    mockUserService = new UserServiceMock();
    mockRecommendationService = new RecommendationServiceMock();

    TestBed.configureTestingModule({
      declarations: [ ListPage ],
      providers: [             
        { provide: FileTransfer, useClass: FileTransfer }
        ,{ provide: File, useClass: File }
        ,{ provide: Constants, useClass: Constants }
        ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
        ,{ provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: (val) => { return val; }}}
        ,{ provide: RecommendationService, useValue: mockRecommendationService }
        ,{ provide: PictureService, useClass: PictureService }        
        ,{ provide: UserService, useValue: mockUserService }
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

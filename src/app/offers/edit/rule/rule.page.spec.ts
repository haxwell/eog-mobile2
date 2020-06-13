import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EasyahHeaderModule } from '../../../easyah-header/easyah-header.module';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { Constants } from '../../../../_constants/constants';

import { OfferModelService } from '../../../_services/offer-model.service'
import { OfferModelServiceMock }  from '../../../../../test-config/mocks-easyah'

import { RulePage } from './rule.page';

describe('Offers RulePage', () => {
  let component: RulePage;
  let fixture: ComponentFixture<RulePage>;

  let offerModelServiceMock = new OfferModelServiceMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulePage ],
      imports: [IonicModule.forRoot(), ReactiveFormsModule, FormsModule, EasyahHeaderModule, HttpClientModule, RouterTestingModule]
      ,providers: [
        { provide: Location, useClass: Location }
        ,{ provide: FileTransfer, useClass: FileTransfer }
        ,{ provide: File, useClass: File }
        ,{ provide: Constants, useClass: Constants }
        ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
        ,{ provide: DomSanitizer, useValue: { sanitize: () => { }, bypassSecurityTrustResourceUrl: (val) => { return val; }}}
        ,{ provide: OfferModelService, useValue: offerModelServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


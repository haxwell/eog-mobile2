import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'
import { Constants } from '../../../../_constants/constants';

import { ListAllOfferService } from './list-all.service';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer } from '@angular/platform-browser';

describe('ListAllOfferService', () => {
  beforeEach(() => TestBed.configureTestingModule({
  	imports: [HttpClientModule],
  	providers: [ 
  		{ provide: Constants, useClass: Constants }
  	    ,{ provide: FileTransfer, useClass: FileTransfer }
        ,{ provide: File, useClass: File },
        ,{ provide: WebView, useValue: { convertFileSrc: (val) => { return val; }}}
        ,{ provide: DomSanitizer, useValue: { bypassSecurityTrustResourceUrl: (val) => { return val; }}}
	 ]
  }));

  it('should be created', () => {
    const service: ListAllOfferService = TestBed.get(ListAllOfferService);
    expect(service).toBeTruthy();
  });
});

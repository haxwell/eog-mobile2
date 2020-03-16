import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx'

import { ProfileModelServiceComponent } from './profile-model.service.component'
import { ProfileModelService } from './profile-model.service';
import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services';
import { PictureService } from './picture.service';

import { Constants } from '../../_constants/constants';

describe('ProfileModelService', () => {

	let fixture
	let component;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				ProfileModelServiceComponent
			],
			providers: [
		         { provide: FileTransfer, useClass: FileTransfer }
        		,{ provide: File, useClass: File }
				,{ provide: Constants, useClass: Constants }
				,{ provide: FunctionPromiseService, useClass: FunctionPromiseService }
				,{ provide: PictureService, useClass: PictureService }
			],
			imports: [ HttpClientModule ]
		})

		fixture = TestBed.createComponent(ProfileModelServiceComponent);
		component = fixture.componentInstance;	
	});

  it('should be created', () => {
  	expect(component instanceof ProfileModelServiceComponent).toBe(true);

    let service: ProfileModelService = component.getService();
    expect(service instanceof ProfileModelService).toBe(true);
  });
});

import { Component, Input } from '@angular/core';

import { NavParams } from '@ionic/angular';

import { CameraService } from '../../_services/camera.service';

@Component({
  selector: 'page-choose-photo-source',
  templateUrl: 'choose-photo-source.html'
})

export class ChoosePhotoSourcePage {

	@Input() model: any;
	@Input() props: any;
	@Input() callbackFunc;

	constructor(private cameraService: CameraService,
				public params: NavParams) {

	}

	onCameraBtnTap(evt) {
		let self = this;
		
		self.cameraService.takePicture().then((uriAndExif) => { 
			console.log("just took a picture. Its at " + uriAndExif["uri"]);
			self.callbackFunc({imageFileSource: 'camera', imageFileURI: uriAndExif["uri"], exif: uriAndExif["exif"]});
		});
	}

	onGalleryBtnTap(evt) {
		let self = this;

		self.cameraService.loadGalleryPicture().then((uriAndExif) => {
			console.log("just set a picture from the gallery. Its at " + uriAndExif["uri"]);
			self.callbackFunc({imageFileSource: 'gallery', imageFileURI: uriAndExif["uri"], exif: uriAndExif["exif"]});
		});
	}

	onCancelBtnTap(evt) {
		this.callbackFunc();
	}
}

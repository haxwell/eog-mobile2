import { Component } from '@angular/core';

import { NavParams } from '@ionic/angular';

import { ModalService } from '../../_services/modal.service';
import { CameraService } from '../../_services/camera.service';

@Component({
  selector: 'page-choose-photo-source',
  templateUrl: 'choose-photo-source.html'
})

export class ChoosePhotoSourcePage {

	imageFileURI: string = undefined;
	imageFileSource: string = undefined;

	constructor(private _modalService: ModalService, 
				//private viewCtrl: ViewController, 
				private cameraService: CameraService,
				public params: NavParams) {

		this.imageFileURI = params.get('fileURI');
		this.imageFileSource = params.get('fileSource');
	}

	onCameraBtnTap(evt) {
		let self = this;
		self.imageFileURI = undefined;
		
		//self.viewCtrl.dismiss(new Promise((resolve, reject) => {
		self._modalService.dismiss(ChoosePhotoSourcePage, new Promise((resolve, reject) => {
			self.cameraService.takePicture().then((uriAndExif) => { 

				self.imageFileURI = uriAndExif["uri"];
				console.log("just took a picture. Its at " + self.imageFileURI);
				
				resolve({imageFileSource: 'camera', imageFileURI: self.imageFileURI, exif: uriAndExif["exif"]});
			});
		}));
	}

	onGalleryBtnTap(evt) {
		let self = this;
		self.imageFileURI = undefined;

		//self.viewCtrl.dismiss(new Promise((resolve, reject) => {
		self._modalService.dismiss(ChoosePhotoSourcePage, new Promise((resolve, reject) => {
			self.cameraService.loadGalleryPicture().then((uriAndExif) => { 

				self.imageFileURI = uriAndExif["uri"];
				console.log("just set a picture from the gallery. Its at " + self.imageFileURI);

				resolve({imageFileSource: 'gallery', imageFileURI: self.imageFileURI, exif: uriAndExif["exif"]});
			});
		}));
	}

	onCancelBtnTap(evt) {
		// this.viewCtrl.dismiss();
		this._modalService.dismiss(ChoosePhotoSourcePage);
	}
}

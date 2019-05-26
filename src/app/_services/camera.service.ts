import { Injectable } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';

import { PictureEXIFService } from './picture-exif.service';

@Injectable({
	providedIn: 'root'
})
export class CameraService {
	
	base64Image: string = undefined;
	imageFileURI: string = undefined;
	
	constructor(private _camera: Camera,
				private _filePath: FilePath,
				private _pictureEXIFService: PictureEXIFService) { 

	}

	init() {

	}

	takePicture() {
		let self = this;

		return new Promise((resolve, reject) => {
			console.log("onThumbnailPress() called");
			const options: CameraOptions = {
			 	quality: 100,
			 	destinationType: self._camera.DestinationType.FILE_URI,
			 	encodingType: self._camera.EncodingType.JPEG,
			 	mediaType: self._camera.MediaType.PICTURE
			}

			self._camera.getPicture(options).then((imageFileURI) => {
				if (self.isFileURI(imageFileURI)) {
			 		self.imageFileURI = imageFileURI;

			 		this._pictureEXIFService.getEXIFMetadata(imageFileURI).then((exifMetadata) => {
						resolve({uri: self.imageFileURI, exif: exifMetadata});
			 		})

			 	} else {
			 		// Handle error
			 	}
			}, (err) => {
			 	// Handle error
			});
		})
	}

	isFileURI(data) {
		return (typeof(data) == 'string') && (data.startsWith("file:///"));
	}

	isContentURI(data) {
		return (typeof(data) == 'string') && (data.startsWith("content://"));
	}

	isBase64(data) {
		var base64Regex = /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i;
		return base64Regex.test(data); // data is the base64 string
	}


// WILO 18 may - the image loader component is using the asynchronus job queue version of the loading 
//  func that it was doing before.. same everything scept its using the code I wrote.. I think that is
//  all good. For some reason the photo does not show up in the client. I think it is expecting a callback
// via a promise or something.


	loadGalleryPicture() {
		let self = this;

		return new Promise((resolve, reject) => {
			const options: CameraOptions = {
			 	sourceType: self._camera.PictureSourceType.PHOTOLIBRARY,
			 	destinationType: self._camera.DestinationType.FILE_URI,
			 	encodingType: self._camera.EncodingType.JPEG,
			 	correctOrientation: true
			}

			self._camera.getPicture(options).then((imageFileURI) => {
				if (self.isFileURI(imageFileURI)) {
			 		self.imageFileURI = imageFileURI;

			 		this._pictureEXIFService.getEXIFMetadata(imageFileURI).then((exifMetadata) => {
			 			resolve({uri: self.imageFileURI, exif: exifMetadata});
			 		})

				} else if (self.isContentURI(imageFileURI)) {
					self._filePath.resolveNativePath(imageFileURI).then((filePath) => {
						self.imageFileURI = filePath;

				 		this._pictureEXIFService.getEXIFMetadata(imageFileURI).then((exifMetadata) => {
				 			resolve({uri: self.imageFileURI, exif: exifMetadata});
				 		})

					}, (err) => {
						console.error("error getting path for the selected image :(")
					})
			 	} else {
			 		// Handle error
			 		console.error("expected content or file uri for gallery picture. got something else.")
			 		reject(imageFileURI)
			 	}
			}, (err) => {
			 	// Handle error
			 	console.error("The call to getPicture returned an error. //// " + JSON.stringify(err));
			 	reject(undefined)
			});
		})
	}
	
}

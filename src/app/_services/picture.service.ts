import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx'

import { ApiService } from './api.service'
import { UserService } from './user.service'
import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services';

import { Constants } from '../../_constants/constants';

import { environment } from '../../_environments/environment';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Injectable()
export class PictureService { 

	_functionPromiseService = new FunctionPromiseService();
	mostProbablePhotoPath = {};

	constructor(private _platform: Platform,
				private _http: HttpClient,
				private _apiService: ApiService,
				private _userService: UserService,
				private _constants: Constants,
				private transfer: FileTransfer
				,private _webview: WebView
				,private _domSanitizer: DomSanitizer
				,private file: File) {

	}

	init() {

		// Why do we do this? Why not just define and call a function?

		// because this gives us a framework, to call the method, and reuse the promise from it.
		//  we get the promise once, and return it over and over. Otherwise, we'd get a new promise
		//  (and new API call) each time, unless we figured a way to save the original promise.
		//  which is what this is. part of, anyway. Also, the functionPromiseService allows us to 
		//  expire the results after a certain amount of time, keeping our results fresh.

		// We don't put the SET/DELETE functionality in the framework because it will not be repeatedly called 
		//  by Angular; only once when the button is pushed.

		let self = this;

		// THE PURPOSE of this function is to get the most up to date profile picture for a given ID.
		//
		// You pass in the objId, and a path to check an existing file.
		//
		////////
		self._functionPromiseService.initFunc(self._constants.FUNCTION_KEY_PROFILE_PICTURE_GET, (data) => {

			let objId = data["objId"];
			let photoType = data["photoType"];
			let photoPath = data["path"];

			return new Promise((resolve, reject) => 
			{ 
					if (!objId)
						resolve({'path': undefined});

					if (!photoPath)
						resolve({'path': undefined});

					if (photoType != self._constants.PHOTO_TYPE_PROFILE && photoType != self._constants.PHOTO_TYPE_OFFER)
						resolve({'path': undefined});

					let lastSlash = photoPath.lastIndexOf('/');
					let path = photoPath.substring(0,lastSlash+1);
					let filename = photoPath.substring(lastSlash+1);

					console.log("PictureService get() photoPath ", photoPath)

					// check the API, it returns the timestamp of the file it has. Client checks
				    let url = environment.apiUrl + "/api/resource/" + photoType + "/" + objId + "/isFound";
				    self._apiService.get(url).subscribe((pictureAPITimestamp: number) => {

						if (pictureAPITimestamp * 1 > 0) { // meaning, this file exists on the API
				    		console.log(photoType + " " + objId + " FOUND on the API. it's retrieved timestamp = " + pictureAPITimestamp)

							// now we need the timestamp of the file on this local device we're running on...
							let checkFile = self.file.checkFile(path, filename);

							if (checkFile) {
								console.log(photoType + " " + objId + " FOUND, and checkfile object FOUND..")
								checkFile.then((fileExists) => {
									console.log(photoType + " " + objId + " checkFile fileExists = " + fileExists);
									var millis: number = +localStorage.getItem(path+filename);
									if (millis < pictureAPITimestamp) {
										//download the api picture
										console.log(photoType + " " + objId + " FOUND, and API is newer.. downloading..")

										url = environment.apiUrl + "/api/resource/" + photoType + "/" + objId;
										const fileTransfer: FileTransferObject = self.transfer.create();

										fileTransfer.download(url, path + filename).then((entry) => {
											var millis = new Date().getTime();
											localStorage.setItem(path+filename, ''+millis);

										    resolve({'path': path + filename});
								  		}, (err) => {
								    		// handle error
								    		console.log("Error downloading file, url = " + url + ", path+filename = " + (path+filename))
								    		console.log(JSON.stringify(err))
								    		resolve({'default': true, 'path': 'assets/img/defaults/color-block-' + (objId % 7) + '.jpg'});
								  		});

									} else {
										// file exists locally, and is newer than the version on the API. 
										//  keep it, and resolve with the path and filename of our local, still-fresh, file.
										let rtn = {'path': path + filename};
										console.log(photoType + " " + objId + " FOUND, and local version is newer.. resolving", rtn)
										resolve(rtn);
									}
								}).catch(e => {
									// call to checkfile failed.. the file likely does not exist.. regardless try downloading it from the server.

									console.log(photoType + " " + objId + " FOUND.. PictureService, call to checkfile failed.. the file likely does not exist locally.. about to try downloading it")

									url = environment.apiUrl + "/api/resource/" + photoType + "/" + objId;
									const fileTransfer: FileTransferObject = self.transfer.create();

									fileTransfer.download(url, path + filename).then((entry) => {
										var millis = new Date().getTime();
										localStorage.setItem(path+filename, ''+millis);
										let rtn = {'path': path + filename}
										console.log(photoType + " " + objId + " FOUND.. downloaded file from API ", url, rtn);
									    resolve(rtn);
							  		}, (err) => {
							    		// handle error
							    		console.log("Error downloading file, url = " + url + ", path+filename = " + (path+filename))
							    		console.log(JSON.stringify(err))
							    		let rtn = {'default': true, 'path': 'assets/img/defaults/color-block-' + (objId % 7) + '.jpg'};
							    		resolve(rtn);
							  		});
								})
							} else {
								let rtn = {'default': true, 'path': 'assets/img/defaults/color-block-' + (objId % 7) + '.jpg'};
								console.log(photoType + " " + objId + " FOUND, but no checkfile object.. returning ", rtn)
								resolve(rtn);
							}

						} else { // meaning the file does not exist on the API
							// then we need to check locally is there a file.

							console.log(photoType + " " + objId + "... the file does NOT exist on the API")

							let checkFile = self.file.checkFile(path, filename)
							if (checkFile) {
								checkFile.then((isFileExists) => {
									if (isFileExists) {

										console.log(photoType + " " + objId + "... the file exists locally, we're gonna delete it.. its stale")

										// we need to remove this file. A file that does not exist on the server is stale. 
										self.file.removeFile(path, filename).then((promiseResult) => {
											console.log(photoType + " " + objId + "..., stale file removed.")
										})

										// there's no photo, so we can resolve to a default image.
										resolve({'default': true, 'path': 'assets/img/defaults/color-block-' + (objId % 7) + '.jpg'});
									} 
								}).catch(err => { 
									let rtn = {'default': true, 'path': 'assets/img/defaults/color-block-' + (objId % 7) + '.jpg'};

									if (err["code"] !== 1 || err["message"] !== "NOT_FOUND_ERR") {
										console.log("Error checking if exists file: " + path + ", " + filename)
										console.log(JSON.stringify(err))
										console.log("After err checking if exists, obj id " + objId + " returning ", rtn);
									} else {
										console.log(photoType + " " + objId + "... "+ path + filename + " did not exist. returning ", rtn);
									}

									resolve(rtn);
								})
							} else {
								console.log("For some reason checkFile was undefined.. returning a default image path")
								let rtn = {'default': true, 'path': 'assets/img/defaults/color-block-' + (objId % 7) + '.jpg'};
								resolve(rtn);
							}
						}

					}, (err) => 	{ 
						console.log("ERROR #photo-rxp9r");
						console.log(err);
						resolve({'default': true, 'path': 'assets/img/defaults/color-block-' + (objId % 7) + '.jpg'});
					})
				
			});
		});	
	}

	reset(photoType, objId) {
		return this._functionPromiseService.reset(photoType+objId);
	}

	get(photoType, objId) {
		let data = {photoType: photoType, objId: objId, path: this.getMostProbablePhotoPath(photoType, objId)}
		return this._functionPromiseService.waitAndGet(photoType+objId, this._constants.FUNCTION_KEY_PROFILE_PICTURE_GET, data);
	}

	getImmediately(photoType, objId) {
		let data = {photoType: photoType, objId: objId, path: this.getMostProbablePhotoPath(photoType, objId)}
		return this._functionPromiseService.get(photoType+objId, this._constants.FUNCTION_KEY_PROFILE_PICTURE_GET, data);
	}

	delete(photoType, objId) {

		// delete the picture from the server, so other users won't see it either
		return new Promise((resolve, reject) => {
			let url = environment.apiUrl + "/api/resource/" + photoType + "/" + objId;
			this._apiService.delete(url).subscribe((data) => {
				resolve(data);
			}, (err) => {
				reject(err);
			})
		});
	}

	save(photoType, objId, filename) {
		let self = this;
		return new Promise((resolve, reject) => {
			if (filename !== undefined) {
				console.log("@@@ PictureService is about to upload a file....")
				const fileTransfer: FileTransferObject = this.transfer.create();

				let currentUser = this._userService.getCurrentUser();

				let options: FileUploadOptions = {
				     fileKey: 'file',
				     fileName: filename, 
				     headers: {
				     	'Authorization': "Basic " + btoa(currentUser["name"] + ":" + currentUser["password"])
				     }
				}
				
				console.log("Options");
				console.log(options);

				this.file.resolveLocalFilesystemUrl(filename)
			        .then(entry => {
			            ( < FileEntry > entry).file(file => {
						    const reader = new FileReader();
						    reader.onloadend = () => {
						        const formData = new FormData();
						        const imgBlob = new Blob([reader.result], {
						            type: file.type
						        });
						        formData.append('file', imgBlob, file.name);
						        
							 	const url = environment.apiUrl + "/api/resource/" + photoType + "/" + objId;
							 	const httpOptions = {
								  headers: new HttpHeaders({
								    'Authorization': "Basic " + btoa(currentUser["name"] + ":" + currentUser["password"])
								  })
								};

							    self._http.post(url, formData, httpOptions)
							        .subscribe(res => {
							            if (res['msg'] === 'ok') {
							                console.log('File upload complete. POST to ' + url);
							                resolve();
							            } else {
							                console.log('File upload failed.')
							                reject("error posting image to server");
							            }
							        });
						    };
						    reader.readAsArrayBuffer(file);
						})
			        })
			        .catch(err => {
			            console.log('01 Error while reading file.');
			            console.log(err);
			            reject(err)
			        });
			}
		})
	}

	setMostProbablePhotoPath(photoType, objId, str) {
		this.mostProbablePhotoPath[photoType+objId] = str;
	}

	getMostProbablePhotoPath(photoType, objId) {
        if (this.mostProbablePhotoPath[photoType+objId] === undefined) {
            let cacheDirectory = undefined;

            if (this._platform.is('android') || this._platform.is('ios')) {
            	this.mostProbablePhotoPath[photoType+objId] = this.file.cacheDirectory + (photoType+objId);
            } else {
            	this.mostProbablePhotoPath[photoType+objId] = undefined;
            }
        }

		return this.mostProbablePhotoPath[photoType+objId];
	}

	getOrientationCSS(objWithImageOrientationAttr: any, additionalCSSClassList?: string) {
		// let obj = objWithImageOrientationAttr;

		let rtn = "";

		// if (obj && this._platform.is('android')) {
		// 	if (obj["imageOrientation"] === 8)
		// 		 rtn = "rotate90Counterclockwise";
		// 	else if (obj["imageOrientation"] === 3)
		// 		rtn = "rotate180";
		// 	else if (obj["imageOrientation"] === 6)
		// 		rtn = "rotate90Clockwise";
		// }

		rtn += " centered " + (additionalCSSClassList || '');

		return rtn;
	}

	// TODO: Nobody should be calling this. DELETE.
	getThumbnailImage(photoType, objId) {
		return this.getAssociatedImage(photoType, objId);
	}

	getAssociatedImage(photoType, objId) {
		if (!photoType)
			throw new Error("The photoType has not been set.")

		let id = objId;
		if (typeof objId === 'object' && objId !== null) {
			id = objId['id'];
		}

		let rtn = undefined;
		let path = this.getImmediately(photoType, id);

		if (path && path['path']) {
			let unsanitized = this._webview.convertFileSrc(path['path']);
			let sanitized = this._domSanitizer.bypassSecurityTrustResourceUrl(unsanitized);
			rtn = sanitized;
		}

		return rtn;
	}
}

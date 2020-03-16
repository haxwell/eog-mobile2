import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx'

//import { WebView } from '@ionic-native/ionic-webview/ngx';

import { ApiService } from './api.service'
import { UserService } from './user.service'
import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services';

import { Constants } from '../../_constants/constants';

import { environment } from '../../_environments/environment';

@Injectable()
export class PictureService { 

	_functionPromiseService = new FunctionPromiseService();
	mostProbablePhotoPath = {};
	isPlatformAndroid = undefined;

	constructor(private _platform: Platform,
				private _http: HttpClient,
				private _apiService: ApiService,
				private _userService: UserService,
				private _constants: Constants,
//				private _webview: WebView,
				private transfer: FileTransfer,
				private file: File) {

	}

	init() {

		this.isPlatformAndroid = this._platform.is('android')

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
				// if (document.URL.startsWith('http')) {
				// 	console.log("dddddddddd")
				// 	resolve(undefined);
				// //} else {
				 // if not running on desktop (https://forum.ionicframework.com/t/how-to-determine-if-browser-or-app/89149/10)

					if (!objId)
						resolve({'path': undefined});

					if (!photoPath)
						resolve({'path': undefined});

					if (photoType != self._constants.PHOTO_TYPE_PROFILE && photoType != self._constants.PHOTO_TYPE_OFFER)
						resolve({'path': undefined});

					let lastSlash = photoPath.lastIndexOf('/');
					let path = photoPath.substring(0,lastSlash+1);
					let filename = photoPath.substring(lastSlash+1);

					// check the API, it returns the timestamp of the file it has. Client checks
				    let url = environment.apiUrl + "/api/resource/" + photoType + "/" + objId + "/isFound";
				    self._apiService.get(url).subscribe((pictureAPITimestamp: number) => {

				    	// console.log(photoType + " " + objId + " FOUND it's API timestamp = " + pictureAPITimestamp)

						if (pictureAPITimestamp * 1 > 0) { // meaning, this file exists on the API

							// now we need the timestamp of the file on this local device we're running on...
							let checkFile = self.file.checkFile(path, filename);

							if (checkFile) {
								checkFile.then((fileExists) => {
									var millis: number = +localStorage.getItem(path+filename);
									if (millis < pictureAPITimestamp) {
										//download the api picture

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
								    		resolve({'path': undefined});
								  		});

									} else {
										resolve(path+filename);
									}
								}).catch(e => {
									// call to checkfile failed.. the file likely does not exist.. regardless try downloading it from the server.

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
							    		resolve({'path': undefined})
							  		});
								})
							} else {
								resolve({'path': undefined})
							}

						} else { // meaning the file does not exist on the API
							// then we need to check locally is there a file.

							let checkFile = self.file.checkFile(path, filename)
							if (checkFile) {
								checkFile.then((isFileExists) => {
									if (isFileExists) {

										// we need to remove this file. A file that does not exist on the server is stale. 
										self.file.removeFile(path, filename).then((promiseResult) => {
											
										})

										// there's no photo, so we can resolve undefined.
										resolve({'path': undefined})
									} 
								}).catch(err => { 
									if (err["code"] !== 1 || err["message"] !== "NOT_FOUND_ERR") {
										console.log("Error checking if exists file: " + path + ", " + filename)
										console.log(JSON.stringify(err))
									}

									resolve({'path': undefined})
								})
							} else {
								resolve({'path': undefined})
							}
						}

					}, (err) => 	{ 
						console.log("ERROR #photo-rxp9r");
						console.log(err);
						resolve({'path': undefined})
					})
				
				//} //here
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

				// filename = this._webview.convertFileSrc(filename);
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
		let obj = objWithImageOrientationAttr;

		let rtn = "";

		if (obj && this.isPlatformAndroid) {
			if (obj["imageOrientation"] === 8)
				 rtn = "rotate90Counterclockwise";
			else if (obj["imageOrientation"] === 3)
				rtn = "rotate180";
			else if (obj["imageOrientation"] === 6)
				rtn = "rotate90Clockwise";
		}

		rtn += " centered " + (additionalCSSClassList || '');

		return rtn;
	}
}

import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ModalController } from '@ionic/angular';

import { Constants } from '../../../_constants/constants'

import { LoadingService } from '../../../app/_services/loading.service'
import { AlertService } from '../../../app/_services/alert.service'
import { ProfileService } from '../../../app/_services/profile.service'
import { ProfileModelService } from '../../../app/_services/profile-model.service'
import { PictureService } from '../../../app/_services/picture.service'
import { PictureEXIFService } from '../../../app/_services/picture-exif.service'
import { GeolocationService } from '../../../app/_services/geolocation.service'
import { UserService } from '../../../app/_services/user.service'
import { UserMetadataService } from '../../../app/_services/user-metadata.service'
import { ContactInfoVisibilityService } from '../../../app/_services/contact-info-visibility.service'

import { ChoosePhotoSourcePage } from '../../../app/common/choose-photo-source/choose-photo-source'

import { environment } from '../../../_environments/environment';

import { File } from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';

import * as EXIF from 'exif-js';

@Component({
  selector: 'page-profile-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss']
})
export class EditPage {

	model = undefined;
	userId = undefined;
	dirty = false;
	isExiting = false;
	cancelBtnPressed = false;
	verifyPhoneOnSave = false;
	newCurrentLocationHasBeenSet = false;

	imageOrientation = undefined;

	contactInfoVisibilityId = undefined;
	contactInfoVisibilityChoices = undefined;

	constructor(private _modalCtrl: ModalController,
				private _loadingService: LoadingService,
				private _alertService: AlertService,
				private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,				
				private _profileService: ProfileService,
				private _profileModelService: ProfileModelService,
				private _pictureService: PictureService,
				private _pictureEXIFService: PictureEXIFService,
				private _userService: UserService,
				private _userMetadataService: UserMetadataService,
				private _contactInfoVisibilityService: ContactInfoVisibilityService,
				private _geolocationService: GeolocationService,
				private _constants: Constants,
				private _file: File,
				private _webview: WebView,
				private _domSanitizer: DomSanitizer) {

	}

	ngOnInit() {
		let self = this;
		self._route.params.subscribe((params) => {
			self.userId = self._userService.getCurrentUser()['id'];

			self._profileService.setCacheExpiry(9999999); // ~167 minutes

			self.model = self._profileService.getModel(self.userId); 
			self._userMetadataService.init();

			this.contactInfoVisibilityChoices = this._contactInfoVisibilityService.getContactInfoVisibilityChoices();
			this._contactInfoVisibilityService.getContactInfoVisibilityId(this.userId).then((visId) => {
				this.contactInfoVisibilityId = visId;
			})
		})
	}

	isDirty() {
		return this.dirty;
	}

	setDirty(b) {
		this.dirty = b;
	}

	ionViewWillEnter() {
		console.log("--- entering profile edit page");
	}

	ionViewCanLeave() {
		let self = this;
		if (this.isDirty() && !self.isExiting) {
			let msg = "";

			let _model = this._profileService.getModel(this.userId);
			
			if (this._profileModelService.isProfileImageChanged(_model) && !this.cancelBtnPressed)
				msg = "You changed your profile picture. Uploading it could take a long while. You got a minute (or ten)?";
			else
				msg = "Do you want to save your profile changes?";

			let alert = this._alertService.show({
				header: 'Save Changes?',
				message: msg,
				buttons: [{
					text: 'No', role: 'cancel', handler: () => {
						if (this._profileModelService.isProfileImageChanged(_model) && !this.isFromGallery()) {
							
							let lastSlash = self.model["imageFileURI"].lastIndexOf('/');
							let path = self.model["imageFileURI"].substring(0,lastSlash+1);
							let filename = self.model["imageFileURI"].substring(lastSlash+1);

							self._file.removeFile(path, filename).then((data) => {
								console.log("User set new profile image, but said don't save it when exiting the profile page. Image was from camera or the eog api, so it was removed from phone.");
								
								self.setDirty(false);
								
								self.model["imageFileURI"] = self.model["imageFileURI_OriginalValue"];

								self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_PROFILE, self.userId, self.model["imageFileURI"]);
								
								self._location.back();
							});

						} else {
							self.setDirty(false);
							self._location.back();
						}

					},
				}, {
					text: 'Yes', handler: () => {
						self.isExiting = false;
						self.onSaveBtnTap();
					},
				}]
			});
			self.isExiting = true;
		}

		return !this.isDirty();
	}

	getSocialMediaURL(name) {
		return this.model[name+"Url"] || "";
	}

	onCancelBtnTap() {
		this.cancelBtnPressed = true;
		this._location.back();
	}

	isSaveBtnEnabled() {
		let model = this._profileService.getModel(this.userId);

		return this.isDirty() && (model["phone"] && model["phone"].length == 10);
	}

	onSaveBtnTap() {
		let self = this;
		this._profileService.getModel(this.userId, true /* force complete model hydration */).then((presave_model) => {
			if (self.verifyPhoneOnSave) {
				self.verifyPhone(presave_model["phone"]);
				return;
			}

			self._loadingService.show({
				message: this._profileModelService.isProfileImageChanged(presave_model) ?
						'Please wait... Uploading as fast as your data connection will allow..' :
						'Please wait...'
			})

			self._contactInfoVisibilityService.saveContactInfoVisibilityByUserId(self.userId, self.contactInfoVisibilityId);

			console.log("Here is the PRE-SAVE model")
			console.log(presave_model);

			self._profileService.save(presave_model).then(() => {
					self.setDirty(false);
					
					let _model = self._profileService.getModel(self.userId);

					self._loadingService.dismiss();

					if (!self.isExiting)
						self._location.back();

				}, (err) => {
	            	self._alertService.show({
		                header: 'Arggh!',
		                message: "Something bad happened on the server. We hate when that happens. Please email us at info@easyah.com and let us know.",
		                buttons: [{
		                  text: 'OK',
		                  handler: () => {
		                    self._loadingService.dismiss();
		                  }
		                }]
		              })
	            }
			)
		});

	}

	verifyPhone(phoneNumber) {
	    let self = this;

	    self._userService.isPhoneNumberAvailable(phoneNumber).then((isAvailable) => {
	    	if (isAvailable) {
			    self._alertService.show({
		            header: 'New Phone Number',
		            message: 'We will need to verify your new number before we can save it.<br/><br/>We will send a text to your phone at ' + phoneNumber + '. Proceed?',
		            buttons: [{
		            	text: 'Cancel',
		            	role: 'cancel'
		            }, {
		            	text: 'OK',
		             	handler: (data) => {
		       				self._userService.sendCodeToPhoneNumber(phoneNumber);
		            		self.verifyPhone2(phoneNumber);
						}
		            }]
		        })

			} else {
				self._alertService.show({
					header: 'Doh!',
					message: "Sorry, that phone number is already taken :(",
					buttons: [{
						text: 'OK',
						role: 'cancel',
					}]
				})

			}
	    })
	}

	verifyPhone2(phoneNumber) {
		let self = this;

        self._alertService.show({
	      header: "What's in the text?",
	      inputs: [{
	      	name: 'code',
	      	placeholder: '..code from text msg..',
	      	type: 'number'
	      }],
	      buttons: [{
	        text: 'Cancel',
	        role: 'cancel'
	      }, {
	        text: 'Got it!',
	        handler: (data) => {
	            if (data.code !== undefined && data.code.length > 0) {

	            	self._userService.isAValidSMSChallengeCode(phoneNumber, data.code).then((b) => {
	            		if (b) {
	            			this.verifyPhoneOnSave = false;
	            			this.onSaveBtnTap();
	            		} else {
	            			self._alertService.show({
	            				header: 'Aargh...',
	            				message: "That wasn't a valid code.......",
	            				buttons: [{
	            					text: 'Grr.',
	            					handler: () => {
	            						// do nothing
	            					}
	            				}]
	            			});
	            			
	            		}
	            	});

	            } else {
	            	return false;
	            }
	        }
	      }]
	    });

	}

	setChangedAttr(key, value) {
		let rtn = false;

		let model = this._profileService.getModel(this.userId);
		if (model[key] !== value) {
			model[key] = value;
			this.setDirty(true);
			rtn = true;
		}

		return rtn;
	}

	onRealNameChange(event) {
		this.setChangedAttr("realname", event.detail.value);
	}

	onDescriptionChange(event) {
		this.setChangedAttr("description", event.detail.value);
	}

	onEmailChange(event) {
		this.setChangedAttr("email", event.detail.value);
	}

	onPhoneChange(event) {
		if (this.setChangedAttr("phone", event.detail.value))
			this.verifyPhoneOnSave = true;
	}

	getModelAttr(key) {
		return this._profileService.getModel(this.userId)[key];
	}

	isFromGallery() {
		return this._profileService.getModel(this.userId)["imageFileSource"] == 'gallery';
	}

	isDirectFilepathToImageSet() {
		return this._profileService.getModel(this.userId)["imageFileURI"] !== undefined;
	}

	getThumbnailImage() {
		let rtn = undefined;

		if (this.isDirectFilepathToImageSet()) {
			let unsanitized = this._webview.convertFileSrc(this._profileService.getModel(this.userId)["imageFileURI"]);
			let sanitized = this._domSanitizer.bypassSecurityTrustResourceUrl(unsanitized);

			rtn = sanitized;
		} else {
			rtn = this.getEnvironmentAPIURLForThisProfile();
		}

		return rtn;
	}

	getEnvironmentAPIURLForThisProfile() {
		let photoType = "profile";
		let objId = this.userId;
		return environment.apiUrl + "/api/resource/" + photoType + "/" + objId
	}

	async presentModal(_component, _model, props) {
		let self = this;
		let modal = undefined;
		let options = { 
			component: _component, 
			componentProps: {
				model: _model, 
				props: props.propsObj,  
				callbackFunc: (data) => { 
					props.callbackFunc(data); modal.dismiss(); 
				}
			}
		};

		modal = await this._modalCtrl.create(options)
		return await modal.present();
	}

	onThumbnailImageClick() {
		let self = this;
		let model = this._profileService.getModel(this.userId);

		self.presentModal(ChoosePhotoSourcePage, { }, 
			{
				propsObj: {
					fileURI: model["imageFileURI"], 
					fileSource: model["imageFileSource"]
					}, 
				callbackFunc: (uriAndSource) => {
					if (uriAndSource !== undefined) {

						let model = this._profileService.getModel(this.userId);

						if (model["imageFileURI"] !== undefined && model["imageFileSource"] == 'camera') {
							let lastSlash = model["imageFileURI"].lastIndexOf('/');
							let path = model["imageFileURI"].substring(0,lastSlash+1);
							let filename = model["imageFileURI"].substring(lastSlash+1);

							self._file.removeFile(path, filename).then((data) => {
								self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_PROFILE, self.userId, uriAndSource["imageFileURI"]);

								console.log("User saved a new profile image. [" + model["imageFileURI"] + "] is no longer the image to use, so it has been removed." );
								console.log("setting profile header model to [" + uriAndSource["imageFileURI"] + "]");

								model["imageFileURI"] = uriAndSource["imageFileURI"];
								model["imageFileSource"] = uriAndSource["imageFileSource"];

								self._pictureEXIFService.getEXIFMetadata(model["imageFileURI"]).then((exifMetadata) => {
									model["imageOrientation"] = exifMetadata["Orientation"];
								})

								//self._events.publish('profile:changedProfileImage', model["imageFileURI"]);
								self.setDirty(true);						
							})
						} else {
							console.log("no previous image to delete, so skipping that step...")
							console.log("uriAndSource = " + JSON.stringify(uriAndSource))

							self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_PROFILE, self.userId, uriAndSource["imageFileURI"]);

							model["imageFileURI"] = uriAndSource["imageFileURI"];
							model["imageFileSource"] = uriAndSource["imageFileSource"];

							self._pictureEXIFService.getEXIFMetadata(model["imageFileURI"]).then((exifMetadata) => {
								model["imageOrientation"] = exifMetadata["Orientation"];
							})

							//self._events.publish('profile:changedProfileImage', model["imageFileURI"]);
							self.setDirty(true);
						}
					}
				}
			});
	}

	onThumbnailPress() {
		this._alertService.show({
			header: 'Delete Photo?',
			message: 'Do you want to DELETE your profile picture?',
			buttons: [
				{
					text: 'No', role: 'cancel', handler: () => {
						// do nothing
					},
				}, {
					text: 'Yes', handler: () => {
						let self = this;

						let func = () => {
							let model = self._profileService.getModel(self.userId);

							model["imageFileURI"] = undefined;
							model["imageFileSource"] = undefined;
							model["imageOrientation"] = undefined;

							self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_PROFILE, self.userId, model["imageFileURI"]);
						}

						console.log('deleting photo ' + self.userId);

						self._pictureService.delete(self._constants.PHOTO_TYPE_PROFILE, self.userId).then(() => { 

							let model = self._profileService.getModel(self.userId);

							if (model["imageFileSource"] === 'camera' || model["imageFileSource"] === 'eog') {
								
								console.log("This image came from the camera, or the api.. deleting off the phone now. path=" + model['imageFileURI'] + "]")

								let lastSlash = model["imageFileURI"].lastIndexOf('/');
								let path = model["imageFileURI"].substring(0,lastSlash+1);
								let filename = model["imageFileURI"].substring(lastSlash+1);

								self._file.removeFile(path, filename).then((data) => {
									console.log("Call to pictureService to DELETE photo for "+ self.userId +" successful! Image was from camera or the eog api, so it was removed from phone.");

									func();
									
								}).catch(() => {
									console.log("Caught error trying to remove file from phone");

									func();
								});
							} else {
								console.log("Call to pictureService to DELETE photo for "+ self.userId +" successful! Image was from phone's gallery, so did not try to remove it.");

								func();								
							}

						}).catch(() => {
							console.log("An error occurred deleting the image from the server. Probably, it didn't exist there. Noting it, in case things look wonky..")

							func();
						});
					},
				}
			]
		});

	}

	isThumbnailImageVisible() {
		return this.imageOrientation !== undefined;
	}

	getAvatarCSSClassString() {
		return this._pictureService.getOrientationCSS(this._profileService.getModel(this.userId));
	}

	loaded(evt) {
		let self = this;
		EXIF.getData(evt.target, function() {
			self.imageOrientation = EXIF.getTag(this, "Orientation");
		});
	}

	isSetCurrentLocationBtnAvailable() {
		return !this.newCurrentLocationHasBeenSet;
	}

	onSetCurrentLocationAsOfficialLocation($event) {
		let self = this;

		self._loadingService.show({
			message: 'Please wait...'
		});

		self._geolocationService.getCurrentPosition().then((resp) => {
			self.setChangedAttr("latitude", resp["coords"].latitude);
			self.setChangedAttr("longitude", resp["coords"].longitude);
			self.newCurrentLocationHasBeenSet = true;

			self._loadingService.dismiss();

			self._alertService.show({
				header: 'Success',
				message: "Your location has been updated!",
				buttons: [
					{
						text: 'OK', role: 'cancel', handler: () => {
							// do nothing
						}
					}
				]
			})

		}).catch((error) => {
			self._loadingService.dismiss();

			self._alertService.show({
				header: 'Hmmm..',
				message: "Easyah could not read your device's location. Wanna just tell us where you are?",
    			inputs: [{
      				name: 'city',
      				placeholder: 'city',
      				type: 'text'
    			}, {
      				name: 'state',
      				placeholder: 'state',
      				type: 'text'
    			}],
    			buttons: [{
      				text: 'Grr. No.',
      				handler: (data) => {
      					// self._loadingService.dismiss();
      				}
    			}, {
      				text: 'Here I am!',
      				handler: (data) => {
      					if ((data.city && data.city.length >= 3) && (data.state && data.state.length >= 2)) {
                			
                			self._geolocationService.getLatlongFromCityState(data.city, data.state).then((obj) => {
                				
                				self.setChangedAttr("latitude", obj["latitude"]);
								self.setChangedAttr("longitude", obj["longitude"]);
								self.newCurrentLocationHasBeenSet = true;

								let alert = self._alertService.show({
									header: 'Success',
									message: "Your location has been updated!",
									buttons: [
										{
											text: 'OK', role: 'cancel', handler: () => {
												// self._loadingService.dismiss();
											}
										}
									]
								})

                			}, (err) => {
								self._alertService.show({
									header: 'Aargh...',
									message: "Sorry, we couldn't find that location either. :(",
									buttons: [
										{
											text: 'OK', role: 'cancel', handler: () => {
												// self._loadingService.dismiss();
											}
										}
									]
								})
                			})
                			
            			} else {
            				return false; // disble the button
            			}
            		}
            	}]
            });

        });
	}
}

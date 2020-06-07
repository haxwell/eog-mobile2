import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Validators, ValidationErrors, AsyncValidatorFn, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ModalController } from '@ionic/angular';

import { Constants } from '../../../_constants/constants'

import { LoadingService } from '../../../app/_services/loading.service'
import { AlertService } from '../../../app/_services/alert.service'
import { ProfileModelService } from '../../../app/_services/profile-model.service'
import { PictureService } from '../../../app/_services/picture.service'
import { PictureEXIFService } from '../../../app/_services/picture-exif.service'
import { GeolocationService } from '../../../app/_services/geolocation.service'
import { UserService } from '../../../app/_services/user.service'
import { UserMetadataService } from '../../../app/_services/user-metadata.service'
import { ContactInfoVisibilityService } from '../../../app/_services/contact-info-visibility.service'

import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services'

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
	verifyEmailOnSave = false;
	originalPhone = undefined;
	originalEmail = undefined;
	newCurrentLocationHasBeenSet = false;

	imageOrientation = undefined;

	contactInfoVisibilityId = undefined;
	contactInfoVisibilityChoices = undefined;

  	editAccountForm: FormGroup;

	constructor(private _modalCtrl: ModalController,
				private _loadingService: LoadingService,
				private _alertService: AlertService,
				private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,				
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
				private _domSanitizer: DomSanitizer,
				private formBuilder: FormBuilder,
				private _functionPromiseService: FunctionPromiseService) {

		this._pictureService.init();
		
	}

	ngOnInit() {
		let self = this;
		self._route.params.subscribe((params) => {
			self.userId = self._userService.getCurrentUser()['id'];

			self._profileModelService.init();
			self._profileModelService.setCacheExpiry(9999999); // ~167 minutes

			self.model = self._profileModelService.get(self.userId); 

			self._userMetadataService.init();

			this.contactInfoVisibilityChoices = this._contactInfoVisibilityService.getContactInfoVisibilityChoices();
			this._contactInfoVisibilityService.getContactInfoVisibilityId(this.userId).then((visId) => {
				this.contactInfoVisibilityId = visId;
			})
	
			this.editAccountForm = this.formBuilder.group({
				realname: [self.model['realname'], Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(25), Validators.pattern('[a-zA-Z0-9 .-:;,()\'\&]*')])],
				description: new FormControl(self.model['description'], { validators: Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(250), Validators.pattern('[a-zA-Z0-9 .-:;,()!?\~\'\$\@\%\&]*')]), updateOn: "blur"}),
				email: new FormControl(self.model['email'], { validators: Validators.compose([Validators.minLength(6), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.]+[a-zA-Z0-9-.]+$')]), updateOn: "blur"}),
				phone: new FormControl(self.model['phone'], { validators: Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('^[0-9]*')]), updateOn: "blur"})
			});

			this._profileModelService.get(this.userId, true).then((model) => {
				let efc = self.editAccountForm.controls;

				efc.realname.setValue(model['realname']);
				efc.description.setValue(model['description']);
				efc.email.setValue(model['email']);
				efc.phone.setValue(model['phone']);
			})
		})

	}

	get editAccountFormControl() {
		return this.editAccountForm.controls;
	}


	isDirty() {
		return this.dirty;
	}

	setDirty(b) {
		this.dirty = b;
	}

	ionViewCanLeave() {
		let self = this;
		if (this.isDirty() && !self.isExiting) {
			let msg = "";

			let _model = this._profileModelService.get(this.userId);
			
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
		let model = this._profileModelService.get(this.userId);

		let pefc = this.editAccountFormControl;
		
		let fieldsHaveErrors = !!pefc.realname.errors ||
			!!pefc.email.errors ||
			!!pefc.phone.errors ||
			!!pefc.description.errors;

		return this.isDirty() && !fieldsHaveErrors; // && (model["phone"] && model["phone"].length == 10);
	}

	onSaveBtnTap() {
		let self = this;
		this._profileModelService.get(this.userId, true /* force complete model hydration */).then((presave_model) => {
			if (self.verifyEmailOnSave) {
				self.verifyEmailIsAvailable(presave_model["email"]);
				return;
			}

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

			self._profileModelService.save(presave_model).then(() => {
					self.setDirty(false);
					
					let _model = self._profileModelService.get(self.userId);
					console.log("ProfileModelService.save() returned.. if image was set, it uploaded it.. now, just called to get the current model.. does it have imageFileURI set? ", _model)

					self._loadingService.dismiss();

					if (!self.isExiting) {
						if (!self.userId) {
							console.log("FOR SOME REASON profile edit page's userId is undefined!!!!!")
							console.trace();
						}

						self._location.back();
					}

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

	verifyEmailIsAvailable(email) {
		let self = this;

		if (email == self.originalEmail) {
			self.verifyEmailOnSave = false;
			self.onSaveBtnTap();
		} else {
			self._userService.isEmailAddressAvailable(email).then((isAvailable) => {
				if (isAvailable) {
					self.verifyEmailOnSave = false;
					self.onSaveBtnTap();
				} else {
					self._alertService.show({
						header: 'Doh!',
						message: "Sorry, that email address is already taken :(",
						buttons: [{
							text: 'OK',
							role: 'cancel',
						}]
					})
				}
			})
		}
	}

	verifyPhone(phoneNumber) {
	    let self = this;

	    if (phoneNumber == self.originalPhone) {
	    	self.verifyPhoneOnSave = false;
	    	self.onSaveBtnTap();
	    } else {
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

		let model = this._profileModelService.get(this.userId);
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
		if (this.originalEmail === undefined) 
			this.originalEmail = this._profileModelService.get(this.userId)['email'];

		if (this.setChangedAttr("email", event.detail.value)) {
			if (event.detail.value != this.originalEmail)
				this.verifyEmailOnSave = true;
		}
	}

	onPhoneChange(event) {
		if (this.originalPhone === undefined)
			this.originalPhone = this._profileModelService.get(this.userId)['phone'];

		if (this.setChangedAttr("phone", event.detail.value)) {
			if (event.detail.value != this.originalPhone)
				this.verifyPhoneOnSave = true;
		}
	}

	getModelAttr(key) {
		return this._profileModelService.get(this.userId)[key];
	}

	isFromGallery() {
		return this._profileModelService.get(this.userId)["imageFileSource"] == 'gallery';
	}

	getAssociatedImage() {
		let rtn = undefined;

		if (this._profileModelService.get(this.userId)["imageFileURI"] !== undefined) { // if direct file path to image is set
			let unsanitized = this._webview.convertFileSrc(this._profileModelService.get(this.userId)["imageFileURI"]);
			let sanitized = this._domSanitizer.bypassSecurityTrustResourceUrl(unsanitized);
			rtn = sanitized;
		} else {
			rtn = this.getEnvironmentAPIURLForThisProfile();
		}

		return rtn;
	}

	getEnvironmentAPIURLForThisProfile() {
        return this._pictureService.getAssociatedImage(this._constants.PHOTO_TYPE_PROFILE, this.userId);
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

	onAssociatedImageClick() {
		let self = this;
		let model = this._profileModelService.get(this.userId);

		self.presentModal(ChoosePhotoSourcePage, { }, 
			{
				propsObj: {
					fileURI: model["imageFileURI"], 
					fileSource: model["imageFileSource"]
					}, 
				callbackFunc: (uriAndSource) => {
					if (uriAndSource !== undefined) {

						let model = this._profileModelService.get(this.userId);
						if (model["imageFileURI"] !== undefined /*&& model["imageFileSource"] == 'camera'*/) {
							let lastSlash = model["imageFileURI"].lastIndexOf('/');
							let path = model["imageFileURI"].substring(0,lastSlash+1);
							let filename = model["imageFileURI"].substring(lastSlash+1);

							let func = () => {
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
							}

							if (model["imageFileIsADefault"]) {
								func();
							} else {
								self._file.removeFile(path, filename).then((data) => {
									func();
								})
							}
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

	onAssociatedImagePress() {
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
							let model = self._profileModelService.get(self.userId);

							model["imageFileURI"] = undefined;
							model["imageFileSource"] = undefined;
							model["imageOrientation"] = undefined;

							self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_PROFILE, self.userId, model["imageFileURI"]);
						}

						console.log('deleting photo ' + self.userId);

						self._pictureService.delete(self._constants.PHOTO_TYPE_PROFILE, self.userId).then(() => { 

							let model = self._profileModelService.get(self.userId);

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

	// isThumbnailImageVisible() {
	// 	return this.imageOrientation !== undefined;
	// }

	getAssociatedImageCSS() {
		return this._pictureService.getOrientationCSS(this._profileModelService.get(this.userId));
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

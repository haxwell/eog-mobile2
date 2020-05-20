import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Events } from '@ionic/angular';

import { Constants } from '../../../_constants/constants'
import { environment } from '../../../_environments/environment';

import { AlertService } from '../../../app/_services/alert.service'
import { ContactInfoVisibilityService } from '../../../app/_services/contact-info-visibility.service'
import { GeolocationService } from '../../../app/_services/geolocation.service'
import { LoadingService } from '../../../app/_services/loading.service'
import { ModelServiceP } from '../_services/model.service'
import { PictureService } from '../../../app/_services/picture.service'
import { PointsService } from '../../../app/_services/points.service'
import { ProfileService } from '../../../app/_services/profile.service'
import { ProfileModelService } from '../../../app/_services/profile-model.service'
import { RecommendationService } from '../../../app/_services/recommendation.service'
import { UserMetadataService } from '../../../app/_services/user-metadata.service'
import { UserService } from '../../../app/_services/user.service'

import * as Moment from 'moment';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'page-profile',
  templateUrl: './detail.page.html'
  ,styleUrls: ['./detail.page.scss']
})

export class DetailPage {

	model = {};
	userId = undefined;
	dirty = true;
	isExiting = false;
	locationDisplayString = undefined;

	_currentUserCanSendRecommendationToProfileUser = undefined;
	_currentUserCanSendPointToProfileUser = undefined;

	imageOrientation = undefined;

	contactInfoVisibilityId = undefined;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
				private _alertService: AlertService,
				private _loadingService: LoadingService,
				private _modelService: ModelServiceP,
				private _userService: UserService,
				private _profileService: ProfileService,
				private _profileModelService: ProfileModelService,
				private _userMetadataService: UserMetadataService,
				private _recommendationService: RecommendationService,
				private _geolocationService: GeolocationService,
				private _pointsService: PointsService,
				private _pictureService: PictureService,
				private _contactInfoVisibilityService: ContactInfoVisibilityService,
				private _events: Events,
				private _constants: Constants
                ,private _webview: WebView
                ,private _domSanitizer: DomSanitizer
				) {

		this._userMetadataService.init();

		this._events.subscribe('profile:changedContactInfoWasSaved', (savedModel) => {
			this.ngOnInit();
		})

		this._events.subscribe('request:accepted', (data) => {
			if (data["request"]["directionallyOppositeUser"]["id"] === this.userId)
				this.ngOnInit();
		})
	}

	ngOnInit() {
		let self = this;

		if (self._modelService.getModel() === undefined) {
			self._modelService.setModel({cnt: 1})

			self._route.params.subscribe((params) => {
				self.userId = params['userId'] * 1;
				self._loadingService.show({message: "Please wait..."}).then(() => {
					self._profileService.init(self.userId);

					self.setCurrentUserCanSendPointToProfileUser();
					self.setCurrentUserCanSendRecommendationToProfileUser();

					self._contactInfoVisibilityService.getContactInfoVisibilityId(self.userId).then((visId: number) => {
						self.contactInfoVisibilityId = visId;
						self._loadingService.dismiss();
					})

					self.locationDisplayString = undefined;
				})
			});
		}
	}

	ionViewWillEnter() {
		this._modelService.setModel(undefined);
		this.ngOnInit();
	}

	ngOnDestroy() {
		this._modelService.setModel(undefined);
	}

	ionViewWillLeave() {
		this.ngOnDestroy();
	}

	isCurrentUsersProfile() {
		return this._userService.getCurrentUser()["id"] === this.userId;
	}

	isCurrentUserAllowedToSeeEmailInfo() {
		return this._profileModelService.get(this.userId)["currentUserCanSeeEmailInfo"];
	}

	isCurrentUserAllowedToSeePhoneInfo() {
		return this._profileModelService.get(this.userId)["currentUserCanSeePhoneInfo"];
	}

	onSendRecommendationBtnTap() {
		let self = this;

		self._recommendationService.sendARecommendationToAUser(this.userId).then((data) => {
			self._currentUserCanSendRecommendationToProfileUser = false;

			self._userService.getUser(self.userId).then((user) => {
				self._alertService.show({
					header: 'Sweet!',
					message: "You just sent a recommendation to " + user["name"] + ".<br/><br/>They must use this recommendation, by requesting an offer that requires it, before you can send another one.",
					buttons: [{
						text: 'OK',
						handler: () => {

						}
					}]
				})
			})
		});
	}

	onSendPointBtnTap() {
		let self = this;

		self._pointsService.sendAPointToAUser(self.userId).then((data) => {
			self._currentUserCanSendPointToProfileUser = false;

			self._userService.getUser(self.userId).then((user) => {
				self._alertService.show({
					header: 'Sweet!',
					message: "You just sent a point to " + user["name"] + ".<br/><br/>You can send another one in about a week.",
					buttons: [{
						text: 'OK',
						handler: () => {

						}
					}]
				})
			})
		});
	}

	isSendRecommendBtnAvailable() {
		return this._currentUserCanSendRecommendationToProfileUser;
	}

	isSendPointBtnAvailable() {
		return this._currentUserCanSendPointToProfileUser;
	}

	getSocialMediaURL(name) {
		return this._profileModelService.get(this.userId)[name+"Url"] || "";
	}

	getEditProfileURL() {
		return '/profile/' + this.userId + '/edit';
	}

	setCurrentUserCanSendPointToProfileUser() {
		this._userMetadataService.getMetadataValue(this.userId, this._constants.FUNCTION_KEY_CAN_SEND_POINT_TO_USER).then((bool) => {
			this._currentUserCanSendPointToProfileUser = bool;
		})
	}

	setCurrentUserCanSendRecommendationToProfileUser() {
		this._userMetadataService.getMetadataValue(this.userId, this._constants.FUNCTION_KEY_CAN_SEND_RECOMMENDATION_TO_USER).then((bool) => {
			this._currentUserCanSendRecommendationToProfileUser = bool;
		})
	}

	getModelAttr(key) {
		return this._profileModelService.get(this.userId)[key];
	}

	isFromGallery() {
		return this._profileModelService.get(this.userId)["imageFileSource"] == 'gallery';
	}

	isDirectFilepathToImageSet() {
		return this._profileModelService.get(this.userId)["imageFileURI"] !== undefined;
	}

	getThumbnailImage() {
		console.log("DetailPage, getThumbnailImage(), if coming back from edit page, the model should have imageFileURI set, yes?")
        let rtn = undefined;
        let path = this._pictureService.getImmediately(this._constants.PHOTO_TYPE_PROFILE, this.userId);

        if (path && path['path']) {
            let unsanitized = this._webview.convertFileSrc(path['path']);
            let sanitized = this._domSanitizer.bypassSecurityTrustResourceUrl(unsanitized);
            rtn = sanitized;
        }

        return rtn;
	}

	getAvatarCSSClassString() {
        let _model = this._profileModelService.get(this.userId);
        let rtn = this._pictureService.getOrientationCSS(_model);

        return rtn;
	}

	getAllTimePointCount() {
		return this._profileModelService.get(this.userId)["allTimePointCount"];
	}

	getSuccessfulRequestPercentage() {
		let drc = this._profileModelService.get(this.userId)["disputedRequestCount"]
		let arc = this._profileModelService.get(this.userId)["archivedRequestCount"]

		if (drc === undefined || arc === undefined || arc === 0)
			return 0
		else if (drc === 0)
			return 100
		else
			return (100 - ((drc / arc) * 100))
	}

	getSuccessfulRequestPercentageAsString() {
		
		let drc = this._profileModelService.get(this.userId)["disputedRequestCount"];
		let arc = this._profileModelService.get(this.userId)["archivedRequestCount"];

		if (drc === undefined || arc === undefined || arc === 0)
			return "--";
		else if (drc === 0)
			return "100%";
		else
			return "" + (100 - ((drc / arc) * 100)) + "%";
	}

	isUserHadAtLeastOneDisputedRequest() {
		return this._profileModelService.get(this.userId)["mostRecentDisputedRequestTimestamp"] !== undefined;
	}

	getHowLongAgoForMostRecentDisputedRequest() {
		let val = this._profileModelService.get(this.userId)["mostRecentDisputedRequestTimestamp"]
		if (val === undefined)
			return "None!";
		else
			return Moment(val).fromNow();
	}

	getContactInfoVisibilityDisplayString() {
		let self = this;
		let visObj = self._contactInfoVisibilityService.getContactInfoVisibilityChoices().find(
			(obj) => { return obj["id"] === self.contactInfoVisibilityId; });

		if (visObj)
			return visObj["text"];
	}

	getLocationDisplayString() {
		if (this.locationDisplayString === undefined) {
			let model = this._profileModelService.get(this.userId);

			if (model["latitude"] && model["longitude"]) {
				this.locationDisplayString = null;

				this._geolocationService.getCityStateFromLatlong(model["latitude"], model["longitude"]).then((obj) => {
					this.locationDisplayString = obj["city"] + ", " + obj["state"];
				}, (err) => {
					console.log(err);
					this.locationDisplayString = "TBD, TBD";
				})
			}
		}

		return this.locationDisplayString;
	}

	onChangePasswordBtnClick(event) {
	    let self = this;
	    self._alertService.show({
	            header: '',
	            message: "Enter your current password...",
		        inputs: [{
		        	name: 'currentPassword',
		        	placeholder: '..current password..'
		        }],
	            buttons: [{
	            	text: "Cancel",
	            	role: 'cancel'
	            }, {
	            	text: 'OK',
	             	handler: (data) => {
	                	let cu = this._userService.getCurrentUser();
	                	if (cu["password"] == data.currentPassword)
	                		this.onChangePasswordBtnClick2(data.currentPassword);
	                	else {
				         	self._alertService.show({
				                	header: 'Sad face..',
				                	message: "Incorrect password",
				                	buttons: [{
				                    	text: 'OK',
				                    	handler: () => { }
				                  	}]
				                })
				        }
	            	}
	            }]
	        })
	}

	onChangePasswordBtnClick2(currentPassword) {
		let self = this;
         self._alertService.show({
            header: "Enter Your New Password",
            inputs: [{
              name: 'pw1',
              placeholder: '..new password..'
            }, {
              name: 'pw2',
              placeholder: '..verify password..'
            }],
            buttons: [{
              text: 'Cancel',
              role: 'cancel'
            }, {
				text: 'OK',
            	handler: (data2) => {
                	if (data2.pw1 && data2.pw1.length > 5 && data2.pw1 == data2.pw2) {
	                  		let cu = self._userService.getCurrentUser();

	                  		self._userService.changeCurrentPassword(currentPassword, data2.pw2).then((response) => {

			                if (response) {
			                    self._alertService.show({
			                      header: 'Yay!',
			                      message: "Your password has been changed.",
			                      buttons: [{
			                        text: 'OK',
			                        handler: () => {
		                        		cu["password"] = data2.pw2;
		                        		self._events.publish("app:currentUserPasswordChanged", cu)
			                        }
			                      }]
			                    })
			                } else {
			                    self._alertService.show({
			                      header: 'Hmmm...!',
			                      message: "Could not change your password... Try again.",
			                      buttons: [{
			                        text: 'OK',
			                        handler: () => {

			                        }
			                      }]
			                    })
			                }

	                    }, (err) => {
	                      
	                      self._alertService.show({
	                        header: 'Arggh!',
	                        message: "Something bad happened on the server. We hate when that happens. Please email us at info@easyah.com and let us know.",
	                        buttons: [{
	                          text: 'OK',
	                          handler: () => {
	                            
	                          }
	                        }]
	                      })
	                    })
	                } else {
	                	return false; // pw data is invalid.. don't let the OK button be active
	                }
            	}
            }]
        })
	}
}

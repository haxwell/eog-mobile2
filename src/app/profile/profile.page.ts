import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Events } from '@ionic/angular';

import { GeolocationService } from '../../app/_services/geolocation.service'
import { ProfileService } from '../../app/_services/profile.service'
import { UserMetadataService } from '../../app/_services/user-metadata.service'
import { RecommendationService } from '../../app/_services/recommendation.service'
import { PointsService } from '../../app/_services/points.service'
import { PictureService } from '../../app/_services/picture.service'
import { UserService } from '../../app/_services/user.service'
// import { ModalService } from '../../app/_services/modal.service'
import { AlertService } from '../../app/_services/alert.service'
import { ContactInfoVisibilityService } from '../../app/_services/contact-info-visibility.service'

import { ProfileEditPage } from './profile-edit.page'

import { Constants } from '../../_constants/constants'

import * as EXIF from 'exif-js';
import * as Moment from 'moment';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.page.html'
  ,styleUrls: ['./profile.page.scss']
})

export class ProfilePage {

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
				// private _modalService: ModalService,
				private _alertService: AlertService,
				private _userService: UserService,
				private _profileService: ProfileService,
				private _userMetadataService: UserMetadataService,
				private _recommendationService: RecommendationService,
				private _geolocationService: GeolocationService,
				private _pointsService: PointsService,
				private _pictureService: PictureService,
				private _contactInfoVisibilityService: ContactInfoVisibilityService,
				private _events: Events,
				private _constants: Constants) {

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
		this._route.paramMap.pipe(
			switchMap((params) => self.userId = params.get('userId'))
		)

		this._profileService.init(self.userId);

		this.setCurrentUserCanSendPointToProfileUser();
		this.setCurrentUserCanSendRecommendationToProfileUser();

		this._contactInfoVisibilityService.getContactInfoVisibilityId(self.userId).then((visId: number) => {
			self.contactInfoVisibilityId = visId;
		})

		this.locationDisplayString = undefined;
	}

	ionViewWillEnter() {
		this.ngOnInit();
	}

	isCurrentUsersProfile() {
		return this._userService.getCurrentUser()["id"] === this.userId;
	}

	isCurrentUserAllowedToSeeEmailInfo() {
		return this._profileService.getModel(this.userId)["currentUserCanSeeEmailInfo"];
	}

	isCurrentUserAllowedToSeePhoneInfo() {
		return this._profileService.getModel(this.userId)["currentUserCanSeePhoneInfo"];
	}

	onSendRecommendationBtnTap() {
		let self = this;
		self._recommendationService.sendARecommendationToAUser(this.userId).then((data) => {
			self.setCurrentUserCanSendRecommendationToProfileUser();
		})
	}

	onSendPointBtnTap() {
		let self = this;
		self._pointsService.sendAPointToAUser(this.userId).then((data) => {
			self.setCurrentUserCanSendPointToProfileUser();
		});
	}

	isSendRecommendBtnAvailable() {
		return this._currentUserCanSendRecommendationToProfileUser;
	}

	isSendPointBtnAvailable() {
		return this._currentUserCanSendPointToProfileUser;
	}

	getSocialMediaURL(name) {
		return this._profileService.getModel(this.userId)[name+"Url"] || "";
	}

	onEditProfileBtnClick() {
		this._router.navigate(['/profile/edit/' + this.userId]);
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
		let model = this._profileService.getModel(this.userId) || {};
		return model[key];
	}

	isFromGallery() {
		return this._profileService.getModel(this.userId)["imageFileSource"] == 'gallery';
	}

	isThumbnailImageAvailable() {
		return this._profileService.getModel(this.userId)["imageFileURI"] !== undefined;
	}

	isThumbnailImageVisible() {
		return this.imageOrientation !== undefined;
	}

	getThumbnailImage() {
		if (this._profileService.getModel(this.userId)["imageFileURI"] === undefined)
			return "assets/img/mushroom.jpg";
		else
			return this._profileService.getModel(this.userId)["imageFileURI"];
	}

	onGoBackBtnTap(evt) {
		this._location.back();
	}

	getAvatarCSSClassString() {
		return this._pictureService.getOrientationCSS(this);
	}

	loaded(evt) {
		let self = this;
		EXIF.getData(evt.target, function() {
			self.imageOrientation = EXIF.getTag(this, "Orientation");
		});
	}

	getAllTimePointCount() {
		let val = this._profileService.getModel(this.userId)["allTimePointCount"];
		if (val === undefined) 
			return 0;
		else
			return val;
	}

	getSuccessfulRequestPercentageAsString() {
		
		let drc = this._profileService.getModel(this.userId)["disputedRequestCount"];
		let arc = this._profileService.getModel(this.userId)["archivedRequestCount"];

		if (drc === undefined || arc === undefined || arc === 0)
			return "--";
		else if (drc === 0)
			return "100%";
		else
			return "" + (100 - ((drc / arc) * 100)) + "%";
	}

	getHowLongAgoForMostRecentDisputedRequest() {
		let val = this._profileService.getModel(this.userId)["mostRecentDisputedRequestTimestamp"]
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
			let model = this._profileService.getModel(this.userId);

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
	            subheader: "Enter your current password...",
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
				                	subheader: "Incorrect password",
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
	                        message: "Something bad happened on the server. We hate when that happens. Please email us at info@easyah.io and let us know.",
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

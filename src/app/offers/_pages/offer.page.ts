import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { OfferEditPage } from './offer-edit.page'
import { OfferRequestPage } from './offer-request.page'
import { DeleteOfferPage } from './delete-offer.page'

import { AlertService } from '../../../app/_services/alert.service';
import { OfferModelService } from '../../../app/_services/offer-model.service';
import { OfferMetadataService } from '../../../app/_services/offer-metadata.service';
import { OfferDetailService } from '../../../app/_services/offer-detail.service';
import { UserService } from '../../../app/_services/user.service';
import { UserPreferencesService } from '../../../app/_services/user-preferences.service';
import { PictureService } from '../../../app/_services/picture.service';
import { RequestsService } from '../../../app/_services/requests.service';

import { Constants } from '../../../_constants/constants';

import * as Moment from 'moment'

import { environment } from '../../../_environments/environment';

@Component({
  selector: 'page-display-offer',
  templateUrl: 'offer.page.html',
  styleUrls: ['./offer.page.scss']
})

export class OfferPage {

	offerId = undefined;
	
	requestMsgs = [];

	_isRequestBtnVisible = undefined;
	callback = undefined; // TODO: necessary?
	requiredUserObjectsLoadedCount = 0; 
	showTutorialAfterOutgoingRequestMade = true;

	dirty = false;

	constructor(private _location: Location,
				private _router: Router,
				private _route: ActivatedRoute,	
				private _modalCtrl: ModalController,
				private _alertService: AlertService,
				private _offerModelService: OfferModelService,
				private _offerMetadataService: OfferMetadataService,
				private _offerDetailService: OfferDetailService,
				private _userService: UserService,
				private _pictureService: PictureService,
				private _requestsService: RequestsService,
				private _userPreferencesService: UserPreferencesService,
				private _constants: Constants) {

	}

	ngOnInit() {
		let self = this;

		self._route.params.subscribe((params) => {
			self.offerId = params['offerId'];

			self._offerModelService.init();
			self._offerMetadataService.init();

			self._offerModelService.waitingPromise(self.offerId).then((offer) => {
				self.requestMsgs = self._offerDetailService.getOfferDetailMessages(offer);

				self._offerMetadataService.getMetadataValue(offer, self._constants.FUNCTION_KEY_OFFER_IS_REQUESTABLE)
					.then((bool) => { 
						console.log("isRequestBtnVisible ==> " + bool)
						self._isRequestBtnVisible = bool;
					});

			})
		})
	}

	ionViewWillEnter() {
		this._offerModelService.bumpTheThumbnailCounter();
	}

	getModel() {
		return this._offerModelService.get(this.offerId);
	}

	isRequestMessageAvailable() {
		return this.requestMsgs !== undefined && this.requestMsgs.length > 0;
	}

	isAlreadyRequestedMessageAvailable() {
		return this.requestMsgs !== undefined && this.requestMsgs.some((obj) => { return obj["type"] === "alreadyRequested"});
	}

	isPointsRequestMessageAvailable() {
		return this.requestMsgs !== undefined && this.requestMsgs.some((obj) => { return obj["type"] === "points"});
	}

 	isRecommendationsRequestMessageAvailable() {
		return this.requestMsgs !== undefined && this.requestMsgs.some((obj) => { return obj["type"] === "reqd"});
	}

	isStillMoreTimeLeftMessageAvailable() {
		return this.requestMsgs !== undefined && this.requestMsgs.some((obj) => { return obj["type"] === "timeRemaining"});
	}

	getStillMoreTimeLeftMessages() {
		return this.requestMsgs.filter((obj) => { return obj["type"] === "timeRemaining"});
	}

	getAlreadyRequestedRequestMessages() {
		return this.requestMsgs.filter((obj) => { return obj["type"] === "alreadyRequested"});
	}

	getPointsRequestMessages() {
		return this.requestMsgs.filter((obj) => { return obj["type"] === "points"});
	}

	getRecommendationsRequestMessages() {
		return this.requestMsgs.filter((obj) => { return obj["type"] === "reqd"});
	}

	getRequiredPointsQuantityString() {
		let rtn = undefined;

		let _model = this._offerModelService.get(this.offerId);

		rtn = _model["requiredPointsQuantity"] + " point";

		if (_model["requiredPointsQuantity"] > 1)
			rtn += "s";

		return rtn;
	}

	hasRequiredRecommendationUserObjects() {
		return this._offerModelService.hasRequiredRecommendationUserObjects(this.offerId);
	}

	getRequiredRecommendationUserObjects() {
		return this._offerModelService.getRequiredRecommendationUserObjects(this.offerId);
	}

	hasStatistics() {
		let _model = this._offerModelService.get(this.offerId);

		let rtn = 	(_model["fulfillment_dates"] && _model["fulfillment_dates"].length > 0) ||
					(_model["num_of_complaints"] && _model["num_of_complaints"] > 0) ||
					(_model["total_points_earned"] && _model["total_points_earned"] > 0);

		return rtn;
	}

	getFirstFulfilledText() {
		let _model = this._offerModelService.get(this.offerId);
		if (_model["fulfillment_dates"] && _model["fulfillment_dates"].length > 0) 
			return "First fullfilled " + Moment(_model["fulfillment_dates"][0]).fromNow();
		else
			return "Never been fulfilled.";
	}

	getNumberOfComplaints() {
		let _model = this._offerModelService.get(this.offerId);
		if (_model["num_of_complaints"]) 
			return _model["num_of_complaints"] + " complaints.";
		else
			return "No complaints about this offer.";
	}

	getTotalPointsEarned() {
		let _model = this._offerModelService.get(this.offerId);
		if (_model["total_points_earned"]) 
			return "Earned " + _model["total_points_earned"] + " points over its lifetime.";
		else
			return "No points earned yet.";
	}

	isDeleteBtnVisible() {
		let _model = this._offerModelService.get(this.offerId);
		return _model["userId"] === this._userService.getCurrentUser()["id"];
	}

	isRequestBtnVisible() {
		return this._isRequestBtnVisible;
	}

	onDeleteBtnTap(evt) {
		let self = this;
		self.presentModal(DeleteOfferPage, self._offerModelService.get(this.offerId), {
			propsObj: {
				offer: this._offerModelService.get(this.offerId)
			}, 
			callbackFunc: 
				(data) => { 
					if (data === true) 
						self._location.back(); 
				}
			}
		);
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

	onRequestBtnTap(evt) {
		this._router.navigate(['/offers/' + this.offerId + '/request']);
	}

	onGoBackBtnTap(evt) {
		this._location.back();;
	}

	areRecommendationsRequired(offer) {
		let _model = this._offerModelService.get(this.offerId);
		return (_model["requiredUserRecommendations"] && _model["requiredUserRecommendations"].length > 0);
	}

	isCurrentUsersOffer() {
		let _model = this._offerModelService.get(this.offerId)
		return _model["userId"] && _model["userId"] === this._userService.getCurrentUser()["id"];
	}

	onEditOfferBtnClick() {
		this._router.navigate(['/offers/' + this.offerId + '/edit']);
	}

	getThumbnailImage() {
		return this._offerModelService.getThumbnailImagePath(this.offerId);
	}

	// count = 0;
	getAvatarCSSClassString() {
		let _model = this._offerModelService.get(this.offerId)
        let rtn = this._pictureService.getOrientationCSS(_model);

		// if (++this.count % 10 === 0) {
		// 	this.count = 0
		// 	console.log("***** getAvatarCSSCLassString returning " + rtn);
		// 	console.log(_model["imageOrientation"]);
		// }

		return rtn;
	}
}

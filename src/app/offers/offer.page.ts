import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ModalService } from '../../app/_services/modal.service';
import { AlertService } from '../../app/_services/alert.service';

import { OfferEditPage } from './offer-edit.page'
import { OfferRequestPage } from './_pages/offer-request.page'
import { DeleteOfferPage } from './_pages/delete.offer'
import { OutgoingRequestMadeTutorialPage } from './_pages/outgoing-request-made-tutorial'
import { OfferModelService } from '../../app/_services/offer-model.service';
import { OfferMetadataService } from '../../app/_services/offer-metadata.service';
import { OfferDetailService } from '../../app/_services/offer-detail.service';
import { UserService } from '../../app/_services/user.service';
import { UserPreferencesService } from '../../app/_services/user-preferences.service';
import { PictureService } from '../../app/_services/picture.service';
import { RequestsService } from '../../app/_services/requests.service';

import { Constants } from '../../_constants/constants';

import * as Moment from 'moment'

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-display-offer',
  templateUrl: 'offer.page.html',
  styleUrls: ['./offer.page.scss']
})

export class OfferPage {

	model = undefined;
	offerId = undefined;
	
	requestMsgs = undefined;
	_isRequestBtnVisible = undefined;
	callback = undefined; // TODO: necessary?
	requiredUserObjectsLoadedCount = 0; 
	showTutorialAfterOutgoingRequestMade = true;

	dirty = false;

	constructor(private _location: Location,
				private _router: Router,
				private _route: ActivatedRoute,
				private _modalService: ModalService,
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
		self._route.paramMap.pipe(
			switchMap((params) => {
				self.offerId = params.get('offerId')
				self.model = self._offerModelService.get(self.offerId);

				self._offerModelService.setOfferMetadata(self.model).then((offer) => {
					this.setModel(Object.assign({}, offer));
				});
			
				self._offerMetadataService.init();
				self._offerMetadataService.getMetadataValue(self.model, self._constants.FUNCTION_KEY_OFFER_IS_REQUESTABLE).then((bool) => { 
					self._isRequestBtnVisible = bool;
				});

				self.requestMsgs = self._offerDetailService.getOfferDetailMessages(self.model);

				return self.offerId;
			})
		)
	}

	setModel(m) {
		this.model = m;
	}

	getModel() {
		return this.model;
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
		let rtn = this.model["requiredPointsQuantity"] + " point";

		if (this.model["requiredPointsQuantity"] > 1)
			rtn += "s";

		return rtn;
	}

	getRequiredRecommendationUserObjects() {
		let rtn = undefined;

		if (this.requiredUserObjectsLoadedCount === this.model["requiredUserRecommendations"].length) {
			rtn = [];

			this.model["requiredUserRecommendations"].forEach((req) => {
				rtn.push(req["userObj"]);
			})
		}

		return rtn;
	}

	hasStatistics() {
		let rtn = (this.model["fulfillment_dates"] !== undefined && this.model["fulfillment_dates"].length > 0) ||
				(this.model["num_of_complaints"] !== undefined && this.model["num_of_complaints"] > 0) ||
				(this.model["total_points_earned"] != undefined && this.model["total_points_earned"] > 0);

		return rtn;
	}

	getFirstFulfilledText() {
		if (this.model["fulfillment_dates"] !== undefined && this.model["fulfillment_dates"].length > 0) 
			return "First fullfilled " + Moment(this.model["fulfillment_dates"][0]).fromNow();
		else
			return "Never been fulfilled.";
	}

	getNumberOfComplaints() {
		if (this.model["num_of_complaints"] !== undefined) 
			return this.model["num_of_complaints"] + " complaints.";
		else
			return "No complaints about this offer.";
	}

	getTotalPointsEarned() {
		if (this.model["total_points_earned"] !== undefined) 
			return "Earned " + this.model["total_points_earned"] + " points over its lifetime.";
		else
			return "No points earned yet.";
	}

	isDeleteBtnVisible() {
		return this.model["userId"] === this._userService.getCurrentUser()["id"]
	}

	isRequestBtnVisible() {
		return this._isRequestBtnVisible;
	}

	onDeleteBtnTap(evt) {
		let self = this;
		this._modalService.show(DeleteOfferPage, {
			props: {
				offer: this.model
			}, 
			onDidDismissFunc: 
				(data) => { 
					self.callback(data).then(() => { 
						if (data === true) 
							self._location.back(); 
					}) 
				} 
			});
	}

	onRequestBtnTap(evt) {
		this._router.navigate(['/offer/' + this.model["id"] + '/request']);
	}

	onGoBackBtnTap(evt) {
		this._location.back();;
	}

	areRecommendationsRequired(offer) {
		return (this.model["requiredUserRecommendations"] && this.model["requiredUserRecommendations"].length > 0);
	}

	isCurrentUsersOffer() {
		return this.model["userId"] === this._userService.getCurrentUser()["id"];
	}

	onEditOfferBtnClick() {
		let self = this;

	}

	getThumbnailImage() {
		let rtn = undefined;
		
		if (this.model["imageFileURI"] !== undefined && this.model["imageOrientation"] !== undefined)
			rtn = this.model["imageFileURI"];
		else
			rtn = "assets/img/logo.jpg";

		return rtn;
	}

	getAvatarCSSClassString() {
		return this._pictureService.getOrientationCSS(this.model);
	}
}

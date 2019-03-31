import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { RequestsService } 			from '../../../app/_services/requests.service';
import { OfferModelService } 		from '../../../app/_services/offer-model.service'
import { ModalService } 			from '../../../app/_services/modal.service'
import { UserService } 				from '../../../app/_services/user.service'
import { UserPreferencesService } 	from '../../../app/_services/user-preferences.service'

import { OutgoingRequestMadeTutorialPage } from './outgoing-request-made-tutorial.page'

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-search-request',
  templateUrl: 'offer-request.page.html',
  styleUrls: ['./offer-request.page.scss']
})
export class OfferRequestPage {

	offer = undefined;
	offerId = undefined;
	message = undefined;

	showTutorialAfterOutgoingRequestMade = undefined;
	
	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
				private _requestsService: RequestsService,
				private _userService: UserService,
				private _offerModelService: OfferModelService,
				private _userPreferencesService: UserPreferencesService,
				private _modalService: ModalService) {

	}

	ngOnInit() {
		let self = this;
		self._route.paramMap.pipe(
			switchMap((params) => {
				self.offerId = params.get('offerId')
				self.offer = self._offerModelService.get(self.offerId);
				return self.offerId;
			})
		)

		self._userPreferencesService.getPreference("showTutorialAfterOutgoingRequestMade", true).then((data) => {
			self.showTutorialAfterOutgoingRequestMade = data["pref"];
		})
	}

	requiredUserRecommendationsAsUserObjects = undefined;
	getRequiredUserRecommendations() {
		if (this.requiredUserRecommendationsAsUserObjects === undefined) {
			this.requiredUserRecommendationsAsUserObjects = null;
			this.initRequiredUserRecommendationsAsUserObjects();
		}

		return this.requiredUserRecommendationsAsUserObjects;
	}

	initRequiredUserRecommendationsAsUserObjects() {
		let self = this;
		self.offer["requiredUserRecommendations"].map((obj) => {
			self._userService.getUser(obj["requiredRecommendUserId"]).then((user) => {
				if (self.requiredUserRecommendationsAsUserObjects === null) 
					self.requiredUserRecommendationsAsUserObjects = [];

				self.requiredUserRecommendationsAsUserObjects.push(user);
			})
		})
	}

	isSaveBtnEnabled() {
		return true;
	}

	onSaveBtnTap(evt) {
		let self = this;
		this._requestsService.saveNew(this.offer, this.message).then((data) => {
			if (data !== undefined) {
				if (self.showTutorialAfterOutgoingRequestMade) {
					self._modalService.show(OutgoingRequestMadeTutorialPage, { 
						onDidDismissFunc: (data) => {
							self._location.back();
						}
					});
				} else {
					self._location.back();
				}
			} else {
				self._location.back();
			}
		});
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}

	getMessageValue() {
		return this.message;
	}

	onMessageChange(evt) {
		this.message = evt.srcElement.value;
	}
}

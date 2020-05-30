import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { UserPreferencesService } 	from '../../../../app/_services/user-preferences.service';

import { PresentTutorialService } from '../../../../app/about-easyah/tutorials/_services/present-tutorial.service';

import { ModelService } from '../_services/model.service';
import { InteractionsService } from '../_services/interactions.service';

@Component({
  selector: 'page-requests-incoming-accept',
  templateUrl: './accept.page.html',
  styleUrls: ['./accept.page.scss']
})
export class AcceptPage {

	model = undefined;

	showTutorialAfterRequestAccepted = true;
	
	constructor(private _router: Router,
				private _modelService: ModelService,
				private _requestsService: RequestsService,
				private _interactionsService: InteractionsService,
				private _presentTutorialService: PresentTutorialService,
				private _userPreferencesService: UserPreferencesService) {

	}

	ngOnInit() {
		var self = this;

		self.model = this._modelService.getModel();

		self._userPreferencesService.getPreference("showTutorialAfterRequestAccepted", true).then((data) => {
			self.showTutorialAfterRequestAccepted = data["pref"];
		})
	}

	getOfferTitle() {
		return this.model ? this.model.offer.title : undefined;
	}

	getRequestorName() {
		return this.model && this.model.directionallyOppositeUser['realname'];
	}

	willBeFirstConnectionBetweenTheseTwo() {
		return this._interactionsService.isFirstInteractionBetween(this.model.offer['userId'], this.model.directionallyOppositeUser['id']) === true;
	}

	getNumberOfPreviousInteractionsString() {
		let rtn = undefined;

		let val = this._interactionsService.getNumberOfPreviousInteractionsBetween(this.model.offer['userId'], this.model.directionallyOppositeUser['id']);

		if (val) {
			rtn = val + " prior interaction";

			if (val > 1)
				rtn += "s";
		}

		return rtn;
	}

	onSaveBtnTap(evt) {
		var self = this;
		self._requestsService.acceptIncomingRequest(self.model).then((obj) => {

			if (self.showTutorialAfterRequestAccepted) {
				self._presentTutorialService.presentTutorialAcceptRequest(() => self._router.navigate(['/requests/incoming']));
			} else {
				self._router.navigate(['/requests/incoming'])
			}
		})
	}

	onCancelBtnTap(evt) {
		this._router.navigate(['/requests/incoming'])
	}
}

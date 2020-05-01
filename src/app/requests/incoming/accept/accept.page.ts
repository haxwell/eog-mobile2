import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { UserPreferencesService } 	from '../../../../app/_services/user-preferences.service';

import { PresentTutorialService } from '../../../../app/about-easyah/tutorials/_services/present-tutorial.service';

import { ModelService } from '../_services/model.service';

@Component({
  selector: 'page-requests-incoming-accept',
  templateUrl: './accept.page.html',
  styleUrls: ['./accept.page.scss']
})
export class AcceptPage {

	// @Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;

	model = undefined;

	showTutorialAfterRequestAccepted = true;
	
	constructor(private _router: Router,
				private _modelService: ModelService,
				private _requestsService: RequestsService,
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

	onSaveBtnTap(evt) {
		var self = this;
		self._requestsService.acceptIncomingRequest(self.model).then((obj) => {

			if (self.showTutorialAfterRequestAccepted) {
				self._presentTutorialService.presentTutorialAcceptRequest(() => self._router.navigate(['/requests/incoming']));
			} else {
				self._router.navigate(['/requests/incoming'])
				// self.thisModal().dismiss();
				// self.parentCallbackFunc();
			}
		})
	}

	onCancelBtnTap(evt) {
		// this.thisModal().dismiss();
		this._router.navigate(['/requests/incoming'])
	}
}

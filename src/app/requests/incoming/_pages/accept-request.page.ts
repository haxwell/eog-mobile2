import { Component, Input } from '@angular/core';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { UserPreferencesService } 	from '../../../../app/_services/user-preferences.service';

import { PresentTutorialService } from '../../../../app/about-easyah/tutorials/_services/present-tutorial.service';

@Component({
  selector: 'page-requests-incoming-accept',
  templateUrl: 'accept-request.page.html'
})
export class AcceptRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;

	showTutorialAfterRequestAccepted = true;
	
	constructor(private _requestsService: RequestsService,
				private _presentTutorialService: PresentTutorialService,
				private _userPreferencesService: UserPreferencesService) {

	}

	ngOnInit() {
		var self = this;
		self._userPreferencesService.getPreference("showTutorialAfterRequestAccepted", true).then((data) => {
			self.showTutorialAfterRequestAccepted = data["pref"];
		})
	}

	onSaveBtnTap(evt) {
		var self = this;
		self._requestsService.acceptIncomingRequest(self.model).then((obj) => {

			if (self.showTutorialAfterRequestAccepted) {
				self._presentTutorialService.presentTutorialAcceptRequest();
			} else {
				self.thisModal().dismiss();
				self.parentCallbackFunc();
			}
		})
	}

	onCancelBtnTap(evt) {
		this.thisModal().dismiss();
	}

}

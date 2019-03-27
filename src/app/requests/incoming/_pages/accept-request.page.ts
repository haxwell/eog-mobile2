import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ModalService } from '../../../../app/_services/modal.service';
import { RequestsService } 	from '../../../../app/_services/requests.service';
import { UserPreferencesService } 	from '../../../../app/_services/user-preferences.service';

import { AcceptRequestTutorialPage } from './accept-request.tutorial';

@Component({
  selector: 'page-requests-incoming-accept',
  templateUrl: 'accept-request.page.html'
})
export class AcceptRequestPage {

	model = undefined;
	showTutorialAfterRequestAccepted = true;
	
	constructor(private _location: Location,
				private _route: ActivatedRoute,
				private _router: Router,
				private _modalService: ModalService,
				private _requestsService: RequestsService,
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
				let modal = self._modalService.show(AcceptRequestTutorialPage);
			} else {
				self._location.back();
			}
		})
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}

}

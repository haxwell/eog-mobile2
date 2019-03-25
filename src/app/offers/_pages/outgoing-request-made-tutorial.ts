import { Component } from '@angular/core';

import { AbstractTutorialPage } from '../../tutorials/abstract-tutorial.page'

import { UserPreferencesService } 	from '../../../app/_services/user-preferences.service';
import { ModalService } 			from '../../../app/_services/modal.service';

@Component({
  selector: 'page-tutorial-outgoing-request-made',
  templateUrl: 'outgoing-request-made-tutorial.html'
})
export class OutgoingRequestMadeTutorialPage extends AbstractTutorialPage {

	showSkip = true;
	showThisTutorialNextTime = true;
	dirty = false;

	constructor(private _userPreferencesService: UserPreferencesService,
				private _modalService: ModalService
				) {
		super();
	}

	// TODO move this up
	showThisTutorialNextTimeChanged() {
		this.dirty = true;
	}

	dismissTutorial() { 
		if (this.dirty)
			this._userPreferencesService.setPreference("showTutorialAfterOutgoingRequestMade", this.showThisTutorialNextTime);

		this._modalService.dismiss(OutgoingRequestMadeTutorialPage);
	}
}
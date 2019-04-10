import { Component, Input } from '@angular/core';

import { AbstractTutorialPage } from '../../../../app/tutorials/abstract-tutorial.page'

import { ModalService } from '../../../../app/_services/modal.service';
import { UserPreferencesService } 	from '../../../../app/_services/user-preferences.service';

@Component({
  selector: 'page-tutorial-accept-request',
  templateUrl: 'accept-request.tutorial.html'
})
export class AcceptRequestTutorialPage extends AbstractTutorialPage {

	@Input() func: any;
	
	showSkip = true;
	showThisTutorialNextTime = true;
	dirty = false;

	constructor(private _modalService: ModalService,
				private _userPreferencesService: UserPreferencesService) {

				super();
	}

	showThisTutorialNextTimeChanged() {
		this.dirty = true;
	}

	dismissTutorial() { 
		if (this.dirty)
			this._userPreferencesService.setPreference("showTutorialAfterRequestAccepted", this.showThisTutorialNextTime);

		this.func();
	}
}
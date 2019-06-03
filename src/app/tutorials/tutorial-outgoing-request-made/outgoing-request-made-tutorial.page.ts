import { Component, Input } from '@angular/core';

import { AbstractTutorialPage } from '../abstract-tutorial.page'

import { UserPreferencesService } 	from '../../../app/_services/user-preferences.service';

@Component({
  selector: 'page-tutorial-outgoing-request-made',
  templateUrl: 'outgoing-request-made-tutorial.page.html'
})
export class OutgoingRequestMadeTutorialPage extends AbstractTutorialPage {

	@Input() func: any;

	showThisTutorialNextTime = true;
	dirty = false;

	constructor(private _userPreferencesService: UserPreferencesService) {
		super();
	}

	// TODO move this up
	showThisTutorialNextTimeChanged() {
		this.dirty = true;
	}

	dismissTutorial() { 
		if (this.dirty)
			this._userPreferencesService.setPreference("showTutorialAfterOutgoingRequestMade", this.showThisTutorialNextTime);

		this.func();
	}
}

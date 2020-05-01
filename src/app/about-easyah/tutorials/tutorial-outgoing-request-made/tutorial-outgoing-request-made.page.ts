import { Component, Input } from '@angular/core';

import { AbstractTutorialPage } from '../abstract-tutorial-page/abstract-tutorial.page'

import { UserPreferencesService } 	from '../../../../app/_services/user-preferences.service';

@Component({
  selector: 'page-tutorial-outgoing-request-made',
  templateUrl: './tutorial-outgoing-request-made.page.html',
  styleUrls: ['../_scss/tutorial.page.scss']
})
export class TutorialOutgoingRequestMadePage extends AbstractTutorialPage {

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

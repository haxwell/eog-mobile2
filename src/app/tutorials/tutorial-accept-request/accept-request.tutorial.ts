import { Component, Input } from '@angular/core';

import { AbstractTutorialPage } from '../abstract-tutorial.page'

import { UserPreferencesService } 	from '../../../app/_services/user-preferences.service';

@Component({
  selector: 'page-tutorial-accept-request',
  templateUrl: 'accept-request.tutorial.html'
  ,styleUrls: ['./accept-request.tutorial.scss']
})
export class AcceptRequestTutorialPage extends AbstractTutorialPage {

	@Input() func: any;
	
	showSkip = true;
	showThisTutorialNextTime = true;
	dirty = false;

	constructor(private _userPreferencesService: UserPreferencesService) {
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

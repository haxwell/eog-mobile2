import { Component, Input } from '@angular/core';

import { AbstractTutorialPage } from '../abstract-tutorial-page/abstract-tutorial.page'

@Component({
  selector: 'page-tutorial-new-account',
  templateUrl: 'tutorial-new-account.page.html',
  styleUrls: ['./tutorial-new-account.page.scss']
})
export class TutorialNewAccountPage extends AbstractTutorialPage {

	@Input() func: any;

	slideOpts = {
    	effect: 'flip'
  	};

	showThisTutorialNextTime = true;
	dirty = false;

	constructor() {
		super();
	}

	// showThisTutorialNextTimeChanged() {
	// 	this.dirty = true;
	// }

	dismissTutorial() {
		// no need to set a userPreference here as in other tutorials,
		//	 this tutorial must show every time

		this.func();
	}
}
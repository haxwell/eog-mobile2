import { Component, Input } from '@angular/core';

import { AbstractTutorialPage } from '../abstract-tutorial-page/abstract-tutorial.page'

import { UserService } from '../../../../app/_services/user.service';
import { TutorialService } from '../_services/tutorial.service';

@Component({
  selector: 'page-tutorial-easyah-intro',
  templateUrl: './tutorial-easyah-intro.page.html',
  styleUrls: ['./tutorial-easyah-intro.page.scss', '../_scss/tutorial.page.scss']  
})
export class TutorialEasyahIntroPage extends AbstractTutorialPage {

	@Input() func: any;

	showThisTutorialNextTime = true;
	dirty = false;

	constructor(private _userService: UserService,
				private _tutorialService: TutorialService) {

		super();
	}

	ngOnInit() {
		let self = this;
		self._tutorialService.getShowTutorialOnLogin().then((val: boolean) => {
			self.showThisTutorialNextTime = val;
		})
	}

	// TODO: MOve this up
	showThisTutorialNextTimeChanged() {
		this.dirty = true;
	}

	dismissTutorialView() { 
		if (this.dirty)
			this._tutorialService.setShowTutorialOnLogin(this.showThisTutorialNextTime);

		this._tutorialService.setTutorialEasyahIntroPageHasBeenShown(true);

		this.func();
	}
}
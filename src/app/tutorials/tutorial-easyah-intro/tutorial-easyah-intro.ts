import { Component } from '@angular/core';

import { AbstractTutorialPage } from '../abstract-tutorial.page'

import { UserService } from '../../../app/_services/user.service';
import { ModalService } from '../../../app/_services/modal.service';
import { TutorialService } from '../../../app/_services/tutorial.service';

@Component({
  selector: 'page-tutorial-easyah-intro',
  templateUrl: 'tutorial-easyah-intro.html'
})
export class TutorialEasyahIntroPage extends AbstractTutorialPage {

	currentStepNumber = 1;
	showThisTutorialNextTime = true;
	dirty = false;

	constructor(private _modalService: ModalService,
				private _userService: UserService,
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

		this._modalService.dismiss(TutorialEasyahIntroPage);
	}
}
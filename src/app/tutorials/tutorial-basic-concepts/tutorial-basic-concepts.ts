import { Component } from '@angular/core';
import { AbstractTutorialPage } from '../abstract-tutorial.page'

import { UserService } from '../../../app/_services/user.service';
import { ModalService } from '../../../app/_services/modal.service';
import { TutorialService } from '../../../app/_services/tutorial.service';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial-basic-concepts.html'
  ,styleUrls: ['./tutorial-basic-concepts.scss']
})
export class TutorialPage {

	showSkip = true;
	currentStepNumber = 1;
	showThisTutorialNextTime = true;

	constructor(private _modalService: ModalService,
				private _userService: UserService,
				private _tutorialService: TutorialService) {

	}

	dismissTutorialView() { 
		this._modalService.dismiss(TutorialPage);
	}
}
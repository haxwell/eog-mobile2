import { Component, Input } from '@angular/core';
import { AbstractTutorialPage } from '../abstract-tutorial.page'

import { UserService } from '../../../app/_services/user.service';
import { ModalService } from '../../../app/_services/modal.service';
import { TutorialService } from '../../../app/_services/tutorial.service';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial-basic-concepts.html'
  ,styleUrls: ['./tutorial-basic-concepts.scss']
})
export class TutorialPage extends AbstractTutorialPage {

	@Input() func: any;
	
	showThisTutorialNextTime = true;

	constructor(private _modalService: ModalService,
				private _userService: UserService,
				private _tutorialService: TutorialService) {
		super();
	}

	dismissTutorialView() { 
		this.func();
	}
}
import { Component, Input } from '@angular/core';
import { AbstractTutorialPage } from '../abstract-tutorial-page/abstract-tutorial.page'

import { UserService } from '../../../../app/_services/user.service';

@Component({
  selector: 'page-tutorial',
  templateUrl: 'tutorial-basic-concepts.page.html'
  ,styleUrls: ['./tutorial-basic-concepts.page.scss', '../_scss/tutorial.page.scss']  
})
export class TutorialBasicConceptsPage extends AbstractTutorialPage {

	@Input() func: any;
	
	showThisTutorialNextTime = true;

	constructor(private _userService: UserService) {
		super();
	}

	dismissTutorialView() { 
		this.func();
	}
}
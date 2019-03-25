import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

import { AbstractTutorialPage } from '../../tutorials/abstract-tutorial.page'

import { ModalService } from '../../../app/_services/modal.service';

@Component({
  selector: 'page-tutorial-new-account',
  templateUrl: 'new-account-tutorial.page.html',
  styleUrls: ['./new-account-tutorial.page.scss']
})
export class NewAccountTutorialPage extends AbstractTutorialPage {

	slideOpts = {
    	effect: 'flip'
  	};

	showThisTutorialNextTime = true;
	dirty = false;

	constructor(private _location: Location,
              private _modalService: ModalService) {

              super();
	}

	showThisTutorialNextTimeChanged() {
		this.dirty = true;
	}

	dismiss() { 
    	this._modalService.dismiss(NewAccountTutorialPage);
	}

}
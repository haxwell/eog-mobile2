import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { PictureService } from '../../../app/_services/picture.service'

import { Constants } from '../../../_constants/constants'

import { OfferCollectionService } from '../../../app/_services/offer-collection.service'
import { ListAllOfferService } from './_services/list-all.service';

import { environment } from '../../../_environments/environment';

@Component({
	selector: 'app-list-all',
	templateUrl: './list-all.page.html',
	styleUrls: ['./list-all.page.scss'],
})

/**
 *
 * Displays a list of all the offers in Easyah within 50 miles of the current user
 *  
 */
export class ListAllPage /*implements OnInit*/ {

	model = {};
	dirty = undefined;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
				private _listAllOfferService : ListAllOfferService,
				private _pictureService : PictureService,
				private _events: Events
	) {
		this.setDirty(true);

		let func = () => {
			this.setDirty(true);
			this.ngOnInit()
		}

		this._events.subscribe('offer:saved', func);
		this._events.subscribe('offer:deleted', func);
	}

	ngOnInit() {
		if (this.isDirty()) {
			this.setDirty(false);
			this._listAllOfferService.resetModel();
		}
	}

	isDirty() {
		return this.dirty;
	}

	setDirty(b) {
		this.dirty = b;
	}

	ionViewWillEnter() {
		this.ngOnInit();
	}

	getOfferResults() {
		let rtn = this._listAllOfferService.getModel();
		return rtn["offers"];
	}

	isAnotherResultBatchAvailable() {
		let rtn = this._listAllOfferService.hasMore();
		return rtn;
	}

	onMoreBtnTap() {
		this._listAllOfferService.appendNextPageToModel();
	}
}

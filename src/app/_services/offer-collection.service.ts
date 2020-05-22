import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { ApiService } from './api.service';
import { OfferModelService } from './offer-model.service';

import { environment } from '../../_environments/environment';
import { Constants } from '../../_constants/constants'

@Injectable({
	providedIn: 'root'
})
export class OfferCollectionService { 

	/**
	 *
	 * Returns a collection of offers owned by the current user.
	 *
	 */
	
	model = undefined;

	constructor(private _apiService: ApiService, 
				private _userService: UserService,
				private _offerModelService: OfferModelService,
				private _constants: Constants) {

	}

	getModel() {
		return this.getModelByUser(this._userService.getCurrentUser());
	}

	getModelByUser(user) {
		if (this.model === undefined) {
			this.model = {}
			this.init(this.model, user);
		}

		return this.model;
	}

	resetModel() {
		this.model = undefined;
	}

	init(model, user) {
		let self = this;
		let url = environment.apiUrl + "/api/user/" + user["id"] + "/offers";
		self._apiService.get(url).subscribe((offersObj) => {
			model["offers"] = offersObj;
			model["offers"].sort((a, b) => { let aText = a.title.toLowerCase(); let bText = b.title.toLowerCase(); if (aText > bText) return 1; else if (aText < bText) return -1; else return 0; })
		}, (err) => {
			console.log("offerCollectionService ERROR");
			console.log(JSON.stringify(err));
		});		
	}

}


import { Injectable } from '@angular/core';

import { UserService } from '../../../_services/user.service';
import { ApiService } from '../../../_services/api.service';

import { environment } from '../../../../_environments/environment';
import { Constants } from '../../../../_constants/constants'

@Injectable({
	providedIn: 'root'
})
export class ListAllOfferService {

	model = undefined;
	lastLoadedPageNumber = 0;
	areMoreOffersAvailable = true;
	pageLength = 5;

	constructor(private _apiService: ApiService, 
				private _userService: UserService,
				private _constants: Constants) {

	}

	getModel() {
		if (this.model === undefined) {
			this.model = {offers: []}
			this.appendNextPageToModel();
		}

		return this.model;
	}

	resetModel() {
		this.model = undefined;
		this.lastLoadedPageNumber = 0;
	}

	hasMore() {
		return this.areMoreOffersAvailable;
	}

	appendNextPageToModel() {
		let self = this;
		let user = this._userService.getCurrentUser();
		let url = environment.apiUrl + "/api/user/" + user["id"] + "/offers/page/" + (++this.lastLoadedPageNumber) + "/count/" + this.pageLength + "?d=" + this._constants.DEFAULT_MAX_MILE_RADIUS;
		self._apiService.get(url).subscribe((offersObj: []) => {

			self.model["offers"].push(...offersObj);

			self.areMoreOffersAvailable = (offersObj.length === self.pageLength);
		}, (err) => {
			console.log("ListAllService appendNextPageToModel ERROR");
			console.log(JSON.stringify(err));
		});		
	}
}

import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { ApiService } from './api.service';
import { PictureService } from './picture.service';
import { PictureEXIFService } from './picture-exif.service';
import { OfferModelService } from './offer-model.service'

import { environment } from '../../_environments/environment';
import { Constants } from '../../_constants/constants';

@Injectable({
	providedIn: 'root'
})
export class SearchService {
	
	constructor(private _apiService: ApiService, private _userService: UserService,
				private _pictureEXIFService: PictureEXIFService, private _constants: Constants,
				private _offerModelService: OfferModelService) { 
		
	}

	searchOffers(qStr, distance, userId?) {
		let self = this;

		if (!userId) {
			userId = this._userService.getCurrentUser()["id"];
		}

		return new Promise((resolve, reject) => {
			let user = self._userService.getCurrentUser();
			let url = environment.apiUrl + "/api/offers?q=" + qStr + "&d=" + distance + "&uid=" + userId;
			self._apiService.get(url)
			.subscribe((searchObj: any[]) => {
				let rtn = searchObj;

				rtn = rtn.filter((obj) => { return obj["userId"] !== user["id"]; });

				resolve(rtn);
			}, (err) => {
				reject(err);
			});
		});
	}

	searchUsers(qStr, distance, userId?) {
		let self = this;

		if (!userId) {
			userId = this._userService.getCurrentUser()["id"];
		}

		return new Promise((resolve, reject) => {
			let url = environment.apiUrl + "/api/users?q=" + qStr + "&d=" + distance + "&uid=" + userId;
			self._apiService.get(url)
			.subscribe((searchObj) => {
				resolve(searchObj);
			}, (err) => {
				reject(err);
			});
		});
	}
}

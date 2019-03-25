import { Injectable } from '@angular/core';

import { UserService } from '../../_services/user.service';
import { ApiService } from '../../_services/api.service';
import { PictureService } from '../../_services/picture.service';
import { OfferModelService } from '../../_services/offer-model.service';
import { FunctionPromiseService } from '../../_services/function-promise.service';

import { environment } from '../../../_environments/environment';
import { Constants } from '../../../_constants/constants';

@Injectable({
	providedIn: 'root'
})
export class HomeService {
	
	isMostRecentlyCreatedOffersFuncInitialized = false;

	constructor(private _apiService: ApiService, private _userService: UserService,
				private _constants: Constants,
				private _offerModelService: OfferModelService, 
				private _pictureService: PictureService,
				private _functionPromiseService: FunctionPromiseService) {

	}

	init() {
		let self = this;
		self._functionPromiseService.initFunc(this._constants.FUNCTION_KEY_MOST_RECENTLY_CREATED_OFFERS_GET, (data) => {
			let userId = data['userId'];
			let count = data['count'];

			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/offers/recent?count=" + count + "&userId=" + userId;
				self._apiService.get(url).subscribe((data: []) => {
					let offers = data;

					offers.forEach((offer) => {
						self._offerModelService.setOfferImageOrientation(offer);
					});

					resolve(offers);
				}, (err) => {
					reject(err);
				});
			})
		})

		this.isMostRecentlyCreatedOffersFuncInitialized = true;

		this._pictureService.init(); // this probably should be happening in response to an event.. Log-in, for instance.
	}

	getMostRecentlyCreatedOffers() {
		let self = this;
		if (!self.isMostRecentlyCreatedOffersFuncInitialized)
			self.init();

		let data = {userId: self._userService.getCurrentUser()['id'], count: 3};
		return self._functionPromiseService.get(data['userId']+"mrcp", self._constants.FUNCTION_KEY_MOST_RECENTLY_CREATED_OFFERS_GET, data);
	}
}
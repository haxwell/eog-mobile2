import { Injectable } from '@angular/core';

import { ApiService } from '../../../../app/_services/api.service';

import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services';

import { environment } from '../../../../_environments/environment';

import { Constants } from '../../../../_constants/constants'

@Injectable({
	providedIn: 'root'
})
export class InteractionsModelService {

	constructor(	private _functionPromiseService: FunctionPromiseService
					,private _apiService: ApiService
					,private _constants: Constants) { 

		// WILO.. The function needs to be written so that it takes the userids from teh data object. 

		this._functionPromiseService.initFunc("getInteractionsBetweenFunc", (data) => {
			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/user/" + data['offeringUserId'] + "/interactions/requests/" + data['requestingUserId'];

				this._apiService.get(url).subscribe((obj) => {
					let model = obj; // list of requests that have been acted on in any way between these two user ids.
					resolve(model);
				}, (err) => {
					reject(err);
				});
			})
		})

	}

	getInteractionsBetween(offeringUserId, requestingUserId) {
		return this._functionPromiseService.get(
			"getInteractionsBetween"+offeringUserId+""+requestingUserId,
			"getInteractionsBetweenFunc", 
			{offeringUserId: offeringUserId, requestingUserId: requestingUserId});
	}
}

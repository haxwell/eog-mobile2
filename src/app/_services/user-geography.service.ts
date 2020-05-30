import { Injectable } from '@angular/core';

import { ApiService } from './api.service'
import { UserService } from './user.service'
import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services';

import { environment } from '../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class UserGeographyService {

	constructor(private _apiService: ApiService,
				private _userService: UserService,
				private _functionPromiseService: FunctionPromiseService) { 

		this._functionPromiseService.initFunc("ugs-number-of-users-nearby", (data) => {
			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/user?userid=" + data['userId'] + "&d=" + data['distance']
				this._apiService.get(url)
				.subscribe((reply: []) => {
					resolve(reply.length - 1);
				}, (err) => {
					reject(err);
				});
			})
		})
	}

	getNumberOfUsersNearby(userId, distance) {
		return this._functionPromiseService.get("ugs-number-of-users-nearby"+userId+distance, "ugs-number-of-users-nearby", {userId: userId, distance: distance});
	}
}

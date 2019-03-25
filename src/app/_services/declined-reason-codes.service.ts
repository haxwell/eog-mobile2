import { Injectable } from '@angular/core';

import { ApiService } from './api.service';

import { environment } from '../../_environments/environment';


@Injectable({
	providedIn: 'root'
})
export class DeclineReasonCodeService {
	
	declineReasonCodes = undefined;
	promise = undefined;
	
	constructor(private _apiService: ApiService) { 

	}

	init() {
		let self = this;
		self.promise = new Promise((resolve, reject) => {
			let url = environment.apiUrl + "/api/declineReasonCodes";
			this._apiService.get(url).subscribe((data) => {
				self.declineReasonCodes = data;
				resolve(self.declineReasonCodes);
			}, (err) => {
				reject(err);
			});
		});

		return self.promise;
	}

	getDeclineReasonCodes() {
		if (this.promise === undefined)
			this.init();

		return this.promise;
	}
	
}

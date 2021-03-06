import { Injectable } from '@angular/core';

import { UserService } from '../../../_services/user.service';
import { ApiService } from '../../../_services/api.service';

import { environment } from '../../../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class TutorialService { 

	constructor(private _apiService: ApiService,
				private _userService: UserService) {

	}

	//////////
	// There's got to be a better way to do this...
	easyahIntroPageHasBeenShown = false;

	getTutorialEasyahIntroPageHasBeenShown() {
		return this.easyahIntroPageHasBeenShown;
	}

	setTutorialEasyahIntroPageHasBeenShown(b) {
		this.easyahIntroPageHasBeenShown = b;
	}
	//
	///////////

	getCurrentUserId() {
		let cu = this._userService.getCurrentUser();

		if (cu) {
			return cu["id"];
		} else {
			return undefined;
		}
	}

	setShowTutorialOnLogin(b) {
		let cuid = this.getCurrentUserId();

		if (cuid) {
			let url = environment.apiUrl + "/api/user/" + cuid + "/preferences/showTutorialOnLogin";
			let data = "value=" + (b === true);

			return new Promise((resolve, reject) => {
				this._apiService.post(url, data).subscribe(
					(val) => { resolve(val); }, (err) => { reject(err);	}
				)
			});
		} else {
			console.error("setting a user specific property before the user has been set.")
		}
	}

	getShowTutorialOnLogin() {
		let cuid = this.getCurrentUserId();

		if (cuid) {
			let url = environment.apiUrl + "/api/user/" + cuid + "/preferences/showTutorialOnLogin";

			return new Promise((resolve, reject) => {
				this._apiService.get(url).subscribe(
					(val) => { resolve(val === null || val === true ); }, (err) => { reject(err); }
				)
			});
		} else {
			return new Promise((resolve, reject) => {
				console.error("trying to get a user specific property before the user has been set")
				reject();
			});
		}
	}
}
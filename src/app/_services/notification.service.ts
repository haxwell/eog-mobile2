import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { ApiService } from './api.service';

import { environment } from '../../_environments/environment';

import * as moment from 'moment'

@Injectable({
	providedIn: 'root'
})
export class NotificationService {
	
	notifications = undefined;
	notificationsPromise = undefined;

	constructor(private _apiService: ApiService, 
				private _userService: UserService) { 

	}

	init() {
		this.notifications = undefined;
		this.notificationsPromise = undefined;
	}

	get(force?) {
		let self = this;
		let rtn = undefined;

		let user = this._userService.getCurrentUser()

		if (this.notifications === undefined || force) {
			this.notifications = null;
			rtn = new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/user/" + user["id"] + "/notifications"
				this._apiService.get(url).subscribe(
					(notificationsObj) => { 
						this.notifications = notificationsObj;
						
						this.notifications.map((obj) => { 
							obj["howLongAgo"] = moment(obj["timestamp"]).fromNow();
						})

						resolve(this.notifications);
					 }, (err) => {
					 	reject(err);
					 });
			});

			self.notificationsPromise = rtn;
		} else {
			rtn = self.notificationsPromise;
		};

		return rtn;
	}

	delete(notification) {
		return new Promise((resolve, reject) => {
			let url = environment.apiUrl + "/api/notifications/" + notification["id"];
			this._apiService.delete(url).subscribe(() => { 
					resolve();
			}, (err) => {
				reject(err);
			});
		});
	}

	deleteAll() {
		return new Promise((resolve, reject) => {
			let user = this._userService.getCurrentUser();
			let url = environment.apiUrl + "/api/user/" + user["id"] + "/notifications/all";

			this._apiService.delete(url).subscribe(() => { 
					resolve();
			}, (err) => {
				reject(err);
			});
		})
	}

}

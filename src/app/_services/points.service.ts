import { Injectable } from '@angular/core';

import { Events } from '@ionic/angular';

import { UserService } from './user.service';
import { ApiService } from './api.service';
import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services';

import { environment } from '../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class PointsService { 
	
	constructor(private _apiService: ApiService, 
				private _userService: UserService, 
				private _functionPromiseService: FunctionPromiseService,
				private _events: Events) {

	}

	FUNC_KEY_GET_CURRENT_USER_POINTS_AS_SUM = "getCurrentUserPointsAsSum";
	FUNC_KEY_GET_CURRENT_AVAIL_USER_POINTS = "getCurrentAvailUserPoints";

	init() {

		this._functionPromiseService.initFunc(this.FUNC_KEY_GET_CURRENT_USER_POINTS_AS_SUM, (data) => {
			return new Promise((resolve, reject) => {
				if (data['user']) {
					let url = environment.apiUrl + "/api/user/" + data['user']['id'] + "/points";
					this._apiService.get(url)
					.subscribe((obj: any[]) => {
						let rtn: any[] = obj;
						let sum = 0;
						rtn.forEach(
							(_obj) => { 
								sum += _obj["quantity"];
							}
						);

						resolve({rtn: sum});
					}, (err) => {
						reject(err);
					});
				} else {
					resolve({rtn: 0});
				}
			});
		});

		this._functionPromiseService.initFunc(this.FUNC_KEY_GET_CURRENT_AVAIL_USER_POINTS, (data) => {
			return new Promise((resolve, reject) => {
				if (data['user']) {
					let url = environment.apiUrl + "/api/user/" + data['user']['id'] + "/points";
					this._apiService.get(url)
					.subscribe((obj: any[]) => {
						let rtn: any[] = obj;
						let sum = 0;
						rtn.forEach(
							(_obj) => { 
								if (_obj["escrowedRequestId"] === null) 
									sum += _obj["quantity"];
							}
						);

						resolve({rtn: sum});
					}, (err) => {
						reject(err);
					});
				} else {
					resolve({rtn: 0});
				}
			});
		})
	}

	getCurrentAvailableUserPoints() {
		return this._functionPromiseService.waitAndGet(this.FUNC_KEY_GET_CURRENT_AVAIL_USER_POINTS, this.FUNC_KEY_GET_CURRENT_AVAIL_USER_POINTS, {user: this._userService.getCurrentUser()});
	}

	getCurrentUserPointsAsSum() {
		return this._functionPromiseService.waitAndGet(this.FUNC_KEY_GET_CURRENT_USER_POINTS_AS_SUM, this.FUNC_KEY_GET_CURRENT_USER_POINTS_AS_SUM, {user: this._userService.getCurrentUser()});
	}

	sendAPointToAUser(receivingUserId: number) {
		console.log("** in pointsService sendAPointToAUser()")
		let self = this;
		return new Promise((resolve, reject) => {
			let user = self._userService.getCurrentUser();
			if (user) {
				let url = environment.apiUrl + "/api/user/" + receivingUserId + "/points/receive";
				let data = "sendingUserId=" + user["id"] + "&quantity=1";
				self._apiService.post(url, data)
				.subscribe((obj) => {
					console.log("** about to throw event --> points:sent")
					self._events.publish("points:sent", {receivingUserId: receivingUserId});
					resolve(obj);
				}, (err) => {
					reject(err);
				});
			}
		});
	}

	isCurrentUserAbleToSendAPointTo(receivingUserId: number) {
		return new Promise((resolve, reject) => {
			let user = this._userService.getCurrentUser();
			if (user) {
				let url = environment.apiUrl + "/api/user/" + receivingUserId + "/points/receive/" + user["id"];
				this._apiService.get(url)
				.subscribe((obj) => {
					resolve(obj);
				}, (err) => {
					reject(err);
				});
			}
		});
	}
}


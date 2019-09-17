import { Injectable } from '@angular/core';

import { Events } from '@ionic/angular';

import { UserService } from './user.service';
import { ApiService } from './api.service';

import { environment } from '../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class PointsService { 
	
	constructor(private _apiService: ApiService, 
				private _userService: UserService, 
				private _events: Events) {

	}

	currentAvailableUserPointsPromiseObj = undefined;
	currentUserPointsAsSumPromiseObj = undefined;

	init() {
		this.currentUserPointsAsSumPromiseObj = undefined;
		this.currentAvailableUserPointsPromiseObj = undefined;
	}

	getCurrentAvailableUserPoints() {
		let TTL = 10 * 1000;
		let now = new Date().getTime();

		if (this.currentAvailableUserPointsPromiseObj && this.currentAvailableUserPointsPromiseObj['timestamp'] + TTL < now) {
			this.currentAvailableUserPointsPromiseObj = undefined;
		}

		if (this.currentAvailableUserPointsPromiseObj === undefined)
			this.currentAvailableUserPointsPromiseObj = {promise: undefined, timestamp: new Date().getTime()};

			this.currentAvailableUserPointsPromiseObj['promise'] = new Promise((resolve, reject) => {
				let user = this._userService.getCurrentUser();
				if (user) {
					let url = environment.apiUrl + "/api/user/" + user["id"] + "/points";
					this._apiService.get(url)
					.subscribe((obj: any[]) => {
						let rtn: any[] = obj;

						let sum = 0;
						rtn.forEach(
							(obj) => { 
								if (obj["escrowedRequestId"] === null) 
									sum += obj["quantity"];
							}
						);

						resolve(sum);
					}, (err) => {
						reject(err);
					});
				} else {
					resolve(0)
				}
			});

		return this.currentAvailableUserPointsPromiseObj['promise'];
	}

	getCurrentUserPointsAsSum() {
		let TTL = 10 * 1000;
		let now = new Date().getTime();

		console.log("*** in getCurrentUserPointsAsSum, the promise is " + (this.currentUserPointsAsSumPromiseObj ? "NOT" : "") + " undefined.");

		if (this.currentUserPointsAsSumPromiseObj)
			console.log("*** in getCurrentUserPointsAsSum, the promise is " + (this.currentUserPointsAsSumPromiseObj['timestamp'] + TTL < now ? "" : "NOT") + " expired.");

		if (this.currentUserPointsAsSumPromiseObj && this.currentUserPointsAsSumPromiseObj['timestamp'] + TTL < now) {
			this.currentUserPointsAsSumPromiseObj = undefined;
		}

		if (this.currentUserPointsAsSumPromiseObj === undefined) 
			this.currentUserPointsAsSumPromiseObj = {promise: null, timestamp: new Date().getTime()}

			this.currentUserPointsAsSumPromiseObj['promise'] = new Promise((resolve, reject) => {
				let user = this._userService.getCurrentUser();
				if (user) {
					let url = environment.apiUrl + "/api/user/" + user["id"] + "/points";
					this._apiService.get(url)
					.subscribe((obj: any[]) => {
						let rtn: any[] = obj;

						let sum = 0;
						rtn.forEach(
							(obj) => { 
								if (obj["escrowedRequestId"] === null) 
									sum += obj["quantity"];
							}
						);

						resolve(sum);
					}, (err) => {
						reject(err);
					});
				} else {
					resolve(0);
				}
			});

		return this.currentUserPointsAsSumPromiseObj['promise'];
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


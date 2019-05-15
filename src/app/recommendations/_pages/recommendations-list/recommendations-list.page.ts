import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { Constants } from '../../../../_constants/constants'
import { environment } from '../../../../_environments/environment';

import { UserService } from '../../../../app/_services/user.service';
import { RecommendationService } from '../../../../app/_services/recommendation.service'
import { PictureService } from '../../../../app/_services/picture.service'

import * as EXIF from 'exif-js';

@Component({
  selector: 'recommendation-list',
  templateUrl: 'recommendations-list.page.html'
  ,styleUrls: ['./recommendations-list.page.scss']
})
export class RecommendationsListPage {

	dirty = undefined;

	directionallyOppositeUserProfileImageFilepath = {};	

	incomingRecommendations = undefined;
	availableIncomingRecommendations = undefined;
	imageOrientation = undefined;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
				private _userService : UserService,
				private _recommendationService : RecommendationService,
				private _pictureService: PictureService,
				private _constants: Constants,
				private _events: Events
	) {
		this.setDirty(true);

		this._events.subscribe('recommendation:received', () => { console.log("RECOMMENDATION-LIST: received recommendation"); this.setDirty(true); this.ngOnInit(); });
		this._events.subscribe('request:markedApprovedAfterCompletion', () => { console.log("RECOMMENDATION-LIST: got markedApprovedAfterCompletion event"); this.setDirty(true); this.ngOnInit(); });
	}

	ngOnInit() {
		if (this.isDirty()) {
			let self = this;

			self._pictureService.init();

			self._recommendationService.init();
			self._recommendationService.getIncomingRecommendations().then((data: Array<any>) => {
				self.incomingRecommendations = data;

				self.availableIncomingRecommendations = data.filter((rec) => { return rec["escrowedRequestId"] === null });
				self.availableIncomingRecommendations.map((rec) => { 
					self._userService.getUser(rec["providingUserId"]).then((user) => {
						rec["userInfo"] = user;
					});
				});
			});
		}
	}

	isDirty() {
		return this.dirty;
	}

	setDirty(b) {
		this.dirty = b || true;
	}

	areIncomingRecommendationsAvailable() {
		return this.availableIncomingRecommendations !== undefined && this.availableIncomingRecommendations.length > 0;
	}

	getAvailableIncomingRecommendations() {
		return this.availableIncomingRecommendations;
	}

	getDOUserProfileImageFilepath(userId) {
		let photoType = "profile";
		let objId = userId;
		return environment.apiUrl + "/api/resource/" + photoType + "/" + objId
	}

	getRealName(item) {
		let rtn = undefined;
		
		if (item["userInfo"]) {
			rtn = item["userInfo"]["realname"];
		}

		return rtn
	}

	onViewUser(item) {
		this._router.navigate(['/profile/' + item["userInfo"]["id"]])
	}
}
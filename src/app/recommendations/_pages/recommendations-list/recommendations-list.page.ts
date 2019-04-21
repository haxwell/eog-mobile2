import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { Constants } from '../../../../_constants/constants'

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
		return this.directionallyOppositeUserProfileImageFilepath[userId];
	}

	// TODO: This method appears in several classes. Refactor this to a single source.
	isDOUserProfileImageAvailable(userId) {
		let rtn = this.directionallyOppositeUserProfileImageFilepath[userId] !== undefined && this.directionallyOppositeUserProfileImageFilepath[userId] !== null;

		let self = this;
		if (self.directionallyOppositeUserProfileImageFilepath[userId] === undefined && userId !== undefined) {
			self.directionallyOppositeUserProfileImageFilepath[userId] = null;

			self._pictureService.get(self._constants.PHOTO_TYPE_PROFILE, userId).then((path) => {
				if (path !== undefined)
					self.directionallyOppositeUserProfileImageFilepath[userId] = path;
			});
		}

		return rtn; 
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

	getAvatarCSSClassString() {
		// This didn't have the centered classs as default either.. everything okay?
		return this._pictureService.getOrientationCSS(this);
	}

	loaded(evt) {
		let self = this;
		EXIF.getData(evt.target, function() {
			self.imageOrientation = EXIF.getTag(this, "Orientation");
		});
	}
}
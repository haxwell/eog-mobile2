import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { Constants } from '../../_constants/constants'

import { ProfilePage } from '../profile/profile.page'

import { SearchService } from '../../app/_services/search.service';
import { PictureService } from '../../app/_services/picture.service';
import { UserService } from '../../app/_services/user.service';
import { LoadingService } from '../../app/_services/loading.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-search',
  templateUrl: 'search.page.html'
  ,styleUrls: ['./search.page.scss']
})
export class SearchPage {
	searchString = '';
	offerResults = undefined;
	usersResults = undefined;

	constructor(private _route: ActivatedRoute,
  				private _router: Router,
				private _searchService: SearchService,
				private _pictureService: PictureService,
				private _userService: UserService,
				private _loadingService: LoadingService,
				private _constants: Constants,
				_events: Events) {
				console.log("DSAHJKDASHJKDASGJDKSAGHDASGHJDASGHJDASHJDASJHDVGHJADS")
	}

	ngOnInit() {
		let self = this;
		self._route.params.subscribe((params) => {
			self.searchString = params['searchString'];
		});
	}

	//ionViewWillEnter() {
	//	this.onSearchBtnTap();
	//}

	onSearchBtnTap(evt?) {
		let self = this;

		self._loadingService.show({
			message: 'Please wait...'
		})

		this.usersResults = undefined;
		this.offerResults = undefined;

		let count = 0;
		let func = () => {
			count++;
			if (count >= 2)
				self._loadingService.dismiss();
		};

		let user = self._userService.getCurrentUser();
		let distance = 50; // TODO: Add a drop down where the user can select a distance.

		this._searchService.searchOffers(this.searchString, distance, user["id"]).then((data: Array<Object>) => {

			if (data.length === 0) {
				self.offerResults = data;

				func();

			} else {
				data.map((obj) => {
					self._userService.getUser(obj["userId"]).then((user) => {
						obj["directionallyOppositeUser"] = user;
						delete obj["userId"];

						if (!data.some((obj) => { return obj["userId"] != undefined; })) {
							self.offerResults = data;
							func();
						}
					});
				});
			}
		});

		this._searchService.searchUsers(this.searchString).then((data: Array<Object>) => {
			self.usersResults = data;
			func();
		});
	}

	onQueryChanged(event) {
		this.searchString = event._value;
	}

	getOfferResults() {
		return this.offerResults;
	}

	isUsersResultsEmpty() {
		// TODO: Create Utility for this, duplicate code in other-peoples-offer-list.ts
		let rtn = this.usersResults == undefined || this.usersResults == null || this.usersResults.length == 0;
		return rtn;
	}

	getUsersResults() {
		if (this.usersResults !== undefined) {
			let currentUser = this._userService.getCurrentUser();
			return this.usersResults.filter((o) => { return o["id"] !== currentUser["id"]; });
		} else {
			return this.usersResults;
		}
	}

	profileImageFilepath = [];
	getProfileImageFilepath(user) {
		return this.profileImageFilepath[user["id"]];
	}

	isProfileImageAvailable(user) {
		let rtn = this.profileImageFilepath[user["id"]] !== undefined && this.profileImageFilepath[user["id"]] !== null;

		let self = this;
		if (this.profileImageFilepath[user["id"]] === undefined) {
			this.profileImageFilepath[user["id"]] = null;

			self._pictureService.get(this._constants.PHOTO_TYPE_PROFILE, user["id"]).then((path) => {
				if (path !== undefined)
					self.profileImageFilepath[user["id"]] = path;
			});
		}

		return rtn; 
	}

	onViewUser(_user) {
		this._router.navigate(['/profile/' + _user["id"]]);
	}
}

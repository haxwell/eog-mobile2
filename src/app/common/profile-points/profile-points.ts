import { Component } from '@angular/core';

import { PointsService } from '../../../app/_services/points.service'
import { UserService } from '../../../app/_services/user.service'
import { ProfileService } from '../_services/profile.service'

import { Events } from 'ionic-angular';

@Component({
  selector: 'profile-points',
  templateUrl: 'profile-points.html'
})

export class ProfilePoints {

	totalPoints = undefined;
	availablePoints = undefined;
	profileModel = undefined;
	currentUser = undefined;

	constructor( private _events: Events,
				 private _pointsService : PointsService
				,private _profileService : ProfileService
				,private _userService : UserService ) {

		this._events.subscribe('app:login', () => { this.ngOnInit(); });
		this._events.subscribe('points:received', () => { this.ngOnInit(); });
		this._events.subscribe('request:saved', () => { this.ngOnInit(); });
		this._events.subscribe('request:declined', () => { this.ngOnInit(); });
		this._events.subscribe('request:outgoing:cancelled', () => { this.ngOnInit(); });
		this._events.subscribe('request:accepted:cancelledByRequestor', () => { this.ngOnInit(); });
		this._events.subscribe('request:completedAndApproved', () => { this.ngOnInit(); });
		this._events.subscribe('request:inamicablyResolved', () => { this.ngOnInit(); });
		this._events.subscribe('request:markedApprovedAfterCompletion', () => { this.ngOnInit(); });
	}

	ngOnInit() {
		this.totalPoints = '-';
		this.availablePoints = '-';

		this._pointsService.init();

		var user = this._userService.getCurrentUser();
		if (user) 
			this._profileService.init(user["id"]);

		this._pointsService.getCurrentAvailableUserPoints().then((caPoints) => {
			this.availablePoints = caPoints;
		});

		this._pointsService.getCurrentUserPointsAsSum().then((sumPoints) => {
			this.totalPoints = sumPoints;
		});
	}

	getTotalPoints() {
		return this.totalPoints;
	}

	getAvailablePoints() {
		return this.availablePoints;
	}

	getAllTimePointsCount() {
		var user = this._userService.getCurrentUser();
		
		if (user) {
			var pts = this._profileService.getModel(user["id"])["allTimePointCount"]
			return pts;
		} else {
			return 0;
		}
	}
}

import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import { Constants } from '../../_constants/constants';

import { UserService } from './user.service';
import { ApiService } from './api.service';
import { PointsService } from './points.service';
import { PictureService } from './picture.service';
import { ProfileModelService } from './profile-model.service';
import { RecommendationService } from './recommendation.service';
import { UserPreferencesService } from './user-preferences.service';
import { ContactInfoVisibilityService } from './contact-info-visibility.service';

import { environment } from '../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ProfileService {

	modelCache = {};

	constructor(private _apiService: ApiService, 
				private _userService: UserService, 
				private _pointsService: PointsService,
				private _profileModelService: ProfileModelService,
				private _recommendationService: RecommendationService,
				private _pictureService: PictureService,
				private _userPreferencesService: UserPreferencesService,
				private _contactInfoVisibilityService: ContactInfoVisibilityService,
				private _constants : Constants,
				private _events: Events) {

				}

	init(userId:number) {

	}

	getModel(userId?: number) {
		return this._profileModelService.get(userId);
	}

	save(model) {
		return this._profileModelService.save(model);
	}

	// THIS IS USED OUTSIDE OF THE NORMAL MODEL FUNCTIONALITY OF THIS SERVICE.
	//  It can be abstracted elsewhere.

	_counter = 0;
	bumpTheThumbnailCounter() {
		this._counter++;
	}

	getThumbnailImagePath(userId?) {
		if (!userId)
			userId = this._userService.getCurrentUser()["id"];

		return environment.apiUrl + "/api/resource/profile/" + userId + '/sendAnew/' + this._counter; 
	}	

}
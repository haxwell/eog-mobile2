import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import { Constants } from '../../_constants/constants';

import { UserService } from './user.service';
import { ApiService } from './api.service';
import { PointsService } from './points.service';
import { PictureService } from './picture.service';
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
				private _recommendationService: RecommendationService,
				private _pictureService: PictureService,
				private _userPreferencesService: UserPreferencesService,
				private _contactInfoVisibilityService: ContactInfoVisibilityService,
				private _constants : Constants,
				private _events: Events) {

				}

	init(userId:number) {
		this._recommendationService.init();
		this._pointsService.init();
		this._pictureService.reset(this._constants.PHOTO_TYPE_PROFILE, userId);

		this.modelCache[userId] = undefined;
	}

	getModel(userId: number) {
		if (this.modelCache[userId] === undefined) {
			console.log("PROFILE MODEL was undefined. CREATING A NEW PROFILE MODEL.");
			this.modelCache[userId] = {};
			return this.initModel(userId, this.modelCache[userId]);
		} else { 
			return this.modelCache[userId];
		}
	}

	initModel(userId: number, model) {
		this._pointsService.init();
		this._recommendationService.init();
		this._pictureService.init()

		model["points"] = {"total" : 0, "available": 0};

		this._userService.getUser(userId, true /* force an API call */).then((userObj) => {
			model["realname"] = userObj["realname"];
			model["phone"] = userObj["phone"];
			model["email"] = userObj["email"];
			model["latitude"] = userObj["latitude"];
			model["longitude"] = userObj["longitude"];
		});

		let url = environment.apiUrl + "/api/user/" + userId + "/profile";
		this._apiService.get(url).subscribe((data) => {
			let obj = data;
			
			model["allTimePointCount"] = obj["allTimePointCount"];
			model["description"] = obj["description"];

			model["keywords"] = obj["keywords"];
			model["keywords"].sort((a, b) => { let aText = a.text.toLowerCase(); let bText = b.text.toLowerCase(); if (aText > bText) return 1; else if (aText < bText) return -1; else return 0; })

			model["archivedRequestCount"] = obj["archivedRequestCount"];
			model["disputedRequestCount"] = obj["disputedRequestCount"];
			model["mostRecentDisputedRequestTimestamp"] = obj["mostRecentDisputedRequestTimestamp"] || undefined;
		}, (err) => {
			console.log("ProfileService ERROR");
			console.log(JSON.stringify(err));
		});

		if (model["imageFileURI"] === undefined) {
			this._pictureService.get(this._constants.PHOTO_TYPE_PROFILE, userId).then((filename) => {
				model["imageFileSource"] = 'eog';
				model["imageFileURI"] = filename;
				model["imageFileURI_OriginalValue"] = filename;
			})
  		} 

		this._pointsService.getCurrentAvailableUserPoints().then((pts) => {
			model["points"]["available"] = pts;
		});

		this._pointsService.getCurrentUserPointsAsSum().then((pts) => {
			model["points"]["total"] = pts;
		});

		let currentUser = this._userService.getCurrentUser();
		if (currentUser["id"] === userId) {
			model["currentUserCanSeeEmailInfo"] = true;
			model["currentUserCanSeePhoneInfo"] = true;
		}
		else {
			let self = this;
			url = environment.apiUrl + "/api/user/" + userId + "/requests/inprogress/user/" + currentUser["id"];
			self._apiService.get(url).subscribe((offersObj: any[]) => {
				var b = offersObj.length > 0;
				
				if (b) {
					self._contactInfoVisibilityService.getContactInfoVisibilityId(userId).then((visId) => {
						model["currentUserCanSeeEmailInfo"] = self._contactInfoVisibilityService.isEmailAllowed(visId);
						model["currentUserCanSeePhoneInfo"] = self._contactInfoVisibilityService.isPhoneAllowed(visId);
					})
				}
			}, (err) => {
				console.log("ProfileService ContactInfoVisibility ERROR");
				console.log(JSON.stringify(err));
			});
		}
		
		this._recommendationService.getOutgoingRecommendations().then((obj) => {
			model["outgoingRecommendations"] = obj;
		});

		return model;
	}

	save(model) {
		let tmp = {};

		let user = this._userService.getCurrentUser();

		tmp["profileId"] = model["id"];
		tmp["userId"] = user["id"];
		tmp["realname"] = model["realname"];
		tmp["phone"] = model["phone"];
		tmp["email"] = model["email"];
		tmp["keywords"] = model["keywords"];
		tmp["description"] = model["description"];
		tmp["latitude"] = model["latitude"];
		tmp["longitude"] = model["longitude"];
		
		let data = this.JSON_to_UrlEncoded(tmp, undefined, undefined);

		let self = this;
		return new Promise((resolve, reject) => {
			let url = environment.apiUrl + "/api/profiles";
			self._apiService.post(url, data)
			.subscribe((resp) => {
				let newModel = resp;

				let userUpdateFunc = () => {
					this._events.publish('profile:changedContactInfoWasSaved', newModel);

					self.init(user["id"]);
					resolve(newModel);
				}

				if (self.isProfileImageChanged(model)) {
					self._pictureService.save(this._constants.PHOTO_TYPE_PROFILE, user["id"], model["imageFileURI"]).then((data) => {
						userUpdateFunc();
					}, (err) => {
						reject(err);
		            });

				} else
					userUpdateFunc();
			}, (err) => {
				reject(err);
			});
		});
	}

	isProfileImageChanged(model) {
		return model["imageFileURI_OriginalValue"] != model["imageFileURI"];
	}

	JSON_to_UrlEncoded(element,key,list){
  		var list = list || [];
  		if(typeof(element)=='object'){
    		for (var idx in element)
      			this.JSON_to_UrlEncoded(element[idx],key?key+'['+idx+']':idx,list);
  		} else {
    		list.push(key+'='+encodeURIComponent(element));
  		}
  		
  		return list.join('&');
	}

}
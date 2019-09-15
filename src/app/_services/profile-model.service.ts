import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import { ApiService } from './api.service';
import { ContactInfoVisibilityService } from './contact-info-visibility.service'
import { FunctionPromiseService } from './function-promise.service';
import { UserService } from './user.service';
import { PictureService } from './picture.service';
import { PointsService } from './points.service';
import { RecommendationService } from './recommendation.service';
import { ModelTransformingService } from './model-transforming.service'

import { Constants } from '../../_constants/constants'

import { environment } from '../../_environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileModelService  {

	modelCache = { };
	modelTransformingServiceHasBeenInitd = false;

	constructor(private _constants: Constants,
				private _apiService: ApiService,
				private _contactInfoVisibilityService: ContactInfoVisibilityService,
				private _functionPromiseService: FunctionPromiseService,
				private _userService: UserService,
				private _pictureService: PictureService,
				private _pointsService: PointsService,
				private _recommendationService: RecommendationService,
				private _modelTransformingService: ModelTransformingService,
				private _events: Events) { 

	}

	init() {
		this.modelCache = { };
		this._recommendationService.init();
		this._pointsService.init();

		this.modelTransformingServiceHasBeenInitd = false;
	}

	getDefaultModel(userId?) {
		return {userId: userId};
	}

	get(userId) { 
		let self = this;

		if (!userId)
			userId = self._userService.getCurrentUser()['id'];

		if (!this.modelTransformingServiceHasBeenInitd) {
			this.initTransformer();
			this.modelTransformingServiceHasBeenInitd = true;
		}

		self._functionPromiseService.initFunc(userId+"profileFuncKey", () => {
			return new Promise((resolve, reject) => {
				self._modelTransformingService.reset();
				resolve(self._modelTransformingService.transform(self.getDefaultModel(userId)));
			});
		});

		return self._functionPromiseService.get(userId+"ProfileModel", userId+"profileFuncKey", { });
	}

	initTransformer() {
		this._modelTransformingService.addTransformer((model, done) => {
			model["points"] = {"total" : 0, "available": 0};
			done();
		})

		this._modelTransformingService.addTransformer((model, done) => {
			this._userService.getUser(model['userId'], true /* force an API call */).then((userObj) => {
				model["realname"] = userObj["realname"];
				model["phone"] = userObj["phone"];
				model["email"] = userObj["email"];
				model["latitude"] = userObj["latitude"];
				model["longitude"] = userObj["longitude"];
				done();
			});
		})

		this._modelTransformingService.addTransformer((model, done) => {
			let url = environment.apiUrl + "/api/user/" + model['userId'] + "/profile";
			this._apiService.get(url).subscribe((data) => {
				let obj = data;

				model["allTimePointCount"] = obj["allTimePointCount"];
				model["description"] = obj["description"];

				model["keywords"] = obj["keywords"];
				model["keywords"].sort((a, b) => { let aText = a.text.toLowerCase(); let bText = b.text.toLowerCase(); if (aText > bText) return 1; else if (aText < bText) return -1; else return 0; })

				model["archivedRequestCount"] = obj["archivedRequestCount"];
				model["disputedRequestCount"] = obj["disputedRequestCount"];
				model["mostRecentDisputedRequestTimestamp"] = obj["mostRecentDisputedRequestTimestamp"] || undefined;
				done();
			}, (err) => {
				console.log("ProfileService ERROR");
				console.log(JSON.stringify(err));
				done();
			});
		})

		this._modelTransformingService.addTransformer((model, done) => {
			if (model["imageFileURI"] === undefined) {
				this._pictureService.get(this._constants.PHOTO_TYPE_PROFILE, model['userId']).then((filename) => {
					model["imageFileSource"] = 'eog';
					model["imageFileURI"] = filename;
					model["imageFileURI_OriginalValue"] = filename;
				})
	  		} 
		});

		this._modelTransformingService.addTransformer((model, done) => {
			this._pointsService.getCurrentAvailableUserPoints().then((pts) => {
				model["points"]["available"] = pts;
			});
		});

		this._modelTransformingService.addTransformer((model, done) => {
			this._pointsService.getCurrentUserPointsAsSum().then((pts) => {
				model["points"]["total"] = pts;
			});
		});

		this._modelTransformingService.addTransformer((model, done) => {
			let currentUser = this._userService.getCurrentUser();
			if (currentUser["id"] === model['userId']) {
				model["currentUserCanSeeEmailInfo"] = true;
				model["currentUserCanSeePhoneInfo"] = true;
			}
			else {
				let self = this;
				let url = environment.apiUrl + "/api/user/" + model['userId'] + "/requests/inprogress/user/" + currentUser["id"];
				self._apiService.get(url).subscribe((offersObj: any[]) => {
					var b = offersObj.length > 0;
					
					if (b) {
						self._contactInfoVisibilityService.getContactInfoVisibilityId(model['userId']).then((visId) => {
							model["currentUserCanSeeEmailInfo"] = self._contactInfoVisibilityService.isEmailAllowed(visId);
							model["currentUserCanSeePhoneInfo"] = self._contactInfoVisibilityService.isPhoneAllowed(visId);
						})
					}
				}, (err) => {
					console.log("ProfileService ContactInfoVisibility ERROR");
					console.log(JSON.stringify(err));
				});
			}
		});

		this._modelTransformingService.addTransformer((model, done) => {
			this._recommendationService.getOutgoingRecommendations().then((obj) => {
				model["outgoingRecommendations"] = obj;
			});
		});
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

					//self.init(user["id"]);
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

	isProfileImageChanged(model) {
		return model["imageFileURI_OriginalValue"] != model["imageFileURI"];
	}

}

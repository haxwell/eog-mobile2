import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import { UserService } from './user.service';
import { ApiService } from './api.service';
import { PictureService } from './picture.service';
import { PictureEXIFService } from './picture-exif.service';
import { FunctionPromiseService } from './function-promise.service'

import { Constants } from '../../_constants/constants';
import { environment } from '../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class OfferModelService {
	
	modelCache = { };

	constructor(private _functionPromiseService: FunctionPromiseService,
				private _apiService: ApiService, private _userService: UserService,
				private _pictureService: PictureService,
				private _pictureEXIFService: PictureEXIFService,
				private _constants: Constants,
				private _events: Events
	) {

	}

	getDefaultModel() { 
		let user = this._userService.getCurrentUser();
		let rtn = {};

		rtn["userId"] = user["id"];
		rtn["description"] = '';
		rtn["title"] = '';
		rtn["quantity"] = 0;
		rtn["quantityDescription"] = '';
		rtn["keywords"] = [];
		rtn["requiredPointsQuantity"] = 0;
		rtn["requiredUserRecommendations"] = [];

		return rtn;
	}

	get(offerId) {
		let self = this;

		self._functionPromiseService.initFunc(offerId+"offerFuncKey", () => {
			return new Promise((resolve, reject) => {
				let url = environment.apiUrl + "/api/offers/" + offerId; 
				this._apiService.get(url)
				.subscribe((offerObj) => {
					
					if (offerObj["requiredUserRecommendations"]) {
						offerObj["requiredUserRecommendations"].forEach((rec) => {
							self._userService.getUser(rec["requiredRecommendUserId"]).then((user) => {
								rec["userObj"] = user;
							})
						});
					}

					offerObj["keywords"].sort((a, b) => { let aText = a.text.toLowerCase(); let bText = b.text.toLowerCase(); if (aText > bText) return 1; else if (aText < bText) return -1; else return 0; })

			        if (offerObj["userId"] !== this._userService.getCurrentUser()["id"] && 
			        	offerObj["directionallyOppositeUser"] === undefined) {
					        let getUserOffer = this._userService.getUser(offerObj["userId"]);
					        getUserOffer.then((user) => {
					            offerObj["directionallyOppositeUser"] = user;
					            delete offerObj["userId"];
					        });
			        }

					if (offerObj["requiredUserRecommendations"]) {
						offerObj["requiredUserRecommendations"].forEach((rec) => {
							this._userService.getUser(rec["requiredRecommendUserId"]).then((user) => {
								rec["userObj"] = user;
								//this.requiredUserObjectsLoadedCount++;
							})
						});
					}


					resolve(offerObj);
				}, (err) => {
					reject(err);
				});
			});
		});

		self._pictureService.init();

		self.modelCache[offerId] = self._functionPromiseService.get(offerId, offerId+"offerFuncKey", offerId);
		return self.modelCache[offerId];
	}

	isEditingLimitedToPointsOnly() {

	}

	// TODO: This should probably not be an externally accessible method.. Is there ever a time we do not want to do this when
	//  we get a new offer model? If not, we should call it as a part of get()
	setOfferMetadata(offer) {

		// TODO:
		// There's a piece of the framework here.. An object which takes tuples of apiURLs,domainObjects, and DO-property-names
		// Perhaps it takes the domain object, then apiURL and DO property name pairs. Then returns a promise which will have
		// set the properties to the results of all the API calls when it resolves. So I don't have to check each property in each
		//  method here. I've done this pattern (checking each) in other places too.

		return new Promise((resolve, reject) => {
			let count = 0;
			let func = (offer) => {
				let numPiecesOfMetadata = 4;

				if (++count > numPiecesOfMetadata)
					resolve(offer);
			}

			let url = environment.apiUrl + "/api/offers/" + offer["id"] + "/fulfillment-dates"; 
			this._apiService.get(url)
			.subscribe((data) => {
				offer["fulfillment_dates"] = data;
				func(offer);
			}, (err) => {
				reject(err);
			});

			url = environment.apiUrl + "/api/offers/" + offer["id"] + "/complaint-count"; 
			this._apiService.get(url)
			.subscribe((data) => {
				offer["num_of_complaints"] = data;
				func(offer);
			}, (err) => {
				reject(err);
			});

			url = environment.apiUrl + "/api/offers/" + offer["id"] + "/total-points-earned"; 
			this._apiService.get(url)
			.subscribe((data) => {
				offer["total_points_earned"] = data;
				func(offer);
			}, (err) => {
				reject(err);
			});

			this.setOfferImageOrientation(offer).then((offer) => {
				func(offer);
			})
		});
	}

	setOfferImageOrientation(offer) {
		let self = this;

		return new Promise((resolve, reject) => {

			self._pictureService.get(self._constants.PHOTO_TYPE_OFFER, offer["id"]).then((filename) => {
				offer["imageFileSource"] = 'eog';
				offer["imageFileURI"] = filename;
				offer["imageFileURI_OriginalValue"] = filename;

				if (filename) {
					self._pictureEXIFService.getEXIFMetadata(filename).then((exifMetadata) => {
						offer["imageOrientation"] = exifMetadata["Orientation"];
						resolve(offer);
					})
				} else {
					resolve(offer);
				}
			}, (err) => {
				resolve(undefined);
			});

		})
	}

	save(model, cb) {
		let self = this;
		let data = this.JSON_to_URLEncoded(model, undefined, undefined);

		return new Promise((resolve, reject) => {
			let url = environment.apiUrl + "/api/offers";
			this._apiService.post(url, data)
			.subscribe((resp) => {
				let obj = resp;

				let func = () => {
					self._events.publish("offer:saved", obj)
					resolve(obj);
				}

				if (cb) {
					cb(obj).then(() => {
						func();
					}).catch((err) => {
						console.log("error in offerModelService calling the callback");
						console.log(JSON.stringify(err));
					})
				} else {
					func();
				}
			},
			(err) => {
				console.log("Error calling API POST for " + url)
				console.log(JSON.stringify(err))
				reject(err);
			});
		});
	}

	JSON_to_URLEncoded(element,key,list){
  		var list = list || [];
  		if(typeof(element)=='object'){
    		for (var idx in element)
      			this.JSON_to_URLEncoded(element[idx],key?key+'['+idx+']':idx,list);
  		} else {
    		list.push(key+'='+encodeURIComponent(element));
  		}
  		
  		return list.join('&');
	}

	delete(model) {
		let self = this;
		return new Promise((resolve, reject) => {
			let url = environment.apiUrl + "/api/offers/" + model["id"];
			this._apiService.delete(url)
			.subscribe((resp) => {
				let obj = resp;

				self._events.publish("offer:deleted", obj)

				resolve(obj);
			}, (err) => {
				reject(err);
			});
		});	
	}
}

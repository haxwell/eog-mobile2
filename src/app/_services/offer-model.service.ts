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
		this._pictureService.init();
	}

	init() {
		this.modelCache = { }
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

		if (self.modelCache[offerId] !== undefined) {
			return self.modelCache[offerId];
		} else {
			self._functionPromiseService.initFunc(offerId+"offerFuncKey", () => {
				return new Promise((resolve, reject) => {
					console.log("Got in the offermodelservice offerFuncKey function!!")

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

			let fpsPromise = self._functionPromiseService.get(offerId, offerId+"offerFuncKey", offerId);
			
			self.modelCache[offerId] = new Promise((resolve, reject) => {
				fpsPromise.then((model) => {
					self.setOfferMetadata(model).then((finalModel) => {
						resolve(finalModel);
					});
				})
			})

			return self.modelCache[offerId];
		}
	}

	offerMetadata = {}

	// TODO: Move this to the offerMetadataService
	setOfferMetadata(offer) {
		let self = this;

		if (self.offerMetadata[offer['id']] !== undefined) {
			return self.offerMetadata[offer['id']]
		} else {
			self._functionPromiseService.initFunc("fulfillment-dates", (_offer) => {
				return new Promise((resolve, reject) => {
					let url = environment.apiUrl + "/api/offers/" + _offer["id"] + "/fulfillment-dates"; 
					this._apiService.get(url)
					.subscribe((data) => {
						_offer["fulfillment_dates"] = data;
						resolve(_offer)
					}, (err) => {
						reject(err);
					});
				})
			});

			self._functionPromiseService.initFunc("complaint-count", (_offer) => {
				return new Promise((resolve, reject) => {
					let url = environment.apiUrl + "/api/offers/" + _offer["id"] + "/complaint-count"; 
					this._apiService.get(url)
					.subscribe((data) => {
						_offer["num_of_complaints"] = data;
						resolve(_offer)					
					}, (err) => {
						reject(err);
					});
				})
			});

			self._functionPromiseService.initFunc("total-points-earned", (_offer) => {
				return new Promise((resolve, reject) => {
					let url = environment.apiUrl + "/api/offers/" + _offer["id"] + "/total-points-earned"; 
					this._apiService.get(url)
					.subscribe((data) => {
						_offer["total_points_earned"] = data;
						resolve(_offer)					
					}, (err) => {
						reject(err);
					});
				})
			});

			self.offerMetadata[offer['id']] = new Promise((resolve, reject) => {
				let count = 0;
				let func = (offer) => {
					let numPiecesOfMetadata = 4;

					if (++count > (numPiecesOfMetadata - 1)) {
						console.log("Got all FOUR!")
						resolve(offer);
					}
				}

				self._functionPromiseService.get(offer["id"]+"fulfillment-dates", "fulfillment-dates", offer).then(() => {
					func(offer);
				})

				self._functionPromiseService.get(offer["id"]+"complaint-count", "complaint-count", offer).then(() => {
					func(offer);
				})

				self._functionPromiseService.get(offer["id"]+"total-points-earned", "total-points-earned", offer).then(() => {
					func(offer);
				})

				self.setOfferImageOrientation(offer).then((offer) => {
					func(offer);
				})
			});

			console.log("saved " + offer['id'] + " to offermodelservice offerMetadata cache...")

			return self.offerMetadata[offer['id']];
		}
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

	save(model) {
		let self = this;
		let data = this.JSON_to_URLEncoded(model, undefined, undefined);

		return new Promise((resolve, reject) => {
			let url = environment.apiUrl + "/api/offers";
			this._apiService.post(url, data)
			.subscribe((resp) => {
				let newModel = resp;

				let func = () => {
					self._events.publish("offer:saved", newModel)
					resolve(newModel);
				}

				if (self.isOfferImageChanged(model)) {
					self._pictureService.save(this._constants.PHOTO_TYPE_OFFER, model["id"], model["imageFileURI"]).then((data) => {
						func();
					}, (err) => {
						reject(err);
		            });

				} else
					func();
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

	isEditingLimitedToPointsOnly() {

	}

	isOfferImageChanged(model) {
		return model["imageFileURI_OriginalValue"] != model["imageFileURI"];
	}
}

import { Injectable } from '@angular/core';
import { Events } from '@ionic/angular';

import { UserService } from './user.service';
import { ApiService } from './api.service';
import { PictureService } from './picture.service';
import { PictureEXIFService } from './picture-exif.service';
import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services'

import { Constants } from '../../_constants/constants';
import { environment } from '../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class OfferModelService {
	
	modelCache = { };

	requiredUserObjectsLoadedCount = 0;

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

	waitingPromise(offerId) {
		let self = this;
		return new Promise((resolve, reject) => {

			function wait() {
				setTimeout(() => {
					if (self.modelCache[offerId] !== undefined && self.modelCache[offerId]['isFullyLoaded'])
						resolve(self.modelCache[offerId]);
					else
						wait();
				}, 600);
			}

			let rtn = self.get(offerId);

			if (rtn && rtn['isFullyLoaded']) {
				resolve(rtn);
			} else {
				wait();
			}
		})
	}

	get(offerId) {
		let self = this;

		if (!offerId)
			return { };

		if (self.modelCache[offerId] === undefined) {
			if (offerId === -1) {
				self.modelCache[offerId] = self.getDefaultModel();
				return self.modelCache[offerId];
			} else {
				return self.initModel(offerId, self.modelCache[offerId]);
			}
		} else {
			return self.modelCache[offerId];
		}
	}

	initModel(offerId: number, model) {
		let self = this;

		self._pictureService.init();

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
								this.requiredUserObjectsLoadedCount++;
							})
						});
					}

					resolve(offerObj);
				}, (err) => {
					reject(err);
				});
			});
		});

		// call the function
		let fpsPromise = self._functionPromiseService.waitAndGet(offerId, offerId+"offerFuncKey", offerId);
			
		fpsPromise.then((model) => {
			self.setOfferMetadata(model).then((finalModel) => {
				finalModel['isFullyLoaded'] = true;
				self.modelCache[offerId] = finalModel
			});
		});

		if (!self.modelCache[offerId])
			self.modelCache[offerId] = { };

		return self.modelCache[offerId];
	}

	hasRequiredRecommendationUserObjects(offerId) {
		let _model = this.get(offerId);
		return (_model["requiredUserRecommendations"] && _model["requiredUserRecommendations"].length > 0);
	}

	getRequiredRecommendationUserObjects(offerId) {
		let rtn = undefined;

		let _model = this.get(offerId);

		if (_model["requiredUserRecommendations"] && _model["requiredUserRecommendations"].length > 0) {
			rtn = [];

			_model["requiredUserRecommendations"].forEach((req) => {
				rtn.push(req["userObj"]);
			})
		}

		return rtn;
	}	

	
	// TODO: I think the caching here is redundant. If the get() and initModel() calls are handled
	//  correctly, setOfferMetadata should only ever be called once per offer-model-initialization. Previously, this was being called over and over, thus the cache.

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
						resolve(offer);
					}
				}

				self._functionPromiseService.waitAndGet(offer["id"]+"fulfillment-dates", "fulfillment-dates", offer).then(() => {
					func(offer);
				})

				self._functionPromiseService.waitAndGet(offer["id"]+"complaint-count", "complaint-count", offer).then(() => {
					func(offer);
				})

				self._functionPromiseService.waitAndGet(offer["id"]+"total-points-earned", "total-points-earned", offer).then(() => {
					func(offer);
				})

				self.setOfferImageOrientation(offer).then((offer) => {
					func(offer);
				})
			});

			return self.offerMetadata[offer['id']];
		}
	}

	setOfferImageOrientation(offer) {
		let self = this;

		return new Promise((resolve, reject) => {
			self._pictureService.get(self._constants.PHOTO_TYPE_OFFER, offer["id"]).then((obj) => {
				offer["imageFileSource"] = 'eog';
				offer["imageFileURI"] = obj['path'];
				offer["imageFileURI_OriginalValue"] = obj['path'];

				if (obj['path']) {
					self._pictureEXIFService.getEXIFMetadata(obj['path']).then((exifMetadata) => {
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
					self._pictureService.save(this._constants.PHOTO_TYPE_OFFER, newModel["id"], model["imageFileURI"]).then((data) => {
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

	_counter = 0;
	bumpTheThumbnailCounter() {
		this._counter++;
	}

	getThumbnailImagePath(offerId) {
		return environment.apiUrl + "/api/resource/offer/" + offerId + '/sendAnew/' + this._counter; 
	}	

}

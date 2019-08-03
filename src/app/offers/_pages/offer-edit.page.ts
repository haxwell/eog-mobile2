import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { File } from '@ionic-native/file/ngx'

import { Events } from '@ionic/angular';

import { RulePage } from './rule.page'
import { KeywordEntryPage } from '../../common/keyword.entry/keyword.entry'
import { ChoosePhotoSourcePage } from '../../common/choose-photo-source/choose-photo-source'

import { OfferModelService } from '../../../app/_services/offer-model.service'
import { UserService } from '../../../app/_services/user.service';
import { AlertService } from '../../../app/_services/alert.service';
import { LoadingService } from '../../../app/_services/loading.service';
import { PictureService } from '../../../app/_services/picture.service';
import { RequestsService } from '../../../app/_services/requests.service';
import { EventSubscriberService } from '../../../app/_services/event-subscriber.service';

import { Constants } from '../../../_constants/constants';
import { environment } from '../../../_environments/environment';

@Component({
  selector: 'page-offer-edit',
  templateUrl: 'offer-edit.page.html'
  ,styleUrls: ['./offer-edit.page.scss']
})

export class OfferEditPage {

	model = {};
	offerId = undefined;
	callback = undefined;
	new = false;
	dirty = false;
	requestMsgs = undefined;
	newKeywords = [];
	
	permitOnlyEditsToPoints = undefined;

	constructor(private _location: Location,
				private _router: Router,
				private _route: ActivatedRoute,
				private _modalCtrl: ModalController,
				private _alertService: AlertService,
				private _loadingService: LoadingService,
				private _offerModelService: OfferModelService,
				private _userService: UserService,
				private _pictureService: PictureService,
				private _requestsService: RequestsService,
				private _eventSubscriberService: EventSubscriberService,
				private _constants: Constants,
				private _file: File,
				private _events: Events) {

	}

	ngOnInit() {
		let self = this;
		self._route.params.subscribe((params) => {

			self.permitOnlyEditsToPoints = false;

			if (params["offerId"] && params["offerId"] !== 'new') {

				self.offerId = params["offerId"];

				console.log("editing existing offer");

				self._offerModelService.get(self.offerId).then((model) => {

					self.setDirty(false);

					self._requestsService.getIncomingRequestsForCurrentUser().then((data: Array<Object>) => {
						let reqsForThisOffer = data.filter((obj) => { return obj["offer"]["id"] === model["id"]; });
						reqsForThisOffer = reqsForThisOffer.filter((obj) => { return obj["deliveringStatusId"] !== this._constants.REQUEST_STATUS_DECLINED_AND_HIDDEN && obj["deliveringStatusId"] !== this._constants.REQUEST_STATUS_DECLINED; })

						if (reqsForThisOffer !== undefined && reqsForThisOffer.length > 0) {
							// this offer has outstanding requests (pending and/or in-progress)
							//  the user can only change the picture, and number of points required

							self.permitOnlyEditsToPoints = true;

							self._alertService.show({
							      header: 'Just FYI',
							      message: "This offer has requests that are pending or in-progress.<br/><br/>You will only be able to edit the picture, and the number of points that it requires.<br/><br/>Edits to points will only apply to future requests.",
							      buttons: [{
							        text: 'OK',
							        handler: () => {

							        }
								}]
							})
						}
					})
				})
			} else {
				console.log("editing new offer");
				this.new = true;
				// self.model = self._offerModelService.getDefaultModel();
			}
		})
	}

	onCancelBtnTap(evt) {
		let self = this;
		if (!this.isDirty()) {
			self._location.back();
		} else { 

			this._eventSubscriberService.subscribe("ios-edit-offer-exit", (data) => {
				data["clearDirtyFunc"]();
				self.clearIOSExitEventSubscriptions();
				self._location.back();
			});

			this._eventSubscriberService.subscribe("ios-edit-offer-save-then-exit", (data) => {
				self.onSaveBtnTap(false);
				data["clearDirtyFunc"]();
				self.clearIOSExitEventSubscriptions();
				self._location.back();
			});

			this._eventSubscriberService.subscribe("ios-confirm-exit-on-edit-offer", (data) => {
				if (data["isSaveBtnEnabled"]) {
				    this._alertService.show({
				      title: 'Save changes?',
				      message: "This offer is ready to go. Do you want to save it?",
				      buttons: [{
				        text: "No, don't save.",
				        role: 'cancel',
				        handler: () => {
				        	self._events.publish("ios-edit-offer-exit", data)
						}
				      }, {
				        text: 'Yes, save it!',
				        handler: () => {
				        	self._events.publish("ios-edit-offer-save-then-exit", data)
				        }
				      }]
				    });
				} else {
				    this._alertService.show({
				      title: 'Save changes?',
				      message: "You'll lose the changes you made. Exit anyway?",
				      buttons: [{
				        text: "No, don't exit!",
				        role: 'cancel',
				        handler: () => {
				        	// do nothing
						}
				      }, {
				        text: 'Yes, lose changes',
				        handler: () => {
				        	self._events.publish("ios-edit-offer-exit", data)
				        }
				      }]
				    });
				}
			})

			this._events.publish("ios-confirm-exit-on-edit-offer", {clearDirtyFunc: () => { this.setDirty(false); }, isSaveBtnEnabled: this.isSaveBtnEnabled()});
			return new Promise((resolve, reject) => {resolve(false);})
		}
	}

	clearIOSExitEventSubscriptions() {
		this._eventSubscriberService.reset("ios-confirm-exit-on-edit-offer");
		this._eventSubscriberService.reset("ios-edit-offer-save-then-exit");
		this._eventSubscriberService.reset("ios-edit-offer-exit");
	}

	isDirty() {
		return this.dirty;
	}

	setDirty(b) {
		this.dirty = b;
	}

	isNewObject() {
		return this._router.url.endsWith("/new");
	}

	handleDescriptionChange(evt) {
		let model = this._offerModelService.get(this.offerId);
		this.setDirty(evt.srcElement.value !== model["description"]);
	}

	handleTitleChange(evt) {
		let model = this._offerModelService.get(this.offerId);
		this.setDirty(evt.srcElement.value !== model["title"]);
	}

	handleQuantityChange(evt) {
		let model = this._offerModelService.get(this.offerId);
		this.setDirty(evt.srcElement.value !== model["quantity"]);
	}

	handleQuantityDescriptionChange(evt) {
		let model = this._offerModelService.get(this.offerId);
		this.setDirty(evt.srcElement.value !== model["quantityDescription"]);
	}

	isModelTitleEditable() {
		return this.permitOnlyEditsToPoints == false;
	}

	isModelQuantityEditable() {
		return this.permitOnlyEditsToPoints == false;
	}

	isModelQuantityDescEditable() {
		return this.permitOnlyEditsToPoints == false;
	}

	isModelDescriptionEditable() {
		return this.permitOnlyEditsToPoints == false;
	}

	offerHasNoKeywords() {
		let model = this._offerModelService.get(this.offerId);
		return model["keywords"] === undefined || model["keywords"].length === 0;
	}

	getOfferOwnerName() {
		let model = this._offerModelService.get(this.offerId);

		return model["directionallyOppositeUser"] !== undefined ? model["directionallyOppositeUser"]["realname"] : "";
	}

	isSaveBtnEnabled() {
		let model = this._offerModelService.get(this.offerId);

		return this.isDirty() && 
			(model["requiredPointsQuantity"] !== undefined && model["requiredPointsQuantity"] > 0) &&
			model["keywords"].length > 0 &&
			model["title"].length > 0 &&
			model["description"].length > 0 &&
			(model["quantity"] !== undefined && model["quantity"] > 0) &&
			model["quantityDescription"].length > 0;
	}

	onSaveBtnTap(shouldCallNavCtrlPop) {
		let self = this;
		let presave_model = this._offerModelService.get(this.offerId);

		self._loadingService.show({
			message: this._offerModelService.isOfferImageChanged(presave_model) ?
					'Please wait... Uploading as fast as your data connection will allow..' :
					'Please wait...'
		})

		// call to save the model, and then the offerModelService will call func(). This order is important, because this may
		//  be a new object, and to save the image associated with it, we need an ID. So save, get an ID, then save the offer image
		//  via the callback.
		
		self._offerModelService.save(presave_model).then(() => {
			let _model = self._offerModelService.get(self.offerId)

			self.setDirty(false);
			self._loadingService.dismiss();

			self._pictureService.reset(self._constants.PHOTO_TYPE_PROFILE, _model["id"]);

			if (shouldCallNavCtrlPop)
				self._location.back();

		}).catch((err) => {
			console.log("Error calling offerModelService::save()")
			console.log(JSON.stringify(err))
		})
	}

	onIndividualKeywordPress(item) {
		return this.onAddKeywordBtnTap(item);
	}

	onAddKeywordBtnTap(evt) {
		let self = this;
		let _model = this._offerModelService.get(this.offerId);
		if (self.permitOnlyEditsToPoints !== true) {
	
			let tmp = _model["keywords"];
			let tmp2 = [];
			tmp.map((obj) => { 
				if (!tmp2.some((obj2) => { return obj2["text"].toLowerCase() === obj["text"].toLowerCase(); }))
					tmp2.push(obj);
			});

			self.presentModal(KeywordEntryPage, tmp2, {
				propsObj: {
					
				},
				callbackFunc: 
					(data) => {
						if (data) {
							_model["keywords"] = data;
							_model["keywords"].sort((a, b) => { let aText = a.text.toLowerCase(); let bText = b.text.toLowerCase(); if (aText > bText) return 1; else if (aText < bText) return -1; else return 0; })
						}
					}
			})
		};
	}

	onNewRuleBtnTap(evt) {
		let self = this;
		let _model = this._offerModelService.get(this.offerId);

		self.presentModal(RulePage, _model, {
			propsObj: {
				permitOnlyEditsToPoints: this.permitOnlyEditsToPoints
			},
			callbackFunc: 
				(data) => {
					if (data) {
						_model["requiredPointsQuantity"] = data["requiredPointsQuantity"];
						_model["requiredUserRecommendations"] = data["requiredUserRecommendations"];

						this.setDirty(true);
					}
				}
		});
	}

	async presentModal(_component, _model, props) {
		let self = this;
		let modal = undefined;
		let options = { 
			component: _component, 
			componentProps: {
				model: _model, 
				props: props.propsObj,  
				callbackFunc: (data) => { 
					props.callbackFunc(data); modal.dismiss(); 
				}
			}
		};

		modal = await this._modalCtrl.create(options)

		console.log("about to call modal.present()")
		return await modal.present();
	}

	getRequiredUserRecommendations() {
		let model = this._offerModelService.get(this.offerId);
		if (model["requiredUserRecommendations"] !== undefined && !model["requiredUserRecommendations"].some((rec) => { return rec["userObj"] === undefined; })) {
			return model["requiredUserRecommendations"];
		} else {
			return [];
		}
	}

	getRequiredPointsQuantity() {
		let model = this._offerModelService.get(this.offerId);
		return model["requiredPointsQuantity"];
	}

	getRequiredPointsQuantityString() {
		let model = this._offerModelService.get(this.offerId);
		let rtn = model["requiredPointsQuantity"] + " point";

		if (model["requiredPointsQuantity"] > 1)
			rtn += "s";

		return rtn;
	}

	areRecommendationsRequired(offer) {
		let model = this._offerModelService.get(this.offerId);
		return (model["requiredUserRecommendations"] && model["requiredUserRecommendations"].length > 0);
	}

	getThumbnailImage() {
		let photoType = "offer";
		let objId = this.offerId;
		return environment.apiUrl + "/api/resource/" + photoType + "/" + objId
	}

	getAvatarCSSClassString() {
		return this._pictureService.getOrientationCSS(this._offerModelService.get(this.offerId), "editOfferImage");
	}

	onThumbnailClick($event) {
		let self = this;
		let _model = this._offerModelService.get(this.offerId);

		console.log("CLICK1!!!!")

		self.presentModal(ChoosePhotoSourcePage, { },
			{
				propsObj: {
					// TODO: are these used? ??
					fileURI: _model["imageFileURI"], 
					fileSource: _model["imageFileSource"]
					},
				callbackFunc: (uriAndSource) => {

					if (uriAndSource === undefined) {
						uriAndSource = {};
					}

					if (uriAndSource !== undefined) {
						if (_model["imageFileURI"] !== undefined && _model["imageFileSource"] == 'camera') {
							let lastSlash = _model["imageFileURI"].lastIndexOf('/');
							let path = _model["imageFileURI"].substring(0,lastSlash+1);
							let filename = _model["imageFileURI"].substring(lastSlash+1);

							self._file.removeFile(path, filename).then((data) => {
								self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_OFFER, _model["id"], uriAndSource["imageFileURI"]);

								console.log("User saved a new offer image. [" + _model["imageFileURI"] + "] is no longer the image to use, so it has been removed." );
								console.log("setting offer model to [" + uriAndSource["imageFileURI"] + "]");

								_model["imageFileURI"] = uriAndSource["imageFileURI"];
								_model["imageFileSource"] = uriAndSource["imageFileSource"];
								_model["imageOrientation"] = uriAndSource["exif"]["Orientation"];

								self.setDirty(true);						
							})
						} else {
							console.log("no previous image was set on the model, so skipping the 'delete previous image' step...")

							self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_OFFER, _model["id"], uriAndSource["imageFileURI"]);

							_model["imageFileURI"] = uriAndSource["imageFileURI"];
							_model["imageFileSource"] = uriAndSource["imageFileSource"];
							_model["imageOrientation"] = uriAndSource["exif"]["Orientation"];

							self.setDirty(true);
						}

					};
				}
			})
	}

	onThumbnailPress($event) {
		let self = this;
		let _model = this._offerModelService.get(this.offerId);

		this._alertService.show({
			title: 'Delete Photo?',
			message: 'Do you want to DELETE the picture on this offer?',
			buttons: [
				{
					text: 'No', role: 'cancel', handler: () => {
						// do nothing
					},
				}, {
					text: 'Yes', handler: () => {
						let func = () => {
							_model["imageFileURI"] = undefined;
							_model["imageFileSource"] = undefined;

							self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_OFFER, _model["id"], _model["imageFileURI"]);
						}

						console.log('deleting photo ' + _model["id"]);

						self._pictureService.delete(self._constants.PHOTO_TYPE_OFFER, _model["id"]).then(() => { 

							self._offerModelService.get(_model["id"]).then((model) => {
								if (model["imageFileSource"] === 'camera' || model["imageFileSource"] === 'eog') {
									
									console.log("This image came from the camera, or the api.. deleting off the phone now. path=" + model['imageFileURI'] + "]")

									let lastSlash = _model["imageFileURI"].lastIndexOf('/');
									let path = _model["imageFileURI"].substring(0,lastSlash+1);
									let filename = _model["imageFileURI"].substring(lastSlash+1);

									self._file.removeFile(path, filename).then((data) => {
										console.log("Call to pictureService to DELETE photo for "+model['id']+" successful! Image was from camera or the eog api, so it was removed from phone.");

										func();
										
									}).catch(() => {
										console.log("Caught error trying to remove file from phone");

										func();
									});
								} else {
									console.log("Call to pictureService to DELETE photo for "+model['id']+" successful! Image was from phone's gallery, so did not try to remove it.");

									func();								
								}
							})
						}).catch(() => {
							console.log("An error occurred deleting the image from the server. Probably, it didn't exist there. Noting it, in case things look wonky..")

							func();
						});
					},
				}
			]
		});
	}
}

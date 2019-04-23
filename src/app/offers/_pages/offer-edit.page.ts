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
import { ModalService } from '../../../app/_services/modal.service';
import { AlertService } from '../../../app/_services/alert.service';
import { LoadingService } from '../../../app/_services/loading.service';
import { PictureService } from '../../../app/_services/picture.service';
import { RequestsService } from '../../../app/_services/requests.service';
import { EventSubscriberService } from '../../../app/_services/event-subscriber.service';

import { Constants } from '../../../_constants/constants';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-offer-edit',
  templateUrl: 'offer-edit.page.html'
  ,styleUrls: ['./offer-edit.page.scss']
})

export class OfferEditPage {

	model = {};
	callback = undefined;
	new = false;
	dirty = false;
	requestMsgs = undefined;
	newKeywords = [];
	
	permitOnlyEditsToPoints = undefined;

	constructor(private _location: Location,
				private _router: Router,
				private _route: ActivatedRoute,
				private _modalService: ModalService,
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

				console.log("editing existing offer");

				self._offerModelService.get(params['offerId']).then((model) => {
					self.model = model;

					self.setDirty(false);

					self._requestsService.getIncomingRequestsForCurrentUser().then((data: Array<Object>) => {
						let reqsForThisOffer = data.filter((obj) => { return obj["offer"]["id"] === self.model["id"]; });
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
				self.model = self._offerModelService.getDefaultModel();
			}
		})
	}

	ionViewCanLeave() {
		let self = this;
		if (!this.isDirty()) {
			return new Promise((resolve, reject) => {resolve(true);})
		} else { 

			this._eventSubscriberService.subscribe("ios-edit-offer-exit", (data) => {
				data["clearDirtyFunc"]();
				self._location.back();
			});

			this._eventSubscriberService.subscribe("ios-edit-offer-save-then-exit", (data) => {
				self.onSaveBtnTap(false);
				data["clearDirtyFunc"]();
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

	ionViewDidLeave() {
		this._eventSubscriberService.reset("ios-confirm-exit-on-edit-offer");
		this._eventSubscriberService.reset("ios-edit-offer-save-then-exit");
		this._eventSubscriberService.reset("ios-edit-offer-exit");
	}

	setModel(m) {
		this.model = m;
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
		this.setDirty(evt.srcElement.value !== this.model["description"]);
	}

	handleTitleChange(evt) {
		this.setDirty(evt.srcElement.value !== this.model["title"]);
	}

	handleQuantityChange(evt) {
		this.setDirty(evt.srcElement.value !== this.model["quantity"]);
	}

	handleQuantityDescriptionChange(evt) {
		this.setDirty(evt.srcElement.value !== this.model["quantityDescription"]);
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
		return this.model["keywords"] === undefined || this.model["keywords"].length === 0;
	}

	getOfferOwnerName() {
		return this.model["directionallyOppositeUser"] !== undefined ? this.model["directionallyOppositeUser"]["realname"] : "";
	}

	isSaveBtnEnabled() {
		return this.isDirty() && 
			(this.model["requiredPointsQuantity"] !== undefined && this.model["requiredPointsQuantity"] > 0) &&
			this.model["keywords"].length > 0 &&
			this.model["title"].length > 0 &&
			this.model["description"].length > 0 &&
			(this.model["quantity"] !== undefined && this.model["quantity"] > 0) &&
			this.model["quantityDescription"].length > 0;
	}

	onSaveBtnTap(shouldCallNavCtrlPop) {
		let self = this;

		self._loadingService.show({
			message: 'Please wait...'
		})

		let func = (obj) => {
			return new Promise((resolve, reject) => {
				if (self.isImageChanged(self.model)) {
					self._pictureService.save(self._constants.PHOTO_TYPE_OFFER, obj["id"], self.model["imageFileURI"]).then((data) => {
						console.log("offer " + obj["id"] + " picture is saved...");
						resolve();
					})
				} else {
					resolve();
				}
			})
		}

		// call to save the model, and then the offerModelService will call func(). This order is important, because this may
		//  be a new object, and to save the image associated with it, we need an ID. So save, get an ID, then save the offer image
		//  via the callback.
		
		self._offerModelService.save(self.model, func).then((newObj) => {

			self.callback(self.model).then(() => {
				self.setDirty(false);
				self._loadingService.dismiss();

				self._pictureService.reset(self._constants.PHOTO_TYPE_PROFILE, newObj["id"]);

				if (shouldCallNavCtrlPop)
					self._location.back();
			}).catch((err) => {
				console.log("Error calling edit offer callback");
				console.log(JSON.stringify(err));
			})

		}).catch((err) => {
			console.log("Error calling offerModelService::save()")
			console.log(JSON.stringify(err))
		})
	}

	isImageChanged(model) {
		let rtn = this.model["imageFileURI_OriginalValue"] != model["imageFileURI"];
		console.log("edit-offer::isImageChanged() returning " + rtn);
		return rtn;
	}

	onIndividualKeywordPress(item) {
		return this.onAddKeywordBtnTap(item);
	}

	onAddKeywordBtnTap(evt) {
		if (this.permitOnlyEditsToPoints !== true) {
			let self = this;
			this._modalService.show(KeywordEntryPage, { 
				props: {
					keywordArray: self.model["keywords"] 
				}, 
				onDidDismissFunc:
					(data: Array<Object>) => { 
						if (data) {
							self.setDirty(true); 
							self.model["keywords"] = data;
							self.model["keywords"].sort((a, b) => { let aText = a.text.toLowerCase(); let bText = b.text.toLowerCase(); if (aText > bText) return 1; else if (aText < bText) return -1; else return 0; })
						} 
					}
			});
		}
	}

	onNewRuleBtnTap(evt) {
		let self = this;
		self.presentModal(RulePage, self.model, {
			propsObj: {
				requiredPointsQuantity: self.model["requiredPointsQuantity"],
				requiredUserRecommendations: self.model["requiredUserRecommendations"],
				permitOnlyEditsToPoints: this.permitOnlyEditsToPoints
			},
			callbackFunc: 
				(data) => {
					if (data) {
						self.model["requiredPointsQuantity"] = data["requiredPointsQuantity"];
						self.model["requiredUserRecommendations"] = data["requiredUserRecommendations"];
						this.setDirty(true);
					}
				}
		});
	}

	async presentModal(_component, offer, props) {
		let self = this;
		let modal = undefined;
		let options = { 
			component: _component, 
			componentProps: {
				model: offer, 
				props: props.propsObj,  
				callbackFunc: (data) => { 
					props.callbackFunc(data); modal.dismiss(); 
				}
			}
		};

		modal = await this._modalCtrl.create(options)
		return await modal.present();
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}

	getRequiredUserRecommendations() {
		if (this.model["requiredUserRecommendations"] !== undefined && !this.model["requiredUserRecommendations"].some((rec) => { return rec["userObj"] === undefined; })) {
			return this.model["requiredUserRecommendations"];
		} else {
			return [];
		}
	}

	getRequiredPointsQuantity() {
		return this.model["requiredPointsQuantity"];
	}

	getRequiredPointsQuantityString() {
		let rtn = this.model["requiredPointsQuantity"] + " point";

		if (this.model["requiredPointsQuantity"] > 1)
			rtn += "s";

		return rtn;
	}

	areRecommendationsRequired(offer) {
		return (this.model["requiredUserRecommendations"] && this.model["requiredUserRecommendations"].length > 0);
	}

	isThumbnailImageAvailable() {
		return this.model["imageFileURI"] !== undefined;
	}

	getThumbnailImage() {
		if (this.model["imageFileURI"] !== undefined && this.model["imageOrientation"] !== undefined)
			return this.model["imageFileURI"];
		else
			return "assets/img/mushroom.jpg";
	}

	getAvatarCSSClassString() {
		return this._pictureService.getOrientationCSS(this.model, "editOfferImage");
	}

	onThumbnailClick($event) {
		let self = this;
		let model = this.model;
		this._modalService.show(ChoosePhotoSourcePage, {
			props: {
				fileURI: this.model["imageFileURI"], fileSource: this.model["imageFileSource"]
			},
			onDidDismissFunc: 
				(offer) => {
					if (offer) {
						offer.then((uriAndSource) => { 
							if (uriAndSource === undefined) {
								uriAndSource = {};
							}


							if (model["imageFileURI"] !== undefined && model["imageFileSource"] == 'camera') {
								let lastSlash = model["imageFileURI"].lastIndexOf('/');
								let path = model["imageFileURI"].substring(0,lastSlash+1);
								let filename = model["imageFileURI"].substring(lastSlash+1);

								self._file.removeFile(path, filename).then((data) => {
									self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_OFFER, model["id"], uriAndSource["imageFileURI"]);

									console.log("User saved a new offer image. [" + model["imageFileURI"] + "] is no longer the image to use, so it has been removed." );
									console.log("setting offer model to [" + uriAndSource["imageFileURI"] + "]");

									model["imageFileURI"] = uriAndSource["imageFileURI"];
									model["imageFileSource"] = uriAndSource["imageFileSource"];
									model["imageOrientation"] = uriAndSource["exif"]["Orientation"];

									self.setDirty(true);						
								})
							} else {
								console.log("no previous image was set on the model, so skipping the 'delete previous image' step...")

								self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_OFFER, model["id"], uriAndSource["imageFileURI"]);

								model["imageFileURI"] = uriAndSource["imageFileURI"];
								model["imageFileSource"] = uriAndSource["imageFileSource"];
								model["imageOrientation"] = uriAndSource["exif"]["Orientation"];

								self.setDirty(true);
							}

						});
					}
				}
		});
	}

	onThumbnailPress($event) {
		let self = this;

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
							self.model["imageFileURI"] = undefined;
							self.model["imageFileSource"] = undefined;

							self._pictureService.setMostProbablePhotoPath(self._constants.PHOTO_TYPE_OFFER, self.model["id"], self.model["imageFileURI"]);
						}

						console.log('deleting photo ' + self.model["id"]);

						self._pictureService.delete(self._constants.PHOTO_TYPE_OFFER, self.model["id"]).then(() => { 

							self._offerModelService.get(self.model["id"]).then((model) => {
								if (model["imageFileSource"] === 'camera' || model["imageFileSource"] === 'eog') {
									
									console.log("This image came from the camera, or the api.. deleting off the phone now. path=" + model['imageFileURI'] + "]")

									let lastSlash = model["imageFileURI"].lastIndexOf('/');
									let path = model["imageFileURI"].substring(0,lastSlash+1);
									let filename = model["imageFileURI"].substring(lastSlash+1);

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

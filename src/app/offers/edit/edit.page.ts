import { Component } from '@angular/core';
import { Validators, ValidationErrors, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import { ModalController } from '@ionic/angular';

import { File } from '@ionic-native/file/ngx'
import { WebView } from '@ionic-native/ionic-webview/ngx';

import { Events } from '@ionic/angular';

import { RulePage } from './rule/rule.page'
import { KeywordEntryPage } from '../../common/keyword.entry/keyword.entry'
import { ChoosePhotoSourcePage } from '../../common/choose-photo-source/choose-photo-source'

import { ModelService } from '../_services/model.service';
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
  templateUrl: './edit.page.html'
  ,styleUrls: ['./edit.page.scss']
})
export class EditPage {

	offerId = undefined;
	callback = undefined;
	new = false;
	dirty = false;
	requestMsgs = undefined;
	newKeywords = [];
	
	permitOnlyEditsToPoints = undefined;

	offerEditForm: FormGroup;

	constructor(private _location: Location,
				private _router: Router,
				private _route: ActivatedRoute,
				private _modalCtrl: ModalController,
				private _alertService: AlertService,
				private _loadingService: LoadingService,
				private _modelService: ModelService,
				private _offerModelService: OfferModelService,
				private _userService: UserService,
				private _pictureService: PictureService,
				private _requestsService: RequestsService,
				private _eventSubscriberService: EventSubscriberService,
				private _constants: Constants,
				private _file: File,
				private _events: Events,
				private _webview: WebView,
				private _domSanitizer: DomSanitizer,
				private formBuilder: FormBuilder) {
		
		this._pictureService.init();

	}

	ngOnInit() {
		let self = this;

		self.setDirty(false);

		// HACK: For some reason, ngOnInit() is being called twice on this page. Using _modelService allows
		//  us to check if we've been through the init process once, and if so, to not go through it again.
		//
		// See: https://stackoverflow.com/questions/38787795/why-is-ngoninit-called-twice
		//
		// Apparently, there is an error during the build of this page, and that causes Angular to call 
		//  ngOnInit again. I tried checking the template, and the code here in the ngOnInit, and I couldn't see 
		//  what error was happening. So future self, if this hack bothers you, now you know why its there.

		if (self._modelService.getModel() === undefined) {
			self._modelService.setModel({editPageInitBegun: true});

			self._route.params.subscribe((params) => {

				self.permitOnlyEditsToPoints = false;

				self._offerModelService.init();				

				if (params["offerId"] && params["offerId"] !== 'new') {

					self.offerId = params["offerId"] * 1;

					console.log("editing existing offer");

					self._requestsService.getIncomingRequestsForCurrentUser().then((data: Array<Object>) => {
						let reqsForThisOffer = data.filter((obj) => { return obj["offer"]["id"] === self.offerId; });
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
				} else {
					console.log("editing new offer");
					this.new = true;
					self.offerId = -1;
				}
			})

			// NOTE: Angular gives us a warning re: this block of code.. it wants us to use a setting on the form
			//  control object to determine if it should be disabled or not. We should do that at some point. 
			//	this article may help: https://netbasal.com/disabling-form-controls-when-working-with-reactive-forms-in-angular-549dd7b42110
			self.offerEditForm = self.formBuilder.group({
				title: new FormControl(null, { validators: Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z0-9 .-:;,()!?\~\'\$\@\%\&]*')]), updateOn: "blur"}),
				quantity: new FormControl(null, { validators: Validators.compose([Validators.required, Validators.maxLength(5), Validators.pattern('^[0-9]*')]), updateOn: "blur"}),
				units: new FormControl(null, { validators: Validators.compose([Validators.required, Validators.minLength(2), Validators.pattern('[a-zA-Z0-9 \']*')]), updateOn: "blur"}),
				description: new FormControl(null, { validators: Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z0-9 .-:;,()!?\~\'\$\@\%\&]*')]), updateOn: "blur"}),
			});

			self._offerModelService.waitingPromise(self.offerId).then((model) => {
				let oefc = self.offerEditFormControl;

				oefc.title.setValue(model['title']);
				oefc.quantity.setValue(model['quantity']);
				oefc.units.setValue(model['quantityDescription']);
				oefc.description.setValue(model['description']);
			})

		}
	}

	ngOnDestroy() {
		this._modelService.setModel(undefined); // for the next time we come through here... so our hack will work.
		this._pictureService.reset(this._constants.PHOTO_TYPE_OFFER, this.offerId);
		this._offerModelService.reset(this.offerId);
	}

	get offerEditFormControl() {
		return this.offerEditForm.controls;
	}

	ionViewWillEnter() {
		// this._offerModelService.bumpTheThumbnailCounter();
		this.ngOnInit();
	}

	onCancelBtnTap() {
		let self = this;
		if (!this.isDirty()) {
			self._location.back();
		} else { 

			this._eventSubscriberService.subscribe("ios-edit-offer-exit", (data) => {
				data["clearDirtyFunc"]();
				self.clearIOSExitEventSubscriptions();
				self._router.navigate(['/offers']); 
			});

			this._eventSubscriberService.subscribe("ios-edit-offer-save-then-exit", (data) => {
				self.onSaveBtnTap(false);
				data["clearDirtyFunc"]();
				self.clearIOSExitEventSubscriptions();
				self._router.navigate(['/offers']); 
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

	setChangedAttr(key, value) {
		let rtn = false;

		let model = this._offerModelService.get(this.offerId);
		if (model[key] !== value) {
			model[key] = value;

			if (this.offerEditFormControl && this.offerEditFormControl[key]) {
				this.offerEditFormControl[key].setValue(value);
			}

			this.setDirty(true);
			rtn = true;
		}

		return rtn;
	}

	handleDescriptionChange(evt) {
		this.setChangedAttr("description", evt.detail.value);
	}

	handleTitleChange(evt) {
		this.setChangedAttr("title", evt.detail.value);
	}

	handleQuantityChange(evt) {
		this.setChangedAttr("quantity", evt.detail.value*1);
	}

	handleQuantityDescriptionChange(evt) {
		this.setChangedAttr("quantityDescription", evt.detail.value);
	}

	getModelAttr(key) {
		return this._offerModelService.get(this.offerId)[key];
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
		let _model = this._offerModelService.get(this.offerId);
		return _model["keywords"] === undefined || _model["keywords"].length === 0;
	}

	getKeywords() {
		let _model = this._offerModelService.get(this.offerId);
		return _model['keywords'];
	}

	getOfferOwnerName() {
		let _model = this._offerModelService.get(this.offerId);

		return _model["directionallyOppositeUser"] !== undefined ? _model["directionallyOppositeUser"]["realname"] : "";
	}

	isSaveBtnEnabled() {
		let oefc = this.offerEditFormControl;
		let model = this._offerModelService.get(this.offerId);

		let fieldsHaveErrors = false;

		if (!this.permitOnlyEditsToPoints) {
			fieldsHaveErrors = !!oefc.title.errors ||
			!!oefc.quantity.errors || oefc.quantity.value * 1 === 0 ||
			!!oefc.units.errors ||
			!!oefc.description.errors;
		}

		// if (fieldsHaveErrors) {
			//      console.log("**** Fields have errors!")

			//      console.log("oefc.title.errors", oefc.title.errors, oefc.title.value);
			//      console.log("oefc.quantity.errors", oefc.quantity.errors,oefc.quantity.value);
			//      console.log("oefc.units.errors", oefc.units.errors,oefc.units.value);
			//      console.log("oefc.description.errors", oefc.description.errors,oefc.description.value);
			//      console.log(model["requiredPointsQuantity"])
			//      console.log("*********************")
		// }

		return this.isDirty() && !fieldsHaveErrors &&
				model["keywords"].length > 0 &&
				(model["requiredPointsQuantity"] !== undefined && model["requiredPointsQuantity"] > 0);
	}

	onSaveBtnTap(shouldCallNavCtrlPop) {
		let self = this;
		let presave_model = this._offerModelService.get(this.offerId);

		console.log("offer edit, model before save:", presave_model)

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

			self._pictureService.reset(self._constants.PHOTO_TYPE_OFFER, _model["id"]);

			if (shouldCallNavCtrlPop) {
				self._router.navigate(['/offers']); 
			}

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

		// NOTE, Dear Future Self, 
		//
		//  If you ever get the notion that the Rule page should be its own page with a module and route and all
		//  that, please be warned that it will not work, at least not easily. Passing the currently-being-edited
		//  model to the Rule page, and then passing it back with it's updates, causes problems. Its better to 
		//  just pop it up as a modal. You'll never call the rule page directly, outside of this editor, anyway and
		//  yes, it's not as elegant, but it gets the job done.
		//
		//  Signed,
		//	Johnathan 202005030922

		self.presentModal(RulePage, self._offerModelService.get(self.offerId), {
			propsObj: {
				permitOnlyEditsToPoints: self.permitOnlyEditsToPoints
			},
			callbackFunc: 
				(data) => {
					if (data) {
						let _model = self._offerModelService.get(this.offerId);

						_model["requiredPointsQuantity"] = data["requiredPointsQuantity"];
						_model["requiredUserRecommendations"] = data["requiredUserRecommendations"];

						self.setDirty(true);
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

	isFromGallery() {
		return this._offerModelService.get(this.offerId)["imageFileSource"] == 'gallery';
	}

	isDirectFilepathToImageSet() {
		return this._offerModelService.get(this.offerId)["imageFileURI"] !== undefined;
	}

	getAssociatedImage() {
		let rtn = undefined;

		if (this.isDirectFilepathToImageSet()) {
			let unsanitized = this._webview.convertFileSrc(this._offerModelService.get(this.offerId)["imageFileURI"]);
			let sanitized = this._domSanitizer.bypassSecurityTrustResourceUrl(unsanitized);
			
			rtn = sanitized;
		} else {
			rtn = this.getEnvironmentAPIURLForThisOffer();
		}

		return rtn;
	}

	getEnvironmentAPIURLForThisOffer() {
        return this._pictureService.getImmediately(this._constants.PHOTO_TYPE_OFFER, this.offerId);
	}

	getAssociatedImageCSS() {
		return this._pictureService.getOrientationCSS(this._offerModelService.get(this.offerId), " avatar-in-a-list editOfferImage");
	}

	onAssociatedImageClick($event) {
		let self = this;
		let _model = this._offerModelService.get(this.offerId);

		self.presentModal(ChoosePhotoSourcePage, { },
			{
				propsObj: {
					// TODO: are these used? ??
					fileURI: _model["imageFileURI"], 
					fileSource: _model["imageFileSource"]
					},
				callbackFunc: (uriAndSource) => {
					if (uriAndSource !== undefined) {

						let _model = this._offerModelService.get(this.offerId);

						if (_model["imageFileURI"] !== undefined /*&& _model["imageFileSource"] == 'camera'*/) {
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

	onAssociatedImagePress($event) {
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

	offerHasAnAssociatedImage() {
		let model = this._offerModelService.get(this.offerId);
		return model['hasAnAssociatedImage'] === true || this.isDirectFilepathToImageSet();
	}
}

import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { AlertService } 			from '../../../app/_services/alert.service';
import { LoadingService } 			from '../../../app/_services/loading.service'
import { RequestsService } 			from '../../../app/_services/requests.service';
import { OfferModelService } 		from '../../../app/_services/offer-model.service'
import { UserService } 				from '../../../app/_services/user.service'
import { UserPreferencesService } 	from '../../../app/_services/user-preferences.service'

import { OutgoingRequestMadeTutorialPage } from '../../../app/tutorials/tutorial-outgoing-request-made/outgoing-request-made-tutorial.page'

@Component({
  selector: 'page-search-request',
  templateUrl: 'offer-request.page.html',
  styleUrls: ['./offer-request.page.scss']
})
export class OfferRequestPage {

	offerId = undefined;
	message = undefined;

	showTutorialAfterOutgoingRequestMade = undefined;
	
	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
  				private _alertService: AlertService,
  				private _loadingService: LoadingService,
				private _requestsService: RequestsService,
				private _userService: UserService,
				private _offerModelService: OfferModelService,
				private _userPreferencesService: UserPreferencesService,
				private _modalCtrl: ModalController) {

	}

	ngOnInit() {
		let self = this;
		self._route.params.subscribe((params) => {
			self.offerId = params['offerId']
			self.initRequiredUserRecommendationsAsUserObjects();
		})

		self._userPreferencesService.getPreference("showTutorialAfterOutgoingRequestMade", true).then((data) => {
			self.showTutorialAfterOutgoingRequestMade = data["pref"];
		})
	}

	requiredUserRecommendationsAsUserObjects = undefined;
	getRequiredUserRecommendations() {
		if (this.requiredUserRecommendationsAsUserObjects === undefined) {
			this.requiredUserRecommendationsAsUserObjects = null;
			// this.initRequiredUserRecommendationsAsUserObjects();
		}

		return this.requiredUserRecommendationsAsUserObjects;
	}

	initRequiredUserRecommendationsAsUserObjects() {
		let self = this;
		self._offerModelService.get(self.offerId)["requiredUserRecommendations"].map((obj) => {
			self._userService.getUser(obj["requiredRecommendUserId"]).then((user) => {
				if (self.requiredUserRecommendationsAsUserObjects === null) 
					self.requiredUserRecommendationsAsUserObjects = [];

				self.requiredUserRecommendationsAsUserObjects.push(user);
			})
		})
	}

	getTitle() {
		let self = this;
		return self._offerModelService.get(self.offerId)['title'];
	}

	getRequiredPointsQuantityString() {
		let self = this;
		let rtn = self._offerModelService.get(self.offerId)['requiredPointsQuantity']

		if (rtn*1 > 1)
			rtn = rtn + " points";
		else
			rtn = rtn + " point";

		return rtn;
	}

	isSaveBtnEnabled() {
		return true;
	}

	onSaveBtnTap(evt) {
		let self = this;

		self._loadingService.show({message: "Please wait..."});





/**
		WILO.. The COntinue button on the tutorial is covered by the little circles at the bottome of the tutorial. Also, clicking the Go Back button leaves you in a state where you can press Save again. It should either not allow it, or act as if the user pressed Continue.

		Also, for
*/







		self._requestsService.saveNew(self._offerModelService.get(self.offerId), this.message).then((data) => {
			console.log("ATTEMPT TO CREATE A NEW REEQUEST JUST RETURNED!");
			console.log(data);
			if (data !== undefined) {
				if (self.showTutorialAfterOutgoingRequestMade) {
					console.log("show tutorial was true!")
					self._loadingService.dismiss();
					self.presentModal(OutgoingRequestMadeTutorialPage, { }, { 
						callbackFunc: (data) => {
							console.log("33333333333")
							self._location.back();
						}});
				} else {
					console.log("222222222222222222");
					self._loadingService.dismiss();
					self._location.back();
				}
			} else {
				console.log("1111111111111111");
				self._loadingService.dismiss();
				self._location.back();
			}
		}).catch((err) => {

			self._loadingService.dismiss();

            self._alertService.show({
              header: 'Aargh...',
              message: "We got an error trying to save that request :!",
              buttons: [{
                text: 'Grr.',
                handler: () => {
                  self._location.back();
                }
              }]
            })
		});
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}

	getMessageValue() {
		return this.message;
	}

	onMessageChange(evt) {
		this.message = evt.srcElement.value;
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

}

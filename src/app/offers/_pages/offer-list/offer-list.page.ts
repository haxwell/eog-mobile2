import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { PictureService } from '../../../../app/_services/picture.service'

import { Constants } from '../../../../_constants/constants'

import { OfferEditPage } from '../offer-edit.page'
import { OfferPage } from '../offer.page'

import { OfferCollectionService } from '../../../../app/_services/offer-collection.service'

@Component({
  selector: 'offer-list',
  templateUrl: './offer-list.page.html',
  styleUrls: ['./offer-list.page.scss']
})

/**
 *
 * Displays a list of offers owned by the current user.
 *  
 */
export class OfferListPage {

	model = {};
	dirty = undefined;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
				private _offerCollectionService : OfferCollectionService,
				private _pictureService : PictureService,
				private _events: Events
	) {
		this.setDirty(true);

		let func = () => {
			this.setDirty(true);
			this.ngOnInit()
		}

		this._events.subscribe('offer:saved', func);
		this._events.subscribe('offer:deleted', func);
	}

	ngOnInit() {
		if (this.isDirty()) {
			this.setDirty(false);
			this._offerCollectionService.resetModel();
			this.model = this._offerCollectionService.getModel();
		}
	}

	ionViewWillEnter() {
		this.ngOnInit();
	}

	isDirty() {
		return this.dirty;
	}

	setDirty(b) {
		this.dirty = b;
	}

	OfferCallback = (_params) => {
		return new Promise((resolve, reject) => {
			this.setDirty(_params === true);
			resolve();
		});
	}

	getOffers() {
		return this.model["offers"];
	}

	onNewOfferBtnTap() {
		this._router.navigate(['/offers/new'])
	}

	onOfferBtnTap(item) { 
		this._router.navigate(['/offers/' + item["id"]])
	}

	userHasAnActiveOffer() {
		return this.model["offers"] !== undefined && this.model["offers"].length > 0;
	}

	getPointRecommendationCountPhrase(offer) {
		let str = offer.requiredPointsQuantity + " point";

		if (offer.requiredPointsQuantity > 1)
			str += "s";

		if (offer.requiredUserRecommendations.length > 0) {
			str += ", ";
			str += offer.requiredUserRecommendations.length;
			str += " recommendation";

			if (offer.requiredUserRecommendations.length > 1)
				str += "s";
		}

		return str;
	}

	getThumbnailImage(offer) {
		if (offer["imageFileURI"] !== undefined && offer["imageOrientation"] !== undefined)
			return offer["imageFileURI"];
		else
			return "assets/img/mushroom.jpg";
	}

	getAvatarCSSClassString(offer) {
        return this._pictureService.getOrientationCSS(offer);
	}
}
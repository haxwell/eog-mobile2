import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { PictureService } from '../../../app/_services/picture.service'

import { Constants } from '../../../_constants/constants'

import { OfferCollectionService } from '../../../app/_services/offer-collection.service'

import { environment } from '../../../_environments/environment';

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'offer-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss']
})

/**
 *
 * Displays a list of offers owned by the current user.
 *  
 */
export class ListPage {

	model = {};
	dirty = undefined;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
				private _offerCollectionService : OfferCollectionService,
				private _pictureService : PictureService,
				private _events: Events,
				private _constants: Constants
                ,private _webview: WebView
                ,private _domSanitizer: DomSanitizer
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
        let rtn = undefined;
        let path = this._pictureService.getImmediately(this._constants.PHOTO_TYPE_OFFER, offer['id']);

        if (path && path['path']) {
            let unsanitized = this._webview.convertFileSrc(path['path']);
            let sanitized = this._domSanitizer.bypassSecurityTrustResourceUrl(unsanitized);
            rtn = sanitized;
        }

        return rtn;
	}

	// count = 0;
	getAvatarCSSClassString(offer) {
        let rtn = this._pictureService.getOrientationCSS(offer);

		// if (++this.count % 10 === 0) {
		// 	this.count = 0
		// 	console.log("***** getAvatarCSSCLassString returning " + rtn);
		// 	console.log(offer["imageOrientation"]);
		// }

		return rtn;
	}
}

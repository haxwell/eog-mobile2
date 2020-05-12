import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { ModalController } from '@ionic/angular';

import { LoadingService } from '../../../../app/_services/loading.service'
import { RequestsService } from '../../../../app/_services/requests.service'
import { PictureService } from '../../../../app/_services/picture.service'

import { ModelService } from '../_services/model.service';

import { Constants } from '../../../../_constants/constants'
import { environment } from '../../../../_environments/environment';

@Component({
  selector: 'requests-outgoing-view',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss']
})

export class ListPage { // List of Outgoing Offer Requests

	model = undefined;
	loading = undefined;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
				private _loadingService: LoadingService,
				private _modalCtrl: ModalController,
				private _modelService: ModelService,
				private _requestsService: RequestsService,
				private _pictureService: PictureService,
				private _constants: Constants,
				private _events: Events) { 

		this._events.subscribe('request:saved', () => { this.ngOnInit() });
		this._events.subscribe('request:accepted', () => { this.ngOnInit() });
		this._events.subscribe('request:completed', () => { this.ngOnInit() });
		this._events.subscribe('request:outgoing:cancelled', () => { this.ngOnInit() });
		this._events.subscribe('request:outgoing:completed', () => { this.ngOnInit() });
		this._events.subscribe('request:outgoing:not-complete', () => { this.ngOnInit() });
		this._events.subscribe('request:outgoing:permanently-dismiss', () => { this.ngOnInit() });
		this._events.subscribe('request:declined', () => { this.ngOnInit() });
		this._events.subscribe('request:deleted', () => { this.ngOnInit() });
		this._events.subscribe('request:inamicablyResolved', () => { this.ngOnInit() });
	}


	getTrack(request) {
		if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_PENDING)
			return "pending";
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_DECLINED)
			return "declined";
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_DECLINED_AND_HIDDEN)
			return "declinedAndHidden";
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_ACCEPTED)
			return "accepted";
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_COMPLETED) {
			if ((request["requestingStatusId"] !== this._constants.REQUEST_STATUS_COMPLETED && request["requestingStatusId"] !== this._constants.REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED && request["requestingStatusId"] !== this._constants.REQUEST_STATUS_NOT_COMPLETED))
				return "completedAwaitingApproval";
			else if (request["requestingStatusId"] === this._constants.REQUEST_STATUS_NOT_COMPLETED)
				return "notCompleteAwaitingResolution"
			else
				return "completed";
		}
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_CANCELLED)
			return "cancelled";
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_NOT_COMPLETED)
			return "notCompleted";
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_RESOLVED_BUT_DISPUTED)
			return "resolvedButDisputed";
	}

	getDirection() { return "outgoing"; }

	ngOnInit() {
		var self = this;

		self._loadingService.show({
			message: 'Please wait...'
		}).then(() => {
			self._requestsService.getOutgoingRequestsForCurrentUser().then((data: Array<Object>) => {
					self.model = data;
					self._loadingService.dismiss();
			});
		});
	}

	getOfferPriceInfoString(request) {
		let pointStr = "point";

		if (request.escrowedPointCount > 1)
			pointStr = "points";

		let recStr = "recommendation";

		if (request.offer.requiredUserRecommendations.length > 1) {
			recStr = "recommendations";
		}

		let rtn = request.escrowedPointCount + " " + pointStr;

		if (request.offer.requiredUserRecommendations.length > 0) {
			rtn += " and " + request.offer.requiredUserRecommendations.length + " " + recStr;
		}

		return rtn;
	}

	isRequestModelEmpty() {
		let rtn = this.model === undefined || this.model.length === 0;

		let len = 0;
		if (!rtn) {
			len = this.model.length;
			len -= this.getNumberOfMatchingElements((obj) => { 
					return obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_COMPLETED && obj["requestingStatusId"] === this._constants.REQUEST_STATUS_COMPLETED;
				});
			len -= this.getNumberOfMatchingElements((obj) => { 
					return obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_RESOLVED_BUT_DISPUTED && obj["requestingStatusId"] === this._constants.REQUEST_STATUS_NOT_COMPLETED;
				});
			len -= this.getNumberOfMatchingElements((obj) => { 
					return obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_DECLINED && obj["requestingStatusId"] === this._constants.REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED;
				});
			len -= this.getNumberOfMatchingElements((obj) => { 
					return obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_DECLINED_AND_HIDDEN && obj["requestingStatusId"] === this._constants.REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED;
				});
			len -= this.getNumberOfMatchingElements((obj) => { 
					return obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_CANCELLED && obj["requestingStatusId"] === this._constants.REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED;
				});

			rtn = len <= 0;
		}

		return rtn;
	}

	getNumberOfMatchingElements(func) {
		if (this.model === undefined)
			return 0;

		let count = 0;
		this.model.map((obj) => { if (func(obj)) count++; });

		return count;
	}

	getAcceptedRequests() {
		let self = this;

		if (this.model) {
			let rtn = this.model.filter((obj) => { return obj["deliveringStatusId"] === self._constants.REQUEST_STATUS_ACCEPTED && obj["requestingStatusId"] !== self._constants.REQUEST_STATUS_CANCELLED });
			return rtn.length > 0 ? rtn : undefined			
		}

		return undefined;
	}

	getCancelledRequests() {
		let self = this;

		if (this.model) {
			let rtn = this.model.filter((obj) => { return obj["deliveringStatusId"] === self._constants.REQUEST_STATUS_CANCELLED && obj["requestingStatusId"] !== self._constants.REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED });
			return rtn.length > 0 ? rtn : undefined			
		}

		return undefined;
	}

	getDeclinedRequests() {
		// TODO: Refactor filterModelByDeliveringStatus() to take multiple statuses.

		if (this.model) {
			let rtn = this.model.filter(
				(obj) => { 
					return 	(obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_DECLINED || 
							obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_DECLINED_AND_HIDDEN) &&
							obj["requestingStatusId"] !== this._constants.REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED;
				}
			);
			return ((rtn.length > 0) ? rtn : undefined);
		}
		else
			return undefined;
	}

	getPendingRequests() {
		return this.filterModelByDeliveringStatus(this._constants.REQUEST_STATUS_PENDING);
	}

	getCompletedAwaitingApprovalRequests() {
		let self = this;

		if (this.model) {
			let rtn = this.model.filter((obj) => { return obj["deliveringStatusId"] === self._constants.REQUEST_STATUS_COMPLETED && (obj["requestingStatusId"] !== self._constants.REQUEST_STATUS_COMPLETED && obj["requestingStatusId"] !== self._constants.REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED && obj["requestingStatusId"] !== self._constants.REQUEST_STATUS_NOT_COMPLETED); });
			return rtn.length > 0 ? rtn : undefined			
		}

		return undefined;
	}

	getNotCompleteAwaitingResolution() {
		let self = this;

		if (this.model) {
			let rtn = this.model.filter((obj) => { return obj["deliveringStatusId"] === self._constants.REQUEST_STATUS_COMPLETED && obj["requestingStatusId"] === self._constants.REQUEST_STATUS_NOT_COMPLETED; });
			return rtn.length > 0 ? rtn : undefined			
		}

		return undefined;
	}

	filterModelByDeliveringStatus(status) {
		if (this.model) {
			let rtn = this.model.filter((obj) => { return obj["deliveringStatusId"] === status; });
			return rtn.length > 0 ? rtn : undefined
		}
		else
			return undefined;
	}

	getThumbnailImage(offer) {
		let photoType = "offer";
		let objId = offer["id"];
		return environment.apiUrl + "/api/resource/" + photoType + "/" + objId
	}

	getAvatarCSSClassString(offer) {
		return this._pictureService.getOrientationCSS(offer, " avatar-in-a-list ");
	}

	hasRequestMessage(req) {
		return (req["requestMessage"] !== undefined && req["requestMessage"] !== null && req["requestMessage"].length > 0);
	}

	getRequestMessage(req) {
		return req["requestMessage"];
	}

	onViewContactInfoBtnTap(request) {
		this._router.navigate(['/profile/' + request["directionallyOppositeUser"]["id"]])
	}

	onViewOffer(request) {
		this._router.navigate(['/offers/' + request.offer["id"]]);
	}

	onPermanentlyDismissBtnTap(request) {
		this._modelService.setModel(request);
		this._router.navigate(['/requests/outgoing/permanently-dismiss']);
	}

	onCompleteOutgoingBtnTap(request) {
		this._modelService.setModel(request);
		this._router.navigate(['/requests/outgoing/complete']);
	}

	onNotCompleteBtnTap(request) {
		this._modelService.setModel(request);
		this._router.navigate(['/requests/outgoing/not-complete']);
	}

	onCancelBtnTap(request) {
		this._modelService.setModel(request);
		this._router.navigate(['/requests/outgoing/cancel']);
	}

	onAcknowledgeDeclinedRequestBtnTap(request) {
		let self = this;
		self._requestsService.acknowledgeDeclinedRequest(request).then(() => {
			self.ngOnInit();
		});
	}

	onAcknowledgeCancelledRequestBtnTap(request) {
		let self = this;
		self._requestsService.acknowledgeCancelledRequest(request).then(() => {
			self.ngOnInit();
		});
	}
}
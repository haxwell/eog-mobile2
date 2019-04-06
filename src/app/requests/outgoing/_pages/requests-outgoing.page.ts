import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Events } from '@ionic/angular';

import { ModalService } from '../../../../app/_services/modal.service'
import { LoadingService } from '../../../../app/_services/loading.service'
import { RequestsService } from '../../../../app/_services/requests.service'
import { PictureService } from '../../../../app/_services/picture.service'

import { Constants } from '../../../../_constants/constants'

/* TODO: Move Offers to the Common area. Since it is called from this common component. */
import { OfferPage } from '../../../offers/offer.page'

import { PermanentlyDismissUnresolvedRequestPage } from './permanently-dismiss-unresolved-request.page'
import { NotCompleteOutgoingRequestPage } from './not-complete-request.page'
import { CompleteOutgoingRequestPage } from './complete-request.page'
import { CancelOutgoingRequestPage } from './cancel-request.page'
import { ProfilePage } from '../../../profile/profile.page'

@Component({
  selector: 'requests-outgoing-view',
  templateUrl: 'requests-outgoing.page.html'
})

export class RequestsOutgoingView {

	model = undefined;
	loading = undefined;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
				private _loadingService: LoadingService,
				private _modalService: ModalService,
				private _requestsService: RequestsService,
				private _pictureService: PictureService,
				private _constants: Constants,
				private _events: Events) { 

		this._events.subscribe('request:saved', () => { this.ngOnInit() });
		this._events.subscribe('request:accepted', () => { this.ngOnInit() });
		this._events.subscribe('request:completed', () => { this.ngOnInit() });
		this._events.subscribe('request:outgoing:cancelled', () => { this.ngOnInit() });
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
			content: 'Please wait...'
		});

		self._requestsService.getOutgoingRequestsForCurrentUser().then((data: Array<Object>) => {
				self.model = data;
				self._loadingService.dismiss();
			});
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
		if (offer["imageFileURI"] !== undefined && offer["imageOrientation"] !== undefined)
			return offer["imageFileURI"];
		else
			return "assets/img/mushroom.jpg";
	}

	getAvatarCSSClassString(offer) {
		return this._pictureService.getOrientationCSS(offer);
	}

	hasRequestMessage(req) {
		return (req["requestMessage"] !== undefined && req["requestMessage"] !== null);
	}

	getRequestMessage(req) {
		return req["requestMessage"];
	}

	onViewContactInfoBtnTap(request) {
		this._router.navigate(['/profile/' + request["directionallyOppositeUser"]["id"]])
	}

	onViewOffer(request) {
		this._router.navigate(['/offer/' + request.offer["id"]]);
	}


	onPermanentlyDismissBtnTap(request) {
		let self = this;
		this._modalService.show(PermanentlyDismissUnresolvedRequestPage);
	}

	onCompleteOutgoingBtnTap(request) {
		let self = this;
		this._modalService.show(CompleteOutgoingRequestPage, {request: self.model, onDidDismissFunc: data => { self._events.publish('request:markedApprovedAfterCompletion'); }});
	}

	onNotCompleteBtnTap(request) {
		let self = this;
		this._modalService.show(NotCompleteOutgoingRequestPage);
	}

	onCancelBtnTap(request) {
		let self = this;
		this._modalService.show(CancelOutgoingRequestPage);
	}

	onAcknowledgeDeclinedRequestBtnTap(request) {
		let self = this;
		self._requestsService.acknowledgeDeclinedRequest(request);
	}

	onAcknowledgeCancelledRequestBtnTap(request) {
		let self = this;
		self._requestsService.acknowledgeCancelledRequest(request);
	}
}
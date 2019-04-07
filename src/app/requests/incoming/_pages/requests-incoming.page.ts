import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { ModalService } from '../../../../app/_services/modal.service'
import { LoadingService } from '../../../../app/_services/loading.service'
import { RequestsService } from '../../../../app/_services/requests.service'
import { PictureService } from '../../../../app/_services/picture.service'

import { Constants } from '../../../../_constants/constants'

import { OfferPage } from '../../../offers/offer.page'

import { AcceptRequestPage } from './accept-request.page'
import { DeclineRequestPage } from './decline-request.page'
import { CompleteRequestPage } from './complete-request.page'
import { CancelRequestPage } from './cancel-request.page'

@Component({
  selector: 'requests-incoming-view',
  templateUrl: 'requests-incoming.page.html'
})
export class RequestsIncomingView {

	model = undefined;
	dirty = false;
	theOtherUser = undefined;
	
	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
				private _modalService: ModalService,
				private _loadingService: LoadingService,
				private _requestsService: RequestsService,
				private _pictureService: PictureService,
				private _constants: Constants,
				_events: Events) {
		
		let func = (data) => {
			this.replaceModelElement(data["request"]);
		};

		_events.subscribe('request:received', func);
		_events.subscribe('request:incoming:cancelled', func);
		_events.subscribe('request:notYetAccepted:cancelledByRequestor', func);
		_events.subscribe('request:accepted:cancelledByRequestor', func);
		_events.subscribe('request:completedAndApproved', func);
		_events.subscribe('request:isInDispute', func);
		_events.subscribe('request:inamicablyResolved', func);
		_events.subscribe('request:declined:acknowledged', func);
		_events.subscribe('request:cancelled:acknowledged', func);

		_events.subscribe('offer:deletedByCurrentUser', () => { 
			this.ngOnInit();
		});
	}

	getTrack(request) {
		if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_PENDING)
			return "pending";
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_DECLINED)
			return "declined";
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_ACCEPTED)
			return "accepted";
		else if (request["deliveringStatusId"] === this._constants.REQUEST_STATUS_COMPLETED) {
			if ((request["requestingStatusId"] !== this._constants.REQUEST_STATUS_COMPLETED && request["requestingStatusId"] !== this._constants.REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED && request["requestingStatusId"] !== this._constants.REQUEST_STATUS_NOT_COMPLETED))
				return "completedAwaitingApproval"
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

	getDirection() { return "incoming"; }

	replaceModelElement(request) {
        if (request) {
    		let temp = this.model.filter((obj) => { return obj["id"] !== request["id"]; });
	    	temp.push(request);
            this.model = temp;
        }
	}

	ngOnInit() {
		var self = this;

		self._loadingService.show({
			content: 'Please wait...'
		});

		this._requestsService.getIncomingRequestsForCurrentUser().then((data: Array<Object>) => {
			self.model = data;
			self.dirty = false;
			self._loadingService.dismiss();
		});
	};

	isRequestModelEmpty() {
		let rtn = this.model === undefined || this.model.length === 0;

		let len = 0;
		if (!rtn) {
			len = this.model.length;
			len -= this.getNumberOfMatchingElements((obj) => { 
						return obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_ACCEPTED && obj["requestingStatusId"] === this._constants.REQUEST_STATUS_CANCELLED;
					});
			len -= this.getNumberOfMatchingElements((obj) => { 
						return obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_PENDING && obj["requestingStatusId"] === this._constants.REQUEST_STATUS_CANCELLED;
					});
			len -= this.getNumberOfMatchingElements((obj) => { 
						return obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_CANCELLED;
					});
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
						return obj["deliveringStatusId"] === this._constants.REQUEST_STATUS_DECLINED_AND_HIDDEN;
					});

			rtn = len <= 0;
		}

		return rtn;
	}

	getAcceptedRequests() {
		let self = this;
		let requests = this.filterModelByDeliveringStatus(this._constants.REQUEST_STATUS_ACCEPTED);
		
		if (requests !== undefined) {
			let rtn = requests.filter((obj) => { return obj["requestingStatusId"] !== self._constants.REQUEST_STATUS_CANCELLED; });
			return rtn.length > 0 ? rtn : undefined // there is a refactor to be had here.. this logic is used several times..
		}
		else
			return undefined;
	}

	getDeclinedRequests() {
		let self = this;
		let requests = this.filterModelByDeliveringStatus(this._constants.REQUEST_STATUS_DECLINED);
		
		if (requests !== undefined) {
			let rtn = requests.filter((obj) => { return obj["requestingStatusId"] !== self._constants.REQUEST_STATUS_REQUESTOR_ACKNOWLEDGED; });
			return rtn.length > 0 ? rtn : undefined // there is a refactor to be had here.. this logic is used several times..
		}
		else
			return undefined;
	}

	getPendingRequests() {
		let rtn = this.filterModelByDeliveringStatus(this._constants.REQUEST_STATUS_PENDING); 
		
		if (rtn) {
			rtn = rtn.filter((obj) => { return obj["requestingStatusId"] !== this._constants.REQUEST_STATUS_CANCELLED; });
		}

		if (rtn)
			return rtn.length > 0 ? rtn : undefined
		else
			return undefined;
	}

	getCompletedPendingApprovalRequests() {
		let self = this;

		if (this.model) {
			let rtn = this.model.filter((obj) => { return obj["deliveringStatusId"] === self._constants.REQUEST_STATUS_COMPLETED && obj["requestingStatusId"] !== self._constants.REQUEST_STATUS_COMPLETED && obj["requestingStatusId"] !== self._constants.REQUEST_STATUS_NOT_COMPLETED; });
			return rtn.length > 0 ? rtn : undefined			
		}

		return undefined;
	}

	getDisputedCompletedRequests() {
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

	getNumberOfMatchingElements(func) {
		if (this.model === undefined)
			return 0;

		let count = 0;
		this.model.map((obj) => { if (func(obj)) count++; });

		return count;
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
		return (req["requestMessage"] !== undefined && req["requestMessage"] !== null && req["requestMessage"] !== '');
	}

	getRequestMessage(req) {
		return req["requestMessage"];
	}

	onViewContactInfoBtnTap(request) {
		this._router.navigate(['/profile/' + request["directionallyOppositeUser"]["id"]])
	}

	onViewOffer(request) {
		this._router.navigate(['/offer/' + request.offer["id"]])
	}

	onAcceptBtnTap(request) {
		let self = this;
		this._modalService.show(AcceptRequestPage, {request: request, onDidDismissFunc: (data => { 
			self.replaceModelElement(data)
		})});
	}

	onDeclineBtnTap(request) {
		let self = this;
		this._modalService.show(DeclineRequestPage, {request: request, onDidDismissFunc: (data => { 
			self.replaceModelElement(data)
		})});
	}

	onCancelBtnTap(request) {
		let self = this;
		this._modalService.show(CancelRequestPage, {request: request, onDidDismissFunc: (data => { 
			self.replaceModelElement(data)
		})});
	}

	onCompleteBtnTap(request) {
		let self = this;
		this._modalService.show(CompleteRequestPage, {request: request, onDidDismissFunc: (data => { 
			self.replaceModelElement(data)
		})});
	}

	onHideRequestBtnTap(request) {
		let self = this;
		this._requestsService.hideIncomingAndDeclinedRequest(request).then((data) => {
			self.replaceModelElement(data);
		});
	}
}

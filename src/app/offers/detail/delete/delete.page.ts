import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Events } from '@ionic/angular';

import { OfferModelService } 	from '../../../../app/_services/offer-model.service';
import { RequestsService } 	from '../../../../app/_services/requests.service';
import { RequestMetadataService } 	from '../../../../app/_services/request-metadata.service';

import { Constants } from '../../../../_constants/constants';

@Component({
  selector: 'page-offer-detail-delete',
  templateUrl: './delete.page.html',
  styleUrls: ['./delete.page.scss']
})
export class DeletePage {

	@Input() model: any;
	@Input() props: any;
	@Input() callbackFunc: any;

	offerRequests = undefined;
	offerRequestsInProgress = undefined;
	offerRequestsNotInProgress = undefined;
	offerRequestsCompletedAwaitingConfirmation = undefined;
	isInitialized = false;
	
	constructor(private _router: Router,
				private _offerModelService: OfferModelService,
				private _requestsService: RequestsService,
				private _requestMetadataService: RequestMetadataService,
				private _events: Events,
				private _constants: Constants
				) {

	}

	ngOnInit() {
		let self = this;

		self._requestMetadataService.init();

		// get all the requests
		self._requestsService.getIncomingRequestsForCurrentUser().then((incomingRequests: Array<Object>) => {

			// then, for all that are for this offer
			self.offerRequests = incomingRequests.filter((obj) => {
				return obj["offer"]["id"] === self.model["id"]; 
			});

			// sort them according to whether they are in progress
			self.offerRequests.forEach((request) => {
				self._requestMetadataService.getMetadataValue(request, self._constants.FUNCTION_KEY_REQUEST_IS_IN_PROGRESS).then((bool) => {
					if (bool) {
						if (self.offerRequestsInProgress === undefined)
							self.offerRequestsInProgress = [];

						self.offerRequestsInProgress.push(request);
					}
					else {
						self._requestMetadataService.getMetadataValue(request, self._constants.FUNCTION_KEY_REQUEST_IS_COMPLETED_AWAITING_CONFIRMATION).then((bool2) => {
							if (bool2) {
								if (self.offerRequestsCompletedAwaitingConfirmation === undefined) 
									self.offerRequestsCompletedAwaitingConfirmation = [];

								self.offerRequestsCompletedAwaitingConfirmation.push(request);
							} else {
								if (self.offerRequestsNotInProgress === undefined)
									self.offerRequestsNotInProgress = [];

								self.offerRequestsNotInProgress.push(request);
							}
						})
					}
				})
			});

			self.isInitialized = true;
		});
	}

	getOfferRequestsNotInProgress() {
		return this.offerRequestsNotInProgress;
	}

	getOfferRequestsInProgress() {
		return this.offerRequestsInProgress;
	}

	getOfferRequestsCompletedButNotConfirmed() {
		return this.offerRequestsCompletedAwaitingConfirmation;
	}

	isOfferAttachedToARequestNotInProgress() {
		return this.offerRequestsNotInProgress && this.offerRequestsNotInProgress.length > 0;
	}

	isOfferAttachedToAnInProgressRequest() {
		return this.offerRequestsInProgress && this.offerRequestsInProgress.length > 0;
	}

	isOfferAttachedToACompletedButNotConfirmedRequest() {
		return this.offerRequestsCompletedAwaitingConfirmation && this.offerRequestsCompletedAwaitingConfirmation.length > 0;
	}

	isDeleteBtnEnabled() {
		return this.isInitialized 
			&& !this.isOfferAttachedToAnInProgressRequest() 
			&& !this.isOfferAttachedToACompletedButNotConfirmedRequest();
	}

	onDeleteBtnTap(evt) {
		let self = this;
		self._offerModelService.delete(self.model).then(() => {
			self._events.publish('offer:deletedByCurrentUser', self.model);
			
			self.callbackFunc(true);
		})
	}

	onCancelBtnTap(evt) {
		this.callbackFunc(undefined);
	}
}

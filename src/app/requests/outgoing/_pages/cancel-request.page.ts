import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-requests-outgoing-cancel',
  templateUrl: 'cancel-request.page.html'
})

export class CancelOutgoingRequestPage {

	REQUEST_STATUS_ACCEPTED = 3;

	confirmationString = '';
	model = undefined;
	
	constructor(private _location: Location,
				private _route: ActivatedRoute,
				private _router: Router,
				private _requestsService: RequestsService,
				private _events : Events) {

	}

	ngOnInit() {
		let self = this;
		self._route.paramMap.pipe(
			switchMap((params) => {
				let requestId = params.get('requestId')
				self.model = self._requestsService.getById(requestId);

				return requestId;
			})
		)
	}

	isSaveBtnEnabled() {
		return !this.isRequestAccepted() || (this.isRequestAccepted() && this.confirmationString.toLowerCase() === 'cancel');
	}

	isRequestAccepted() {
		return this.model.deliveringStatusId === this.REQUEST_STATUS_ACCEPTED;
	}

	onSaveBtnTap(evt) {
		let self = this;
		self._requestsService.cancelOutgoingRequest(this.model).then((data) => {
			
			// in the case of an outgoing request being cancelled, if it is not accepted by the delivering side, 
			//  then no object is returned from the server, so data == undefined

			let rtnObj = self.isRequestAccepted() ? data : self.model;

			self._events.publish("request:outgoing:cancelled", {request: rtnObj});
			this._location.back();
		})
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}
}

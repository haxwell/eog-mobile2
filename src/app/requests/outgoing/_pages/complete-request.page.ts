import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { RequestsService } 	from '../../../../app/_services/requests.service';

import { Constants } from '../../../../_constants/constants';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-requests-outgoing-complete',
  templateUrl: 'complete-request.page.html'
})

export class CompleteOutgoingRequestPage {

	model = undefined;
	
	constructor(private _location: Location,
				private _route: ActivatedRoute,
				private _router: Router,
				private _requestsService: RequestsService,
				private _constants: Constants) {

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

	isRequestInDispute() {
		return this.model["deliveringStatusId"] === this._constants.REQUEST_STATUS_COMPLETED && 
				this.model["requestingStatusId"] === this._constants.REQUEST_STATUS_NOT_COMPLETED;
	}

	onSaveBtnTap(evt) {
		this._requestsService.completeOutgoingRequest(this.model).then((obj) => {
			this._location.back();
		})
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}
}

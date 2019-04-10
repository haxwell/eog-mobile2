import { Component, Input } from '@angular/core';

import { RequestsService } 	from '../../../../app/_services/requests.service';

import { Constants } from '../../../../_constants/constants';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-requests-outgoing-complete',
  templateUrl: 'complete-request.page.html'
})

export class CompleteOutgoingRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;

	constructor(private _requestsService: RequestsService,
				private _constants: Constants) {

	}

	ngOnInit() {

	}

	isRequestInDispute() {
		return this.model["deliveringStatusId"] === this._constants.REQUEST_STATUS_COMPLETED && 
				this.model["requestingStatusId"] === this._constants.REQUEST_STATUS_NOT_COMPLETED;
	}

	onSaveBtnTap(evt) {
		let self = this;
		this._requestsService.completeOutgoingRequest(this.model).then((obj) => {
			self.thisModal().dismiss();
			self.parentCallbackFunc();
		})
	}

	onCancelBtnTap(evt) {
		this.thisModal().dismiss();
	}
}

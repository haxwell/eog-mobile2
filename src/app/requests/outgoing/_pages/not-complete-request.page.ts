import { Component, Input } from '@angular/core';

import { RequestsService } 	from '../../../../app/_services/requests.service';

@Component({
  selector: 'page-requests-outgoing-not-complete',
  templateUrl: 'not-complete-request.page.html'
})

export class NotCompleteOutgoingRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;
	
	confirmationString = undefined;

	constructor(private _requestsService: RequestsService) {

	}

	ngOnInit() {

	}

	isSaveBtnEnabled() {
		return this.confirmationString && this.confirmationString.toLowerCase() === 'incomplete';
	}

	onSaveBtnTap(evt) {
		let self = this;
		if (this.isSaveBtnEnabled()) {
			this._requestsService.notCompleteOutgoingRequest(this.model).then((obj) => {
				self.thisModal().dismiss();
				self.parentCallbackFunc();
			});
		}
	}

	onCancelBtnTap(evt) {
		this.thisModal().dismiss();
	}
}

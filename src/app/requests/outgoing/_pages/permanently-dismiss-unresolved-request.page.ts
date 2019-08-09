import { Component, Input } from '@angular/core';

import { RequestsService } 	from '../../../../app/_services/requests.service';

@Component({
  selector: 'page-requests-dismiss-unresolved',
  templateUrl: 'permanently-dismiss-unresolved-request.page.html'
})

export class PermanentlyDismissUnresolvedRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;
	
	confirmationString = undefined;

	constructor(private _requestsService: RequestsService) {

	}

	ngOnInit() {

	}

	onSaveBtnTap(evt) {
		let self = this
		this._requestsService.notCompleteOutgoingRequest(this.model).then((obj) => {
				self.thisModal().dismiss();
				self.parentCallbackFunc();
		});
	}

	onCancelBtnTap(evt) {
		this.thisModal().dismiss();
	}
}

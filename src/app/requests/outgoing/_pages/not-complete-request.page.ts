import { Component, Input } from '@angular/core';

import { RequestsService } 	from '../../../../app/_services/requests.service';

@Component({
  selector: 'page-requests-outgoing-not-complete',
  templateUrl: 'not-complete-request.page.html'
  ,styleUrls: ['./not-complete-request.page.scss']  
})

export class NotCompleteOutgoingRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;
	
	incompleteBtnTapCount = 0;

	constructor(private _requestsService: RequestsService) {

	}

	ngOnInit() {

	}

	isSaveBtnEnabled() {
		return this.incompleteBtnTapCount >= 7;
	}

	onIncompleteBtnTap(evt) {
		this.incompleteBtnTapCount++;
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

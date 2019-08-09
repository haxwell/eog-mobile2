import { Component, Input } from '@angular/core';

import { Events } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';

@Component({
  selector: 'page-requests-outgoing-cancel',
  templateUrl: 'cancel-request.page.html'
})
export class CancelOutgoingRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;

	REQUEST_STATUS_ACCEPTED = 3;

	confirmationString = '';
	
	constructor(private _requestsService: RequestsService,
				private _events : Events) {

	}

	ngOnInit() {

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

			self.thisModal().dismiss();
			self.parentCallbackFunc();
		})
	}

	onCancelBtnTap(evt) {
		this.thisModal().dismiss();
	}
}

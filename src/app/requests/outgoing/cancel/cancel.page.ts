import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Events } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { ModelService } from '../_services/model.service';

@Component({
  selector: 'page-requests-outgoing-cancel',
  templateUrl: './cancel.page.html'
  ,styleUrls: ['./cancel.page.scss']
})
export class CancelPage {

	model = undefined;

	REQUEST_STATUS_ACCEPTED = 3;

	doneBtnTapCount = 0;

	constructor(private _router: Router,
				private _modelService: ModelService,
				private _requestsService: RequestsService,
				private _events : Events) {

	}

	ngOnInit() {
		this.model = this._modelService.getModel();
	}

	isSaveBtnEnabled() {
		return !this.isRequestAccepted() || (this.isRequestAccepted() && this.doneBtnTapCount >=7);
	}

	onDoneBtnTap(evt) {
		this.doneBtnTapCount++;
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

			this._router.navigate(['/requests/outgoing'])
		})
	}

	onCancelBtnTap(evt) {
		this._router.navigate(['/requests/outgoing'])
	}
}

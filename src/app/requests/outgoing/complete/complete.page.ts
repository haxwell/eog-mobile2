import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Events } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { ModelService } from '../_services/model.service';

import { Constants } from '../../../../_constants/constants';

@Component({
  selector: 'page-requests-outgoing-complete',
  templateUrl: './complete.page.html'
})

export class CompletePage {

	model = undefined;

	constructor(private _router: Router,
				private _modelService: ModelService,
				private _requestsService: RequestsService,
				private _events: Events,
				private _constants: Constants) {

	}

	ngOnInit() {
		this.model = this._modelService.getModel();
	}

	isRequestInDispute() {
		return this.model["deliveringStatusId"] === this._constants.REQUEST_STATUS_COMPLETED && 
				this.model["requestingStatusId"] === this._constants.REQUEST_STATUS_NOT_COMPLETED;
	}

	onSaveBtnTap(evt) {
		let self = this;
		this._requestsService.completeOutgoingRequest(this.model).then((obj) => {
			self._events.publish('request:outgoing:completed', {request: obj});
			self._router.navigate(['/requests/outgoing'])
		})
	}

	onCancelBtnTap(evt) {
		this._router.navigate(['/requests/outgoing'])
	}
}

import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Events } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { ModelService } from '../_services/model.service';

@Component({
  selector: 'page-requests-dismiss-unresolved',
  templateUrl: 'permanently-dismiss.page.html'
})

export class PermanentlyDismissPage {

	constructor(private _router: Router,
				private _modelService: ModelService,
				private _requestsService: RequestsService,
				private _events: Events) {

	}

	get model() {
		return this._modelService.getModel();
	}

	onSaveBtnTap(evt) {
		let self = this
		this._requestsService.notCompleteOutgoingRequest(this.model).then((obj) => {
			self._events.publish('request:outgoing:permanently-dismiss', {request: obj});
			self._router.navigate(['/requests/outgoing'])
		});
	}

	onCancelBtnTap(evt) {
		this._router.navigate(['/requests/outgoing'])
	}
}

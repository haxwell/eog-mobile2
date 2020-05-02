import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Events } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { ModelService } from '../_services/model.service';

@Component({
  selector: 'page-requests-outgoing-not-complete',
  templateUrl: './not-complete.page.html'
  ,styleUrls: ['./not-complete.page.scss']  
})

export class NotCompletePage {

	model = undefined;
	
	incompleteBtnTapCount = 0;

	constructor(private _router: Router,
				private _modelService: ModelService,
				private _requestsService: RequestsService,
				private _events: Events) {

	}

	ngOnInit() {
		this.model = this._modelService.getModel();
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
				self._events.publish('request:outgoing:not-complete', {request: obj});
				self._router.navigate(['/requests/outgoing'])
			});
		}
	}

	onCancelBtnTap(evt) {
		this._router.navigate(['/requests/outgoing'])
	}
}

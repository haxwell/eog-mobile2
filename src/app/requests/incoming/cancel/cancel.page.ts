import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { ModelService } from '../_services/model.service';

@Component({
  selector: 'page-requests-incoming-cancel',
  templateUrl: 'cancel.page.html'
  ,styleUrls: ['./cancel.page.scss']
})

export class CancelPage {

	doneBtnTapCount = 0;
	
	constructor(private _router: Router,
				private _modalCtrl: ModalController,
				private _modelService: ModelService,
				private _requestsService: RequestsService) {

	}

	get model() {
		return this._modelService.getModel();
	}

	isSaveBtnEnabled() {
		return this.doneBtnTapCount >= 7;
	}

	onDoneBtnTap(evt) {
		this.doneBtnTapCount++;
	}

	onSaveBtnTap(evt) {
		let self = this;
		if (self.isSaveBtnEnabled()) {
			self._requestsService.cancelIncomingRequest(self.model).then((obj) => {
				self._router.navigate(['/requests/incoming'])
			})
		}
	}

	onCancelBtnTap(evt) {
		this._router.navigate(['/requests/incoming'])
	}
}

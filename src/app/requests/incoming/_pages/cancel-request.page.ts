import { Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-requests-incoming-cancel',
  templateUrl: 'cancel-request.page.html'
})

export class CancelRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;

	confirmationString = '';
	
	constructor(private _modalCtrl: ModalController,
				private _requestsService: RequestsService) {

	}

	ngOnInit() {

	}

	isSaveBtnEnabled() {
		return this.confirmationString.toLowerCase() === 'cancel';
	}

	onSaveBtnTap(evt) {
		let self = this;
		if (self.isSaveBtnEnabled()) {
			self._requestsService.cancelIncomingRequest(self.model).then((obj) => {
				self.thisModal().dismiss();
				self.parentCallbackFunc();
			})
		}
	}

	onCancelBtnTap(evt) {
		this.thisModal().dismiss();
	}
}

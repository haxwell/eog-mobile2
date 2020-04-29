import { Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';

@Component({
  selector: 'page-requests-incoming-cancel',
  templateUrl: 'cancel-request.page.html'
  ,styleUrls: ['./cancel-request.page.scss']
})

export class CancelRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;

	doneBtnTapCount = 0;
	
	constructor(private _modalCtrl: ModalController,
				private _requestsService: RequestsService) {

	}

	ngOnInit() {

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
				self.thisModal().dismiss();
				self.parentCallbackFunc();
			})
		}
	}

	onCancelBtnTap(evt) {
		this.thisModal().dismiss();
	}
}

import { Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { ApiService } 	from '../../../../app/_services/api.service';
import { environment } from '../../../../_environments/environment';

import { Constants } from '../../../../_constants/constants';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-requests-incoming-complete',
  templateUrl: 'complete-request.page.html'
  ,styleUrls: ['./complete-request.page.scss']
})

export class CompleteRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;

	confirmationString = '';
	requestAgainDelayCodes = undefined;
	selectedRequestAgainDelayId = undefined;
	
	constructor(private _modalCtrl: ModalController,
				private _requestsService: RequestsService,
				private _apiService: ApiService,
				private _constants : Constants) {

	}

	ngOnInit() {
		let self = this;

		let url = environment.apiUrl + "/api/requestAgainDelayCodes";
		this._apiService.get(url).subscribe((data) => {
			self.requestAgainDelayCodes = data;
			self.selectedRequestAgainDelayId = self.requestAgainDelayCodes.find((obj) => { return obj["milliseconds"] === 1;})["id"];
		}, (err) => {
			console.log("CompleteRequestPage ERROR");
			console.log(JSON.stringify(err));
		});
	}

	isSaveBtnEnabled() {
		return this.confirmationString.toLowerCase() === 'complete';
	}

	isRequestInDispute() {
		return this.model["deliveringStatusId"] === this._constants.REQUEST_STATUS_COMPLETED;
	}

	getSelectedRequestAgainDelayId() {
		return this.selectedRequestAgainDelayId;
	}

	onSaveBtnTap(evt) {
		let self = this;
		if (self.isSaveBtnEnabled()) {
			self.model["requestAgainDelayCode"] = self.getSelectedRequestAgainDelayId(); 
			self._requestsService.completeIncomingRequest(self.model).then((obj) => {
				self.thisModal().dismiss();
				self.parentCallbackFunc();
			});
		}
	}

	onCancelBtnTap(evt) {
		this.thisModal().dismiss();
	}
}

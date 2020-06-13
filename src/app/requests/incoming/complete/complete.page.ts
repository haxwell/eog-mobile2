import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { ModelService } from '../_services/model.service';
import { RequestsService } 	from '../../../../app/_services/requests.service';
import { ApiService } 	from '../../../../app/_services/api.service';
import { environment } from '../../../../_environments/environment';

import { Constants } from '../../../../_constants/constants';

@Component({
  selector: 'page-requests-incoming-complete',
  templateUrl: './complete.page.html'
  ,styleUrls: ['./complete.page.scss']
})

export class CompletePage {

	requestAgainDelayCodes = undefined;
	selectedRequestAgainDelayId = undefined;

	doneBtnTapCount = 0;
	
	constructor(private _router: Router,
				private _modelService: ModelService,
				private _modalCtrl: ModalController,
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

	get model() {
		return this._modelService.getModel();
	}

	isSaveBtnEnabled() {
		return this.doneBtnTapCount >= 7;
	}

	isRequestInDispute() {
		return this.model["deliveringStatusId"] === this._constants.REQUEST_STATUS_COMPLETED;
	}

	getSelectedRequestAgainDelayId() {
		return this.selectedRequestAgainDelayId;
	}

	onDoneBtnTap(evt) {
		this.doneBtnTapCount++;
	}

	onSaveBtnTap(evt) {
		let self = this;
		if (self.isSaveBtnEnabled()) {
			self.model["requestAgainDelayCode"] = self.getSelectedRequestAgainDelayId(); 
			self._requestsService.completeIncomingRequest(self.model).then((obj) => {
				this._router.navigate(['/requests/incoming'])
			});
		}
	}

	onCancelBtnTap(evt) {
		this._router.navigate(['/requests/incoming'])
	}
}

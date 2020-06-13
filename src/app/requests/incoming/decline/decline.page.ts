import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { ApiService } 	from '../../../../app/_services/api.service';
import { DeclineReasonCodeService } from '../../../../app/_services/declined-reason-codes.service';

import { ModelService }	from '../_services/model.service';

import { environment } from '../../../../_environments/environment';

@Component({
  selector: 'page-requests-incoming-decline',
  templateUrl: './decline.page.html',
  styleUrls: ['./decline.page.scss']
})
export class DeclinePage {

	declineReasonCodes = undefined;
	selectedDeclineReasonId = undefined;
	requestAgainDelayCodes = undefined;
	selectedRequestAgainDelayId = undefined;

	constructor(private _router: Router, 
				private _modelService: ModelService,
				private _requestsService: RequestsService,
				private _declinedReasonCodeService: DeclineReasonCodeService,
				private _apiService: ApiService) {

	}

	ngOnInit() {
		let self = this;

		let url = environment.apiUrl + "/api/declineReasonCodes";
		self._apiService.get(url).subscribe((data) => {
			self.declineReasonCodes = data;
		}, (err) => {
			console.log("DeclineRequestPage ERROR");
			console.log(JSON.stringify(err));
		});

		url = environment.apiUrl + "/api/requestAgainDelayCodes";
		self._apiService.get(url).subscribe((data) => {
			self.requestAgainDelayCodes = data;
			self.selectedRequestAgainDelayId = self.requestAgainDelayCodes.find((obj) => { return obj["milliseconds"] === 1;})["id"];
		}, (err) => {
			console.log("DeclineRequestPage ERROR");
			console.log(JSON.stringify(err));
		});
	}

	get model() {
		return this._modelService.getModel();
	}

	isSaveBtnAvailable() {
		return this.selectedDeclineReasonId !== undefined && this.selectedRequestAgainDelayId !== undefined;
	}

	onSaveBtnTap(evt) {
		let self = this;
		this.model["declinedReasonCode"] = this.selectedDeclineReasonId;
		this.model["requestAgainDelayCode"] = this.selectedRequestAgainDelayId;
		this._requestsService.declineIncomingRequest(this.model).then((obj) => {
			self._declinedReasonCodeService.getDeclineReasonCodes().then((codes) => {
				let x = codes.filter((code) => { return code["id"] === obj["declinedReasonCode"]});
				obj["declinedReasonCode"] = x[0];

				self._router.navigate(['/requests/incoming'])
			})
		})
	}

	onCancelBtnTap(evt) {
		this._router.navigate(['/requests/incoming'])
	}
}

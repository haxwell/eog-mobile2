import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { ApiService } 	from '../../../../app/_services/api.service';
import { environment } from '../../../../_environments/environment';

import { Constants } from '../../../../_constants/constants';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-requests-incoming-complete',
  templateUrl: 'complete-request.page.html'
})

export class CompleteRequestPage {

	confirmationString = '';
	model = undefined;
	requestAgainDelayCodes = undefined;
	selectedRequestAgainDelayId = undefined;
	
	constructor(private _location: Location,
				private _route: ActivatedRoute,
				private _router: Router,
				private _requestsService: RequestsService,
				private _apiService: ApiService,
				private _constants : Constants) {

	}

	ngOnInit() {
		let self = this;

		self._route.paramMap.pipe(
			switchMap((params) => {
				let requestId = params.get('requestId')
				self.model = self._requestsService.getById(requestId);

				return requestId;
			})
		)

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
		if (this.isSaveBtnEnabled()) {
			this.model["requestAgainDelayCode"] = this.getSelectedRequestAgainDelayId(); 
			this._requestsService.completeIncomingRequest(this.model).then((obj) => {
				this._location.back();
			});
		}
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}
}

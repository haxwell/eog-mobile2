import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { environment } from '../../../../_environments/environment';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { DeclineReasonCodeService } from '../../../../app/_services/declined-reason-codes.service';
import { ApiService } 	from '../../../../app/_services/api.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-requests-incoming-decline',
  templateUrl: 'decline-request.page.html'
})
export class DeclineRequestPage {
	
	model = undefined;
	declineReasonCodes = undefined;
	selectedDeclineReasonId = undefined;
	requestAgainDelayCodes = undefined;
	selectedRequestAgainDelayId = undefined;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
				private _router: Router,
				private _requestsService: RequestsService,
				private _declinedReasonCodeService: DeclineReasonCodeService,
				private _apiService: ApiService) {

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
				//self.viewCtrl.dismiss(obj);

				this._location.back();
			})
		})
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}
}

import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { RequestsService } 	from '../../../../app/_services/requests.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'page-requests-dismiss-unresolved',
  templateUrl: 'permanently-dismiss-unresolved-request.page.html'
})

export class PermanentlyDismissUnresolvedRequestPage {

	confirmationString = undefined;
	model = undefined;
	
	constructor(private _location: Location,
				private _route: ActivatedRoute,
				private _router: Router,
				private _requestsService: RequestsService) {

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
	}

	onSaveBtnTap(evt) {
		this._requestsService.notCompleteOutgoingRequest(this.model).then((obj) => {
			this._location.back();
		});
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}
}

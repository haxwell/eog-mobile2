import { Injectable } from '@angular/core';

import { ApiService } from '../../../../app/_services/api.service';

import { InteractionsModelService } from './interactions-model.service'


@Injectable({
	providedIn: 'root'
})
export class InteractionsService {

	constructor(	private _interactionsModelService: InteractionsModelService) { 

	}

	isFirstInteractionBetween(offeringUserId, requestingUserId) {
		let rtn = true;
		let val = this._interactionsModelService.getInteractionsBetween(offeringUserId, requestingUserId);

		if (val) {
			rtn = val && val.length === 0;
		}

		return rtn;
	}

	getNumberOfPreviousInteractionsBetween(offeringUserId, requestingUserId) {
		let rtn = 0;
		let val = this._interactionsModelService.getInteractionsBetween(offeringUserId, requestingUserId);

		if (val) {
			rtn = val && val.length;
		}

		return rtn;
	}

}

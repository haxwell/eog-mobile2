import { Component } from '@angular/core';

import { NavController, NavParams, ViewController } from 'ionic-angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';

@Component({
  selector: 'page-requests-dismiss-unresolved',
  templateUrl: 'permanently-dismiss-unresolved-request.page.html'
})

export class PermanentlyDismissUnresolvedRequestPage {

	confirmationString = undefined;
	request = undefined;
	
	constructor(public navCtrl: NavController, 
				public params: NavParams,
				private viewCtrl: ViewController, 
				private _requestsService: RequestsService) {
		this.request = params.get('request');
	}

	onSaveBtnTap(evt) {
		this._requestsService.notCompleteOutgoingRequest(this.request).then((obj) => {
			this.viewCtrl.dismiss(obj);
		});
	}

	onCancelBtnTap(evt) {
		this.viewCtrl.dismiss();
	}
}

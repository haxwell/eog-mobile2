import { Component, Input } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { RequestsService } 	from '../../../../app/_services/requests.service';
import { UserPreferencesService } 	from '../../../../app/_services/user-preferences.service';

import { AcceptRequestTutorialPage } from '../../../../app/tutorials/tutorial-accept-request/accept-request.tutorial';

@Component({
  selector: 'page-requests-incoming-accept',
  templateUrl: 'accept-request.page.html'
})
export class AcceptRequestPage {

	@Input() model: any;
	@Input() thisModal: any;
	@Input() parentCallbackFunc: any;

	showTutorialAfterRequestAccepted = true;
	
	constructor(private _modalCtrl: ModalController,
				private _requestsService: RequestsService,
				private _userPreferencesService: UserPreferencesService) {

	}

	ngOnInit() {
		var self = this;
		self._userPreferencesService.getPreference("showTutorialAfterRequestAccepted", true).then((data) => {
			self.showTutorialAfterRequestAccepted = data["pref"];
		})
	}

	onSaveBtnTap(evt) {
		var self = this;
		self._requestsService.acceptIncomingRequest(self.model).then((obj) => {

			if (self.showTutorialAfterRequestAccepted) {
				self.presentAcceptRequestTutorial();
			} else {
				self.thisModal().dismiss();
				self.parentCallbackFunc();
			}
		})
	}

	async presentAcceptRequestTutorial() {
		let self = this;
		let _tutorialModal = undefined;
		let options = { 
			component: AcceptRequestTutorialPage, 
			componentProps: { 
				func: () => {
					_tutorialModal.dismiss();
					self.thisModal().dismiss();
					self.parentCallbackFunc();
				}
			}
		};

		_tutorialModal = await this._modalCtrl.create(options)

		return await _tutorialModal.present();
	}

	onCancelBtnTap(evt) {
		this.thisModal().dismiss();
	}

}

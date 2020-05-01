import { Injectable } from '@angular/core';

import { ModalController } from '@ionic/angular';

import { TutorialNewAccountPage } from '../tutorial-new-account/tutorial-new-account.page';
import { TutorialOutgoingRequestMadePage } from '../tutorial-outgoing-request-made/tutorial-outgoing-request-made.page';
import { TutorialAcceptRequestPage } from '../tutorial-accept-request/tutorial-accept-request.page';
import { TutorialEasyahIntroPage } from '../tutorial-easyah-intro/tutorial-easyah-intro.page';
import { TutorialBasicConceptsPage } from '../tutorial-basic-concepts/tutorial-basic-concepts.page';

@Injectable({
	providedIn: 'root'
})
export class PresentTutorialService {

	constructor(private _modalCtrl: ModalController) {

	}

    async presentTutorial(_component, cb = null) {
        let self = this;
        let _tutorialModal = undefined;
        let options = { 
            component: _component, 
            componentProps: {
                func: () => {
                	if (cb) cb();
                    _tutorialModal.dismiss();
                }
            }
        };

        _tutorialModal = await this._modalCtrl.create(options)

        return await _tutorialModal.present();
    }

    async presentTutorialNewAccount(cb = null) {
    	return this.presentTutorial(TutorialNewAccountPage, cb);
    }

    async presentTutorialOutgoingRequestMade(cb = null) {
    	return this.presentTutorial(TutorialOutgoingRequestMadePage, cb);
    }

    async presentTutorialEasyahIntro(cb = null) {
    	return this.presentTutorial(TutorialEasyahIntroPage, cb);
    }

    async presentTutorialBasicConcepts(cb = null) {
    	return this.presentTutorial(TutorialBasicConceptsPage, cb);
    }

    async presentTutorialAcceptRequest(cb = null) {
    	return this.presentTutorial(TutorialAcceptRequestPage, cb);
    }
}

import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { ModalController } from '@ionic/angular';
import { ModalService } from '../../../app/_services/modal.service';

import { TutorialBasicConceptsPage } from '../../../app/tutorials/tutorial-basic-concepts/tutorial-basic-concepts'
import { TutorialEasyahIntroPage } from '../../../app/tutorials/tutorial-easyah-intro/tutorial-easyah-intro'
import { AcceptRequestTutorialPage } from '../../../app/tutorials/tutorial-accept-request/accept-request.tutorial';
import { OutgoingRequestMadeTutorialPage } from '../../../app/tutorials/tutorial-outgoing-request-made/outgoing-request-made-tutorial.page';

@Component({
    selector: 'page-tutorials-list',
    templateUrl: './tutorials-list.page.html',
    styleUrls: ['./about-easyah.page.scss']
})
export class TutorialsListPage {

    constructor(private _location: Location,
                private _modalService: ModalService,
                private _modalCtrl: ModalController ) {

    }

    ngOnInit() {

    }

    onGoBackBtnTap(event) {
    	this._location.back();
    }

    onOutgoingTutorialBtnTap() {
    	this.presentTutorial(OutgoingRequestMadeTutorialPage);
    }

    onIncomingTutorialBtnTap() {
    	this.presentTutorial(AcceptRequestTutorialPage);
    }

    onBasicConceptsTutorialBtnTap() {
        this.presentTutorial(TutorialBasicConceptsPage);
    }

    onWelcomeTutorialBtnTap() {
        this.presentTutorial(TutorialEasyahIntroPage);
    }

    async presentTutorial(_component) {
        let self = this;
        let _tutorialModal = undefined;
        let options = { 
            component: _component, 
            componentProps: {
                func: () => {
                    _tutorialModal.dismiss();
                }
            }
        };

        _tutorialModal = await this._modalCtrl.create(options)

        return await _tutorialModal.present();
    }
}
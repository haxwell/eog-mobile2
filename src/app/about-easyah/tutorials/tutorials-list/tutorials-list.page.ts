import { Component } from '@angular/core';
import { Router } from '@angular/router';
// import { Location } from '@angular/common';

import { ModalController } from '@ionic/angular';
// import { ModalService } from '../../../../app/_services/modal.service';
import { TutorialService } from '../_services/tutorial.service';

import { TutorialEasyahIntroPage } from '../tutorial-easyah-intro/tutorial-easyah-intro.page'
import { TutorialBasicConceptsPage } from '../tutorial-basic-concepts/tutorial-basic-concepts.page'
import { AcceptRequestTutorialPage } from '../../../../app/tutorials/tutorial-accept-request/accept-request.tutorial';
import { OutgoingRequestMadeTutorialPage } from '../../../../app/tutorials/tutorial-outgoing-request-made/outgoing-request-made-tutorial.page';

@Component({
    selector: 'page-tutorials-list',
    templateUrl: './tutorials-list.page.html',
    styleUrls: ['./tutorials-list.page.scss']
})
export class TutorialsListPage {

    constructor(private _router: Router,
                private _tutorialService: TutorialService,
                private _modalCtrl: ModalController ) {

    }

    ngOnInit() {

    }

    onGoBackBtnTap(event) {
    	this._router.navigate(['/about-easyah']);
    }

    onOutgoingTutorialBtnTap() {
    	this.presentTutorial(OutgoingRequestMadeTutorialPage);
    }

    onIncomingTutorialBtnTap() {
    	this.presentTutorial(AcceptRequestTutorialPage);
    }

    onBasicConceptsTutorialBtnTap() {
        this._tutorialService.presentTutorial(TutorialBasicConceptsPage);
    }

    onWelcomeTutorialBtnTap() {
        this._tutorialService.presentTutorial(TutorialEasyahIntroPage);
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
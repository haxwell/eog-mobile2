import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ModalController } from '@ionic/angular';
import { PresentTutorialService } from '../_services/present-tutorial.service';

import { TutorialEasyahIntroPage } from '../tutorial-easyah-intro/tutorial-easyah-intro.page'
import { TutorialBasicConceptsPage } from '../tutorial-basic-concepts/tutorial-basic-concepts.page'
import { TutorialAcceptRequestPage } from '../tutorial-accept-request/tutorial-accept-request.page'

@Component({
    selector: 'page-tutorials-list',
    templateUrl: './tutorials-list.page.html',
    styleUrls: ['./tutorials-list.page.scss']
})
export class TutorialsListPage {

    constructor(private _router: Router,
                private _presentTutorialService: PresentTutorialService,
                private _modalCtrl: ModalController ) {

    }

    ngOnInit() {

    }

    onGoBackBtnTap(event) {
    	this._router.navigate(['/about-easyah']);
    }

    onOutgoingTutorialBtnTap() {
    	this._presentTutorialService.presentTutorialOutgoingRequestMade();
    }

    onIncomingTutorialBtnTap() {
    	this._presentTutorialService.presentTutorialAcceptRequest();
    }

    onBasicConceptsTutorialBtnTap() {
        this._presentTutorialService.presentTutorialBasicConcepts();
    }

    onWelcomeTutorialBtnTap() {
        this._presentTutorialService.presentTutorialEasyahIntro();
    }

    // async presentTutorial(_component) {
    //     let self = this;
    //     let _tutorialModal = undefined;
    //     let options = { 
    //         component: _component, 
    //         componentProps: {
    //             func: () => {
    //                 _tutorialModal.dismiss();
    //             }
    //         }
    //     };

    //     _tutorialModal = await this._modalCtrl.create(options)

    //     return await _tutorialModal.present();
    // }
}
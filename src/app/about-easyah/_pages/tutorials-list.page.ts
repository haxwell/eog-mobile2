import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { ModalService } from '../../../app/_services/modal.service';

import { TutorialPage } from '../../../app/tutorials/tutorial-basic-concepts/tutorial-basic-concepts'
import { TutorialEasyahIntroPage } from '../../../app/tutorials/tutorial-easyah-intro/tutorial-easyah-intro'
import { AcceptRequestTutorialPage } from '../../../app/requests/incoming/_pages/accept-request.tutorial';
import { OutgoingRequestMadeTutorialPage } from '../../../app/offers/_pages/outgoing-request-made-tutorial.page';

@Component({
    selector: 'page-tutorials-list',
    templateUrl: './tutorials-list.page.html'
})
export class TutorialsListPage {

    constructor(private _location: Location,
                private _modalService: ModalService ) {

    }

    ngOnInit() {

    }

    onGoBackBtnTap(event) {
    	this._location.back();
    }

    onOutgoingTutorialBtnTap() {
    	this._modalService.show(OutgoingRequestMadeTutorialPage, { });
    }

    onIncomingTutorialBtnTap() {
    	this._modalService.show(AcceptRequestTutorialPage, { });
    }

    onBasicConceptsTutorialBtnTap() {
        this._modalService.show(TutorialPage, { });
    }

    onWelcomeTutorialBtnTap() {
        this._modalService.show(TutorialEasyahIntroPage, { });
    }

}
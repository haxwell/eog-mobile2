import { Component } from '@angular/core';

import { ModalService } from '../../app/_services/modal.service'
import { TutorialService } from '../../app/_services/tutorial.service'

import { HomeService } from './_services/home.service'

import { TutorialEasyahIntroPage } from '../tutorials/tutorial-easyah-intro/tutorial-easyah-intro'

@Component({
    selector: 'page-home',
    templateUrl: 'home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage {

    showTutorialPromise = undefined;
    mostRecentlyCreatedOffers = undefined;

    constructor(private _modalService: ModalService 
                ,private _homeService: HomeService
                ,private _tutorialService: TutorialService
    ) {

    }

    ngOnInit() {
        let self = this;
        self.showTutorialPromise = self._tutorialService.getShowTutorialOnLogin();

        self._homeService.getMostRecentlyCreatedOffers().then((data) => {
            self.mostRecentlyCreatedOffers = data;
        });
    }

    ionViewWillEnter() {
        let self = this;
        if (self.showTutorialPromise !== undefined && self._tutorialService.getTutorialEasyahIntroPageHasBeenShown() !== true) {
            self.showTutorialPromise.then((b) => {
                if (b === true) {
                    self._modalService.show(TutorialEasyahIntroPage);
                }
            });
        }
    }

    getMostRecentlyCreatedOffers() {
        return this.mostRecentlyCreatedOffers;
    }

}

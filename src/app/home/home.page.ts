import { Component } from '@angular/core';

import { ModalController } from '@ionic/angular';

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

    constructor(private _modalCtrl: ModalController 
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
                    self.presentTutorial();
                }
            });
        }
    }

    getMostRecentlyCreatedOffers() {
        return this.mostRecentlyCreatedOffers;
    }

    async presentTutorial() {
        let self = this;
        let _tutorialModal = undefined;
        let options = { 
            component: TutorialEasyahIntroPage, 
            componentProps: {
                func: () => {
                    _tutorialModal.dismiss();
                    // self.thisModal().dismiss();
                    // self.parentCallbackFunc();
                }
            }
        };

        _tutorialModal = await this._modalCtrl.create(options)

        return await _tutorialModal.present();
    }
}

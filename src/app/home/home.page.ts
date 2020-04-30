import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { TutorialService } from '../../app/about-easyah/tutorials/_services/tutorial.service'
import { UserService } from '../../app/_services/user.service'
import { ProfileService } from '../../app/_services/profile.service'
import { PictureService } from '../../app/_services/picture.service'

import { HomeService } from './_services/home.service'

import { TutorialEasyahIntroPage } from '../../app/about-easyah/tutorials/tutorial-easyah-intro/tutorial-easyah-intro.page'

@Component({
    selector: 'page-home',
    templateUrl: 'home.page.html',
    styleUrls: ['./home.page.scss']
})
export class HomePage {

    showTutorialPromise = undefined;
    mostRecentlyCreatedOffers = undefined;

    totalPoints = undefined;
    availablePoints = undefined;

    constructor(private _router: Router
                ,private _modalCtrl: ModalController 
                ,private _homeService: HomeService
                ,private _tutorialService: TutorialService
                ,private _userService: UserService
                ,private _profileService: ProfileService                
                ,private _pictureService: PictureService
    ) {

    }

    ngOnInit() {
        let self = this;

        self._profileService.getModel();

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
                    self._tutorialService.presentTutorial(TutorialEasyahIntroPage);
                }
            });
        }
    }

    getThumbnailImage() {
        return this._profileService.getThumbnailImagePath();
    }

    getAvatarCSSClassString() {
        let _model = this._profileService.getModel();
        let rtn = this._pictureService.getOrientationCSS(_model);

        return rtn;
    }

    getUserName() {
        return this._profileService.getModel()["realname"];
    }

    getUserDescription() {
        return this._profileService.getModel()["description"];
    }

    getTotalPoints() {
        let rtn = this._profileService.getModel()["points"] && this._profileService.getModel()["points"]["total"]
        return rtn;
    }

    getAvailablePoints() {
        return this._profileService.getModel()["points"] && this._profileService.getModel()["points"]["available"]
    }

    getAllTimePointsCount() {
        return this._profileService.getModel()["allTimePointCount"]
    }

    getMostRecentlyCreatedOffers() {
        return this.mostRecentlyCreatedOffers;
    }

    onThumbnailImageClick() {
        this._router.navigate(['/profile/' + this._userService.getCurrentUser()["id"]]);
    }

    onCreateOfferBtnClicked() {
        this._router.navigate(['/offers/new'])
    }
}

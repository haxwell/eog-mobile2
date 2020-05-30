import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { TutorialService } from '../../app/about-easyah/tutorials/_services/tutorial.service'

import { PresentTutorialService } from '../../app/about-easyah/tutorials/_services/present-tutorial.service'
import { UserService } from '../../app/_services/user.service'
import { UserGeographyService } from '../../app/_services/user-geography.service'
import { ProfileService } from '../../app/_services/profile.service'
import { PictureService } from '../../app/_services/picture.service'

import { HomeService } from './_services/home.service'

import { Constants } from '../../_constants/constants'

import { WebView } from '@ionic-native/ionic-webview/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
                ,private _presentTutorialService: PresentTutorialService
                ,private _userService: UserService
                ,private _userGeographyService: UserGeographyService
                ,private _profileService: ProfileService                
                ,private _pictureService: PictureService
                ,private _constants: Constants
                ,private _webview: WebView
                ,private _domSanitizer: DomSanitizer

    ) {

    }


    // WILO.. will be adding a ion-card with the number of other members withing 50 miles of the user. something
    //  special for first, among 5, 10 30 and 60.


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
                    self._presentTutorialService.presentTutorialEasyahIntro();
                }
            });
        }
    }

    getNumberOfUsersAroundThisGuy() {
        return this._userGeographyService.getNumberOfUsersNearby(this._userService.getCurrentUser()["id"], this._constants.DEFAULT_MAX_MILE_RADIUS);
    }

    getAssociatedImage() {
        return this._pictureService.getAssociatedImage(this._constants.PHOTO_TYPE_PROFILE, this._userService.getCurrentUser()["id"]);
    }

    getAssociatedImageCSS() {
        let _model = this._profileService.getModel();
        let rtn = this._pictureService.getOrientationCSS(_model);
        return rtn;
    }

    onAssociatedImageClick() {
        this._router.navigate(['/profile/' + this._userService.getCurrentUser()["id"]]);
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
}

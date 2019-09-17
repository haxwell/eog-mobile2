import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ModalController } from '@ionic/angular';

import { TutorialService } from '../../app/_services/tutorial.service'
import { UserService } from '../../app/_services/user.service'
// import { PointsService } from '../../app/_services/points.service'
import { ProfileService } from '../../app/_services/profile.service'

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

    totalPoints = undefined;
    availablePoints = undefined;

    constructor(private _router: Router
                ,private _modalCtrl: ModalController 
                ,private _homeService: HomeService
                ,private _tutorialService: TutorialService
                ,private _userService: UserService
                // ,private _pointsService: PointsService
                ,private _profileService: ProfileService                
    ) {

    }

    ngOnInit() {
        let self = this;
        self.showTutorialPromise = self._tutorialService.getShowTutorialOnLogin();

        self._homeService.getMostRecentlyCreatedOffers().then((data) => {
            self.mostRecentlyCreatedOffers = data;
        });

        ///////
        // this.totalPoints = '-';
        // this.availablePoints = '-';

        // this._pointsService.init();

        // var user = this._userService.getCurrentUser();
        // if (user) 
        //     this._profileService.init(user["id"]);

        // this._pointsService.getCurrentAvailableUserPoints().then((caPoints) => {
        //     this.availablePoints = caPoints;
        // });

        // this._pointsService.getCurrentUserPointsAsSum().then((sumPoints) => {
        //     this.totalPoints = sumPoints;
        // });
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

    getThumbnailImage() {
        return this._profileService.getThumbnailImagePath();
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

    // WILO.. trying to get points working.. the scenario is admin sends user2 a point, and user2's UI should update beautifully.

    getAvailablePoints() {
        return this._profileService.getModel()["points"] && this._profileService.getModel()["points"]["available"]
    }

    getAllTimePointsCount() {
        return this._profileService.getModel()["allTimePointCount"]

        // var user = this._userService.getCurrentUser();

        // if (user) {
        //     var pts = this._profileService.getModel(user["id"])["allTimePointCount"]
        //     return pts;
        // } else {
        //     return 0;
        // }
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

    onThumbnailImageClick() {
        this._router.navigate(['/profile/' + this._userService.getCurrentUser()["id"]]);
    }

    onCreateOfferBtnClicked() {
        this._router.navigate(['/offers/new'])
    }
}

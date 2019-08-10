import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { Events } from '@ionic/angular'

import { Platform, MenuController } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { UserService } from './_services/user.service';
import { ProfileService } from './_services/profile.service';
import { AlertService } from './_services/alert.service';
import { WebsocketService } from './_services/websocket.service';
import { UserPreferencesService } from './_services/user-preferences.service';
import { UnseenChangesIndicatorService } from './_services/unseen-changes-indicator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  exitFunction = undefined;
  isAndroidFunction = undefined;

  menuOptions = [ ];

  constructor(private _location: Location,
    private _router: Router,
    private _route: ActivatedRoute,
    private platform: Platform,
    private statusBar: StatusBar,
    private websocketService: WebsocketService, // defined here so it will be initialized, but not used in this class
    private userPreferencesService : UserPreferencesService, // defined here so it will be initialized, but not used in this class
    private _userService : UserService,
    private _menuCtrl : MenuController,
    private _alertService: AlertService,
    private _profileService: ProfileService,
    private _uciService: UnseenChangesIndicatorService,
    private _events: Events
  ) {
    this.initializeApp();
  }

  initializeApp() {

    this.exitFunction = () => {
      // this.platform.exitApp();  // see https://forum.ionicframework.com/t/v4-back-button-doesnt-exit-app-solved-tutorial/149994/4
    }

    this.isAndroidFunction = () => {
      return this.platform.is('android');
    }

    let self = this
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      this.statusBar.styleDefault();

      self._events.subscribe('app:login', (currentUser) => {
        console.log("app component got app:login event")
        self.setMenuOptions(currentUser['id']);

        console.log(self.menuOptions);
      })
    });
  }

  isMenuCoolToShow() {
    return this._userService.getCurrentUser() !== undefined;
  }

  handleMenuWillOpenEvent() {
    // This is part of a hacky implementation of the profile images. The server takes a url, specific to a profile, and
    //  adds a number that changes at times we want to force a refresh of the image. The image is cached in the browser,
    //  and so, if we just have it return 'api/resource/profile/4' each time would say to the browser, you already have
    //  this image, serve it from the cache.

    this._profileService.bumpTheThumbnailCounter();
  }

  getUser() {
    // this is called from the template
    return this._userService.getCurrentUser();
  }

  onHomeClicked() {
    if (!this._router.url.endsWith("/home")) {
      this._menuCtrl.close();
      //this.navCtrl.push(HomePage, {});
      this._router.navigate(['/home']);
    }
  }

  onShowProfile() {
    if (!this._router.url.endsWith("/profile/" + this._userService.getCurrentUser()["id"])) {
      this._menuCtrl.close();
      //this.navCtrl.push(ProfilePage, {userId: });
      this._router.navigate(['/profile/' + this._userService.getCurrentUser()["id"]]);
    }
  }

  onYouAskedPeopleClicked() {
    if (!this._router.url.endsWith("/requests/outgoing")) {
      this._menuCtrl.close();
      this._uciService.resetOutgoingUnseenChanges();
      //this.navCtrl.push(RequestsOutgoingView, {});
      this._router.navigate(['/requests/outgoing']); 
    }
  }

  onPeopleAskedYouClicked() {
    if (!this._router.url.endsWith("/requests/incoming")) {
      this._menuCtrl.close();
      this._uciService.resetIncomingUnseenChanges();
      //this.navCtrl.push(RequestsIncomingView, {});
      this._router.navigate(['/requests/incoming']); 
    }
  }

  onYourOffersClicked() {
    if (!this._router.url.endsWith("/offers")) {
      this._menuCtrl.close();
      //this.navCtrl.push(OfferListPage, {});
      this._router.navigate(['/offers']); 
    }
  }

  onYourRecommendationsClicked() {
    if (!this._router.url.endsWith("/recommendations/incoming")) {
      this._menuCtrl.close();
      //this.navCtrl.push(RecommendationListPage, {});
      this._router.navigate(['/recommendations/incoming']); 
    }
  }

  onYourKeywordsClicked() {
    if (!this._router.url.endsWith("/keywords")) {
      this._menuCtrl.close();
      //this.navCtrl.push(KeywordListPage, {});
      this._router.navigate(['/keywords']); 
    }
  }

  onYourNotificationsClicked() {
    if (!this._router.url.endsWith("/notifications")) {
      this._menuCtrl.close();
      this._uciService.resetNotificationUnseenChanges();
      //this.navCtrl.push(NotificationListPage, {});
      this._router.navigate(['/notifications']); 
    }
  }

  onAboutEasyahClicked() {
    if (!this._router.url.endsWith("/about-easyah")) {
      this._menuCtrl.close();
      //this.navCtrl.push(AboutEasyahPage, {});
      this._router.navigate(['/about-easyah']); 
    }
  }

  isLogoutBtnVisible() {
    return this.isAndroidFunction();
  }

  onLogoutBtnClick() {
    this._alertService.show({
      title: 'Exit Easyah?',
      message: "Sure you want to exit the app?",
      buttons: [{
        text: "No, I'll stay.",
        role: 'cancel'
      }, {
        text: 'Yes, exit!',
        handler: () => {
          this.exitFunction();
        }
      }]
    });
  }

  getSelectedColor(pageName) {

    let pageURLMap = {
      'HomePage': '/home',
      'RequestsIncomingView': '/requests/incoming',
      'RequestsOutgoingView': '/requests/outgoing',
      'ProfilePage': '/profile',
      'OfferListPage': '/offers',
      'RecommendationListPage': '/recommendations',
      'KeywordListPage': '/keywords',
      'NotificationListPage': '/notifications',
      'AboutEasyahPage': '/about-easyah',
    }

    return (this._router.url.includes(pageURLMap[pageName])) ?  "lightgrey" : "white";
  }

  areIncomingUnseenChanges() {
    return this._uciService.areIncomingUnseenChanges();
  }

  areOutgoingUnseenChanges() {
    return this._uciService.areOutgoingUnseenChanges();
  }

  areNotificationUnseenChanges() {
    return this._uciService.areNotificationUnseenChanges();
  }

  setMenuOptions(userId) {

    this.menuOptions = [
      {
        title: 'Home',
        url: '/home',
        icon: 'home'
      },
      {
        title: 'People Asked You',
        url: '/requests/incoming',
        icon: 'list'
      },
      {
        title: 'You Asked People',
        url: '/requests/outgoing',
        icon: 'home'
      },
      {
        title: 'About You',
        url: '/profile/' + userId,
        icon: 'home'
      },
      {
        title: 'Your Offers',
        url: '/offers',
        icon: 'home'
      },
      {
        title: 'Your Recommendations',
        url: '/recommendations/incoming',
        icon: 'home'
      },
      {
        title: 'Your Keywords',
        url: '/keywords',
        icon: 'home'
      },
      {
        title: 'Notifications',
        url: '/notifications',
        icon: 'home'
      },
      {
        title: 'About Easyah',
        url: '/about-easyah',
        icon: 'home'
      }
      ]
  }
}

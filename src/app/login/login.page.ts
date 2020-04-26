import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { LoadingController } from '@ionic/angular';
import { Events } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

// import { HomePage } from '../home/home';
// import { CreateAccountPage } from './_pages/create.account'

import { AlertService } from '../../app/_services/alert.service';
import { UserService } from '../../app/_services/user.service';
import { LoadingService } from '../../app/_services/loading.service';
import { GeolocationService } from '../../app/_services/geolocation.service';

import { environment } from '../../_environments/environment';

@Component({
  selector: 'page-login',
  templateUrl: 'login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage {

  user = {id:-1, name: '', password: ''};
  codeAlreadySent = false;
  
  constructor(private _router : Router,
              private _alertService: AlertService,
              private _userService: UserService,
              private _geolocationService: GeolocationService,
              private _loadingService: LoadingService,
              private splashScreen: SplashScreen,
              private _events: Events) {

              if ( !environment.production )
                this.user = {id:-1, name: 'eoguser2', password: 'password'};
  }

  ionViewWillEnter() {
      this.splashScreen.hide();
  }

  onLoginBtnTap(event) {
    if (this.user.name.length > 0 && this.user.password.length > 0) {
      let self = this;

      this._loadingService.show({
        message: 'Please wait...'
      }).then(() => {
        this._userService.verifyAndLoginUser(this.user.name, this.user.password).then((userObj) => {
          let pw = self.user.password;
          let un = self.user.name;

          self.user = userObj;
          
          self.user["password"] = pw;
          self.user["name"] = un;

          self._events.publish("app:login", userObj);

          self._loadingService.dismiss().then(() => {
            self.ensureLatitudeLongitudeIsSetForCurrentUser().then(() => {
                this._router.navigate(['/home']);
            })
          })
        })
        .catch((err) => {
            self._loadingService.dismiss().then(() => {
              self._alertService.show({header: 'Sad face..',
                   message: "Bad username/password!",
                   buttons: [{
                      text: 'OK',
                      handler: () => { }
                    }]
              });
            });              
        });
      });      
    }
  }

  onCreateAccountBtnTap(event) {
    this._router.navigate(['/create-account']);
  }

  onLostPasswordClick(event) {
    let self = this;
    this._alertService.show({
            header: '',
            message: "Would you like to reset your password?",
            buttons: [{
              text: "Oops, no..",
              role: 'cancel'
            }, {
              text: 'Yes!',
              handler: () => {
                this.onResetPasswordClick();
              }
            }]
          })
  }

  onResetPasswordClick() {
    let self = this;
      this._alertService.show({
        header: "Enter your phone number. We'll send you a code.",
        inputs: [{
          name: 'phoneNumber',
          placeholder: '..10 digit phone number..',
          type: 'number'
        }],
        buttons: [{
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Send Code',
          handler: (data) => {

            if (data.phoneNumber.length != 10)
              return false;

            self._userService.isPhoneNumberAvailable(data.phoneNumber).then((isAvailable) => {
              if (isAvailable) {

                self._alertService.show({
                        header: 'Uh oh!',
                        message: "We don't have an account with that phone number. :(",
                        buttons: [{
                          text: "OK",
                          role: 'cancel'
                        }]
                      })
              } else {
                self._userService.sendCodeToPhoneNumber(data.phoneNumber);
                self.codeAlreadySent = true;

                this.onCodeSentToPhoneNumber(data.phoneNumber);
              }
            });
          }
        }]
    })
  }

  onCodeSentToPhoneNumber(phoneNumber) {
    let self = this;
      this._alertService.show({
        header: "What's in the text?",
        inputs: [{
          name: 'code',
          placeholder: '..code from text msg..',
          type: 'number'
        }],
        buttons: [{
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Got it!',
          handler: (data) => {
              if (data.code !== undefined && data.code.length > 0) {

                self._userService.isAValidSMSChallengeCode(phoneNumber, data.code).then((b) => {
                  if (b) {

                      // present dialog allowing user to enter new password

                      self._alertService.show({
                        header: "Enter Your New Password",
                        inputs: [{
                          name: 'pw1',
                          placeholder: '..new password..'
                        }, {
                          name: 'pw2',
                          placeholder: '..verify password..'
                        }],
                        buttons: [{
                          text: 'Cancel',
                          role: 'cancel'
                        }, {
                          text: 'OK',
                          handler: (data2) => {
                            if (data2.pw1 && data2.pw1.length > 5 && data2.pw1 == data2.pw2) {
                              self._userService.changeLostPassword(data.code, phoneNumber, data2.pw2).then((response) => {

                                  if (response["id"]) {
                                    self._alertService.show({
                                      header: 'Yay!',
                                      message: "Your password has been changed.<br/><br/>Username: " + response["name"],
                                      buttons: [{
                                        cssClass: 'finalOkBtn',
                                        text: 'OK',
                                        handler: () => {

                                        }
                                      }]
                                    })
                                  } else {
                                    self._alertService.show({
                                      header: 'Hmmm...!',
                                      message: "Could not change your password... Try again.",
                                      buttons: [{
                                        text: 'OK',
                                        handler: () => {

                                        }
                                      }]
                                    })
                                  }

                                }, (err) => {
                                  
                                  self._alertService.show({
                                    header: 'Arggh!',
                                    message: "Something bad happened on the server. We hate when that happens. Please email us at info@easyah.com and let us know.",
                                    buttons: [{
                                      text: 'OK',
                                      handler: () => {
                                        
                                      }
                                    }]
                                  })
                                })
                            } else {
                              return false;
                            }
                          }
                        }]
                    });

                  } else {
                    self._alertService.show({
                      header: 'Aargh...',
                      message: "That wasn't a valid code.......",
                      buttons: [{
                        text: 'Grr.',
                        handler: () => {
                          
                        }
                      }]
                    })
                  }
                })
              }
          }
        }]
      });
  }

  ensureLatitudeLongitudeIsSetForCurrentUser() {

    return new Promise((resolve, reject) => {
        let self = this;
        if ((!self.user["latitude"] || self.user["latitude"]*1.0 === 0.0) && 
            (!self.user["longitude"] || self.user["longitude"]*1.0 === 0.0)) {

            self._alertService.show({
              header: 'FYI...',
              message: "Easyah does not have a location set for you. We use your location to show you things that are local for you. We will try to set the location now.",
              buttons: [{
                text: 'OK',
                handler: () => {

                    //    
                    // TODO: Very similar code in profile-edit.. Refactor it to a service with callbacks and all that good stuff.
                    //

                    let self = this;

                    self._loadingService.show({
                      message: 'Accessing your device GPS...'
                    }).then(() => {
                      self._geolocationService.getCurrentPosition().then((resp) => {
                          self.user["latitude"] = resp["coords"].latitude;
                          self.user["longitude"] = resp["coords"].longitude;

                          self._userService.save(self.user).then((obj) => {
                              self._alertService.show({
                                header: 'Success',
                                message: "Your location has been updated!",
                                buttons: [{
                                  text: 'OK',
                                  handler: () => {
                                    self._loadingService.dismiss().then(() => {
                                      resolve();
                                    });
                                  }
                                }]
                              })

                          }, (err) => {
                              self._alertService.show({
                                header: 'Arggh!',
                                message: "Something bad happened on the server. We hate when that happens. Please email us at info@easyah.com and let us know.",
                                buttons: [{
                                  text: 'OK',
                                  handler: () => {
                                    self._loadingService.dismiss().then(() => {
                                      reject();
                                    });
                                  }
                                }]
                              })
                          })
                      }, (error) => {

                        self._loadingService.dismiss().then(() => {

                          self._alertService.show({
                              header: 'Hmmm..',
                              message: "Easyah could not read your device's location. Where are you?",
                              inputs: [{
                                  name: 'city',
                                  placeholder: 'city',
                                  type: 'text'
                              }, {
                                  name: 'state',
                                  placeholder: 'state',
                                  type: 'text'
                              }],
                              buttons: [{
                                  text: 'Here I am!',
                                  handler: (data) => {
                                    if ((data.city && data.city.length >= 3) && (data.state && data.state.length >= 2)) {

                                        console.log("calling for geoloc data for " + data.city + " / " + data.state);
                                        self._geolocationService.getLatlongFromCityState(data.city, data.state).then((obj) => {
                                            
                                            console.log("geoloc data found for " + data.city + " / " + data.state + " // " + obj);
                                            self.user["latitude"] = obj["latitude"];
                                            self.user["longitude"] = obj["longitude"];

                                            self._userService.save(self.user).then((obj) => {
                                                self._alertService.show({
                                                  header: 'Success',
                                                  message: "Your location has been updated!",
                                                  buttons: [
                                                    {
                                                        text: 'OK', role: 'cancel', handler: () => {
                                                          resolve();
                                                        }
                                                    }
                                                  ]
                                                })
                                            }, (err) => {
                                                self._alertService.show({
                                                  header: 'Arggh!',
                                                  message: "Something bad happened on the server. We hate when that happens. Please email us at info@easyah.com and let us know.",                                      
                                                  buttons: [{
                                                    text: 'OK',
                                                    handler: () => {
                                                        reject();
                                                    }
                                                  }]
                                                })
                                            })
                                        }, (err) => {
                                            self._alertService.show({
                                              header: 'Arggh!',
                                              message: "Sorry, we couldn't find that location either. You can set your location in your profile later on.",
                                              buttons: [{
                                                text: 'OK',
                                                handler: () => {
                                                    reject();
                                                }
                                              }]
                                            })
                                        })
                                    } else {
                                      return false; // disble the button
                                    }
                                  } // end handler
                                }] // end buttons
                              }); // end alert 
                        }); 
                      })
                  });
                }
              }]
            })

          } else {
            resolve();
          } // end if latlng
        
        }); // end promise
    }

}

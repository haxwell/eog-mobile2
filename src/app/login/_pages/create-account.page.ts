import { Component } from '@angular/core';
import { Location } from '@angular/common';

import { AlertService } from '../../../app/_services/alert.service';
import { ModalService } from '../../../app/_services/modal.service';
import { UserService } from '../../../app/_services/user.service';

import { NewAccountTutorialPage } from './new-account-tutorial.page'

@Component({
  selector: 'page-login-create-account',
  templateUrl: 'create-account.page.html'
})
export class CreateAccountPage {

	user = {realname: '', email: '', name: '', password: '', phone: ''};

	referringUsername = '';
	codeAlreadySent = false;

	tutorialModal = undefined;

	constructor(private _location: Location,
				private _alertService: AlertService,
				private _modalService: ModalService,
				private _userService: UserService) {

	}

	ngOnInit() {

	}

	ionViewWillEnter() {
        let self = this;

        this._modalService.show(NewAccountTutorialPage);
    }

	setChangedAttr(key, value) {
		this.user[key] = value;
	}

	onRealNameChange(event) {
		this.setChangedAttr("realname", event.currentTarget.value);
	}

	onNameChange(event) {
		this.setChangedAttr("name", event.currentTarget.value);
	}

	onEmailChange(event) {
		this.setChangedAttr("email", event.currentTarget.value);
	}

	onPhoneChange(event) {
		this.setChangedAttr("phone", event.currentTarget.value);	
	}

	onPasswordChange(event) {
		this.setChangedAttr("password", event.currentTarget.value);	
	}

	onReferringUsernameChange(event) {
		this.referringUsername = event._value;
	}

	getReferringUsername() {
		return this.referringUsername;
	}

	getModelAttr(key) {
		return this.user[key];
	}

	isValidEmail(email) {
    	let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	return re.test(email);
	}

	isSaveBtnEnabled() {
		return 	this.user["email"].length > 5 && 
				this.user["realname"].length > 2 && 
				this.user["name"].length > 2 && 
				this.user["password"].length > 5 &&
				this.user["phone"].length === 10 &&
				this.isValidEmail(this.user["email"]);
	}

	onOKBtnTap(evt) {
		let self = this;

		if (this.user["name"].lastIndexOf(' ') > -1) {
			self._alertService.show({
				header: 'Doh!',
				message: "Usernames cannot have spaces in them.",
				buttons: [
					{
						text: 'OK', role: 'cancel', handler: () => {
							// do nothing
						}
					}
				]
			})

			return;			
		}

		self._userService.isUserInformationUnique(self.user).then((userInfo) => {
			if (userInfo == true) {
				if (!self.codeAlreadySent) {
					self._alertService.show({
						header: 'Ready for a text?',
						message: "We're gonna send a text to your phone at " + self.user["phone"] + ". Okay?",
						buttons: [
							{
								text: 'No', role: 'cancel', handler: () => {
									// do nothing
								},
							}, {
								text: 'Yes', handler: () => {
			           				self._userService.sendCodeToPhoneNumber(self.user["phone"]);
				            		self.codeAlreadySent = true;
				            		self.onOKBtnTap2(evt);
				            	}, cssClass: 'e2e-sendCodeToPhoneNumberBtn'
				            }]
				        });
				} else {
					self.onOKBtnTap2(evt);
				}
			} else {
				self._alertService.show({
					header: 'Doh!',
					message: "Sorry, that " + userInfo + " is already taken :(",
					buttons: [
						{
							text: 'OK', role: 'cancel', handler: () => {
								// do nothing
							}
						}
					]
				})
			}
		})
	}


	onOKBtnTap2(evt) {
		let self = this;

        self._alertService.show({
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
	      	text: 'Send Txt Again',
	      	handler: () => {
				self._userService.sendCodeToPhoneNumber(self.user["phone"]);
				self.codeAlreadySent = true;
	      	}
	      }, {
	        text: 'Got it!',
	        cssClass: 'e2e-submitChallengeCodeBtn',
	        handler: (data) => {
	            if (data.code !== undefined && data.code.length > 0) {

	            	self._userService.isAValidSMSChallengeCode(self.user["phone"], data.code).then((b) => {
	            		if (b) {
							if (self.referringUsername !== undefined && self.referringUsername.length > 0)
								self.user["referringUsername"] = self.referringUsername;
							else
								delete self.user["referringUsername"];

							self._userService.save(self.user, data.code).then(() => {

								self._alertService.show({
		            				header: 'Alright!',
		            				message: "Account Created.<br/>user: " + self.user["name"] + "<br/>pw: ..." + self.user["password"].substring(self.user["password"].length - 5) + "<br/><br/>Click OK to sign in.",
		            				buttons: [{
		            					text: 'OK',
		            					cssClass: 'e2e-account-successfully-created-btn',
		            					handler: () => {
											self.codeAlreadySent = false;
											self._location.back();
		            					}
		            				}]
		            			})
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

	onCancelBtnTap(evt) {
		this._location.back();
	}
}

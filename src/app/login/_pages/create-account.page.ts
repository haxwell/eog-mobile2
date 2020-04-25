import { Component } from '@angular/core';
import { Validators, ValidationErrors, AsyncValidatorFn, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Location } from '@angular/common';

import { AlertService } from '../../../app/_services/alert.service';
import { ModalService } from '../../../app/_services/modal.service';
import { LoadingService } from '../../../app/_services/loading.service';
import { UserService } from '../../../app/_services/user.service';

import { FunctionPromiseService } from '@savvato-software/savvato-javascript-services'

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

  	createAccountForm: FormGroup;

	constructor(private _location: Location,
				private _alertService: AlertService,
				private _modalService: ModalService,
				private _loadingService: LoadingService,
				private _userService: UserService,
				private _functionPromiseService: FunctionPromiseService,
				private formBuilder: FormBuilder) {

	}

	ngOnInit() {
		this.createAccountForm = this.formBuilder.group({
		  realname: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
		  email: new FormControl(null, { validators: Validators.compose([Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+[.]+[a-zA-Z0-9-.]+$')]), asyncValidators: [this.emailValidator()], updateOn: "blur"}),
		  phone: new FormControl(null, { validators: Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern('^[0-9]*')]), asyncValidators: [this.phoneValidator()], updateOn: "blur"}),
		  username: new FormControl(null, { validators: Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern('[a-zA-Z0-9]*')]), asyncValidators: [this.usernameValidator()], updateOn: "blur"}),
		  password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
		  referringUsername: ['']
		});

		let self = this;
		this._functionPromiseService.initFunc("isUsernameAvailable", (data) => {
			return new Promise((resolve, reject) => {
				self._userService.isUsernameAvailable(data['username']).then((data) => {
					console.log("FPS isUsernameAvailable func, resolving ", data);
					resolve({isUsernameAvailable: data});
				})
			})
		})

		this._functionPromiseService.initFunc("isPhoneNumberAvailable", (data) => {
			return new Promise((resolve, reject) => {
				self._userService.isPhoneNumberAvailable(data['phonenumber']).then((data) => {
					resolve({isPhoneNumberAvailable: data});
				})
			})
		})

		this._functionPromiseService.initFunc("isEmailAddressAvailable", (data) => {
			return new Promise((resolve, reject) => {
				self._userService.isEmailAddressAvailable(data['emailaddress']).then((data) => {
					console.log("FPS isEmailAddrAvailable func, resolving ", data);
					resolve({isEmailAddressAvailable: data});
				})
			})
		})
	}

	get createAccountFormControl() {
		return this.createAccountForm.controls;
	}

	usernameValidator(): AsyncValidatorFn {
		let self = this;
  		return (control: AbstractControl): Promise<ValidationErrors | null>  => {
			return new Promise((resolve, reject) => {
				self._functionPromiseService.waitAndGet("isUsernameAvailable-"+control.value, "isUsernameAvailable", {username: control.value}).then((rtn) => {
					resolve(rtn['isUsernameAvailable'] === true ? null : { userNameNotAvailable: true });
				})
			});
		};
	}

	phoneValidator(): AsyncValidatorFn {
		let self = this;
  		return (control: AbstractControl): Promise<ValidationErrors | null>  => {
			return new Promise((resolve, reject) => {
				if (control.value.length !== 10) { console.log("short number"); resolve(null); }
				self._functionPromiseService.waitAndGet("isPhoneNumberAvailable-"+control.value, "isPhoneNumberAvailable", {phonenumber: control.value}).then((rtn) => {
					resolve(rtn['isPhoneNumberAvailable'] === true ? null : { phoneNumberNotAvailable: true });
				})
			});
		};
	}

	emailValidator(): AsyncValidatorFn {
		let self = this;
  		return (control: AbstractControl): Promise<ValidationErrors | null>  => {
			return new Promise((resolve, reject) => {
				self._functionPromiseService.waitAndGet("isEmailAddressAvailable-"+control.value, "isEmailAddressAvailable", {emailaddress: control.value}).then((rtn) => {
					resolve(rtn['isEmailAddressAvailable'] === true ? null : { emailAddressNotAvailable: true });
				})
			});
		};
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

	onUserNameChange(event) {
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

	isSaveBtnEnabled() {
		let cafc = this.createAccountFormControl;
		
		return 	!cafc.realname.errors && 
				!cafc.email.errors &&
				!cafc.phone.errors &&
				!cafc.username.errors &&
				!cafc.password.errors;
	}

	onOKBtnTap(evt) {
		let self = this;

		if (self.isSaveBtnEnabled()) {
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
			.catch((err) => {
				self._alertService.show({
					header: 'Aargh',
					message: "We got an error. Please email info@easyah.com about it. Our bad :(",
					buttons: [
						{
							text: 'Shucks.', role: 'cancel', handler: () => {
								// do nothing
							},
						}]
			        });
			})
		}
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

	            	self._userService.isAValidSMSChallengeCode(self.user["phone"], data.code).then((isValidSMSCC) => {
	            		self._loadingService.show({message: "...creating your account..."}).then(() => {
		            		if (isValidSMSCC) {
								if (self.referringUsername !== undefined && self.referringUsername.length > 0)
									self.user["referringUsername"] = self.referringUsername;
								else
									delete self.user["referringUsername"];

								self._userService.save(self.user, data.code).then(() => {
									self._loadingService.dismiss().then(() => {

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
									})
								});
	            			}
	            		})})
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
	            }
	        }
	      ]
        });
	}

	onCancelBtnTap(evt) {
		this._location.back();
	}
}

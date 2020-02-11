import { Component } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { ProfileService } from '../../_services/profile.service'
import { PictureService } from '../../_services/picture.service'
import { UserService } from '../../_services/user.service'

import * as EXIF from 'exif-js'

import { environment } from '../../../_environments/environment';

@Component({
  selector: 'profile-header',
  templateUrl: 'profile-header.html',
  styleUrls: ['profile-header.scss'],
})
export class ProfileHeader {

	userId = undefined;
	imageOrientation = undefined;

	constructor(private _router: Router,
				private _profileService: ProfileService, 
				private _pictureService: PictureService,
				private _userService: UserService) {

	}

	ngOnInit() {
		this.userId = this._userService.getCurrentUser()["id"];
	}

	ionViewWillEnter() {
		console.log("VIEW WILL ENTER - HeaderProfile");
		this._profileService.bumpTheThumbnailCounter();
		this.ngOnInit();
	}

	onThumbnailPress($event) {
		this._router.navigate(['/profile/' + this._userService.getCurrentUser()["id"]]);
	}

	isThumbnailImageAvailable() {
		if (this.userId)
			return this._profileService.getModel(this.userId)["imageFileURI"] !== undefined;
		else
			return false;
	}

	getThumbnailImage() {
		return this._profileService.getThumbnailImagePath(this.userId);
	}

	getModelAttr(key) {
		if (this.userId) {
			let model = this._profileService.getModel(this.userId) || {};
			return model[key];
		} else {
			return undefined;
		}
	}

	getAvatarCSSClassString() {
		return this._pictureService.getOrientationCSS(this);
	}

	loaded(evt) {
		let self = this;
		EXIF.getData(evt.target, function() {
			self.imageOrientation = EXIF.getTag(this, "Orientation");
		});
	}
}

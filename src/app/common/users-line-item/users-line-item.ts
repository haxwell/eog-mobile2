import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';

import { Events } from '@ionic/angular';

import { PictureService } from '../../_services/picture.service'
import { ProfileService } from '../../_services/profile.service'

import { Constants } from '../../../_constants/constants'
import { environment } from '../../../_environments/environment';

@Component({
  selector: 'users-line-item',
  templateUrl: 'users-line-item.html',
  styleUrls: ['users-line-item.scss']
})

export class UsersLineItem {

	@Input() item = undefined;
	@Input() clickthru = true;
	profileImageFilepath = undefined;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
				private _router: Router,
				private _pictureService: PictureService,
				private _profileService: ProfileService,
				private _constants : Constants,
                private _events: Events) {

	}

	ngOnInit() {

	}

	onViewProfile() {
      if (this.clickthru) 
      	this._router.navigate(['/profile/' + this.item["id"]])
	}

	getAssociatedImage() {
		return this._pictureService.getAssociatedImage(this._constants.PHOTO_TYPE_PROFILE, this.item["id"]);
	}

	getAssociatedImageCSS() {
		return this._pictureService.getOrientationCSS(this.item, "editOfferImage avatar-in-a-list");
	}
}
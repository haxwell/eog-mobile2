import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { PictureService } from '../../_services/picture.service'

import { Constants } from '../../../_constants/constants'

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
				private _constants : Constants,
                _events: Events) {

	}

	ngOnInit() {

	}

	onViewProfile() {
      if (this.clickthru) 
      	this._router.navigate(['/profile/' + this.item["id"]])
	}

	getProfileImageFilepath() {
		return this.profileImageFilepath;
	}

	isProfileImageAvailable() {
		let rtn = this.profileImageFilepath !== undefined && this.profileImageFilepath !== null;

		let self = this;
		if (this.profileImageFilepath === undefined) {
			this.profileImageFilepath = null;

			self._pictureService.get(self._constants.PHOTO_TYPE_PROFILE, self.item["id"]).then((path) => {
				if (path !== undefined)
					self.profileImageFilepath = path;
			});
		}

		return rtn; 
	}

}
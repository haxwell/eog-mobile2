import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Events } from '@ionic/angular';

import { PictureService } from '../../_services/picture.service'

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
		let photoType = "profile";
		let objId = this.item["id"];
		return environment.apiUrl + "/api/resource/" + photoType + "/" + objId
	}
}
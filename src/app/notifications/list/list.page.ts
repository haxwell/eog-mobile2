import { Component } from '@angular/core';
import { Events } from '@ionic/angular';

import { Constants } from '../../../_constants/constants'
import { environment } from '../../../_environments/environment';

import { NotificationService } from '../../../app/_services/notification.service'
import { PictureService } from '../../../app/_services/picture.service'

import * as EXIF from 'exif-js';

@Component({
  selector: 'notification-list',
  templateUrl: './list.page.html'
  ,styleUrls: ['./list.page.scss']
})

export class ListPage {

	model = undefined;
	dirty = true;
	newKeywordsString = '';

	imageOrientation = undefined;

	directionallyOppositeUserProfileImageFilepath = {};

	constructor(private _notificationService : NotificationService,
				private _pictureService : PictureService,
				private _constants: Constants,
				private _events: Events				
	) {
		
		let func = () => {
			this.setDirty(true);
			this.ngOnInit();
		}

		this._events.subscribe("request:received", func)
		this._events.subscribe("request:accepted", func)
		this._events.subscribe("request:declined", func)
		this._events.subscribe("request:completed", func)
		this._events.subscribe("request:outgoing:cancelled", func)
		this._events.subscribe("request:completedAndApproved", func)
		this._events.subscribe("request:isInDispute", func)
		this._events.subscribe("request:inamicablyResolved", func)
		this._events.subscribe("recommendation:received", func)
		this._events.subscribe("points:received", func)
	}

	ngOnInit() {
		var self = this;

		self._pictureService.init();

		if (self.isDirty()) {
			self._notificationService.get(true /* force update */ ).then((data) => {
				self.model = data;
			});
		}
	}

	getTrack(item) {
		return "notification";
	}

	isDirty() {
		return this.dirty;
	}

	setDirty(b) {
		this.dirty = b || true;
	}

	userHasNoNotifications() { 
		return this.model === undefined || this.model.length == 0;
	}

	getNotifications() {
		if (!this.model)
			return [];
		else
			return this.model.sort((a, b) => {
				if (a.timestamp > b.timestamp) return -1; 
				else if (a.timestamp < b.timestamp) return 1; 
				else return 0; 
			});
	}


	onClearIndividualNotification(item) {
		this._notificationService.delete(item).then(() => {
			this.model = this.model.filter((obj) => {
				return obj["id"] !== item["id"];
			});
		});
	}

	onNotificationClearAllBtnPress() {
		this._notificationService.deleteAll().then(() => {
			this.model = undefined;
		});
	}

	getDOUserProfileImageFilepath(userId) {
		let photoType = "profile";
		let objId = userId;
		return environment.apiUrl + "/api/resource/" + photoType + "/" + objId
	}
}
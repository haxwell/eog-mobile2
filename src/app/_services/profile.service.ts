import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { ProfileModelService } from './profile-model.service';
import { PictureService } from './picture.service'
import { Constants } from '../../_constants/constants'

import { environment } from '../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ProfileService {

	modelCache = {};

	constructor(private _userService: UserService, 
				private _profileModelService: ProfileModelService,
				private _pictureService: PictureService,
				private _constants: Constants) {

		this._pictureService.init();
	}

	init(userId:number) {
		return this._profileModelService.init();
	}

	setCacheExpiry(millis) {
		this._profileModelService.setCacheExpiry(millis);
	}

	getModel(userId?: number, forceWaitUntilCompleteHydration?: boolean) {
		return this._profileModelService.get(userId, forceWaitUntilCompleteHydration);
	}

	save(model) {
		return this._profileModelService.save(model);
	}

	// THIS IS USED OUTSIDE OF THE NORMAL MODEL FUNCTIONALITY OF THIS SERVICE.
	//  It can be abstracted elsewhere.

	// _counter = 0;
	// bumpTheThumbnailCounter() {
	// 	// this._counter++;
	// }

	// getThumbnailImagePath(userId?) {
	// 	if (!userId)
	// 		userId = this._userService.getCurrentUser()["id"];

	// 	let rtn = this._pictureService.get(this._constants.PHOTO_TYPE_PROFILE, userId);
	// 	// console.log("PROFILE SERVICE img path for id ", userId, rtn)
	// 	return rtn['path'];

	// 	// let model = this.getModel(userId);
	// 	// let rtn = model && model['imageFileURI'];

	// 	// console.log("PROFILE SERVICE img path for id ", userId, rtn)

 //        // return rtn;
 //        	// return environment.apiUrl + "/api/resource/profile/" + userId + '/sendAnew/' + this._counter; 
	// }	
}
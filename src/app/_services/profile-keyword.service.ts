import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { ApiService } from './api.service';

import { environment } from '../../_environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ProfileKeywordService { 
	
	model = undefined;

	constructor(private _apiService: ApiService, 
				private _userService: UserService) {

	}

	getModel() {
		return this.getModelByUser(this._userService.getCurrentUser());
	}

	getModelByUser(user) {
		if (this.model === undefined) {
			this.model = {}
			this.init(this.model, user);
		}

		return this.model;
	}

	init(model, user) {
		let url = environment.apiUrl + "/api/user/" + user["id"] + "/profile";
		this._apiService.get(url).subscribe((data) => {
			let obj = data;
			model["keywords"] = obj["keywords"];
			model["keywords"].sort((a, b) => { let aText = a.text.toLowerCase(); let bText = b.text.toLowerCase(); if (aText > bText) return 1; else if (aText < bText) return -1; else return 0; })
		}, (err) => {
			console.log("ProfileKeywordService ERROR");
			console.log(JSON.stringify(err));
		});		
	}

	save(model) {
		let self = this;
		let tmp = {keywords: this.model["keywords"]};

		let data = this.JSON_to_UrlEncoded(tmp, undefined, undefined);

		let user = this._userService.getCurrentUser();

		return new Promise((resolve, reject) => {
			let url = environment.apiUrl + "/api/user/" + user["id"] + "/profile/keywords";
			self._apiService.post(url, data)
			.subscribe((resp) => {

			}, (err) => {
				reject(err);
			});
		})
	}

	JSON_to_UrlEncoded(element,key,list){
  		var list = list || [];
  		if(typeof(element)=='object'){
    		for (var idx in element)
      			this.JSON_to_UrlEncoded(element[idx],key?key+'['+idx+']':idx,list);
  		} else {
    		list.push(key+'='+encodeURIComponent(element));
  		}
  		
  		return list.join('&');
	}

}


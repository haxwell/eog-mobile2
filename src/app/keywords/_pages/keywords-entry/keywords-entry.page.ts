import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { ProfileKeywordService } from '../../../../app/_services/profile-keyword.service'

@Component({
  selector: 'page-keyword-entry',
  templateUrl: 'keywords-entry.page.html'
  // ,styleUrls: ['./keywords-list.page.scss']
})
export class KeywordsEntryPage {

	newKeywordsString: string = '';
	keywordArray = undefined;
	dirty = false;

	constructor(private _location: Location,
				private _route: ActivatedRoute,
  				private _router: Router,
  				private _profileKeywordService: ProfileKeywordService) {
		// this.keywordArray = navParams.get('keywordArray').slice();

		this.keywordArray = this._profileKeywordService.getModel();
	}

	isDirty() {
		return this.dirty === true;
	}

	setDirty(b) {
		this.dirty = b;
	}

	getKeywordArray() {
		return this.keywordArray || [];
	}

	userHasNoKeywords() {
		return this.keywordArray.length === 0;
	}

	isAddBtnEnabled() {
		return this.newKeywordsString.length > 0;
	}

	isSaveBtnEnabled() {
		return this.isDirty();
	}

	onAddKeywordFieldChange(evt) {
		this.newKeywordsString = evt._value;
	}

	getAddKeywordFieldValue() {
		return this.newKeywordsString;
	}

	onIndividualKeywordPress(item) {
		this.keywordArray = this.keywordArray.filter((obj) => {
			return obj["text"] !== item["text"];
		});

		this.setDirty(true);
	}

	onAddBtnTap() {
		if (this.isAddBtnEnabled()) {
			let tmp = this.newKeywordsString.split(',');

			tmp.forEach((obj) => {
				obj = obj.trim();

				if (obj.length > 0) {
					this.setDirty(true);

					let dupes = this.keywordArray.filter((kw) => {
						return kw["text"] == obj;
					})

					if (dupes.length == 0)
						this.keywordArray.push({id: -1, text: obj});
				}
			})

			this.newKeywordsString = '';
		}
	}

	onSaveBtnTap(evt) {
		let tmp = this.keywordArray;
		let tmp2 = [];
		tmp.map((obj) => { 
			if (!tmp2.some((obj2) => { return obj2["text"].toLowerCase() === obj["text"].toLowerCase(); }))
				tmp2.push(obj);
		});
		this._location.back()

		// return tmp2;
	}

	onCancelBtnTap(evt) {
		this._location.back();

		// this.viewCtrl.dismiss();
	}
}

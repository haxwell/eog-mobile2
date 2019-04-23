import { Component, Input } from '@angular/core';

import { ModalService } from '../../../app/_services/modal.service';

@Component({
  selector: 'page-keyword-entry',
  templateUrl: 'keyword.entry.html'
  ,styleUrls: ['keyword.entry.scss']
})
export class KeywordEntryPage {

	newKeywordsString: string = '';
	dirty = false;

	@Input() model;
	@Input() callbackFunc: any;

	constructor(private _modalService: ModalService) {

	}

	isDirty() {
		return this.dirty === true;
	}

	setDirty(b) {
		this.dirty = b;
	}

	getKeywordArray() {
		return this.model || [];
	}

	userHasNoKeywords() {
		return this.model.length === 0;
	}

	isAddBtnEnabled() {
		return this.newKeywordsString.length > 0;
	}

	isSaveBtnEnabled() {
		return this.isDirty();
	}

	onAddKeywordFieldChange(evt) {
		this.newKeywordsString = evt.srcElement.value;
	}

	getAddKeywordFieldValue() {
		return this.newKeywordsString;
	}

	onIndividualKeywordPress(item) {
		this.model = this.model.filter((obj) => {
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

					let dupes = this.model.filter((kw) => {
						return kw["text"] == obj;
					})

					if (dupes.length == 0)
						this.model.push({id: -1, text: obj});
				}
			})

			this.newKeywordsString = '';
		}
	}

	onSaveBtnTap(evt) {
		let tmp = this.model;
		let tmp2 = [];
		tmp.map((obj) => { 
			if (!tmp2.some((obj2) => { return obj2["text"].toLowerCase() === obj["text"].toLowerCase(); }))
				tmp2.push(obj);
		});

		this.callbackFunc(tmp2);		
	}

	onCancelBtnTap(evt) {
		this.callbackFunc();
	}
}

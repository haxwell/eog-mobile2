import { Component } from '@angular/core';
import { ModalService } from '../../../../app/_services/modal.service';

import { KeywordEntryPage } from '../../../../app/common/keyword.entry/keyword.entry' // TODO Rename this files to keyword-entry.page

import { ProfileKeywordService } from '../../../../app/_services/profile-keyword.service'


@Component({
  selector: 'keyword-list',
  templateUrl: 'keywords-list.page.html',
  styleUrls: ['./keywords-list.page.scss']
})

export class KeywordsListPage {

	model = undefined;
	dirty = undefined;
	newKeywordsString = '';

	constructor(private _keywordService : ProfileKeywordService,
				private _modalService : ModalService
	) {
		this.setDirty(true);
	}

	ngOnInit() {
		if (this.isDirty()) {
			this.model = this._keywordService.getModel();
		}
	}

	ionViewWillLeave() {
		if (this.isDirty()) {
			this._keywordService.save(this.model);
		}
	}

	isDirty() {
		return this.dirty;
	}

	setDirty(b) {
		this.dirty = b || true;
	}

	getKeywordArray() { 
		return this.model["keywords"] || [];
	}

	userHasNoKeywords() {
		return this.model["keywords"] === undefined || this.model["keywords"].length === 0;
	}

	onModifyKeywordBtnTap() {
		let self = this;
		this._modalService.show(KeywordEntryPage, {props: { keywordArray: self.model["keywords"]}, onDidDismissFunc: ((data: Array<Object>) => { 
			if (data) {
				self.setDirty(true);
				self.model["keywords"] = data;
				self.model["keywords"].sort((a, b) => { 
					let aText = a.text.toLowerCase(); 
					let bText = b.text.toLowerCase(); 
					if (aText > bText) return 1; 
					else if (aText < bText) return -1; 
					else return 0; 
				});
			}
		})})
	}

	isAddBtnEnabled() {
		return this.newKeywordsString && this.newKeywordsString.length > 0;
	}

	onAddKeywordFieldChange(evt) {
		this.newKeywordsString = evt.detail.value;
	}

	getAddKeywordFieldValue() {
		return this.newKeywordsString;
	}

	onIndividualKeywordPress(item) {
		this.model["keywords"] = this.model["keywords"].filter((obj) => {
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

					let dupes = this.model["keywords"].filter((kw) => {
						return kw["text"] == obj;
					})

					if (dupes.length == 0)
						this.model["keywords"].push({id: -1, text: obj});
				}
			})

			this.newKeywordsString = '';
			this.setDirty(true);
		}
	}
}
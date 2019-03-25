import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SearchPage } from '../../search/search.page';

import { environment } from '../../../_environments/environment';

@Component({
  selector: 'easyah-header',
  templateUrl: 'easyah-header.html',
  styleUrls: ['./easyah-header.scss']
})

export class EasyahHeader {

	searchTextFieldValue = undefined;

	constructor(private _router: Router) {
		if ( !environment.production )
			this.searchTextFieldValue = 'denver'
	}

	onSearchBtnTap(evt) {
		this._router.navigate(['/search/' + this.searchTextFieldValue]);
	}

	onSearchTextFieldChanged(evt) {
		this.searchTextFieldValue = evt._value;
	}

	getSearchTextFieldValue() {
		return this.searchTextFieldValue;
	}

	isSearchBtnAvailable() {
		return this.searchTextFieldValue !== undefined && this.searchTextFieldValue.length >= 3;
	}
}
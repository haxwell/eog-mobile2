import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { SearchPage } from '../../search/search.page';

import { environment } from '../../../_environments/environment';

@Component({
  selector: 'easyah-header',
  templateUrl: 'easyah-header.html',
  styleUrls: ['./easyah-header.scss']
})
export class EasyahHeader {

	searchTextFieldValue = undefined;

	constructor(private _router: Router, private _menuCtrl: MenuController) {
		if ( !environment.production )
			this.searchTextFieldValue = 'denver'
	}

	onMenuBtnClick(evt) {
		this._menuCtrl.enable(true, "main");
		this._menuCtrl.open("main");
	}

	onSearchBtnTap(evt) {
		this._router.navigate(['/search/' + this.searchTextFieldValue]);
	}

	onSearchTextFieldChanged(evt) {
		this.searchTextFieldValue = evt.srcElement.value;
		console.log(this.searchTextFieldValue);
	}

	getSearchTextFieldValue() {
		return this.searchTextFieldValue;
	}

	isSearchBtnAvailable() {
		return this.searchTextFieldValue !== undefined && this.searchTextFieldValue.length >= 3;
	}
}
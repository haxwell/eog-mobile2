import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
// import { SearchPage } from '../../search/search.page';

import { environment } from '../../../_environments/environment';

@Component({
  selector: 'easyah-header-component',
  templateUrl: 'easyah-header.component.html',
  styleUrls: ['./easyah-header.component.scss']
})
export class EasyahHeader {

	searchTextFieldValue = undefined;

	constructor(private _router: Router, private _menuCtrl: MenuController) {
		if ( !environment.production )
			this.searchTextFieldValue = 'denver'
	}

	onMenuBtnClick(evt) {
		this._menuCtrl.enable(true, "main").then((data) => {
			this._menuCtrl.open("main").then((b) => {
				// do nothing
			});
		});
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
import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
    selector: 'page-privacy-policy',
    templateUrl: './privacy-policy.page.html'
})
export class PrivacyPolicyPage {

    constructor(private _location: Location ) {

    }

    ngOnInit() {

    }

    onGoBackBtnTap(event) {
    	this._location.back();
    }

}
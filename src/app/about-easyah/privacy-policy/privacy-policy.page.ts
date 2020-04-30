import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'page-privacy-policy',
    templateUrl: './privacy-policy.page.html'
})
export class PrivacyPolicyPage {

    constructor(private _router: Router ) {

    }

    ngOnInit() {

    }

    onGoBackBtnTap(event) {
        this._router.navigate(['/about-easyah']);
    }

}
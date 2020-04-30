import { Component } from '@angular/core';
import { Router } from '@angular/router';


@Component({
    selector: 'page-about-easyah',
    templateUrl: 'about-easyah.page.html',
    styleUrls: ['./about-easyah.page.scss']
})
export class AboutEasyahPage {

    constructor(private _router: Router  ) {

    }

    ngOnInit() {

    }

    onPrivacyPolicyBtnTap() {
        this._router.navigate(['/about-easyah/privacy-policy']);
    }

    onTutorialsBtnTap() { 
        this._router.navigate(['/about-easyah/tutorials-list']);
    }
}
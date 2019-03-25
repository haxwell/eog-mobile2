import { Injectable } from '@angular/core';

import { ToastController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class ToastService { 

	constructor(private _toastCtrl: ToastController) {

	}

	async show(options) {
	    const toast = await this._toastCtrl.create(options);

	    return await toast.present();
	}

}
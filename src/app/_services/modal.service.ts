import { Injectable } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class ModalService { 

	cache = []

	constructor(private _modalCtrl: ModalController) {

	}

	async show(aComponent, obj = undefined) {
		let options = { component: aComponent };

		if (obj) {
			options["componentProps"] = obj.props;
		}

	    this.cache[aComponent] = await this._modalCtrl.create(options)
	    
	    if (obj && obj.onDidDismissFunc)
	    	await this.cache[aComponent].onDidDismiss(obj["onDidDismissFunc"]);

	    return await this.cache[aComponent].present();
	}

	async dismiss(aComponent, rtnPromise = undefined) {
		if (this.cache[aComponent])
			this.cache[aComponent].dismiss(rtnPromise);
	}

}
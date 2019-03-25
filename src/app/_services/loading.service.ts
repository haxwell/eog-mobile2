import { Injectable } from '@angular/core';

import { LoadingController } from '@ionic/angular';

@Injectable({
	providedIn: 'root'
})
export class LoadingService { 

	loading = undefined

	constructor(private _ctrl: LoadingController) {

	}

	async show(options, onDidDismissFunc = undefined) {
	    this.loading = await this._ctrl.create(options)
	    
	    if (onDidDismissFunc)
	    	await this.loading.onDidDismiss(onDidDismissFunc);

	    return await this.loading.present();
	}

	async dismiss() {
		if (this.loading)
			this.loading.dismiss();
	}

}
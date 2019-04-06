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

	    console.log("calling to display loading spinner")
	    return await this.loading.present();
	}

	async dismiss() {
		if (this.loading) {
			let temp = this.loading;
			this.loading = undefined;

			temp.dismiss();
			console.log("loading spinner dismissed")
		} else {
			console.log("call to dismiss spinner, but none set");
		}
	}

}
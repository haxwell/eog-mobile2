import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ModelService {

	model = undefined;

	constructor() { }

	setModel(model) {
		this.model = model;
	}

	getModel() {
		return this.model;
	}
}

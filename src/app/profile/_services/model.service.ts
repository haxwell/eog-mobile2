import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ModelServiceP {

	model = undefined;
	props = undefined;

	constructor() { }

	setModel(model) {
		this.model = model;
	}

	getModel() {
		return this.model;
	}

	getProps() {
	}

	setProps(props) {
		this.props = props;
	}
}

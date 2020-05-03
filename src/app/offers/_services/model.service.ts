import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ModelService {

	model = undefined;
	reply = undefined;
	props = undefined;

	constructor() { }

	setModel(model) {
		this.model = model;
	}

	getModel() {
		return this.model;
	}

	getProps() {
		return this.props;
	}

	setProps(props) {
		this.props = props;
	}

	setReply(r) {
		this.reply = r;
	}

	getReply() {
		return this.reply;
	}
}

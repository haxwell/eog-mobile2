import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModelTransformingService {

	/**
		This class asynchronously fires off tasks, who's purpose is to
		update (transform) a model.

		The tasks are independent, they should not depend on any attribute
		outside of their perview being present in the model.

		Add a transformer func like 
			(model) => { // call an api. set the results in the model }

		then call transform(), passing in your model, to fire all the 
		transformers off.
	*/

	transformers = [];
	activeCount = 0;

	constructor() {

	}

	addTransformer(func) {
		this.transformers.push(func);
	}

	transformPromise = undefined;
	transform(model) {

		let self = this;

		if (!self.transformPromise) {

			self.transformPromise = new Promise((resolve, reject) => {
				if (self.transformers.length === 0)
					resolve(model);

				self.transformers.forEach((f) => {
					self.activeCount++
					setTimeout(() => {
						f(model, () => { --self.activeCount; if (!self.activeCount) resolve(model); })
					}, 275);
				})
			})

		}

		return self.transformPromise;
	}
}
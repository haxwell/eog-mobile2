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
			(model, done) => { 
				// call an api. set the results in the model 
				// call done() to finish the transformation func
			}

		then call transform(), passing in your model, to fire all the 
		transformers off.
	*/

	transformers = [];
	transformPromise = undefined;
	activeCount = 0;

	constructor() {

	}

	reset() {
		this.transformPromise = undefined;
		console.log("model transforming service promise has been reset. expect calls to transformer functions.")
	}

	addTransformer(func) {
		this.transformers.push(func);
	}

	clearAllTransformers() {
		this.transformers = [];
	}

	transform(model) {

		let self = this;

		console.log("beginning TRANSFORM on model")

		if (!self.transformPromise) {

			console.log("model transform promise was not yet set, so now beginning to iterate through all the transformers")

			self.transformPromise = new Promise((resolve, reject) => {
				if (self.transformers.length === 0)
					resolve(model);

				self.transformers.forEach((f) => {
					self.activeCount++
					setTimeout(() => {
						f(model, (id) => { --self.activeCount; console.log(id.toUpperCase() + " is done."); console.log(self.activeCount + " transformers remaining"); if (!self.activeCount) resolve(model); })
					}, 275);
				})
			})

		}

		return self.transformPromise;
	}
}

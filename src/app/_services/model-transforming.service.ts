import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModelTransformingService {

	transformers = [];
	currFuncDone = undefined
	currFunc = undefined;
	currFuncIndex = 0;

	constructor() {

	}

	addTransformer(func) {
		this.transformers.push(func);
	}

	transformPromise = undefined;
	transform(model) {
		let self = this;
		let activeCount = 0;

		if (!self.transformPromise) {
			self.transformPromise = new Promise((resolve, reject) => {
				while (activeCount < self.transformers.length) {
					setTimeout(() => {
						self.transformers[activeCount++](model, () => { activeCount--; })
					}, 275);
				}

				let iterations = 0;
				while (activeCount > 0 && iterations++ > 1000) { // TODO make this smarter, it should take a param for a number of seconds rather than iterations
					setTimeout(() => {
						// do nothing, we're waiting for all the transformers to call done()
					}, 275);
				}

				if (activeCount === 0) {
					resolve(model);
				} else {
					reject(model);
				}
			})
		}

		return self.transformPromise;
	}
}

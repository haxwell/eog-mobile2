
// The point of this class is to allow calling a function, getting a promise, 
//  and saving it. Then using the promise over and over, rather than making 
//  a new promise and new api call.

// It takes an ID, the result ID, and maps it to a promise, which is the result
//  of a function.

// So for instance the result ID could be the user ID, and the function, a call
//  to download a file and return the local filename. You could call that function
//  over and over, and only call the API once.

// Results are cached, and if they get older than a user-defined length of time,
//  they are discarded on the subsequent call for those results. A call to the 
//  function then occurs, and its results are cached.

export class FunctionPromiseService { 
	
	results = {};
	funcs = {};

	freshnessLengthInMillis = 10 * 1000; // ten seconds

	constructor() {

	}

	reset(resultKey) {
		this.results[resultKey] = undefined;
	}

	initFunc(funcKey, func) {
		this.funcs[funcKey] = func;
	}

	setFreshnessFactorInMillis(m) {
		this.freshnessLengthInMillis = m;
	}

	get(resultKey, funcKey, data) {
		var rtn = undefined;
		var timestamp = new Date().getTime();

		if (this.results[resultKey] !== undefined) {
			
			if (this.results[resultKey]["timestamp"] + this.freshnessLengthInMillis < timestamp) {
				this.reset(resultKey);
			} else {
				return this.results[resultKey]["results"];
			}
		}

		let func = this.funcs[funcKey];

		if (func !== undefined) {
			this.results[resultKey] = {timestamp: timestamp, results: func(data)};
			rtn = this.results[resultKey]["results"];
		} else {
			rtn = undefined;
		}

		return rtn;
	}

}

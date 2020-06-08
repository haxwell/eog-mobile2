import { Constants } from '../src/_constants/constants'


export class UserServiceMock {
	public getCurrentUser(): any { 
	    return {id:1,name:"eogadmin",realname:"Eog A. Admin",email:"admin@eog.com",phone:"(303) 555-1212",enabled:1};
	};
}



import { of } from 'rxjs';
export class ApiServiceMock {
	public get(url: string, dataToBeReturned: any) {
		return of(dataToBeReturned);
	}	
}

export class ProfileKeywordApiServiceMock extends ApiServiceMock {
	public get(url: string) {
		return super.get(url, {keywords: [{text: 'keyword1'}, {text: 'keyword2'}, {text: 'keyword3'}]})
	}
}





export class PictureServiceMock {
	
}




export class OfferCollectionServiceMock {

	public resetModel(): any {

	}

	public getModel(): any {
		return {};
	}
}

export class OfferModelServiceMock {
	public setOfferImageOrientation(offer) : any {

	}
}



export class NotificationServiceMock {
	public get(forceUpdate) {
		return new Promise((resolve, reject) => {
			resolve({data: 'fakeData'});
		})
	}
}



export class RequestsServiceMock {
	public getIncomingRequestsForCurrentUser() {
		return new Promise((resolve, reject) => {
			resolve([{ offer: {id: 1, title: 'Offer 1'}}, { offer: {id: 2, title: 'Offer 2'}}, { offer: {id: 3, title: 'Offer 3'}}])
		})
	}
}



export class RequestMetadataServiceMock {

	map = {};
	_constants = new Constants();

	RequestMetadataServiceMock() {
		this.map[this._constants.FUNCTION_KEY_REQUEST_IS_IN_PROGRESS] = false;
		this.map[this._constants.FUNCTION_KEY_REQUEST_IS_COMPLETED_AWAITING_CONFIRMATION] = false;
	}

	public init() {
		return;
	}

	public setReturnValue(key, val) {
		this.map[key] = val;
	}

	public getMetadataValue(obj, key) {
		return this.map[key];
	}
}
import { Constants } from '../src/_constants/constants'


export class UserServiceMock {
	model = {id:1,name:"eogadmin",realname:"Eog A. Admin",email:"admin@eog.com",phone:"(303) 555-1212",enabled:1};

	public getCurrentUser(): any { 
	    return this.model;
	};

	public getUser(userId, force): any {
		return new Promise((resolve, reject) => {
			resolve({id:userId,name:"eoguser1",realname:"Eog User One",email:"eog1@eog.com",phone:"(303) 555-1213",enabled:1});
		})
	};
}


export class UserPreferencesServiceMock {
	public getPreference(key: string, force: boolean) {
		return new Promise((resolve, reject) => {
			resolve({ pref: undefined });
		})
	}
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

export class ListAllOffersPageApiServiceMock extends ApiServiceMock {
	public get(url: string) {
		return super.get(url, [{ offer: {id: 1, title: 'Offer 1'}}, { offer: {id: 2, title: 'Offer 2'}}, { offer: {id: 3, title: 'Offer 3'}}])
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
	public model = {    "id": 1,
				    "userId": 4,
				    "description": "Board Certified Dentist since 1987. Millions of teeth served.",
				    "title": "Dentist Extraordinaire",
				    "quantity": 1,
				    "quantityDescription": "offer",
				    "requiredUserRecommendations": [],
				    "keywords": [
				        {
				            "id": 4,
				            "text": "Denver"
				        },
				        {
				            "id": 2,
				            "text": "dentist"
				        }
				    ],
				    "requiredPointsQuantity": 1,
				    "archiveDate": null,
				    "lastUpdated": 1591129100000,
				    "createDate": 1591129098000,
				    "hasAnAssociatedImage": false
		};

	public init() {
		
	}

	public get(offerId: number) {
		this.model['id'] = offerId;
		return this.model;
	}

	public waitingPromise(offerId: number) {
		return new Promise((resolve, reject) => {
			this.model['id'] = offerId;
			resolve(this.model);
		})
	}

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
	public getModel() {
		return {
	        "id": 1,
	        "requestingUserId": 1,
	        "directionallyOppositeUser": {
	            "id": 1,
	            "referringUserId": null,
	            "roles": [
	                {
	                    "id": 1,
	                    "name": "EOG_USER_ROLE_ADMIN"
	                }
	            ],
	            "name": "eogadmin",
	            "realname": "Eog A. Admin",
	            "email": "haxwell@gmail.com",
	            "phone": "3035551212",
	            "enabled": 1,
	            "latitude": 39.729431,
	            "longitude": -104.831917
	        },
	        "offer": {
	            "id": 3,
	            "userId": 3,
	            "description": "Senior Professor at the French Society of Colorado",
	            "title": "French Teacher",
	            "quantity": 1,
	            "quantityDescription": "offer",
	            "requiredUserRecommendations": [],
	            "keywords": [
	                {
	                    "id": 10,
	                    "text": "french teacher"
	                },
	                {
	                    "id": 5,
	                    "text": "children"
	                },
	                {
	                    "id": 4,
	                    "text": "Denver"
	                }
	            ],
	            "requiredPointsQuantity": 1,
	            "archiveDate": null,
	            "lastUpdated": 1591129100000,
	            "createDate": 1591129098000,
	            "hasAnAssociatedImage": false
	        },
	        "requestingStatusId": null,
	        "deliveringStatusId": 1,
	        "archiveDate": null,
	        "canRequestAgainDate": null,
	        "created": 1591129103000,
	        "declinedReasonCode": null,
	        "escrowedPointCount": 0,
	        "requestMessage": null,
	        "lastUpdated": 1591129112000
	    }		
	}

	public getIncomingRequestsForCurrentUser() {
		return new Promise((resolve, reject) => {
			resolve([{ offer: {id: 1, title: 'Offer 1', requiredPointsQuantity: 1}}, { offer: {id: 2, title: 'Offer 2', requiredPointsQuantity: 1}}, { offer: {id: 3, title: 'Offer 3', requiredPointsQuantity: 1}}])
		})
	}

	public cancelIncomingRequest() {
		return new Promise((resolve, reject) => {
			resolve({ });
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



export class GeolocationServiceMock {
	public getCityStateFromLatlong(lat, long) {
		return new Promise((resolve, reject) => {
			resolve({city: 'Denver', state: 'CO'});
		})
	}
}



export class ProfileModelServiceMock {
	model = {    
			"id": 3,
		    "userId": 3,
		    "description": "I am the first regular user in the EOG database",
		    "allTimePointCount": 6,
		    "keywords": [
		        {
		            "id": 5,
		            "text": "children"
		        },
		        {
		            "id": 10,
		            "text": "french teacher"
		        },
		        {
		            "id": 4,
		            "text": "Denver"
		        }
		    ],
		    "archivedRequestCount": 0,
		    "disputedRequestCount": 0,
		    "mostRecentDisputedRequestTimestamp": null
		}

	public init() {

	}

	public get(userId) {
		this.model['id'] = userId;
		return this.model;
	}
}


export class InteractionsServiceMock {
	rtnValue = true;

	public setReturnValue(val) {
		this.rtnValue = val;
	}

	public isFirstInteractionBetween(userId1, userId2) {
		return this.rtnValue;
	}
}

export class InteractionsModelServiceMock {
	interactionsCount = 0;

	public getInteractionsBetween(userId1, userId2) {
		return this.interactionsCount;
	}

	public setNumberOfInteractionsToReturn(count) {
		this.interactionsCount = count;
	}
}



export class RecommendationServiceMock {
	model = [{
        "receivingUserId": 3,
        "providingUserId": 5,
        "timestamp": 1528656785000,
        "escrowedRequestId": null,
        "archiveDate": null
    }]

	public init() {

	}

	public getIncomingRecommendations() {
		return new Promise((resolve, reject) => {
			resolve(this.model);
		})
	}
}
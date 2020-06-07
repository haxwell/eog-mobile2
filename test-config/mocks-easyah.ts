

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
import { NgModule, Component } from '@angular/core';
import { ProfileModelService } from './profile-model.service';


// The point of this module is to provide an instance of the ModelTranformingService
//  for use in testing.


@Component({
  selector: 'profilemodelservicecomponent',
  template: `<div></div>`
})
export class ProfileModelServiceComponent {
	constructor(private srvc: ProfileModelService) {

	}

	getService(): ProfileModelService {
		return this.srvc;
	}
}

@NgModule({
	declarations: [ ProfileModelServiceComponent ],
	providers: [ ProfileModelService ]
})

/* tslint:disable */ class ProfileModelServiceComponentModule { } /* tslint:enable */
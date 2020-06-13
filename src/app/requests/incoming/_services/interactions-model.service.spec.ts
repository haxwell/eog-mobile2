import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { InteractionsModelService } from './interactions-model.service';

import { Constants } from '../../../../_constants/constants';

describe('InteractionsModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({
	imports: [ HttpClientModule ]
	,providers: [
		{ provide: Constants, useClass: Constants }
	]
  }));

  it('should be created', () => {
    const service: InteractionsModelService = TestBed.get(InteractionsModelService);
    expect(service).toBeTruthy();
  });
});

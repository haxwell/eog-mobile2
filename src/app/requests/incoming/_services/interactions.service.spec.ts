import { TestBed } from '@angular/core/testing';

import { InteractionsService } from './interactions.service';
import { InteractionsModelService } from './interactions-model.service';
import { InteractionsModelServiceMock } from '../../../../../test-config/mocks-easyah'

describe('InteractionsService', () => {
  let mockInteractionsModelService = new InteractionsModelServiceMock();

  beforeEach(() => TestBed.configureTestingModule({
	providers: [
		{ provide: InteractionsModelService, useValue: mockInteractionsModelService }
	]
}));

  it('should be created', () => {
    const service: InteractionsService = TestBed.get(InteractionsService);
    expect(service).toBeTruthy();
  });
});

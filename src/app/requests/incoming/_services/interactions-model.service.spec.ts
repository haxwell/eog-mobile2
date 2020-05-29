import { TestBed } from '@angular/core/testing';

import { InteractionsModelService } from './interactions-model.service';

describe('InteractionsModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InteractionsModelService = TestBed.get(InteractionsModelService);
    expect(service).toBeTruthy();
  });
});

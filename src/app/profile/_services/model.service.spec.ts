import { TestBed } from '@angular/core/testing';

import { ModelServiceP } from './model.service';

describe('ModelServiceP', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ModelServiceP = TestBed.get(ModelServiceP);
    expect(service).toBeTruthy();
  });
});

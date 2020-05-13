import { TestBed } from '@angular/core/testing';

import { ListAllService } from './list-all.service';

describe('ListAllService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListAllService = TestBed.get(ListAllService);
    expect(service).toBeTruthy();
  });
});

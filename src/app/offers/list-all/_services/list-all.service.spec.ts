import { TestBed } from '@angular/core/testing';

import { ListAllOfferService } from './list-all.service';

describe('ListAllOfferService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ListAllOfferService = TestBed.get(ListAllOfferService);
    expect(service).toBeTruthy();
  });
});

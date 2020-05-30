import { TestBed } from '@angular/core/testing';

import { UserGeographyService } from './user-geography.service';

describe('UserGeographyService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserGeographyService = TestBed.get(UserGeographyService);
    expect(service).toBeTruthy();
  });
});

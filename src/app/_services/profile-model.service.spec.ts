import { TestBed } from '@angular/core/testing';

import { ProfileModelService } from './profile-model.service';

describe('ProfileModelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProfileModelService = TestBed.get(ProfileModelService);
    expect(service).toBeTruthy();
  });
});

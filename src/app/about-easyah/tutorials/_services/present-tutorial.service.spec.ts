import { TestBed } from '@angular/core/testing';

import { PresentTutorialService } from './present-tutorial.service';

describe('PresentTutorialService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PresentTutorialService = TestBed.get(PresentTutorialService);
    expect(service).toBeTruthy();
  });
});

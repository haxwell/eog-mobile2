import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { UserGeographyService } from './user-geography.service';

describe('UserGeographyService', () => {
  beforeEach(() => TestBed.configureTestingModule({
  	imports: [ HttpClientModule ]
  }));

  it('should be created', () => {
    const service: UserGeographyService = TestBed.get(UserGeographyService);
    expect(service).toBeTruthy();
  });
});

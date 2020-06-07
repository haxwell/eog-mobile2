import { TestBed } from '@angular/core/testing';

import { PresentTutorialService } from './present-tutorial.service';

import { ModalController } from '@ionic/angular'

describe('PresentTutorialService', () => {
  beforeEach(() => TestBed.configureTestingModule({
  	providers: [
  		{ provide: ModalController, useValue: { create: (options) => { }} }
  	]
  }));

  it('should be created', () => {
    const service: PresentTutorialService = TestBed.get(PresentTutorialService);
    expect(service).toBeTruthy();
  });
});

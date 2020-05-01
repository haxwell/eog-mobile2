import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DeclinePage } from './decline.page';

describe('DeclinePage', () => {
  let component: DeclinePage;
  let fixture: ComponentFixture<DeclinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DeclinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

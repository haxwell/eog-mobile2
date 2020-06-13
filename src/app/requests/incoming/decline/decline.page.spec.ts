import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

import { DeclinePage } from './decline.page';

describe('DeclinePage', () => {
  let component: DeclinePage;
  let fixture: ComponentFixture<DeclinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeclinePage ],
      imports: [IonicModule.forRoot(), FormsModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DeclinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

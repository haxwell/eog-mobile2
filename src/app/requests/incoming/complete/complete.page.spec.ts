import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { CompletePage } from './complete.page';

describe('Incoming CompletePage', () => {
  let component: CompletePage;
  let fixture: ComponentFixture<CompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletePage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(CompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TutorialOutgoingRequestMadePage } from './tutorial-outgoing-request-made.page';

describe('TutorialOutgoingRequestMadePage', () => {
  let component: TutorialOutgoingRequestMadePage;
  let fixture: ComponentFixture<TutorialOutgoingRequestMadePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialOutgoingRequestMadePage ],
      imports: [IonicModule.forRoot(), FormsModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialOutgoingRequestMadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

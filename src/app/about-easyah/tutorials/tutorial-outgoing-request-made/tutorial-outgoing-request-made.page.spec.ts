import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TutorialOutgoingRequestMadePage } from './tutorial-outgoing-request-made.page';

describe('TutorialOutgoingRequestMadePage', () => {
  let component: TutorialOutgoingRequestMadePage;
  let fixture: ComponentFixture<TutorialOutgoingRequestMadePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialOutgoingRequestMadePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialOutgoingRequestMadePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

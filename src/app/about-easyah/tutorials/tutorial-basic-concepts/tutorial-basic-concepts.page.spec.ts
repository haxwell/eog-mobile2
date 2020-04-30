import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TutorialBasicConceptsPage } from './tutorial-basic-concepts.page';

describe('TutorialBasicConceptsPage', () => {
  let component: TutorialBasicConceptsPage;
  let fixture: ComponentFixture<TutorialBasicConceptsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialBasicConceptsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialBasicConceptsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

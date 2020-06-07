import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TutorialBasicConceptsPage } from './tutorial-basic-concepts.page';

describe('TutorialBasicConceptsPage', () => {
  let component: TutorialBasicConceptsPage;
  let fixture: ComponentFixture<TutorialBasicConceptsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialBasicConceptsPage ],
      imports: [IonicModule.forRoot(), FormsModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialBasicConceptsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

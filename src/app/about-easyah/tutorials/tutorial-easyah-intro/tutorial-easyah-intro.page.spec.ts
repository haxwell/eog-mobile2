import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TutorialEasyahIntroPage } from './tutorial-easyah-intro.page';

describe('TutorialEasyahIntroPage', () => {
  let component: TutorialEasyahIntroPage;
  let fixture: ComponentFixture<TutorialEasyahIntroPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialEasyahIntroPage ],
      imports: [IonicModule.forRoot(), FormsModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialEasyahIntroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

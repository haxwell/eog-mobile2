import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TutorialNewAccountPage } from './tutorial-new-account.page';

describe('TutorialNewAccountPage', () => {
  let component: TutorialNewAccountPage;
  let fixture: ComponentFixture<TutorialNewAccountPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialNewAccountPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialNewAccountPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

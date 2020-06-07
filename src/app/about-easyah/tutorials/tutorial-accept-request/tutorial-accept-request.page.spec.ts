import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TutorialAcceptRequestPage } from './tutorial-accept-request.page';

describe('TutorialAcceptRequestPage', () => {
  let component: TutorialAcceptRequestPage;
  let fixture: ComponentFixture<TutorialAcceptRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialAcceptRequestPage ],
      imports: [IonicModule.forRoot(), FormsModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialAcceptRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

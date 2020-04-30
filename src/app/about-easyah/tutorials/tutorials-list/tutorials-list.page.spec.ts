import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TutorialsListPage } from './tutorials-list.page';

describe('TutorialsListPage', () => {
  let component: TutorialsListPage;
  let fixture: ComponentFixture<TutorialsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialsListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotCompletePage } from './not-complete.page';

describe('NotCompletePage', () => {
  let component: NotCompletePage;
  let fixture: ComponentFixture<NotCompletePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotCompletePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotCompletePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

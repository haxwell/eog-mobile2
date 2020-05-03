import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RulePage } from './rule.page';

describe('RulePage', () => {
  let component: RulePage;
  let fixture: ComponentFixture<RulePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RulePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

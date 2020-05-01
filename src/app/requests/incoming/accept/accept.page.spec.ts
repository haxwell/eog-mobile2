import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcceptPage } from './accept.page';

describe('AcceptPage', () => {
  let component: AcceptPage;
  let fixture: ComponentFixture<AcceptPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcceptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PermanentlyDismissPage } from './permanently-dismiss.page';

describe('PermanentlyDismissPage', () => {
  let component: PermanentlyDismissPage;
  let fixture: ComponentFixture<PermanentlyDismissPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PermanentlyDismissPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PermanentlyDismissPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

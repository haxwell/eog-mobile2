import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AboutEasyahPage } from './about-easyah.page';

describe('AboutEasyahPage', () => {
  let component: AboutEasyahPage;
  let fixture: ComponentFixture<AboutEasyahPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutEasyahPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutEasyahPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

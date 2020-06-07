import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { AboutEasyahPage } from './about-easyah.page';

import { EasyahHeaderModule } from '../easyah-header/easyah-header.module';

describe('AboutEasyahPage', () => {
  let component: AboutEasyahPage;
  let fixture: ComponentFixture<AboutEasyahPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutEasyahPage ],
      imports: [IonicModule.forRoot(), EasyahHeaderModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutEasyahPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';

import { TutorialsListPage } from './tutorials-list.page';

import { EasyahHeaderModule } from '../../../easyah-header/easyah-header.module';

describe('TutorialsListPage', () => {
  let component: TutorialsListPage;
  let fixture: ComponentFixture<TutorialsListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorialsListPage ],
      imports: [IonicModule.forRoot(), EasyahHeaderModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TutorialsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

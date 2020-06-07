import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { EditPage } from './edit.page';

describe('Offers EditPage', () => {
  let component: EditPage;
  let fixture: ComponentFixture<EditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPage ],
      imports: [IonicModule.forRoot(), EasyahHeaderModule, HttpClientModule]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EasyahHeader } from './easyah-header.component';

describe('EasyahHeader', () => {
  let component: EasyahHeader;
  let fixture: ComponentFixture<EasyahHeader>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EasyahHeader ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EasyahHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

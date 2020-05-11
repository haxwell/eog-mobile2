import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ListAllPage } from './list-all.page';

describe('ListAllPage', () => {
  let component: ListAllPage;
  let fixture: ComponentFixture<ListAllPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

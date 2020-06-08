import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { EasyahCommonModule } from '../../common/easyah-common.module'
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { Constants } from '../../../_constants/constants';

import { ListAllPage } from './list-all.page';

describe('ListAllPage', () => {


  // WILO>> I think because EasyahCommonModule includes some stuff that includes PictureService, then
  //  this test is tripping about PictureService. Even though it doesn't use it. SOOO EasyahCommonModule
  //  needs to be broken into modules.


  let component: ListAllPage;
  let fixture: ComponentFixture<ListAllPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAllPage ],
      providers: [ { provide: Constants, useClass: Constants }],
      imports: [IonicModule.forRoot(), HttpClientModule, RouterTestingModule, EasyahHeaderModule, EasyahCommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ListAllPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

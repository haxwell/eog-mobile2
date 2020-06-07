import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';

import { IonicModule } from '@ionic/angular';
import { EasyahHeaderModule } from '../../easyah-header/easyah-header.module';

import { EditPage } from './edit.page';

import { ApiService } from '../../../app/_services/api.service'
import { ProfileKeywordApiServiceMock } from '../../../../test-config/mocks-easyah'
import { UserService } from '../../../app/_services/user.service'
import { UserServiceMock } from '../../../../test-config/mocks-easyah'

describe('Keyword EditPage', () => {
  let component: EditPage;
  let fixture: ComponentFixture<EditPage>;

  let mockUserService: UserServiceMock;
  let mockApiService: ProfileKeywordApiServiceMock;

  beforeEach(async(() => {
    mockUserService = new UserServiceMock();
    mockApiService = new ProfileKeywordApiServiceMock();

    TestBed.configureTestingModule({
      declarations: [ EditPage ],
      imports: [IonicModule.forRoot(), EasyahHeaderModule, HttpClientModule, RouterTestingModule],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

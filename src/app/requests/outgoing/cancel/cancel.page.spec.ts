import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { RequestsService }   from '../../../../app/_services/requests.service';
import { RequestsServiceMock } from '../../../../../test-config/mocks-easyah'

import { ModelService } from '../_services/model.service';

import { CancelPage } from './cancel.page';

describe('Outgoing CancelPage', () => {
  let component: CancelPage;
  let fixture: ComponentFixture<CancelPage>;

  let mockRequestsService: RequestsServiceMock;

  beforeEach(async(() => {
    mockRequestsService = new RequestsServiceMock();

    TestBed.configureTestingModule({
      declarations: [ CancelPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule]
      ,providers: [
        { provide: RequestsService, useValue: mockRequestsService }
        ,{ provide: ModelService, useValue: { getModel: () => { return mockRequestsService.getModel(); }}}
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CancelPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


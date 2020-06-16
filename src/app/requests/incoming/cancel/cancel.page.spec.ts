import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { RequestsService }   from '../../../../app/_services/requests.service';
import { RequestsServiceMock } from '../../../../../test-config/mocks-easyah'
import { OfferModelServiceMock } from '../../../../../test-config/mocks-easyah'
import { UserServiceMock } from '../../../../../test-config/mocks-easyah'
import { ModelService } from '../_services/model.service'

import { CancelPage } from './cancel.page';

describe('Incoming CancelPage', () => {
  let component: CancelPage;
  let fixture: ComponentFixture<CancelPage>;

  let mockRequestsService: RequestsServiceMock;

  beforeEach(async(() => {
    let _offerModelServiceMock = new OfferModelServiceMock();
    let _userServiceMock = new UserServiceMock();

    mockRequestsService = new RequestsServiceMock();

    let incomingOfferCancelPageModelServiceMock = { getModel: () => { return { offer: _offerModelServiceMock.model, directionallyOppositeUser: _userServiceMock.model }}}

    TestBed.configureTestingModule({
      declarations: [ CancelPage ],
      imports: [IonicModule.forRoot(), RouterTestingModule, HttpClientModule]
      ,providers: [
        { provide: RequestsService, useValue: mockRequestsService }
        ,{ provide: ModelService, useValue: incomingOfferCancelPageModelServiceMock }
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

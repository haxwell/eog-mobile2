import { TestBed } from '@angular/core/testing';

import { FunctionPromiseServiceComponent } from './function-promise.service.component';
import { FunctionPromiseService } from './function-promise.service';

describe('FunctionPromise Service', () => {

	let fixture;
	let component;

	beforeEach(() => {
		TestBed.configureTestingModule({
		declarations: [
			FunctionPromiseServiceComponent
		],
		providers: [
			FunctionPromiseService
		]});

  	fixture = TestBed.createComponent(FunctionPromiseServiceComponent);
		component = fixture.componentInstance;
	});


  it('should be created', () => {
    expect(component instanceof FunctionPromiseServiceComponent).toBe(true);

    let service = component.getService();
    expect(service instanceof FunctionPromiseService).toBe(true);
  });


  it('should return undefined if called before setting any function/key pairs', () => {
    let service = component.getService();

    let resultKey = "resultKey";
    let funcKey = "funcKey";
    let data = {foo: 1, bar: 17};

    let offer = service.get(resultKey, funcKey, data);
    expect(offer).toBe(undefined);
  })

  it('calls our given function as expected considering the cache expiration time passing', (done) => {
    let service = component.getService();

    let resultKey = "resultKey";
    let funcKey = "funcKey";
    let data = {foo: 1, bar: 17};

    let count = 0;
    let func = { func: (data) => { return "response " + count++; } };

    const funcSpy = spyOn(func, "func").and.callThrough();
    expect(funcSpy).not.toHaveBeenCalled();
    service.setFreshnessFactorInMillis(1500); // one point five seconds

    service.initFunc(funcKey, funcSpy);
      expect(funcSpy).not.toHaveBeenCalled();

    let response = service.get(resultKey, funcKey, data);
      expect(funcSpy).toHaveBeenCalled();
      expect(response).toEqual("response 0");

    funcSpy.calls.reset();

    setTimeout(() => {
      let response = service.get(resultKey, funcKey, data);
        expect(funcSpy).not.toHaveBeenCalled();
        expect(response).toEqual("response 0");
    }, 750);

    setTimeout(() => {
      response = service.get(resultKey, funcKey, data);
        expect(funcSpy).toHaveBeenCalled();
        expect(response).toEqual("response 1");
        done();
    }, 2075);
  })

});

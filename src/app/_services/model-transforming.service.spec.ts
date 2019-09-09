import { TestBed } from '@angular/core/testing';

import { ModelTransformingServiceComponent } from './model-transforming.service.component';
import { ModelTransformingService } from './model-transforming.service';

describe('ModelTransformingService', () => {

	let fixture
	let component;

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [
				ModelTransformingServiceComponent
			],
			providers: [
				ModelTransformingService
			]
		})
	
		fixture = TestBed.createComponent(ModelTransformingServiceComponent);
		component = fixture.componentInstance;	
	});

	it('fdsafd', () => {

	});

  xit('should be created', () => {
  	expect(component instanceof ModelTransformingServiceComponent).toBe(true);

    let service: ModelTransformingService = component.getService();
    expect(service instanceof ModelTransformingService).toBe(true);
  });

	it('should correctly update the model when given three transformer functions', () => {
		let service = component.getService();

		let model = { };

		let transformer1 = (model, done) => { model['transformer1-result'] = 1; done(); }
		let transformer2 = (model, done) => { setTimeout(() => { model['transformer2-result'] = 2; }, 5000); done(); }
		let transformer3 = (model, done) => { model['transformer3-result'] = 3; done(); }

		service.addTransformer(transformer1);
		service.addTransformer(transformer2);
		service.addTransformer(transformer3);

		service.transform(model).then((model) => {
			expect(model['transformer1-result']).toBe(1);
			expect(model['transformer2-result']).toBe(2);
			expect(model['transformer3-result']).toBe(4);
		});
	});

	it('should food', () => {
		
	})
	it('should fofsdod', () => {
		
	})

});

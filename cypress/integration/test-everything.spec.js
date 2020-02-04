import { environment } from '../../src/_environments/environment'

context('create a new user', () => {
	
	function beginCreateAccountTest() {
		cy.get('[data-test-id="create-account-button"]').click();
		cy.get('[data-test-id="create-account-page-title"').should('have.text', 'Create Account');
	}

	function slideThroughNSlides(count) {

		cy.get('ion-slides').should('exist');

		for (var i=0; i < count; i++) {
			cy.get('ion-slides')
				.trigger('mousedown', { which: 1 })
	   			.trigger('mousemove', 'left')
	   			.trigger('mouseup', { force: true })

			cy.wait(500);
		}
	}

	function dismissTheNewUserTutorialDialog() {
   		cy.get('[data-test-id=new-account-tutorial-modal-continue-btn]').should('exist');
   		cy.get('[data-test-id=new-account-tutorial-modal-continue-btn]').scrollIntoView();
   		cy.get('[data-test-id=new-account-tutorial-modal-continue-btn]').click({ force: true });

   		cy.get('ion-slides').should('not.exist');
	}

	function ensureTheSaveButtonIsNotEnabledInTheCreateAccountDialog() {
		cy.get('[data-test-id="create-account-save-button"]').should('exist');
		cy.get('[data-test-id="create-account-save-button"]').should('have.class', 'button-disabled');
	}

	function ensureTheSaveButtonIsEnabledInTheCreateAccountDialog() {
		cy.get('[data-test-id="create-account-save-button"]').should('exist');
		cy.get('[data-test-id="create-account-save-button"]').should('not.have.class', 'button-disabled');
	}

	function fillInTheCreateAccountDialog() {
		cy.get('[data-test-id=name-input]>input').type("Test Everything");
		cy.get('[data-test-id=phone-number-input]>input').type("0205551212");
		cy.get('[data-test-id=email-input]>input').type("test@haxwell.org");
		cy.get('[data-test-id=username-input]>input').type("testuser110419");
		cy.get('[data-test-id=password-input]>input').type("password11");
	}


	it('does the flow', () => {
		cy.server()

		cy.visit('http://localhost:8100/index.html')

		cy.request({ 
			method: 'DELETE', 
			url: environment.apiUrl + '/api/users?username=testuser110419', 
			headers: { Authorization: 'Basic ZW9nYWRtaW46cGFzc3dvcmQ=' } // eogadmin
		}).then((response) => {
			// create a brand new user

			// TODO: This pass will test the happy path of creating a user with NO referring user. Need to test the path when a referring user is provided, too.

			beginCreateAccountTest();
			slideThroughNSlides(3);

			dismissTheNewUserTutorialDialog();

			ensureTheSaveButtonIsNotEnabledInTheCreateAccountDialog();

			fillInTheCreateAccountDialog();

			ensureTheSaveButtonIsEnabledInTheCreateAccountDialog() 

			cy.get('[data-test-id="create-account-save-button"]').click();

			// this handles the alert saying "Hey we're gonna send you a Text!"
			cy.get('ion-alert').should('exist');
			cy.get('ion-alert').within(() => {
	        	// cy.route('POST', '/api/sendSMSChallengeCodeToPhoneNumber*');

	        	cy.get('button.e2e-sendCodeToPhoneNumberBtn').click()

		        cy.get('ion-alert').should('not.be.visible')
			})

			// this enters the code that supposedly came in the text
			cy.get('ion-alert').should('exist');
			cy.get('ion-alert').within(() => {
	        	// cy.route('POST', '/api/isAValidSMSChallengeCode*', {rtn: true})

	        	cy.get('input').type('12345')

	        	// TODO: test that the button cannot be clicked on when the type command above does not happen
	        	cy.get('button.e2e-submitChallengeCodeBtn').click()
	        	cy.wait(2000);
			})

			// this is an alert saying everything went just fine
			cy.get('ion-alert').should('exist');
			cy.get('ion-alert').within(() => {
	        	cy.route('POST', '/api/isAValidSMSChallengeCode*', {rtn: true})

	        	cy.get('button.e2e-account-successfully-created-btn').click()
			})


			//
			// WILO... Need to set up the eog-mobile repo... connect it with git hub.. clone that repo, copy our local changes in
			// probably the best way to go... and push our changes to prod. Run tests over prod. Try installing app on iphone, create user
			//  perhaps create admin tool to delete users.


			// after this is back to the home screen.

		}); // end THEN on DeleteUser

	})
})
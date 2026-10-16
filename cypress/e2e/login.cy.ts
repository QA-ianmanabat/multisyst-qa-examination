import { loginElements, secureAreaElements } from '../support/elements/loginElements';


describe('Scenario 1: Login Functionality', () => {
  let data: LoginData;

  before(() => {
    cy.fixture('loginData').then((loginData: LoginData) => {
      data = loginData;
    });
  });

  beforeEach(() => {
    cy.visitLoginPage();
  });

  it('Validate successful login with valid credentials', () => {
    cy.login(data.validUser.username, data.validUser.password);

    cy.url().should('include', data.paths.secure);
    cy.shouldShowFlashMessage(data.messages.loginSuccess);
    cy.get(secureAreaElements.pageHeader).should('contain.text', 'Secure Area');
    cy.get(secureAreaElements.logoutButton).should('be.visible');
  });

  it('Validate unsuccessful login fails with an invalid username', () => {
    cy.login(data.invalidUsername.username, data.invalidUsername.password);

    cy.url().should('include', data.paths.login);
    cy.shouldShowFlashMessage(data.messages.invalidUsername);
  });

  it('Validate unsuccessful login fails with an invalid password', () => {
    cy.login(data.invalidPassword.username, data.invalidPassword.password);

    cy.url().should('include', data.paths.login);
    cy.shouldShowFlashMessage(data.messages.invalidPassword);
  });

  it('Validate unsuccessful login fails with empty credentials', () => {
    cy.get(loginElements.usernameInput).should('have.value', '');
    cy.get(loginElements.passwordInput).should('have.value', '');

    cy.login(data.emptyCredentials.username, data.emptyCredentials.password);

    cy.url().should('include', data.paths.login);
    cy.shouldShowFlashMessage(data.messages.invalidUsername);
  });

  it('Validate logout functionality after successful login', () => {
    cy.login(data.validUser.username, data.validUser.password);
    cy.url().should('include', data.paths.secure);

    cy.logout();

    cy.url().should('include', data.paths.login);
    cy.shouldShowFlashMessage(data.messages.logoutSuccess);
  });
});

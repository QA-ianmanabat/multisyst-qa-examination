import { loginElements, secureAreaElements } from './elements/loginElements';
import { dynamicContentElements } from './elements/dynamicContentElements';
import { checkboxElements } from './elements/checkboxElements';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      // ----- Login -----
      /** Opens the login page and confirms it is displayed. */
      visitLoginPage(): Chainable<void>;
      /** Fills in the login form (skips empty values) and clicks Login. */
      login(username: string, password: string): Chainable<void>;
      /** Asserts the flash message contains the expected text. */
      shouldShowFlashMessage(message: string): Chainable<void>;
      /** Clicks Logout on the secure area page. */
      logout(): Chainable<void>;

      // ----- Dynamic Content -----
      /** Returns the text and image source of every content row as one string. */
      getDynamicContentSnapshot(expectedRowCount: number): Chainable<string>;
      /** Refreshes the page until the content differs from the initial content. */
      verifyDynamicContentChanges(
        expectedRowCount: number,
        maxAttempts: number
      ): Chainable<void>;

      // ----- Checkboxes -----
      /** Checks or unchecks the checkbox at the given index. */
      setCheckboxState(index: number, shouldBeChecked: boolean): Chainable<void>;
      /** Asserts the checkbox at the given index is checked or unchecked. */
      verifyCheckboxState(index: number, expectedChecked: boolean): Chainable<void>;
    }
  }
}

// ---------------------------------------------------------------- Login
Cypress.Commands.add('visitLoginPage', () => {
  cy.visit('/login');
  cy.get(loginElements.usernameInput).should('be.visible');
  cy.get(loginElements.passwordInput).should('be.visible');
  cy.get(loginElements.loginButton).should('be.visible');
});

Cypress.Commands.add('login', (username: string, password: string) => {
  // cy.type() throws on an empty string, so only type when a value exists
  if (username) {
    cy.get(loginElements.usernameInput).clear().type(username);
  }
  if (password) {
    cy.get(loginElements.passwordInput).clear().type(password, { log: false });
  }
  cy.get(loginElements.loginButton).click();
});

Cypress.Commands.add('shouldShowFlashMessage', (message: string) => {
  cy.get(loginElements.flashMessage)
    .should('be.visible')
    .and('contain.text', message);
});

Cypress.Commands.add('logout', () => {
  cy.get(secureAreaElements.logoutButton).click();
});

// ------------------------------------------------------- Dynamic Content
Cypress.Commands.add('getDynamicContentSnapshot', (expectedRowCount: number) => {
  return cy
    .get(dynamicContentElements.contentRows)
    .should('have.length', expectedRowCount)
    .then(($rows) => {
      return $rows
        .toArray()
        .map((row) => {
          const $row = Cypress.$(row);
          const imageSrc = $row.find(dynamicContentElements.rowImage).attr('src');
          const text = $row.find(dynamicContentElements.rowText).text().trim();
          return `${imageSrc}|${text}`;
        })
        .join('||');
    });
});

Cypress.Commands.add(
  'verifyDynamicContentChanges',
  (expectedRowCount: number, maxAttempts: number) => {
    cy.getDynamicContentSnapshot(expectedRowCount).then((initialContent) => {
      // The page picks content at random, so a refresh can occasionally
      // return the same content. Retry a few times before failing.
      const refreshAndCompare = (attempt: number): void => {
        cy.reload();
        cy.getDynamicContentSnapshot(expectedRowCount).then((currentContent) => {
          if (currentContent !== initialContent) {
            expect(currentContent, 'content after refresh').to.not.equal(initialContent);
            return;
          }
          if (attempt >= maxAttempts) {
            throw new Error(
              `Content did not change after ${maxAttempts} refreshes`
            );
          }
          cy.log(`Content unchanged on refresh ${attempt}, trying again`);
          refreshAndCompare(attempt + 1);
        });
      };
      refreshAndCompare(1);
    });
  }
);

// ------------------------------------------------------------ Checkboxes
Cypress.Commands.add(
  'setCheckboxState',
  (index: number, shouldBeChecked: boolean) => {
    const checkbox = cy.get(checkboxElements.checkboxes).eq(index);
    if (shouldBeChecked) {
      checkbox.check();
    } else {
      checkbox.uncheck();
    }
  }
);

Cypress.Commands.add(
  'verifyCheckboxState',
  (index: number, expectedChecked: boolean) => {
    cy.get(checkboxElements.checkboxes)
      .eq(index)
      .should(expectedChecked ? 'be.checked' : 'not.be.checked');
  }
);

export {};

import { dynamicContentElements } from '../support/elements/dynamicContentElements';

describe('Scenario 2: Dynamic Content', () => {
  let data: DynamicContentData;

  before(() => {
    cy.fixture('dynamicContentData').then((dynamicContentData: DynamicContentData) => {
      data = dynamicContentData;
    });
  });

  beforeEach(() => {
    cy.visit(data.path);
  });


  it('Validate content changes on page refresh', () => {
    cy.get(dynamicContentElements.contentRows)
      .should('have.length', data.expectedRowCount)
      .each(($row) => {
        cy.wrap($row).find(dynamicContentElements.rowImage).should('be.visible');
        cy.wrap($row).find(dynamicContentElements.rowText).should('not.be.empty');
      });

    cy.verifyDynamicContentChanges(data.expectedRowCount, data.maxRefreshAttempts);
  });

  it('Validate loading of visible static content', () => {
    cy.get(dynamicContentElements.staticContentLink)
      .should('be.visible')
      .click();

    cy.location('search').should('include', 'with_content=static');
    cy.get(dynamicContentElements.contentRows)
      .should('have.length', data.expectedRowCount)
      .each(($row) => {
        cy.wrap($row).find(dynamicContentElements.rowImage).should('be.visible');
        cy.wrap($row).find(dynamicContentElements.rowText).should('be.visible').and('not.be.empty');
      });
  });
});

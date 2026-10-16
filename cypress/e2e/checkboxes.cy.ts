
describe('Scenario 3: Checkboxes Interaction', () => {
  let data: CheckboxData;

  before(() => {
    cy.fixture('checkboxData').then((checkboxData: CheckboxData) => {
      data = checkboxData;
    });
  });

  beforeEach(() => {
    cy.visit(data.path);
  });

  it('Validate state of each checkbox', () => {
    data.checkboxes.forEach(({ index, initialChecked }) => {
      cy.verifyCheckboxState(index, initialChecked);
    });

    data.checkboxes.forEach(({ index, initialChecked }) => {
      cy.setCheckboxState(index, !initialChecked);
      cy.verifyCheckboxState(index, !initialChecked);
    });
  });

  it('Restore each checkbox to its original state', () => {
    data.checkboxes.forEach(({ index, initialChecked }) => {
      cy.setCheckboxState(index, !initialChecked);
      cy.verifyCheckboxState(index, !initialChecked);

      cy.setCheckboxState(index, initialChecked);
      cy.verifyCheckboxState(index, initialChecked);
    });
  });
});

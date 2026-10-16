# Cypress Automation (TypeScript)

Automated tests for http://the-internet.herokuapp.com covering Login, Dynamic Content and Checkboxes, plus API tests against JSONPlaceholder.

## Project structure

```
cypress.config.ts                          Cypress config (baseUrl, reporter)
tsconfig.json                              TypeScript config
cypress/
  e2e/
    login.cy.ts                            Scenario 1 - Login Functionality
    dynamicContent.cy.ts                   Scenario 2 - Dynamic Content
    checkboxes.cy.ts                       Scenario 3 - Checkboxes Interaction
    usersApi.cy.ts                         Scenario 4 - Users API validation
  fixtures/
    loginData.json                         Login test data
    dynamicContentData.json                Dynamic content test data
    checkboxData.json                      Checkbox test data
    usersApiData.json                      Users API test data
  support/
    commands.ts                            Custom commands
    usersApiCommands.ts                    Users API commands and schema assertions
    api/
      apiConfig.ts                         Users API URL configuration
      types/
        user.ts                            Users API types
    elements/
      loginElements.ts                     Login and secure area locators
      dynamicContentElements.ts            Dynamic content locators
      checkboxElements.ts                  Checkbox locators
    e2e.ts                                 Support file (loads commands and reporter)
```

## Test cases

| Scenario | ID | Description |
|---|---|---|
| 1 Login | TC01 | Successful login with valid credentials |
| 1 Login | TC02a | Login fails with an invalid username |
| 1 Login | TC02b | Login fails with an invalid password |
| 1 Login | TC03 | Login fails with empty credentials |
| 1 Login | TC04 | Bonus: logout after a successful login |
| 2 Dynamic Content | TC01 | Content changes on page refresh |
| 2 Dynamic Content | TC02 | Click “click here” and verify static content is visible |
| 3 Checkboxes | TC01 | Modify the state of each checkbox |
| 3 Checkboxes | TC02 | Bonus: restore each checkbox to its original state |
| 4 Users API | TC01 | GET all users and validate the response schema |
| 4 Users API | TC02 | GET a user by ID |
| 4 Users API | TC03 | POST a user and validate the created resource |
| 4 Users API | TC04 | Bonus: verify a missing user returns 404 |

## Prerequisites

- Node.js 22.12 or later (required by the locked Cypress and reporter dependencies)
- npm
- Internet access for the JSONPlaceholder API tests

## How to run

```bash
npm install                                   # install dependencies
npm run cy:open                               # interactive mode
npm test                                      # headless run of all specs
npx cypress run --spec cypress/e2e/checkboxes.cy.ts   # run a single spec
npx cypress run --spec cypress/e2e/usersApi.cy.ts     # run the Users API spec
npm run typecheck                             # optional TypeScript check
```

## Test report

After a headless run, open `cypress/reports/index.html` in a browser.
Failure screenshots are saved in `cypress/screenshots/`.

import { NewUser, User } from './api/types/user';
import { API_BASE_URL, USERS_ENDPOINT } from './api/apiConfig';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /** GET /users */
      apiGetUsers(): Chainable<Cypress.Response<User[]>>;
      /** GET /users/:id (set failOnStatusCode to false to test error responses). */
      apiGetUserById(
        id: number,
        failOnStatusCode?: boolean
      ): Chainable<Cypress.Response<User>>;
      /** POST /users */
      apiCreateUser(payload: NewUser): Chainable<Cypress.Response<User>>;
      /** Asserts an object matches the expected user schema. */
      assertUserSchema(user: User): Chainable<void>;
    }
  }
}

const usersUrl = (): string => `${API_BASE_URL}${USERS_ENDPOINT}`;

Cypress.Commands.add('apiGetUsers', () => {
  return cy.request<User[]>({ method: 'GET', url: usersUrl() });
});

Cypress.Commands.add(
  'apiGetUserById',
  (id: number, failOnStatusCode: boolean = true) => {
    return cy.request<User>({
      method: 'GET',
      url: `${usersUrl()}/${id}`,
      failOnStatusCode,
    });
  }
);

Cypress.Commands.add('apiCreateUser', (payload: NewUser) => {
  return cy.request<User>({ method: 'POST', url: usersUrl(), body: payload });
});

Cypress.Commands.add('assertUserSchema', (user: User) => {
  expect(user, 'user').to.have.all.keys(
    'id',
    'name',
    'username',
    'email',
    'address',
    'phone',
    'website',
    'company'
  );
  expect(user.id, 'id').to.be.a('number');

  (['name', 'username', 'email', 'phone', 'website'] as const).forEach((key) => {
    expect(user[key], key).to.be.a('string').and.not.be.empty;
  });
  expect(user.email, 'email').to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

  expect(user.address, 'address').to.have.all.keys(
    'street',
    'suite',
    'city',
    'zipcode',
    'geo'
  );
  (['street', 'suite', 'city', 'zipcode'] as const).forEach((key) => {
    expect(user.address[key], `address.${key}`).to.be.a('string');
  });
  expect(user.address.geo, 'address.geo').to.have.all.keys('lat', 'lng');
  expect(user.address.geo.lat, 'geo.lat').to.be.a('string');
  expect(user.address.geo.lng, 'geo.lng').to.be.a('string');

  expect(user.company, 'company').to.have.all.keys('name', 'catchPhrase', 'bs');
  (['name', 'catchPhrase', 'bs'] as const).forEach((key) => {
    expect(user.company[key], `company.${key}`).to.be.a('string');
  });
});

export {};

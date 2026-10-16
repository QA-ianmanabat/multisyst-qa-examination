import { NewUser, User } from '../support/api/types/user';

interface UsersApiData {
  expectedUserCount: number;
  existingUser: Pick<User, 'id' | 'name' | 'username' | 'email'>;
  nonExistentUserId: number;
  newUser: NewUser;
}

describe('Scenario 4: API Endpoint Validation - /users', () => {
  let data: UsersApiData;

  before(() => {
    cy.fixture('usersApiData').then((usersApiData: UsersApiData) => {
      data = usersApiData;
    });
  });

  it('TC01 - GET all users returns 200 and a valid JSON array', () => {
    cy.apiGetUsers().then((response) => {
      expect(response.status, 'status code').to.eq(200);
      expect(response.headers['content-type'], 'content type').to.include(
        'application/json'
      );

      expect(response.body, 'response body').to.be.an('array');
      expect(response.body, 'number of users').to.have.length(data.expectedUserCount);

      response.body.forEach((user) => {
        cy.assertUserSchema(user);
      });

      const ids = response.body.map((user) => user.id);
      expect(new Set(ids).size, 'unique ids').to.eq(ids.length);
    });
  });

  it('TC02 - GET a single user returns 200 and data matching the requested ID', () => {
    const { id, name, username, email } = data.existingUser;

    cy.apiGetUserById(id).then((response) => {
      expect(response.status, 'status code').to.eq(200);
      expect(response.headers['content-type'], 'content type').to.include(
        'application/json'
      );

      cy.assertUserSchema(response.body);
      expect(response.body.id, 'id').to.eq(id);
      expect(response.body.name, 'name').to.eq(name);
      expect(response.body.username, 'username').to.eq(username);
      expect(response.body.email, 'email').to.eq(email);
    });
  });

  it('TC03 - POST creates a user and returns 201 with a new unique ID', () => {
    cy.apiGetUsers().then((listResponse) => {
      const existingIds = listResponse.body.map((user) => user.id);

      cy.apiCreateUser(data.newUser).then((response) => {
        expect(response.status, 'status code').to.eq(201);
        expect(response.headers['content-type'], 'content type').to.include(
          'application/json'
        );

        expect(response.body, 'created resource').to.deep.include(data.newUser);
        cy.assertUserSchema(response.body);

        expect(response.body.id, 'new id').to.be.a('number');
        expect(existingIds, 'existing ids').to.not.include(response.body.id);
      });
    });
  });

  it('TC04 (bonus) - GET a non-existent user returns 404', () => {
    cy.apiGetUserById(data.nonExistentUserId, false).then((response) => {
      expect(response.status, 'status code').to.eq(404);
    });
  });
});

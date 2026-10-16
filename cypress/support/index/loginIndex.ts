interface Credentials {
  username: string;
  password: string;
}

interface LoginData {
  validUser: Credentials;
  invalidUsername: Credentials;
  invalidPassword: Credentials;
  emptyCredentials: Credentials;
  paths: { login: string; secure: string };
  messages: {
    loginSuccess: string;
    logoutSuccess: string;
    invalidUsername: string;
    invalidPassword: string;
  };
}

interface DynamicContentData {
  path: string;
  expectedRowCount: number;
  maxRefreshAttempts: number;
}


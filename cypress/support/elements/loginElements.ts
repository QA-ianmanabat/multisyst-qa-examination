/**
 * Locators for the Login and Secure Area pages.
 */
export const loginElements = {
  usernameInput: '#username',
  passwordInput: '#password',
  loginButton: 'button[type="submit"]',
  flashMessage: '#flash',
} as const;

export const secureAreaElements = {
  pageHeader: 'h2',
  logoutButton: 'a[href="/logout"]',
} as const;

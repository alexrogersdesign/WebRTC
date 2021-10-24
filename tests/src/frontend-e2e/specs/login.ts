import LoginPage from '../pageobjects/LoginPage';
import {correctEmail, correctPassword} from '../constants';

describe('Login Functionality', () => {
  beforeEach('setup', async () => {
    await LoginPage.logout();
  });
  it('should login with valid credentials', async () => {
    // await browser.debug();
    // test;
    await LoginPage.login(correctEmail, correctPassword);
    await expect(LoginPage.notification).toBeExisting();
    await expect(LoginPage.notification).toHaveTextContaining(
        'Welcome');
  });
  it('should not login with invalid credentials', async () => {
    await LoginPage.login('wrongEmail@email.com', 'wrong');
    await expect(LoginPage.notification).toBeExisting();
    await expect(LoginPage.notification).toHaveTextContaining('Invalid');
  });
});
describe('Create User', () => {
  beforeEach('setup', async () => {
    await LoginPage.logout();
  });
  it('should create a new user', async () => {
    await LoginPage.login(correctEmail, correctPassword);
    await expect(LoginPage.notification).toBeExisting();
    await expect(LoginPage.notification).toHaveTextContaining(
        'Welcome');
  });
});



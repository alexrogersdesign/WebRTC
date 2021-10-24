import LoginPage from '../pageobjects/LoginPage';
import {correctEmail, correctPassword} from '../constants';
import faker from 'faker';
import deleteValue from 'src/frontend-e2e/helpers/deleteValue';

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
    await LoginPage.logout();
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
    const first = faker.name.firstName();
    const last = faker.name.lastName();
    const email = faker.internet.email();
    const password = faker.internet.password(8, true);
    await LoginPage.createUser(first, last, email, password);
    await expect(LoginPage.notification).toBeExisting();
    await expect(LoginPage.notification).toHaveTextContaining(
        `Account for ${email}`);
  });
});



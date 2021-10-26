import LoginPage from '../../pageobjects/LoginPage';
import {correctEmail, correctPassword, User} from '../../constants';

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
  it('A created user should be able to login', async () => {
    const user = new User();
    // const filePath = '../files/icon1.jpeg';
    await LoginPage.createUserAndLogin(user);
    await expect(LoginPage.notification).toBeExisting();
    await expect(LoginPage.notification).toHaveTextContaining(user.firstName);
  });
});



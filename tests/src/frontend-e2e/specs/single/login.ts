import {loginPageCreator} from '@e2ePage/LoginPage';
import {correctEmail, correctPassword, User} from '@e2e/constants';

describe('Login Functionality', () => {
  let loginPage;
  beforeEach('setup', async () => {
    loginPage = loginPageCreator(browser);
    await loginPage.logout();
  });
  it('should login with valid credentials', async () => {
    await loginPage.login(correctEmail, correctPassword);
    await expect(loginPage.notification).toBeExisting();
    await expect(loginPage.notification).toHaveTextContaining(
        'Welcome');
  });
  it('should not login with invalid credentials', async () => {
    await loginPage.logout();
    await loginPage.login('wrongEmail@email.com', 'wrong');
    await expect(loginPage.notification).toBeExisting();
    await expect(loginPage.notification).toHaveTextContaining('Invalid');
  });
  it('A created user should be able to login', async () => {
    const user = new User();
    await loginPage.createUserAndLogin(user);
    await expect(loginPage.notification).toBeExisting();
    await expect(loginPage.notification).toHaveTextContaining(user.firstName);
  });
});



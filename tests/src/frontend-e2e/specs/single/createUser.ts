import {loginPageCreator} from '@e2ePage/LoginPage';
import {User} from '@e2e/constants';

describe('Create User', () => {
  let loginPage;
  before('setup', async () => {
    loginPage = loginPageCreator(browser);
    await loginPage.logout();
  });
  it('should create a new user', async () => {
    const user = new User();
    await loginPage.createUser(user);
    await expect(loginPage.notification).toBeExisting();
    await expect(loginPage.notification).toHaveTextContaining(
        `Account for ${user.email.toLowerCase()}`);
  });
});

import LoginPage from '../pageobjects/LoginPage';
import {User} from '../constants';

describe('Create User', () => {
  beforeEach('setup', async () => {
    await LoginPage.logout();
  });
  it('should create a new user', async () => {
    const user = new User();
    // const filePath = '../files/icon1.jpeg';
    await LoginPage.createUser(user);
    await expect(LoginPage.notification).toBeExisting();
    await expect(LoginPage.notification).toHaveTextContaining(
        `Account for ${user.email}`);
  });
});

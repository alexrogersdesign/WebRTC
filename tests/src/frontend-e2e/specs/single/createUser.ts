import LoginPage, {loginPageCreator} from '../../pageobjects/LoginPage';
import {correctEmail, correctPassword, User} from '@e2e/constants';
import randomFile from 'select-random-file';
import {fileExistsAsync} from 'tsconfig-paths/lib/filesystem';
import path from 'path';
import * as fs from 'fs';

const iconDir = '/Volumes/Macintosh-HD-Data/development/react' +
    '/webstorm/WebRTC/tests/src/frontend-e2e/files/user-icon';

describe('Create User', () => {
  let loginPage;
  before('setup', async () => {
    loginPage = loginPageCreator(browser);
    await loginPage.logout();
  });
  it('should create a new user', async () => {
    const user = new User();
    const files = fs.readdirSync(iconDir);
    const foundFile = files[Math.floor(Math.random()* files.length)];
    const filePath = path.join(iconDir, foundFile);
    await loginPage.createUser(user, filePath);
    await expect(loginPage.notification).toBeExisting();
    await expect(loginPage.notification).toHaveTextContaining(
        `Account for ${user.email}`);
  });
});

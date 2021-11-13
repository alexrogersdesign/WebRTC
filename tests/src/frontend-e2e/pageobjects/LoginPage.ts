import Page, {ParamBrowser} from './Page';
import {menuWaitTime, User} from '../constants';
import fs from 'fs';
import path from 'path';


/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  get inputEmail() {
    return this.browser.$('#email');
  }
  get inputFirstName() {
    return this.browser.$('#firstName');
  }
  get inputLastName() {
    return this.browser.$('#lastName');
  }
  get inputPassword() {
    return this.browser.$('#password');
  }
  get loginButton() {
    return this.browser.$('#login-button');
  }
  get createAccountButton() {
    return this.browser.$('#create-account-button');
  }
  constructor(browser?:ParamBrowser) {
    super(browser);
  }

  /**
     * a method to encapsulate automation code to interact with the page
     * e.g. to login using username and password
     */
  async login(email: string, password: string) {
    await this.menu.click();
    await this.loginButton.waitForClickable({timeout: menuWaitTime});
    await this.loginButton.click();
    await this.inputEmail.setValue(email);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.waitForClickable();
    await this.btnSubmit.click();
  }
  async multiLogin() {
    await this.login(await this.browser.a.email(), 'test');
  }
  async createUser(user:User) {
    const iconDir = '/Volumes/Macintosh-HD-Data/development/react' +
        '/webstorm/WebRTC/tests/src/frontend-e2e/files/user-icon';
    const files = fs.readdirSync(iconDir);
    const foundFile = files[Math.floor(Math.random()* files.length)];
    const filePath = path.join(iconDir, foundFile);
    await this.menu.click();
    await this.createAccountButton.waitForClickable({timeout: menuWaitTime});
    await this.createAccountButton.click();
    await this.setValue(browser, await this.inputFirstName, user.firstName);
    await this.setValue(browser, await this.inputLastName, user.lastName);
    await this.setValue(browser, await this.inputEmail, user.email);
    await this.setValue(browser, await this.inputPassword, user.password);
    const fileElem = await this.inputFileUpload();
    await fileElem.setValue(filePath);
    await this.btnSubmit.click();
  }
  async createUserAndLogin(user:User) {
    await this.createUser(user);
    await this.browser.pause(1000);
    await this.login(user.email, user.password);
  }
}
export function loginPageCreator(newBrowser?: ParamBrowser) {
  return new LoginPage(newBrowser);
}

export default LoginPage;

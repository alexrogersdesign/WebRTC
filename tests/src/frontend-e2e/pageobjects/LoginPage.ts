import Page from './Page';
import {menuWaitTime, User} from '../constants';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  get inputEmail() {
    return $('#email');
  }
  get inputFirstName() {
    return $('#firstName');
  }
  get inputLastName() {
    return $('#lastName');
  }
  get inputPassword() {
    return $('#password');
  }
  get loginButton() {
    return $('#login-button');
  }
  get createAccountButton() {
    return $('#create-account-button');
  }

  constructor(paramBrowser?: WebdriverIO.Browser) {
    super(paramBrowser);
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
    await this.btnSubmit.click();
  }
  async createUser(user:User) {
    // const filePath = this.joinPath(file);
    await this.menu.click();
    await this.createAccountButton.waitForClickable({timeout: menuWaitTime});
    await this.createAccountButton.click();
    // eslint-disable-next-line max-len
    await this.setValue(this.internalBrowser, await this.inputFirstName, user.firstName);
    await this.setValue(this.internalBrowser, await this.inputLastName, user.lastName);
    await this.setValue(this.internalBrowser, await this.inputEmail, user.email);
    await this.setValue(this.internalBrowser, await this.inputPassword, user.password);
    // await this.setValue(browser, await this.inputFileUpload, filePath);
    await this.btnSubmit.click();
  }
  async createUserAndLogin(user:User) {
    await this.createUser(user);
    await this.internalBrowser.pause(1000);
    await this.login(user.email, user.password);
  }
}

export default LoginPage;

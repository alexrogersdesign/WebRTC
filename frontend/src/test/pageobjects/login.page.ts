import Page from './page';
// const Page = require('./page');

/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
  get inputEmail() {
    return $('#email');
  }
  get inputPassword() {
    return $('#password');
  }
  get btnSubmit() {
    return $('button[type="submit"]');
  }

  /**
     * a method to encapsulate automation code to interact with the page
     * e.g. to login using username and password
     */
  async login(email: string, password: string) {
    await this.inputEmail.setValue(email);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }

  /**
     * overwrite specific options to adapt it to page object
     */
  async open() {
    const browser = await super.open();
    await $('#menu-button').click();
    const loginButton = await $('#login-button');
    await loginButton.click();
    return browser;
    // await browser.
  }
}

export default new LoginPage();

import Page from './Page';

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
  get btnSubmit() {
    return $('button[type="submit"]');
  }
  /**
     * a method to encapsulate automation code to interact with the page
     * e.g. to login using username and password
     */
  async login(email: string, password: string) {
    await this.menu.click();
    await this.loginButton.waitForClickable({timeout: 3000});
    await this.loginButton.click();
    await this.inputEmail.setValue(email);
    await this.inputPassword.setValue(password);
    await this.btnSubmit.click();
  }
  async createUser(first:string, last:string, email: string, password: string) {
    await this.menu.click();
    await this.createAccountButton.waitForClickable({timeout: 3000});
    await this.createAccountButton.click();
    await this.setValue(browser, await this.inputFirstName, first);
    await this.setValue(browser, await this.inputLastName, last);
    await this.setValue(browser, await this.inputEmail, email);
    await this.setValue(browser, await this.inputPassword, password);
    await this.btnSubmit.click();
  }
}

export default new LoginPage();

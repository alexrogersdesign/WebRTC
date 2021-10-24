import LoginPage from '../pageobjects/LoginPage';
// const LoginPage= require('../pageobjects/login.page');
import {correctEmail, correctPassword} from '../constants';
// import SecurePage from '../pageobjects/secure.page';
// import expect from 'expect';


// const failedLoginMessage = 'Invalid Username or Password';


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
    // await browser.debug();
    // test;
    await LoginPage.login('wrongEmail@email.com', 'wrong');
    await expect(LoginPage.notification).toBeExisting();
    await expect(LoginPage.notification).toHaveTextContaining('Invalid');
  });
});



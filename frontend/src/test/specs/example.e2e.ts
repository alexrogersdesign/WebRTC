import LoginPage from '../pageobjects/login.page';
// const LoginPage= require('../pageobjects/login.page');
import {correctEmail, correctPassword} from '../constants';
// import SecurePage from '../pageobjects/secure.page';
// import expect from 'expect';


// const failedLoginMessage = 'Invalid Username or Password';


describe('My Login application', () => {
  it('should login with valid credentials', async () => {
    await LoginPage.open();
    browser.debug();
    await LoginPage.login(correctEmail, correctPassword);
    await expect(LoginPage.notification).toBeExisting();
    await expect(LoginPage.notification).toHaveTextContaining(
        'Welcome');
  });
});



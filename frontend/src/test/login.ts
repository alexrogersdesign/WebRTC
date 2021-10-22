// import assert from 'assert';
const url = 'http://localhost:3000';

const email = 'test@test.com';
const password = 'test';

// const failedLoginMessage = 'Invalid Username or Password';

describe('Login Test', async ()=> {
  it('should correctly login with correct credentials', async ()=> {
    await browser.url(url);
    const menuLink = await browser.$('=Menu');
    menuLink.click();
    const loginLink = await browser.$('=Login');
    loginLink.click();
    const emailInput = $('email');
    const passwordInput = $('password');
    await emailInput.setValue(email);
    await passwordInput.setValue(password);
    const loginSubmit = await browser.$('=Login');
    loginSubmit.click();

    // const confirmation;

    // assert.strictEqual(title, 'Menu');
  });
});

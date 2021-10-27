import LoginPage from '../../pageobjects/LoginPage';
import {correctEmail, correctPassword, Meeting, userAEmail, userBEmail} from '../../constants';
import {getBrowser} from '../../../../wdio.conf';
import PreMeeting from '../../pageobjects/PreMeeting';


describe('Create Multi Remote', async () => {
  const browser = await getBrowser();
  before('setup', async () => {
    await LoginPage.multiLogin();
    await LoginPage.open();
  });
  it('should have both users logged in', async () => {
    await browser.debug();
  });
});
// // call commands at the same time
// const title = await browser.getTitle();
// expect(title).toEqual(['JSON', 'JSON']);
//
// // click on an element at the same time
// const elem = await browser.$('#someElem');
// await elem.click();
//
// browser.url('test');
// // only click with one browser (Firefox)
// await elem.a.click();
//
// // const loginPageA = new LoginPage(browser);

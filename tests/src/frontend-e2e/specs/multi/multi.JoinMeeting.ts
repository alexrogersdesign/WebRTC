import LoginPage from '../../pageobjects/LoginPage';
import {correctEmail, correctPassword, Meeting} from '../../constants';
import PreMeeting from '../../pageobjects/PreMeeting';
import {getBrowser} from '../../../../wdio.conf';

describe('Create Meeting', async () => {
  const browser = await getBrowser();
  before('setup', async () => {
    await LoginPage.multiLogin();
    await LoginPage.open();
  });
  it('multiple browsers should be able to join the same meeting', async () => {
    const meetingTitle = await PreMeeting.joinFirstMeeting();
    await expect(PreMeeting.notification).toBeExisting();
    await expect(PreMeeting.notification).toHaveTextContaining(meetingTitle);
    await browser.debug();
  });
});

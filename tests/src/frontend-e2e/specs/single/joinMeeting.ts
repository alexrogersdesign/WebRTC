import LoginPage, {loginPageCreator} from '../../pageobjects/LoginPage';
import {correctEmail, correctPassword, Meeting} from '../../constants';
import PreMeetingPage, {preMeetingPageCreator} from '../../pageobjects/PreMeetingPage';

describe('Join Meeting', async () => {
  let loginPage;
  let preMeetingPage;
  before('login', async () => {
    // const browser = await getBrowser();
    loginPage = loginPageCreator(browser);
    preMeetingPage = preMeetingPageCreator(browser);
    await loginPage.logout();
    await loginPage.login(correctEmail, correctPassword);
    await browser.pause(2000);
  });
  afterEach('return to main page', async () => {
    await preMeetingPage.open();
  });
  it('if a meeting exists, the first meeting should be join-able', async () => {
    const meetingTitle = await preMeetingPage.joinFirstMeeting();
    await expect(preMeetingPage.notification).toBeExisting();
    await expect(preMeetingPage.notification)
        .toHaveTextContaining(meetingTitle);
  });
  it('a created meeting should be join-able', async () => {
    const meeting = new Meeting();
    await preMeetingPage.createMeeting(meeting);
    const newMeeting = await $(`span=${meeting.title}`);
    await newMeeting.waitForExist({timeout: 5000});
    await preMeetingPage.joinMeeting(newMeeting);
    await expect(preMeetingPage.notification)
        .toHaveTextContaining(meeting.title);
  });
});

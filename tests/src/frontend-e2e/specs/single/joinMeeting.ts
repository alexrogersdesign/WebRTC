import LoginPage from '../../pageobjects/LoginPage';
import {correctEmail, correctPassword, Meeting, User} from '../../constants';
import PreMeeting from '../../pageobjects/PreMeeting';

describe('Join Meeting', () => {
  before('login', async () => {
    await LoginPage.logout();
    await LoginPage.login(correctEmail, correctPassword);
    await browser.pause(2000);
    // await PreMeeting.createMeeting(new Meeting());
  });
  afterEach('return to main page', async () => {
    await PreMeeting.open();
  });
  it('if a meeting exists, the first meeting should be join-able', async () => {
    const meetingTitle = await PreMeeting.joinFirstMeeting();
    await expect(PreMeeting.notification).toBeExisting();
    await expect(PreMeeting.notification).toHaveTextContaining(meetingTitle);
  });
  it('a created meeting should be join-able', async () => {
    const meeting = new Meeting();
    await PreMeeting.createMeeting(meeting);
    const newMeeting = await $(`span=${meeting.title}`);
    await newMeeting.waitForExist({timeout: 5000});
    await PreMeeting.joinMeeting(newMeeting);
    await expect(PreMeeting.notification).toHaveTextContaining(meeting.title);
  });
});

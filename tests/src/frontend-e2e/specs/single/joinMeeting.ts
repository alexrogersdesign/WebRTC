import LoginPage from '../../pageobjects/LoginPage';
import {correctEmail, correctPassword, Meeting, User} from '../../constants';
import PreMeeting from '../../pageobjects/PreMeeting';

describe('Join Meeting', () => {
  before('setup', async () => {
    await LoginPage.logout();
    await LoginPage.login(correctEmail, correctPassword);
    await browser.pause(2000);
    // await PreMeeting.createMeeting(new Meeting());
  });
  it('if a meeting exists, it should be join-able', async () => {
    const meetings = await PreMeeting.meetingList();
    // await browser.debug();
    const meeting = await meetings[0].$('#meeting-title');
    // const meetingText = await meeting.getText();
    const meetingTitle = await meeting.getText();
    await PreMeeting.joinMeeting(meeting);
    await expect(PreMeeting.notification).toBeExisting();
    await expect(PreMeeting.notification).toHaveTextContaining(meetingTitle);
  });
});

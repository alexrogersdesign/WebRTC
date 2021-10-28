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
    const meetingList = await PreMeeting.meetingList;
    const meetingElements = await $$('#meeting-title');
    await expect(meetingElements).not.toHaveLength(0);
    const meeting = await meetingList.$('#meeting-title');
    const meetingTitle = await meeting.getText();
    await PreMeeting.joinMeeting(meeting);
    await expect(PreMeeting.notification).toBeExisting();
    await expect(PreMeeting.notification).toHaveTextContaining(meetingTitle);
  });
  it('a created meeting should be join-able', async () => {
    const meeting = new Meeting();
    await PreMeeting.createMeeting(meeting);
    // const meetingList = await PreMeeting.meetingList;
    const newMeeting = await $(`span=${meeting.title}`);
    await browser.debug();
    await newMeeting.waitForExist({timeout: 5000});
    await PreMeeting.joinMeeting(newMeeting);
    await expect(PreMeeting.notification).toBeExisting();
    await expect(PreMeeting.notification).toHaveTextContaining(meeting.title);
  });
});

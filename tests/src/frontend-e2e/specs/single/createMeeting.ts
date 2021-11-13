import {correctEmail, correctPassword, Meeting} from '@e2e/constants';
import {preMeetingPageCreator} from '@e2ePage/PreMeetingPage';

describe('Create Meeting', () => {
  let preMeetingPage;

  before('setup', async () => {
    preMeetingPage = preMeetingPageCreator(browser);
    await preMeetingPage.logout();
    await preMeetingPage.login(correctEmail, correctPassword);
  });
  it('should create a new meeting', async () => {
    const meeting = new Meeting();
    await preMeetingPage.createMeeting(meeting);
    await expect(preMeetingPage.notification).toBeExisting();
    await expect(preMeetingPage.notification)
        .toHaveTextContaining(meeting.title);
  });
});

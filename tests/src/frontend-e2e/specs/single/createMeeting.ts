import {correctEmail, correctPassword, Meeting} from '@e2e/constants';
import {preMeetingPageCreator} from '@e2ePage/PreMeetingPage';
import fs from 'fs';
import path from 'path';

describe('Create Meeting', () => {
  let preMeetingPage;
  const iconDir = '/Volumes/Macintosh-HD-Data/development/react' +
      '/webstorm/WebRTC/tests/src/frontend-e2e/files/meeting-icon';
  before('setup', async () => {
    preMeetingPage = preMeetingPageCreator(browser);
    await preMeetingPage.logout();
    await preMeetingPage.login(correctEmail, correctPassword);
  });
  it('should create a new meeting', async () => {
    const meeting = new Meeting();
    const files = fs.readdirSync(iconDir);
    const foundFile = files[Math.floor(Math.random()* files.length)];
    const filePath = path.join(iconDir, foundFile);
    await preMeetingPage.createMeeting(meeting, filePath);
    await expect(preMeetingPage.notification).toBeExisting();
    await expect(preMeetingPage.notification)
        .toHaveTextContaining(meeting.title);
  });
});

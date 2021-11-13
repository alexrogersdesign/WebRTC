import {meetingPageCreator} from '@e2ePage/MeetingPage';
import {getMultiBrowser} from '@/wdio.multi.conf';
import {userAEmail, userBEmail, userBName} from '@e2e/constants';

describe('Join Meeting Multi-Remote', async () => {
  let meetingPage;
  let meetingPageA;
  let meetingPageB;

  before('setup', async () => {
    const browser = await getMultiBrowser();
    meetingPage= meetingPageCreator(browser);
    meetingPageA= meetingPageCreator(browser.a);
    meetingPageB = meetingPageCreator(browser.b);
    await meetingPage.open();
    await meetingPageA.login(userAEmail, 'test');
    await meetingPageB.login(userBEmail, 'test');
    await meetingPage.joinFirstMeeting();
  });
  after('logout', async () => meetingPage.logout());

  it('a user should be notified when a message is received', async () => {
    const elem = await meetingPageA.newMessageNotification;
    await elem.waitForDisplayed();
    const noteText = await elem.getText();
    expect(noteText).toContain(`New message from ${userBName}`);
  });
});

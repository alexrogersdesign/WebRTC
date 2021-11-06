import {preMeetingPageCreator} from '@e2ePage/PreMeetingPage';
import {getMultiBrowser} from '@/wdio.multi.conf';
import {userAEmail, userBEmail, userBName} from '@e2e/constants';
import {meetingPageCreator} from '@e2ePage/MeetingPage';
declare const a: WebdriverIO.MultiRemoteBrowser['a'];
declare const b: WebdriverIO.MultiRemoteBrowser['b'];


describe('Join Meeting Multi-Remote', async () => {
  let multiPreMeetingPage;
  let multiPreMeetingPageA;
  let multiPreMeetingPageB;

  before('setup', async () => {
    const browser = await getMultiBrowser();
    multiPreMeetingPageA= preMeetingPageCreator(browser.a);
    multiPreMeetingPageB= preMeetingPageCreator(browser.b);
    multiPreMeetingPage = preMeetingPageCreator(browser);
    await multiPreMeetingPage.open();
    await multiPreMeetingPageA.login(userAEmail, 'test');
    await multiPreMeetingPageB.login(userBEmail, 'test');
  });
  after('logout', async () => multiPreMeetingPage.logout());

  it('a user should be notified when a another user joins', async () => {
    await multiPreMeetingPageA.joinFirstMeeting();
    await b.pause(1000);
    await multiPreMeetingPageB.joinFirstMeeting();
    const multiMeetingPageA = meetingPageCreator(a);
    await a.pause(4000);
    const elem = await multiMeetingPageA.userJoinedNotification;
    await elem.waitForDisplayed();
    const noteText = await elem.getText();
    expect(noteText).toContain(userBName);
  });
});

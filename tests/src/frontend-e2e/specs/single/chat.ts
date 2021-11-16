import {userAEmail, userBEmail, userBName} from '@e2e/constants';
import {meetingPageCreator} from '@e2ePage/MeetingPage';

describe('Chat Functionality', async () => {
  let meetingPage;

  before('setup', async () => {
    meetingPage= meetingPageCreator();
    await meetingPage.open();
    await meetingPage.login(userAEmail, 'test');
    await meetingPage.joinFirstMeeting();
  });
  after('logout', async () => meetingPage.logout());

  it('a message can be sent', async () => {
    const messageContent = await meetingPage.sendMessage();
    const messages = await meetingPage.messages;
    // let containsText = false;
    await browser.pause(2000);
    // await messages.forEach((async (message) => {
    //   const text = await message.getText();
    //   const found = text.includes(messageContent);
    //   if (found) containsText = true;
    // }));
    const found = await messages.find(async (message) => {
      const text = await message.getText();
      return text === messageContent;
    });
    expect(found).toBeTruthy();
    // expect(containsText).toBeTruthy();
  });
});

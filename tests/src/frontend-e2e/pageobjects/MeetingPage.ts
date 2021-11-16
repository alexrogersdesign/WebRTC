import {ParamBrowser} from './Page';
import PreMeetingPage from '@e2ePage/PreMeetingPage';
import faker from 'faker';

class MeetingPage extends PreMeetingPage {
  constructor(browser?:ParamBrowser) {
    super(browser);
  }
  get userJoinedNotification(): WebdriverIO.Element {
    return this.browser.react$('SnackbarContainer', {
      props: {key: 'user-joined'},
    });
  }
  get newMessageNotification(): WebdriverIO.Element {
    return this.browser.react$('SnackbarContainer', {
      props: {key: 'new-message'},
    });
  }
  get messageInputField(): WebdriverIO.Element {
    return this.browser.$('.cs-message-input__content-editor');
  }
  get messageSendButton(): WebdriverIO.Element {
    return this.browser.$('.cs-button--send');
  }
  get openChatButton(): WebdriverIO.Element {
    return this.browser.$('#open-chat-button');
  }
  get closeChatButton(): WebdriverIO.Element {
    return this.browser.$('#close-chat-button');
  }
  get messages():WebdriverIO.Element[] {
    return this.browser.$$('.cs-message__content');
  }

  async sendMessage(content?:string) {
    const message = content?? faker.lorem.sentence(6, 12);
    await this.openChatButton.click();
    await this.messageInputField.waitForClickable({
      timeout: 6000,
      timeoutMsg: 'Input not clickable',
    });
    await this.messageInputField.addValue(message);
    await this.messageSendButton.click();
    return message;
  }
}
export function meetingPageCreator(newBrowser?: ParamBrowser) {
  return new MeetingPage(newBrowser);
}

export default MeetingPage;

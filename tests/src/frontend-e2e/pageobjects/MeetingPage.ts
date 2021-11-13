import {ParamBrowser} from './Page';
import PreMeetingPage from '@e2ePage/PreMeetingPage';

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
    return this.browser.$('.cs-message-input');
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

  async sendMessage(content:string) {
    await this.openChatButton.click();
    await this.messageInputField.waitForDisplayed();
    await this.messageInputField.setValue(content);
    await this.messageSendButton.click();
  }
}
export function meetingPageCreator(newBrowser?: ParamBrowser) {
  return new MeetingPage(newBrowser);
}

export default MeetingPage;

import {ParamBrowser} from './Page';
import LoginPage from '@e2ePage/LoginPage';
import PreMeetingPage from '@e2ePage/PreMeetingPage';
import {notificationID} from '@e2e/constants';

class MeetingPage extends PreMeetingPage {
    browser: any
    constructor(browser?:ParamBrowser) {
      super(browser);
      this.browser = browser;
    }
    get userJoinedNotification(): WebdriverIO.Element {
      return this.browser.react$('SnackbarContainer', {
        props: {key: 'user-joined'},
      });
    }
}
export function meetingPageCreator(newBrowser?: ParamBrowser) {
  return new MeetingPage(newBrowser);
}

export default MeetingPage;

import {ParamBrowser} from './Page';
import {Meeting, menuWaitTime} from '../constants';
import enterTime from '../helpers/enterTime';
import LoginPage from '@e2ePage/LoginPage';

class PreMeetingPage extends LoginPage {
  browser: any
  constructor(browser?:ParamBrowser) {
    super(browser);
    this.browser = browser;
  }

  get createMeetingButton() {
    return this.browser.$('#create-meeting-button');
  }
  get meetingList() {
    return this.browser.$('#meeting-list');
  }
  get inputStart() {
    return this.browser.$('#start');
  }
  get inputEnd() {
    return this.browser.$('#end');
  }
  get inputTitle() {
    return this.browser.$('#title');
  }
  get joinMeetingButton() {
    return this.browser.$('#join-meeting-button');
  }
  get inputDescription() {
    return this.browser.$('#description');
  }

  async createMeeting(meeting:Meeting, filePath?:string) {
    await this.menu.click();
    const {start, end, title, description} = meeting;
    await this.createMeetingButton.waitForClickable({timeout: menuWaitTime});
    await this.createMeetingButton.click();
    await enterTime(browser, await this.inputStart, start);
    await enterTime(browser, await this.inputEnd, end);
    await this.setValue(browser, await this.inputTitle, title);
    await this.setValue(browser, await this.inputDescription, description);
    const fileElem = await this.inputFileUpload();
    await fileElem.setValue(filePath);
    await this.btnSubmit.click();
  }
  async joinMeeting(element:WebdriverIO.Element) {
    await element.click();
    await this.joinMeetingButton.waitForClickable({timeout: menuWaitTime});
    await this.joinMeetingButton.click();
  }
  async joinFirstMeeting() {
    const meetingList = await this.meetingList;
    const meeting = await meetingList.$('#meeting-title');
    const meetingText = await meeting.getText();
    await this.joinMeeting(meeting);
    return meetingText;
  }
}
export function preMeetingPageCreator(newBrowser?: ParamBrowser) {
  return new PreMeetingPage(newBrowser);
}

export default PreMeetingPage;

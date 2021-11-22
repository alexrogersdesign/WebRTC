import {ParamBrowser} from './Page';
import {Meeting, menuWaitTime} from '../constants';
import enterTime from '../helpers/enterTime';
import LoginPage from '@e2ePage/LoginPage';
import fs from 'fs';
import path from 'path';

class PreMeetingPage extends LoginPage {
  constructor(browser?:ParamBrowser) {
    super(browser);
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

  async createMeeting(meeting:Meeting) {
    const iconDir = '/Volumes/Macintosh-HD-Data/development/react' +
        '/webstorm/WebRTC/tests/src/frontend-e2e/files/meeting-icon';
    const files = fs.readdirSync(iconDir);
    const foundFile = files[Math.floor(Math.random()* files.length)];
    const filePath = path.join(iconDir, foundFile);
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
    await meeting.waitForClickable({
      timeout: 15000,
      timeoutMsg: 'Meeting list not loaded in time',
    });
    const meetingText = await meeting.getText();
    await this.joinMeeting(meeting);
    return meetingText;
  }
}
export function preMeetingPageCreator(newBrowser?: ParamBrowser) {
  return new PreMeetingPage(newBrowser);
}

export default PreMeetingPage;

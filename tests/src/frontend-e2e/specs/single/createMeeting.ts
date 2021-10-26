import LoginPage from '../../pageobjects/LoginPage';
import {correctEmail, correctPassword, Meeting} from '../../constants';
import PreMeeting from '../../pageobjects/PreMeeting';

describe('Create Meeting', () => {
  before('setup', async () => {
    await LoginPage.logout();
    // const user = new User();
    // await LoginPage.createUserAndLogin(user);
    await LoginPage.login(correctEmail, correctPassword);
  });
  it('should create a new meeting', async () => {
    const meeting = new Meeting();
    await PreMeeting.createMeeting(meeting);
    await expect(LoginPage.notification).toBeExisting();
    await expect(LoginPage.notification).toHaveTextContaining(meeting.title);
  });
});

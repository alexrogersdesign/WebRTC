/* eslint-disable valid-jsdoc */
const url = 'http://localhost:3000';
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/
export default class Page {
  /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
  async open(path?: string) {
    return browser.url(path?? url);
  }
  get notification() {
    return $('#notistack-snackbar');
  }
  get menu() {
    // return $('#menu/-button');
    return $('#menu-button');
  }
  get logoutButton() {
    return $('#logout-button');
  }
  async clearValue(browser, selector) {
    await browser.$(selector).click();
    await browser.keys(['Meta', 'a']);
    await browser.keys(['Meta', 'x']);
  }

  async setValue(browser, selector, value) {
    await this.clearValue(browser, selector);
    await selector.setValue(value);
  }
  async logout() {
    await this.open();
    await browser.keys(['Escape']);
    await this.menu.waitForClickable({timeout: 3000});
    await this.menu.click();
    // eslint-disable-next-line max-len
    // if (await this.logoutButton.isExisting()) await this.logoutButton.click();
    try {
      await this.logoutButton.waitForClickable({timeout: 3000});
      await this.logoutButton.click();
    } catch (e) {
      await this.open();
    }
    // else await browser.keys(['Escape']);
    // await browser.debug();
    // eslint-disable-next-line max-len
    // if (await this.logoutButton.isClickable()) await this.logoutButton.click();
    // else await this.open();
  }
}

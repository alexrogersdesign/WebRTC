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
  open(path?: string) {
    return browser.url(path?? url);
  }
  get notification() {
    return $('#notistack-snackbar');
  }
  get menu() {
    // return $('#menu-button');
    return $('#menu-button');
  }
  get logoutButton() {
    return $('#logout-button');
  }
  async logout() {
    await this.open();
    await browser.keys(['Escape']);
    if (await this.menu.isClickable()) await this.menu.click();
    // await browser.debug();
    if (await this.logoutButton.isClickable()) await this.logoutButton.click();
    else await this.open();
  }
}

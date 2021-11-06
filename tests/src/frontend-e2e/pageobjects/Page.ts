import path from 'path';
import deleteValue from '../helpers/deleteValue';
import {MultiRemoteBrowser, Browser} from 'webdriverio';
import {getBrowser} from '../../../wdio.base.conf';
// TODO figure out the typing
/* eslint-disable valid-jsdoc */
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/

// eslint-disable-next-line max-len
export type ParamBrowser = WebdriverIO.MultiRemoteBrowser | WebdriverIO.Browser
// eslint-disable-next-line max-len
// interface ParamBrowser extends Record<string, WebdriverIO.Browser & WebdriverIO.MultiRemoteBrowser> {
//   a?: WebdriverIO.Browser;
//   b?: WebdriverIO.MultiRemoteBrowser;
// }
// export type ParamBrowser ={
//   // eslint-disable-next-line max-len
// eslint-disable-next-line max-len
//   [K in keyof WebdriverIO.Browser & keyof WebdriverIO.MultiRemoteBrowser]: WebdriverIO.Browser[K] & WebdriverIO.MultiRemoteBrowser[K]
// }
// export type MappedParamBrowser ={
//   // eslint-disable-next-line max-len
//   [K in keyof WebdriverIO.Browser & keyof WebdriverIO.MultiRemoteBrowser]:
//   WebdriverIO.Browser[K] extends WebdriverIO.MultiRemoteBrowser[K]
//       ? K // Value becomes same as key
//       : never // Or `never` if check did not pass
// }
// // `never` will not appear in the union
// // eslint-disable-next-line max-len
// eslint-disable-next-line max-len
// type KParamBrowser = MappedParamBrowser[keyof WebdriverIO.Browser & keyof WebdriverIO.MultiRemoteBrowser]
//
// type ParamBrowser = {
//   [K in KParamBrowser]: WebdriverIO.Browser[K]
// }

export default class Page {
  browser: any
  url = 'http://localhost:3000';

  constructor(newBrowser?: ParamBrowser) {
    // console.log('~~~~~browser', browser);
    this.browser = newBrowser?? browser;
    // console.log('~~~~~this.browser', this.browser);
  }

  /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
  async open(path?: string) {
    // TODO remove this section
    /* If this.browser is undefined, it is redefined with the global
    * browser variable. This is necessary because the class is initialized
    * at import and the global browser element is not available at this time*/
    // if (!this.browser) {
    //   this.browser = await getBrowser();
    // }
    return this.browser.url(path?? this.url);
  }
  get notification() {
    return this.browser.$('#notistack-snackbar');
  }
  get menu() {
    return this.browser.$('#menu-button');
  }
  get inputFileUpload() {
    const fileUpload = this.browser.$('#input-file-upload');
    this.browser.execute(
        (el:any) => el.style.display = 'block',
        fileUpload,
    );
    return fileUpload;
  }
  get btnSubmit() {
    return this.browser.$('button[type="submit"]');
  }
  get logoutButton() {
    return this.browser.$('#logout-button');
  }
  async clearValue(browser, selector) {
    await deleteValue(browser, selector);
  }
  async setValue(browser, selector, value) {
    await this.clearValue(browser, selector);
    await selector.setValue(value);
  }
  async joinPath(filePath:string) {
    return path.join(__dirname, filePath);
  }
  async logout() {
    await this.open();
    await this.browser.keys(['Escape']);
    await this.menu.waitForClickable({timeout: 1000});
    await this.menu.click();
    try {
      await this.logoutButton.waitForClickable({timeout: 1000});
      await this.logoutButton.click();
    } catch (e) {
      await this.open();
    }
  }
}

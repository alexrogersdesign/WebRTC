import path from 'path';
import deleteValue from '../helpers/deleteValue';
// TODO figure out the typing
/* eslint-disable valid-jsdoc */
/**
* main page object containing all methods, selectors and functionality
* that is shared across all page objects
*/

export type ParamBrowser = WebdriverIO.MultiRemoteBrowser | WebdriverIO.Browser
export default class Page {
 private url = 'http://localhost:3000';
 protected browser: any

 constructor(newBrowser?: ParamBrowser) {
   this.browser = newBrowser?? browser;
 }
 async open(path?: string) {
   return this.browser.url(path?? this.url);
 }
 get notification() {
   return this.browser.$('#notistack-snackbar');
 }
 get menu() {
   return this.browser.$('#menu-button');
 }
 async inputFileUpload(): Promise<WebdriverIO.Element> {
   const fileUpload = await this.browser.$('#input-file-upload');
   await this.browser.execute(
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

import {multiremote} from 'webdriverio';

export async function createMultiRemote() {
  const browser = await multiremote({
    myChromeBrowser: {
      capabilities: {
        browserName: 'chrome',
      },
    },
    myFirefoxBrowser: {
      capabilities: {
        browserName: 'firefox',
      },
    },
  });
    // open url with both browser at the same time
  await browser.url('http://json.org');

  // call commands at the same time
  const title = await browser.getTitle();
  expect(title).toEqual(['JSON', 'JSON']);

  // click on an element at the same time
  const elem = await browser.$('#someElem');
  await elem.click();

  // only click with one browser (Firefox)
  await elem.myFirefoxBrowser.click();
}

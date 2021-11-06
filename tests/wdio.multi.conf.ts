import {chromeArgs, chromeArgsTempProfile, config as baseConfig} from './wdio.base.conf';
import {multiremote} from 'webdriverio';
const debug = process.env.DEBUG;

export async function getMultiBrowser() {
  return browser as unknown as WebdriverIO.MultiRemoteBrowser;
}

export const config: WebdriverIO.Config = {
  ...baseConfig,
  capabilities: {
    a: {
      capabilities: {
        // 'maxInstances': debug ? 1 : 5,
        // 'maxInstances': 1,
        'browserName': 'chrome',
        'acceptInsecureCerts': true,
        // eslint-disable-next-line max-len
        // 'chromedriverExecutableDir': '/Users/alexrogers/.nvm/versions/node/v16.8.0/lib/node_modules/webdriver-manager/selenium/chromedriver_95.0.4638.54',
        'goog:chromeOptions': {
          args: chromeArgs,
        },
      },
    },
    b: {
      capabilities: {
        // 'maxInstances': debug ? 1 : 5,
        // 'maxInstances': 1,
        'browserName': 'chrome',
        'acceptInsecureCerts': true,
        'goog:chromeOptions': {
          args: chromeArgsTempProfile,
        },
      },
    },
  },
  specs: ['./src/frontend-e2e/specs/multi/**/*.ts'],
  /* Opens up console in browser*/
  before: function(capabilities, specs) {
    browser.keys('F12');
  },

  reporters: [
    'spec',
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      // disableWebdriverScreenshotsReporting: true,
      addConsoleLogs: true,
    }],
  ],


};

import {chromeArgs, chromeArgsTempProfile, config as baseConfig, videoA, videoB, videoC} from './wdio.base.conf';
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
        'goog:chromeOptions': {
          args: [
            ...chromeArgs,
            `--use-fake-device-for-media-stream`,
            `--use-file-for-fake-video-capture=${videoA}`,
          ],
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
          args: [
            ...chromeArgsTempProfile,
            `--use-fake-device-for-media-stream`,
            `--use-file-for-fake-video-capture=${videoB}`,
          ],
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

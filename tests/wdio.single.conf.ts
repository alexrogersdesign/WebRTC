import {chromeArgs, config as baseConfig} from './wdio.base.conf';
const debug = process.env.DEBUG;
import video from 'wdio-video-reporter';

export const config: WebdriverIO.Config = {
  ...baseConfig,
  capabilities: [{
    'maxInstances': debug? 1 : 5,
    //
    'browserName': 'chrome',
    'acceptInsecureCerts': true,
    'goog:chromeOptions': {
      args: chromeArgs,
    },
  }],
  specs: ['./src/frontend-e2e/specs/single/**/*.ts'],
  reporters: [
    [video, {
      saveAllVideos: false,
      videoSlowdownMultiplier: 3,
    }],
    ['allure', {
      outputDir: 'allure-results',
      disableWebdriverStepsReporting: true,
      // disableWebdriverScreenshotsReporting: true,
      addConsoleLogs: true,
    }],
  ],

};

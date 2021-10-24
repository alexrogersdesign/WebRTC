/**
 * A helper function that deletes text from a field via webdriver api.
 * This is useful for controlled text components where webdrivers clearValue()
 * does not work as intended
 * @param browserObject the browser element running the current test
 * @param selector the selector object to remove the value from
 */
const deleteValue = async (
    browserObject: WebdriverIO.Browser,
    selector: WebdriverIO.Element,
) => {
  const value = await selector.getValue();
  const count = value.length;
  /* loop and delete each element in value*/
  for (let i=0; i<count; i++) {
    await selector.click();
    await browserObject.keys(['Meta', 'a']);
    await browserObject.keys(['Backspace']);
  }
  /* Release key*/
  await browserObject.keys(['Meta', 'a']);
  await browserObject.pause(200);
};

export default deleteValue;

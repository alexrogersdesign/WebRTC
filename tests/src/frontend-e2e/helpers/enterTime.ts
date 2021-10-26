/**
 * Enters time into a date/time picker
 * @param browserObject the browser element running the current test
 * @param selector the selector object to enter the time into
 * @param time the date object representing the time
 */
const enterTime = async (
    browserObject: WebdriverIO.Browser,
    selector: WebdriverIO.Element,
    time: Date,
) => {
  await selector.click({x: -20});
  /* split the date into an array that can be looped through
  * the regex will remove all of the delimiters and create an array of
  * strings that match the time picker string
  * [month, day, year, hour, min, second, AM/PM]*/
  const dateArray = time.toLocaleString().split(/(?:[\s,]|[\/]|[:])+/);

  /* split string into char array */
  for (const item of dateArray) {
    let counter = 0;
    for (const key of item.split('')) {
      /* compensate for a single didgit value by adding a leading 0*/
      if (item.length === 1) await browserObject.keys(['0']);
      await browserObject.keys([key]);
      counter++;
    }
    if (counter >= 4) await browserObject.keys(['Tab']);
    /* Tab to the next value*/
    // await browserObject.keys(['Tab']);
  }
};

export default enterTime;

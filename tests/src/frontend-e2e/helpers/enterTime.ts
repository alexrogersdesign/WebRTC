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
  * i.e [month, day, year, hour, min, second, <AM | PM>*/
  const dateArray = time.toLocaleString().split(/(?:[\s,]|[\/]|[:])+/);

  /* split string into char array */
  for (const item of dateArray) {
    let counter = 0;
    for (const key of item.split('')) {
      /* compensate for a single digit value by adding a leading 0*/
      if (item.length === 1) await browserObject.keys(['0']);
      /* Enters keys into the field on at a time*/
      await browserObject.keys([key]);
      counter++;
    }
    /* Counter is used to compensate for the ability to add a 5 or 6
       digit year value if the count is above 4, and the above loop
       finishes a tab key is entered to skip the last 2 of the
       6 digit year input */
    if (counter >= 4) await browserObject.keys(['Tab']);
  }
};

export default enterTime;

// Various utility functions used by the application.
// In a larger project, there would likely be many "utils" modules, but for a
// small thing like this having a single "utils" file is probably kosher.

/**
 * Pads a number with zeroes so that it is exactly two digits long.
 *
 * Extra benefit: doesn't crash NPM ;)
 * (https://qz.com/646467/how-one-programmer-broke-the-internet-by-deleting-a-tiny-piece-of-code)
 *
 * @param {Number} num Must be an integer in the range [0, 99].
 *
 * @returns {String} Left-padded representation of the input number.
 *
 * @throws {Error} If num is not an integer, or is not in the range [0, 99].
 *                 (Having num be 100 or greater is problematic
 *                 because then by definition the number can't be represented
 *                 by two digits. ...At least in base 10.)
 */
function padzero(num) {
  // Note that we don't explicitly check that num is of type number. This is
  // partially because Number.isInteger() already handles these cases, and
  // partially because this way we can use duck typing in the future if
  // needed (e.g. if we'd switch to using BigInts or something).
  if (Number.isInteger(num)) {
    if (num >= 0 && num <= 99) {
      // Use of String.padStart() based on
      // https://github.com/marbl/MetagenomeScope/blob/master/metagenomescope/support_files/js/utils.js
      // (... I remembered writing this exact function for something
      // else a few weeks ago and had to look up what API function
      // I used)
      return String(num).padStart(2, "0");
    } else {
      throw new Error(
        "Input to padzero must be an integer in the range [0, 99]."
      );
    }
  } else {
    throw new Error("Input to padzero must be an integer.");
  }
}

/**
 * Converts a number of seconds to a human-readable time (formatted as MM:SS).
 *
 * Note that we do not throw an error if secs is < 0: instead, if this is the
 * case we just treat secs as if it were 0. Ideally we wouldn't need to do
 * this, but there may be weird corner-cases with the timer where the seconds
 * can dip into the negatives -- and to avoid these cases all immediately
 * exploding things, we're a little flexible here. (For a casual tool like a
 * Pomdoro timer a little imprecision here and there is probably fine; if we
 * were doing this and developing, like, a Geiger counter then we would
 * rightfully be fired ;)
 *
 * @param {Number} secs
 *
 * @returns {String} Representation of the input seconds as a human-readable
 *                   time
 *
 * @throws {Error} if secs is greater than 5,999 (equal to 99 minutes and 59
 *                 seconds -- this is the maximum displayable time using just
 *                 MM:SS notation). If we need to support longer durations of
 *                 time we could rectify this, but for now we make the
 *                 simplifying assumption that all Pomodoro sessions will be
 *                 shorter than this.
 */
function secsToHumanReadableTime(secs) {
  if (Number.isInteger(secs)) {
    if (secs < 0) {
      secs = 0;
    } else if (secs > 5999) {
      throw new Error(
        "Input to secsToHumanReadableTime must be an integer <= 5,999."
      );
    }
    const min = Math.floor(secs / 60);
    const sec = Math.floor(secs % 60);
    return `${padzero(min)}:${padzero(sec)}`;
  } else {
    throw new Error("Input to secsToHumanReadableTime must be an integer.");
  }
}

/**
 * Converts seconds to minutes, representing the output as a String.
 *
 * Currently we're very lax about what sort of inputs we accept: this is in
 * part because the storage stuff in some cases retrieves values as Strings. We
 * should really make this more restrictive when possible (so that secs must be
 * a Number).
 *
 * @param {String | Number} secs Must be interpretable using parseFloat() as a
 *                               Number >= 0.
 *
 * @param {Boolean} withSuffix Defaults to false. If true, this will add a
 *                             " mins" suffix to the output.
 *
 * @returns {String} mins Representation of the number of seconds as a number
 *                        of minutes. This uses Number.toLocaleString() to
 *                        format the number (so the user isn't punched in the
 *                        face with e.g. 0.5999999999).
 *
 * @throws {Error} If secs is not interpretable as a Number (i.e. calling
 *                 parseFloat() on it produces NaN), or if parseFloat()
 *                 determines it to be a negative Number.
 */
function secsToMins(secs, withSuffix = false) {
  const numSecs = parseFloat(secs);
  if (!Number.isNaN(numSecs)) {
    if (numSecs >= 0) {
      const mins = numSecs / 60;
      const formattedStr = mins.toLocaleString("en-US");
      if (withSuffix) {
        return `${formattedStr} mins`;
      } else {
        return formattedStr;
      }
    } else {
      throw new Error("Input to secsToMins must be a number >= 0.");
    }
  } else {
    throw new Error("Input to secsToMins must be a number.");
  }
}

/**
 * Restraining input as integer from 1 to 99
 * If input is a number but not with in 1~99, silently make it as close a possible.
 * If input is within range but not an integer, silently round to nearest int.
 *
 * @param {Number} numInput numInput that is expected to be a number from 1 to 99.
 *
 * @throws {Error} If numInput is not number, throw error.
 */
function validateNumInputs(nInput) {
  let numInput = parseFloat(nInput);
  if (!Number.isNaN(numInput)) {
    if (numInput < 1) {
      numInput = 1;
    } else if (numInput > 99) {
      numInput = 99;
    } else {
      numInput = Math.round(numInput);
    }
    return numInput;
  } else {
    throw new Error("Input must be a number.");
  }
}

module.exports = {
  padzero,
  secsToHumanReadableTime,
  secsToMins,
  validateNumInputs,
};

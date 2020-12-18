var assert = require("assert");
// I don't know why, but this breaks when I omit the trailing ".js". No idea
// why that works for other modules.
var utils = require("../../src/js/utils.js");
var session = require("../../src/js/session.js");

describe("Utils", function () {
  describe("padzero()", function () {
    it("Pads integers in the range [0, 9] with one zero", function () {
      assert.equal(utils.padzero(0), "00");
      assert.equal(utils.padzero(1), "01");
      assert.equal(utils.padzero(2), "02");
      assert.equal(utils.padzero(9), "09");
      // Check that JS doesn't do anything dumb here (it shouldn't, but you
      // probably can't be too careful with this language)
      assert.equal(utils.padzero(01), "01");
    });
    it("Doesn't do any padding for integers with two digits (in the range [10, 99])", function () {
      assert.equal(utils.padzero(10), "10");
      assert.equal(utils.padzero(99), "99");
    });
    it("Throws an error if a non-integer value is passed", function () {
      // This covers both Numbers that are not integers (e.g. 2.5, NaN) and
      // things that just straight up are not Numbers (e.g. "2", {1: 2}).
      const badStuff = [
        2.5,
        NaN,
        Infinity,
        -Infinity,
        89.99,
        "2",
        "I'm problematic!",
        [0, 99],
        [1],
        { 1: 2 },
        new Object(),
      ];
      for (const b of badStuff) {
        assert.throws(function () {
          utils.padzero(b);
        }, /Input to padzero must be an integer\./);
      }
    });
    it("Throws an error if an integer Number outside of the range [0, 99] is passed", function () {
      const badStuff = [
        -1,
        -99,
        -5,
        100,
        101,
        Number.MAX_SAFE_INTEGER,
        Number.MIN_SAFE_INTEGER,
      ];
      for (const b of badStuff) {
        assert.throws(function () {
          utils.padzero(b);
        }, /Input to padzero must be an integer in the range \[0, 99\]\./);
      }
    });
  });
  describe("secsToHumanReadableTime()", function () {
    it("Works when secs <= 59", function () {
      assert.equal(utils.secsToHumanReadableTime(59), "00:59");
      assert.equal(utils.secsToHumanReadableTime(5), "00:05");
      assert.equal(utils.secsToHumanReadableTime(1), "00:01");
      assert.equal(utils.secsToHumanReadableTime(0), "00:00");
    });
    it("Works when secs > 59 (while still below max)", function () {
      assert.equal(utils.secsToHumanReadableTime(60), "01:00");
      assert.equal(utils.secsToHumanReadableTime(61), "01:01");
      assert.equal(utils.secsToHumanReadableTime(5999), "99:59");
      assert.equal(utils.secsToHumanReadableTime(3333), "55:33");
    });
    it("Treats negative numbers as 0", function () {
      assert.equal(utils.secsToHumanReadableTime(-1), "00:00");
      assert.equal(utils.secsToHumanReadableTime(-1000), "00:00");
      assert.equal(
        utils.secsToHumanReadableTime(-Number.MAX_SAFE_INTEGER),
        "00:00"
      );
    });
    it("Throws an error if a non-integer value is passed", function () {
      const badStuff = [
        0.5,
        NaN,
        Infinity,
        -Infinity,
        "49",
        "did someone ask for an invalid input?",
        [],
      ];
      for (const b of badStuff) {
        assert.throws(function () {
          utils.secsToHumanReadableTime(b);
        }, /Input to secsToHumanReadableTime must be an integer\./);
      }
    });
    it("Throws an error if an integer > 5,999 is passed", function () {
      const badStuff = [
        6000,
        9001,
        Number.MAX_SAFE_INTEGER,
        Number.MAX_SAFE_INTEGER + 5,
      ];
      for (const b of badStuff) {
        assert.throws(function () {
          utils.secsToHumanReadableTime(b);
        }, /Input to secsToHumanReadableTime must be an integer <= 5,999\./);
      }
    });
  });
  describe("secsToMins()", function () {
    it("Works when withSuffix is false", function () {
      // 1500 = 25 * 60
      assert.equal(utils.secsToMins(1500), "25");
      assert.equal(utils.secsToMins(1501), "25.017");
      assert.equal(utils.secsToMins(0), "0");
      assert.equal(utils.secsToMins(1), "0.017");
    });
    it("Works when withSuffix is true", function () {
      // 1500 = 25 * 60
      assert.equal(utils.secsToMins(1500, true), "25 mins");
      assert.equal(utils.secsToMins(1501, true), "25.017 mins");
      assert.equal(utils.secsToMins(0, true), "0 mins");
      assert.equal(utils.secsToMins(1, true), "0.017 mins");
    });
    it("Throws an error when the input is a negative number", function () {
      assert.throws(function () {
        utils.secsToMins(-1);
      }, /Input to secsToMins must be a number >= 0\./);
    });
    it("Throws an error when the input is not interpretable as a number", function () {
      assert.throws(function () {
        utils.secsToMins("howdy");
      }, /Input to secsToMins must be a number\./);
    });
  });
  describe("getStatusMsg()", function () {
    const statuses = session.sessionStatusObj;
    it("Functions properly for work periods", function () {
      assert.equal(
        utils.getStatusMsg(statuses.WORKING, 1, 5),
        "Working... (1 / 5)"
      );
      assert.equal(
        utils.getStatusMsg(statuses.WORKING, 5, 5),
        "Working... (5 / 5)"
      );
      assert.equal(
        utils.getStatusMsg(statuses.WORK_PAUSE, 3, 4),
        "Working... (3 / 4)"
      );
    });
    it("Functions properly for break periods", function () {
      assert.equal(
        utils.getStatusMsg(statuses.BREAK, 2, 4),
        "Chilling... (2 / 4)"
      );
      assert.equal(
        utils.getStatusMsg(statuses.CHILL_PAUSE, 5, 5),
        "Chilling... (5 / 5)"
      );
    });
    it("Shows a general status when we don't recognize the session status", function () {
      assert.equal(
        utils.getStatusMsg(statuses.NOSESSION, 2, 4),
        "Pomodoro (2 / 4)"
      );
      assert.equal(
        utils.getStatusMsg("haha i'm evil", 3, 9),
        "Pomodoro (3 / 9)"
      );
    });
    // (This should never happen in practice, but if we change how we number
    // things then we might want to use this)
    it("Doesn't complain if periodNum is zero or negative", function () {
      assert.equal(
        utils.getStatusMsg(statuses.WORKING, 0, 2),
        "Working... (0 / 2)"
      );
    });
  });
});

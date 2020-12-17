var assert = require("assert");
// I don't know why, but this breaks when I omit the trailing ".js". No idea
// why that works for other modules.
var utils = require("../../src/js/utils.js");

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
});

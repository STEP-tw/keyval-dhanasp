const src = function(filePath) {
  return "../src/" + filePath
};
const errors = function(filePath) {
  return "../src/errors/" + filePath
};
const chai = require('chai');
const assert = chai.assert;
const Parser = require(src('index.js')).Parser;
const MissingValueError = require(errors('missingValueError.js'));
const MissingEndQuoteError = require(errors('missingEndQuoteError.js'));
const MissingKeyError = require(errors('missingKeyError.js'));
const MissingAssignmentOperatorError = require(errors('missingAssignmentOperatorError.js'));
const IncompleteKeyValuePairError = require(errors('incompleteKeyValuePairError.js'));
const Parsed = require(src('parsed.js'));

var kvParser;
var parsedExpectedObj=function(expectedObj){
  let parsed=new Parsed();
  Object.keys(expectedObj).forEach(function(key){
    parsed[key]=expectedObj[key];
  });
  return parsed;

}

describe("parse basic key values", function() {
  beforeEach(function() {
    kvParser = new Parser();
  });
  it("parses an empty string", function() {
    let actual = kvParser.parse("");
    assert.equal(0, actual.length());
  });

  it("parse key=value", function() {
    let actual = kvParser.parse("key=value");
    assert.equal("value", actual.key);
    assert.equal(1, actual.length());
  });

  it("parse when there are leading spaces before key", function() {
    let actual = kvParser.parse(" key=value");
    let expectedObj = {
      'key': 'value'
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse(" key=value"));
  });

  it("parse when there are spaces after key", function() {
    let expectedObj = {
      'key': "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key =value"));
  });

  it("parse when there are spaces before and after key", function() {
    let expectedObj = {
      key: "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse(" key =value"));
  });

  it("parse when there are spaces before value", function() {
    let expectedObj = {
      key: "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key= value"));
  });

  it("parse when there are spaces after value", function() {
    let expectedObj = {
      key: "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key=value "));
  });
});

describe("parse digits and other special chars", function() {
  beforeEach(function() {
    kvParser = new Parser();
  });

  it("parse keys with a single digit", function() {
    let expectedObj = {
      '1': "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("1=value"));
  });

  it("parse keys with only multiple digits", function() {
    let expectedObj = {
      '123': "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("123=value"));
  });

  it("parse keys with leading 0s", function() {
    let expectedObj = {
      '0123': "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("0123=value"));
  });

  it("parse keys with underscores", function() {
    let expectedObj = {
      'first_name': "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("first_name=value"));
  });

  it("parse keys with a single underscore", function() {
    let expectedObj = {
      '_': "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("_=value"));
  });

  it("parse keys with multiple underscores", function() {
    let expectedObj = {
      '__': "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("__=value"));
  });

  it("parse keys with alphabets and digits(digits leading)", function() {
    let expectedObj = {
      '0abc': "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("0abc=value"));
  });

  it("parse keys with alphabets and digits(alphabets leading)", function() {
    let expectedObj = {
      'a0bc': "value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("a0bc=value"));
  });
});

describe("multiple keys", function() {
  beforeEach(function() {
    kvParser = new Parser();
  });

  it("parse more than one key", function() {
    let expectedObj = {
      key: "value",
      anotherkey: "anothervalue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key=value anotherkey=anothervalue"));
  });

  it("parse more than one key when keys have leading spaces", function() {
    let expectedObj = {
      key: "value",
      anotherkey: "anothervalue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("   key=value anotherkey=anothervalue"));
  });

  it("parse more than one key when keys have trailing spaces", function() {
    let expectedObj = {
      key: "value",
      anotherkey: "anothervalue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key  =value anotherkey  =anothervalue"));
  });

  it("parse more than one key when keys have leading and trailing spaces", function() {
    let expectedObj = {
      key: "value",
      anotherkey: "anothervalue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("  key  =value anotherkey  =anothervalue"));
  });
});

describe("single values with quotes", function() {
  beforeEach(function() {
    kvParser = new Parser();
  });

  it("parse a single value with quotes", function() {
    let expectedObj = {
      key: "value"
    };
    expected=parsedExpectedObj(expectedObj);

    assert.deepEqual(expected, kvParser.parse("key=\"value\""));
  });

  it("parse a single quoted value that has spaces in it", function() {
    let expectedObj = {
      key: "va lue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key=\"va lue\""));
  });

  it("parse a single quoted value that has spaces in it and leading spaces", function() {
    let expectedObj = {
      key: "va lue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key=   \"va lue\""));
  });

  it("parse a single quoted value that has spaces in it and trailing spaces", function() {
    let expectedObj = {
      key: "va lue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key=\"va lue\"   "));
  });
});

describe("multiple values with quotes", function() {
  it("parse more than one value with quotes", function() {
    let expectedObj = {
      key: "va lue",
      anotherkey: "another value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key=\"va lue\" anotherkey=\"another value\""));
  });

  it("parse more than one value with quotes with leading spaces", function() {
    let expectedObj = {
      key: "va lue",
      anotherkey: "another value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key= \"va lue\" anotherkey= \"another value\""));
  });

  it("parse more than one value with quotes when keys have trailing spaces", function() {
    let expectedObj = {
      key: "va lue",
      anotherkey: "another value"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key = \"va lue\" anotherkey = \"another value\""));
  });
});

describe("mixed values with both quotes and without", function() {
  it("parse simple values with and without quotes", function() {
    let expectedObj = {
      key: "value",
      anotherkey: "anothervalue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key=value anotherkey=\"anothervalue\""));
  });

  it("parse simple values with and without quotes and leading spaces on keys", function() {
    let expectedObj = {
      key: "value",
      anotherkey: "anothervalue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("   key=value anotherkey=\"anothervalue\""));
  });

  it("parse simple values with and without quotes and trailing spaces on keys", function() {
    let expectedObj = {
      key: "value",
      anotherkey: "anothervalue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("key  =value anotherkey  =\"anothervalue\""));
  });

  it("parse simple values with and without quotes and leading and trailing spaces on keys", function() {
    let expectedObj = {
      key: "value",
      anotherkey: "anothervalue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("  key  =value anotherkey  = \"anothervalue\""));
  });

  it("parse simple values with and without quotes(quoted values first)", function() {
    let expectedObj = {
      key: "value",
      anotherkey: "anothervalue"
    };
    expected=parsedExpectedObj(expectedObj);
    assert.deepEqual(expected, kvParser.parse("anotherkey=\"anothervalue\" key=value"));
  });
});

const errorChecker = function(key, pos, typeOfError) {
  return function(err) {
    if (err instanceof typeOfError && err.key == key && err.position == pos)
      return true;
    return false;
  }
}

describe("error handling", function() {
  beforeEach(function() {
    kvParser = new Parser();
  });

  it("throws error on missing value when value is unquoted", function() {

    assert.throws(
      () => {
        try {
          kvParser.parse("key=")
        } catch (e) {
          let isError=errorChecker("key",3,MissingValueError)
          if (isError(err)) {
              throw err;
          }
        }
      },Error
    )
  });

  it("throws error on missing value when value is quoted", function() {
    assert.throws(
      () => {
        try {
          kvParser.parse("key=\"value")
        } catch (e) {
          let isError=errorChecker("key",9,MissingEndQuoteError)
          if (isError(err)) {
              throw err;
          }
        }
      },Error
    )
  });

  it("throws error on missing key", function() {
    assert.throws(
      () => {
        try {
          var p = kvParser.parse("=value");
        } catch (e) {
          let isError=errorChecker(undefined,0,MissingKeyError)
          if (isError(err)) {
              throw err;
          }
        }
      },Error
    )
  });

  it("throws error on invalid key", function() {
    assert.throws(
      () => {
        try {
          var p = kvParser.parse("'foo'=value");
        } catch (e) {
          let isError=errorChecker(undefined,0,MissingKeyError)
          if (isError(err)) {
              throw err;
          }
        }
      },Error
    )
  });

  it("throws error on missing assignment operator", function() {
    assert.throws(
      () => {
        try {
          var p = kvParser.parse("key value");
        } catch (e) {
          let isError=errorChecker(undefined,4,MissingAssignmentOperatorError)
          if (isError(err)) {
              throw err;
          }
        }
      },Error
    )
  });

  it("throws error on incomplete key value pair", function() {
    assert.throws(
      () => {
        try {
          var p = kvParser.parse("key");
        } catch (e) {
          let isError=errorChecker(undefined,2,IncompleteKeyValuePairError)
          if (isError(err)) {
              throw err;
          }
        }
      },Error
    )
  });

});

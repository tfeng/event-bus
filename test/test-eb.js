var assert = require('assert'),
    EB = require("../lib/event-bus").EB;

describe("TestParameter", function() {
  describe("#Single", function() {
    it("should receive parameter Hello", function(done) {
      var eb = new EB();
      eb.listen("msg", function(p) {
        assert.equal(p, "Hello");
        done();
      });
      eb.event("msg")("Hello");
    });
  });

  describe("#Parameters123", function() {
    it("should receive parameters 1, 2, 3", function(done) {
      var eb = new EB();
      eb.listen("msg", function(a, b, c) {
        assert.equal(a, 1);
        assert.equal(b, 2);
        assert.equal(c, 3);
        done();
      });
      eb.event("msg")(1, 2, 3);
    });
  });

  describe("#MultipleCallbacks", function() {
    it("should receive parameters 1, 2, 3 and cnt should be 2 at last", function(done) {
      var eb = new EB();
      var cnt = 0;
      eb.listen("msg", function(a, b, c) {
        assert.equal(a, 1);
        assert.equal(b, 2);
        assert.equal(c, 3);
        assert.equal(cnt++, 0);
      });
      eb.listen("msg", function() {
        assert.equal(cnt++, 1);
      });
      eb.listen("msg", function(a, b, c) {
        assert.equal(a, 1);
        assert.equal(b, 2);
        assert.equal(c, 3);
        assert.equal(cnt++, 2);
        done();
      });
      eb.event("msg")(1, 2, 3);
    });
  });

  describe("#Join", function() {
    it("should only call the last function", function(done) {
      var eb = new EB();
      eb.join("msg", function() {
        assert(false, "This should not be hit.");
      });
      eb.join("msg", function() {
        assert(false, "This should not be hit.");
      });
      eb.join("msg", function() {
        assert(true, "This should be called.");
        done();
      });
      eb.event("msg")();
    });
  });
});

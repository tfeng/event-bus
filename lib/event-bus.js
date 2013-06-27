"use strict";

var events = require("events"),
    util = require("util"),
    Map = require("collection").Map,
    Set = require("collection").Set,
    Vector = require("collection").Vector;

var EB = function(events) {
  this.callbackMap = new Map();
  this.events = new Set(events);
};

util.inherits(EB, events.EventEmitter);

function checkEvent(eb, event) {
  if (!eb.events.isEmpty() && !eb.events.has(event)) {
    throw new Error(util.format("Event %s is undefined.", event));
  }
}

function addCallback(eb, event, callback, isJoin) {
  var callbacks = eb.callbackMap.get(event);
  if (callbacks == undefined) {
    callbacks = new Vector([callback]);
    eb.callbackMap.set(event, callbacks);
    eb.on(event, function() {
      var callbacks = eb.callbackMap.get(event);
      var params = arguments;
      while (!callbacks.isEmpty()) {
        var callback = callbacks.get(0);
        callbacks.removeAt(0);
        if (!isJoin || callbacks.isEmpty()) {
          callback.apply(eb, params);
        }
      }
    });
  } else {
    callbacks.add(callback);
  }
}

EB.prototype.listen = function(event, callback) {
  checkEvent(this, event);
  addCallback(this, event, callback, false);
};

EB.prototype.join = function(event, callback) {
  checkEvent(this, event);
  addCallback(this, event, callback, true);
};

EB.prototype.callback = function(event) {
  var $this = this;
  return function() {
    Array.prototype.unshift.call(arguments, event);
    $this.emit.apply($this, arguments);
  };
};

EB.prototype.delay = function(time, event) {
  var $this = this;
  var params = arguments;
  Array.prototype.shift.call(params, 2);
  setTimeout(function() {
    $this.emit.apply($this, params);
  }, time);
};

EB.prototype.clear = function(event) {
  var callbacks = this.callbackMap.get(event);
  if (callbacks) {
    callbacks.clear();
  }
};

EB.prototype.clearAll = function() {
  this.callbackMap.clear();
};

exports.EB = EB;

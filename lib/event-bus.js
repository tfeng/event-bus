"use strict";

var events = require("events"),
    util = require("util");

var EB = function(events) {
  this.callbackMap = [];
  this.events = events;
};

util.inherits(EB, events.EventEmitter);

function checkEvent(eb, event) {
  if (eb.events != undefined && !(event in eb.events)) {
    throw new Error(util.format("Event %s is undefined.", event));
  }
}

function addCallback(eb, event, callback, isJoin) {
  var list = eb.callbackMap[event];
  if (list == undefined) {
    list = [callback];
    eb.callbackMap[event] = list;
    eb.on(event, function() {
      var params = arguments;
      for (var i = 0; i < eb.callbackMap[event].length; i++) {
        if (!isJoin || i == eb.callbackMap[event].length - 1) {
          eb.callbackMap[event][i].apply(eb, params);
        }
      }
    });
  } else {
    list.push(callback);
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
  this.callbackMap[event] = undefined;
};

EB.prototype.clearAll = function() {
  this.callbackMap = [];
};

exports.EB = EB;
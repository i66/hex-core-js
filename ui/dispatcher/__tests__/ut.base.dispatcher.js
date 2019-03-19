'use strict';

jest.autoMockOff();
jest.useFakeTimers();

describe('BaseDispatcher', function() {
  var BaseDispatcher;

  beforeEach(function() {
    var BaseDispatcherConstructor = require('../base.dispatcher');
    BaseDispatcher = new BaseDispatcherConstructor();
  });

  it('sends actions to subscribers', function() {
    var listener = jest.fn();
    BaseDispatcher.register(listener);
    var payload = {};
    BaseDispatcher.dispatch(payload);
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0]).toBe(payload);
  });

  it('Dispatch queue parallel', function() {
    var listener1 = jest.fn();
    var listener2 = jest.fn();
    var listener3 = jest.fn();
    var listener4 = jest.fn();
    var listener5 = jest.fn();
    var listener6 = jest.fn();
    var listener7 = jest.fn();
    var listener8 = jest.fn();
    var listener9 = jest.fn();
    var listener10 = jest.fn();

    BaseDispatcher.register(listener1);
    BaseDispatcher.register(listener2);
    BaseDispatcher.register(listener3);
    BaseDispatcher.register(listener4);
    BaseDispatcher.register(listener5);
    BaseDispatcher.register(listener6);
    BaseDispatcher.register(listener7);
    BaseDispatcher.register(listener8);
    BaseDispatcher.register(listener9);
    BaseDispatcher.register(listener10);
    var payload = {};

    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {BaseDispatcher.dispatch(payload);}, 10);
    jest.runAllTimers();

    expect(listener1.mock.calls.length).toBe(10);
    expect(listener2.mock.calls.length).toBe(10);
    expect(listener3.mock.calls.length).toBe(10);
    expect(listener4.mock.calls.length).toBe(10);
    expect(listener5.mock.calls.length).toBe(10);
    expect(listener6.mock.calls.length).toBe(10);
    expect(listener7.mock.calls.length).toBe(10);
    expect(listener8.mock.calls.length).toBe(10);
    expect(listener9.mock.calls.length).toBe(10);
    expect(listener10.mock.calls.length).toBe(10);
  });

  it('waits with chained dependencies properly', function() {
    var payload = {};

    var listener1Done = false;
    var listener1 = function(pl) {
      BaseDispatcher.waitFor([index2, index4]);
      // Second, third, and fourth listeners should have now been called
      expect(listener2Done).toBe(true);
      expect(listener3Done).toBe(true);
      expect(listener4Done).toBe(true);
      listener1Done = true;
    };

    var index1 = BaseDispatcher.register(listener1);

    var listener2Done = false;
    var listener2 = function(pl) {
      BaseDispatcher.waitFor([index3]);
      expect(listener3Done).toBe(true);
      listener2Done = true;
    };
    var index2 = BaseDispatcher.register(listener2);

    var listener3Done = false;
    var listener3 = function(pl) {
      listener3Done = true;
    };
    var index3 = BaseDispatcher.register(listener3);

    var listener4Done = false;
    var listener4 = function(pl) {
      BaseDispatcher.waitFor([index3]);
      expect(listener3Done).toBe(true);
      listener4Done = true;
    };
    var index4 = BaseDispatcher.register(listener4);

    BaseDispatcher.dispatch(payload);

    expect(listener1Done).toBe(true);
    expect(listener2Done).toBe(true);
    expect(listener3Done).toBe(true);

  });

});

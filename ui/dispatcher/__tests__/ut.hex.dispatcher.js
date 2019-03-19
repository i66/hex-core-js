'use strict';

jest.autoMockOff();
jest.useFakeTimers();

describe('HexDispatcher', function() {
  var HexDispatcher;

  beforeEach(function() {
    HexDispatcher = require('../hex.dispatcher');
  });

  it('sends actions to subscribers', function() {
    var listener = jest.fn();
    HexDispatcher.register(listener);
    var payload = {};
    HexDispatcher.dispatch(payload);
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

    HexDispatcher.register(listener1);
    HexDispatcher.register(listener2);
    HexDispatcher.register(listener3);
    HexDispatcher.register(listener4);
    HexDispatcher.register(listener5);
    HexDispatcher.register(listener6);
    HexDispatcher.register(listener7);
    HexDispatcher.register(listener8);
    HexDispatcher.register(listener9);
    HexDispatcher.register(listener10);
    var payload = {};

    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
    setTimeout(function() {HexDispatcher.dispatch(payload);}, 10);
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
      HexDispatcher.waitFor([index2, index4]);
      // Second, third, and fourth listeners should have now been called
      expect(listener2Done).toBe(true);
      expect(listener3Done).toBe(true);
      expect(listener4Done).toBe(true);
      listener1Done = true;
    };

    var index1 = HexDispatcher.register(listener1);

    var listener2Done = false;
    var listener2 = function(pl) {
      HexDispatcher.waitFor([index3]);
      expect(listener3Done).toBe(true);
      listener2Done = true;
    };
    var index2 = HexDispatcher.register(listener2);

    var listener3Done = false;
    var listener3 = function(pl) {
      listener3Done = true;
    };
    var index3 = HexDispatcher.register(listener3);

    var listener4Done = false;
    var listener4 = function(pl) {
      HexDispatcher.waitFor([index3]);
      expect(listener3Done).toBe(true);
      listener4Done = true;
    };
    var index4 = HexDispatcher.register(listener4);

    HexDispatcher.dispatch(payload);

    expect(listener1Done).toBe(true);
    expect(listener2Done).toBe(true);
    expect(listener3Done).toBe(true);

  });
});

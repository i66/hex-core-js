'use strict';

jest.autoMockOff();
jest.useFakeTimers();

describe('HexLogger', function() {
  var HexLogger;

  beforeEach(function() {
    HexLogger = require('../hex.logger');
  });

  afterEach(function() {
    HexLogger.unregisterAll();
    jest.clearAllTimers();
  });
/*
  it('log with tag normal', function() {
    expect(function() {
      HexLogger.log('test log', '123');
    }).not.toThrow();
  });

  it('log with tag number', function() {
    expect(function() {
      HexLogger.log('test log', 123);
    }).not.toThrow();
  });

  it('log with tag object', function() {
      expect(function() {
        HexLogger.log('test log', {a: 1,b: 2,c: 4});
      }).not.toThrow();
    });

  it('log with tag and random type', function() {
    expect(function() {
      HexLogger.log('test log', '123', '12312321');
    }).not.toThrow();
  });

  it('log with number', function() {
    expect(function() {
      HexLogger.log(12334433);
    }).not.toThrow();
  });

  it('log with object', function() {
    expect(function() {
      HexLogger.log({a: 1,b: 223,c: 445454});
    }).not.toThrow();
  });

  it('log with nothing', function() {
    expect(function() {
      HexLogger.log();
    }).not.toThrow();
  });

  it('error normal', function() {
    expect(function() {
      HexLogger.error('message', 'type');
    }).not.toThrow();
  });

  it('warn normal', function() {
    expect(function() {
      HexLogger.warn('message', 'type');
    }).not.toThrow();
  });
*/
  it('info normal', function() {
    expect(function() {
      HexLogger.info('message', 'type');
    }).not.toThrow();
    expect(function() {
      HexLogger.info('message2', 'type');
    }).not.toThrow();
  });

  it('sends actions to subscribers', function() {
    var listener = jest.fn();

    var token = HexLogger.register(listener);
    expect(token).not.toBe('');

    HexLogger.info('test_info');
    jest.runAllTimers();
    console.log(listener.mock.calls);
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0][0]).toBe('info');
    expect(listener.mock.calls[0][0][1]).toContain('test_info');

    HexLogger.warn('test_warn');
    jest.runAllTimers();
    expect(listener.mock.calls.length).toBe(2);
    expect(listener.mock.calls[1][0][0]).toBe('warn');
    expect(listener.mock.calls[1][0][1]).toContain('test_warn');

    HexLogger.error('test_error');
    jest.runAllTimers();
    expect(listener.mock.calls.length).toBe(3);
    expect(listener.mock.calls[2][0][0]).toBe('error');
    expect(listener.mock.calls[2][0][1]).toContain('test_error');

  });

  it('unregister', function() {
    var listener = jest.fn();

    var token = HexLogger.register(listener);

    HexLogger.info('test_info');
    jest.runAllTimers();
    expect(listener.mock.calls.length).toBe(1);
    expect(listener.mock.calls[0][0][0]).toBe('info');
    expect(listener.mock.calls[0][0][1]).toContain('test_info');

    HexLogger.unregister(token);
    HexLogger.info('test_info');
    jest.runAllTimers();
    expect(listener.mock.calls.length).toBe(1);

  });

  it('unregister all', function() {
    var listener1 = jest.fn();
    var listener2 = jest.fn();
    var listener3 = jest.fn();
    var listener4 = jest.fn();
    var listener5 = jest.fn();

    HexLogger.register(listener1);
    HexLogger.register(listener2);
    HexLogger.register(listener3);
    HexLogger.register(listener4);
    HexLogger.register(listener5);

    HexLogger.info('test_info');
    jest.runAllTimers();
    expect(listener1.mock.calls.length).toBe(1);
    expect(listener2.mock.calls.length).toBe(1);
    expect(listener3.mock.calls.length).toBe(1);
    expect(listener4.mock.calls.length).toBe(1);
    expect(listener5.mock.calls.length).toBe(1);

    HexLogger.unregisterAll();

    HexLogger.info('test_info');
    jest.runAllTimers();
    expect(listener1.mock.calls.length).toBe(1);
    expect(listener2.mock.calls.length).toBe(1);
    expect(listener3.mock.calls.length).toBe(1);
    expect(listener4.mock.calls.length).toBe(1);
    expect(listener5.mock.calls.length).toBe(1);
  });

});

'use strict';

jest.mock('../../tools/hex.logger');

global.require = require;

describe('HexAudioMgr', function() {
  var HexAudioMgr;

  function mockAudioClass() {
    this.path = '';
    this.loop = false;
    this.isPlaying = false;
    this.currentTime = 0;
  }

  mockAudioClass.prototype.play = function() {
    this.isPlaying = true;
  };

  mockAudioClass.prototype.pause = function() {
    this.isPlaying = false;
  };

  beforeEach(function() {
    HexAudioMgr = require('../hex.audio.mgr');
    HexAudioMgr.reset();
    HexAudioMgr.setAudioClass(mockAudioClass);
  });

  afterEach(function() {
    HexAudioMgr = null;
  });

  var id1 = 'id_1';
  var id2 = 'id_2';
  var id3 = 'id_3';

  var path1 = 'path/file1.mp3';
  var path2 = 'path/file2.mp3';
  var path3 = 'path/file3.mp3';

  it('register - normal', function() {
    HexAudioMgr.register(id1, path1);
    HexAudioMgr.register(id2, path2);
    HexAudioMgr.register(id3, path3);

    expect(HexAudioMgr.getPath(id1)).toEqual(path1);
    expect(HexAudioMgr.getPath(id2)).toEqual(path2);
    expect(HexAudioMgr.getPath(id3)).toEqual(path3);
  });

  it('register - duplicated', function() {
    HexAudioMgr.register(id1, path1);
    expect(HexAudioMgr.getPath(id1)).toEqual(path1);

    HexAudioMgr.register(id1, path2);
    expect(HexAudioMgr.getPath(id1)).toEqual(path2);

    HexAudioMgr.register(id1, path3);
    expect(HexAudioMgr.getPath(id1)).toEqual(path3);
  });

  it('getPath - success', function() {
    HexAudioMgr.register(id1, path1);
    expect(HexAudioMgr.getPath(id1)).toBe(path1);
  });

  it('getPath - not found', function() {
    expect(HexAudioMgr.getPath(id1)).toEqual(null);
  });

  it('getInstance - success', function() {
    HexAudioMgr.register(id1, path1);
    HexAudioMgr.play(id1);
    expect(HexAudioMgr.getInstance(id1)).not.toBe(null);
  });

  it('getInstance - not found', function() {
    expect(HexAudioMgr.getInstance(id1)).toBe(null);
  });

  it('setMuted', function() {
    expect(HexAudioMgr.getIsMuted()).toBe(false);
    HexAudioMgr.setMuted(true);
    expect(HexAudioMgr.getIsMuted()).toBe(true);
  });

  it('play - success', function() {
    HexAudioMgr.register(id1, path1);
    HexAudioMgr.register(id2, path2);
    HexAudioMgr.register(id3, path3);

    expect(HexAudioMgr.play(id1)).toBe(true);
    expect(HexAudioMgr.play(id2)).toBe(true);
    expect(HexAudioMgr.play(id3)).toBe(true);

    var audio1 = HexAudioMgr.getInstance(id1);
    var audio2 = HexAudioMgr.getInstance(id2);
    var audio3 = HexAudioMgr.getInstance(id3);

    expect(audio1.refIsPlaying).toBe(true);
    expect(audio2.refIsPlaying).toBe(true);
    expect(audio3.refIsPlaying).toBe(true);

    expect(audio1.loop).toBe(false);
    expect(audio2.loop).toBe(false);
    expect(audio3.loop).toBe(false);
  });

  it('playLoop - success', function() {
    HexAudioMgr.register(id1, path1);
    HexAudioMgr.register(id2, path2);
    HexAudioMgr.register(id3, path3);

    expect(HexAudioMgr.playLoop(id1)).toBe(true);
    expect(HexAudioMgr.playLoop(id2)).toBe(true);
    expect(HexAudioMgr.playLoop(id3)).toBe(true);

    expect(HexAudioMgr.isSetLoop(id1)).toBe(true);
    expect(HexAudioMgr.isSetLoop(id2)).toBe(true);
    expect(HexAudioMgr.isSetLoop(id3)).toBe(true);

    var audio1 = HexAudioMgr.getInstance(id1);
    var audio2 = HexAudioMgr.getInstance(id2);
    var audio3 = HexAudioMgr.getInstance(id3);

    expect(audio1.refIsPlaying).toBe(true);
    expect(audio1.loop).toBe(true);

    expect(audio2.refIsPlaying).toBe(true);
    expect(audio2.loop).toBe(true);

    expect(audio3.refIsPlaying).toBe(true);
    expect(audio3.loop).toBe(true);
  });

  it('stop - success', function() {
    HexAudioMgr.register(id1, path1);
    HexAudioMgr.register(id2, path2);
    HexAudioMgr.register(id3, path3);

    expect(HexAudioMgr.play(id1)).toBe(true);
    expect(HexAudioMgr.play(id2)).toBe(true);
    expect(HexAudioMgr.play(id3)).toBe(true);

    var audio1 = HexAudioMgr.getInstance(id1);
    var audio2 = HexAudioMgr.getInstance(id2);
    var audio3 = HexAudioMgr.getInstance(id3);

    expect(audio1.refIsPlaying).toBe(true);
    expect(audio2.refIsPlaying).toBe(true);
    expect(audio3.refIsPlaying).toBe(true);

    expect(HexAudioMgr.stop(id1)).toBe(true);
    expect(HexAudioMgr.stop(id2)).toBe(true);
    expect(HexAudioMgr.stop(id3)).toBe(true);

    expect(audio1.refIsPlaying).toBe(false);
    expect(audio2.refIsPlaying).toBe(false);
    expect(audio3.refIsPlaying).toBe(false);
  });

  it('stop - loop / success', function() {
    HexAudioMgr.register(id1, path1);
    HexAudioMgr.register(id2, path2);
    HexAudioMgr.register(id3, path3);

    expect(HexAudioMgr.playLoop(id1)).toBe(true);
    expect(HexAudioMgr.playLoop(id2)).toBe(true);
    expect(HexAudioMgr.playLoop(id3)).toBe(true);

    expect(HexAudioMgr.isSetLoop(id1)).toBe(true);
    expect(HexAudioMgr.isSetLoop(id2)).toBe(true);
    expect(HexAudioMgr.isSetLoop(id3)).toBe(true);

    var audio1 = HexAudioMgr.getInstance(id1);
    var audio2 = HexAudioMgr.getInstance(id2);
    var audio3 = HexAudioMgr.getInstance(id3);

    expect(audio1.refIsPlaying).toBe(true);
    expect(audio2.refIsPlaying).toBe(true);
    expect(audio3.refIsPlaying).toBe(true);

    expect(HexAudioMgr.stop(id1)).toBe(true);
    expect(HexAudioMgr.stop(id2)).toBe(true);
    expect(HexAudioMgr.stop(id3)).toBe(true);

    expect(audio1.refIsPlaying).toBe(false);
    expect(audio2.refIsPlaying).toBe(false);
    expect(audio3.refIsPlaying).toBe(false);

    expect(HexAudioMgr.isSetLoop(id1)).toBe(false);
    expect(HexAudioMgr.isSetLoop(id2)).toBe(false);
    expect(HexAudioMgr.isSetLoop(id3)).toBe(false);
  });

  it('stop - no found', function() {
    expect(HexAudioMgr.stop(id1)).toBe(false);
    expect(HexAudioMgr.stop(id2)).toBe(false);
    expect(HexAudioMgr.stop(id3)).toBe(false);
  });

  it('play - no found', function() {
    expect(HexAudioMgr.play(id1)).toBe(false);
    expect(HexAudioMgr.play(id2)).toBe(false);
    expect(HexAudioMgr.play(id3)).toBe(false);
  });

  it('reset', function() {
    HexAudioMgr.register(id1, path1);
    HexAudioMgr.register(id2, path2);
    HexAudioMgr.register(id3, path3);

    expect(HexAudioMgr.getPath(id1)).toBe(path1);
    expect(HexAudioMgr.getPath(id2)).toBe(path2);
    expect(HexAudioMgr.getPath(id3)).toBe(path3);

    expect(HexAudioMgr.playLoop(id1)).toBe(true);
    expect(HexAudioMgr.playLoop(id2)).toBe(true);
    expect(HexAudioMgr.play(id3)).toBe(true);

    expect(HexAudioMgr.isSetLoop(id1)).toBe(true);
    expect(HexAudioMgr.isSetLoop(id2)).toBe(true);

    HexAudioMgr.reset();

    expect(HexAudioMgr.getPath(id1)).toBe(null);
    expect(HexAudioMgr.getPath(id2)).toBe(null);
    expect(HexAudioMgr.getPath(id3)).toBe(null);

    expect(HexAudioMgr.getInstance(id1)).toBe(null);
    expect(HexAudioMgr.getInstance(id2)).toBe(null);
    expect(HexAudioMgr.getInstance(id3)).toBe(null);

  });

  it('setMuted / stop all playing sound', function() {
    HexAudioMgr.register(id1, path1);
    HexAudioMgr.register(id2, path2);
    HexAudioMgr.register(id3, path3);

    expect(HexAudioMgr.getPath(id1)).toBe(path1);
    expect(HexAudioMgr.getPath(id2)).toBe(path2);
    expect(HexAudioMgr.getPath(id3)).toBe(path3);

    expect(HexAudioMgr.playLoop(id1)).toBe(true);
    expect(HexAudioMgr.playLoop(id2)).toBe(true);
    expect(HexAudioMgr.play(id3)).toBe(true);

    var audio1 = HexAudioMgr.getInstance(id1);
    var audio2 = HexAudioMgr.getInstance(id2);
    var audio3 = HexAudioMgr.getInstance(id3);

    expect(audio1.refIsPlaying).toBe(true);
    expect(audio2.refIsPlaying).toBe(true);
    expect(audio3.refIsPlaying).toBe(true);

    expect(HexAudioMgr.getIsMuted()).toBe(false);
    HexAudioMgr.setMuted(true);
    expect(HexAudioMgr.getIsMuted()).toBe(true);

    expect(audio1.refIsPlaying).toBe(false);
    expect(audio2.refIsPlaying).toBe(false);
    expect(audio3.refIsPlaying).toBe(false);

    // Un muted, loop should be replay
    HexAudioMgr.setMuted(false);
    expect(HexAudioMgr.getIsMuted()).toBe(false);

    expect(audio1.refIsPlaying).toBe(true);
    expect(audio2.refIsPlaying).toBe(true);
    expect(audio3.refIsPlaying).toBe(false);
  });

});

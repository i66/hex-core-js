'use strict';

jest.autoMockOff();

var util = require('../hex.util');

describe('util', function() {

  describe('util - removeFromAry', function() {

    it('normal input', function() {
      expect(util.removeFromAry(2, [1, 2, 3])).toEqual([1, 3]);
    });

    it('string input', function() {
      expect(util.removeFromAry('a', ['a', 'b', 'c'])).toEqual(['b', 'c']);
    });

    it('no return', function() {
      var ary = [1, 2, 3];
      util.removeFromAry(2, ary);
      expect(ary).toEqual([1, 3]);
    });

    it('not array', function() {
      expect(util.removeFromAry(2, 123)).toEqual(null);
    });

  });

  describe('util - cleanAry', function() {

    it('normal input - single', function() {
      expect(util.cleanAry(2, [1, 2, 3])).toEqual([1, 3]);
    });

    it('normal input - multi', function() {
      expect(util.cleanAry(2, [1, 2, 2, 2, 2, 2, 3])).toEqual([1, 3]);
    });

    it('string input', function() {
      expect(util.cleanAry('a', ['a', 'a', 'b', 'c'])).toEqual(['b', 'c']);
    });

    it('no return', function() {
      var ary = [1, 2, 2, 2, 5, 5, 5, 5, 3];
      util.cleanAry(2, ary);
      util.cleanAry(5, ary);
      expect(ary).toEqual([1, 3]);
    });

    it('not array', function() {
      expect(util.cleanAry(2, 123)).toEqual(null);
    });

  });

  describe('util - getAbsoutePosition', function() {

    it('simple element', function() {

      var element = {offsetTop: 10, offsetLeft: 10};
      var pos = util.getAbsoutePosition(element);
      expect(pos.top).toEqual(10);
      expect(pos.left).toEqual(10);

    });

    it('nested element', function() {

      var element = {offsetTop: 10, offsetLeft: 10};

      for (var i = 0; i < 10; i++) {
        var newEle = {offsetTop: 10, offsetLeft: 10};
        newEle.offsetParent = element;
        element = newEle;
      }

      var pos = util.getAbsoutePosition(element);
      expect(pos.top).toEqual(110);
      expect(pos.left).toEqual(110);

    });

    it('non-element', function() {
      var pos = util.getAbsoutePosition(null);
      expect(pos.top).toEqual(0);
      expect(pos.left).toEqual(0);
    });

    it('non DOM element', function() {
      var pos = util.getAbsoutePosition({});
      expect(pos.top).toEqual(0);
      expect(pos.left).toEqual(0);
    });

  });

  describe('util - getRandomInt', function() {

    it('general range', function() {
      var res = util.getRandomInt(-100, 100);
      expect(res >= -100).toBeTruthy();
      expect(res <= 100).toBeTruthy();
    });

    it('reversed range', function() {
      var res = util.getRandomInt(100, -100);
      expect(res >= -100).toBeTruthy();
      expect(res <= 100).toBeTruthy();
    });

    it('same range', function() {
      var res = util.getRandomInt(10, 10);
      expect(res).toEqual(10);
    });

    it('positive range', function() {
      var res = util.getRandomInt(0, 1);
      expect(res >= 0).toBeTruthy();
      expect(res <= 1).toBeTruthy();
    });

    it('negative range', function() {
      var res = util.getRandomInt(-1, -2);
      expect(res >= -2).toBeTruthy();
      expect(res <= -1).toBeTruthy();
    });

    it('non number', function() {
      var res = util.getRandomInt(null, -2);
      expect(res).toBeNull();

      res = util.getRandomInt(100, null);
      expect(res).toBeNull();
    });

  });

  describe('util - getRandomString', function() {

    it('general range', function() {
      var res = util.getRandomString(10);
      expect(res.length).toEqual(10);

      res = util.getRandomString(20);
      expect(res.length).toEqual(20);

      res = util.getRandomString(100);
      expect(res.length).toEqual(100);
    });

    it('negative range', function() {
      var res = util.getRandomString(-10);
      expect(res.length).toEqual(0);
    });

    it('string-number range', function() {
      var res = util.getRandomString('123');
      expect(res.length).toEqual(123);
    });

    it('non-number range', function() {
      var res = util.getRandomString('abc');
      expect(res.length).toEqual(0);
    });

  });

  describe('util - hasClass', function() {

    it('general', function() {

      document.body.innerHTML =
      '<div id="test" class="style1 style2 style3"></div>';

      var element = document.getElementById('test');
      expect(util.hasClass(element, 'style1')).toBeTruthy();
      expect(util.hasClass(element, 'style2')).toBeTruthy();
      expect(util.hasClass(element, 'style3')).toBeTruthy();
      expect(util.hasClass(element, 'style4')).not.toBeTruthy();

    });

    it('non-element', function() {
      expect(util.hasClass(null, 'style4')).not.toBeTruthy();
      expect(util.hasClass({}, 'style4')).not.toBeTruthy();
      expect(util.hasClass(123, 'style4')).not.toBeTruthy();
    });

    it('non-string classname', function() {

      document.body.innerHTML =
      '<div id="test" class="style1 style2 style3"></div>';

      var element = document.getElementById('test');

      expect(util.hasClass(element, {})).not.toBeTruthy();
      expect(util.hasClass(element, 123)).not.toBeTruthy();
      expect(util.hasClass(element, null)).not.toBeTruthy();

    });

  });

  describe('util - addClass', function() {

    it('general', function() {

      document.body.innerHTML =
      '<div id="test" class="style1 style2 style3"></div>';

      var element = document.getElementById('test');
      util.addClass(element, 'style4');
      expect(util.hasClass(element, 'style4')).toBeTruthy();

    });

    it('non-element', function() {

      var testFunc = function() {
        util.addClass(null, 'style4');
        util.addClass({}, 'style4');
        util.addClass(123, 'style4');
      };

      expect(testFunc).not.toThrow();
    });

    it('non-string classname', function() {

      document.body.innerHTML =
      '<div id="test" class="style1 style2 style3"></div>';

      var element = document.getElementById('test');

      var testFunc = function() {
        util.addClass(element, {});
        util.addClass(element, 123);
        util.addClass(element, null);
      };

      expect(testFunc).not.toThrow();

    });

  });

  describe('util - removeClass', function() {

    it('general', function() {

      document.body.innerHTML =
      '<div id="test" class="style1 style2 style3"></div>';

      var element = document.getElementById('test');
      util.removeClass(element, 'style1');
      util.removeClass(element, 'style2');
      util.removeClass(element, 'style3');
      expect(util.hasClass(element, 'style1')).not.toBeTruthy();
      expect(util.hasClass(element, 'style2')).not.toBeTruthy();
      expect(util.hasClass(element, 'style3')).not.toBeTruthy();

    });

    it('non-element', function() {

      var testFunc = function() {
        util.removeClass(null, 'style4');
        util.removeClass({}, 'style4');
        util.removeClass(123, 'style4');
      };

      expect(testFunc).not.toThrow();
    });

    it('non-string classname', function() {

      document.body.innerHTML =
      '<div id="test" class="style1 style2 style3"></div>';

      var element = document.getElementById('test');

      var testFunc = function() {
        util.removeClass(element, {});
        util.removeClass(element, 123);
        util.removeClass(element, null);
      };

      expect(testFunc).not.toThrow();

    });

  });

  describe('util - getAllCssImgUrl', function() {

    it('general', function() {

      var css = '.style1 { background-image: url(\'img/test1.jpg\') } ' +
        '.style2 { background-image: url(\'img/test2.jpg\') } ' +
        '.style3 { background-image: url(\'img/test3.jpg\') } ';

      util.insertCssNode(css);

      var urls = util.getAllCssImgUrl();

      expect(urls.length).toEqual(3);
      expect(urls[0]).toEqual('img/test1.jpg');
      expect(urls[1]).toEqual('img/test2.jpg');
      expect(urls[2]).toEqual('img/test3.jpg');

    });

    it('no css', function() {

      document.head.innerHTML = '';
      var urls = util.getAllCssImgUrl();
      expect(urls.length).toEqual(0);

    });

  });

  describe('util - insertCssNode', function() {

    it('general', function() {
      document.head.innerHTML = '';

      document.body.innerHTML =
        '<div id="test1" class="style1"></div>' +
        '<div id="test2" class="style2"></div>' +
        '<div id="test3" class="style3"></div>';

      var eleTest1 = document.getElementById('test1');
      var eleTest2 = document.getElementById('test2');
      var eleTest3 = document.getElementById('test3');

      expect(eleTest1.style.backgroundImage).toEqual('');
      expect(eleTest2.style.backgroundImage).toEqual('');
      expect(eleTest3.style.backgroundImage).toEqual('');

      var css = '.style1 { background-image: url(\'img/test1.jpg\') } ' +
        '.style2 { background-image: url(\'img/test2.jpg\') } ' +
        '.style3 { background-image: url(\'img/test3.jpg\') } ';
      util.insertCssNode(css);

      var rule1 = null;
      var rule2 = null;
      var rule3 = null;

      // Loop though all style to check if class exists
      for (var i = 0; i < document.styleSheets.length; i++) {
        var sheet = document.styleSheets[i];
        var myrules = sheet.cssRules ? sheet.cssRules : sheet.rules;
        for (var j = 0; j < myrules.length; j++) {
          if (myrules[j].selectorText.toLowerCase() == '.style1') {
            rule1 = myrules[j];
          }else if (myrules[j].selectorText.toLowerCase() == '.style2') {
            rule2 = myrules[j];
          }else if (myrules[j].selectorText.toLowerCase() == '.style3') {
            rule3 = myrules[j];
          }
        }
      }

      expect(rule1.style['background-image']).toEqual('url(\'img/test1.jpg\')');
      expect(rule2.style['background-image']).toEqual('url(\'img/test2.jpg\')');
      expect(rule3.style['background-image']).toEqual('url(\'img/test3.jpg\')');

    });

  });

  describe('util - getProp', function() {

    var id1 = 'id1';
    var id2 = 'id2';
    var id3 = 'id3';

    var value1 = 'value1';
    var value2 = 'value2';
    var defaultVal = 'defaultVal';

    var data = {};
    data[id1] = value1;
    data[id2] = value2;

    var noData;

    it('general', function() {
      expect(util.getProp(data, id1, defaultVal)).toBe(value1);
      expect(util.getProp(data, id2, defaultVal)).toBe(value2);
      expect(util.getProp(data, id3, defaultVal)).toBe(defaultVal);
    });

    it('no data', function() {
      expect(util.getProp(noData, id1, defaultVal)).toBe(defaultVal);
      expect(util.getProp(noData, id2, defaultVal)).toBe(defaultVal);
      expect(util.getProp(noData, id3, defaultVal)).toBe(defaultVal);
    });

    it('missing input', function() {
      expect(util.getProp()).toBe('');
      expect(util.getProp(data)).toBe('');
      expect(util.getProp(data, id2)).toBe(value2);
      expect(util.getProp(data, id3)).toBe('');
    });

  });

  describe('util - sortAryByPropNum', function() {

    var KEY_PROP_INT = 'prop_int';
    var KEY_PROP_STR = 'prop_str';
    var KEY_PROP_FLOAT = 'prop_float';

    var data1 = {};
    data1[KEY_PROP_INT] = 0;
    data1[KEY_PROP_STR] = 'ABC';
    data1[KEY_PROP_FLOAT] = 100.1;

    var data2 = {};
    data2[KEY_PROP_INT] = 1;
    data2[KEY_PROP_STR] = 'XYZ';
    data2[KEY_PROP_FLOAT] = 100.5;

    var data3 = {};
    data3[KEY_PROP_INT] = 3;
    data3[KEY_PROP_STR] = 'DEF';
    data3[KEY_PROP_FLOAT] = 100.3;

    it('sort by int', function() {
        var dataAry = [data1, data2, data3];
        // ASC
        dataAry = util.sortAryByPropNum(dataAry, KEY_PROP_INT);
        expect(data1).toBe(dataAry[0]);
        expect(data2).toBe(dataAry[1]);
        expect(data3).toBe(dataAry[2]);

        // DESC
        dataAry = util.sortAryByPropNum(dataAry, KEY_PROP_INT, true);
        expect(data1).toBe(dataAry[2]);
        expect(data2).toBe(dataAry[1]);
        expect(data3).toBe(dataAry[0]);
      });

    it('sort by str', function() {
        var dataAry = [data1, data2, data3];
        // ASC
        dataAry = util.sortAryByPropNum(dataAry, KEY_PROP_STR);
        expect(data1).toBe(dataAry[0]);
        expect(data2).toBe(dataAry[2]);
        expect(data3).toBe(dataAry[1]);

        // DESC
        dataAry = util.sortAryByPropNum(dataAry, KEY_PROP_STR, true);
        expect(data1).toBe(dataAry[2]);
        expect(data2).toBe(dataAry[0]);
        expect(data3).toBe(dataAry[1]);
      });

    it('sort by float', function() {
        var dataAry = [data1, data2, data3];
        // ASC
        dataAry = util.sortAryByPropNum(dataAry, KEY_PROP_FLOAT);
        expect(data1).toBe(dataAry[0]);
        expect(data2).toBe(dataAry[2]);
        expect(data3).toBe(dataAry[1]);

        // DESC
        dataAry = util.sortAryByPropNum(dataAry, KEY_PROP_FLOAT, true);
        expect(data1).toBe(dataAry[2]);
        expect(data2).toBe(dataAry[0]);
        expect(data3).toBe(dataAry[1]);
    });
});

    describe('util - sortAryByPropStr', function() {

      var KEY_PROP_STR = 'prop_str';

      var data1 = {};
      data1[KEY_PROP_STR] = 'Zone-1';

      var data2 = {};
      data2[KEY_PROP_STR] = 'Zone-2';

      var data3 = {};
      data3[KEY_PROP_STR] = 'Zone-3';

      var data4 = {};
      data4[KEY_PROP_STR] = 'Zone-10';

      var data5 = {};
      data5[KEY_PROP_STR] = 'Zone-100';

      it('sort by str', function() {
          var dataAry = [data5, data4, data1, data2, data3];
          // ASC
          dataAry = util.sortAryByPropStr(dataAry, KEY_PROP_STR);
          expect(dataAry[0]).toBe(data1);
          expect(dataAry[1]).toBe(data2);
          expect(dataAry[2]).toBe(data3);
          expect(dataAry[3]).toBe(data4);
          expect(dataAry[4]).toBe(data5);


          // DESC
          dataAry = util.sortAryByPropStr(dataAry, KEY_PROP_STR, true);
          expect(dataAry[4]).toBe(data1);
          expect(dataAry[3]).toBe(data2);
          expect(dataAry[2]).toBe(data3);
          expect(dataAry[1]).toBe(data4);
          expect(dataAry[0]).toBe(data5);
        });
    });


    describe('util - sortAryByProp', function() {

      var KEY_PROP_INT = 'prop_int';
      var KEY_PROP_STR = 'prop_str';
      var KEY_PROP_FLOAT = 'prop_float';

      var data1 = {};
      data1[KEY_PROP_INT] = 0;
      data1[KEY_PROP_STR] = 'Zone-1';
      data1[KEY_PROP_FLOAT] = 100.1;

      var data2 = {};
      data2[KEY_PROP_INT] = 1;
      data2[KEY_PROP_STR] = 'Zone-10';
      data2[KEY_PROP_FLOAT] = 100.5;

      var data3 = {};
      data3[KEY_PROP_INT] = 3;
      data3[KEY_PROP_STR] = 'Zone-5';
      data3[KEY_PROP_FLOAT] = 100.3;

      it('sort by int', function() {
          var dataAry = [data1, data2, data3];
          // ASC
          dataAry = util.sortAryByProp(dataAry, KEY_PROP_INT);
          expect(data1).toBe(dataAry[0]);
          expect(data2).toBe(dataAry[1]);
          expect(data3).toBe(dataAry[2]);

          // DESC
          dataAry = util.sortAryByProp(dataAry, KEY_PROP_INT, true);
          expect(data1).toBe(dataAry[2]);
          expect(data2).toBe(dataAry[1]);
          expect(data3).toBe(dataAry[0]);
        });

      it('sort by str', function() {
          var dataAry = [data1, data2, data3];
          // ASC
          dataAry = util.sortAryByProp(dataAry, KEY_PROP_STR);
          expect(data1).toBe(dataAry[0]);
          expect(data2).toBe(dataAry[2]);
          expect(data3).toBe(dataAry[1]);

          // DESC
          dataAry = util.sortAryByProp(dataAry, KEY_PROP_STR, true);
          expect(data1).toBe(dataAry[2]);
          expect(data2).toBe(dataAry[0]);
          expect(data3).toBe(dataAry[1]);
        });

      it('sort by float', function() {
          var dataAry = [data1, data2, data3];
          // ASC
          dataAry = util.sortAryByProp(dataAry, KEY_PROP_FLOAT);
          expect(data1).toBe(dataAry[0]);
          expect(data2).toBe(dataAry[2]);
          expect(data3).toBe(dataAry[1]);

          // DESC
          dataAry = util.sortAryByProp(dataAry, KEY_PROP_FLOAT, true);
          expect(data1).toBe(dataAry[2]);
          expect(data2).toBe(dataAry[0]);
          expect(data3).toBe(dataAry[1]);
      });
  });

});

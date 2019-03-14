jest.autoMockOff();

describe('HexFlexItemList', function() {

  var HexFlexItemListClass = require('../hex.flex.item.list.class');
  var HexFlexItemList;

  var item1 = {
    id: 'id1',
    content: 'item1',
    pKey: 1
  };

  var item2 = {
    id: 'id2',
    content: 'item2',
    pKey: 1
  };

  var item3 = {
    id: 'id3',
    content: 'item3',
    pKey: 2
  };

  var item1x = {
    id: 'id1',
    content: 'item1x'
  };

  var item2x = {
    id: 'id2',
    content: 'item2x'
  };

  var item3x = {
    id: 'id3',
    content: 'item3x'
  };

  var itemNoId = {
    uuid: 'uuid_no_id',
    content: 'itemNoId'
  };

  beforeEach(function() {
    HexFlexItemList = new HexFlexItemListClass();
  });

  afterEach(function() {
    HexFlexItemList = null;
  });

  it('addItem/getItemById - general', function() {
    expect(HexFlexItemList.addItem(item1)).toEqual(true);
    expect(HexFlexItemList.addItem(item2)).toEqual(true);
    expect(HexFlexItemList.addItem(item3)).toEqual(true);

    expect(HexFlexItemList.getItemById(item1.id)).toEqual(item1);
    expect(HexFlexItemList.getItemById(item2.id)).toEqual(item2);
    expect(HexFlexItemList.getItemById(item3.id)).toEqual(item3);
  });

  it('addItem/getItemById - no id', function() {
    expect(HexFlexItemList.addItem(itemNoId)).toEqual(false);
    expect(HexFlexItemList.getItemById(itemNoId)).toEqual(null);
  });

  it('addItem/getItemById - duplicate', function() {
    expect(HexFlexItemList.addItem(item1)).toEqual(true);
    expect(HexFlexItemList.addItem(item2)).toEqual(true);
    expect(HexFlexItemList.addItem(item3)).toEqual(true);

    expect(HexFlexItemList.addItem(item1)).toEqual(false);
    expect(HexFlexItemList.addItem(item2)).toEqual(false);
    expect(HexFlexItemList.addItem(item3)).toEqual(false);

    expect(HexFlexItemList.getItemById(item1.id)).toEqual(item1);
    expect(HexFlexItemList.getItemById(item2.id)).toEqual(item2);
    expect(HexFlexItemList.getItemById(item3.id)).toEqual(item3);
  });

  it('addItem/getItemById - overwrite', function() {
    expect(HexFlexItemList.addItem(item1)).toEqual(true);
    expect(HexFlexItemList.addItem(item2)).toEqual(true);
    expect(HexFlexItemList.addItem(item3)).toEqual(true);

    expect(HexFlexItemList.addItem(item1x, true)).toEqual(true);
    expect(HexFlexItemList.addItem(item2x, true)).toEqual(true);
    expect(HexFlexItemList.addItem(item3x, true)).toEqual(true);

    expect(HexFlexItemList.getItemById(item1.id)).toEqual(item1x);
    expect(HexFlexItemList.getItemById(item2.id)).toEqual(item2x);
    expect(HexFlexItemList.getItemById(item3.id)).toEqual(item3x);
  });

  it('addItem/reset - general', function() {
    expect(HexFlexItemList.addItem(item1)).toEqual(true);
    expect(HexFlexItemList.addItem(item2)).toEqual(true);
    expect(HexFlexItemList.addItem(item3)).toEqual(true);

    HexFlexItemList.reset();

    expect(HexFlexItemList.getItemById(item1.id)).toEqual(null);
    expect(HexFlexItemList.getItemById(item2.id)).toEqual(null);
    expect(HexFlexItemList.getItemById(item3.id)).toEqual(null);
  });

  it('addItem/removeItemById - general', function() {
    expect(HexFlexItemList.addItem(item1)).toEqual(true);
    expect(HexFlexItemList.addItem(item2)).toEqual(true);
    expect(HexFlexItemList.addItem(item3)).toEqual(true);

    expect(HexFlexItemList.removeItemById(item1.id)).toEqual(true);
    expect(HexFlexItemList.removeItemById(item2.id)).toEqual(true);
    expect(HexFlexItemList.removeItemById(item3.id)).toEqual(true);
  });

  it('addItem/removeItem - general', function() {
    expect(HexFlexItemList.addItem(item1)).toEqual(true);
    expect(HexFlexItemList.addItem(item2)).toEqual(true);
    expect(HexFlexItemList.addItem(item3)).toEqual(true);

    expect(HexFlexItemList.removeItem(item1)).toEqual(true);
    expect(HexFlexItemList.removeItem(item2)).toEqual(true);
    expect(HexFlexItemList.removeItem(item3)).toEqual(true);
  });

  it('addItem/popItemById - general', function() {
    expect(HexFlexItemList.addItem(item1)).toEqual(true);
    expect(HexFlexItemList.addItem(item2)).toEqual(true);
    expect(HexFlexItemList.addItem(item3)).toEqual(true);

    expect(HexFlexItemList.popItemById(item1.id)).toEqual(item1);
    expect(HexFlexItemList.popItemById(item2.id)).toEqual(item2);
    expect(HexFlexItemList.popItemById(item3.id)).toEqual(item3);

    // Should be removed
    expect(HexFlexItemList.getItemById(item1.id)).toEqual(null);
    expect(HexFlexItemList.getItemById(item2.id)).toEqual(null);
    expect(HexFlexItemList.getItemById(item3.id)).toEqual(null);
  });

  it('addItem/getItemList - general', function() {
    expect(HexFlexItemList.addItem(item1)).toEqual(true);
    expect(HexFlexItemList.addItem(item2)).toEqual(true);
    expect(HexFlexItemList.addItem(item3)).toEqual(true);

    var itemList = HexFlexItemList.getItemList();

    expect(itemList[0]).toEqual(item1);
    expect(itemList[1]).toEqual(item2);
    expect(itemList[2]).toEqual(item3);

    // Modifu item list should not affect internal list
    delete itemList[0];
    delete itemList[1];
    delete itemList[2];

    expect(HexFlexItemList.getItemById(item1.id)).toEqual(item1);
    expect(HexFlexItemList.getItemById(item2.id)).toEqual(item2);
    expect(HexFlexItemList.getItemById(item3.id)).toEqual(item3);

  });

  it('addItem/getAllItemByKey - general', function() {
    expect(HexFlexItemList.addItem(item1)).toEqual(true);
    expect(HexFlexItemList.addItem(item2)).toEqual(true);
    expect(HexFlexItemList.addItem(item3)).toEqual(true);

    var itemList = HexFlexItemList.getAllItemByKey('pKey', 1);

    expect(itemList.length).toEqual(2);
    expect(itemList[0]).toEqual(item1);
    expect(itemList[1]).toEqual(item2);

    itemList = HexFlexItemList.getAllItemByKey('pKey', 2);
    expect(itemList.length).toEqual(1);
    expect(itemList[0]).toEqual(item3);

  });

});

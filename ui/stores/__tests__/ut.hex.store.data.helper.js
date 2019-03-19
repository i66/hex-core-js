'use strict';

jest.mock('../../tools/hex.logger');
jest.mock('../../io/hex.local.file.mgr');

global.require = require;
var Immutable = require('immutable');

describe('HexStoreDataHelper', function() {

  var checker = require('../../tools/hex.checker');
  var validator = require('../../tools/hex.validator');
  var HexPrimitiveType = require('../../types/hex.primitive.type');
  var HexStoreDataHelper = require('../hex.store.data.helper');
  var HexFieldPropMgr = require('../../io/hex.field-prop.mgr');
  var HexFieldMapper = require('../../io/hex.field.mapper');
  var HexFieldErrorType = require('../../types/hex.field.error.type');
  var HexActionMethodType = require('../../types/hex.action.method.type');

  var typeStr = HexPrimitiveType.STRING;
  var typeInt = HexPrimitiveType.INTEGER;
  var typePositiveInt = HexPrimitiveType.POSITIVE_INTEGER;
  var typeFloat = HexPrimitiveType.FLOAT;
  var typePositiveFloat = HexPrimitiveType.POSITIVE_FLOAT;
  var typeBool = HexPrimitiveType.BOOLEAN;
  var typeObj = HexPrimitiveType.OBJECT;
  var typeAry = HexPrimitiveType.ARRAY;

  var validateStr32 = HexFieldPropMgr.validateStr32;
  var validateStr128 = HexFieldPropMgr.validateStr128;
  var validateEngNum32 = HexFieldPropMgr.validateEngNum32;
  var validateNonEmptyStr = HexFieldPropMgr.validateNonEmptyStr;
  var validateFloat = HexFieldPropMgr.validateFloat;
  var validateEmail = HexFieldPropMgr.validateEmail;

  var TestFieldType =  {
    FIELD_ID: 'field_id',
    FIELD_STR: 'field_str',
    FIELD_INT: 'field_int',
    FIELD_FLOAT: 'field_float',
    FIELD_BOOLEAN: 'field_boolean',
    FIELD_POS_INT: 'field_pos_int',
    FIELD_POS_FLOAT: 'field_pos_float',
    FIELD_ARRAY: 'field_array',
    FIELD_OBJECT: 'field_obj',
    FIELD_NON_EMPTY_STR: 'field_non_empty_str',
    FIELD_STR_32: 'field_str_32',
    FIELD_STR_128: 'field_str_128',
    FIELD_ENG_NUM_32: 'field_eng_num_32',
    FIELD_EMAIL: 'field_email',
  };

  var TestFieldNestedType =  {
    FIELD_NESTED_ID: 'field_nested_id',
    FIELD_NESTED_OBJ_A: 'field_nested_obj_a',
    FIELD_NESTED_OBJ_B: 'field_nested_obj_b',
  };

  var TestFieldNestedTypeA =  {
    FIELD_NESTED_A_1: 'field_nested_a_1',
    FIELD_NESTED_A_2: 'field_nested_a_2',
  };

  var TestFieldNestedTypeB =  {
    FIELD_NESTED_B_1: 'field_nested_b_1',
    FIELD_NESTED_B_2: 'field_nested_b_2',
  };

  var keyNestedId =  TestFieldNestedType.FIELD_NESTED_ID;

  HexFieldPropMgr.set(
    TestFieldNestedType.FIELD_NESTED_ID, typeStr, validateStr32);
  HexFieldPropMgr.set(TestFieldNestedType.FIELD_NESTED_OBJ_A, typeObj);
  HexFieldPropMgr.set(TestFieldNestedType.FIELD_NESTED_OBJ_B, typeObj);

  HexFieldPropMgr.set(TestFieldNestedTypeA.FIELD_NESTED_A_1, typeStr);
  HexFieldPropMgr.set(TestFieldNestedTypeA.FIELD_NESTED_A_2, typeInt);

  HexFieldPropMgr.set(TestFieldNestedTypeB.FIELD_NESTED_B_1, typeStr);
  HexFieldPropMgr.set(TestFieldNestedTypeB.FIELD_NESTED_B_2, typeInt);

  HexFieldPropMgr.setFieldObjType(
    TestFieldNestedType.FIELD_NESTED_OBJ_A, TestFieldNestedTypeA);
  HexFieldPropMgr.setFieldObjType(
    TestFieldNestedType.FIELD_NESTED_OBJ_B, TestFieldNestedTypeB);

  var TestFieldRefType =  {
    FIELD_REF_ID: 'field_ref_id',
    FIELD_REF_A: 'field_ref_a',
    FIELD_REF_B: 'field_ref_b',
    FIELD_REF_C: 'field_ref_c',
  };

  var TestFieldRefTypeA = {
    MODE_1: 'mode_1',
    MODE_2: 'mode_2',
    MODE_3: 'mode_3'
  };

  var TestFieldRefTypeB = {
    MODE_1: 10,
    MODE_2: 20,
    MODE_3: 30
  };

  var TestFieldRefTypeC = {
    MODE_1: true,
    MODE_2: true,
    MODE_3: true
  };

  var keyRefId =  TestFieldRefType.FIELD_REF_ID;

  HexFieldPropMgr.set(
    TestFieldRefType.FIELD_REF_ID, typeStr, validateStr32);
  HexFieldPropMgr.set(TestFieldRefType.FIELD_REF_A, typeStr);
  HexFieldPropMgr.set(TestFieldRefType.FIELD_REF_B, typeInt);
  HexFieldPropMgr.set(TestFieldRefType.FIELD_REF_C, typeBool);

  HexFieldPropMgr.setFieldRefType(
    TestFieldRefType.FIELD_REF_A, TestFieldRefTypeA);
  HexFieldPropMgr.setFieldRefType(
    TestFieldRefType.FIELD_REF_B, TestFieldRefTypeB);
  HexFieldPropMgr.setFieldRefType(
    TestFieldRefType.FIELD_REF_C, TestFieldRefTypeC);

  var dataRef1 = {};
  dataRef1[TestFieldRefType.FIELD_REF_ID] = 'data_ref_1';
  dataRef1[TestFieldRefType.FIELD_REF_A] = TestFieldRefTypeA.MODE_1;
  dataRef1[TestFieldRefType.FIELD_REF_B] = TestFieldRefTypeB.MODE_1;
  dataRef1[TestFieldRefType.FIELD_REF_C] = TestFieldRefTypeC.MODE_1;

  var dataRef2 = {};
  dataRef2[TestFieldRefType.FIELD_REF_ID] = 'data_ref_2';
  dataRef2[TestFieldRefType.FIELD_REF_A] = TestFieldRefTypeA.MODE_2;
  dataRef2[TestFieldRefType.FIELD_REF_B] = TestFieldRefTypeB.MODE_2;
  dataRef2[TestFieldRefType.FIELD_REF_C] = TestFieldRefTypeC.MODE_2;

  var dataRef3 = {};
  dataRef3[TestFieldRefType.FIELD_REF_ID] = 'data_ref_3';
  dataRef3[TestFieldRefType.FIELD_REF_A] = TestFieldRefTypeA.MODE_3;
  dataRef3[TestFieldRefType.FIELD_REF_B] = TestFieldRefTypeB.MODE_3;
  dataRef3[TestFieldRefType.FIELD_REF_C] = TestFieldRefTypeC.MODE_3;

  var dataRefFail = {};
  dataRefFail[TestFieldRefType.FIELD_REF_ID] = 'data_ref_fail';
  dataRefFail[TestFieldRefType.FIELD_REF_A] = 'fail';
  dataRefFail[TestFieldRefType.FIELD_REF_B] = 50;
  dataRefFail[TestFieldRefType.FIELD_REF_C] = false;

  var MapFieldType =  {
    MAP_ID: 'map_id',
    MAP_STR: 'map_str',
    MAP_INT: 'map_int',
    MAP_FLOAT: 'map_float',
    MAP_BOOLEAN: 'map_boolean',
    MAP_POS_INT: 'map_pos_int',
    MAP_POS_FLOAT: 'map_pos_float',
    MAP_ARRAY: 'map_array',
    MAP_OBJECT: 'map_obj',
    MAP_NON_EMPTY_STR: 'map_non_empty_str',
    MAP_STR_32: 'map_str_32',
    MAP_STR_128: 'map_str_128',
    MAP_ENG_NUM_32: 'map_eng_num_32',
    MAP_EMAIL: 'map_email',
  };

  var TestDefault =  {
    //  FIELD_ID: 'id',
    FIELD_STR: 'str',
    FIELD_INT: 990,
    FIELD_FLOAT: 123.22,
    FIELD_BOOLEAN: true,
    FIELD_POS_INT: 9901,
    FIELD_POS_FLOAT: 29.99,
    FIELD_ARRAY: [1, 2, 3, 4],
    FIELD_OBJECT: {a: 1, b: 2, c: 4},
    FIELD_NON_EMPTY_STR: 'non_empty',
    FIELD_STR_32: 'string_32',
    FIELD_STR_128: 'string_128',
    FIELD_ENG_NUM_32: 'eng_num_32',
    FIELD_EMAIL: 'email_email',
  };

  var keyId =  TestFieldType.FIELD_ID;

  HexFieldPropMgr.set(
    TestFieldType.FIELD_ID, typeStr, validateStr32);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_STR, typeStr, null, TestDefault.FIELD_STR);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_INT, typeInt, null, TestDefault.FIELD_INT);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_FLOAT, typeFloat, null, TestDefault.FIELD_FLOAT);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_BOOLEAN, typeBool, null,  TestDefault.FIELD_BOOLEAN);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_POS_INT, typePositiveInt, null,
    TestDefault.FIELD_POS_INT);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_POS_FLOAT, typePositiveFloat, null,
    TestDefault.FIELD_POS_FLOAT);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_ARRAY, typeAry, null, TestDefault.FIELD_ARRAY);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_OBJECT, typeObj, null, TestDefault.FIELD_OBJECT);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_NON_EMPTY_STR, typeStr,
    validateNonEmptyStr, TestDefault.FIELD_NON_EMPTY_STR);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_STR_32, typeStr,
    validateStr32, TestDefault.FIELD_STR_32);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_STR_128, typeStr,
    validateStr128, TestDefault.FIELD_STR_128);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_ENG_NUM_32, typeStr,
    validateEngNum32, TestDefault.FIELD_ENG_NUM_32);
  HexFieldPropMgr.set(
    TestFieldType.FIELD_EMAIL, typeStr,
    validateEmail, TestDefault.FIELD_EMAIL);

  var TestFieldTypeNoDefault =  {
    FIELD_ID: 'nd_field_id',
    FIELD_STR: 'nd_field_str',
    FIELD_INT: 'nd_field_int',
    FIELD_FLOAT: 'nd_field_float',
    FIELD_BOOLEAN: 'nd_field_boolean',
    FIELD_POS_INT: 'nd_field_pos_int',
    FIELD_POS_FLOAT: 'nd_field_pos_float',
    FIELD_ARRAY: 'nd_field_array',
    FIELD_OBJECT: 'nd_field_obj',
    FIELD_NON_EMPTY_STR: 'nd_field_non_empty_str',
    FIELD_STR_32: 'nd_field_str_32',
    FIELD_STR_128: 'nd_field_str_128',
    FIELD_ENG_NUM_32: 'nd_field_eng_num_32',
    FIELD_EMAIL: 'nd_field_email',
  };

  HexFieldPropMgr.set(TestFieldTypeNoDefault.FIELD_ID, typeStr, validateStr32);
  HexFieldPropMgr.set(TestFieldTypeNoDefault.FIELD_STR, typeStr);
  HexFieldPropMgr.set(TestFieldTypeNoDefault.FIELD_INT, typeInt);
  HexFieldPropMgr.set(TestFieldTypeNoDefault.FIELD_FLOAT, typeFloat);
  HexFieldPropMgr.set(TestFieldTypeNoDefault.FIELD_BOOLEAN, typeBool);
  HexFieldPropMgr.set(TestFieldTypeNoDefault.FIELD_POS_INT, typePositiveInt);
  HexFieldPropMgr.set(
    TestFieldTypeNoDefault.FIELD_POS_FLOAT, typePositiveFloat);
  HexFieldPropMgr.set(TestFieldTypeNoDefault.FIELD_ARRAY, typeAry);
  HexFieldPropMgr.set(TestFieldTypeNoDefault.FIELD_OBJECT, typeObj);
  HexFieldPropMgr.set(
    TestFieldTypeNoDefault.FIELD_NON_EMPTY_STR, typeStr, validateNonEmptyStr);
  HexFieldPropMgr.set(
    TestFieldTypeNoDefault.FIELD_STR_32, typeStr, validateStr32);
  HexFieldPropMgr.set(
    TestFieldTypeNoDefault.FIELD_STR_128, typeStr, validateStr128);
  HexFieldPropMgr.set(
    TestFieldTypeNoDefault.FIELD_ENG_NUM_32, typeStr, validateEngNum32);
  HexFieldPropMgr.set(
    TestFieldTypeNoDefault.FIELD_EMAIL, typeStr, validateEmail);

  HexFieldMapper.set(TestFieldType.FIELD_ID, MapFieldType.MAP_ID);
  HexFieldMapper.set(TestFieldType.FIELD_STR, MapFieldType.MAP_STR);
  HexFieldMapper.set(TestFieldType.FIELD_INT, MapFieldType.MAP_INT);
  HexFieldMapper.set(TestFieldType.FIELD_FLOAT, MapFieldType.MAP_FLOAT);
  HexFieldMapper.set(TestFieldType.FIELD_BOOLEAN, MapFieldType.MAP_BOOLEAN);
  HexFieldMapper.set(TestFieldType.FIELD_POS_INT, MapFieldType.MAP_POS_INT);
  HexFieldMapper.set(TestFieldType.FIELD_POS_FLOAT, MapFieldType.MAP_POS_FLOAT);
  HexFieldMapper.set(TestFieldType.FIELD_ARRAY, MapFieldType.MAP_ARRAY);
  HexFieldMapper.set(TestFieldType.FIELD_OBJECT, MapFieldType.MAP_OBJECT);
  HexFieldMapper.set(
    TestFieldType.FIELD_NON_EMPTY_STR, MapFieldType.MAP_NON_EMPTY_STR);
  HexFieldMapper.set(TestFieldType.FIELD_STR_32, MapFieldType.MAP_STR_32);
  HexFieldMapper.set(TestFieldType.FIELD_STR_128, MapFieldType.MAP_STR_128);
  HexFieldMapper.set(
    TestFieldType.FIELD_ENG_NUM_32, MapFieldType.MAP_ENG_NUM_32);
  HexFieldMapper.set(TestFieldType.FIELD_EMAIL, MapFieldType.MAP_EMAIL);

  beforeEach(function() {

  });

  var dataNestedObjA = {};
  dataNestedObjA[TestFieldNestedTypeA.FIELD_NESTED_A_1] = 'data_nested_a_1';
  dataNestedObjA[TestFieldNestedTypeA.FIELD_NESTED_A_2] = 123;

  var dataNestedObjB = {};
  dataNestedObjB[TestFieldNestedTypeB.FIELD_NESTED_B_1] = 'data_nested_b_1';
  dataNestedObjB[TestFieldNestedTypeB.FIELD_NESTED_B_2] = 456;

  var dataNested1 = {};
  dataNested1[TestFieldNestedType.FIELD_NESTED_ID] = 'nested_id';
  dataNested1[TestFieldNestedType.FIELD_NESTED_OBJ_A] = dataNestedObjA;
  dataNested1[TestFieldNestedType.FIELD_NESTED_OBJ_B] = dataNestedObjB;

  var dataNestedFail = {};
  dataNestedFail[TestFieldNestedType.FIELD_NESTED_ID] = 'nested_id';
  dataNestedFail[TestFieldNestedType.FIELD_NESTED_OBJ_A] = {};
  dataNestedFail[TestFieldNestedType.FIELD_NESTED_OBJ_B] = {};

  var dataNew1 = {};
  dataNew1[TestFieldType.FIELD_ID] = 'data_id_1';
  dataNew1[TestFieldType.FIELD_STR] = 'data_str_1';
  dataNew1[TestFieldType.FIELD_INT] = 100;
  dataNew1[TestFieldType.FIELD_FLOAT] = 100.10;
  dataNew1[TestFieldType.FIELD_BOOLEAN] = true;
  dataNew1[TestFieldType.FIELD_POS_INT] = 100;
  dataNew1[TestFieldType.FIELD_POS_FLOAT] = 100.10;
  dataNew1[TestFieldType.FIELD_ARRAY] = [1, 2, 3];
  dataNew1[TestFieldType.FIELD_OBJECT] = {a: 1, b: 2, c: 3};
  dataNew1[TestFieldType.FIELD_NON_EMPTY_STR] = 'data_non_empty_str_1';
  dataNew1[TestFieldType.FIELD_STR_32] = 'data_str_32_1';
  dataNew1[TestFieldType.FIELD_STR_128] = 'data_str_128_1';
  dataNew1[TestFieldType.FIELD_ENG_NUM_32] = 'data_eng_num_32_1';
  dataNew1[TestFieldType.FIELD_EMAIL] = 'data_1@email.com';

  var dataNewMap1 = {};
  dataNewMap1[MapFieldType.MAP_ID] = 'data_id_1';
  dataNewMap1[MapFieldType.MAP_STR] = 'data_str_1';
  dataNewMap1[MapFieldType.MAP_INT] = 100;
  dataNewMap1[MapFieldType.MAP_FLOAT] = 100.10;
  dataNewMap1[MapFieldType.MAP_BOOLEAN] = true;
  dataNewMap1[MapFieldType.MAP_POS_INT] = 100;
  dataNewMap1[MapFieldType.MAP_POS_FLOAT] = 100.10;
  dataNewMap1[MapFieldType.MAP_ARRAY] = [1, 2, 3];
  dataNewMap1[MapFieldType.MAP_OBJECT] = {a: 1, b: 2, c: 3};
  dataNewMap1[MapFieldType.MAP_NON_EMPTY_STR] = 'data_non_empty_str_1';
  dataNewMap1[MapFieldType.MAP_STR_32] = 'data_str_32_1';
  dataNewMap1[MapFieldType.MAP_STR_128] = 'data_str_128_1';
  dataNewMap1[MapFieldType.MAP_ENG_NUM_32] = 'data_eng_num_32_1';
  dataNewMap1[MapFieldType.MAP_EMAIL] = 'data_1@email.com';

  var dataPost1 = {};
  dataPost1[TestFieldType.FIELD_ID] = 'data_id_1';
  dataPost1[TestFieldType.FIELD_STR] = 'data_str_post_1';
  dataPost1[TestFieldType.FIELD_INT] = 400;
  dataPost1[TestFieldType.FIELD_FLOAT] = 400.40;
  dataPost1[TestFieldType.FIELD_BOOLEAN] = false;
  dataPost1[TestFieldType.FIELD_POS_INT] = 400;
  dataPost1[TestFieldType.FIELD_POS_FLOAT] = 400.40;
  dataPost1[TestFieldType.FIELD_ARRAY] = [4, 5, 6];
  dataPost1[TestFieldType.FIELD_OBJECT] = {a: 4, b: 5, c: 6};
  dataPost1[TestFieldType.FIELD_NON_EMPTY_STR] = 'data_non_empty_str_post_1';
  dataPost1[TestFieldType.FIELD_STR_32] = 'data_str_32_post_1';
  dataPost1[TestFieldType.FIELD_STR_128] = 'data_str_128_post_1';
  dataPost1[TestFieldType.FIELD_ENG_NUM_32] = 'data_eng_num_32_post_1';
  dataPost1[TestFieldType.FIELD_EMAIL] = 'data_post_1@email.com';

  var dataPostMap1 = {};
  dataPostMap1[MapFieldType.MAP_ID] = 'data_id_1';
  dataPostMap1[MapFieldType.MAP_STR] = 'data_str_post_1';
  dataPostMap1[MapFieldType.MAP_INT] = 400;
  dataPostMap1[MapFieldType.MAP_FLOAT] = 400.40;
  dataPostMap1[MapFieldType.MAP_BOOLEAN] = false;
  dataPostMap1[MapFieldType.MAP_POS_INT] = 400;
  dataPostMap1[MapFieldType.MAP_POS_FLOAT] = 400.40;
  dataPostMap1[MapFieldType.MAP_ARRAY] = [4, 5, 6];
  dataPostMap1[MapFieldType.MAP_OBJECT] = {a: 4, b: 5, c: 6};
  dataPostMap1[MapFieldType.MAP_NON_EMPTY_STR] = 'data_non_empty_str_post_1';
  dataPostMap1[MapFieldType.MAP_STR_32] = 'data_str_32_post_1';
  dataPostMap1[MapFieldType.MAP_STR_128] = 'data_str_128_post_1';
  dataPostMap1[MapFieldType.MAP_ENG_NUM_32] = 'data_eng_num_32_post_1';
  dataPostMap1[MapFieldType.MAP_EMAIL] = 'data_post_1@email.com';

  var dataPostMissing1 = {};

  var dataPostPartial1 = {};
  dataPostPartial1[TestFieldType.FIELD_ID] = 'data_id_1';
  dataPostPartial1[TestFieldType.FIELD_STR] = 'data_str_post_1';
  dataPostPartial1[TestFieldType.FIELD_BOOLEAN] = false;
  dataPostPartial1[TestFieldType.FIELD_POS_INT] = 400;
  dataPostPartial1[TestFieldType.FIELD_POS_FLOAT] = 400.40;
  dataPostPartial1[TestFieldType.FIELD_ARRAY] = [4, 5, 6];
  dataPostPartial1[TestFieldType.FIELD_OBJECT] = {a: 4, b: 5, c: 6};
  dataPostPartial1[TestFieldType.FIELD_STR_32] = 'data_str_32_post_1';
  dataPostPartial1[TestFieldType.FIELD_ENG_NUM_32] = 'data_eng_num_32_post_1';
  dataPostPartial1[TestFieldType.FIELD_EMAIL] = 'data_post_1@email.com';

  var dataPostFail1 = {};
  dataPostFail1[TestFieldType.FIELD_ID] = 'data_id_1';
  dataPostFail1[TestFieldType.FIELD_STR] = 123;
  dataPostFail1[TestFieldType.FIELD_INT] = 'asdasd';
  dataPostFail1[TestFieldType.FIELD_FLOAT] = 'asdasd';
  dataPostFail1[TestFieldType.FIELD_BOOLEAN] = 'asdasd';
  dataPostFail1[TestFieldType.FIELD_POS_INT] = 'asdasd';
  dataPostFail1[TestFieldType.FIELD_POS_FLOAT] = 'asdasd';
  dataPostFail1[TestFieldType.FIELD_ARRAY] = null;
  dataPostFail1[TestFieldType.FIELD_OBJECT] = 'asdasd';
  dataPostFail1[TestFieldType.FIELD_NON_EMPTY_STR] = '';
  dataPostFail1[TestFieldType.FIELD_STR_32] =
  '012345678901234567890123456789123';
  dataPostFail1[TestFieldType.FIELD_STR_128] =
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789';
  dataPostFail1[TestFieldType.FIELD_ENG_NUM_32] = '$$$';
  dataPostFail1[TestFieldType.FIELD_EMAIL] = 'asdasd';

  var dataMissing1 = {};
  dataMissing1[TestFieldType.FIELD_ID] = 'data_id_1';

  var dataNew2 = {};
  dataNew2[TestFieldType.FIELD_ID] = 'data_id_2';
  dataNew2[TestFieldType.FIELD_STR] = 'data_str_2';
  dataNew2[TestFieldType.FIELD_INT] = 200;
  dataNew2[TestFieldType.FIELD_FLOAT] = 200.20;
  dataNew2[TestFieldType.FIELD_BOOLEAN] = true;
  dataNew2[TestFieldType.FIELD_POS_INT] = 200;
  dataNew2[TestFieldType.FIELD_POS_FLOAT] = 200.20;
  dataNew2[TestFieldType.FIELD_ARRAY] = [4, 5, 6];
  dataNew2[TestFieldType.FIELD_OBJECT] = {a: 2, b: 4, c: 6};
  dataNew2[TestFieldType.FIELD_NON_EMPTY_STR] = 'data_non_empty_str_2';
  dataNew2[TestFieldType.FIELD_STR_32] = 'data_str_32_2';
  dataNew2[TestFieldType.FIELD_STR_128] = 'data_str_128_2';
  dataNew2[TestFieldType.FIELD_ENG_NUM_32] = 'data_eng_num_32_2';
  dataNew2[TestFieldType.FIELD_EMAIL] = 'data_2@email.com';

  var dataNewMap2 = {};
  dataNewMap2[MapFieldType.MAP_ID] = 'data_id_2';
  dataNewMap2[MapFieldType.MAP_STR] = 'data_str_2';
  dataNewMap2[MapFieldType.MAP_INT] = 200;
  dataNewMap2[MapFieldType.MAP_FLOAT] = 200.20;
  dataNewMap2[MapFieldType.MAP_BOOLEAN] = true;
  dataNewMap2[MapFieldType.MAP_POS_INT] = 200;
  dataNewMap2[MapFieldType.MAP_POS_FLOAT] = 200.20;
  dataNewMap2[MapFieldType.MAP_ARRAY] = [4, 5, 6];
  dataNewMap2[MapFieldType.MAP_OBJECT] = {a: 2, b: 4, c: 6};
  dataNewMap2[MapFieldType.MAP_NON_EMPTY_STR] = 'data_non_empty_str_2';
  dataNewMap2[MapFieldType.MAP_STR_32] = 'data_str_32_2';
  dataNewMap2[MapFieldType.MAP_STR_128] = 'data_str_128_2';
  dataNewMap2[MapFieldType.MAP_ENG_NUM_32] = 'data_eng_num_32_2';
  dataNewMap2[MapFieldType.MAP_EMAIL] = 'data_2@email.com';

  var dataPost2 = {};
  dataPost2[TestFieldType.FIELD_ID] = 'data_id_2';
  dataPost2[TestFieldType.FIELD_STR] = 'data_str_post_2';
  dataPost2[TestFieldType.FIELD_INT] = 600;
  dataPost2[TestFieldType.FIELD_FLOAT] = 600.60;
  dataPost2[TestFieldType.FIELD_BOOLEAN] = false;
  dataPost2[TestFieldType.FIELD_POS_INT] = 600;
  dataPost2[TestFieldType.FIELD_POS_FLOAT] = 600.60;
  dataPost2[TestFieldType.FIELD_ARRAY] = [6, 7, 8];
  dataPost2[TestFieldType.FIELD_OBJECT] = {a: 6, b: 8, c: 10};
  dataPost2[TestFieldType.FIELD_NON_EMPTY_STR] = 'data_non_empty_str_post_2';
  dataPost2[TestFieldType.FIELD_STR_32] = 'data_str_32_post_2';
  dataPost2[TestFieldType.FIELD_STR_128] = 'data_str_128_post_2';
  dataPost2[TestFieldType.FIELD_ENG_NUM_32] = 'data_eng_num_32_post_2';
  dataPost2[TestFieldType.FIELD_EMAIL] = 'data_post_2@email.com';

  var dataPostMap2 = {};
  dataPostMap2[MapFieldType.MAP_ID] = 'data_id_2';
  dataPostMap2[MapFieldType.MAP_STR] = 'data_str_post_2';
  dataPostMap2[MapFieldType.MAP_INT] = 600;
  dataPostMap2[MapFieldType.MAP_FLOAT] = 600.60;
  dataPostMap2[MapFieldType.MAP_BOOLEAN] = false;
  dataPostMap2[MapFieldType.MAP_POS_INT] = 600;
  dataPostMap2[MapFieldType.MAP_POS_FLOAT] = 600.60;
  dataPostMap2[MapFieldType.MAP_ARRAY] = [6, 7, 8];
  dataPostMap2[MapFieldType.MAP_OBJECT] = {a: 6, b: 8, c: 10};
  dataPostMap2[MapFieldType.MAP_NON_EMPTY_STR] = 'data_non_empty_str_post_2';
  dataPostMap2[MapFieldType.MAP_STR_32] = 'data_str_32_post_2';
  dataPostMap2[MapFieldType.MAP_STR_128] = 'data_str_128_post_2';
  dataPostMap2[MapFieldType.MAP_ENG_NUM_32] = 'data_eng_num_32_post_2';
  dataPostMap2[MapFieldType.MAP_EMAIL] = 'data_post_2@email.com';

  var dataPostPartial2 = {};
  dataPostPartial2[TestFieldType.FIELD_ID] = 'data_id_2';
  dataPostPartial2[TestFieldType.FIELD_STR] = 'data_str_post_2';
  dataPostPartial2[TestFieldType.FIELD_INT] = 600;
  dataPostPartial2[TestFieldType.FIELD_FLOAT] = 600.60;
  dataPostPartial2[TestFieldType.FIELD_BOOLEAN] = false;
  dataPostPartial2[TestFieldType.FIELD_POS_INT] = 600;
  dataPostPartial2[TestFieldType.FIELD_POS_FLOAT] = 600.60;
  dataPostPartial2[TestFieldType.FIELD_ARRAY] = [6, 7, 8];
  dataPostPartial2[TestFieldType.FIELD_OBJECT] = {a: 6, b: 8, c: 10};

  var dataPostFail2 = {};
  dataPostFail2[TestFieldType.FIELD_ID] = 'data_id_2';
  dataPostFail2[TestFieldType.FIELD_STR] = 123;
  dataPostFail2[TestFieldType.FIELD_INT] = 'asdasd';
  dataPostFail2[TestFieldType.FIELD_FLOAT] = 'asdasd';
  dataPostFail2[TestFieldType.FIELD_BOOLEAN] = 'asdasd';
  dataPostFail2[TestFieldType.FIELD_POS_INT] = 'asdasd';
  dataPostFail2[TestFieldType.FIELD_POS_FLOAT] = 'asdasd';
  dataPostFail2[TestFieldType.FIELD_ARRAY] = null;
  dataPostFail2[TestFieldType.FIELD_OBJECT] = 'asdasd';
  dataPostFail2[TestFieldType.FIELD_NON_EMPTY_STR] = '';
  dataPostFail2[TestFieldType.FIELD_STR_32] =
  '012345678901234567890123456789123';
  dataPostFail2[TestFieldType.FIELD_STR_128] =
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789';
  dataPostFail2[TestFieldType.FIELD_ENG_NUM_32] = '$$$';
  dataPostFail2[TestFieldType.FIELD_EMAIL] = 'asdasd';

  var dataNewFail1 = {};
  dataNewFail1[TestFieldType.FIELD_ID] = 123;
  dataNewFail1[TestFieldType.FIELD_STR] = 123;
  dataNewFail1[TestFieldType.FIELD_INT] = 'asdasd';
  dataNewFail1[TestFieldType.FIELD_FLOAT] = 'asdasd';
  dataNewFail1[TestFieldType.FIELD_BOOLEAN] = 'asdasd';
  dataNewFail1[TestFieldType.FIELD_POS_INT] = 'asdasd';
  dataNewFail1[TestFieldType.FIELD_POS_FLOAT] = 'asdasd';
  dataNewFail1[TestFieldType.FIELD_ARRAY] = null;
  dataNewFail1[TestFieldType.FIELD_OBJECT] = 'asdasd';
  dataNewFail1[TestFieldType.FIELD_NON_EMPTY_STR] = '';
  dataNewFail1[TestFieldType.FIELD_STR_32] =
  '012345678901234567890123456789123';
  dataNewFail1[TestFieldType.FIELD_STR_128] =
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789';
  dataNewFail1[TestFieldType.FIELD_ENG_NUM_32] = '$$$';
  dataNewFail1[TestFieldType.FIELD_EMAIL] = 'asdasd';

  var dataNewFailHaveKey1 = {};
  dataNewFailHaveKey1[TestFieldType.FIELD_ID] = 'data_id_fail_1';
  dataNewFailHaveKey1[TestFieldType.FIELD_STR] = 123;
  dataNewFailHaveKey1[TestFieldType.FIELD_INT] = 'asdasd';
  dataNewFailHaveKey1[TestFieldType.FIELD_FLOAT] = 'asdasd';
  dataNewFailHaveKey1[TestFieldType.FIELD_BOOLEAN] = 'asdasd';
  dataNewFailHaveKey1[TestFieldType.FIELD_POS_INT] = 'asdasd';
  dataNewFailHaveKey1[TestFieldType.FIELD_POS_FLOAT] = 'asdasd';
  dataNewFailHaveKey1[TestFieldType.FIELD_ARRAY] = null;
  dataNewFailHaveKey1[TestFieldType.FIELD_OBJECT] = 'asdasd';
  dataNewFailHaveKey1[TestFieldType.FIELD_NON_EMPTY_STR] = '';
  dataNewFailHaveKey1[TestFieldType.FIELD_STR_32] =
  '012345678901234567890123456789123';
  dataNewFailHaveKey1[TestFieldType.FIELD_STR_128] =
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789';
  dataNewFailHaveKey1[TestFieldType.FIELD_ENG_NUM_32] = '$$$';
  dataNewFailHaveKey1[TestFieldType.FIELD_EMAIL] = 'asdasd';

  var dataNewFailError = {};
  dataNewFailError[TestFieldType.FIELD_ID] =
    HexFieldErrorType.NOT_STRING_ERROR;
  dataNewFailError[TestFieldType.FIELD_STR] =
    HexFieldErrorType.NOT_STRING_ERROR;
  dataNewFailError[TestFieldType.FIELD_INT] =
    HexFieldErrorType.NOT_INT_ERROR;
  dataNewFailError[TestFieldType.FIELD_FLOAT] =
    HexFieldErrorType.NOT_FLOAT_ERROR;
  dataNewFailError[TestFieldType.FIELD_BOOLEAN] =
    HexFieldErrorType.NOT_BOOL_ERROR;
  dataNewFailError[TestFieldType.FIELD_POS_INT] =
    HexFieldErrorType.NOT_POSITIVE_INT_ERROR;
  dataNewFailError[TestFieldType.FIELD_POS_FLOAT] =
    HexFieldErrorType.NOT_POSITIVE_FLOAT_ERROR;
  dataNewFailError[TestFieldType.FIELD_ARRAY] =
    HexFieldErrorType.NOT_ARRAY_ERROR;
  dataNewFailError[TestFieldType.FIELD_OBJECT] =
    HexFieldErrorType.NOT_OBJECT_ERROR;
  dataNewFailError[TestFieldType.FIELD_NON_EMPTY_STR] =
    HexFieldErrorType.EMPTY_ERROR;
  dataNewFailError[TestFieldType.FIELD_STR_32] =
    HexFieldErrorType.LENGTH_OVERFLOW_ERROR;
  dataNewFailError[TestFieldType.FIELD_STR_128] =
    HexFieldErrorType.LENGTH_OVERFLOW_ERROR;
  dataNewFailError[TestFieldType.FIELD_ENG_NUM_32] =
    HexFieldErrorType.INVALID_ENG_NUM_ERROR;
  dataNewFailError[TestFieldType.FIELD_EMAIL] =
    HexFieldErrorType.INVALID_EMAIL_ERROR;

  var dataMissingNoDefault1 = {};

  var dataNewFailNoDefault1 = {};
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_ID] = 123;
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_STR] = 123;
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_INT] = 'asdasd';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_FLOAT] = 'asdasd';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_BOOLEAN] = 'asdasd';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_POS_INT] = 'asdasd';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_POS_FLOAT] = 'asdasd';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_ARRAY] = null;
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_OBJECT] = 'asdasd';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_NON_EMPTY_STR] = '';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_STR_32] =
  '012345678901234567890123456789123';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_STR_128] =
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789' +
  '012345678901234567890123456789';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_ENG_NUM_32] = '$$$';
  dataNewFailNoDefault1[TestFieldTypeNoDefault.FIELD_EMAIL] = 'asdasd';

  var dataNewFailNoDefaultError = {};
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_ID] =
    HexFieldErrorType.NOT_STRING_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_STR] =
    HexFieldErrorType.NOT_STRING_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_INT] =
    HexFieldErrorType.NOT_INT_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_FLOAT] =
    HexFieldErrorType.NOT_FLOAT_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_BOOLEAN] =
    HexFieldErrorType.NOT_BOOL_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_POS_INT] =
    HexFieldErrorType.NOT_POSITIVE_INT_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_POS_FLOAT] =
    HexFieldErrorType.NOT_POSITIVE_FLOAT_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_ARRAY] =
    HexFieldErrorType.NOT_ARRAY_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_OBJECT] =
    HexFieldErrorType.NOT_OBJECT_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_NON_EMPTY_STR] =
    HexFieldErrorType.EMPTY_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_STR_32] =
    HexFieldErrorType.LENGTH_OVERFLOW_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_STR_128] =
    HexFieldErrorType.LENGTH_OVERFLOW_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_ENG_NUM_32] =
    HexFieldErrorType.INVALID_ENG_NUM_ERROR;
  dataNewFailNoDefaultError[TestFieldTypeNoDefault.FIELD_EMAIL] =
    HexFieldErrorType.INVALID_EMAIL_ERROR;

  var dataMissingNoDefaultError = {};
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_ID] =
    HexFieldErrorType.EMPTY_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_STR] =
    HexFieldErrorType.NOT_STRING_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_INT] =
    HexFieldErrorType.NOT_INT_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_FLOAT] =
    HexFieldErrorType.NOT_FLOAT_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_BOOLEAN] =
    HexFieldErrorType.NOT_BOOL_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_POS_INT] =
    HexFieldErrorType.NOT_POSITIVE_INT_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_POS_FLOAT] =
    HexFieldErrorType.NOT_POSITIVE_FLOAT_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_ARRAY] =
    HexFieldErrorType.NOT_ARRAY_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_OBJECT] =
    HexFieldErrorType.NOT_OBJECT_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_NON_EMPTY_STR] =
    HexFieldErrorType.EMPTY_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_STR_32] =
    HexFieldErrorType.EMPTY_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_STR_128] =
    HexFieldErrorType.EMPTY_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_ENG_NUM_32] =
    HexFieldErrorType.EMPTY_ERROR;
  dataMissingNoDefaultError[TestFieldTypeNoDefault.FIELD_EMAIL] =
    HexFieldErrorType.EMPTY_ERROR;

  function checkPutDictSingle(res, data) {
    var updatedData = res.data;
    var error = res.error;
    expect(error).toEqual(null);
    expect(updatedData).not.toEqual(null);
    expect(updatedData !== data).toBe(true);

    var updatedDataJs = updatedData.toOrderedSet().toJS();
    expect(updatedDataJs.length).toEqual(1);

    var curFieldType;
    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      expect(updatedDataJs[0][curFieldType]).toEqual(dataNew1[curFieldType]);
    }
  }

  function checkDictValue(res, fieldTypeDef, finalValueAry) {
    var updatedData = res.data;
    var error = res.error;
    expect(error).toEqual(null);
    expect(updatedData).not.toEqual(null);

    var updatedDataJs = updatedData.toOrderedSet().toJS();
    expect(updatedDataJs.length).toEqual(finalValueAry.length);

    var curFieldType;
    for (var i = 0; i < finalValueAry.length; i++) {
      for (var fieldType in fieldTypeDef) {
        curFieldType = fieldTypeDef[fieldType];
        expect(updatedDataJs[i][curFieldType]).
          toEqual(finalValueAry[i][curFieldType]);
      }
    }
  }

  function checkPostDictSingle(res, data) {
    var updatedData = res.data;
    var error = res.error;
    expect(error).toEqual(null);
    expect(updatedData).not.toEqual(null);
    expect(updatedData !== data).toBe(true);

    var updatedDataJs = updatedData.toOrderedSet().toJS();
    expect(updatedDataJs.length).toEqual(1);

    var curFieldType;
    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      expect(updatedDataJs[0][curFieldType]).toEqual(dataPost1[curFieldType]);
    }
  }

  function checkPostMapSingle(res, data) {
    var updatedData = res.data;
    var error = res.error;
    expect(error).toEqual(null);
    expect(updatedData).not.toEqual(null);
    expect(updatedData !== data).toBe(true);

    var updatedDataJs = updatedData.toJS();

    var curFieldType;
    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      expect(updatedDataJs[curFieldType]).toEqual(dataPost1[curFieldType]);
    }
  }

  function checkPutDictAry(res, data) {
    var updatedData = res.data;
    var error = res.error;
    expect(error).toEqual(null);
    expect(updatedData).not.toEqual(null);
    expect(updatedData !== data).toBe(true);

    var updatedDataJs = updatedData.toOrderedSet().toJS();

    expect(updatedDataJs.length).toEqual(2);

    var curFieldType;
    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      expect(updatedDataJs[0][curFieldType]).toEqual(dataNew1[curFieldType]);
    }

    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      expect(updatedDataJs[1][curFieldType]).toEqual(dataNew2[curFieldType]);
    }
  }

  function checkPostDictAry(res, data) {
    var updatedData = res.data;
    var error = res.error;
    expect(error).toEqual(null);
    expect(updatedData).not.toEqual(null);
    expect(updatedData !== data).toBe(true);

    var updatedDataJs = updatedData.toOrderedSet().toJS();

    expect(updatedDataJs.length).toEqual(2);

    var curFieldType;
    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      expect(updatedDataJs[0][curFieldType]).toEqual(dataPost1[curFieldType]);
    }

    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      expect(updatedDataJs[1][curFieldType]).toEqual(dataPost2[curFieldType]);
    }
  }

  function checkErrorUnsupportMethod(res, method, fieldKey) {
    expect(res.error).not.toEqual(null);
    expect(res.error[fieldKey].value).toEqual(method);
    expect(res.error[fieldKey].type).
      toEqual(HexFieldErrorType.UNSUPPORTED_METHOD);
  }

  it('initDefaultData - pass', function() {
    var data = HexStoreDataHelper.initDefaultData(TestFieldType);
    var curFieldType;
    for (var fieldType in TestFieldType) {
      if (checker.isSet(TestDefault[curFieldType])) {
        curFieldType = TestFieldType[fieldType];
        expect(data[curFieldType]).toEqual(TestDefault[curFieldType]);
      }
    }
  });

  it('putDictSingle - pass', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNew1, data, keyId, TestFieldType);

    checkPutDictSingle(res, data);
  });

  it('putDictSingle - field Object Type / pass', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNested1, data, keyNestedId, TestFieldNestedType);

    checkDictValue(res, TestFieldNestedType, [dataNested1]);
  });

  it('putDictSingle - field Object Type / failed', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNestedFail, data, keyNestedId, TestFieldNestedType);

    expect(res.error).not.toEqual(null);
    expect(res.error[TestFieldNestedType.FIELD_NESTED_OBJ_A]).not.toEqual(null);
    expect(res.error[TestFieldNestedType.FIELD_NESTED_OBJ_B]).not.toEqual(null);
  });

  it('putDictSingle - field Ref Type / pass', function() {
    var data = Immutable.OrderedMap([]);

    var res = HexStoreDataHelper.putDictSingle(
      dataRef1, data, keyRefId, TestFieldRefType);
    checkDictValue(res, TestFieldRefType, [dataRef1]);

    res = HexStoreDataHelper.putDictSingle(
      dataRef2, res.data, keyRefId, TestFieldRefType);
    checkDictValue(res, TestFieldRefType, [dataRef1, dataRef2]);

    res = HexStoreDataHelper.putDictSingle(
      dataRef3, res.data, keyRefId, TestFieldRefType);
    checkDictValue(res, TestFieldRefType, [dataRef1, dataRef2, dataRef3]);

  });

  it('putDictSingle - field Ref Type / failed', function() {
    var data = Immutable.OrderedMap([]);

    var res = HexStoreDataHelper.putDictSingle(
      dataRefFail, data, keyRefId, TestFieldRefType);

    expect(res.error).not.toEqual(null);
    expect(res.error[TestFieldRefType.FIELD_REF_A]).not.toEqual(null);
    expect(res.error[TestFieldRefType.FIELD_REF_B]).not.toEqual(null);
    expect(res.error[TestFieldRefType.FIELD_REF_C]).not.toEqual(null);
  });

  it('putDictSingle - validate failed / No Default', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNewFail1, data, keyId, TestFieldType);

    var updatedData = res.data;
    var error = res.error;
    expect(updatedData).toEqual(null);
    expect(error).not.toEqual(null);

    var curFieldType;
    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      expect(error[curFieldType].value).toEqual(dataNewFail1[curFieldType]);
    }
  });

  it('putDictSingle - validate failed / No Fix', function() {

    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNewFailNoDefault1, data, keyId, TestFieldTypeNoDefault, true);

    var updatedData = res.data;
    var error = res.error;

    expect(updatedData).toEqual(null);
    expect(error).not.toEqual(null);

    var curFieldType;
    for (var fieldType in TestFieldTypeNoDefault) {
      curFieldType = TestFieldTypeNoDefault[fieldType];
      //console.log(curFieldType + '>' + error[curFieldType].error.type);
      expect(error[curFieldType].value).toEqual(
        dataNewFailNoDefault1[curFieldType]);
      expect(error[curFieldType].error.type).toEqual(
        dataNewFailNoDefaultError[curFieldType]);
    }
  });

  it('putDictSingle - validate failed / AutoFix have Key', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNewFailHaveKey1, data, keyId, TestFieldType, true);

    var updatedData = res.data;
    var error = res.error;

    expect(error).toEqual(null);
    expect(updatedData).not.toEqual(null);
    var updatedDataJs = updatedData.toOrderedSet().toJS();

    var curFieldType;
    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      if (curFieldType == keyId) {
        continue;
      }
      expect(updatedDataJs[0][curFieldType]).toEqual(TestDefault[fieldType]);
    }

  });

  it('putDictSingle - validate failed / AutoFix but no Key', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNewFail1, data, keyId, TestFieldType, true);

    var updatedData = res.data;
    var error = res.error;

    expect(error).not.toEqual(null);
    expect(updatedData).toEqual(null);

    expect(error[TestFieldType.FIELD_ID].value).toEqual(
      dataNewFail1[TestFieldType.FIELD_ID]);
    expect(error[TestFieldType.FIELD_ID].error.type).toEqual(
      HexFieldErrorType.NOT_STRING_ERROR);
  });

  it('putDictSingle - missing / No Fix', function() {

    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataMissingNoDefault1, data, keyId, TestFieldTypeNoDefault);

    var updatedData = res.data;
    var error = res.error;

    expect(updatedData).toEqual(null);
    expect(error).not.toEqual(null);

    var curFieldType;
    for (var fieldType in TestFieldTypeNoDefault) {
      curFieldType = TestFieldTypeNoDefault[fieldType];
      //console.log(curFieldType + '>' + error[curFieldType].error.type);
      expect(error[curFieldType].value).toBe(undefined);
      expect(error[curFieldType].error.type).toEqual(
        dataMissingNoDefaultError[curFieldType]);
    }
  });

  it('putDictSingle - missing / Auto Fix', function() {

    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataMissing1, data, keyId, TestFieldType, true);

    var updatedData = res.data;
    var error = res.error;

    expect(updatedData).not.toBe(null);
    expect(error).toBe(null);
    var updatedDataJs = updatedData.toOrderedSet().toJS();

    var curFieldType;
    for (var fieldType in TestFieldType) {
      curFieldType = TestFieldType[fieldType];
      if (curFieldType == keyId) {
        continue;
      }
      expect(updatedDataJs[0][curFieldType]).toEqual(TestDefault[fieldType]);
    }
  });

  it('putDictSingle - missing / Auto Fix but no Key', function() {

    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataMissingNoDefault1, data, keyId, TestFieldType, true);

    var updatedData = res.data;
    var error = res.error;

    expect(error).not.toEqual(null);
    expect(updatedData).toEqual(null);

    expect(error[TestFieldType.FIELD_ID].value).toEqual(undefined);
    expect(error[TestFieldType.FIELD_ID].error.type).toEqual(
      HexFieldErrorType.EMPTY_ERROR);

  });

  it('putDictAry - pass', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictAry(
      [dataNew1, dataNew2], data, keyId, TestFieldType);

    checkPutDictAry(res, data);
  });

  it('putDict - pass single', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDict(
      dataNew1, data, keyId, TestFieldType);

    checkPutDictSingle(res, data);
  });

  it('putDict - pass array', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDict(
      [dataNew1, dataNew2], data, keyId, TestFieldType);

    checkPutDictAry(res, data);
  });

  it('putDictWithMapping - pass single', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictWithMapping(
      dataNewMap1, data, keyId, TestFieldType);

    checkPutDictSingle(res, data);
  });

  it('putDictWithMapping - pass array', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictWithMapping(
      [dataNewMap1, dataNewMap2], data, keyId, TestFieldType);

    checkPutDictAry(res, data);
  });

  it('postDictSingle - pass / update all', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNew1, data, keyId, TestFieldType);
    checkPutDictSingle(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDictSingle(
      dataPost1, data, keyId, TestFieldType);
    checkPostDictSingle(res, data);
  });

  it('postDictSingle - pass / update partial', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNew1, data, keyId, TestFieldType);
    checkPutDictSingle(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDictSingle(
      dataPostPartial1, data, keyId, TestFieldType);

    var updatedData = res.data;
    var error = res.error;

    expect(error).toEqual(null);
    expect(updatedData).not.toEqual(null);
    expect(updatedData !== data).toBe(true);

    var updatedDataJs = updatedData.toOrderedSet().toJS();
    expect(updatedDataJs.length).toEqual(1);

    expect(updatedDataJs[0][TestFieldType.FIELD_ID]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_ID]);
    expect(updatedDataJs[0][TestFieldType.FIELD_STR]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_STR]);
    expect(updatedDataJs[0][TestFieldType.FIELD_BOOLEAN]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_BOOLEAN]);
    expect(updatedDataJs[0][TestFieldType.FIELD_POS_INT]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_POS_INT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_POS_FLOAT]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_POS_FLOAT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_ARRAY]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_ARRAY]);
    expect(updatedDataJs[0][TestFieldType.FIELD_OBJECT]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_OBJECT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_STR_32]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_STR_32]);
    expect(updatedDataJs[0][TestFieldType.FIELD_ENG_NUM_32]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_ENG_NUM_32]);
    expect(updatedDataJs[0][TestFieldType.FIELD_EMAIL]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_EMAIL]);

    expect(updatedDataJs[0][TestFieldType.FIELD_INT]).toEqual(
      dataNew1[TestFieldType.FIELD_INT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_FLOAT]).toEqual(
      dataNew1[TestFieldType.FIELD_FLOAT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_NON_EMPTY_STR]).toEqual(
      dataNew1[TestFieldType.FIELD_NON_EMPTY_STR]);
    expect(updatedDataJs[0][TestFieldType.FIELD_STR_128]).toEqual(
      dataNew1[TestFieldType.FIELD_STR_128]);
  });

  it('postDictSingle - fail / validate failed', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNew1, data, keyId, TestFieldType);
    checkPutDictSingle(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDictSingle(
      dataPostFail1, data, keyId, TestFieldType);

    var updatedData = res.data;
    var error = res.error;

    expect(updatedData).not.toEqual(null);
    expect(error).not.toEqual(null);
    // Not updated at all!
    expect(updatedData === data).toBe(true);

  });

  it('postDictSingle - fail / missing key', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNew1, data, keyId, TestFieldType);
    checkPutDictSingle(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDictSingle(
      dataPostMissing1, data, keyId, TestFieldType);

    var updatedData = res.data;
    var error = res.error;

    expect(updatedData).toEqual(null);
    expect(error).not.toEqual(null);

  });

  it('postDictAry - pass / update all', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictAry(
      [dataNew1, dataNew2], data, keyId, TestFieldType);
    checkPutDictAry(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDictAry(
      [dataPost1, dataPost2], data, keyId, TestFieldType);

    checkPostDictAry(res, data);

  });

  it('postDictAry - dual partial', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictAry(
      [dataNew1, dataNew2], data, keyId, TestFieldType);
    checkPutDictAry(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDictAry(
      [dataPostPartial1, dataPostPartial2], data, keyId, TestFieldType);

    var updatedData = res.data;
    var error = res.error;
    expect(error).toEqual(null);
    expect(updatedData).not.toEqual(null);
    expect(updatedData !== data).toBe(true);

    var updatedDataJs = updatedData.toOrderedSet().toJS();

    expect(updatedDataJs.length).toEqual(2);

    expect(updatedDataJs[0][TestFieldType.FIELD_ID]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_ID]);
    expect(updatedDataJs[0][TestFieldType.FIELD_STR]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_STR]);
    expect(updatedDataJs[0][TestFieldType.FIELD_BOOLEAN]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_BOOLEAN]);
    expect(updatedDataJs[0][TestFieldType.FIELD_POS_INT]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_POS_INT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_POS_FLOAT]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_POS_FLOAT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_ARRAY]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_ARRAY]);
    expect(updatedDataJs[0][TestFieldType.FIELD_OBJECT]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_OBJECT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_STR_32]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_STR_32]);
    expect(updatedDataJs[0][TestFieldType.FIELD_ENG_NUM_32]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_ENG_NUM_32]);
    expect(updatedDataJs[0][TestFieldType.FIELD_EMAIL]).toEqual(
      dataPostPartial1[TestFieldType.FIELD_EMAIL]);

    expect(updatedDataJs[0][TestFieldType.FIELD_INT]).toEqual(
      dataNew1[TestFieldType.FIELD_INT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_FLOAT]).toEqual(
      dataNew1[TestFieldType.FIELD_FLOAT]);
    expect(updatedDataJs[0][TestFieldType.FIELD_NON_EMPTY_STR]).toEqual(
      dataNew1[TestFieldType.FIELD_NON_EMPTY_STR]);
    expect(updatedDataJs[0][TestFieldType.FIELD_STR_128]).toEqual(
      dataNew1[TestFieldType.FIELD_STR_128]);

    expect(updatedDataJs[1][TestFieldType.FIELD_ID]).toEqual(
      dataPostPartial2[TestFieldType.FIELD_ID]);
    expect(updatedDataJs[1][TestFieldType.FIELD_STR]).toEqual(
      dataPostPartial2[TestFieldType.FIELD_STR]);
    expect(updatedDataJs[1][TestFieldType.FIELD_INT]).toEqual(
      dataPostPartial2[TestFieldType.FIELD_INT]);
    expect(updatedDataJs[1][TestFieldType.FIELD_FLOAT]).toEqual(
      dataPostPartial2[TestFieldType.FIELD_FLOAT]);
    expect(updatedDataJs[1][TestFieldType.FIELD_BOOLEAN]).toEqual(
      dataPostPartial2[TestFieldType.FIELD_BOOLEAN]);
    expect(updatedDataJs[1][TestFieldType.FIELD_POS_INT]).toEqual(
      dataPostPartial2[TestFieldType.FIELD_POS_INT]);
    expect(updatedDataJs[1][TestFieldType.FIELD_POS_FLOAT]).toEqual(
      dataPostPartial2[TestFieldType.FIELD_POS_FLOAT]);
    expect(updatedDataJs[1][TestFieldType.FIELD_ARRAY]).toEqual(
      dataPostPartial2[TestFieldType.FIELD_ARRAY]);
    expect(updatedDataJs[1][TestFieldType.FIELD_OBJECT]).toEqual(
      dataPostPartial2[TestFieldType.FIELD_OBJECT]);

    expect(updatedDataJs[1][TestFieldType.FIELD_NON_EMPTY_STR]).toEqual(
      dataNew2[TestFieldType.FIELD_NON_EMPTY_STR]);
    expect(updatedDataJs[1][TestFieldType.FIELD_STR_32]).toEqual(
      dataNew2[TestFieldType.FIELD_STR_32]);
    expect(updatedDataJs[1][TestFieldType.FIELD_STR_128]).toEqual(
      dataNew2[TestFieldType.FIELD_STR_128]);
    expect(updatedDataJs[1][TestFieldType.FIELD_ENG_NUM_32]).toEqual(
      dataNew2[TestFieldType.FIELD_ENG_NUM_32]);
    expect(updatedDataJs[1][TestFieldType.FIELD_EMAIL]).toEqual(
      dataNew2[TestFieldType.FIELD_EMAIL]);
  });

  it('postDictAry - dual fail', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictAry(
      [dataNew1, dataNew2], data, keyId, TestFieldType);
    checkPutDictAry(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDictAry(
      [dataPostFail1, dataPostFail2], data, keyId, TestFieldType);

    var updatedData = res.data;
    var error = res.error;

    expect(error).not.toEqual(null);
    expect(updatedData).not.toEqual(null);
    // Not updated at all
    expect(updatedData === data).toBe(true);

  });

  it('postDict - pass single', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNew1, data, keyId, TestFieldType);
    checkPutDictSingle(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDict(
      dataPost1, data, keyId, TestFieldType);
    checkPostDictSingle(res, data);
  });

  it('postDict - pass array', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictAry(
      [dataNew1, dataNew2], data, keyId, TestFieldType);
    checkPutDictAry(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDict(
      [dataPost1, dataPost2], data, keyId, TestFieldType);

    checkPostDictAry(res, data);
  });

  it('postDictWithMapping - pass single', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictSingle(
      dataNew1, data, keyId, TestFieldType);
    checkPutDictSingle(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDictWithMapping(
      dataPostMap1, data, keyId, TestFieldType);
    checkPostDictSingle(res, data);
  });

  it('postDictWithMapping - pass array', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.putDictAry(
      [dataNew1, dataNew2], data, keyId, TestFieldType);
    checkPutDictAry(res, data);

    data = res.data;

    var res = HexStoreDataHelper.postDictWithMapping(
      [dataPostMap1, dataPostMap2], data, keyId, TestFieldType);

    checkPostDictAry(res, data);
  });

  it('postMap - pass', function() {
    var data = Immutable.fromJS(dataNew1);

    var res = HexStoreDataHelper.postMap(
      dataPost1, data, TestFieldType);

    checkPostMapSingle(res, data);

  });

  it('postMap - no match / no effect', function() {
    var data = Immutable.fromJS(dataNew1);

    var wrongData = {
      WRONG_FIELD: 1,
      WRONG_FIELD_1: 2,
      WRONG_FIELD_2: 3
    };

    var res = HexStoreDataHelper.postMap(
      wrongData, data, TestFieldType);

    expect(res.error).toEqual(null);
    expect(res.data === data).toBe(true);
  });

  it('postMap - validate failed', function() {
    var data = Immutable.fromJS(dataNew1);

    var dataNewFail1NoKey = Object.assign({}, dataNewFail1);
    delete dataNewFail1NoKey[TestFieldType.FIELD_ID];

    var res = HexStoreDataHelper.postMap(
      dataNewFail1NoKey, data, TestFieldType);

    expect(res.error).not.toEqual(null);

    var updatedData = res.data;
    var updatedDataJs = updatedData.toJS();
    // Not changed
    expect(res.data === data).toBe(true);
  });

  it('postMapSingle - pass', function() {
    var data = Immutable.fromJS(dataNew1);

    var newValue = 'post_str';

    var res = HexStoreDataHelper.postMapSingle(
      TestFieldType.FIELD_STR, newValue, data, TestFieldType);

    expect(res.error).toEqual(null);

    var updatedData = res.data;
    var updatedDataJs = updatedData.toJS();
    expect(updatedDataJs[TestFieldType.FIELD_STR]).toEqual(newValue);
  });

  it('postMapSingle - validate failed', function() {
    var data = Immutable.fromJS(dataNew1);

    var newValue = 123;

    var res = HexStoreDataHelper.postMapSingle(
      TestFieldType.FIELD_STR, newValue, data, TestFieldType);

    expect(res.error).not.toEqual(null);
    expect(res.error[TestFieldType.FIELD_STR].value).toEqual(newValue);

    // Not changed
    expect(res.data === data).toBe(true);
  });

  it('postMapSingle - wrong field / no change', function() {
    var data = Immutable.fromJS(dataNew1);

    var newValue = 123;
    var wrongField = 'wrongField';

    var res = HexStoreDataHelper.postMapSingle(
      wrongField, newValue, data, TestFieldType);
    // Not changed
    expect(res.data === data).toBe(true);
  });

  it('postMapSingle - wrong type / no change', function() {
    var data = Immutable.fromJS(dataNew1);

    var newValue = 123;
    var wrongFieldType = {};

    var res = HexStoreDataHelper.postMapSingle(
      TestFieldType.FIELD_STR, newValue, data, wrongFieldType);
    // Not changed
    expect(res.data === data).toBe(true);
  });

  it('putMapArray - pass unique', function() {

    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = ['id_1', 'id_2', 'id_3'];

    var newValue = 'id_4';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.putMapArray(
      TestFieldType.FIELD_ARRAY, newValue, data);

    expect(res.error).toEqual(null);

    var updatedData = res.data;
    var updatedDataJs = updatedData.toJS();
    var dataAry = updatedDataJs[TestFieldType.FIELD_ARRAY];
    // Not changed
    expect(dataAry.length).toBe(4);
    expect(dataAry.indexOf(newValue)).toBe(3);
  });

  it('putMapArray - pass not unique', function() {

    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = ['id_1', 'id_2', 'id_3'];

    var newValue = 'id_3';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.putMapArray(
      TestFieldType.FIELD_ARRAY, newValue, data, false);

    expect(res.error).toEqual(null);

    var updatedData = res.data;
    var updatedDataJs = updatedData.toJS();
    var dataAry = updatedDataJs[TestFieldType.FIELD_ARRAY];
    // Not changed
    expect(dataAry.length).toBe(4);
    expect(dataAry).toEqual(['id_1', 'id_2', 'id_3', 'id_3']);
  });

  it('putMapArray - failed unique', function() {

    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = ['id_1', 'id_2', 'id_3'];

    var newValue = 'id_3';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.putMapArray(
      TestFieldType.FIELD_ARRAY, newValue, data);

    expect(res.data).toEqual(null);
    expect(res.error).not.toEqual(null);
    expect(res.error[TestFieldType.FIELD_ARRAY].type).
      toEqual(HexFieldErrorType.ITEM_DUPLICATED_ERROR);
    expect(res.error[TestFieldType.FIELD_ARRAY].value).
      toEqual(newValue);
  });

  it('putMapArray - failed not Array', function() {

    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = 'not_array';

    var newValue = 'id_3';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.putMapArray(
      TestFieldType.FIELD_ARRAY, newValue, data);

    expect(res.data).toEqual(null);
    expect(res.error).not.toEqual(null);
    expect(res.error[TestFieldType.FIELD_ARRAY].type).
      toEqual(HexFieldErrorType.NOT_ARRAY_ERROR);
    expect(res.error[TestFieldType.FIELD_ARRAY].value).
      toEqual(dataPutMap[TestFieldType.FIELD_ARRAY]);
  });

  it('deleteMapArray - pass', function() {

    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = ['id_1', 'id_2', 'id_3'];

    var deleteValue = 'id_3';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.deleteMapArray(
      TestFieldType.FIELD_ARRAY, deleteValue, data);

    expect(res.error).toEqual(null);

    var updatedData = res.data;
    var updatedDataJs = updatedData.toJS();
    var dataAry = updatedDataJs[TestFieldType.FIELD_ARRAY];
    // Not changed
    expect(dataAry.length).toBe(2);
    expect(dataAry.indexOf(deleteValue)).toBe(-1);

  });

  it('deleteMapArray - not found', function() {

    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = ['id_1', 'id_2', 'id_3'];

    var deleteValue = 'id_4';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.deleteMapArray(
      TestFieldType.FIELD_ARRAY, deleteValue, data);

    expect(res.data).toEqual(null);
    expect(res.error).not.toEqual(null);
    expect(res.error[TestFieldType.FIELD_ARRAY].type).
      toEqual(HexFieldErrorType.ITEM_NOT_FOUND_ERROR);
    expect(res.error[TestFieldType.FIELD_ARRAY].value).
      toEqual(deleteValue);

  });

  it('deleteMapArray - failed not Array', function() {

    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = 'not_array';

    var deleteValue = 'id_3';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.deleteMapArray(
      TestFieldType.FIELD_ARRAY, deleteValue, data);

    expect(res.data).toEqual(null);
    expect(res.error).not.toEqual(null);
    expect(res.error[TestFieldType.FIELD_ARRAY].type).
      toEqual(HexFieldErrorType.NOT_ARRAY_ERROR);
    expect(res.error[TestFieldType.FIELD_ARRAY].value).
      toEqual(dataPutMap[TestFieldType.FIELD_ARRAY]);

  });

  it('putMapArray + deleteMapArray - pass', function() {

    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = [];

    var putValueAry = ['id_1', 'id_2', 'id_3'];

    var res = {};
    res.data = Immutable.fromJS(dataPutMap);
    for (var i = 0; i < putValueAry.length; i++) {
      res = HexStoreDataHelper.putMapArray(
        TestFieldType.FIELD_ARRAY, putValueAry[i], res.data);
      expect(res.error).toEqual(null);
    }

    var updatedData = res.data;
    var updatedDataJs = updatedData.toJS();
    var dataAry = updatedDataJs[TestFieldType.FIELD_ARRAY];
    expect(dataAry).toEqual(['id_1', 'id_2', 'id_3']);

    for (var i = 0; i < putValueAry.length; i++) {
      res = HexStoreDataHelper.deleteMapArray(
        TestFieldType.FIELD_ARRAY, putValueAry[i], res.data);
      expect(res.error).toEqual(null);
    }

    updatedData = res.data;
    updatedDataJs = updatedData.toJS();
    dataAry = updatedDataJs[TestFieldType.FIELD_ARRAY];
    expect(dataAry).toEqual([]);

  });

  it('handleActionMapArray - PUT', function() {
    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = ['id_1', 'id_2', 'id_3'];

    var newValue = 'id_4';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.handleActionMapArray(
      TestFieldType.FIELD_ARRAY, newValue, data, HexActionMethodType.PUT);

    expect(res.error).toEqual(null);

    var updatedData = res.data;
    var updatedDataJs = updatedData.toJS();
    var dataAry = updatedDataJs[TestFieldType.FIELD_ARRAY];
    // Not changed
    expect(dataAry.length).toBe(4);
    expect(dataAry.indexOf(newValue)).toBe(3);
  });

  it('handleActionMapArray - DELETE', function() {
    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = ['id_1', 'id_2', 'id_3'];

    var newValue = 'id_3';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.handleActionMapArray(
      TestFieldType.FIELD_ARRAY, newValue, data, HexActionMethodType.DELETE);

    expect(res.error).toEqual(null);

    var updatedData = res.data;
    var updatedDataJs = updatedData.toJS();
    var dataAry = updatedDataJs[TestFieldType.FIELD_ARRAY];
    // Not changed
    expect(dataAry.length).toBe(2);
    expect(dataAry.indexOf(newValue)).toBe(-1);
  });

  it('handleActionMapArray - Invalid Method', function() {
    var dataPutMap = {};
    dataPutMap[TestFieldType.FIELD_ID] = 'data_id_1';
    dataPutMap[TestFieldType.FIELD_ARRAY] = ['id_1', 'id_2', 'id_3'];

    var newValue = 'id_3';
    var invalidMethod = 'invalid';

    var data = Immutable.fromJS(dataPutMap);

    var res = HexStoreDataHelper.handleActionMapArray(
      TestFieldType.FIELD_ARRAY, newValue, data, invalidMethod);

    checkErrorUnsupportMethod(res, invalidMethod, TestFieldType.FIELD_ARRAY);
  });

  it('handleActionMapField - POST', function() {
    var data = Immutable.fromJS(dataNew1);

    var newValue = 'post_str';

    var res = HexStoreDataHelper.handleActionMapField(
      TestFieldType.FIELD_STR, newValue, data,
      HexActionMethodType.POST, TestFieldType);

    expect(res.error).toEqual(null);

    var updatedData = res.data;
    var updatedDataJs = updatedData.toJS();
    expect(updatedDataJs[TestFieldType.FIELD_STR]).toEqual(newValue);
  });

  it('handleActionMapField - Invalid Method', function() {
    var data = Immutable.fromJS(dataNew1);

    var newValue = 'post_str';
    var invalidMethod = 'invalid';

    var res = HexStoreDataHelper.handleActionMapField(
      TestFieldType.FIELD_STR, newValue, data,
      invalidMethod, TestFieldType);

    checkErrorUnsupportMethod(res, invalidMethod, TestFieldType.FIELD_STR);
  });

  it('handleActionDictMapped - PUT / Single', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.handleActionDictMapped(
      keyId, dataNewMap1, data, HexActionMethodType.PUT, TestFieldType);

    checkPutDictSingle(res, data);
  });

  it('handleActionDictMapped - PUT / Array', function() {
    var data = Immutable.OrderedMap([]);
    var res = HexStoreDataHelper.handleActionDictMapped(
      keyId, [dataNewMap1, dataNewMap2], data,
      HexActionMethodType.PUT, TestFieldType);

    checkPutDictAry(res, data);
  });

  it('handleActionDictMapped - Invalid Method', function() {
    var data = Immutable.OrderedMap([]);
    var invalidMethod = 'invalid';
    var res = HexStoreDataHelper.handleActionDictMapped(
      keyId, dataNewMap1, data, invalidMethod, TestFieldType);

    checkErrorUnsupportMethod(res, invalidMethod, keyId);
  });

});

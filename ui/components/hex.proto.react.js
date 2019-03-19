var React = require('react');
var createReactClass = require('create-react-class');
var HexPropType = require('../types/hex.prop.type');

const MODULE_ID = 'HexProto';

// External Data
var _extData;
var _extL10N;

var HexProto = createReactClass({
  render: function() {
    var moduleId = this.props[HexPropType.MODULE_ID];
    return (
      <div className='prototype'>
        {moduleId}
        {this.props.children}
      </div>
    );
  }

});

module.exports = HexProto;

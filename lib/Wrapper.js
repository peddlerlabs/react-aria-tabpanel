var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var createManager = require('./createManager');
var specialAssign = require('./specialAssign');

var checkedProps = {
  children: PropTypes.node.isRequired,
  activeTabId: PropTypes.string,
  letterNavigation: PropTypes.bool,
  onChange: PropTypes.func,
  tag: PropTypes.string,
};

module.exports = createReactClass({
  displayName: 'AriaTabPanel-Wrapper',

  propTypes: checkedProps,

  getDefaultProps: function() {
    return { tag: 'div' };
  },

  childContextTypes: {
    atpManager: PropTypes.object.isRequired,
  },

  getChildContext: function() {
    return { atpManager: this.manager };
  },

  componentWillReceiveProps: function(nextProps) {
    this.manager = createManager({
      onChange: nextProps.onChange,
      activeTabId: nextProps.activeTabId,
      letterNavigation: nextProps.letterNavigation,
    });
  },

  componentWillMount: function() {
    this.componentWillReceiveProps(this.props);
  },

  componentWillUpdate: function() {
    this.manager.activate();
  },


  componentWillUnmount: function() {
    this.manager.destroy();
  },

  componentDidMount: function() {
    this.manager.activate();
  },

  render: function() {
    var props = this.props;
    var elProps = {};
    specialAssign(elProps, props, checkedProps);
    return React.createElement(props.tag, elProps, props.children);
  },
});

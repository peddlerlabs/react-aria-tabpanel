var React = require('react');
var PropTypes = require('prop-types');
var createReactClass = require('create-react-class');
var specialAssign = require('./specialAssign');

var checkedProps = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  id: PropTypes.string.isRequired,
  tag: PropTypes.string,
  index: PropTypes.number,
  active: PropTypes.bool,
  letterNavigationText: PropTypes.string,
};

module.exports = createReactClass({
  displayName: 'AriaTabPanel-Tab',

  propTypes: checkedProps,

  getDefaultProps: function() {
    return { tag: 'div' };
  },

  contextTypes: {
    atpManager: PropTypes.object.isRequired,
  },

  getInitialState: function() {
    return {
      isActive: this.context.atpManager.memberStartsActive(this.props.id) || false,
    };
  },

  handleFocus: function() {

  },

  handleClick: function(e) {
    if (this.props.tag && this.props.tag.toLowerCase() === 'a' && e) {
      e.preventDefault();
    }
    this.context.atpManager.handleTabFocus(this.props.id);
  },

  updateActiveState: function(nextActiveState) {
    this.setState({ isActive: nextActiveState });
  },

  registerWithManager: function(el) {
    if (this.isRegistered) return;
    this.isRegistered = true;
    this.context.atpManager.registerTab({
      id: this.props.id,
      node: el,
      update: this.updateActiveState,
      index: this.props.index,
      letterNavigationText: this.props.letterNavigationText,
    });
  },

  render: function() {
    var props = this.props;
    var isActive = (props.active === undefined) ? this.state.isActive : props.active;

    var kids = (function() {
      if (typeof props.children === 'function') {
        return props.children({ isActive: isActive });
      }
      return props.children;
    }());

    var elProps = {
      id: props.id,
      tabIndex: (isActive) ? 0 : -1,
      onClick: this.handleClick,
      onFocus: this.handleFocus,
      role: 'tab',
      'aria-selected': isActive,
      'aria-controls': this.context.atpManager.getTabPanelId(props.id),
      ref: this.registerWithManager,
    };
    specialAssign(elProps, props, checkedProps);

    return React.createElement(props.tag, elProps, kids);
  },
});

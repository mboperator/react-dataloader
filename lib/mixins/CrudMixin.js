var CrudMixin = {
  handleChange(attribute, value) {
    var state = {};
    state[attribute] = value;
    this.setState(state);
  },

  handleUpdate() {
    var object = this.state;
    this.props.actions.update(object);
    this.context.router.transitionTo('view', {id: this.props.objectId});
  } 
};

module.exports = CrudMixin;

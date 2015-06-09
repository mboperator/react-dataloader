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
  },

  handleCreate() {
    var object = this.state;
    this.props.actions.add(object);
    this.context.router.transitionTo('index', '/');
  }
};

module.exports = CrudMixin;

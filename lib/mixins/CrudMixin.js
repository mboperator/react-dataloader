var _ = require('underscore');

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
  },
  saveChecklist(listId, stores) { 
    
    var listStore = stores.lists;
    var sectionStore = stores.sections;
    var itemStore = stores.items;

    var list = listStore.get(listId);
    var sections = sectionStore.find({parent_id: listId});
    debugger;
    _.each(sections, (section) => {
      var items = itemStore.find({parent_id: section.id});
      section.items = items;
    });
  }
};

module.exports = CrudMixin;

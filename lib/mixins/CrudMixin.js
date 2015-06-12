var _ = require('underscore');

var CrudMixin = {
  handleChange(attribute, value) {
    var sync = false;
    var object = this.props.data;
    object[attribute] = value;
    this.props.actions.update(object, sync);
  },

  handleUpdate() {
    var object = this.state;
    this.props.actions.update(object).then(() => {
      this.context.router.transitionTo('view', {id: this.props.objectId});
    });;
  },

  removeTmpIds(object) {
    if (object.id.match("temp")) { object.id = null; }
    return object;
  },

  handleCreate() {
    var object = this.state;
    this.props.actions.add(object);
    this.context.router.transitionTo('index', '/');
  },
  saveChecklist(object, stores) {
    
    var listStore = stores.lists;
    var sectionStore = stores.sections;
    var itemStore = stores.items;

    var list = listStore.get(object.id);
    list = _.extend(list, object);
    list.sections_attributes = sectionStore.find({parent_id: object.id});
    _.each(list.sections_attributes, (section) => {
      var items = itemStore.find({parent_id: section.id});
      section.items_attributes = items.map(this.removeTmpIds);
      section.id = null;
    });

    list.id = null;

    listStore.listenables.add(list);
  }
};

module.exports = CrudMixin;

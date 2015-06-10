var DSManager = require('../services/DataStoreManager');

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
  saveChecklist(listId) { 
    var templatesConfig = {
      name: 'ListTemplates',
      idAttr: 'id',
      endpoint: 'list_templates',
      storeType: 'shared',
      builder: 'procore'
    };
    var sectionsConfig = {
      name: 'Sections',
      idAttr: 'id',
      fkAttr: 'parent_id',
      parentResource: 'lists',
      endpoint: 'sections',
      resource: 'section',
      storeType: 'shared',
      builder: 'procore'
    };
    var itemsConfig = {
      name: "Items",
      idAttr: "id",
      fkAttr: "parent_id",
      fkRootAttr: "list_id",
      rootResource: "lists",
      parentResource: "sections",
      resource: "item",
      endpoint: "items",
      storeType: "shared",
      builder: "procore"
    };

    var listStore = DSManager.getStore( templateConfig );
    var sectionStore = DSManager.getStore( sectionsConfig );
    var itemStore = DSManager.getStore( itemsConfig );

    var list = listStore.get(listId);
    var sections = sectionStore.find({parent_id: listId});

    _.each(sections, (section) => {
      var items = itemStore.find({parent_id: section.id});
      section.items = items;
    });

    list.sections = sections;

    this.props.actions.add(list);

  }
};

module.exports = CrudMixin;

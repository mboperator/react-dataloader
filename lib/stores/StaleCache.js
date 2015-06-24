var _ = require('underscore');

class StaleCache {
  constructor(options) {
    this.collection = [];
    this.idAttr = options.idAttr;
  }

  getCollection(n) {
    var memoized = {};
    var idAttr = this.idAttr;

    // this.collection.reverse().forEach(obj=> {
    //   if (!memoized[obj[idAttr]]) { memoized[obj[idAttr]] = 1; }
    //   else if (memoized[obj[idAttr]] === n) {
    //     this.setObject(obj) 
    //   }
    //   else { memoized[obj[idAttr]] += 1 }
    // });

    return this.collection.reverse();
  }

  push($type, object) {
    var formatted = _.extend({}, {$type}, object);
    this.collection.push(formatted);
  }

  pop(object) {
    this.collection = this.collection.without(object);
  }

  flush() {
    this.collection = [];
  }
}

module.exports = StaleCache;
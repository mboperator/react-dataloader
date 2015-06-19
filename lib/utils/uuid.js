"use strict";

debugger;
var uuid = {
  v4: function() {
    var id = Math.round(1000000 - Math.random() * 500000);
    return id;
  }

};

module.exports = uuid;

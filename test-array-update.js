SubSchema = new SimpleSchema({
  value: {
    type: String,
    autoValue: function() {
      console.log('autoValue called');
      return "autovalue";
    }
  }
});

TestSchema = new SimpleSchema({
  children: {
    type: [SubSchema]
  }
});

//////

var checkValue = function(value) {
  if (value !== "autovalue") {
    console.warn("Expected 'autovalue', got '" + value + "'");
  } else {
    console.log("OK")
  }
}

Meteor.startup(function () {
  
  /////

  console.log('Checking TestSchema.clean of new document ... ');
  var doc = {
    children: [{value: "will be overridden by autovalue"}]
  };
  TestSchema.clean(doc);
  checkValue(doc.children[0].value);
  
  /////

  console.log('Checking SubSchema.clean of modifier ... ');
  var mod = {
    $set: {value: "will be overridden by autovalue"}
  };
  SubSchema.clean(mod, {isModifier: true});
  checkValue(mod.$set.value);

  /////

  console.log('Checking TestSchema.clean of modifier ... ');
  var mod = {
    $set: {"children.$.value": "should be overridden by autovalue"}
  };
  TestSchema.clean(mod, {isModifier: true});
  checkValue(mod.$set["children.$.value"]);

});

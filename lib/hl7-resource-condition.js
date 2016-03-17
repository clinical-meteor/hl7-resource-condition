
Conditions = new Meteor.Collection('conditions');

if (Meteor.isClient){
  Meteor.subscribe('conditions');
}



ConditionSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Condition"
    }
});
Conditions.attachSchema(ConditionSchema);

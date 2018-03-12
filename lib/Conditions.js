
// create the object using our BaseModel
Condition = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Condition.prototype._collection = Conditions;

// Create a persistent data store for addresses to be stored.
// HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
Conditions = new Mongo.Collection('Conditions');

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Conditions._transform = function (document) {
  return new Condition(document);
};


// if (Meteor.isClient){
//   Meteor.subscribe("Conditions");
// }

// if (Meteor.isServer){
//   Meteor.publish("Conditions", function (argument){
//     if (this.userId) {
//       return Conditions.find();
//     } else {
//       return [];
//     }
//   });
// }



ConditionSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Condition"
  },
  "identifier" : {
    optional: true,
    type: [ IdentifierSchema ]
  }, // External Ids for this condition
  "patient" : {
    optional: true,
    type: ReferenceSchema
  }, // R!  (Patient) Who has the condition?
  "encounter" : {
    optional: true,
    type: ReferenceSchema
  }, // (Encounter) Encounter when condition first asserted
  "asserter" : {
    optional: true,
    type: ReferenceSchema
  }, // (Practitioner|Patient) Person who asserts this condition
  "dateRecorded" : {
    optional: true,
    type: Date
  }, // When first entered
  "code" : {
    optional: true,
    type: CodeableConceptSchema
  }, // R!  Identification of the condition, problem or diagnosis
  "category" : {
    optional: true,
    type: CodeableConceptSchema
  }, // complaint | symptom | finding | diagnosis
  "clinicalStatus" : {
    optional: true,
    type: Code
  }, // active | relapse | remission | resolved
  "verificationStatus" : {
    optional: true,
    type: Code
  }, // R!  provisional | differential | confirmed | refuted | entered-in-error | unknown
  "severity" : {
    optional: true,
    type: CodeableConceptSchema
  }, // Subjective severity of condition
  // onset[x]: Estimated or actual date,  date-time, or age. One of these 5:
  "onsetDateTime" : {
    optional: true,
    type: Date
  },
  "onsetQuantity" : {
    optional: true,
    type: QuantitySchema
  }, //(Age)
  "onsetPeriod" : {
    optional: true,
    type: PeriodSchema
  },
  "onsetRange" : {
    optional: true,
    type: RangeSchema
  },
  "onsetString" : {
    optional: true,
    type: String
  },
  // abatement[x]: If/when in resolution/remission. One of these 6:
  "abatementDateTime" : {
    optional: true,
    type: Date
  },
  "abatementQuantity" : {
    optional: true,
    type: QuantitySchema
  }, //(Age)
  "abatementBoolean" : {
    optional: true,
    type: Boolean
  },
  "abatementPeriod" : {
    optional: true,
    type: PeriodSchema
  },
  "abatementRange" : {
    optional: true,
    type: RangeSchema
  },
  "abatementString" : {
    optional: true,
    type: String
  },
  "stage.summary" : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? Simple summary (disease specific)
  "stage.assessment" : {
    optional: true,
    type: [ ReferenceSchema ]
  }, // (ClinicalImpression|DiagnosticReport|Observation) C? Formal record of assessment
  "evidence.$.code" : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? Manifestation/symptom
  "evidence.$.detail" : {
    optional: true,
    type: [ ReferenceSchema ]
  }, // C? Supporting information found elsewhere
  "bodySite" : {
    optional: true,
    type: [ CodeableConceptSchema ]
  }, // Anatomical location, if relevant
  "notes" : {
    optional: true,
    type: String
  } // Additional information about the Condition
});


Conditions.attachSchema(ConditionSchema);

export default { Condition, Conditions, ConditionSchema };
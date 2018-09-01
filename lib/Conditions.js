import SimpleSchema from 'simpl-schema';

// create the object using our BaseModel
Condition = BaseModel.extend();


//Assign a collection so the object knows how to perform CRUD operations
Condition.prototype._collection = Conditions;

// // Create a persistent data store for addresses to be stored.
// // HL7.Resources.Patients = new Mongo.Collection('HL7.Resources.Patients');
if(typeof Conditions === 'undefined'){
  if(Package['clinical:autopublish']){
    Conditions = new Mongo.Collection('Conditions');
  } else {
    Conditions = new Mongo.Collection('Conditions', {connection: null});
  }
}

//Add the transform to the collection since Meteor.users is pre-defined by the accounts package
Conditions._transform = function (document) {
  return new Condition(document);
};




ConditionSchema = new SimpleSchema({
  "resourceType" : {
    type: String,
    defaultValue: "Condition"
  },
  "identifier" : {
    optional: true,
    type:  Array
    },
  "identifier.$" : {
    optional: true,
    type:  IdentifierSchema 
    },
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
  "stage" : {
    optional: true,
    type: Object
  }, 

  "stage.summary" : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? Simple summary (disease specific)
  "stage.assessment" : {
    optional: true,
    type: Array
  }, // (ClinicalImpression|DiagnosticReport|Observation) C? Formal record of assessment
  "stage.assessment.$" : {
    optional: true,
    type: ReferenceSchema 
  }, 


  "evidence" : {
    optional: true,
    type: Array
  }, 
  "evidence.$" : {
    optional: true,
    type: Object
  }, 
  "evidence.$.code" : {
    optional: true,
    type: CodeableConceptSchema
  }, // C? Manifestation/symptom
  "evidence.$.detail" : {
    optional: true,
    type:Array
  }, 
  "evidence.$.detail.$" : {
    optional: true,
    type: ReferenceSchema 
  }, 

  "bodySite" : {
    optional: true,
    type: Array
  }, // Anatomical location, if relevant
  "bodySite.$" : {
    optional: true,
    type: CodeableConceptSchema
  }, // Anatomical location, if relevant

  "notes" : {
    optional: true,
    type: String
  } // Additional information about the Condition
});
BaseSchema.extend(ConditionSchema);
DomainResourceSchema.extend(ConditionSchema);
Conditions.attachSchema(ConditionSchema);

export default { Condition, Conditions, ConditionSchema };
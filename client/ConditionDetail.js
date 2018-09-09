// =======================================================================
// Using DSTU2  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//
// https://www.hl7.org/fhir/DSTU2/conditions.html
//
//
// =======================================================================

import { CardActions, CardText } from 'material-ui/Card';

// import { Bert } from 'meteor/clinical:alert';
import DatePicker from 'material-ui/DatePicker';
import RaisedButton from 'material-ui/RaisedButton';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import TextField from 'material-ui/TextField';
import { browserHistory } from 'react-router';
import { get, set } from 'lodash';
import PropTypes from 'prop-types';
import { Col, Grid, Row } from 'react-bootstrap';
import { moment } from 'meteor/momentjs:moment'

Session.setDefault('conditionUpsert', false);

export class ConditionDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      conditionId: false,
      condition: {
        resourceType: "Condition",
        patient: {
          reference: "",
          display: ""
        },
        asserter: {
          reference: "",
          display: ""
        },
        dateRecorded: null,
        code: {
          coding: [
            {
              system: "http://snomed.info/sct",
              code: "",
              display: ""
            }
          ]
        },
        clinicalStatus: "",
        verificationStatus: "confirmed",
        evidence: [],
        onsetDateTime: null
      }, 
      form: {
        patientDisplay: '',
        asserterDisplay: '',
        snomedCode: '',
        snomedDisplay: '',
        clinicalStatus: '',
        verificationStatus: '',
        evidenceDisplay: ''
      }
    }
  }
  dehydrateFhirResource(condition) {
    let formData = Object.assign({}, this.state.form);

    formData.patientDisplay = get(condition, 'patient.display')
    formData.asserterDisplay = get(condition, 'asserter.display')    
    formData.snomedCode = get(condition, 'code.coding[0].code')
    formData.snomedDisplay = get(condition, 'code.coding[0].display')
    formData.clinicalStatus = get(condition, 'clinicalStatus')
    formData.verificationStatus = get(condition, 'verificationStatus')

    return formData;
  }
  shouldComponentUpdate(nextProps){
    process.env.NODE_ENV === "test" && console.log('ConditionDetail.shouldComponentUpdate()', nextProps, this.state)
    let shouldUpdate = true;

    // both false; don't take any more updates
    if(nextProps.condition === this.state.condition){
      shouldUpdate = false;
    }

    // received an condition from the table; okay lets update again
    if(nextProps.conditionId !== this.state.conditionId){
      this.setState({conditionId: nextProps.conditionId})
      
      if(nextProps.condition){
        this.setState({condition: nextProps.condition})     
        this.setState({form: this.dehydrateFhirResource(nextProps.condition)})       
      }
      shouldUpdate = true;
    }
 
    return shouldUpdate;
  }

  getMeteorData() {
    let data = {
      conditionId: this.props.conditionId,
      condition: false,
      showDatePicker: false,
      form: this.state.form
    };

    if(this.props.showDatePicker){
      data.showDatePicker = this.props.showDatePicker
    }
    if(this.props.condition){
      data.condition = this.props.condition;
    }
    
    // if (Session.get('conditionUpsert')) {
    //   data.condition = Session.get('conditionUpsert');
    // } else {
    //     console.log("selectedCondition", Session.get('selectedCondition'));

    //     let selectedCondition = Conditions.findOne({_id: Session.get('selectedCondition')});
    //     console.log("selectedCondition", selectedCondition);

    //     if (selectedCondition) {
    //       data.condition = selectedCondition;
    //     }
    // }

    // if (Session.get('selectedCondition')) {
    //   data.conditionId = Session.get('selectedCondition');
    // }  

    return data;
  }
  renderDatePicker(showDatePicker, datePickerValue){
    if (typeof datePickerValue === "string"){
      datePickerValue = new Date(datePickerValue);
    }
    if (showDatePicker) {
      return (
        <DatePicker 
          name='onsetDateTime'
          hintText="Onset Date" 
          container="inline" 
          mode="landscape"
          value={ datePickerValue ? datePickerValue : null }    
          onChange={ this.changeState.bind(this, 'onsetDateTime')}      
          />
      );
    }
  }
  render() {
    if(process.env.NODE_ENV === "test") console.log('ConditionDetail.render()', this.state)
    let formData = this.state.form;

    return (
      <div id={this.props.id} className="conditionDetail">
        <CardText>
          <Row>
            <Col md={6} >
              <TextField
                id='patientDisplayInput'
                name='patientDisplay'
                floatingLabelText='Patient'
                value={ get(formData, 'patientDisplay', '') }
                onChange={ this.changeState.bind(this, 'patientDisplay')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={6} >
              <TextField
                id='asserterDisplayInput'
                name='asserterDisplay'
                floatingLabelText='Asserter'
                value={ get(formData, 'asserterDisplay', '') }
                onChange={ this.changeState.bind(this, 'asserterDisplay')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={6} >
              <TextField
                id='snomedCodeInput'
                name='snomedCode'
                floatingLabelText='SNOMED Code'
                value={ get(formData, 'snomedCode', '') }
                hintText='307343001'
                onChange={ this.changeState.bind(this, 'snomedCode')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={6} >
              <TextField
                id='snomedDisplayInput'
                name='snomedDisplay'
                floatingLabelText='SNOMED Display'
                value={ get(formData, 'snomedDisplay', '') }
                onChange={ this.changeState.bind(this, 'snomedDisplay')}
                hintText='Acquired hemoglobin H disease (disorder)'
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
          </Row>
          <Row>
            <Col md={6} >
              <TextField
                id='clinicalStatusInput'
                name='clinicalStatus'
                floatingLabelText='Clinical Status'
                value={ get(formData, 'clinicalStatus', '') }
                hintText='active | recurrence | inactive | remission | resolved'
                onChange={ this.changeState.bind(this, 'clinicalStatus')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            <Col md={6} >
              <TextField
                id='verificationStatusInput'
                name='verificationStatus'
                floatingLabelText='Verification Status'
                value={ get(formData, 'verificationStatus', '') }
                hintText='provisional | differential | confirmed | refuted | entered-in-error | unknown'
                onChange={ this.changeState.bind(this, 'verificationStatus')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col>
            {/* <Col md={6} >
              <TextField
                id='evidenceDisplayInput'
                name='evidenceDisplay'
                floatingLabelText='Evidence (Observation)'
                value={ get(formData, 'evidence[0].detail[0].display') }
                onChange={ this.changeState.bind(this, 'evidenceDisplay')}
                floatingLabelFixed={true}
                fullWidth
                /><br/>
            </Col> */}
          </Row>


          <br/>
          { this.renderDatePicker(this.data.showDatePicker, get(this, 'data.condition.onsetDateTime') ) }
          <br/>

          <a href='http://browser.ihtsdotools.org/?perspective=full&conceptId1=404684003&edition=us-edition&release=v20180301&server=https://prod-browser-exten.ihtsdotools.org/api/snomed&langRefset=900000000000509007'>Lookup codes with the SNOMED CT Browser</a>

        </CardText>
        <CardActions>
          { this.determineButtons(this.data.conditionId) }
        </CardActions>
      </div>
    );
  }

  determineButtons(conditionId){
    if (conditionId) {
      return (
        <div>
          <RaisedButton id="updateConditionButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} style={{marginRight: '20px'}}  />
          <RaisedButton id="deleteConditionButton" label="Delete" onClick={this.handleDeleteButton.bind(this)} />

        </div>
      );
    } else {
      return(
        <RaisedButton id="saveConditionButton" label="Save" primary={true} onClick={this.handleSaveButton.bind(this)} />
      );
    }
  }


  updateFormData(formData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ConditionDetail.updateFormData", formData, field, textValue);

    switch (field) {
      case "patientDisplay":
        set(formData, 'patientDisplay', textValue)
        break;
      case "asserterDisplay":
        set(formData, 'asserterDisplay', textValue)
        break;        
      case "verificationStatus":
        set(formData, 'verificationStatus', textValue)
        break;
      case "clinicalStatus":
        set(formData, 'clinicalStatus', textValue)
        break;
      case "snomedCode":
        set(formData, 'snomedCode', textValue)
        break;
      case "snomedDisplay":
        set(formData, 'snomedDisplay', textValue)
        break;
      case "evidenceDisplay":
        set(formData, 'evidenceDisplay', textValue)
        break;
      case "onsetDateTime":
        set(formData, 'onsetDateTime', textValue)
        break;
      default:
    }

    if(process.env.NODE_ENV === "test") console.log("formData", formData);
    return formData;
  }
  updateCondition(conditionData, field, textValue){
    if(process.env.NODE_ENV === "test") console.log("ConditionDetail.updateCondition", conditionData, field, textValue);

    switch (field) {
      case "patientDisplay":
        set(conditionData, 'patient.display', textValue)
        break;
      case "asserterDisplay":
        set(conditionData, 'asserter.display', textValue)
        break;
      case "verificationStatus":
        set(conditionData, 'verificationStatus', textValue)
        break;
      case "clinicalStatus":
        set(conditionData, 'clinicalStatus', textValue)
        break;
      case "snomedCode":
        set(conditionData, 'code.coding[0].code', textValue)
        break;
      case "snomedDisplay":
        set(conditionData, 'code.coding[0].display', textValue)
        break;
      case "evidenceDisplay":
        set(conditionData, 'evidence[0].detail[0].display', textValue)
        break;  
      case "datePicker":
        set(conditionData, 'onsetDateTime', textValue)
        break;

      // case "verificationStatus":
      //   switch (textValue) {
      //     case 0:
      //       set(conditionData, 'verificationStatus', 'unconfirmed')
      //       break;
      //     case 1:
      //       set(conditionData, 'verificationStatus', 'confirmed')
      //       break;
      //     case 2:
      //       set(conditionData, 'verificationStatus', 'refuted')
      //       break;
      //     case 3:
      //       set(conditionData, 'verificationStatus', 'entered-in-error')
      //       break;
      //   }       
      //   break;
      
    }
    return conditionData;
  }
  componentDidUpdate(props){
    if(process.env.NODE_ENV === "test") console.log('ConditionDisplay.componentDidUpdate()', props, this.state)
  }
  // this could be a mixin
  changeState(field, event, textValue){

    if(process.env.NODE_ENV === "test") console.log("   ");
    if(process.env.NODE_ENV === "test") console.log("ConditionDetail.changeState", field, textValue);
    if(process.env.NODE_ENV === "test") console.log("this.state", this.state);

    let formData = Object.assign({}, this.state.form);
    let conditionData = Object.assign({}, this.state.condition);

    formData = this.updateFormData(formData, field, textValue);
    conditionData = this.updateCondition(conditionData, field, textValue);

    if(process.env.NODE_ENV === "test") console.log("conditionData", conditionData);
    if(process.env.NODE_ENV === "test") console.log("formData", formData);

    this.setState({condition: conditionData})
    this.setState({form: formData})

  }

  handleSaveButton(){
    if(process.env.NODE_ENV === "test") console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^&&')
    console.log('Saving a new Condition...', this.state)

    let fhirConditionData = Object.assign({}, this.state.condition);

    if(process.env.NODE_ENV === "test") console.log('fhirConditionData', fhirConditionData);


    let conditionValidator = ConditionSchema.newContext();
    conditionValidator.validate(fhirConditionData)

    console.log('IsValid: ', conditionValidator.isValid())
    console.log('ValidationErrors: ', conditionValidator.validationErrors());

    if (this.data.conditionId) {
      if(process.env.NODE_ENV === "test") console.log("Updating Condition...");
      delete fhirConditionData._id;

      // // not sure why we're having to respecify this; fix for a bug elsewhere
      // fhirConditionData.resourceType = 'Condition';

      Conditions.update(
        {_id: Session.get('selectedCondition')}, {$set: fhirConditionData }, {
          validate: true, 
          filter: false, 
          removeEmptyStrings: false
        }, function(error, result) {
          if (error) {
            console.log("error", error);
            Bert.alert(error.reason, 'danger');
          }
          if (result) {
            HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Conditions", recordId: Session.get('selectedCondition')});
            Session.set('conditionPageTabIndex', 1);
            Session.set('selectedCondition', false);
            Session.set('conditionUpsert', false);
            Bert.alert('Condition updated!', 'success');
          }
        });
    } else {

      if(process.env.NODE_ENV === "test") console.log("Create a new Condition", fhirConditionData);

      Conditions.insert(fhirConditionData, {
        validate: true, 
        filter: false, 
        removeEmptyStrings: false
      }, function(error, result) {
        if (error) {
          console.log("error", error);
          Bert.alert(error.reason, 'danger');
        }
        if (result) {
          HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Conditions", recordId: result});
          Session.set('conditionPageTabIndex', 1);
          Session.set('selectedCondition', false);
          Session.set('conditionUpsert', false);
          Bert.alert('Condition added!', 'success');
        }
      });
    }
  }

  handleCancelButton(){
    Session.set('conditionPageTabIndex', 1);
  }

  handleDeleteButton(){
    Conditions.remove({_id: Session.get('selectedCondition')}, function(error, result){
      if (error) {
        Bert.alert(error.reason, 'danger');
      }
      if (result) {
        HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Conditions", recordId: Session.get('selectedCondition')});
        Session.set('conditionPageTabIndex', 1);
        Session.set('selectedCondition', false);
        Session.set('conditionUpsert', false);
        Bert.alert('Condition removed!', 'success');
      }
    });
  }
}

ConditionDetail.propTypes = {
  id: PropTypes.string,
  conditionId: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  condition: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
  showDatePicker: PropTypes.bool
};
ReactMixin(ConditionDetail.prototype, ReactMeteorData);
export default ConditionDetail;
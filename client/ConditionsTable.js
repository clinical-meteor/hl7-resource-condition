import { Card, CardActions, CardMedia, CardText, CardTitle, Toggle } from 'material-ui';

import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';
import { Table } from 'react-bootstrap';
import { get, has } from 'lodash';
import PropTypes from 'prop-types';

import { FaTags, FaCode, FaPuzzlePiece, FaLock  } from 'react-icons/fa';
import { GoTrashcan } from 'react-icons/go'

export class ConditionsTable extends React.Component {

  getMeteorData() {

    let data = {
      style: {
        opacity: Session.get('globalOpacity')
      },
      selected: [],
      conditions: [],
      displayToggle: false,
      displayDates: false,
      displayPatientName: false,
      displayAsserterName: false,
      displayEvidence: false,
      displayIdentifier: false
    }
    
    if(this.props.displayPatientName){
      data.displayPatientName = this.props.displayPatientName;
    }
    if(this.props.displayAsserterName){
      data.displayAsserterName = this.props.displayAsserterName;
    }
    if(this.props.displayToggles){
      data.displayToggle = this.props.displayToggles;
    }
    if(this.props.displayDates){
      data.displayDates = this.props.displayDates;
    }
    if(this.props.displayEvidence){
      data.displayEvidence = this.props.displayEvidence;
    }

    if(this.props.data){
      data.conditions = this.props.data;
    } else {

      let query = {};
      if(this.props.query){
        query = this.props.query
      }
      if(this.props.hideEnteredInError){
        query.verificationStatus = {
          $nin: ["entered-in-error"]  // unconfirmed | provisional | differential | confirmed | refuted | entered-in-error
        }
      }

      console.log('ConditionsTable.Conditions.query: ', query)

      if(Conditions.find().count() > 0){
        data.conditions = Conditions.find(query).fetch();
      }  
    }

    if(get(Meteor, 'settings.public.logging') === "debug") console.log("ConditionsTable[data]", data);
    return data;
  };
  removeRecord(_id){
    console.log('Remove condition ', _id)
    Conditions._collection.remove({_id: _id})
  }
  showSecurityDialog(condition){
    console.log('showSecurityDialog', condition)

    Session.set('securityDialogResourceJson', Conditions.findOne(get(condition, '_id')));
    Session.set('securityDialogResourceType', 'Condition');
    Session.set('securityDialogResourceId', get(condition, '_id'));
    Session.set('securityDialogOpen', true);
  }
  displayOnMobile(width){
    let style = {};
    if(['iPhone'].includes(window.navigator.platform)){
      style.display = "none";
    }
    if(width){
      style.width = width;
    } else {
      style.minWidth = '140px'
    }
    return style;
  }
  renderToggleHeader(){
    if (!this.props.hideToggle) {
      return (
        <th className="toggle" style={{width: '60px'}} >Toggle</th>
      );
    }
  }
  renderToggle(patientId ){
    if (!this.props.hideToggle) {
      return (
        <td className="toggle">
            <Toggle
              defaultToggled={true}
            />
          </td>
      );
    }
  }
  renderDateHeader(header){
    if (!this.props.hideDates) {
      return (
        <th className='date' style={{minWidth: '100px'}}>{header}</th>
      );
    }
  }
  renderStartDate(startDate ){
    if (!this.props.hideDates) {
      return (
        <td className='date'>{ moment(startDate).format('YYYY-MM-DD') }</td>
      );
    }
  }
  renderEndDate(endDate ){
    if (!this.props.hideDates) {
      return (
        <td className='date'>{ moment(endDate).format('YYYY-MM-DD') }</td>
      );
    }
  }


  renderPatientNameHeader(){
    if (!this.props.hidePatientName) {
      return (
        <th className='patientDisplay'>patient</th>
      );
    }
  }
  renderPatientName(patientDisplay ){
    if (!this.props.hidePatientName) {
      return (
        <td className='patientDisplay' style={{minWidth: '140px'}}>{ patientDisplay }</td>
      );
    }
  }
  renderAsserterNameHeader(){
    if (!this.props.hideAsserterName) {
      return (
        <th className='asserterDisplay'>Asserter</th>
      );
    }
  }
  renderAsserterName(asserterDisplay ){
    if (!this.props.hideAsserterName) {
      return (
        <td className='asserterDisplay' style={{minWidth: '140px'}}>{ asserterDisplay }</td>
      );
    }
  }  

  renderSeverityHeader(){
    if (!this.props.hideSeverity) {
      return (
        <th className='hideSeverity'>Severity</th>
      );
    }
  }
  renderSeverity(severity ){
    if (!this.props.hideSeverity) {
      return (
        <td className='severity'>{ severity }</td>
      );
    }
  } 
  renderEvidenceHeader(){
    if (!this.props.hideEvidence) {
      return (
        <th className='asserterDisplay'>Evidence</th>
      );
    }
  }
  renderEvidence(evidenceDisplay ){
    if (!this.props.hideEvidence) {
      return (
        <td className='evidenceDisplay'>{ evidenceDisplay }</td>
      );
    }
  } 
  renderIdentifierHeader(){
    if (!this.props.hideIdentifier) {
      return (
        <th className='identifier'>Identifier</th>
      );
    }
  }
  renderIdentifier(identifier ){
    if (!this.props.hideIdentifier) {
      return (
        <td className='identifier'>{ identifier }</td>
      );
    }
  } 
  renderActionIconsHeader(){
    if (!this.props.hideActionIcons) {
      return (
        <th className='actionIcons'>Actions</th>
      );
    }
  }
  renderActionIcons( condition ){
    if (!this.props.hideActionIcons) {

      let iconStyle = {
        marginLeft: '4px', 
        marginRight: '4px', 
        marginTop: '4px', 
        fontSize: '120%'
      }

      return (
        <td className='actionIcons' style={{minWidth: '120px'}}>
          <FaTags style={iconStyle} onClick={this.showSecurityDialog.bind(this, condition)} />
          <GoTrashcan style={iconStyle} onClick={this.removeRecord.bind(this, condition._id)} />  
        </td>
      );
    }
  } 

  rowClick(id){
    Session.set('selectedConditionId', id);
    Session.set('conditionPageTabIndex', 2);
  };
  render () {

  

    let tableRows = [];
    for (var i = 0; i < this.data.conditions.length; i++) {
      var newRow = {
        identifier: '',        
        patientDisplay: '',
        asserterDisplay: '',
        clinicalStatus: '',
        verificationStatus: '',
        severity: '',
        snomedCode: '',
        snomedDisplay: '',
        evidenceDisplay: '',
        barcode: '',
        onsetDateTime: '',
        abatementDateTime: ''
      };

      newRow.identifier = get(this.data.conditions[i], 'identifier[0].value');
      newRow.patientDisplay = get(this.data.conditions[i], 'patient.display');
      newRow.asserterDisplay = get(this.data.conditions[i], 'asserter.display');
      newRow.clinicalStatus = get(this.data.conditions[i], 'clinicalStatus');
      newRow.verificationStatus = get(this.data.conditions[i], 'verificationStatus');
      newRow.snomedCode = get(this.data.conditions[i], 'code.coding[0].code');
      newRow.snomedDisplay = get(this.data.conditions[i], 'code.coding[0].display');
      newRow.evidenceDisplay = get(this.data.conditions[i], 'evidence[0].detail[0].display');
      newRow.barcode = get(this.data.conditions[i], '_id');
      newRow.severity = get(this.data.conditions[i], 'severity.text');
      newRow.onsetDateTime = get(this.data.conditions[i], 'onsetDateTime');
      newRow.abatementDateTime = get(this.data.conditions[i], 'abatementDateTime');

      let rowStyle = {
        cursor: 'pointer'
      }
      if(get(this.data.conditions[i], 'modifierExtension[0]')){
        rowStyle.color = "orange";
      }

      tableRows.push(
        <tr key={i} className="conditionRow" style={rowStyle} onClick={ this.rowClick.bind('this', this.data.conditions[i]._id)} >

          { this.renderToggle() }
          { this.renderActionIcons(this.data.conditions[i]) }
          { this.renderIdentifier(newRow.identifier ) }
          { this.renderPatientName(newRow.patientDisplay ) } 
          { this.renderAsserterName(newRow.asserterDisplay ) } 
          <td className='clinicalStatus'>{ newRow.clinicalStatus }</td>
          <td className='snomedDisplay'>{ newRow.snomedDisplay }</td>
          <td className='snomedCode'>{ newRow.snomedCode }</td>
          <td className='verificationStatus' style={ this.displayOnMobile()} >{ newRow.verificationStatus }</td>
          { this.renderSeverity(newRow.severity) }
          { this.renderEvidence(newRow.evidenceDisplay) }
          { this.renderStartDate(newRow.onsetDateTime) }
          { this.renderEndDate(newRow.abatementDateTime) }
        </tr>
      )
    }



    return(
      <Table id='conditionsTable' hover >
        <thead>
          <tr>
            { this.renderToggleHeader() } 
            { this.renderActionIconsHeader() }
            { this.renderIdentifierHeader() }
            { this.renderPatientNameHeader() }
            { this.renderAsserterNameHeader() }
            <th className='clinicalStatus'>status</th>
            <th className='snomedDisplay'>condition</th>
            <th className='snomedCode'>code</th>
            <th className='verificationStatus' style={ this.displayOnMobile('140px')} >verification</th>
            { this.renderSeverityHeader() }
            { this.renderEvidenceHeader() }
            { this.renderDateHeader('start') }
            { this.renderDateHeader('end') }
          </tr>
        </thead>
        <tbody>
          { tableRows }
        </tbody>
      </Table>
    );
  }
}

ConditionsTable.propTypes = {
  data: PropTypes.array,
  query: PropTypes.object,
  paginationLimit: PropTypes.number,
  hideIdentifier: PropTypes.bool,
  hideToggle: PropTypes.bool,
  hideActionIcons: PropTypes.bool,
  hidePatientName: PropTypes.bool,
  hideAsserterName: PropTypes.bool,
  hideEvidence: PropTypes.bool,
  hideDates: PropTypes.bool,
  hideSeverity: PropTypes.bool,
  hideEnteredInError: PropTypes.bool
};
ReactMixin(ConditionsTable.prototype, ReactMeteorData);
export default ConditionsTable;

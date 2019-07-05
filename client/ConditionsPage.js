import { CardText, CardTitle, Tab, Tabs } from 'material-ui';
import { GlassCard, VerticalCanvas, FullPageCanvas, Glass } from 'meteor/clinical:glass-ui';

import ConditionDetail from './ConditionDetail';
import ConditionsTable from './ConditionsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

import { get } from 'lodash';


Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedConditionId', false);
Session.setDefault('conditionPageTabIndex', 1);

export class ConditionsPage extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        opacity: Session.get('globalOpacity'),
        tab: {
          borderBottom: '1px solid lightgray',
          borderRight: 'none'
        }
      },
      tabIndex: Session.get('conditionPageTabIndex'),
      conditionSearchFilter: Session.get('conditionSearchFilter'),
      currentConditionId: Session.get('selectedConditionId'),
      fhirVersion: Session.get('fhirVersion'),
      selectedCondition: false
    };

    if (Session.get('selectedConditionId')){
      data.selectedCondition = Conditions.findOne({_id: Session.get('selectedConditionId')});
    } else {
      data.selectedCondition = false;
    }

    data.style = Glass.blur(data.style);
    data.style.appbar = Glass.darkroom(data.style.appbar);
    data.style.tab = Glass.darkroom(data.style.tab);

    return data;
  }

  handleTabChange(index){
    Session.set('conditionPageTabIndex', index);
  }

  onNewTab(){
    Session.set('selectedConditionId', false);
  }
  onInsert(conditionId){
    HipaaLogger.logEvent({eventType: "create", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Conditions", recordId: conditionId});
    Session.set('conditionPageTabIndex', 1);
    Session.set('selectedConditionId', false);
  }
  onUpdate(conditionId){
    HipaaLogger.logEvent({eventType: "update", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Conditions", recordId: conditionId});
    Session.set('conditionPageTabIndex', 1);
    Session.set('selectedConditionId', false);
}
  onRemove(conditionId){
    HipaaLogger.logEvent({eventType: "delete", userId: Meteor.userId(), userName: Meteor.user().fullName(), collectionName: "Conditions", recordId: conditionId});
    Session.set('conditionPageTabIndex', 1);
    Session.set('selectedConditionId', false);
  }
  onCancel(){
    Session.set('conditionPageTabIndex', 1);
  }
  render() {
    if(get(Meteor, 'settings.public.logging') === "debug") console.log('In ConditionsPage render');
    return (
      <div id='conditionsPage'>
        <FullPageCanvas>
          <GlassCard height='auto'>
            <CardTitle title='Conditions' />
            <CardText>
              <Tabs id="conditionsPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
               <Tab id='newConditionTab' className='newConditionTab' label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                 <ConditionDetail 
                    id='newCondition'
                    showHints={true}
                    fhirVersion={ this.data.fhirVersion }
                    showDatePicker={true} 
                    condition={ this.data.selectedCondition }
                    conditionId={ this.data.currentConditionId } 
                    onInsert={ this.onInsert }
                    />  
               </Tab>
               <Tab id='conditionListTab' className="conditionListTab" label='Conditions' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                <ConditionsTable 
                  hidePatientName={false}
                  hideAsserterName={false}
                  hideCheckboxes={true}
                  displayEvidence={false}
                  hideIdentifier={true}
                  noDataMessagePadding={100}
                />
               </Tab>
               <Tab id="conditionDetailsTab" className="conditionDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                 <ConditionDetail 
                  id='conditionDetails' 
                  fhirVersion={ this.data.fhirVersion }
                  condition={ this.data.selectedCondition }
                  conditionId={ this.data.currentConditionId } 
                  showDatePicker={true} 
                  showHints={false}
                  onInsert={ this.onInsert }
                  onUpdate={ this.onUpdate }
                  onRemove={ this.onRemove }
                  onCancel={ this.onCancel }
                 />
               </Tab>
             </Tabs>
            </CardText>
          </GlassCard>
        </FullPageCanvas>
      </div>
    );
  }
}

ReactMixin(ConditionsPage.prototype, ReactMeteorData);

export default ConditionsPage;

import { CardText, CardTitle } from 'material-ui/Card';
import {Tab, Tabs} from 'material-ui/Tabs';
import { GlassCard, VerticalCanvas, Glass } from 'meteor/clinical:glass-ui';

import ConditionDetail from './ConditionDetail';
import ConditionsTable from './ConditionsTable';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

import React  from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin  from 'react-mixin';

Session.setDefault('fhirVersion', 'v1.0.2');
Session.setDefault('selectedConditionId', false);

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

  render() {
    if(process.env.NODE_ENV === "test") console.log('In ConditionsPage render');
    return (
      <div id='conditionsPage'>
        <VerticalCanvas>
          <GlassCard height='auto'>
            <CardTitle title='Conditions' />
            <CardText>
              <Tabs id="conditionsPageTabs" default value={this.data.tabIndex} onChange={this.handleTabChange} initialSelectedIndex={1}>
               <Tab className='newConditionTab' label='New' style={this.data.style.tab} onActive={ this.onNewTab } value={0}>
                 <ConditionDetail 
                    id='newCondition'
                    fhirVersion={ this.data.fhirVersion }
                    condition={ this.data.selectedCondition }
                    conditionId={ this.data.currentConditionId } />  
               </Tab>
               <Tab className="conditionListTab" label='Conditions' onActive={this.handleActive} style={this.data.style.tab} value={1}>
                <ConditionsTable 
                  displayPatientName={true}
                  displayAsserterName={true}
                  displayToggle={true}
                  displayEvidence={false}
                  displayDates={true}
                  displayIdentifier={false}
                  noDataMessagePadding={100}
                />
               </Tab>
               <Tab className="conditionDetailsTab" label='Detail' onActive={this.handleActive} style={this.data.style.tab} value={2}>
                 <ConditionDetail 
                 id='conditionDetails' 
                  fhirVersion={ this.data.fhirVersion }
                  condition={ this.data.selectedCondition }
                  conditionId={ this.data.currentConditionId } 
                  showDatePicker={true} 
                 />
               </Tab>
             </Tabs>
            </CardText>
          </GlassCard>
        </VerticalCanvas>
      </div>
    );
  }
}

ReactMixin(ConditionsPage.prototype, ReactMeteorData);

export default ConditionsPage;



import ConditionsPage from './client/ConditionsPage';
import ConditionsTable from './client/ConditionsTable';
import ConditionDetail from './client/ConditionDetail';
import { Condition, Conditions, ConditionSchema } from './lib/Conditions';

var DynamicRoutes = [{
  'name': 'ConditionsPage',
  'path': '/conditions',
  'component': ConditionsPage,
  'requireAuth': true
}];

var SidebarElements = [{
  'primaryText': 'Conditions',
  'to': '/conditions',
  'href': '/conditions'
}];

export { 
  SidebarElements, 
  DynamicRoutes, 

  ConditionsPage,
  ConditionsTable,
  ConditionDetail
};



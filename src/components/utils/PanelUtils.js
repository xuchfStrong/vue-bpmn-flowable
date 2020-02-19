import { is } from "bpmn-js/lib/util/ModelUtil";
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil";
/**
 * 是否应该显示该属性面板
 *
 * @param  {String} property
 * @param  {Object} businessObject
 *
 * @return {Boolean}
 */
export function isShouldShowProperty(property, businessObject) {
  let elementType = []
  if (property === 'formFieldValidation') {
    elementType = ['bpmn:StartEvent', 'bpmn:UserTask']
  }

  if (property === 'exclusive') {
    elementType = ['bpmn:ServiceTask', 'bpmn:UserTask']
  }

  if (property === 'assignee') {
    elementType = ['bpmn:UserTask']
  }

  if (property === 'candidateUser') {
    elementType = ['bpmn:UserTask']
  }

  if (property === 'candidateGroups') {
    elementType = ['bpmn:UserTask']
  }

  if (property === 'priority') {
    elementType = ['bpmn:UserTask']
  }

  if (property === 'category') {
    elementType = ['bpmn:UserTask']
  }

  if (property === 'async') {
    elementType = ['bpmn:UserTask', 'bpmn:ServiceTask']
  }

  if (property === 'isForCompensation') {
    elementType = ['bpmn:UserTask', 'bpmn:ServiceTask']
  }

  if (property === 'skipExpression') {
    elementType = ['bpmn:UserTask', 'bpmn:ServiceTask']
  }

  const serviceLikePopoerty = ['expression', 'class', 'delegateExpression', 'resultVariableName', 'triggerable', 'useLocalScopeForResultVariable']
  if (serviceLikePopoerty.includes(property)) {
    elementType = ['bpmn:ServiceTask']
  }

  if (property === 'multiInstance') {
    elementType = ['bpmn:UserTask', 'bpmn:ServiceTask']
  }

  if (property === 'listener') {
    elementType = ['bpmn:StartEvent', 'bpmn:Activity']
  }

  if (property === 'TaskListener') {
    elementType = ['bpmn:UserTask']
  }
  return isAny(businessObject, elementType)
}


export function isShouldShowByType(type, businessObject) {
  let res = false
  if (type === 'MultiInstanceLoopCharacteristics') {
    res =  is(businessObject.loopCharacteristics, 'bpmn:MultiInstanceLoopCharacteristics')
  }
  return res
}
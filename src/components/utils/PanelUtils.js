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

  if (['exclusive', 'async'].includes(property)) {
    elementType = ['bpmn:Activity', 'bpmn:Gateway']
  }

  if (property === 'dueDate') {
    elementType = ['bpmn:UserTask']
  }

  if (property === 'assignee') {
    elementType = ['bpmn:UserTask']
  }

  if (property === 'candidateUsers') {
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
    elementType = ['bpmn:Activity']
  }

  if (property === 'listener') {
    elementType = ['bpmn:Event', 'bpmn:Activity', 'bpmn:Gateway']
  }

  if (property === 'TaskListener') {
    elementType = ['bpmn:UserTask']
  }

  if (property === 'SequenceFlow') {
    elementType = ['bpmn:SequenceFlow']
  }
  return isAny(businessObject, elementType)
}

/**
 * 根据类型判断是否显示
 * @param {String} type 
 * @param {Object} businessObject 
 */
export function isShouldShowByType(type, businessObject) {
  let res = false
  if (type === 'MultiInstanceLoopCharacteristics') {
    res =  is(businessObject.loopCharacteristics, 'bpmn:MultiInstanceLoopCharacteristics')
  }
  if (type === 'conditionExpression') {
    res =  businessObject.conditionExpression? true:false
  }
  return res
}

export function getExtension(businessObject, type) {
  if (!businessObject.extensionElements) {
    return;
  }
  return businessObject.extensionElements.values.filter(function(e) {
    return e.$instanceOf(type);
  })[0]
}

export function getExtensionAll(businessObject, type) {
  if (!businessObject.extensionElements) {
    return;
  }
  return businessObject.extensionElements.values.filter(function(e) {
    return e.$instanceOf(type);
  })
}

// 生成随机数
export function random(lower, upper) {
  return Math.floor(Math.random() * (upper - lower)) + lower;
}


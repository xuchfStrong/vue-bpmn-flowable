<template>
  <div v-if="show" class="panelWrapper">
    <div class="panelHeader">{{form.id}}</div>
    <el-form class="panelForm" :model="form" label-position="top">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基本" name="general">
          <el-form-item label="Id">
            <el-input size="mini" v-model="form.id" @change="v=>updateAttr('id',v)"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input size="mini" v-model="form.name" @change="v=>updateAttr('name',v)"></el-input>
          </el-form-item>
          <el-form-item label="描述" v-if="form.documentation&&form.documentation[0]">
            <el-input type="textarea" size="mini" v-model="form.documentation[0].text" @change="v=>updateAttr('documentation',form.documentation)"></el-input>
          </el-form-item>
          
          <template v-if="['bpmn:StartEvent'].includes(businessObject.$type)">
            <template v-if="startEventType=='bpmn:TimerEventDefinition'">
              <el-form-item label="Timer Definition Type">
                <el-select size="mini" style="width:100%" v-model="timeDefinitionType" placeholder="请选择" @change="updateTime">
                  <el-option v-for="item in timeDefinitionTypeList" :key="item"
                    :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <template v-if="timeDefinitionType">
                <el-form-item label="Timer Definition" required>
                  <el-date-picker size="mini" style="width:100%" value-format="yyyy-MM-dd HH:mm:ss" v-if="timeDefinitionType=='Date'" v-model="FormalExpression.body" @change="updateProperties"
                    type="datetime" placeholder="请选择">
                  </el-date-picker>
                  <el-input v-else size="mini" v-model="FormalExpression.body" @change="updateProperties"></el-input>
                </el-form-item>
                <el-form-item v-if="timeDefinitionType=='Cycle'" label="endDate">
                  <el-date-picker style="width:100%" size="mini" @change="updateProperties" value-format="yyyy-MM-dd HH:mm:ss" v-model="FormalExpression.endDate"
                    type="datetime" placeholder="请选择">
                  </el-date-picker>
                </el-form-item>
              </template>
            </template>
          </template>

          <el-checkbox v-if="shouldShowProperty('formFieldValidation')" v-model="form.formFieldValidation" class="item-wrap" @change="v=>updateAttr('formFieldValidation',v)">是否验证表单</el-checkbox>
          <el-checkbox v-if="shouldShowProperty('exclusive')" v-model="form.exclusive" class="item-wrap" @change="v=>updateAttr('exclusive',v)">是否独占任务</el-checkbox>
          <el-checkbox v-if="shouldShowProperty('async')" v-model="form.async" class="item-wrap" @change="v=>updateAttr('async',v)">是否异步</el-checkbox>
          <el-checkbox v-if="shouldShowProperty('isForCompensation')" v-model="form.isForCompensation" class="item-wrap" @change="v=>updateAttr('isForCompensation',v)">是否为补偿</el-checkbox>
          <el-checkbox v-if="shouldShowProperty('useLocalScopeForResultVariable')" v-model="form.useLocalScopeForResultVariable" class="item-wrap" @change="v=>updateAttr('useLocalScopeForResultVariable',v)">对结果变量使用局部作用域</el-checkbox>
          <el-checkbox v-if="shouldShowProperty('triggerable')" v-model="form.triggerable" class="item-wrap" @change="v=>updateAttr('triggerable',v)">将服务设置为可触发的</el-checkbox>

          <el-form-item v-if="shouldShowProperty('dueDate')" label="到期时间">
            <el-input size="mini" v-model="form.dueDate" @change="v=>updateAttr('dueDate',v)"></el-input>
          </el-form-item>
          <el-form-item v-if="shouldShowProperty('assignee')" label="分配用户">
            <el-input size="mini" v-model="form.assignee" @change="v=>updateAttr('assignee',v)"></el-input>
          </el-form-item>
          <el-checkbox v-if="showIniatorCanComplete" v-model="initiatorCanComplete.checked" class="item-wrap" @change="initiatorCanCompleteChange">发起人能否结束流程</el-checkbox>
          <el-form-item v-if="shouldShowProperty('candidateUser')" label="候选人">
            <el-input size="mini" v-model="form.candidateUser" @change="v=>updateAttr('candidateUser',v)"></el-input>
          </el-form-item>
          <el-form-item v-if="shouldShowProperty('candidateGroups')" label="候选群">
            <el-input size="mini" v-model="form.candidateGroups" @change="v=>updateAttr('candidateGroups',v)"></el-input>
          </el-form-item>
          <el-form-item v-if="shouldShowProperty('priority')" label="优先级">
            <el-input size="mini" type="number" v-model="form.priority" @change="v=>updateAttr('priority',v)" min="1" max="100"></el-input>
          </el-form-item>
          <el-form-item v-if="shouldShowProperty('category')" label="分类">
            <el-input size="mini" v-model="form.category" @change="v=>updateAttr('category',v)"></el-input>
          </el-form-item>
          <el-form-item v-if="shouldShowProperty('expression')" label="表达式">
            <el-input size="mini" v-model="form.expression" @change="v=>updateAttr('expression',v)"></el-input>
          </el-form-item>
          <el-form-item v-if="shouldShowProperty('skipExpression')" label="跳过表达式">
            <el-input size="mini" v-model="form.skipExpression" @change="v=>updateAttr('skipExpression',v)"></el-input>
          </el-form-item>
          <el-form-item v-if="shouldShowProperty('delegateExpression')" label="代理表达式">
            <el-input size="mini" v-model="form.delegateExpression" @change="v=>updateAttr('delegateExpression',v)"></el-input>
          </el-form-item>
          <el-form-item v-if="shouldShowProperty('class')" label="Java Class">
            <el-input size="mini" v-model="form.class" @change="v=>updateAttr('class',v)"></el-input>
          </el-form-item>
          <el-form-item v-if="shouldShowProperty('resultVariableName')" label="结果变量名">
            <el-input size="mini" v-model="form.resultVariableName" @change="v=>updateAttr('resultVariableName',v)"></el-input>
          </el-form-item>
          <!-- 多实例相关属性 -->
          <template v-if="showProperty.MultiInstanceLoopCharacteristics">
            <el-form-item  label="多实例类型">
              <el-select size="mini" style="width:100%" v-model="multiInstance.type" placeholder="请选择" @change="updateMultiInstance">
                <el-option v-for="item in multiInstance.typeList" :key="item.value"
                  :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="集合(多实例)">
              <el-input size="mini" v-model="form.collection" @change="v=>updateMultiInstanceAttr('collection',v)"></el-input>
            </el-form-item>
            <el-form-item label="元素变量(多实例)">
              <el-input size="mini" v-model="form.elementVariable" @change="v=>updateMultiInstanceAttr('elementVariable',v)"></el-input>
            </el-form-item>
            <el-form-item label="基数(多实例)">
              <el-input size="mini" v-model="form.loopCardinality" @change="v=>updateMultiInstanceAttr('loopCardinality',v)"></el-input>
            </el-form-item>
            <el-form-item label="完成条件(多实例)">
              <el-input size="mini" v-model="form.completionCondition" @change="v=>updateMultiInstanceAttr('completionCondition',v)"></el-input>
            </el-form-item>
          </template>

          <!-- connection参数 -->
          <template v-if="['bpmn:SequenceFlow'].includes(businessObject.$type)">
            <el-form-item label="Condition Type">
              {{conditionType}}
              <el-select size="mini" style="width:100%" v-model="conditionType" placeholder="请选择" @change="updateConditionType">
                <el-option v-for="item in conditionTypeList" :key="item"
                  :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="conditionType=='Expression'" label="Expression">
              <!-- <el-input size="mini" v-model="form.conditionExpression.body" @change="v=>updateAttr('conditionExpression',form.conditionExpression)"></el-input> -->
              <el-select size="mini" style="width:100%" v-model="form.conditionExpression.body" placeholder="请选择" @change="updateConditionType">
                <el-option v-for="item in conditionExpressionList" :key="item.id"
                  :label="item.id" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-tab-pane>
        <!-- 监听器面板 -->
        <el-tab-pane v-if="shouldShowProperty('listener')" label="监听器" name="listener">
          <el-form-item v-if="shouldShowProperty('TaskListener')" label="任务监听器">
            <el-button :disabled="!currentRowTaskListener" class="tableBtn" type="text" @click="delTaskListener"><i class="el-icon-remove"></i></el-button>
            <el-button class="tableBtn" type="text" @click="addTaskListener"><i class="el-icon-circle-plus"></i></el-button>
            <el-table class="fpTable" border :show-header="false" :data="taskListener" style="width: 100%" highlight-current-row @row-click="handleCurrentChangeTaskListener">
              <el-table-column prop="id"></el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item label="执行监听器">
            <el-button :disabled="!currentRowExecutionListener" class="tableBtn" type="text" @click="delExecutionListener"><i class="el-icon-remove"></i></el-button>
            <el-button class="tableBtn" type="text" @click="addExecutionListener"><i class="el-icon-circle-plus"></i></el-button>
            <el-table class="fpTable" border :show-header="false" :data="executionListener" style="width: 100%" highlight-current-row @row-click="handleCurrentChangeExecutionListener">
              <el-table-column prop="id"></el-table-column>
            </el-table>
          </el-form-item>
          <template v-if="currentRowTaskListener">
            <div class="title">任务监听器属性</div>
            <el-form-item label="id">
              <el-input size="mini" v-model="currentRowTaskListener.id" @change="updateProperties"></el-input>
            </el-form-item>
            <el-form-item label="监听事件">
              <el-select size="mini" style="width:100%" v-model="currentRowTaskListener.event" placeholder="请选择" @change="updateProperties">
                <el-option v-for="item in taskListenerEvent" :key="item"
                  :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型">
              <el-select size="mini" style="width:100%" v-model="listenerTypeSelected" placeholder="请选择" @change="changeListenerType">
                <el-option v-for="item in listenerTypeList" :key="item.value"
                  :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="showListenerTypeClass" label="Java Class">
              <el-input size="mini" v-model="currentRowTaskListener.class" @change="updateProperties"></el-input>
            </el-form-item>
            <el-form-item v-if="showListenerTypeExpression" label="表达式">
              <el-input size="mini" v-model="currentRowTaskListener.expression" @change="updateProperties"></el-input>
            </el-form-item>
            <el-form-item v-if="showListenerTypeDelegateExpression" label="代理表达式">
              <el-input size="mini" v-model="currentRowTaskListener.delegateExpression" @change="updateProperties"></el-input>
            </el-form-item>
          </template>
          <!-- 执行监听器属性 -->
          <template v-if="currentRowExecutionListener">
            <div class="title">执行监听器属性</div>
            <el-form-item label="id">
              <el-input size="mini" v-model="currentRowExecutionListener.id" @change="updateProperties"></el-input>
            </el-form-item>
            <el-form-item label="监听事件">
              <el-select size="mini" style="width:100%" v-model="currentRowExecutionListener.event" placeholder="请选择" @change="updateProperties">
                <el-option v-for="item in executionListenerEvent" :key="item"
                  :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类型">
              <el-select size="mini" style="width:100%" v-model="listenerTypeSelected" placeholder="请选择" @change="changeListenerType">
                <el-option v-for="item in listenerTypeList" :key="item.value"
                  :label="item.name" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="showListenerTypeClass" label="Java Class">
              <el-input size="mini" v-model="currentRowExecutionListener.class" @change="updateProperties"></el-input>
            </el-form-item>
            <el-form-item v-if="showListenerTypeExpression" label="表达式">
              <el-input size="mini" v-model="currentRowExecutionListener.expression" @change="updateProperties"></el-input>
            </el-form-item>
            <el-form-item v-if="showListenerTypeDelegateExpression" label="代理表达式">
              <el-input size="mini" v-model="currentRowExecutionListener.delegateExpression" @change="updateProperties"></el-input>
            </el-form-item>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
import { isShouldShowProperty, isShouldShowByType, getExtension, getExtensionAll } from './utils/PanelUtils'
import { is } from "bpmn-js/lib/util/ModelUtil"
import { isAny } from "bpmn-js/lib/features/modeling/util/ModelingUtil"
import { showProperty } from './utils/PanelData'
export default {
  props:{
    element:{},
    businessObject:{
      default:function(){
        return {}
      },
    },
    modeling:{},
    moddle:{},
    event:{},
  },
  data(){
    return {
      show:false,
      showProperty: showProperty,
      activeName:'general',
      form:{
        documentation:[{}],
      },
      taskListener: [],
      executionListener: [],
      currentRowTaskListener:'',
      currentRowExecutionListener: '',
      taskListenerEvent: ['create', 'assignment', 'complete', 'delete'],
      executionListenerEvent: ['start', 'end'],
      listenerTypeList: [{name: 'Java class', value: 'class'}, {name: '表达式', value: 'expression'}, {name: '代理表达式', value: 'delegateExpression'}],
      listenerTypeSelected: '',
      extensionElements:'',
      extensionElementsType: ["bpmn:StartEvent", "bpmn:Activity"],
      eventTypeHandle:{
        'bpmn:UserTask':{
          handle:'userTaskHandle'
        },
        'bpmn:StartEvent':{
          handle:'startEventHandle'
        },
        'bpmn:TimerEventDefinition':{
          handle:'timerEventHandle'
        },
        'bpmn:MessageEventDefinition':{
          handle:'ms'
        }
      },
      timeDefinitionTypeList:[
        'Date','Duration','Cycle'
      ],
      timeDefinitionType:'',
      startEventType:'',
      FormalExpression:'',
      conditionTypeList:['Expression',''],
      conditionType:'',
      conditionExpressionList: [
        {id: 1, value: '${processTransferType=="1"}'},
        {id: 2, value: '${processTransferType=="2"}'},
        {id: 3, value: '${processTransferType=="3"}'}
      ],
      // isInitiatorCanComplete: false, // 发起人是否能结束
      // initiatorCanCompletes: '', // <modeler:initiator-can-complete> 属性
      initiatorCanComplete: {
        value: '',
        checked: false
      },
      multiInstance: {
        type: '',
        typeList: [{name: '并行多实例', value: 'parallel'}, {name: '顺序多实例', value: 'sequential'}],
        loopCardinality: '',
        completionCondition: ''
      }
    }
  },
  computed: {
    showListenerTypeClass() {
      return this.listenerTypeSelected === 'class'
    },
    showListenerTypeExpression() {
      return this.listenerTypeSelected === 'expression'
    },
    showListenerTypeDelegateExpression() {
      return this.listenerTypeSelected === 'delegateExpression'
    },
    showIniatorCanComplete() {
      return this.form.assignee
    }
  },
  watch: {
    showIniatorCanComplete(newVal, oldVal) {
      if (newVal && !this.initiatorCanComplete.value) {
        this.addInitiatorCanComplete()
      }
      if (!newVal) {
        this.delInitiatorCanComplete()
      }
    }
  },
  mounted(){
  },
  methods:{
    // 初始化
    init(){
      this.show = true
      this.activeName='general'
      if(isAny(this.businessObject, this.extensionElementsType)){
        this.extensionElements= this.businessObject.extensionElements || this.moddle.create('bpmn:ExtensionElements',{ values: [] })
      }
      this.handle(this.businessObject.$type)
      this.defaultHandle()
      this.currentRowTaskListener = ''
      this.currentRowExecutionListener = ''
      this.form = this.businessObject
    },
    // 默认处理
    defaultHandle(){
      let documentation = this.businessObject.documentation&&this.businessObject.documentation.length?this.businessObject.documentation:[this.moddle.create('bpmn:Documentation',{text:""})]
      let obj = {documentation}
      this.modeling.updateProperties(this.element,obj)
      
      if(isAny(this.businessObject, this.extensionElementsType)){
        this.extensionElementsHandle()
      }

      if(['bpmn:SequenceFlow'].includes(this.businessObject.$type)){
        this.conditionType = this.businessObject.conditionExpression?'Expression':''
      }
      this.multiInstance.type = ''
      if (this.businessObject.loopCharacteristics) {
        if (this.businessObject.loopCharacteristics.isSequential) {
          this.multiInstance.type = 'sequential'
        } else {
          this.multiInstance.type = 'parallel'
        }
      }
    },
    // 扩展元素处理
    extensionElementsHandle(){
      // this.taskListener = this.extensionElements.values.filter((item) => {
      //   return is(item, 'flowable:TaskListener')
      // })
      this.taskListener = getExtensionAll(this.businessObject, 'flowable:TaskListener')
      // this.executionListener = this.extensionElements.values.filter((item) => {
      //   return is(item, 'flowable:ExecutionListener')
      // })
      this.executionListener = getExtensionAll(this.businessObject, 'flowable:ExecutionListener')
      // this.initiatorCanComplete.value = this.extensionElements.values.filter((item) => {
      //   return is(item, 'modeler:initiator-can-complete')
      // })[0]
      this.initiatorCanComplete.value = getExtension(this.businessObject, 'modeler:initiator-can-complete')
      if (this.initiatorCanComplete.value) {
        this.initiatorCanComplete.checked = this.extensionElements.values.filter((item) => {
          return is(item, 'modeler:initiator-can-complete')
        })[0].body === 'true'
      }
    },
    // 改变节点类型处理
    handleReplace() {
      console.log('handleReplace', this.event)
      // 从其他的startEvent修改回标准startEvent的时候设置this.FormalExpression
      try {
        if (this.event.context.newData.$type === 'bpmn:StartEvent' && !this.event.context.newData.eventDefinitions) {
          this.setDefalutProperty('bpmn:StartEvent')
        }
      } catch(error) {
        console.log('replace error', error)
      }
      this.init()
    },

    /**
     * 改变属性后控制属性面板是否显示
     * 因为很多操作都会涉及到这个event，避免太多重复动作，只有当在图形上切换后属性面板需要变化的才在这里处理
     */
    showPostUpdateProperties() {
      // console.log('showPostUpdateProperties', this.event)
      for (let i in this.showProperty) {
        this.showProperty[i] = isShouldShowByType(i, this.businessObject)
      }
    },
    // 是否应该显示该属性面板
    shouldShowProperty(property) {
      return isShouldShowProperty(property, this.businessObject)
    },
    // 设置默认属性
    setDefalutProperty(elementType) {
      if (elementType === 'bpmn:StartEvent') {
        this.FormalExpression = ''
      }
    },
    //开始事件处理
    startEventHandle(type){
      if(this.businessObject.eventDefinitions&&this.businessObject.eventDefinitions[0]){
        this.satrtEventDefinitionHandle()
      } else {
        this.startEventType = 'startEventType'
      }
      console.log(type)
    },
    //用户事件处理
    userTaskHandle(type){
      console.log(type)
    },
    // 含有事件的开始事件处理
    satrtEventDefinitionHandle(){
      //bpmn:MessageEventDefinition
      //bpmn:TimerEventDefinition
      //bpmn:SignalEventDefinition
      //bpmn:ConditionalEventDefinition
      this.startEventType = this.businessObject.eventDefinitions[0].$type
      this.handle(this.startEventType)
    },
    // 时间类型事件处理
    timerEventHandle(type){
      if(this.businessObject.eventDefinitions[0].timeDate){
        this.timeDefinitionType = 'Date'
      } else if(this.businessObject.eventDefinitions[0].timeDuration){
        this.timeDefinitionType = 'Duration'
      } else if(this.businessObject.eventDefinitions[0].timeCycle){
        this.timeDefinitionType = 'Cycle'
      }
      if(this.timeDefinitionType){
        console.log('eventDefinitions[0]', this.businessObject.eventDefinitions[0])
        console.log('time${this.timeDefinitionType}',`time${this.timeDefinitionType}` )
        this.FormalExpression = this.businessObject.eventDefinitions[0][`time${this.timeDefinitionType}`]
      }
    },
    //时间事件定义类型修改
    updateTime(v){
      this.businessObject.eventDefinitions[0] = this.moddle.create('bpmn:TimerEventDefinition')
      let name = `time${v}`
      this.FormalExpression = this.moddle.create('bpmn:FormalExpression',{body:''})
      // var d = new Date();
      // console.log(d.toISOString())
      if(name==='timeCycle'){
        this.$set(this.FormalExpression,'endDate','')
      }
      this.businessObject.eventDefinitions[0][name]= this.FormalExpression
      this.updateProperties()
    },
    handle(type){
      try{
        this[this.eventTypeHandle[type].handle](type)
      } catch(e){
        console.log('暂无此类型的事件处理')
      }
    },
    // 箭头类型修改
    updateConditionType(v){
      if(!v){
        this.businessObject.conditionExpression&&delete this.businessObject.conditionExpression
      } else if(v=='Expression'){
        this.businessObject.conditionExpression = this.moddle.create('bpmn:FormalExpression',{body:''})
      }
      this.updateProperties()
    },
    // Activity多实例类型修改
    updateMultiInstance(v){
      if(!v){
        this.businessObject.loopCharacteristics&&delete this.businessObject.loopCharacteristics
      } else if(v=='sequential'){
        this.businessObject.loopCharacteristics = this.moddle.create('bpmn:MultiInstanceLoopCharacteristics',{isSequential: true})
      } else if(v=='parallel') {
        this.businessObject.loopCharacteristics = this.moddle.create('bpmn:MultiInstanceLoopCharacteristics',{isSequential: false})
      }
      this.updateProperties()
    },
    // 修改多实例属性
    updateMultiInstanceAttr(type,v){
      const subItem = ['loopCardinality', 'completionCondition']
      if (!v) {
        this.businessObject.loopCharacteristics[type]&&delete this.businessObject.loopCharacteristics[type]
      } else {
        if (subItem.includes(type)) {
          this.businessObject.loopCharacteristics[type] = this.moddle.create('bpmn:FormalExpression',{body:v})
        } else {
           this.businessObject.loopCharacteristics[type]=v
        }
      }
      this.updateProperties()
    },
    //修改表单
    updateAttr(type,v){
      this.businessObject[type]=v
      this.updateProperties()
    },
    // 删除任务监听器
    delTaskListener(){
      let i = this.extensionElements.values.findIndex(e=>e.id==this.currentRowTaskListener.id)
      this.extensionElements.values.splice(i,1)
      this.currentRowTaskListener = ''
      this.updateProperties()
    },
    // 删除执行监听器
    delExecutionListener(){
      let i = this.extensionElements.values.findIndex(e=>e.id==this.currentRowExecutionListener.id)
      this.extensionElements.values.splice(i,1)
      this.currentRowExecutionListener = ''
      this.updateProperties()
    },
    // 新增任务监听器
    addTaskListener() {
      //flowable:TaskListener里的TaskListener要与flowable.json保持
      let taskListener = this.moddle.create('flowable:TaskListener',{id: "TaskListener_"+this.random(100000,999999)});
      this.extensionElements.get('values').push(taskListener);
      this.updateProperties()
      console.log(this.taskListener,this.extensionElements)
    },
    // 新增执行监听器
    addExecutionListener() {
      //flowable:ExecutionListener里的ExecutionListener要与flowable.json保持
      let executionListener = this.moddle.create('flowable:ExecutionListener',{id: "ExecutionListener_"+this.random(100000,999999)});
      this.extensionElements.get('values').push(executionListener);
      this.updateProperties()
      console.log(this.executionListener,this.extensionElements)
    },
    // 选中TaskListener
    handleCurrentChangeTaskListener(row){
      this.currentRowExecutionListener = ''
      this.currentRowTaskListener  = row
      this.updateListenerTypeSelected()
    },
    // 选中ExecutionListener
    handleCurrentChangeExecutionListener(row){
      this.currentRowTaskListener = ''
      this.currentRowExecutionListener  = row
      this.updateListenerTypeSelected()
    },
    // 设置选中监听类型
    updateListenerTypeSelected() {
      if (this.currentRowTaskListener.class || this.currentRowExecutionListener.class){
        this.listenerTypeSelected = 'class'
      } else if (this.currentRowTaskListener.expression || this.currentRowExecutionListener.expression){
        this.listenerTypeSelected = 'expression'
      } else if (this.currentRowTaskListener.delegateExpression || this.currentRowExecutionListener.delegateExpression){
        this.listenerTypeSelected = 'delegateExpression'
      } else {
        this.listenerTypeSelected = ''
      }
    },
    // 修改监听类型
    changeListenerType() {
      if (this.currentRowTaskListener) {
        if (!this.showListenerTypeClass) delete this.currentRowTaskListener.class
        if (!this.showListenerTypeExpression) delete this.currentRowTaskListener.expression
        if (!this.showListenerTypeDelegateExpression) delete this.currentRowTaskListener.delegateExpression
      } else if (this.currentRowExecutionListener) {
        if (!this.showListenerTypeClass) delete this.currentRowExecutionListener.class
        if (!this.showListenerTypeExpression) delete this.currentRowExecutionListener.expression
        if (!this.showListenerTypeDelegateExpression) delete this.currentRowExecutionListener.delegateExpression
      }  
    },
    // 删除flowable的modeler扩展项
    delInitiatorCanComplete(){
      let i = this.extensionElements.values.findIndex(e=>e.id.split("_")[0]=='initiatorCanComplete')
      this.extensionElements.values.splice(i,1)
      this.updateProperties()
    },
    // 新增flowable的modeler扩展项
    addInitiatorCanComplete() {
      let initiatorCanCompleteObj = this.moddle.create('modeler:initiator-can-complete',{id: "initiatorCanComplete_"+this.random(100000,999999), body: "false"});
      this.extensionElements.get('values').push(initiatorCanCompleteObj);
      this.updateProperties()
      console.log(this.initiatorCanComplete.value,this.extensionElements)
    },
    // 更新flowable的modeler扩展项
    updateInitiatorCanComplete(v) {
      let i = this.extensionElements.values.findIndex(e=>e.id.split("_")[0]=='initiatorCanComplete')
      if (v) {
        this.extensionElements.values[i].body = 'true'
      } else {
        this.extensionElements.values[i].body = 'false'
      }
      this.updateProperties()
    },
    // 发起人是否能结束流程
    initiatorCanCompleteChange(v) {
      if (v) {
        this.updateInitiatorCanComplete(true)
      } else {
        this.updateInitiatorCanComplete(false)
      }
    },
    // 修改businessObject
    updateProperties(){
      let obj = {}
      obj.documentation = this.businessObject.documentation&&this.businessObject.documentation.length?this.businessObject.documentation:[this.moddle.create('bpmn:Documentation',{text:""})]
      if(isAny(this.businessObject, this.extensionElementsType)){
        obj.extensionElements=this.extensionElements
      }
      if(['bpmn:TimerEventDefinition'].includes(this.businessObject.$type)){
        obj.eventDefinitions=this.businessObject.eventDefinitions
      }
      if(['bpmn:SequenceFlow'].includes(this.businessObject.$type)){
        obj.conditionExpression=this.businessObject.conditionExpression
      }
      if(this.shouldShowProperty('multiInstance')){
        obj.loopCharacteristics=this.businessObject.loopCharacteristics
      }
      this.defaultHandle()
      this.modeling.updateProperties(this.element, obj);
      console.log('businessObjectInPanel', this.businessObject)
    },
    // 获取随机数
    random(lower, upper) {
      return Math.floor(Math.random() * (upper - lower)) + lower;
    }
  },
}
</script>

<style lang="scss" scoped>
.panelWrapper{
  position: fixed;
  right:0;
  top:0;
  border-left:1px solid #ccc;
  height:100%;
  overflow: auto;
  background-color: #f8f8f8;
  width:260px;
  .panelHeader{
    padding: 15px;
    padding-bottom: 5px;
    font-size: 120%;
    font-weight: bolder;
  }
  .panelForm{
    padding:15px;
  }
}
.tableBtn{
  padding:0;
  font-size: 18px;
}
.title {
  line-height: 32px;
  font-size: 16px;
}
.item-wrap {
  padding-bottom: 10px;
  display: block;
}
</style>
<style lang="scss">
.panelForm{
  .el-form-item {
    margin-bottom: 10px;
  }
  .el-form-item__label{
    line-height: 20px;
    padding-bottom:0;
  }
}
.fpTable{
  height:80px;
  overflow-y:auto;
  td, th{
    padding:0;
    cursor: pointer;
  }
}
</style>
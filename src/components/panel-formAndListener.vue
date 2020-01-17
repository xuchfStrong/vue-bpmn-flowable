<template>
  <div v-if="show" class="panelWrapper">
    <div class="panelHeader">{{form.id}}</div>
    <el-form class="panelForm" :model="form" label-position="top">
      <el-tabs v-model="activeName">
        <el-tab-pane label="普通" name="general">
          <el-form-item label="Id">
            <el-input size="mini" v-model="form.id" @change="v=>updateAttr('id',v)"></el-input>
          </el-form-item>
          <el-form-item label="名称">
            <el-input size="mini" v-model="form.name" @change="v=>updateAttr('name',v)"></el-input>
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
            <el-form-item label="初始化用户变量">
              <el-input size="mini" v-model="form.initiator" @change="v=>updateAttr('initiator',v)"></el-input>
            </el-form-item>
          </template>
          <template v-if="['bpmn:UserTask'].includes(businessObject.$type)">
            <el-form-item label="候选群">
              <el-input size="mini" v-model="form.candidateGroups" @change="v=>updateAttr('candidateGroups',v)"></el-input>
            </el-form-item>
            <el-form-item label="候选人">
              <el-input size="mini" v-model="form.candidateUser" @change="v=>updateAttr('candidateUser',v)"></el-input>
            </el-form-item>
            <el-form-item label="优先级别">
              <el-input size="mini" type="number" v-model="form.priority" @change="v=>updateAttr('priority',v)" min="1" max="100"></el-input>
            </el-form-item>
            <el-form-item label="目录">
              <el-input size="mini" type="number" v-model="form.category" @change="v=>updateAttr('category',v)" min="1" max="100"></el-input>
            </el-form-item>
            <el-form-item label="是否验证">
              <el-input size="mini" type="string" v-model="form.formFieldValidation" @change="v=>updateAttr('formFieldValidation',v)" min="1" max="100"></el-input>
            </el-form-item>
          </template>
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
              <el-input size="mini" v-model="form.conditionExpression.body" @change="v=>updateAttr('conditionExpression',form.conditionExpression)"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="描述" v-if="form.documentation&&form.documentation[0]">
            <el-input type="textarea" size="mini" v-model="form.documentation[0].text" @change="v=>updateAttr('documentation',form.documentation)"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane v-if="formType.includes(businessObject.$type)" label="表单" name="form">
          <el-form-item label="表单Id">
            <el-input size="mini" v-model="form.formKey" @change="v=>updateAttr('formKey',v)"></el-input>
          </el-form-item>
          <el-form-item label="表单字段">
            <el-button :disabled="!currentRow" class="tableBtn" type="text" @click="delFP"><i class="el-icon-remove"></i></el-button>
            <el-button class="tableBtn" type="text" @click="addFP"><i class="el-icon-circle-plus"></i></el-button>
            <el-table class="fpTable" border :show-header="false" :data="formProperty" style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
              <el-table-column prop="id"></el-table-column>
            </el-table>
          </el-form-item>
          <template v-if="currentRow">
            <div class="title">字段属性</div>
            <el-form-item label="id">
              <el-input size="mini" v-model="currentRow.id" @change="updateProperties"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select size="mini" style="width:100%" v-model="currentRow.type" placeholder="请选择" @change="updateProperties">
                <el-option v-for="item in formPropertyTypeList" :key="item"
                  :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="名称">
              <el-input size="mini" v-model="currentRow.name" @change="updateProperties"></el-input>
            </el-form-item>
            <el-form-item label="默认值">
              <el-input size="mini" v-model="currentRow.default" @change="updateProperties"></el-input>
            </el-form-item>
          </template>
        </el-tab-pane>
        <el-tab-pane v-if="listenerType.includes(businessObject.$type)" label="监听器" name="listener">
          <el-form-item label="监听器">
            <el-button :disabled="!currentRow" class="tableBtn" type="text" @click="delTaskListener"><i class="el-icon-remove"></i></el-button>
            <el-button class="tableBtn" type="text" @click="addTaskListener"><i class="el-icon-circle-plus"></i></el-button>
            <el-table class="fpTable" border :show-header="false" :data="taskListener" style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
              <el-table-column prop="id"></el-table-column>
            </el-table>
          </el-form-item>
          <template v-if="currentRow">
            <div class="title">监听器属性</div>
            <el-form-item label="id">
              <el-input size="mini" v-model="currentRow.id" @change="updateProperties"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select size="mini" style="width:100%" v-model="currentRow.event" placeholder="请选择" @change="updateProperties">
                <el-option v-for="item in taskListenerEvent" :key="item"
                  :label="item" :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="类名">
              <el-input size="mini" v-model="currentRow.class" @change="updateProperties"></el-input>
            </el-form-item>
          </template>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
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
  },
  data(){
    return {
      show:false,
      activeName:'general',
      form:{
        documentation:[{}],
      },
      listener: {

      },
      formProperty:[],
      taskListener: [],
      currentRow :'',
      extensionElements:'',
      formPropertyTypeList:['long','string','boolean','date','enum','custom type'],
      taskListenerEvent: ['create', 'start', 'end'],
      formType:["bpmn:StartEvent","bpmn:UserTask"],
      listenerType: ["bpmn:UserTask"],
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
    }
  },
  methods:{
    // 初始化
    init(){
      this.show = true
      this.activeName='general'
      if(this.formType.includes(this.businessObject.$type)){
        this.nomalHandle()
        this.handle(this.businessObject.$type)
        if(this.businessObject.eventDefinitions&&this.businessObject.eventDefinitions[0]){
          this.satrtEventDefinitionHandle()
        } else {
          this.startEventType = 'startEventType'
        }
      }
      this.defaultHandle()
      this.currentRow = ''
      this.form = this.businessObject
    },
    // 默认处理
    defaultHandle(){
      let documentation = this.businessObject.documentation&&this.businessObject.documentation.length?this.businessObject.documentation:[this.moddle.create('bpmn:Documentation',{text:""})]
      let obj = {documentation}
      if(this.formType.includes(this.businessObject.$type)){
        obj.extensionElements=this.extensionElements
      }
      this.modeling.updateProperties(this.element,obj);
      if(this.formType.includes(this.businessObject.$type)){
        // this.formProperty = this.extensionElements.values
        this.formProperty = this.extensionElements.values.filter((item) => {
          return item.$type === 'flowable:FormProperty'
        })
      }
      if(this.listenerType.includes(this.businessObject.$type)){
        this.taskListener = this.extensionElements.values.filter((item) => {
          return item.$type === 'flowable:TaskListener'
        })
      }
      if(['bpmn:SequenceFlow'].includes(this.businessObject.$type)){
        this.conditionType = this.businessObject.conditionExpression?'Expression':''
      }
    },
    // 开始、用户事件通用处理
    nomalHandle(){
      this.extensionElements= this.businessObject.extensionElements || this.moddle.create('bpmn:ExtensionElements',{ values: [] })
      this.modeling.updateProperties(this.element, {
        extensionElements: this.extensionElements
      });
    },
    //开始事件处理
    startEventHandle(type){
      console.log(type)
    },
    //用户事件处理
    userTaskHandle(type){
      this.businessObject.exclusive=true
      console.log(type)
    },
    // 含有事件的开始事件处理
    satrtEventDefinitionHandle(){
      // bpmn:MessageEventDefinition
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
        this.FormalExpression = this.businessObject.eventDefinitions[0][`time${this.timeDefinitionType}`]
      }
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
    //修改表单
    updateAttr(type,v){
      this.businessObject[type]=v
      this.updateProperties()
    },
    // 删除表单字段
    delFP(){
      let i = this.extensionElements.values.findIndex(e=>e.id==this.currentRow.id)
      this.extensionElements.values.splice(i,1)
      this.updateProperties()
    },
    // 新增表单字段
    addFP(){
      //flowable:FormProperty里的FormProperty要与flowable.json保持
      let formProperty = this.moddle.create('flowable:FormProperty',{id: "FormProperty_"+this.random(100000,999999)});
      this.extensionElements.get('values').push(formProperty);
      this.updateProperties()
      console.log(this.formProperty,this.extensionElements)
    },
    // 删除监听器
    delTaskListener(){
      let i = this.extensionElements.values.findIndex(e=>e.id==this.currentRow.id)
      this.extensionElements.values.splice(i,1)
      this.updateProperties()
    },
    // 新增监听器
    addTaskListener() {
      //flowable:TaskListener里的TaskListener要与flowable.json保持
      let taskListener = this.moddle.create('flowable:TaskListener',{id: "TaskListener_"+this.random(100000,999999)});
      this.extensionElements.get('values').push(taskListener);
      this.updateProperties()
      console.log(this.taskListener,this.extensionElements)
    },
    // 修改businessObject
    updateProperties(){
      let obj = {}
      if(this.formType.includes(this.businessObject.$type)){
        obj.extensionElements=this.extensionElements
      }
      if(['bpmn:TimerEventDefinition'].includes(this.businessObject.$type)){
        obj.eventDefinitions=this.businessObject.eventDefinitions
      }
      if(['bpmn:SequenceFlow'].includes(this.businessObject.$type)){
        obj.conditionExpression=this.businessObject.conditionExpression
      } else {
        obj.documentation=this.businessObject.documentation
      }
      this.defaultHandle()
      this.modeling.updateProperties(this.element, obj);
      console.log('businessObjectInPanel', this.businessObject)
    },
    // 获取随机数
    random(lower, upper) {
      return Math.floor(Math.random() * (upper - lower)) + lower;
    },
    // 选中表单字段行
    handleCurrentChange(row){
      this.currentRow  = row
    },
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
  height:150px;
  overflow-y:auto;
  td, th{
    padding:0;
    cursor: pointer;
  }
}
</style>
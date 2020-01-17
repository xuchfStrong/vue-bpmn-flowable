<template>
  <div class="modelOutter">
    <div class="modelTitle">基础字段</div>
    <div class="modelWrapper">
      <draggable :list="[element]" :group="{ name: 'model', pull: 'clone', put: false }" :clone="clone" v-bind="dragOptions" v-for="element in list1" :key="element.id" class="modelInner">
        <div key="element.id" class="block">{{element.name}}</div>
      </draggable>
    </div>
    <div class="modelTitle">高级字段</div>
    <div class="modelWrapper">
      <draggable :list="[element]" :group="{ name: 'model', pull: 'clone', put: false }" :clone="clone" v-bind="dragOptions" v-for="element in list2" :key="element.id" class="modelInner">
        <div key="element.id" class="block">{{element.name}}</div>
      </draggable>
    </div>
    <div class="modelTitle">布局字段</div>
    <div class="modelWrapper">
      <draggable :list="[element]" :group="{ name: 'model', pull: 'clone', put: false }" :clone="clone" v-bind="dragOptions" v-for="element in list3" :key="element.id" class="modelInner">
        <div key="element.id" class="block">{{element.name}}</div>
      </draggable>
    </div>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'
import draggable from 'vuedraggable'
export default {
  components:{
    draggable
  },
  data(){
    return {
      list1:[
        {name:'单行文本',type:'input',id:uuidv1()},
        {name:'多行文本',type:'textarea',id:uuidv1()},
        {name:'计算器',type:'inputNumber',id:uuidv1()},
        {name:'单选框组',type:'radioGroup',id:uuidv1()},
        {name:'多选框组',type:'checkboxGroup',id:uuidv1()},
        {name:'时间选择器',type:'time',id:uuidv1()},
        {name:'日期选择器',type:'date',id:uuidv1()},
        {name:'评分',type:'rate',id:uuidv1()},
        {name:'颜色选择器',type:'color',id:uuidv1()},
        {name:'下拉选择框',type:'select',id:uuidv1()},
        {name:'开关',type:'switch',id:uuidv1()},
        {name:'滑块',type:'slider',id:uuidv1()},
        {name:'文字',type:'text',id:uuidv1()},
      ],
      list2:[
        {name:'自定义区域',type:'blank',id:uuidv1()},
        {name:'文件',type:'fileupload',id:uuidv1()},
        {name:'图片',type:'imgupload',id:uuidv1()},
        {name:'级联选择器',type:'cascader',id:uuidv1()},
      ],
      list3:[
        {name:'栅格布局',type:'grid',id:uuidv1()},
        {name:'标签页',type:'tabs',id:uuidv1()},
        {name:'分割线',type:'divider',id:uuidv1()},
      ],
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    }
  },
  methods:{
    clone(v){
      let obj = {
        label:v.name,
        type:v.type,
        value:'',
        id:uuidv1(),
        width:100,
        unit:'%',
        defineLW:false,
        labelWidth:100,
        placeholder:'',
        dataBing:true,
        hide:false,
        disabled:false,
        clearable:true,
      }
      switch(v.type){
        case'inputNumber':
          obj.width='180'
          obj.unit='px'
          obj.min=0
          obj.max=0
          obj.step=1
          break;
        case'radioGroup':case'checkboxGroup':
          obj.options=[
            {value:'option1',label:''}
          ];
          obj.remoteMethod = 'remoteMethod'
          obj.optionLabel = 'lable'
          obj.optionValue = 'value'
          obj.showLabel = false
          obj.remote = false
          obj.value = []
          break;
        case'select':
          obj.options=[
            {value:'option1',label:''}
          ];
          obj.remoteMethod = 'remoteMethod'
          obj.optionLabel = 'lable'
          obj.optionValue = 'value'
          obj.showLabel = false
          obj.remote = false
          obj.width='240'
          obj.unit='px'
          obj.multiple = false
          obj.filterable = false
          break;
        case'time':
          obj.valueFormat = 'HH:mm:ss'
          obj.isRange = false
          obj.startPlaceholder = ''
          obj.endPlaceholder = ''
          obj.editable = true
          obj.readonly = false
          obj.arrowControl = true
          obj.width = 240
          obj.unit='px'
          break;
        case'date':
          obj.optionType = 'date'
          obj.valueFormat = 'yyyy-MM-dd'
          obj.width = 240
          obj.unit='px'
          break;
        case'rate':
          obj.max = 5
          obj.value=0
          obj.allowHalf = false
          break;
        case'switch':
          obj.value = false
          break;
        case'slider':
          obj.showInput = false
          obj.min=0
          obj.max=100
          obj.step=1
          obj.value = 0
          break;
        case'color':
          obj.value = null
          break;
        case'blank':
          obj.defaultType = 'String'
          break;
        case'fileupload':case'imgupload':
          obj.limit = 9
          obj.action = ''
          obj.multiple = ''
          obj.tip = ''
          break;
        case'cascader':
          obj.options=[];
          obj.remoteMethod = 'remoteMethod'
          obj.optionLabel = 'lable'
          obj.optionValue = 'value'
          obj.optionChildren = 'children'
          obj.remote = true
          obj.width='240'
          obj.unit='px'
          break;
        case'grid':
          obj.columns = [
            {"span": 12,"list": []},
            {"span": 12,"list": []},
          ]
          obj.gutter = 0
          obj.justify = 'start'
          obj.align = 'top'
          break;
        case'tabs':
          obj.tabs = [
            {name:'tabs1',label:'tabs1',list:[]}
          ]
          obj.styleType = ''
          obj.tabPosition = 'top'
          obj.value = 'tabs1'
          break;
        case'divider':
          obj.contentPosition = 'left'
          break;
      }
      return obj
    },
  },
}
</script>

<style lang="scss" scoped>
.modelOutter{
  border-right:1px solid #e0e0e0;
  .modelWrapper{
    padding-left:10px;
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    .modelInner{
      margin: 1%;
    }
    .block{
      cursor: move;
      background: #f4f6fc;
      border: 1px solid #f4f6fc;
      width: 110px;
      font-size: 12px;
      line-height:30px;
      height: 30px;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #333;
    }
  }
  .modelTitle{
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
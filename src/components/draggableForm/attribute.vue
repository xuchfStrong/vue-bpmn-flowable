<template>
  <div class="attrWrapper">
    <div class="tabsWrapper">
      <div v-for="item in list" :key="item" class="tabsItem" @click="tab=item" :class="{active:item==tab}">{{item}}</div>
    </div>
    <div class="content" v-if="active&&active.id">
      <el-form label-position="top" ref="form" :model="form" label-width="180px" v-if="tab=='字段属性'">
        <el-form-item label="字段标识">
          <el-input v-model="form.id" @input="update" size="small"></el-input>
        </el-form-item>
        <el-form-item label="标题" v-if="!['grid','tabs'].includes(form.type)">
          <el-input v-model="form.label" @input="update" size="small"></el-input>
        </el-form-item>
        <el-form-item label="宽度" v-if="!['grid','tabs','divider'].includes(form.type)">
          <el-input v-model="form.width" @input="update" size="small">
            <el-select class="unit" v-model="form.unit" slot="append" placeholder="" @change="update">
              <el-option label="px" value="px"></el-option>
              <el-option label="%" value="%"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item label="标签宽度" v-if="!['grid','tabs','divider'].includes(form.type)">
          <el-checkbox v-model="form.defineLW" @change="update">自定义</el-checkbox>
          <el-input-number size="small" v-model="form.labelWidth" :step="10" @change="update" :disabled="!form.defineLW"></el-input-number>
        </el-form-item>
        <el-form-item label="占位内容" v-if="['input','textarea','select','time','cascader'].includes(form.type)">
          <el-input v-model="form.placeholder" @input="update" size="small"></el-input>
        </el-form-item>
        <div v-if="form.type=='divider'">
          <el-form-item label="文案位置">
            <el-radio-group v-model="form.contentPosition" @change="update" size="small" style="margin-bottom:10px">
              <el-radio-button label="left">左侧</el-radio-button>
              <el-radio-button label="center">居中</el-radio-button>
              <el-radio-button label="right">右侧</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </div>
        <div v-if="['imgupload','fileupload'].includes(form.type)">
          <el-form-item label="是否多选">
            <el-switch v-model="form.multiple" @change="update"></el-switch>
          </el-form-item>
          <el-form-item label="最大上传数">
            <el-input v-model="form.limit" @input="update" size="small" type="number"></el-input>
          </el-form-item>
          <el-form-item v-if="form.type=='fileupload'" label="提示说明文字">
            <el-input v-model="form.tip" @input="update" size="small"></el-input>
          </el-form-item>
          <el-form-item label="上传地址">
            <el-input v-model="form.action" @input="update" size="small"></el-input>
          </el-form-item>
        </div>
        <div v-if="form.type=='tabs'">
          <el-form-item label="风格类型">
            <el-select v-model="form.styleType" placeholder="" @change="update" size="small">
              <el-option v-for="(item,index) in styleType" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选项卡位置">
            <el-select v-model="form.tabPosition" placeholder="" @change="update" size="small">
              <el-option v-for="(item,index) in tabPosition" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="标签配置项">
            <div class="radioLine" v-for="(item,index) in form.tabs" :key="index">
              <el-input size="small" v-model="item.label" @input="update"></el-input>
              <el-button @click="delTabs(index)" type="text">
                <i class="el-icon-delete delIcon" ></i>
              </el-button>
            </div>
            <el-button type="text" @click="addTabs">添加列</el-button>
          </el-form-item>
        </div>
        <div v-if="form.type=='grid'">
          <el-form-item label="栅格间隔">
            <el-input v-model="form.gutter" @input="update" size="small" type="number"></el-input>
          </el-form-item>
          <el-form-item label="列配置项">
            <div class="radioLine" v-for="(item,index) in form.columns" :key="index">
              <el-input size="small" v-model="item.span" @input="update" type="number"></el-input>
              <el-button @click="delColumns(index)" type="text">
                <i class="el-icon-delete delIcon" ></i>
              </el-button>
            </div>
            <el-button type="text" @click="addColumns">添加列</el-button>
          </el-form-item>
          <el-form-item label="水平排列方式">
            <el-select v-model="form.justify" placeholder="" @change="update" size="small">
              <el-option v-for="(item,index) in justify" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="垂直排列方式">
            <el-select v-model="form.align" placeholder="" @change="update" size="small">
              <el-option v-for="(item,index) in align" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form.type=='blank'">
          <el-form-item label="绑定数据类型">
            <el-select v-model="form.defaultType" placeholder="" @change="update" size="small">
              <el-option v-for="(item,index) in defaultType" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="form.type=='color'">
          <el-form-item label="默认值">
            <el-color-picker v-model="form.value" @change="update" ></el-color-picker>
          </el-form-item>
        </div>
        <div v-if="form.type=='slider'">
          <el-form-item label="显示输入框">
            <el-switch v-model="form.showInput" @change="update"></el-switch>
          </el-form-item>
        </div>
        <div v-if="form.type=='switch'">
          <el-form-item label="默认值">
            <el-switch v-model="form.value" @change="update"></el-switch>
          </el-form-item>
        </div>
        <div v-if="form.type=='rate'">
          <el-form-item label="最大值">
            <el-input-number size="small" v-model="form.max" @change="update"></el-input-number>
          </el-form-item>
          <el-form-item label="允许半选">
            <el-switch v-model="form.allowHalf" @change="update"></el-switch>
          </el-form-item>
          <el-form-item label="默认值">
            <el-rate v-model="form.value" :max="form.max" @change="update" :allow-half="form.allowHalf"></el-rate>
          </el-form-item>
        </div>
        <div v-if="form.type=='date'">
          <el-form-item label="显示类型">
            <el-select v-model="form.optionType" placeholder="" @change="update" size="small">
              <el-option v-for="(item,index) in optionType" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="格式">
            <el-input v-model="form.valueFormat" @input="update" size="small"></el-input>
          </el-form-item>
        </div>
        <div v-if="form.type=='select'">
          <el-form-item label="是否多选">
            <el-switch v-model="form.multiple" @change="update"></el-switch>
          </el-form-item>
          <el-form-item label="是否可搜索">
            <el-switch v-model="form.filterable" @change="update"></el-switch>
          </el-form-item>
        </div>
        <div v-if="['select','radioGroup','checkboxGroup'].includes(form.type)">
          <el-form-item label="是否显示标签">
            <el-switch v-model="form.showLabel" @change="update"></el-switch>
          </el-form-item>
          <el-form-item label="选项">
            <el-radio-group v-model="form.remote" @change="update" size="small" style="margin-bottom:10px">
              <el-radio-button :label="false">静态数据</el-radio-button>
              <el-radio-button :label="true">远端数据</el-radio-button>
            </el-radio-group>
            <div v-if="form.remote">
              <el-select v-model="form.remoteMethod" placeholder="" @change="update" size="small">
                <el-option v-for="(item,index) in remoteMethod" :key="index" :label="item" :value="item"></el-option>
              </el-select>
              <!-- <el-input placeholder="" size="small" v-model="form.remoteMethod" @input="update">
                <template slot="prepend">远端方法</template>
              </el-input>
              <el-input placeholder="" size="small" v-model="form.optionValue" @input="update">
                <template slot="prepend">值</template>
              </el-input>
              <el-input placeholder="" size="small" v-model="form.optionLabel" @input="update">
                <template slot="prepend">标签</template>
              </el-input> -->
            </div>
            <div v-else>
              <div class="radioLine" v-for="(item,index) in form.options" :key="index">
                <i class="iconfont radioIcon" :class="{iconyduifuxuankuangxuanzhong:form.value.includes(item.value),iconyduifuxuankuang:!form.value.includes(item.value)}" @click="selectOptions(item)" v-if="form.type=='checkboxGroup'"></i>
                <i class="iconfont radioIcon" v-else :class="{icondanxuanxuanzhong:form.value==item.value,icondanxuanweixuanzhong:form.value!=item.value}" @click="selectOptions(item)"></i>
                <el-input size="small" v-model="item.value" @input="update"></el-input>
                <el-input size="small" v-model="item.label" v-if="form.showLabel" @input="update"></el-input>
                <el-button @click="delOptions(index)" type="text">
                  <i class="el-icon-delete delIcon" ></i>
                </el-button>
              </div>
              <el-button type="text" @click="addOptions">添加选项</el-button>
            </div>
          </el-form-item>
        </div>
        <div v-if="form.type=='cascader'">
          <el-form-item label="远端数据">
            <el-input placeholder="" size="small" v-model="form.remoteMethod" @input="update">
              <template slot="prepend">远端方法</template>
            </el-input>
            <el-input placeholder="" size="small" v-model="form.optionValue" @input="update">
              <template slot="prepend">值</template>
            </el-input>
            <el-input placeholder="" size="small" v-model="form.optionLabel" @input="update">
              <template slot="prepend">标签</template>
            </el-input>
            <el-input placeholder="" size="small" v-model="form.optionChildren" @input="update">
              <template slot="prepend">子选项</template>
            </el-input>
           </el-form-item>
        </div>
        <div v-if="['inputNumber','slider'].includes(form.type)">
          <el-form-item label="最小值">
            <el-input-number size="small" v-model="form.min" @change="update"></el-input-number>
          </el-form-item>
          <el-form-item label="最大值">
            <el-input-number size="small" v-model="form.max" @change="update"></el-input-number>
          </el-form-item>
          <el-form-item label="步长">
            <el-input-number size="small" v-model="form.step" @change="update"></el-input-number>
          </el-form-item>
        </div>
        <div v-if="form.type=='time'">
          <el-form-item label="是否为范围选择">
            <el-switch v-model="form.isRange" @change="updateRange"></el-switch>
          </el-form-item>
          <template v-if="form.isRange">
            <el-form-item label="开始时间占位内容">
              <el-input v-model="form.startPlaceholder" @input="update" size="small"></el-input>
            </el-form-item>
            <el-form-item label="结束时间占位内容">
              <el-input v-model="form.endPlaceholder" @input="update" size="small"></el-input>
            </el-form-item>
          </template>
          <el-form-item label="格式">
            <el-input v-model="form.valueFormat" @input="update" size="small"></el-input>
          </el-form-item>
          <el-form-item label="默认值">
            <el-time-picker size="small" v-model="form.value" @change="update" class="inputStyle" arrow-control :value-format="form.valueFormat" clearable :is-range="form.isRange">
            </el-time-picker>
          </el-form-item>
        </div>
        <el-form-item label="默认值" v-if="['input','textarea','text'].includes(form.type)">
          <el-input v-model="form.value" @input="update"></el-input>
        </el-form-item>
        <el-form-item label="操作属性">
          <el-checkbox v-if="!['grid','tabs','divider'].includes(form.type)" @change="update" v-model="form.dataBing">数据绑定</el-checkbox>
          <el-checkbox @change="update"  v-model="form.hide">隐藏</el-checkbox>
          <el-checkbox @change="update"  v-model="form.disabled" v-if="!['blank','text','grid','tabs','divider'].includes(form.type)">禁用</el-checkbox>
          <el-checkbox @change="update" v-if="['input','textarea','select','time','date','cascader'].includes(form.type)" v-model="form.clearable">显示清除按钮</el-checkbox>
          <template v-if="['time','date'].includes(form.type)">
            <el-checkbox v-model="form.readonly" @change="update">完全只读</el-checkbox>
            <el-checkbox v-model="form.editable" @change="update">文本框可输入</el-checkbox>
            <el-checkbox v-model="form.arrowControl" @change="update" v-if="form.type=='time'">使用箭头进行时间选择</el-checkbox>
          </template>
        </el-form-item>
      </el-form>
      <el-form label-position="top" ref="form" :model="formAt" label-width="180px" v-else>
        <el-form-item label="标签对齐方式">
          <el-radio-group v-model="formAt.labelPosition" @change="updateAt">
            <el-radio-button label="left">左对齐</el-radio-button>
            <el-radio-button label="right">右对齐</el-radio-button>
            <el-radio-button label="top">顶部对齐</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="表单标签宽度">
          <el-input-number v-model="formAt.labelWidth" :step="10" @change="updateAt"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import uuidv1 from 'uuid/v1'
export default {
  props:{
    active:{},
    formAttr:{},
  },
  data(){
    return {
      tab:'字段属性',
      list:['字段属性','表单属性'],
      form:{},
      formAt:{},
      optionType:[
        'year','month','date','dates','week','datetime','datetimerange','daterange','monthrange'
      ],
      defaultType:[
        {label:'字符串',value:'String'},
        {label:'对象',value:'Object'},
        {label:'数组',value:'Array'},
      ],
      justify:[
        {label:'左对齐',value:'start'},
        {label:'右对齐',value:'end'},
        {label:'居中',value:'center'},
        {label:'两侧间隔相等',value:'space-around'},
        {label:'两端对齐',value:'space-between'},
      ],
      align:[
        {label:'顶部对齐',value:'top'},
        {label:'居中',value:'middle'},
        {label:'底部对齐',value:'bottom'},
      ],
      styleType:[
        {label:'默认',value:''},
        {label:'选项卡',value:'card'},
        {label:'卡片化',value:'border-card'},
      ],
      tabPosition:[
        {label:'顶部',value:'top'},
        {label:'左侧',value:'left'},
        {label:'右侧',value:'right'},
        {label:'底部',value:'bottom'},
      ],
      remoteMethod:[
        'remoteMethod','remoteMethod2'
      ],
    }
  },
  created:function(){
    this.getValue(this.active,'form')
    this.getValue(this.formAttr,'formAt')
  },
  watch:{
    active:function(v){
      this.getValue(v,'form')
    },
    formAttr:function(v){
      this.getValue(v,'formAt')
    },
  },
  methods:{
    getValue(v,type){
      v&&this.$set(this.$data,type,this.$copy(v))
    },
    updateRange(v){
      this.form.value = v ? [new Date(),new Date()] : new Date()
      this.$emit('update',this.form)
    },
    update(v){
      this.$emit('update',this.form)
    },
    updateAt(){
      this.$emit('update:formAttr',this.formAt)
    },
    delTabs(index){
      this.form.tabs.splice(index,1)
      this.update()
    },
    addTabs(){
      this.form.tabs.push({name:uuidv1(),label:`tabs${this.form.tabs.length+1}`,list:[]})
      console.log(this.form)
      this.update()
    },
    delColumns(index){
      this.form.columns.splice(index,1)
      this.update()
    },
    addColumns(){
      this.form.columns.push({"span": 12,"list": []})
      this.update()
    },
    addOptions(){
      this.form.options.push({value:'新选项',label:''})
      this.update()
    },
    delOptions(index){
      this.form.options.splice(index,1)
      this.update()
    },
    selectOptions(item){
      if(this.form.type=='checkboxGroup'){
        let index = this.form.value.indexOf(item.value)
        index == -1 ? this.form.value.push(item.value) : this.form.value.splice(index,1)
      } else {
        this.form.value = item.value
      }
      this.update()
    },
  },
}
</script>

<style lang="scss" scoped>
.attrWrapper{
  border-left:1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  .tabsWrapper{
    display: flex;
    border-bottom: 2px solid #e4e7ed;
    padding: 0 5px;
    .tabsItem{
      flex:1;
      height: 45px;
      line-height: 45px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      position: relative;
      cursor: pointer;
      margin-bottom:-2px;
      &.active {
        border-bottom: 2px solid #409eff;
      }
    }
  }
  .content{
    flex:1;
    overflow: auto;
    padding:10px;
  }
  .unit{
    width:65px;
  }
}
.inputStyle{
  width:100%;
}
</style>
<style lang="scss">
.attrWrapper{
  .el-form-item__label {
    padding-bottom:0;
  }
  .el-form-item{
    margin-bottom:0;
  }
}
.radioLine{
  display: flex;
  align-items: center;
  .el-radio{
    margin-right:0;
  }
  .radioIcon{
    margin-right:10px;
    color:#e3e5eb;
    cursor: pointer;
    &:hover,&.icondanxuanxuanzhong,&.iconyduifuxuankuangxuanzhong{
      color:#409EFF;
    }
  }
  .delIcon{
    width:30px;
    line-height: 32rpx;
    text-align: center;
  }
}
</style>
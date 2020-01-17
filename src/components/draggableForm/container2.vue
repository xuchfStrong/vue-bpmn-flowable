<template>
  <draggable v-model="val" group="model" style="height:100%" @change="change" v-bind="dragOptions">
    <transition-group style="height:100%;display:block" type="transition" name="flip-list">
      <div v-for="(element,index) in val" :key="element.id" class="formItemInner" :class="{active:active&&(active.id==element.id)}" @click.stop="select(element)">
        <el-row type="flex" v-if="element.type=='grid'" :justify="element.justify" :align="element.align">
          <el-col v-for="(item,indexI) in element.columns" :key="indexI" class="col" :span="item.span-0">
            <container2 :active="active" @updateList="v=>updateItemList(v,item)" :list.sync="item.list" @update="select"></container2>
          </el-col>
        </el-row>
        <el-tabs v-else-if="element.type=='tabs'" :tab-position="element.tabPosition" v-model="element.value" :type="element.styleType">
          <el-tab-pane v-for="(item,indexI) in element.tabs" :key="indexI" :label="item.label" :name="item.name">
            <div class="col tab">
              <container2 :active="active" @updateList="v=>updateItemList(v,item)" :list.sync="item.list" @update="select"></container2>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-divider v-else-if="element.type=='divider'" :content-position="element.contentPosition">{{element.label}}</el-divider>
        <el-form-item v-else :label="element.label" :label-width="element.defineLW?element.labelWidth+'px':''">
          <div :style="{width:element.width+element.unit}" class="inputInner">
            <el-input class="inputStyle" :clearable="element.clearable" :disabled="element.disabled" :placeholder="element.placeholder" v-model="element.value" v-if="element.type=='input' || element.type=='textarea'" :type="element.type=='textarea'?'textarea':'default'"></el-input>
            <el-select class="inputStyle" v-model="element.value" v-else-if="element.type=='select'" :multiple="element.multiple" :remote="element.remote" :filterable="element.filterable" :placeholder="element.placeholder" :clearable="element.clearable" :disabled="element.disabled" :remote-method="remoteMethod"
            >
              <el-option v-for="(item,index) in element.options"
                :key="index"
                :label="element.remote?item[element.optionLabel]:element.showLabel?item.label:item.value"
                :value="element.remote?item[element.optionValue]:item.value">
              </el-option>
            </el-select>
            <el-input-number v-else-if="element.type=='inputNumber'" v-model="element.value" :min="element.min" :max="element.max" :step="element.step" class="inputStyle"></el-input-number>
            <el-radio-group v-model="element.value" v-else-if="element.type=='radioGroup'">
              <el-radio v-for="(item,index) in element.options" :key="index" :label="element.remote?item[element.optionValue]:item.value">
                {{element.showLabel?item.label:item.value}}
              </el-radio>
            </el-radio-group>
            <el-checkbox-group v-model="element.value" v-else-if="element.type=='checkboxGroup'">
              <el-checkbox v-for="(item,index) in element.options" :key="index" :label="element.remote?item[element.optionValue]:item.value">{{element.showLabel?item.label:item.value}}</el-checkbox>
            </el-checkbox-group>
            <el-time-picker v-model="element.value" :is-range="element.isRange" :editable="element.editable" v-else-if="element.type=='time'" class="inputStyle" :value-format="element.valueFormat" arrow-control :clearable="element.clearable" :disabled="element.disabled" :placeholder="element.placeholder" :arrowControl="element.arrowControl" :readonly="element.readonly" :start-placeholder="element.startPlaceholder" :end-placeholder="element.endPlaceholder">
            </el-time-picker>
            <el-date-picker v-model="element.value"
            :placeholder="element.placeholder" :type="element.optionType" v-else-if="element.type=='date'" class="inputStyle" :editable="element.editable" :value-format="element.valueFormat" :clearable="element.clearable" :disabled="element.disabled" :readonly="element.readonly"></el-date-picker>
            <el-rate v-else-if="element.type=='rate'" v-model="element.value" :max="element.max" style="margin-top:10px" :allow-half="element.allowHalf" :disabled="element.disabled"></el-rate>
            <el-switch v-model="element.value" v-else-if="element.type=='switch'" :disabled="element.disabled"></el-switch>
            <el-slider v-model="element.value" v-else-if="element.type=='slider'" :show-input="element.showInput" :disabled="element.disabled"></el-slider>
            <div v-else-if="element.type=='text'" >{{element.value}}</div>
            <el-color-picker v-model="element.value" v-else-if="element.type=='color'" :disabled="element.disabled"></el-color-picker>
            <div class="define" v-else-if="element.type=='blank'">自定义区域</div>
            <el-upload :action="element.action" v-else-if="element.type=='fileupload'||element.type=='imgupload'" :multiple="element.multiple" :list-type="element.type=='imgupload'?'picture-card':'text'"
            :limit="element.limit" :disabled="element.disabled">
              <template v-if="element.type=='imgupload'">
                <i class="el-icon-plus avatar-uploader-icon"></i>
              </template>
              <template v-else>
                <el-button size="small" type="primary" :disabled="element.disabled">点击上传</el-button>
                <div slot="tip">{{element.tip}}</div>
              </template>
            </el-upload>
            <el-cascader v-else-if="element.type=='cascader'"
            v-model="element.value" :options="element.options"
            :placeholder="element.placeholder" :clearable="element.clearable" :disabled="element.disabled"></el-cascader>
          </div>
        </el-form-item>
        <div class="buttonBox" @click.stop="del(index)">
          <i class="el-icon-delete"></i>
        </div>
        <!-- <formitemnew :value.sync="element" :active="active" @select="select(element)" @del="del(index)" @update="v=>update(v,index)"></formitemnew> -->
      </div>
    </transition-group>
  </draggable>
</template>

<script>
import formitemnew from './formitemnew'
import draggable from 'vuedraggable'
export default {
  name:'container2',
  props:{
    list:{
      type:Array,
      default:function(){
        return []
      },
    },
    active:{},
  },
  components:{
    draggable,formitemnew
  },
  data(){
    return {
      val:[],
    }
  },
  watch:{
    list:{
      deep:true,
      handler:function(v){
        this.getValue(v)
      },
    },
    active:{
      deep:true,
      handler:function(v){
        if(!v)return
        let i = this.val.findIndex(e=>e.id==v.id)
        if(i!=-1){
          this.$set(this.val,i,this.$copy(v))
        }
      },
    },
  },
  created:function(){
    this.getValue(this.list)
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
    remoteMethod(){},
    // 删除
    del(index){
      this.val.splice(index,1)
      let i = this.val.length?index-1>=0?index-1:0:''
      this.$emit('update',this.val[i])
      this.updateList()
    },
    // 初始值
    getValue(v){
      if(!v){return}
      this.$set(this.$data,'val',this.$copy(v))
    },
    // 改变
    change(v){
      this.$emit('updateList',this.val)
      setTimeout(()=>{
        if(v.added){
          this.$emit('update',v.added.element)
        }
      },200)
    },
    updateList(){
      this.$emit('updateList',this.val)
    },
    updateItemList(v,item){
      item.list = v
      this.updateList()
    },
    // 选择
    select(element){
      this.$emit('update',element)
    },
    // formitem属性修改
    update(v,index){
      this.$set(this.val,index,v)
    }
  },
}
</script>

<style>
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
</style>
<style lang="scss" scoped>
.formItemInner{
  position: relative;
  margin:2px;
  padding-bottom: 18px;
  border: 1px dashed hsla(0,0%,66.7%,.5);
  background-color: rgba(236,245,255,.3);
  &:hover{
    background: #ecf5ff;
    outline: 1px solid #409eff;
    outline-offset: 0;
  }
  .buttonBox{
    position:absolute;
    right:0;
    bottom:0;
    background: #409eff;
    color:#fff;
    cursor: pointer;
    padding:5px;
    display: none;
    z-index: 3;
  }
  &.active{
    outline: 2px solid #409eff;
    border: 1px solid #409eff;
    >.buttonBox{
      display: block;
    }
  }
  // &:after{
  //   position: absolute;
  //   left: 0;
  //   right: 0;
  //   top: 0;
  //   bottom: 0;
  //   display: block;
  //   z-index: 2;
  //   content: "";
  // }
}
.inputInner{
  max-width: 100%;
}
.inputStyle{
  width:100%;
}
.define{
  background-color: #eee;
  line-height: 50px;
  text-align: center;
  color:#999;
}
.col{
  min-height: 50px;
  border: 1px dashed #ccc;
  background: #fff;
  &.tab{
    min-height: 100px;
  }
}
</style>
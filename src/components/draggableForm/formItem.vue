<template>
  <div class="formItemInner" :class="{active:active.id==val.id}" @click="selecetItem">
    <el-row type="flex" v-if="val.type=='grid'">
      <el-col v-for="(item,indexI) in val.columns" :key="indexI" class="col">
        
      </el-col>
    </el-row>
    <el-form-item v-else :label="val.label" :label-width="val.defineLW?val.labelWidth+'px':''">
      <div :style="{width:val.width+val.unit}" class="inputInner">
        <el-input class="inputStyle" :clearable="val.clearable" :disabled="val.disabled" :placeholder="val.placeholder" v-model="val.value" v-if="val.type=='input' || val.type=='textarea'" :type="val.type=='textarea'?'textarea':'default'"></el-input>
        <el-select class="inputStyle" v-model="val.value" v-else-if="val.type=='select'" :multiple="val.multiple" :remote="val.remote" :filterable="val.filterable" :placeholder="val.placeholder" :clearable="val.clearable" :disabled="val.disabled" :remote-method="remoteMethod"
        >
          <el-option v-for="(item,index) in val.options"
            :key="index"
            :label="val.remote?item[val.optionLabel]:val.showLabel?item.label:item.value"
            :value="val.remote?item[val.optionValue]:item.value">
          </el-option>
        </el-select>
        <el-input-number v-else-if="val.type=='inputNumber'" v-model="val.value" :min="val.min" :max="val.max" :step="val.step" class="inputStyle"></el-input-number>
        <el-radio-group v-model="val.value" v-else-if="val.type=='radioGroup'">
          <el-radio v-for="(item,index) in val.options" :key="index" :label="val.remote?item[val.optionValue]:item.value">
            {{val.showLabel?item.label:item.value}}
          </el-radio>
        </el-radio-group>
        <el-checkbox-group v-model="val.value" v-else-if="val.type=='checkboxGroup'">
          <el-checkbox v-for="(item,index) in val.options" :key="index" :label="val.remote?item[val.optionValue]:item.value">{{val.showLabel?item.label:item.value}}</el-checkbox>
        </el-checkbox-group>
        <el-time-picker v-model="val.value" :is-range="val.isRange" :editable="val.editable" v-else-if="val.type=='time'" class="inputStyle" :value-format="val.valueFormat" arrow-control :clearable="val.clearable" :disabled="val.disabled" :placeholder="val.placeholder" :arrowControl="val.arrowControl" :readonly="val.readonly" :start-placeholder="val.startPlaceholder" :end-placeholder="val.endPlaceholder">
        </el-time-picker>
        <el-date-picker v-model="val.value"
        :placeholder="val.placeholder" :type="val.optionType" v-else-if="val.type=='date'" class="inputStyle" :editable="val.editable" :value-format="val.valueFormat" :clearable="val.clearable" :disabled="val.disabled" :readonly="val.readonly"></el-date-picker>
        <el-rate v-else-if="val.type=='rate'" v-model="val.value" :max="val.max" style="margin-top:10px" :allow-half="val.allowHalf" :disabled="val.disabled"></el-rate>
        <el-switch v-model="val.value" v-else-if="val.type=='switch'" :disabled="val.disabled"></el-switch>
        <el-slider v-model="val.value" v-else-if="val.type=='slider'" :show-input="val.showInput" :disabled="val.disabled"></el-slider>
        <div v-else-if="val.type=='text'" >{{value.value}}</div>
        <el-color-picker v-model="val.value" v-else-if="val.type=='color'" :disabled="val.disabled"></el-color-picker>
        <div class="define" v-else-if="val.type=='blank'">自定义区域</div>
        <el-upload :action="val.action" v-else-if="val.type=='fileupload'||val.type=='imgupload'" :multiple="val.multiple" :list-type="val.type=='imgupload'?'picture-card':'text'"
        :limit="val.limit" :disabled="val.disabled">
          <template v-if="val.type=='imgupload'">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </template>
          <template v-else>
            <el-button size="small" type="primary" :disabled="val.disabled">点击上传</el-button>
            <div slot="tip">{{val.tip}}</div>
          </template>
        </el-upload>
        <el-cascader v-else-if="val.type=='cascader'"
        v-model="val.value" :options="val.options"
        :placeholder="val.placeholder" :clearable="val.clearable" :disabled="val.disabled"></el-cascader>
      </div>
    </el-form-item>
    <div class="buttonBox" @click="$emit('del')">
      <i class="el-icon-delete"></i>
    </div>
  </div>
</template>

<script>
export default {
  props:{
    value:{},
    active:{},
  },
  created:function(){
    this.getValue(this.value)
  },
  watch:{
    value:function(v){
      this.getValue(v)
    },
  },
  data(){
    return {
      val:{},
    }
  },
  methods:{
    getValue(v){
      v&&this.$set(this.$data,'val',this.$copy(v))
    },
    selecetItem(){
      this.$emit('select',this.val)
    },
    remoteMethod(){},
  },
}
</script>

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
    .buttonBox{
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
}
</style>
<template>
  <div>
    <div v-for="element in val" :key="element.id">
      <template v-if="!element.hide">
        <el-row type="flex" v-if="element.type=='grid'" :justify="element.justify" :align="element.align">
          <el-col v-for="(item,indexI) in element.columns" :key="indexI" class="col" :span="item.span-0">
            <previewContainer :list="item.list"></previewContainer>
          </el-col>
        </el-row>
        <el-tabs v-else-if="element.type=='tabs'" :tab-position="element.tabPosition" v-model="element.value" :type="element.styleType">
          <el-tab-pane v-for="(item,indexI) in element.tabs" :key="indexI" :label="item.label" :name="item.name">
            <div class="col">
              <previewContainer :list="item.list"></previewContainer>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-divider v-else-if="element.type=='divider'" :content-position="element.contentPosition">{{element.label}}</el-divider>
        <el-form-item v-else :label="element.label" :label-width="element.defineLW?element.labelWidth+'px':''">
          <div :style="{width:element.width+element.unit}" class="inputInner">
            <el-input class="inputStyle" :clearable="element.clearable" :disabled="element.disabled" :placeholder="element.placeholder" v-model="element.value" v-if="element.type=='input' || element.type=='textarea'" :type="element.type=='textarea'?'textarea':'default'"></el-input>
            <el-select class="inputStyle" v-model="element.value" v-else-if="element.type=='select'" :multiple="element.multiple" :remote="element.remote" :filterable="element.filterable" :placeholder="element.placeholder" :clearable="element.clearable" :disabled="element.disabled" :remote-method="remoteMethod(element)"
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
            <div v-else-if="element.type=='blank'"></div>
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
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name:'previewContainer',
  props:{
    list:{
      type:Array,
      default:function(){
        return []
      },
    },
  },
  data(){
    return {
      val:[],
      form:{},
    }
  },
  created:function(){
    this.getValue(this.list)
  },
  methods:{
    remoteMethod(){},
    // 初始值
    getValue(v){
      if(!v){return}
      this.$set(this.$data,'val',this.$copy(v))
    },
  },
}
</script>

<style scoped>
.inputInner{
  max-width: 100%;
}
.inputStyle{
  width:100%;
}
</style>
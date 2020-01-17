<template>
  <div style="height:100%">
    <fm-making-form 
      ref="makingform" 
      style="height: 80%" 
      preview 
      generate-code 
      generate-json
    >
      <template slot="action">
        <!-- 自定义操作区域插槽 -->
        <el-button type="text" icon="el-icon-upload">保存</el-button>
      </template>
      <!-- <template slot="action">
      </template> -->
    </fm-making-form>
    <el-button @click="getJSON">getJSON</el-button>
  </div>
</template>

<script>
export default {
  data(){
    return {
      value:{ 
        "list": [
          { "type": "textarea", "name": "多行文本", "icon": "icon-diy-com-textarea", "options": { "width": "100%", "defaultValue": "", "required": false, "disabled": false, "pattern": "", "placeholder": "", "remoteFunc": "func_1573183776000_66622" }, "key": "1573183776000_66622", "model": "textarea_1573183776000_66622", "rules": [] } 
        ], 
        "config": { "labelWidth": 100, "labelPosition": "right", "size": "small" }
      }
    }
  },
  mounted:function(){
    // this.$refs.makingform.setJSON(this.value)
  },
  methods:{
    getJSON(){
      console.log(this.$refs.makingform.getJSON())
    },
  },
}
</script>

<style>

</style>
<template>
  <div style="height:100%">
    <fm-generate-form 
      :data="jsonData" 
      ref="generateForm"
    >
    </fm-generate-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      jsonData: {
        "list": [
          { "type": "textarea", "name": "多行文本", "icon": "icon-diy-com-textarea", "options": { "width": "100%", "defaultValue": "", "required": false, "disabled": false, "pattern": "", "placeholder": "", "remoteFunc": "func_1573183776000_66622" }, "key": "1573183776000_66622", "model": "textarea_1573183776000_66622", "rules": [] } 
        ], 
        "config": { "labelWidth": 100, "labelPosition": "right", "size": "small" }
      }
    }
  }
}
</script>

<style>

</style>
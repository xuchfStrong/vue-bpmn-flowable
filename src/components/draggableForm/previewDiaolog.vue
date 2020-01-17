<template>
  <el-dialog title="预览" width="60%" :visible.sync="dialogVisible" :before-close="handleClose">
    <el-form ref="form" :model="formAttr" :label-width="formAttr.labelWidth+'px'" :label-position="formAttr.labelPosition">
      <previewContainer :list="val" v-if='dialogVisible'></previewContainer>
    </el-form>
    <div slot="footer" style="text-align:center">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import previewContainer from './previewContainer'
export default {
  components:{
    previewContainer
  },
  data(){
    return {
      dialogVisible:false,
      code: {},
      formAttr:{
        labelPosition:'right',
        labelWidth:100,
      },
      val:[],
    }
  },
  methods:{
    int(val,formAttr){
      this.val = val
      this.formAttr = formAttr
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>

</style>
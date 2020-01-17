<template>
  <el-dialog title="生成JSON" width="60%" :visible.sync="dialogVisible" :before-close="handleClose">
    <codemirror class="codemirror" v-model="code" :options="cmOptions"></codemirror>
    <div slot="footer" style="text-align:center">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/fold/foldgutter.css'
// language js
import 'codemirror/mode/javascript/javascript.js'
//fold js
import 'codemirror/addon/fold/foldgutter.js'
import 'codemirror/addon/fold/brace-fold.js'
//active-line js
import 'codemirror/addon/selection/active-line.js'
// theme css
import 'codemirror/addon/lint/lint.css'
import 'codemirror/theme/duotone-light.css'
import 'codemirror/addon/lint/json-lint'
export default {
  components: {
    codemirror
  },
  data(){
    return {
      dialogVisible:false,
      code: '',
      cmOptions: {
        // codemirror options
        tabSize: 4,
        mode: 'application/json',
        gutters: ['CodeMirror-lint-markers', "CodeMirror-foldgutter"],
        theme: 'duotone-light',
        lineNumbers: true,
        foldGutter: true,
        line: true,
        styleActiveLine: true,
      }
    }
  },
  methods:{
    int(code){
      this.code = code
      this.dialogVisible = true
    },
    handleClose(){
      this.dialogVisible = false
      this.$emit('hide')
    },
  },
}
</script>

<style lang="scss" scoped>
.codemirror{
  border: 1px solid black;
}
</style>
<template>
  <div class="containerDF">
    <modelItem class="modelItem"/>
    <div class="containerWrapper">
      <div class="containerBtn">
        <el-button type="text" @click="clear">清空</el-button>
        <el-button type="text" @click="showPreviewFun">预览</el-button>
        <el-button type="text" @click="showJsonFun">生成JSON</el-button>
      </div>
      <el-form class="container" ref="form" :model="formAttr" :label-width="formAttr.labelWidth+'px'" :label-position="formAttr.labelPosition">
        <container2 :active="active" :list.sync="val" @update="update" @updateList="updateList"></container2>
      </el-form>
    </div>
    <attribute class="attribute" :active="active" @update="assignActive" :formAttr.sync="formAttr"/>
    <jsonDialog ref="jsonDialog" v-if="showJson"/>
    <previewDiaolog ref="previewDiaolog" v-if="showPreview"/>
  </div>
</template>

<script>
import modelItem from './modelitem'
import attribute from './attribute'
import container2 from './container2'
import draggable from 'vuedraggable'
import jsonDialog from './jsonDiaolog'
import previewDiaolog from './previewDiaolog'
export default {
  name:'indexnew',
  components: {
    draggable,modelItem,attribute,container2,jsonDialog,previewDiaolog
  },
  props:{
    value:{},
    group:{},
  },
  data(){
    return {
      showJson:false,
      showPreview:false,
      val:[],
      active:{},
      formAttr:{
        labelPosition:'right',
        labelWidth:100,
      },
    }
  },
  created:function(){
    this.getVal(this.value)
  },
  watch:{
    value:function(v){
      this.getVal(v)
    },
  },
  methods:{
    updateList(v){
      this.val = v
    },
    clear(){
      this.val = []
      this.formAttr = {
        labelPosition:'right',
        labelWidth:100,
      }
      this.active = {}
    },
    showPreviewFun(){
      this.showPreview = true
      this.$nextTick(()=>{
        this.$refs.previewDiaolog.int(this.val,this.formAttr)
      })
    },
    showJsonFun(){
      this.showJson = true
      this.$nextTick(()=>{
        let code = {
          list:this.val,
          config:this.formAttr
        }
        this.$refs.jsonDialog.int(JSON.stringify(code,null,'\t'))
      })
    },
    getVal(v){
      if(!v){return}
      let list = this.$copy(v)
      this.$set(this.$data,'val',list)
      this.active = this.val.length ? this.val[0] : {}
    },
    update(v){
      this.$set(this.$data,'active',v)
    },
    assignActive(v){
       this.active = Object.assign(this.active,v)
       this.$set(this.$data,'active',this.active)
    }
  },
}
</script>
<style lang="scss">
.containerDF{
  height:100%;
  display: flex;
  .modelItem{
    width:250px;
  }
  .containerWrapper{
    flex:1;
    display: flex;
    flex-direction: column;
    background: #fafafa;
  }
  .containerBtn{
    height: 45px;
    line-height: 45px;
    font-size: 18px;
    border-bottom: 2px solid #e4e7ed;
    text-align: right;
    background: #fff;
    padding:0 20px;
  }
  .container{
    flex:1;
    margin:10px;
    border: 1px dashed #999;
    background: #fff;
  }
  .attribute{
    width:300px;
  }
}
</style>
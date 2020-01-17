<template>
  <div class="containerDF">
    <modelItem class="modelItem"/>
    <container :activeIndex="activeIndex" class="container" :list.sync="val" @update="update" :formAttr="formAttr"/>
    <attribute class="attribute" :active="val[activeIndex]" @update="updateActive" :formAttr.sync="formAttr"/>
  </div>
</template>

<script>
import modelItem from './modelitem'
import attribute from './attribute'
import container from './container'
import draggable from 'vuedraggable'
export default {
  components: {
    draggable,modelItem,container,attribute
  },
  props:{
    value:{},
    group:{},
  },
  data(){
    return {
      val:[],
      active:'',
      activeIndex:null,
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
    getVal(v){
      if(!v){return}
      let list = this.$copy(v)
      this.$set(this.$data,'val',list)
      this.active = list ? list[0] : ''
    },
    update(v){
      this.$set(this.$data,'activeIndex',v)
    },
    updateActive(v){
      this.$set(this.val,this.activeIndex,v)
    },
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
  .container{
    flex:1;
    margin:10px;
    border: 1px dashed #999;
  }
  .attribute{
    width:300px;
  }
}
</style>
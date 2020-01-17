<template>
  <div>
    <el-form style="height:100%" ref="form" :model="form" :label-width="formAttr.labelWidth+'px'" :label-position="formAttr.labelPosition">
      <draggable v-model="val" group="model" style="height:100%" @change="change" v-bind="dragOptions">
        <transition-group style="height:100%;display:block" type="transition" name="flip-list">
          <div v-for="(element,index) in val" :key="element.id">
            <formItem :value="element" :active="getActive()" @select="select(index)" @del="del(index)"></formItem>
          </div>
        </transition-group>
      </draggable>
    </el-form>
  </div>
</template>

<script>
import formItem from './formItem'
import draggable from 'vuedraggable'
export default {
  props:{
    list:{
      type:Array,
      default:function(){
        return []
      },
    },
    formAttr:{},
    activeIndex:{},
  },
  components:{
    draggable,formItem
  },
  data(){
    return {
      val:[
        // {label:'名称',type:'input',value:'s',id:'1'}
      ],
      form:{},
      active:'',
    }
  },
  watch:{
    list:{
      deep:true,
      handler:function(v){
        this.getValue(v)
      },
    }
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
    // 删除
    del(index){
      this.val.splice(index,1)
      this.$emit('update',this.val.length?index-1>=0?index-1:0:'')
    },
    // 初始值
    getValue(v){
      if(!v){return}
      this.$set(this.$data,'val',this.$copy(v))
    },
    getActive(){
      let active = {}
      if(this.val&&this.val.length&&this.activeIndex!==null){
        active = this.val[this.activeIndex]
      }
      return active
    },
    // 改变
    change(v){
      if(v.added){
        this.$emit('update',v.added.newIndex)
      }
      this.$emit('update:list',this.val)
    },
    // 选择
    select(index){
      this.$emit('update',index)
    },
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
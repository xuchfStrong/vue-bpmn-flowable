<template>
  <draggable v-model="val" group="model" style="height:100%" @change="change" v-bind="dragOptions">
    <transition-group style="height:100%;display:block" type="transition" name="flip-list">
      <div v-for="(element,index) in val" :key="element.id">
        <formitemnew :value.sync="element" :active="active" @select="select(element)" @del="del(index)" @update="v=>update(v,index)"></formitemnew>
      </div>
    </transition-group>
  </draggable>
</template>

<script>
import formitemnew from './formitemnew'
import draggable from 'vuedraggable'
export default {
  name:'containernew',
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
      val:[
        // {label:'名称',type:'input',value:'s',id:'1'}
      ],
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
      let i = this.val.length?index-1>=0?index-1:0:''
      this.$emit('update',this.val[i])
    },
    // 初始值
    getValue(v){
      if(!v){return}
      this.$set(this.$data,'val',this.$copy(v))
    },
    // 改变
    change(v){
      if(v.added){
        this.$emit('update',v.added.element)
      }
      this.$emit('update:list',this.val)
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
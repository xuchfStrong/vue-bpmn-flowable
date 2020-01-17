<template>
  <div style="height:100%;">
    <indexnew v-model="myArray">
    </indexnew>
  </div>
</template>

<script>
import indexnew from '@/components/draggableForm/indexnew'
export default {
  components: {
    indexnew,
  },
  data(){
    return {
      myArray:[
        // {label:'名称', type:'input',value:'',id:'1'}
      ],
    }
  },
}
</script>

<style>

</style>
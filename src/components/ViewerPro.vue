<!-- ViewerPro.vue -->
<template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
  </div>
</template>

<script>
import CustomBpmnViewer from './customer-viewer'
import { is } from 'bpmn-js/lib/util/ModelUtil';
import axios from 'axios'
export default {
  data() {
    return {
      bpmnViewer: null,
      container: null,
      canvas: null
    }
  },

  components: {},

  computed: {},

  watch: {},

  created() {},

  mounted() {
    // 获取到属性ref为“canvas”的dom节点
    const canvas = this.$refs.canvas

    // 建模
    this.bpmnViewer = new CustomBpmnViewer({
      container: canvas,
    })

    this.createNewDiagram(this.bpmnViewer)
    this.removeLogo()
  },

  methods: {
    createNewDiagram () {
      // 将字符串转换成图显示出来
      // this.getXML()
      axios({
        headers: {
          'Content-Type': 'text/xml'
        },
        method: 'get',
        url: '/static/workflow.xml'
      })
        .then(res => {
          self = this
          this.bpmnViewer.importXML(res.data, function (err) {
            if (err) {
              console.error(err)
            } else {
              const sequenceFlow = self.getSequenceFlow(self.bpmnViewer)
              const activeNode = self.getActiveNode(self.bpmnViewer, '总队审核员审核')
              const passedIds = self.getPassedNode(self.bpmnViewer, activeNode.id, sequenceFlow)
              const canvas = self.bpmnViewer.get('canvas')
              canvas.zoom('fit-viewport')
              canvas.addMarker(activeNode.id, 'active')
              passedIds.forEach(id => {
                canvas.addMarker(id, 'passed')
              })
              const eventBus = self.bpmnViewer.get("eventBus")
              eventBus.on('element.click', function(evt) {
                //点击元素，弹出页面可以在这里写
                console.log('name', evt.element.businessObject)
              })
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 删除bpmn-js的logo
    removeLogo() {
      const bjsIoLogo = document.querySelector('.bjs-powered-by')
      while (bjsIoLogo.firstChild) {
        bjsIoLogo.removeChild(bjsIoLogo.firstChild)
      }
    },
    // 找出连接线元素
    getSequenceFlow(bpmnViewer) {
      const flowElements = bpmnViewer._definitions.rootElements[0].flowElements
      const sequenceFlow = flowElements.filter(item => {
        return is(item, 'bpmn:SequenceFlow')
      })
      return sequenceFlow
    },
    // 找出当前激活节点
    getActiveNode(bpmnViewer, name) {
      const flowElements = bpmnViewer._definitions.rootElements[0].flowElements
      const activeNode = flowElements.filter(item => {
        return item.name === name
      })
      return activeNode[0]
    },
    /**
     * 找出上一个走过的节点
     * @param  {id} element.id
     * @param  {sequenceFlows} sequenceFlows的array
     */
    getPassedObj(id, sequenceFlows) {
      const passedObj = {
        passedIds: [],
        sourceRefId: '',
        sourceRefType: ''
      }
      sequenceFlows.forEach(item => {
        if (item.targetRef.id === id && item.name === '通过') {
          passedObj.passedIds.push(item.sourceRef.id)
          passedObj.passedIds.push(item.id)
          passedObj.sourceRefId = item.sourceRef.id
          passedObj.sourceRefType = item.sourceRef.$type
        }
      })
      return passedObj
    },
    /**
     * 找出走过的节点
     * @param  {bpmnViewer} bpmnViewer
     * @param  {id} element.id
     * @param  {sequenceFlows} sequenceFlows的array
     */
    getPassedNode(bpmnViewer, id, sequenceFlows) {
      let passedIds = []
      let passedObj = this.getPassedObj(id, sequenceFlows)
      passedIds = passedIds.concat(passedObj.passedIds)
 
      for (let i = 1; i < 100; i++) { // 设置循环100次，为了避免死循环
        passedObj = this.getPassedObj(passedObj.sourceRefId, sequenceFlows)
        passedIds = passedIds.concat(passedObj.passedIds)
        if (passedObj.sourceRefType === 'bpmn:StartEvent') break
      }
      return passedIds
    }
  }
}

</script>

<style lang='scss'>
.containers{
  width: 100%;
  height: 100%;
}
.canvas{
  width: 100%;
  height: 100%;
}
.active .djs-visual > :nth-child(1)  {
  stroke: rgba(66, 180, 21, 0.7) !important; /* color elements as green */
  fill: rgba(66, 180, 21, 0.5) !important;
}

.passed .djs-visual > :nth-child(1)  {
  stroke: rgba(66, 180, 21, 0.7) !important; /* color elements as green */
}

.red .djs-visual > :nth-child(1)  {
  stroke: rgba(236, 54, 47, 0.7) !important; /* color elements as green */
  fill: rgba(236, 54, 47, 0.5) !important;
}
</style>

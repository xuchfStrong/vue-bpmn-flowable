<template>
  <div class="containers" ref="content">
    <button @click="createNewDiagram(bpmnViewer)">加载</button>
    <button @click="zoomIn()">缩小</button>
    <button @click="zoomOut()">放大</button>
    <button @click="zoomBack()">适配</button>
    <div class="toolbar">
      <a title="download">下载</a>
      <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN</a>
      <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG</a>
    </div>
    <vue-drag-resize @resizestop="resizeStop" @resizing="resizing" v-bind:style="styleObject">
      <div class="canvas" v-bind:class="{ active: isActive }" ref="canvas"></div>
    </vue-drag-resize>
    <!-- <div class="canvas" ref="canvas"></div> -->
  </div>
</template>

<script>
// 引入相关的依赖
import BpmnViewer from 'bpmn-js'
import axios from 'axios'
import VueDragResize from 'vue-drag-resize'
import {diagramXML} from './xml'

export default {
  components: { VueDragResize },
  data () {
    return {
      // bpmn建模器
      bpmnViewer: null,
      container: null,
      canvas: null,
      xmlStrGet: '',
      isActive: true,
      scale: 1, // 流程图比例
      styleObject: {
        width: '500px',
        height: '200px'
      }
    }
  },
  methods: {
    getXML () {
      // axios.get('http://localhost:8080/static/workflow.bpmn').then((res) => {
      //     //用axios的方法引入地址
      //     this.xmlStrGet=res.data
      //     //赋值
      //   console.log(res.data)
      // })
      axios({
        headers: {
          'Content-Type': 'text/xml'
        },
        method: 'get',
        url: '/static/workflow.xml'
      })
        .then(res => {
          this.xmlStrGet = res.data
          // console.log('res', res.data)
        })
        .catch(error => {
          console.log(error)
        })
    },

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
              // 这里还没用到这个，先注释掉吧
              const canvas = self.bpmnViewer.get('canvas');
              canvas.zoom('fit-viewport');
              const eventBus = self.bpmnViewer.get("eventBus");
              eventBus.on('element.click', function(evt) {
                  //点击元素，弹出页面可以在这里写
                  // console.log('evt1', evt)
                  console.log('name', evt.element.businessObject.name)
                  // alert(evt.element.businessObject.name)
              });
            }
          })
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG (done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnViewer.saveSVG(done)
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram (done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnViewer.saveXML({ format: true }, function (err, xml) {
        done(err, xml)
      })
    },
    // 当图发生改变的时候会调用这个函数，这个data就是图的xml
    setEncoded (link, name, data) {
      // 把xml转换为URI，下载要用到的
      const encodedData = encodeURIComponent(data)
      // 获取到图的xml，保存就是把这个xml提交给后台
      this.xmlStr = data
      // 下载图的具体操作,改变a的属性，className令a标签可点击，href令能下载，download是下载的文件的名字
      if (data) {
        link.className = 'active'
        link.href = 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData
        link.download = name
      }
    },
    // 缩小
    zoomIn() {
      const newScale = this.scale - 0.2 <= 0.2 ? 0.2 : this.scale - 0.2
      this.bpmnViewer.get('canvas').zoom(newScale)
      this.scale = newScale
    },
    // 放大
    zoomOut() {
      const newScale = this.scale + 0.2 >= 2 ? 2 : this.scale + 0.2
      this.bpmnViewer.get('canvas').zoom(newScale)
      this.scale = newScale
    },
    // 还原
    zoomBack() {
      this.bpmnViewer.get('canvas').zoom('fit-viewport')
      this.scale = 1
    },
    // 删除bpmn-js的logo
    removeLogo() {
      const bjsIoLogo = document.querySelector('.bjs-powered-by')
      while (bjsIoLogo.firstChild) {
        bjsIoLogo.removeChild(bjsIoLogo.firstChild)
      }
    },
    // 改变大小结束
    resizeStop() {
      this.bpmnViewer.get('canvas').zoom('fit-viewport')
    },
    // 改变大小事件
    resizing() {
      this.isActive = false
      this.styleObject = Object.assign({})
    }
  },
  mounted () {
    // 获取到属性ref为“content”的dom节点
    this.container = this.$refs.content
    // 获取到属性ref为“canvas”的dom节点
    const canvas = this.$refs.canvas

    // 建模，官方文档这里讲的很详细
    this.bpmnViewer = new BpmnViewer({
      container: canvas,
    })

    // 获取a标签dom节点
    const downloadLink = this.$refs.saveDiagram
    const downloadSvgLink = this.$refs.saveSvg
    // 监听流程图改变事件
    const _this = this
    this.bpmnViewer.on('commandStack.changed', function () {
      _this.saveSVG(function (err, svg) {
        _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
      })
      _this.saveDiagram(function (err, xml) {
        _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : xml)
      })
    })

    this.createNewDiagram(this.bpmnViewer)
    this.removeLogo()
  }
}
</script>

<style lang="scss">
  .containers{
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
  }
  .canvas{
    width: 100%;
    height: 100%;
  }
  .panel{
    position: absolute;
    right: 0;
    top: 0;
    width: 300px;
  }
  .toolbar {
    // position: absolute;
    // top: 20px;
    // right: 350px;
    a {
      text-decoration: none;
      margin: 5px;
      color: #409eff;
    }
  }
  .active {
    width: 500px;
    height: 200px;
  }
</style>

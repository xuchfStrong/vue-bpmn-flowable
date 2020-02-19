<template>
  <div class="containers" ref="content">
    <div class="canvas" ref="canvas"></div>
    <div id="js-properties-panel" class="panel"></div>
    <ul class="buttons">
      <li>下载</li>
      <li>
        <a ref="saveDiagram" href="javascript:" title="download BPMN diagram">BPMN diagram</a>
      </li>
      <li>
        <a ref="saveSvg" href="javascript:" title="download as SVG image">SVG image</a>
      </li>
      <el-upload :show-file-list="false" action="" :auto-upload="false" :on-change="changeFile" class="upload">
        <li>
          <a slot="trigger" ref="import" href="javascript:" title="download as SVG image">导入BPMN</a>
        </li>
      </el-upload>
      <li>
        <el-button type="default" @click="viewDiagram">查看</el-button>
      </li>
    </ul>

    <el-dialog
      title="流程图代码"
      fullscreen
      :visible.sync="dialogVisible">
      <div style="white-space: pre-wrap; font-family:SimSun; font-size: 12px; color: #000;">{{ diagram }}</div>
    </el-dialog>
  </div>
</template>

<script>
import {formatXml} from '@/utils/index'
// 引入相关的依赖
// import BpmnViewer from 'bpmn-js'
import BpmnModeler from 'bpmn-js/lib/Modeler'
import propertiesPanelModule from 'bpmn-js-properties-panel'
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/activiti'
// import camundaModdleDescriptor from 'camunda-bpmn-moddle/resources/camunda'
import activitiModdleDescriptor from 'activiti-bpmn-moddle/resources/activiti'
import { getBusinessObject } from 'bpmn-js/lib/util/ModelUtil';
export default {
  data () {
    return {
      // bpmn建模器
      bpmnModeler: null,
      container: null,
      canvas: null,
      xmlStr: null,
      processName: '',
      dialogVisible: false,
      diagram: ''
    }
  },
  methods: {
    createNewDiagram () {
      const bpmnXmlStr = `<?xml version="1.0" encoding="UTF-8"?>
        <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:activiti="http://activiti.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:tns="http://www.activiti.org/test" xmlns:xsd="http://www.w3.org/2001/XMLSchema" id="m1575598316912" name="" targetNamespace="http://www.activiti.org/test">
          <process id="myProcess_1" processType="None" isClosed="false" isExecutable="true">
            <startEvent id="_4">
              <extensionElements>
                <activiti:formData businessKey="FormProperty_1qbkdvr">
                  <activiti:formProperty id="FormProperty_1qbkdvr" type="string" />
                </activiti:formData>
              </extensionElements>
            </startEvent>
          </process>
          <bpmndi:BPMNDiagram id="Diagram-_1" name="New Diagram" documentation="background=#3C3F41;count=1;horizontalcount=1;orientation=0;width=842.4;height=1195.2;imageableWidth=832.4;imageableHeight=1185.2;imageableX=5.0;imageableY=5.0">
            <bpmndi:BPMNPlane bpmnElement="myProcess_1">
              <bpmndi:BPMNShape id="Shape-_4" bpmnElement="_4">
                <omgdc:Bounds x="200" y="150" width="32" height="32" />
                <bpmndi:BPMNLabel>
                  <omgdc:Bounds x="0" y="0" width="32" height="32" />
                </bpmndi:BPMNLabel>
              </bpmndi:BPMNShape>
            </bpmndi:BPMNPlane>
          </bpmndi:BPMNDiagram>
        </definitions>
        `
      // 将字符串转换成图显示出来
      this.bpmnModeler.importXML(bpmnXmlStr, function (err) {
        if (err) {
          console.error(err)
        }
      })
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveSVG (done) {
      // 把传入的done再传给bpmn原型的saveSVG函数调用
      this.bpmnModeler.saveSVG(done)
    },
    // 下载为SVG格式,done是个函数，调用的时候传入的
    saveDiagram (done) {
      // 把传入的done再传给bpmn原型的saveXML函数调用
      this.bpmnModeler.saveXML({ format: true }, function (err, xml) {
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
    // 判断是否为数组
    isArrayFn(value){
      if (typeof Array.isArray === "function") {
        return Array.isArray(value);
      }else{
        return Object.prototype.toString.call(value) === "[object Array]";
      }
    },
    // 下载bpmn去除formData
    getFormProperty(json){
      for(let e in json){
        if(e=='extensionElements'&&json.extensionElements.formData&&json.extensionElements.formData.formField){
          json.extensionElements._businessKey=json.extensionElements.formData._businessKey
          let formProperty = JSON.parse(JSON.stringify(json.extensionElements.formData.formField))
          json.extensionElements.formProperty = formProperty
          delete json.extensionElements.formData
        } else if(typeof json[e] == 'object'){
          this.getFormProperty(json[e])
        }
      }
    },
    // 导入bpmn加上formData
    returnFormProperty(json){
      for(let e in json){
        if(e=='extensionElements'&&json.extensionElements.formProperty){
          let formProperty = JSON.parse(JSON.stringify(json.extensionElements.formProperty))
          json.extensionElements.formData = {
            formField:formProperty,
            _businessKey:json.extensionElements._businessKey,
            __prefix:"activiti"
          }
          delete json.extensionElements.formProperty
        } else if(typeof json[e] == 'object'){
          this.returnFormProperty(json[e])
        }
      }
    },
    // 导入文件
    changeFile(file){
      let _this = this
      let reads = new FileReader();
      let f = file.raw
      reads.readAsText(f, 'utf-8');
      reads.onload = function (e) {
        var jsonObj = _this.$x2js.xml2js(e.target.result)
        _this.returnFormProperty(jsonObj)
        let newXml = _this.$x2js.js2xml(jsonObj)
        console.log(jsonObj)
        _this.bpmnModeler.importXML(newXml, function (err) {
          if (err) {
            console.error(err)
          }
        })
      };
    },
    // 查看流程图代码
    viewDiagram() {
      this.dialogVisible = true
    }
  },
  mounted () {
    // 获取到属性ref为“content”的dom节点
    this.container = this.$refs.content
    // 获取到属性ref为“canvas”的dom节点
    const canvas = this.$refs.canvas

    // 建模，官方文档这里讲的很详细
    this.bpmnModeler = new BpmnModeler({
      container: canvas,
      // 添加控制板
      propertiesPanel: {
        parent: '#js-properties-panel'
      },
      additionalModules: [
        // 左边工具栏以及节点
        propertiesProviderModule,
        // // 右边的工具栏
        propertiesPanelModule
      ],
      moddleExtensions: {
        activiti: activitiModdleDescriptor
      }
    })

    // 下载画图
    let _this = this
    // 获取a标签dom节点
    const downloadLink = this.$refs.saveDiagram
    const downloadSvgLink = this.$refs.saveSvg
    // 给图绑定事件，当图有发生改变就会触发这个事件
    this.bpmnModeler.on('commandStack.changed', function () {
      _this.saveSVG(function (err, svg) {
        _this.setEncoded(downloadSvgLink, 'diagram.svg', err ? null : svg)
      })

      _this.saveDiagram(function (err, xml) {
        console.log(xml)
        _this.diagram = xml
        var jsonObj = _this.$x2js.xml2js(xml)
        _this.getFormProperty(jsonObj)
        let newXml = '<?xml version="1.0" encoding="UTF-8"?>'+_this.$x2js.js2xml(jsonObj)
        console.log(jsonObj)
        _this.setEncoded(downloadLink, 'diagram.bpmn', err ? null : formatXml(newXml))
      })
    })
    this.bpmnModeler.on('element.click',(event)=>{
      event.originalEvent.preventDefault();
      event.originalEvent.stopPropagation();
      console.log('businessObject',getBusinessObject(event.element))
    })
    this.createNewDiagram(this.bpmnModeler)
  },
}
</script>

<style lang="scss">
  /*左边工具栏以及编辑节点的样式*/
  @import 'bpmn-js/dist/assets/diagram-js.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
  @import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
  /*右边工具栏样式*/
  @import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
  .containers{
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 90%;
  }
  .canvas{
    width: 100%;
    height: 100%;
  }
  .panel{
    position: absolute;
    right: 0;
    top: 0;
    width: 260px;
  }
  .buttons{
    position: absolute;
    left: 20px;
    bottom: 20px;
    &>li{
      display:inline-block;margin: 5px;
      &>a{
        color: #999;
        background: #eee;
        cursor: not-allowed;
        padding: 8px;
        border: 1px solid #ccc;
        &.active{
          color: #333;
          background: #fff;
          cursor: pointer;
        }
      }
    }
  }
  .upload{
    display: inline-block;
    margin:5px;
    li{
      list-style: none;
      a{
        color: #333;
        padding: 8px;
        border: 1px solid #ccc;
      }
    }
  }
</style>

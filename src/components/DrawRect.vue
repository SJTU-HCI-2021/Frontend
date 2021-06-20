<template>
  <div id="customPositionDiv">
    <div>
      <div @mousedown="mousedown" @mousemove="mousemove"
           @mouseup="mouseup" @Mouseleave="Mouseleave">
        <canvas ref="table" :width="canvasWidth" :height="canvasHeight"></canvas>
      </div>
    </div>
  </div>
</template>

<script>

import vue from 'vue'
import AutoCameraView from './AutoCameraView'

export default {
  name: 'DrawRect',
  props: ['imgSrc'],
  data() {
    return {
      //  customPositionShow:false, //自定义位置
      //   showclose:false,
      startX: 0,  //画画开始的X坐标
      startY: 0,  //画画开始的Y坐标
      endX: 0,    //画画结束的X坐标
      endY: 0,    //画画结束的Y坐标
      isMouseDownInCanvas: '', //鼠标是否按下
      customcxt: '',      // cxt
      canvasWidth: AutoCameraView.videoWidth,     //根据图片大小自适应canvas宽
      canvasHeight: AutoCameraView.videoHeight,    //根据图片大小自适应canvas高
    };
  },
  watch: {
    'imgSrc': function () {
      this.show();
    },

  },
  mounted() {
    this.show();
  },

  methods: {
    // dialog展示自定义矩形框画板，
    // 计算img与canvas标签自适应图片的大小
    show() {
      vue.nextTick(_ => {
        let customCanvas = this.$refs.table;// canvas显示层
        this.customcxt = customCanvas.getContext("2d");
        let img = new Image();
        img.src = this.imgSrc;
      })

    },
    //鼠标按下时执行
    mousedown(e) {
      this.isMouseDownInCanvas = true;
      // 鼠标按下时开始位置与结束位置相同
      // 防止鼠标在画完矩形后 点击图画形成第二个图形
      this.endX = e.offsetX;
      this.endY = e.offsetY;
      this.startX = e.offsetX;
      this.startY = e.offsetY;
      this.mousemove(e)

    },
    //鼠标移动式时执行
    mousemove(e) {
      if (this.isMouseDownInCanvas) { // 当鼠标有按下操作时执行

        this.endX = e.offsetX;
        this.endY = e.offsetY;
        let wwidth = this.endX - this.startX;
        let wheigth = this.endY - this.startY;

        // 清除指定区域的所有像素
        this.customcxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        //this.customcxt.fillStyle = " #0000ff"; //矩形框颜色
        //this.customcxt.fillRect(0, 0, this.canvasWidth, this.canvasHeight)
        this.customcxt.strokeStyle = " #00ff00"; //矩形框颜色
        this.customcxt.lineWidth = "2";  //矩形框宽度
        this.customcxt.strokeRect(this.startX, this.startY, wwidth, wheigth);  //绘制矩形
        console.log(this.startX, this.startY, wwidth, wheigth)

      }
    },
    //鼠标松开时执行
    mouseup(e) {
      this.isMouseDownInCanvas = false;
    },

    Mouseleave(e) {
      this.isMouseDownInCanvas = false
    },
  },
}

</script>

<style scoped>

</style>

<template>
  <div :style="videoStyle">
    <!--图片展示-->
    <video style="position: absolute;"
      id="myvideo"
      crossOrigin="Anonymous"
      ref="video"
      width="10%"
      height="10%"
      autoplay
    >
    </video>
    <canvas ref="canvas2" id="canvas2"width="640" height="480"></canvas>
    <!--DrawRect style="position: absolute">
    </DrawRect-->
  </div>

</template>
<script>

import vue from 'vue';

import TrackingSystem from './TrackingSystem'
import DrawRect from './DrawRect'

export let videoWidth = 0, videoHeight = 0;

export default {
  components: {DrawRect},
  data() {
    return {
      trackingSystem: new TrackingSystem(),
      videoStyle: ''
    };
  },
  mounted() {
    this.callCamera();
  },
  updated() {
    this.photograph();
  },

  created: function () {
    //这里是定时器
    setInterval(this.timer, 1000 * 15);
  },

  methods: {
    callCamera() {
      // 调用摄像头
      // H5调用电脑摄像头API
      navigator.mediaDevices
        .getUserMedia({
          video: true,
        })
        .then((success) => {
          // 摄像头开启成功
          this.$refs["video"].srcObject = success;
          // 实时拍照效果
          this.$refs["video"].play();
        })
        .catch((error) => {
          console.error("摄像头开启失败，请检查摄像头是否可用！");
        });
    },

    timer: function () {
      /*if(this.videoStyle === '') {
        let v = document.getElementById("myvideo");
        videoWidth = v.videoWidth;
        videoHeight = v.videoHeight;
        this.videoStyle = ' position: relative;  width:' + v.videoWidth
          + ' px; height:' + v.videoWidth + 'px'; //video浮动定位居中显示
      }*/
      //写成timer()也可
      this.photograph();
      // console.log("time")//打印查看效果
    },

    // 拍照
    photograph() {
      var c = document.createElement("canvas");
      var ctx = c.getContext("2d");
      var v = document.getElementById("myvideo");
      var height = v.videoHeight;
      var width = v.videoWidth;
      c.height = height;
      c.width = width;
      ctx.drawImage(v, 0, 0, width, height);
      var url = c.toDataURL("image/jpeg", 1);
      url = url.slice(23);
      var data = { recognize_img: url };
      data = JSON.stringify(data);

      this.$http.post("/api", data).then((res) => {
        let first_box = res.data[0].output.detection_boxes[0];
        //let first_box = res.data[0].output.detection_boxes[0]
        console.log(first_box);
        let xlen = first_box[2]-first_box[0]
        let ylen = first_box[3] - first_box[1]
        let img = new Image()
        let cvs = document.getElementById("canvas2")
        let ctx2 = cvs.getContext('2d')
        ctx2.drawImage(c, 0, 0, 640, 480)

        ctx2.strokeStyle = "red"
        ctx2.lineWidth = 3;
        //ctx2.strokeRect(first_box[0]*480, first_box[1]*640, xlen*480, ylen*640)
        ctx2.strokeRect(first_box[1]*640, first_box[0]*480, ylen *640, xlen*480)
        //ctx2.drawImage(img, 0, 0, 640, 480)
      });
    },
  },
};
</script>

<template>
  <div>
    <!--图片展示-->
    <video
      id="myvideo"
      crossOrigin="Anonymous"
      ref="video"
      width="100%"
      height="100%"
      autoplay
    ></video>
  </div>
</template>

<script>
import TrackingSystem from './TrackingSystem'

export default {
  data() {
    return {
      trackingSystem: new TrackingSystem()
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
        let o = res.data[0].output;
        console.log(o);
        this.trackingSystem.StartAddTrackData();
        for (let i = 0; i < o.detection_boxes.length; i++) {
          let reliability = o.detection_scores[i];
          let classId = o.detection_classes[i];
          let box = o.detection_boxes[i];
          this.trackingSystem.AddTrackData(reliability, classId, box[0], box[1], box[2], box[3]);
        }
        this.trackingSystem.EndAddTrackData();
      });
    },
  },
};
</script>

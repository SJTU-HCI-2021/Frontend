<template>
  <!--Display video or picture-->
  <div>
    <video
      v-show="!requestedSearch"
      id="myvideo"
      crossOrigin="Anonymous"
      ref="video"
      width="100%"
      height="100%"
      autoplay
    />
    <canvas
      v-show="requestedSearch"
      ref="canvas2"
      id="canvas2"
      width="640"
      height="480"
    />
  </div>
</template>
<script>
import TrackingSystem from "./TrackingSystem";
import Global from "../utils/Global";

export let trackingSystem = new TrackingSystem();
export let canvas, videoStaticImg;
export let instance;
export default {
  data: {
    search_result: "",
  },
  requestSearch(description) {
    if (canvas === undefined) return;
    let classId = 1 + Global.labels.findIndex((label) => description.indexOf(label) >= 0);
    if (classId === undefined) return;
    instance.requestedSearch = true;
    console.log("taken " + description + " as " + classId);
    let objects = trackingSystem.FindObject(classId);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(videoStaticImg, 0, 0, videoStaticImg.width, videoStaticImg.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    // if(objects.length == 0{})
    for (const object of objects) {
      search_result.push(object.state);
      console.log("state " + object.state);
      let box = object.box;
      console.log("drawing(uv): ", box.x1, box.y1, box.x2, box.y2);
      ctx.strokeRect(
        videoStaticImg.width * box.x1,
        videoStaticImg.height * box.y1,
        videoStaticImg.width * box.x2,
        videoStaticImg.height * box.y2
      );
    }
  },
  cancelSearch() {
    instance.requestedSearch = false;
  },
  data() {
    return {
      requestedSearch: false,
    };
  },
  mounted() {
    instance = this;
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
      canvas = document.getElementById("canvas2");
      videoStaticImg = document.createElement("canvas");
      let ctx = videoStaticImg.getContext("2d");
      let video = document.getElementById("myvideo");
      let width = video.videoWidth;
      let height = video.videoHeight;
      videoStaticImg.height = height;
      videoStaticImg.width = width;
      ctx.drawImage(video, 0, 0, width, height);
      let url = videoStaticImg.toDataURL("image/jpeg", 1);
      url = url.split("image/jpeg;base64,")[1];
      // url = url.slice(23);
      let data = { recognize_img: url };
      data = JSON.stringify(data);

      this.$http.post("/api", data).then((res) => {
        let o = res.data[0].output;
        console.log(o);
        trackingSystem.StartAddTrackData();
        for (let i = 0; i < o.detection_boxes.length; i++) {
          let reliability = o.detection_scores[i];
          let classId = o.detection_classes[i];
          let box = o.detection_boxes[i];
          trackingSystem.AddTrackData(
            reliability,
            classId,
            box[0],
            box[1],
            box[2],
            box[3]
          );
        }
        trackingSystem.EndAddTrackData();
        console.log("first picture analyzed");
      });
    },
  },
};
</script>

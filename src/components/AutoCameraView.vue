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
import axios from 'axios'

export let trackingSystem = new TrackingSystem();
export let canvas, videoStaticImg;
export let instance;
export default {
  data() {
    return {
      search_result: [],
      requestedSearch: false,
    };
  },
  requestSearch(description) {
    if (canvas === undefined) return;
    instance.requestedSearch = true;
    console.log("taken " + description);
    let objects = trackingSystem.FindObject(description);
    let ctx = canvas.getContext("2d");
    ctx.drawImage(videoStaticImg, 0, 0, videoStaticImg.width, videoStaticImg.height);
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    // if(objects.length == 0{})
    for (const object of objects) {
      instance.search_result.push(object.state);
      console.log("state " + object.state);
      let box = object.box;
      console.log("drawing(uv): ", box.x1, box.y1, box.x2, box.y2);
      ctx.strokeRect(
        box.x1,
        box.y1,
        box.x2,
        box.y2
      );
    }
  },
  resetSearch() {
    instance.requestedSearch = false;
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
      let data2 = {"image":url,
        "top_num": 10
      }
      axios.post("https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection/test_detection_hci2?access_token=24.58b1d7afeed5c6284afacf76df79b03a.2592000.1626869699.282335-24413022",data2).then((res) => {
        let o = res.data;
        //console.log(o);
        //console.log(o.results)
        trackingSystem.StartAddTrackData();
        for (const result of o.results) {
          let score = result.score;
          let classId = result.name
          let box = result.location;
          //console.log("classId: " + classId + " score: " + score + " box: " + box.left + ", " + box.top + ", " + box.width + ", " + box.height)
          trackingSystem.AddTrackData(
            score,
            classId,
            box.left,
            box.top,
            box.width,
            box.height
          );
        }
        trackingSystem.EndAddTrackData();
      });

    },
  },
};
</script>

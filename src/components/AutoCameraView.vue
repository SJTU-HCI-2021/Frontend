<template>
  <!--Display video or picture-->
  <div>
    <a-popover title="实时监测画面" placement="left">
      <template slot="content">
        <p style="width: 300px">
          摄像设备事实拍摄范围内的话面，程序将会基于该画面进行物体识别，请尽量不要移动摄像机使得程序能够正确运行。
        </p>
        <p style="width: 300px">
          红色框圈起来的内容是检测出的物体的结果，而物体是否被遮挡，是否被移除屏幕等结果可以再页面下方的“识别结果”一栏中查看。
        </p>
      </template>
      <video
        v-show="!requestedSearch"
        id="myvideo"
        crossOrigin="Anonymous"
        ref="video"
        width="100%"
        height="100%"
        autoplay
      />
    </a-popover>
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
import axios from "axios";
import { captureRejectionSymbol } from "events";

export let trackingSystem = new TrackingSystem();
export let canvas, videoStaticImg;
export let instance;
export default {
  data() {
    return {
      search_result: [],
      requestedSearch: false,
      buttonWidth: 40,
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
    Global.OutputContent = objects;
    for (const object of objects) {
      let box = object.box;
      console.log("drawing(uv): ", box.x1, box.y1, box.x2, box.y2);
      ctx.strokeRect(box.x1, box.y1, box.x2, box.y2);
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
    setInterval(this.timer, 1000 * 5);
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
      let data2 = { image: url, top_num: 10 };
      axios
        .post(
          "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/detection/test_detection_hci?access_token=24.ed54de150042e7b3e4e4856c64983e81.2592000.1626921713.282335-24411081",
          data2
        )
        .then((res) => {
          let o = res.data;
          //console.log(o);
          //console.log(o.results)
          trackingSystem.StartAddTrackData();
          for (const result of o.results) {
            let score = result.score;
            let classId = result.name;
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

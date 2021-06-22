<template>
  <div
    style="
      float: left;
      margin-left: 15px;
      width: 100%;
      margin-top: 30px;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      height: 350px;
    "
  >
    <a-card
      title="语音输入结果"
      :headStyle="{'fontWeight': '800', 'fontSize': '26px', 'text-align': 'left'}"
      style="height: 350px"
    >
      <div style="text-align: center">
        <div>
          <a-popover title="语音播放器" placement="top">
            <template slot="content">
              <p style="width: 300px">
                语音输入后的音频被保存后将会在这里提供回放，用户可以在这里重新检查自己的语音输入。
              </p>
            </template>
            <audio controls autoplay></audio>
          </a-popover>
        </div>
        <div>
          <a-popover title="开始录制按钮" placement="top">
            <template slot="content">
              <p style="width: 300px">
                点击此按钮开始录制语音输入，点击此按钮的同时语音播放器中的录音将会被重置，请注意这一点。
              </p>
            </template>
            <a-button
              shape="circle"
              @click="startRecord"
              icon="play-circle"
              value="录音"
            />
          </a-popover>
          <a-popover title="结束录制按钮" placement="top">
            <template slot="content">
              <p style="width: 300px">点击此按钮终止语音输入。</p>
            </template>
            <a-button shape="circle" @click="stopRecord" icon="pause" value="停止" />
          </a-popover>
<!--          <a-popover title="获取结果按钮" placement="top">-->
<!--            <template slot="content">-->
<!--              <p style="width: 300px">-->
<!--                点击此按钮后将会自动播放播放器中的录音内容，同时会将音频上传至服务器获取语音识别结果，并且对结果进行物体追踪识别。-->
<!--              </p>-->
<!--            </template>-->
<!--            <a-button shape="circle" @click="play" icon="caret-right" value="播放" />-->
<!--          </a-popover>-->
        </div>
      </div>

      <div class="display-audio" style="margin-top: 10px; padding-bottom: 30px">
        <a-popover title="语音输入结果" placement="top">
          <template slot="content">
            <p style="width: 300px">显示语音输入后识别的文字结果。</p>
          </template>
          <h2 style="font-weight: 800">识别结果:</h2>
        </a-popover>
        <h2>{{ msg }}</h2>
      </div>
    </a-card>
  </div>
</template>

<script>
// import Record from "../utils/Record";
import axios from "axios";
import { HZRecorder } from "./HZRecorder.js";
import AutoCameraView from "./AutoCameraView";

function send() {
  alert(1);
}

const audio_fail_key = "audio_fail_key";
export default {
  name: "Record",
  data() {
    return {
      isFinished: false,
      audio: "",
      // recorder: new Record(),
      recorder: "",
      msg: "",
    };
  },
  mounted() {
    this.initAudio();
  },
  methods: {
    openAudioFailNotification() {
      this.$notification["error"]({
        audio_fail_key,
        message: "语音识别失败",
        description:
          "程序没有成功识别到语音输入，请确保在安静环境下进行语音输入。请确保语音时常不要过短且输入内容合法。",
        duration: 0,
      });
    },
    initAudio() {
      var _this = this;
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
      navigator.getUserMedia(
        { audio: true },
        function (stream) {
          let recorder = new HZRecorder(stream);
          _this.recorder = recorder;
          console.log("初始化完成");
        },
        function (e) {
          console.log("No live audio input: " + e);
        }
      );
    },

    startRecord: function () {
      this.recorder.clear();
      console.log("start to record now.");
      let self = this;
      self.isFinished = false;
      self.recorder.start({
        success: (res) => {
          console.log("start record successfully.");
        },
        error: (res) => {
          console.log("start record failed.");
        },
      });
      // this.recorder.start();
    },
    stopRecord: function () {
      console.log("stop record now.");
      let self = this;
      self.isFinished = false;
      self.recorder.stop({
        success: (res) => {
          //此处可以获取音频源文件(res)，用于上传等操作
          console.log("stop record successfully.");
        },
        error: (res) => {
          console.log("stop record failed.");
        },
      });
      // self.recorder.clear();
      // this.recorder.stop();
      //this.axios.post('')
      this.play();
    },

    get_audio(file) {
      return new Promise((resolve, reject) => {
        try {
          var reader = new FileReader();
          if (file) {
            reader.onloadend = function (e) {
              resolve(reader.result);
            };
            reader.onerror = function () {
              reject("load file error");
            };
            reader.readAsDataURL(file);
          } else {
            reject("file not found");
          }
        } catch (e) {
          reject("file not found");
        }
      });
    },

    play: function () {
      console.log("play record now.");
      let self = this;
      self.isFinished = true;
      self.audio = document.querySelector("audio");
      self.recorder.play(self.audio);
      let Base64 = require("js-base64").Base64;
      let str = self.recorder.getBlob();
      //let tmp = Base64.encode(str)
      //let mp3Blob = tmp;
      let mp3Blob = str;
      this.get_audio(mp3Blob);

      //let fd = new FormData();
      //fd.append('audio',tmp)

      this.get_audio(mp3Blob)
        .then((res) => {
          let datalen = mp3Blob.size;
          console.log(datalen);
          res = res.split("data:audio/wav;base64,")[1];
          let posdata = {
            format: "wav",
            rate: 16000,
            dev_pid: 80001,
            channel: 1,
            token:
              "24.65397b49a4b009caa5ae9e1eb40f2d7a.2592000.1626707677.282335-24402658",
            cuid: "baidu_workshop",
            len: datalen,
            speech: res,
          };
          this.$http.post("/audio", posdata).then((res) => {
            this.msg = res.data.result[0];
            console.log(res);
            if (
              !res.data.result[0] ||
              res.data.result[0] == undefined ||
              res.data.result[0] == "" ||
              res.data.result[0].length == 0
            ) {
              this.openAudioFailNotification();
            }
            AutoCameraView.requestSearch(this.msg);
            this.$forceUpdate();
          });
        })
        .catch((e) => {
          console.log(e);
        });

      // 如果能支持 async await
      //let res = await get_audio(file)
      // ajax
    },
  },
};
</script>

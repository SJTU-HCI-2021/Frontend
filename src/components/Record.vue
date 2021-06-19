<template>
  <div class="record">
    <h1>Click following button to record voice:</h1>
    <input @click="startRecord" type="button" value="录音">
    <input @click="stopRecord" type="button" value="停止">
    <input @click="play" type="button" value="播放">
    <div class="record-play" v-show="isFinished">
      <h2>Current voice player is:</h2>
      <audio controls autoplay></audio>
    </div>
  </div>
</template>

<script>
  import Record from "../utils/Record";
  import axios from 'axios';

  export default {
    name: "Record",
    data() {
      return {
        isFinished: false,
        audio: "",
        recorder: new Record()
      };
    },
    methods: {
      startRecord: function() {
        console.log("start to record now.");
        let self = this;
        self.isFinished = false;
        self.recorder.startRecord({
          success: res => {
            console.log("start record successfully.");
          },
          error: res => {
            console.log("start record failed.");
          }
        });
      },
      stopRecord: function() {
        console.log("stop record now.");
        let self = this;
        self.isFinished = false;
        self.recorder.stopRecord({
          success: res => {
            //此处可以获取音频源文件(res)，用于上传等操作
            console.log("stop record successfully.");
          },
          error: res => {
            console.log("stop record failed.");
          }
        });
        //this.axios.post('')
      },
      play: function() {
        console.log("play record now.");
        let self = this;
        self.isFinished = true;
        self.audio = document.querySelector("audio");
        self.recorder.play(self.audio);
        let Base64 = require('js-base64').Base64
        let str = self.recorder.getBlob();
        let tmp = Base64.encode(str)  // 5r2Y6auY
        //console.log(tmp)
        let mp3Blob = tmp;
        let fd = new FormData();
        fd.append('audio',tmp)
        let posdata =
              {"format":"wav",
                "rate":16000,
                "dev_pid":80001,
                "channel":1,
                "token":"24.65397b49a4b009caa5ae9e1eb40f2d7a.2592000.1626707677.282335-24402658",
                "cuid":"baidu_workshop",
                "len":4096,
                "speech":fd
              }
        this.$http.post('/api',posdata).then(res=>{
          console.log(res.data)
        });

        // axios({
        //   headers:{
        //   'Content-Type': 'application/json'
        //   },
        //   method:'post',
        //     url:'https://vop.baidu.com/pro_api',
        //     data:
        //   {"format":"wav",
        //     "rate":16000,
        //     "dev_pid":80001,
        //     "channel":1,
        //     "token":"24.65397b49a4b009caa5ae9e1eb40f2d7a.2592000.1626707677.282335-24402658",
        //     "cuid":"baidu_workshop",
        //     "len":4096,
        //     "speech":fd
        //   }
        // }).then(res=>{
        //   console.log(res.data)
        // })
      }
    }
  };
</script>

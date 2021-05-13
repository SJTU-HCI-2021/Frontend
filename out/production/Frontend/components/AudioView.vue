<template>
  <div>
    <!--图片展示-->
    <el-button id="btnStart" @click="startRecord" icon="el-icon-setting" style="margin-top: 10px">Start</el-button>
    <el-button id="btnStop" @click="endRecord" icon="el-icon-setting" style="margin-top: 10px">Stop</el-button>
    <video ref="video" width="5px" height="5px" autoplay ></video>

  </div>
</template>
<script>

  export default {
    data () {
      return {
        mediaRecorder:null
      }
    },
    mounted () {
      this.callMic();
    },
    methods: {
      startRecord() {
        this.mediaRecorder.start();
        console.log(this.mediaRecorder.state);
      },
      endRecord() {
        this.mediaRecorder.stop();
        console.log(this.mediaRecorder.state);
      },
      callMic () {
        // 调用音频
        // H5调用电脑摄像头API
        navigator.mediaDevices.getUserMedia({
          audio: true
        }).then(function(mediaStreamObj) {
          this.data.mediaRecorder = new MediaRecorder(mediaStreamObj);
          let chunks = [];

          this.data.mediaRecorder.ondataavailable = function(ev) {
            console.log("OnDataAvailable");
            chunks.push(ev.data);
          }

          // this.mediaRecorder.onstop = (ev) => {
          //   console.log("OnStop");
          //   let blob = new Blob(chunks, {'type' : 'video/mp4;'});
          //   chunks = [];
          //   let videoURL = window.URL.createObjectURL(blob);
          //   vidSave.src = videoURL;
          // }
        }).catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
        })
      },
    }
  }
</script>

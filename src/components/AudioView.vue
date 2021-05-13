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
        let obj = new MediaRecorder(this.mediaStream);
        console.log(obj == null);
        navigator.mediaDevices.getUserMedia({
          audio: true
        }).then(success => {
          // let obj = new MediaRecorder(this.stream);
          // let chunks = [];

          // this.data.mediaRecorder.ondataavailable = function(ev) {
          //   console.log("OnDataAvailable");
          //   chunks.push(ev.data);
          // }

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
      callCamera () {// 调用摄像头
        // H5调用电脑摄像头API
        navigator.mediaDevices.getUserMedia({
          video: true
        }).then(success => {
          // 摄像头开启成功
          this.$refs['video'].srcObject = success
          // 实时拍照效果
          this.$refs['video'].play()
        }).catch(error => {
          console.error('摄像头开启失败，请检查摄像头是否可用！')
        })
      },

    }
  }
</script>

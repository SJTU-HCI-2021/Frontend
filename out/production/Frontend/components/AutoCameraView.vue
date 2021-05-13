<template>
  <div>
    <!--图片展示-->
    <video ref="video" width="100%" height="100%" autoplay ></video>
  </div>
</template>
<script>
  export default {
    data () {
      return {

      }
    },
    mounted () {
      this.callCamera();
    },
    methods: {
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

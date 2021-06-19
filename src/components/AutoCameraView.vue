<template>
  
  <div>
    <!--图片展示-->
    <video id='myvideo'  crossOrigin='Anonymous' ref="video" width="100%" height="100%" autoplay ></video>
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
    updated(){
      this.photograph();
    },

    created: function () {//这里是定时器
    setInterval(this.timer, 1000);
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

      timer: function () {//写成timer()也可
     	  this.photograph();
     	  console.log("time")//打印查看效果
      },


      // 拍照
      photograph () {
        var c=document.createElement("canvas");
        var ctx=c.getContext('2d');
        var v = document.getElementById('myvideo');
        var height = v.videoHeight;
        var width = v.videoWidth;
        c.height = height
        c.width = width
        ctx.drawImage(v,0,0,width,height)
        var url = c.toDataURL('image/jpeg',1);
        console.log(url)
        var data = {'recognize_img' : url};
        this.axios.post("http://139.198.30.15:8000",  data,{
          headers:{
            'Content-Type': "application/json;charset=utf-8",
            'Access-Control-Allow-Origin': '*'
             //或其他格式
          }
        }).then(function(res){
          console.log(res);
        })
      },
      
    }
  }
</script>

<template>
  <div class="HomePage">
<!--    <el-container>-->
<!--      <el-aside style="width: 50%;margin-left: 30px">-->
<!--        <div class="LeftPart" style=";margin-top: 0;width: 100%">-->
<!--          <div style="margin-top: 10px;" >-->
<!--            <el-input placeholder="请输入内容" v-model="SearchInput" class="input-with-select">-->
<!--              <el-button slot="append" icon="el-icon-search"></el-button>-->
<!--            </el-input>-->
<!--          </div>-->

<!--          <div style="margin-top: 30px;">-->
<!--            <AutoCameraView></AutoCameraView>-->
<!--          </div>-->

<!--        </div>-->

<!--      </el-aside>-->

<!--      <el-aside style="width: 50%;">-->
<!--        <div>-->
<!--          <el-button icon="el-icon-setting" style="margin-top: 10px">设置</el-button>-->
<!--        </div>-->
<!--        <div class="RightPart" style="float: left;margin-left: 15px;width: 80%;height:100%;margin-top: 30px" >-->
<!--          <el-card class="box-card" style="height: 75%">-->
<!--            <div v-for="(item,i) in OutputContent" class="text item">-->
<!--              {{item }}-->
<!--            </div>-->
<!--          </el-card>-->

<!--          <el-popover-->
<!--            placement="top-start"-->
<!--            title="模式选择"-->
<!--            width="200"-->
<!--            trigger="hover"-->
<!--            >-->
<!--            <el-switch-->
<!--              v-model="DetectMode"-->
<!--              active-text="实时检测"-->
<!--              inactive-text="长按输入">-->
<!--            </el-switch>-->
<!--            <el-button slot="reference">模式切换</el-button>-->
<!--          </el-popover>-->
<!--        </div>-->
<!--      </el-aside>-->

<!--    </el-container>-->
    <AudioView></AudioView>

  </div>
</template>

<script>
  import AutoCameraView from '../components/AutoCameraView'
  import AudioView from '../components/AudioView'

  export default {
    name: 'HomePage',
    components:{AutoCameraView, AudioView},
    data () {
      return {
        SearchInput:'',
        OutputContent:[],
        DetectMode:false,
      }
    },
    methods: {
      audioTransfer(val) {
        this.SearchInput = val;
        console.log(this.SearchInput);
      }
    },
    mounted () {
      console.log("In mounted");
      this.OutputContent.push("欢迎使用慧眼识物");
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

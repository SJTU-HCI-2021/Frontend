<template>
  <div class="HomePage">
    <el-container>
      <el-aside style="width: 50%;margin-left: 30px">
        <div class="LeftPart" style=";margin-top: 0;width: 100%">
          <div style="margin-top: 10px;" >
            <el-input placeholder="请输入内容" v-model="SearchInput" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </div>

          <div style="margin-top: 30px;">
            <AutoCameraView></AutoCameraView>
          </div>

        </div>

      </el-aside>

      <el-aside style="width: 50%;margin-top: 80px">
        <div class="RightPart" style="float: left;margin-left: 15px;width: 80%" >
          <el-card class="box-card">
            <div v-for="(item,i) in OutputContent" class="text item">
              {{item }}
            </div>
          </el-card>
        </div>
      </el-aside>

    </el-container>
  </div>
</template>

<script>
  import AutoCameraView from '../components/AutoCameraView'
  export default {
    name: 'HomePage',
    components:{AutoCameraView},
    mounted () {
      this.OutputContent.push("欢迎使用慧眼识物");
    },
    data () {
      return {
        SearchInput:'',
        OutputContent:[],
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->


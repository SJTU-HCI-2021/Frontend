<template>
  <!-- <div class="HomePage"> -->
  <div id="components-layout-demo-basic">
    <a-layout>
      <a-layout-header
        style="
          background: #fff;
          box-shadow: 0 2px 8px #f0f1f2;
          position: relative;
          z-index: 10;
          max-width: 100%;
        "
      >
        <div
          style="
            position: relative;
            height: auto;
            margin-right: 0;
            margin-left: 0;
            zoom: 1;
            display: block;
            box-sizing: border-box;
          "
        >
          <a-row>
            <a-col :span="4" align="start">欢迎来到慧眼识物</a-col>
            <a-col :span="2" align="start"></a-col>
            <a-col
              :span="12"
              style="
                border-left: 1px solid #ebedf0;
                float: left;
                height: 22px;
                line-height: 22px;
                padding-left: 16px;
                margin: 22px 0;
              "
            >
              <div style="display: flex">
                <i
                  aria-label="icon: search"
                  class="anticon anticon-search"
                  style="
                    display: inline-block;
                    color: inherit;
                    font-style: normal;
                    <!-- line-height: 0; -->
                    text-align: center;
                    text-transform: none;
                    <!-- vertical-align: -0.125em; -->
                    text-rendering: optimizeLegibility;
                    -webkit-font-smoothing: antialiased;
                  "
                  ><svg
                    viewBox="64 64 896 896"
                    data-icon="search"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                    class=""
                  >
                    <path
                      d="M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0 0 11.6 0l43.6-43.5a8.2 8.2 0 0 0 0-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"
                    ></path></svg
                ></i>
                <a-input
                  placeholder="请输入内容"
                  v-model="SearchInput"
                  class="input-with-select"
                  style="border: none; display: inline-block; margin: -8px 20px"
                >
                  <!-- <el-button slot="append" icon="el-icon-search"  /> -->
                  <!-- <el-button slot="append" icon="el-icon-delete" @click="resetSearch" /> -->
                </a-input>
                <a-button
                  shape="circle"
                  icon="search"
                  @click="search"
                  style="margin: -8px 10px"
                />
                <a-button
                  shape="circle"
                  icon="delete"
                  @click="resetSearch"
                  style="margin: -8px 0px"
                />
                <a-button
                  shape="circle"
                  icon="setting"
                  style="margin: -8px 10px"
                ></a-button>
              </div>
            </a-col>
            <a-col :span="4"></a-col>
          </a-row>
        </div>
      </a-layout-header>
      <a-layout-content>
        <el-container>
          <!-- <el-header>欢迎来到慧眼识物</el-header> -->
          <el-aside style="width: 40%; margin-left: 30px">
            <div class="LeftPart" style="margin-top: 0; width: 100%">
              <div style="margin-top: 10px"></div>
              <div style="margin-top: 30px">
                <AutoCameraView ref="myComent" />
              </div>
            </div>
          </el-aside>

          <el-aside style="width: 50%">
            <div
              class="RightPart"
              style="
                float: left;
                margin-left: 15px;
                width: 80%;
                height: 100%;
                margin-top: 30px;
              "
            >
              <el-card class="box-card" style="height: 75%">
                <h2>欢迎使用慧眼识物</h2>
                <div v-for="item in OutputContent" :key="item.box" class="text item">
                  <h4>{{ item.classId }} : {{ item.lastTrackedTime }} {{ item.des }}</h4>
                  <!-- {{ item }} -->
                </div>
              </el-card>

              <el-popover
                placement="top-start"
                title="模式选择"
                width="200"
                trigger="hover"
              >
                <el-switch
                  v-model="DetectMode"
                  active-text="实时检测"
                  inactive-text="长按输入"
                >
                </el-switch>
                <el-button slot="reference">模式切换</el-button>
              </el-popover>
            </div>
          </el-aside>
        </el-container>
        <el-container>
          <Record />
        </el-container>
      </a-layout-content>
      <a-layout-footer>Footer</a-layout-footer>
    </a-layout>
  </div>

  <!--    <AudioView/>-->
  <!--    <OldAudioView/>-->

  <!-- </div> -->
</template>

<script>
import AutoCameraView from "../components/AutoCameraView";
import AudioView from "../components/AudioView";
import Record from "../components/Record";
import OldAudioView from "../components/OldAudioView";
import Global from "../utils/Global";
export default {
  name: "HomePage",
  components: { OldAudioView, AutoCameraView, AudioView, Record },
  data() {
    return {
      SearchInput: "",
      OutputContent: Global.OutputContent,
      DetectMode: false,
    };
  },
  methods: {
    search() {
      Global.OutputContent = [];
      AutoCameraView.requestSearch(this.SearchInput);
      this.OutputContent = Global.OutputContent;
    },
    resetSearch() {
      AutoCameraView.resetSearch();
      Global.OutputContent = [];
      this.OutputContent = [];
    },
  },
  mounted() {
    console.log("In mounted");
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->

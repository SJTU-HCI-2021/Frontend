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
            <a-col :span="4" align="start" style="font-size: 24px; font-weight: 800">
              慧眼识物</a-col
            >
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
                <a-popover title="物体识别搜索框" placement="topLeft">
                  <template slot="content">
                    <p style="width: 300px">请输入要搜索的物体名称。</p>
                  </template>
                  <a-input
                    placeholder="请输入内容"
                    v-model="SearchInput"
                    class="input-with-select"
                    style="border: none; display: inline-block; margin: -8px 20px"
                    @keydown="resetSearch"
                    @keyup.enter.native="search"
                  />
                </a-popover>
                <a-popover title="搜索键">
                  <template slot="content">
                    <p style="width: 300px">
                      点击该按钮识别搜索框中的物体，请确保该物体已出现在摄像机的拍摄范围内。
                    </p>
                  </template>
                  <a-button
                    shape="circle"
                    icon="search"
                    @click="search"
                    style="margin: -8px 10px"
                  />
                </a-popover>
                <a-popover title="搜索重置键">
                  <template slot="content">
                    <p style="width: 300px">
                      重置搜索框中的输入内容与目前已有的搜索结果。
                    </p>
                  </template>
                  <a-button
                    shape="circle"
                    icon="delete"
                    @click="resetSearch"
                    style="margin: -8px 0px"
                  />
                </a-popover>
                <!-- <a-button
                  shape="circle"
                  icon="setting"
                  style="margin: -8px 10px"
                ></a-button> -->
              </div>
            </a-col>
            <a-col :span="4"></a-col>
          </a-row>
        </div>
      </a-layout-header>
      <a-layout-content class="space-align-container">
        <div class="LeftPart" style="margin-top: 30px">
          <AutoCameraView />
        </div>
        <Record />

        <div
          class="RightPart"
          style="
            float: left;
            margin-left: 15px;
            width: 100%;
            margin-top: 30px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
          "
        >
          <a-card
            title="识别结果"
            style="text-align: left"
            :headStyle="{'fontWeight': '800', 'fontSize': '26px'}"
          >
            <a-table :columns="columns" :data-source="OutputContent">
              <!-- <a slot="name" slot-scope="text">{{ text }}</a> -->
              <!-- <span slot="customTitle"><a-icon type="smile-o" /> 识别物体</span> -->
            </a-table>
          </a-card>
        </div>
      </a-layout-content>
      <a-layout-footer
        style="
          margin-top: 500px;
          background: #fff;
          box-shadow: 0 2px 8px #f0f1f2;
          position: relative;
          z-index: 10;
          max-width: 100%;
          background-color: #001529;
          color: white;
          font-size: 20px;
          font-weight: 800;
        "
        >慧眼识物</a-layout-footer
      >
    </a-layout>
  </div>
</template>

<script>
const columns = [
  {
    title: "识别物体名称",
    dataIndex: "classId",
    key: "classId",
  },
  {
    title: "上次追踪成功时间",
    dataIndex: "lastTrackedTime",
    key: "lastTrackedTime",
  },
  {
    title: "结果",
    dataIndex: "des",
    key: "des",
  },
];
import AutoCameraView from "../components/AutoCameraView";
import AudioView from "../components/AudioView";
import Record from "../components/Record";
import OldAudioView from "../components/OldAudioView";
import Global from "../utils/Global";
const key = "notification_key";
export default {
  name: "HomePage",
  components: { OldAudioView, AutoCameraView, AudioView, Record },
  data() {
    return {
      SearchInput: "",
      OutputContent: Global.OutputContent,
      DetectMode: false,
      columns,
      search_fail: false,
    };
  },
  methods: {
    openSearchFailNotification() {
      this.$notification["error"]({
        key,
        message: "识别失败",
        description:
          "程序没有成功识别到物体，请确保搜索的物体确实在拍摄范围内且输入框的输入合法。请确保画面没有反光等干扰因素导致识别结果失败。",
        duration: 0,
      });
    },
    search() {
      Global.OutputContent = [];
      AutoCameraView.requestSearch(this.SearchInput);
      this.OutputContent = Global.OutputContent;
      if (this.OutputContent.length === 0) {
        this.openSearchFailNotification();
      }
    },
    resetSearch() {
      AutoCameraView.resetSearch();
      Global.OutputContent = [];
      this.OutputContent = [];
    },
  }
};
</script>

<style scoped>
.space-align-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-left: 600px;
  margin-right: 600px;
  margin-bottom: 300px;
  /* background-color: white; */
}
.space-align-block {
  margin: 8px 4px;
  border: 1px solid #40a9ff;
  padding: 4px;
  flex: none;
}
.space-align-block .mock-block {
  display: inline-block;
  padding: 32px 8px 16px;
  background: rgba(150, 150, 150, 0.2);
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->

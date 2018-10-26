<template>
<div>
  <div style="padding:10px;">
     <Row v-for="item in searchList">
          <Col span="12">
              <Input placeholder="名字" v-model="item.text"></Input>
          </Col>
          <Col span="12">
              <Input placeholder="value" v-model="item.key"></Input>
          </Col>
      </Row>
  </div>
  <Button @click="add">新增一行</Button>
  <Input v-model="postUrl" placeholder="请求路径"></Input>
  <Input v-model="filename" placeholder="文件名字"></Input>
  <Table ref="dragable" border :columns="columns1" :data="data1" @on-selection-change='checkboxSelect'></Table>
  <Button @click="showTable">查看目录</Button>
  <Button @click="createFile">生成文件</Button>
  <Upload action="//jsonplaceholder.typicode.com/posts/" :before-upload='uploadBefore' :show-upload-list='false' accept='.json'>
        <Button icon="ios-cloud-upload-outline">上传JSON文件</Button>
  </Upload>
  <div>
    <a href="javascript:;" @click="backDir"><Icon type="md-arrow-back" />返回上一层</a>
  </div>
  <div>
      <a style="padding:10px;display:inline-block;" href="javascript:;" v-for="item in fileList" @click="showFileList(item)">{{item}}</a>
  </div>
  <div>
    <p v-for="item in logList">{{item}}</p>
  </div>
</div>
</template>
<script>
import sortable from "sortablejs";
export default {
  data() {
    return {
      fileList: [],
      nowPath: [],
      selectList: [],
      logList:[],
      filename: "",
      searchList: [
        {
          text: "",
          key: ""
        }
      ],
      columns1: [
        {
          type: "selection",
          width: 80
        },
        {
          title: "key",
          key: "key"
        },
        {
          title: "title",
          key: "title",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: this.data1[params.index].title
              },
              on: {
                input: e => {
                  params.row.title = e;
                  this.data1[params.index] = {
                    title: params.row.title,
                    key: params.row.key
                  };
                }
              }
            });
          }
        },
        {
          title: "render",
          key: "render",
          render: (h, parmas) => {
            return h("div", [
              h(
                "Checkbox",
                {
                  on: {
                    "on-change": val => {
                      parmas.row.render = val;
                      this.data1[parmas.index] = {
                        title: parmas.row.title,
                        key: parmas.row.key,
                        render: parmas.row.render
                      };
                    }
                  }
                },
                "删除按钮"
              )
            ]);
          }
        }
      ],
      data1: []
    };
  },
  methods: {
    uploadBefore(file) {
      let fr = new FileReader();
      fr.readAsText(file);
      const that = this;
      fr.onload = function() {
        console.log(this.result);
        let jsonObj = JSON.parse(this.result);
        for (let k in jsonObj) {
          that.data1.push({
            title: "",
            key: k,
            render: ""
          });
        }
      };
      this.initDrop();
      return false;
    },
    showTable() {
      console.log(this.data1);
      this.$http
        .post("/readFile", { path: this.nowPath.join("/") })
        .then(res => {
          this.fileList = res;
        });
    },
    initDrop() {
      let el = this.$refs["dragable"].$children[1].$el.children[1];
      sortable.create(el, {
        onStart: this.startFunc,
        onEnd: this.endFunc,
        onChoose: this.chooseFunc,
        chosenClass: "dropClass"
      });
    },
    startFunc(e) {
      // console.log('startFunc',e);
    },
    endFunc(e) {
      console.log("endFunc", e);
      let moveRow = this.data1[e.oldIndex];
      console.log("moveRow", moveRow);
      this.data1.splice(e.oldIndex, 1);
      this.data1.splice(e.newIndex, 0, moveRow);
      console.log(this.data1);
    },
    chooseFunc(e) {
      // console.log('chooseFunc',e);
    },
    showFileList(name) {
      let str = name.replace(/\s*/g, "");
      this.nowPath.push(str);
      this.showTable();
    },
    backDir() {
      this.nowPath.pop();
      this.showTable();
    },
    createFile() {
      this.$http
        .post("/", {
          filePath: this.nowPath.join("/"),
          fileName: this.filename,
          postUrl: this.postUrl,
          json: this.selectList,
          searchList:this.searchList
        })
        .then(res => {
          this.logList.push(res)
        });
    },
    checkboxSelect(val) {
      console.log(val);
      this.selectList = val;
      console.log(this.data1);
    },
    add() {
      this.searchList.push({
        text: "",
        key: ""
      });
    }
  }
};
</script>
<style scoped lang='less'>
</style>
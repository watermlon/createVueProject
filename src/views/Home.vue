<template>
<div>
  <Input v-model="filename"></Input>
  <Table ref="dragable" border :columns="columns1" :data="data1"></Table>
  <Button @click="showTable">查看</Button>
  <Button @click="createFile">生成</Button>
  <Upload action="//jsonplaceholder.typicode.com/posts/" :before-upload='uploadBefore' :show-upload-list='false'>
        <Button icon="ios-cloud-upload-outline">Upload files</Button>
  </Upload>
  <div>
    <a href="javascript:;" @click="backDir"><Icon type="md-arrow-back" />返回上一层</a>
  </div>
  <div>
      <a style="padding:10px;display:inline-block;" href="javascript:;" v-for="item in fileList" @click="showFileList(item)">{{item}}</a>
  </div>
</div>
</template>
<script>
import sortable from "sortablejs";
export default {
  data() {
    return {
      fileList:[],
      nowPath:[],
      filename:'',
      columns1: [
        {
          type: 'selection',
          width:80
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
            key: k
          });
        }
      };
      this.initDrop()
      return false;
    },
    showTable() {
      console.log(this.data1);
      this.$http.post('/readFile',{path:this.nowPath.join('/')}).then(res=>{
        this.fileList = res
      })
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
    showFileList(name){
      let str = name.replace(/\s*/g,"");
      this.nowPath.push(str)
      this.showTable()
    },
    backDir(){
      this.nowPath.pop()
      this.showTable()
    },
    createFile(){
      this.$http.post('/',{
        filePath:this.nowPath.join('/'),
        fileName:this.filename,
        json:JSON.stringify(this.data1)
      }).then(res=>{

      })
    }
  }
};
</script>
<style scoped lang='less'>
</style>
<template>
    <div>
        <Table border :columns="tableTitle" :data="tableData" stripe></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="total" :current="1" show-sizer transfer @on-change="changePage" @on-page-size-change="changePageSize"></Page>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "tableData",
  props: {
    tableTitle: Array, //表头  必填
    postData: Object, //请求参数  必填
    postUrl: String, //请求地址  必填
    method: String, //请求方法  不必填
    option: Object //页码和总页数  不必填
  },
  data() {
    return {
      total: 0,
      tableData: [],
      postDataObj: {},
      methodData: "post",
      optionData: {
        page: "page",
        rows: "rows"
      }
    };
  },
  created() {
    this.postDataObj = this.postData;
    if (this.method) {
      this.methodData = this.method;
    }
    if (this.option) {
      if (this.option.page) {
        this.optionData.page = this.option.page;
      }
      if (this.option.rows) {
        this.optionData.rows = option.rows;
      }
    }
    this.getData();
  },
  watch: {
    postData() {
      this.postDataObj = this.postData;
      this.getData();
    }
  },
  methods: {
    getData() {
      this.$http[this.methodData](this.postUrl, this.postData).then(res => {
        if (res.status == 200) {
          this.tableData = res.rows;
          this.total = res.total;
        }
      });
    },
    changePage(page) {
      this.postDataObj[optionData.page] = page;
      this.getData();
    },
    changePageSize(pageSize) {
      this.postDataObj[optionData.rows] = pageSize;
      this.getData();
    }
  }
};
</script>

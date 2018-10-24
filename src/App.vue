<template>
  <router-view/>
</template>

<style lang="less">
.clearfix::after {
  clear: both;
  display: block;
  content: "";
  height: 0;
  visibility: hidden;
}
body {
  .ivu-select-dropdown {
    max-height: 500px;
  }
}
</style>

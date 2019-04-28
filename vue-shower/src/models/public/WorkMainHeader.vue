<template>
  <div>
    <a-breadcrumb>
      <a-breadcrumb-item>
        <router-link :to="{ path: '/' }">首页</router-link>
      </a-breadcrumb-item>
      <a-breadcrumb-item :key="headerItem" v-for="headerItem in headerItems">{{headerItem}}</a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script>
  export default {
    name: 'WorkMainHeader',
    props: {
      headerItems: {
        type: Array
      }
    },
    data() {
      return {
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .ant-breadcrumb{
    padding:15px 0 15px 10px;
    background-color: #F5F5F5;
    margin:0 0 10px 0;
    text-align:left;
  }
  .a-breadcrumb-item{
    color:#448aff;
  }

  .fa-icon {
    width:16px;
    height:16px;
  }
</style>


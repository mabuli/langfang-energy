<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view></router-view>
    </div>
  </a-locale-provider>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  export default {
    name: 'App',
    data () {
      return {
        locale: zhCN
      }
    },
  }
</script>
<style>
  body,html{
    width:100%;
    height:100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin:0;
    height:100%;
    width:100%;
    /*margin-top: 60px;*/
  }
  body{
    margin:0
  }
</style>

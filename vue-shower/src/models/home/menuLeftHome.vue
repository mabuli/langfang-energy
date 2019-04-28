<template>
    <div class="home" >
      <div class="container-header">
        <header class="header" style="text-align: right; font-size: 12px">
          <div class="work-menu-group">
            <WorkLeftMenuGroup :sysName="sysName" ></WorkLeftMenuGroup>
          </div>
          <div class="header-options">
            <!--<icon name="home"></icon>-->
            <div class="personal-infos">
              <div class="personal-pic">
                <icon name="humenpic"></icon>
              </div>
              <div class="personal-name">
                欢迎,&emsp;{{loginUserInfo.user_name}}
              </div>

            </div>

            <div @click="logout" class="icon-mount">
              <a-tooltip class="item" effect="dark" content="退出系统" placement="bottomRight">
                <icon  name="logoutallfill"></icon>
              </a-tooltip>
            </div>
            <div @click="gotoWelcome" class="icon-mount">
              <a-tooltip class="item" effect="dark" content="主页" placement="bottomRight">
                <icon name="homeallfill"></icon>
              </a-tooltip>
            </div>
            <div v-if="!fullScreen" @click="changeScreen" class="icon-mount">
              <a-tooltip class="item" effect="dark" content="全屏" placement="bottomRight">
                <icon name="fullscreen" class="fa-icon-changescreen"></icon>
              </a-tooltip>
            </div>
            <div v-if="fullScreen" @click="changeScreen" class="icon-mount">
              <a-tooltip class="item" effect="dark" content="退出全屏" placement="bottomRight">
                <icon name="outfullscreen" class="fa-icon-changescreen"></icon>
              </a-tooltip>
            </div>

          </div>
        </header>
      </div>

      <div class="container-root">
        <div class="container-root-menu">
          <a-menu mode="inline" :inlineCollapsed="isCollapse" class="menu-style">
            <a-menu-item @click="collapseMenu" class="nobg">
              <a-icon :type="collapseText"></a-icon><span class="title-style">&nbsp;收缩菜单</span>
            </a-menu-item>
            <template v-for="item in menuList">
              <WorkLeftMenu :menuData="item" :key="item.id"/>
            </template>
          </a-menu>
        </div>

        <div :class="isCollapse?'container-root-context-collapse':'container-root-context'">
          <router-view></router-view>
        </div>

      </div>
    </div>
</template>

<script>
  import WorkLeftMenuGroup from "@/models/menu/left-menu-group"
  import WorkLeftMenu from "@/models/menu/left-menu"

  export default {
    name:"MenuLeftHome",
    props:{
      menuList:{
        type:Array
      },
      sysName:{
        type:String
      },
      loginUserInfo:{
        type:Object
      }
    },
    data() {
      return {
        isCollapse:false,
        fullScreen:false,
        collapseText:'double-right',
        menuIcon:{
          '权限管理':'setting',
          '功能查看':'ellipsis',
          '用户管理':'customer-service',
          '角色管理':'solution',
          '机构管理':'appstore',
          '行政机构管理':'appstore',
          '监管用户管理':'customer-service'
        }
      }
    },
    components: {
      WorkLeftMenuGroup,
      WorkLeftMenu
    },
    methods:{
      mainPageChange:function(pageName){
        console.log(pageName);
      },
      logout:function(commound){
        const $this = this
        $this.Confirm({
          title:'提示',
          okText:'退出',
          content:'退出系统将丢失当前未保存的相关操作，确定退出？',
          onOk () {
            $this.$http.post(process.env.BASE_API+"/sys/login/logout.do",{},{withCredentials: true}).then(res => {
              let responseData = res.data ;
              try{
                responseData = JSON.parse(responseData)
              }catch(e){}
              if (responseData.result == 'SUCCESS') {
                if(responseData.faild_reason === 'FORWARD_CAS'){
                  let forwardUrl = responseData.resultData
                  window.location = forwardUrl
                }else{
                  $this.Message.success("登出成功")
                  $this.$router.push({'path':'/'})
                }
              }else{
                $this.Message.error(responseData.result)
              }
            })
          }
        })
      },
      gotoWelcome(){
        this.$router.push({'path':'/'})
      },
      changeScreen(){
        let isFullScreen = document.fullscreenElement || document.mozFullScreenElement||document.webkitFullscreenElement

        this.fullScreen = !isFullScreen
        const element = document.documentElement
        if(this.fullScreen){//全屏
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        }else{
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          }
        }
      },
      exitHandler(){
        console.log("ehere")
        if (!document.webkitIsFullScreen &&!document.mozFullScreen &&!document.msFullscreenElement) {
          this.fullScreen = false
          console.log("mmmmmmm")
        }else{
          console.log("yyyyy")
        }
      },
      collapseMenu(){
        if(this.isCollapse == true){
          this.isCollapse = false
          this.collapseText = "double-left"
        }else{
          this.isCollapse = true
          this.collapseText = "double-right"
        }
        console.log(this.collapseText)
      },
      menuClick(menuUrl){
        this.$router.push({path: menuUrl})
      },
      getIco(name){
        return this.menuIcon[name] || 'pie-chart'
      },
    },
    mounted:function(){
      if(this.$route.fullPath=='/home'){
        this.$router.push({"path":"welcome"})
      }
      const $this = this
      document.onkeydown = function(e) {
        let key = window.event.keyCode;
        if (key== 122 ) {//屏蔽F11快捷键
          return false
        }
      }
      if (document.addEventListener) {
        document.addEventListener('webkitfullscreenchange', this.exitHandler, false);
        document.addEventListener('mozfullscreenchange', this.exitHandler, false);
        document.addEventListener('fullscreenchange', this.exitHandler, false);
        document.addEventListener('MSFullscreenChange', this.exitHandler, false);
      }
    }
  };
</script>


<style lang="css">
  .menu-style:not(.ant-menu-inline-collapsed){
    background-color:#3E3958;
    text-color:"#ffffff";
    /*active-text-color:"#3f8aff";*/
    height:95%;
    width: 200px;
  }
  .ant-menu{
    background-color: #3E3958 !important;
    text-align: left;
    color:#b1b4c3;
  }
  .ant-menu-inline-collapsed{
    background-color:#3E3958;
    height:95%;
  }

  .ant-menu-submenu-open{background-color:#e6f7ff}
  .ant-menu-submenu > .ant-menu{background-color: #3E3958;}
  .ant-menu .nobg{background-color: #3E3958 !important;}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>

  .menu{
    background-color: #2e3d50;
    height:100%;
  }

  .header{
    height:100% !important;
  }

  .work-left-menu-header{
    width:calc(100% - 300px);
    height:100%;
    float: left;
    text-align: left;
    font-size:20px;
  }
  .el-aside {
    color: #333;
  }

  .ant-menu-item a{
    text-decoration:none;
    color:#ffffff;
  }

  .home{
    width:100%;
    height:100%;
    /*padding:20px;*/
    background-color: #3CD2E6 !important;
  }

  .work-menu-group{
    width:50%;
    height:100%;
    float: left;
  }

  .header-options{
    width:50%;
    height:100%;
    float:right;
    color:black;
    text-align: right;
  }

  .menu{
    background-color: rgb(238, 241, 246);
  }

  .container-header {
    width:100%;
    color: black;
    /*background-color: #EBF2FE;*/
    background-color: #4B39E4;
    height:40px !important;
    /*box-shadow:    0px 0px 0px 0px black,*/
    /*0px 0px 0px 0px #3bee17,*/
    /*0px 0px 0px 0px #2279ee,*/
    /*0px 10px 10px 0px black;*/
    float:left;
  }

  .container-root{
    width:100%;
    height:calc(100% - 43px);
    background-color: #ffffff;
    margin-top:3px;
    box-shadow:    0px 0px 0px 0px blueviolet,
    0px 3px 10px 0px blueviolet,
    0px 3px 10px 0px blueviolet,
    0px 3px 10px 0px blueviolet;
    float:left;
  }

  .container-root-menu{
    height:100%;
    float:left;
    background-color: #3E3958;
    box-shadow:    0px 0px 0px 0px blueviolet,
    0px 0px 0px 0px blueviolet,
    0px 0px 10px 0px blueviolet,
    0px 0px 0px 0px blueviolet;
  }

  .container-root-context-collapse{
    width:calc(100% - 65px);
    height:100%;
    float:left;
  }

  .container-root-context{
    width:calc(100% - 201px);
    height:100%;
    float:left;
  }

  .el-aside {
    color: #333;
  }

  .el-container{
    background-color: #ffffff;
  }

  .personal-infos{
    width:200px;
    height:100%;
    background-color: #4B83BB;
    float: right;
  }

  .personal-pic{
    width:80px;
    height:100%;
    float: left;
    text-align: left;
  }

  .personal-name{
    color:white;
    width:120px;
    height:100%;
    float: right;
    padding:10px 0 0 0 ;
    text-align: left;
  }

  .icon-mount{
    float: right;
    height:100%;
    border-right: 1px solid white;

  }

  .icon-mount:hover{
    background-color: #8D0063;
    box-shadow: 0px 5px 20px black;
    cursor: pointer;
  }

  .fa-icon {
    width:25px;
    height:25px;
    margin:10px 15px 0 15px;
  }

  .fa-icon-changescreen{
    width:25px;
    height:25px;
    margin:10px 10px 0 10px;
  }

  .login-user-name{
    width:120px;
    height:25px;
    line-height: 25px;
    border-radius: 15px;
    background-color: #00f2a4;
    margin-top:13px;
    color:white;
    font-size: 18px;
    text-align: center;
    font-weight: bolder;
    padding:0px;
    cursor: pointer;
    float:right;
  }

  .loginUserInfoRow{
    margin:0 !important;
  }


</style>

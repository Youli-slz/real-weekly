<template>
  <div class="admin-content">
    <el-menu theme="dark" default-active="1" class="el-menu-demo header" mode="horizontal" @select='handselect1'>
      <el-submenu index="1" class="top">
        <template slot="title">{{user}}</template>
        <el-menu-item index="loginout">退出</el-menu-item>
      </el-submenu>

    </el-menu>
    <div class="main">
      <div class="admin-slider">
      <el-menu default-active="1-4-1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse" @select='handselect'>
        <!-- <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-message"></i>
            <span slot="title">导航一</span>
          </template>
          <el-menu-item-group>
            <span slot="title">分组一</span>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="分组2">
            <el-menu-item index="1-3">选项3</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <span slot="title">选项4</span>
            <el-menu-item index="1-4-1">选项1</el-menu-item>
          </el-submenu>
        </el-submenu> -->
        <!-- <el-menu-item index="2">
          <i class="el-icon-menu"></i>
          <span slot="title">导航二</span>
        </el-menu-item> -->
        <el-menu-item index="/carousels">
          <i class="el-icon-picture"></i>
          <span slot="title">轮播图</span>
        </el-menu-item>
        <el-menu-item index="/weekly">
          <i class="el-icon-menu"></i>
          <span slot="title">周刊</span>
        </el-menu-item>
        <el-menu-item index="/bookgroup">
          <i class="el-icon-setting"></i>
          <span solt="title">书籍分组配置</span>
        </el-menu-item>
        <el-submenu index="2">
          <template slot="title"><i class="el-icon-menu"></i>微信小程序</template>
            <el-menu-item-group>
              <el-menu-item index="/articleORradiolist">电台/美文</el-menu-item>
            </el-menu-item-group>
        </el-submenu>

      </el-menu>
      </div>
      <div class="admin-container">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'main',
  data() {
    return {
      isCollapse: false,
      active: '/userlist',
      user: ''
    }
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getCookie: function (name) {
      var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

      if (arr = document.cookie.match(reg))

        return unescape(arr[2]);
      else
        return null;
    },
    handselect(index, indexPath) {
      if (index == '/sendmessage') {
        window.open(index)
        return false
      }
      else if (index == '/groupmessage') {
        window.open(index)
        return false
      }
      this.$router.push(index)
    },
    handselect1(index, indexPath) {
      if (index == '/loginrobot') {
        this.$router.push('/loginrobot')
      }
      else if (index == 'loginout') {
        var self = this;
        var ca = self.getCookie('token');
        // self.$router.push("/");
        this.axios.get('http://wxmp.gatao.cn/realtech/logout?token=' + ca)
          .then((response) => {
            var data = response.data
            if (data.code == 0) {
              self.$router.push("/")
            }

          }, (response) => {
            console.log(response);
          });
      }
    }
  },
  created: function() {
    this.active = this.$route.path;
  }
}
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 100%;
}
  .admin-content{position: relative;height: 100%;}
  .admin-content:after,.admin-content::before{content: '';display: table}
  .admin-slider{width: 200px;float: left;position: static;height: 100%}
  .admin-slider>ul{height: 100%}
  .el-menu--horizontal .top{float: right !important}
  .admin-container{display: flex;padding:20px;height: 88%;overflow-y: scroll;}
  .header{position: fixed;top: 0;width: 100%;left:0;z-index:2000}
  .main{position: relative;height: 100%;}  /*padding-top 在服务器上没有，显示正常*/
</style>

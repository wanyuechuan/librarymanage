<template>
  <div class="home">
    <div class="navigation">
      <div class="nav-box">
        <div class="left">
          <img class="logo" src="@/assets/navlogo.png" alt="logo" />
        </div>
        <div class="right">
          <h2>图书管理系统</h2>
        </div>
      </div>
      <div class="user-content">
        <el-dropdown class="dropstyle">
          <span class="el-dropdown-link">
            {{ admin.username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="quit">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="container">
      <div class="left">
        <el-menu
          :router="true"
          :default-active="path"
          class="menus"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="/home/homePage">
            <el-icon><house /></el-icon>
            <span>首页</span>
          </el-menu-item>
          <el-menu-item index="/home/user">
            <el-icon><user /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/home/admin">
            <el-icon><avatar /></el-icon>
            <span>管理员列表</span>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><edit /></el-icon>
              <span>图书管理</span>
            </template>
            <el-menu-item index="/home/category">图书分类管理</el-menu-item>
            <el-menu-item index="/home/book">图书列表</el-menu-item>
          </el-sub-menu>

          <el-sub-menu index="2">
            <template #title>
              <el-icon><stopwatch /></el-icon>
              <span>关于页面</span>
            </template>
            <el-menu-item index="/home/about">关于详情</el-menu-item>
          </el-sub-menu>
        </el-menu>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
export default {
  name: "UpdatefileHome",

  setup() {
    const router = useRouter();

    const admin = Cookies.get("admin") ? JSON.parse(Cookies.get("admin")) : {};

    let path = router.currentRoute.value.path;

    function handleOpen() {}
    function handleClose() {}
    function subClose(e) {
      console.log(e);
    }

    function quit() {
      Cookies.remove("user");
      router.push("/login");
    }

    return {
      handleOpen,
      handleClose,
      subClose,
      path,
      quit,
      admin,
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="css" scoped>
.home {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.navigation {
  width: 100%;
  height: 5%;
}
.container {
  width: 100%;
  height: 95%;
  display: flex;
}
.container .left {
  width: 300px;
  height: 100%;
}
.container .right {
  width: calc(100% - 300px);
  height: 100%;
}
.container .left .mb-2 {
  font-size: 20px;
}
.container .left .menus {
  height: 100%;
  border-right: 3px solid #eee;
}
.navigation {
  display: flex;
  padding: 10px;
  border-bottom: 3px solid #eee;
  transition: all 0.4s;
}
.navigation .nav-box {
  flex: 1;
  display: flex;
}
.navigation .user-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 2%;
}
.navigation .user-content .dropstyle {
  cursor: pointer;
  outline: none;
}
.navigation .nav-box .left {
  height: 100%;
  display: flex;
  align-items: center;
}
.navigation .nav-box .right {
  width: 70%;
  height: 100%;
  display: flex;
  align-items: center;
}
.navigation .left .logo {
  height: 100%;
}
</style>
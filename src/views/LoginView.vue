<template>
  <div class="l-container">
    <el-card v-if="LoginAdmin[0]" class="cover">
      <el-button
        style="position: relative; right: -85%; margin-bottom: 10px"
        @click="closeSlide"
        >关闭</el-button
      >
      <div style="text-align: center; padding: 5px; font-size: 20px">
        {{ verifyTitle }}
      </div>

      <slide-verify
        :l="42"
        :r="10"
        :w="400"
        :h="200"
        :imgs="imgs"
        :slider-text="text"
        :accuracy="accuracy"
        @success="onSuccess"
        @fail="onFail"
        @refresh="onRefresh"
      ></slide-verify>
    </el-card>
    <div class="img-box"></div>
    <div class="from-box">
      <div class="from-head">
        <h1>登录用户</h1>
        <p>欢迎使用智慧图书管理系统</p>
      </div>
      <el-form ref="ruleRef" :model="loginUser" :rules="rules" class="dynamic">
        <el-form-item class="row" prop="username">
          <el-input
            v-model="loginUser.username"
            placeholder="用户名/邮箱"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item class="row" prop="password">
          <el-input
            v-model="loginUser.password"
            placeholder="密码"
            size="large"
            show-password
            :prefix-icon="Lock"
            clearable
          />
        </el-form-item>

        <div class="row">
          <el-button type="primary" class="lButton" @click="loginListener"
            >登录</el-button
          >
        </div>
      </el-form>
      <div class="tips">
        <el-divider> <span class="tips-content">还没账号？</span> </el-divider>
      </div>
      <div class="row">
        <router-link class="jump" to="/register">去注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
// 滑块

import { User, Lock } from "@element-plus/icons-vue";
import { ref, reactive } from "vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import request from "@/utils/request";
import SlideVerify, { SlideVerifyInstance } from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";
import img from "@/assets/v1.jpg";

export default {
  name: "UpdatefileLoginView",
  components: { SlideVerify },

  setup() {
    // 滑块属性
    const verifyTitle = "请进行滑动验证";

    const text = ref("向右滑动->");
    const accuracy = ref(5);

    const imgs = ref([img]);

    const router = useRouter();

    let loginUser = reactive({
      username: "",
      password: "",
    });

    let LoginAdmin = reactive([]);

    let ruleRef = ref(null);

    const rules = reactive({
      username: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur",
        },
      ],
    });

    function loginListener() {
      ruleRef.value.validate((vaild) => {
        if (vaild) {
          request
            .post("/user/login", loginUser)
            .then((res) => {
              if (res.code == "200") {
                LoginAdmin.splice(0, LoginAdmin.length, res.data);
              } else {
                ElMessage.error(res.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          ElMessage.warning("请输入账号密码");
        }
      });
    }

    const onSuccess = () => {
      ElMessage.success("登录成功");
      Cookies.set("admin", JSON.stringify(LoginAdmin[0]));
      router.push("/home");
    };

    const onFail = () => {
      ElMessage.error("验证失败");
    };

    const onRefresh = () => {
      // console.log("刷新");
    };

    function closeSlide() {
      LoginAdmin.pop();
    }

    return {
      loginUser,
      loginListener,
      User,
      Lock,
      rules,
      ruleRef,
      LoginAdmin,
      text,
      accuracy,
      imgs,
      onSuccess,
      onFail,
      onRefresh,
      closeSlide,
      verifyTitle
    };
  },
  mounted() {},

  methods: {},
};
</script>

<style lang="css" scoped>
.l-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
}
.img-box {
  flex: 1;
  background: url("../assets/lbg.jpg") -110px 0px no-repeat;
  background-size: cover;
}

.from-box {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.from-box .from-head {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 0px 0px 25px 0px;
}
.from-head h1 {
  font-weight: 400;
  margin-bottom: 5px;
}
.from-box .row {
  width: 50%;
  padding: 10px 0px 10px 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.verify-input {
  width: 60%;
}
.v-content {
  width: 40%;
  height: 100%;
}
.LoginButton {
  width: 100%;
  height: 40px;
}
.tips {
  width: 50%;
}
.tips .tips-content {
  font-size: 15px;
  color: rgb(146, 146, 146);
}
.jump {
  font-size: 16px;
  color: rgb(77, 77, 77);
}

.lButton {
  width: 100%;
  height: 40px;
}

.dynamic {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.cover {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>
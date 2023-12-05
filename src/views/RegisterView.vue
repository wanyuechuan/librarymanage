<template>
  <div class="l-container">
    <el-card v-if="verifyFlag" class="cover">
      <el-button
        style="position: relative; right: -85%; margin-bottom: 10px"
        @click="closeSlide"
        >关闭</el-button
      >
      <div style="text-align:center; padding:5px; font-size:20px">{{verifyTitle}}</div>
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
      >
      </slide-verify>
    </el-card>
    <div class="img-box"></div>

    <div class="from-box">
      <div class="from-head">
        <h1>注册用户</h1>
        <p>欢迎注册智慧图书管理，请在下方输入信息</p>
      </div>
      <el-form
        ref="formRef"
        :rules="rules"
        :model="registerUser"
        class="dynamic"
      >
        <el-form-item
          prop="username"
          class="row"
          :rules="[
            {
              required: true,
              message: '输入不能为空！',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="registerUser.username"
            placeholder="用户名"
            size="large"
            :prefix-icon="User"
            clearable
          />
        </el-form-item>
        <el-form-item
          class="row"
          prop="password"
          :rules="[
            {
              required: true,
              message: '输入不能为空！',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="registerUser.password"
            placeholder="密码"
            size="large"
            :prefix-icon="Lock"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item class="row" prop="college">
          <el-select
            v-model="registerUser.college"
            size="large"
            clearable
            placeholder="选择您的学院"
            style="width: 100%; height: 100%"
          >
            <template #prefix>
              <span>
                <el-icon><Finished /></el-icon>
              </span>
            </template>

            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="row" prop="email">
          <el-input
            v-model="registerUser.email"
            size="large"
            placeholder="请输入邮箱"
            :prefix-icon="Message"
          />
        </el-form-item>

        <div class="row">
          <el-input
            class="verify-input"
            v-model="registerUser.code"
            placeholder="邮箱验证码"
            :prefix-icon="ChatLineSquare"
            size="large"
            clearable
          />
          <div class="v-content">
            <el-button
              type="primary"
              class="getButton"
              :disabled="codetime > 0"
              @click="validateEmail"
              >{{
                codetime > 0 ? "请稍后" + codetime : "获取验证码"
              }}</el-button
            >
          </div>
        </div>

        <div class="row">
          <el-button type="primary" class="lButton" @click="registerListener"
            >注册</el-button
          >
        </div>
      </el-form>
      <div class="tips">
        <el-divider> <span class="tips-content">已有账号？</span> </el-divider>
      </div>
      <div class="row">
        <router-link class="jump" to="/login">立即登录</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import { User, Lock, Message, ChatLineSquare } from "@element-plus/icons-vue";
import request from "@/utils/request";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import SlideVerify, { SlideVerifyInstance } from "vue3-slide-verify";
import "vue3-slide-verify/dist/style.css";
import img from "@/assets/v1.jpg";

export default {
  name: "UpdatefileLoginView",
  components: { SlideVerify },

  setup() {
    let verifyFlag = ref(false);

    const formRef = ref(null);
    
    const verifyTitle = "请进行滑动验证";
    const text = ref("向右滑动->");
    const accuracy = ref(5);

    const imgs = ref([img]);

    const onSuccess = () => {
      verifyFlag.value = false;
      codetime.value = 60;

      request({
        method: "post",
        url: "/user/api/auth/valid-register-email",
        params: {
          email: registerUser.email,
        },
      })
        .then((res) => {
          if (res.code === "200") {
            ElMessage.success("验证码已发送");
            setInterval(() => codetime.value--, 1200);
          } else {
            codetime.value = 0;
            ElMessage.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const onFail = () => {
      ElMessage.error("验证失败");
    };

    const onRefresh = () => {
      // console.log("刷新");
    };
    function closeSlide() {
      verifyFlag.value = false;
    }

    let registerUser = reactive({
      username: "",
      password: "",
      email: "",
      code: "",
      college: "",
    });
    const router = useRouter();

    let codetime = ref(0);

    // 判断信息

    onMounted(() => {
      console.log(formRef.value);
    });
    const checkEmail = (rule, value, callback) => {
      if (!/[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value)) {
        return callback(new Error("请输入正确的邮箱"));
      }
      callback();
    };
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入正确的密码"));
      }
      if (!(value.length >= 6 && value.length <= 12)) {
        return callback(new Error("密码小于6位，不大于12位"));
      }
      callback();
    };

    // 校验规则
    const rules = reactive({
      username: [
        {
          required: true,
          message: "请输入姓名",
          trigger: "blur",
        },
      ],
      email: [
        {
          required: true,
          validator: checkEmail,
          trigger: "blur",
        },
      ],
      password: [
        {
          required: true,
          validator: checkPassword,
          trigger: "blur",
        },
      ],
      college: [
        {
          required: true,
          message: "请选择您的学院",
          trigger: "change",
        },
      ],
    });

    let options = reactive([
      {
        value: "信息工程学院",
        label: "信息工程学院",
      },
      {
        value: "机械工程学院",
        label: "机械工程学院",
      },
      {
        value: "电气工程学院",
        label: "电气工程学院",
      },
      {
        value: "船舶工程学院",
        label: "船舶工程学院",
      },
      {
        value: "汽车工程学院",
        label: "汽车工程学院",
      },
      {
        value: "建筑工程学院",
        label: "建筑工程学院",
      },
      {
        value: "经济管理学院",
        label: "经济管理学院",
      },
      {
        value: "财会金融学院",
        label: "财会金融学院",
      },
    ]);

    // 获取验证码
    function validateEmail() {
      formRef.value.validate((vaild) => {
        if (vaild) {
          verifyFlag.value = true;
        } else {
          ElMessage.warning("请完善信息");
        }
      });
    }

    function registerListener() {
      if (registerUser.code == "") {
        ElMessage.warning("请输入验证码!");
        return;
      }
      formRef.value.validate((vaild) => {
        if (vaild) {
          request({
            method: "post",
            url: "/user/register",
            data: {
              username: registerUser.username,
              password: registerUser.password,
              password2: registerUser.password2,
              email: registerUser.email,
              college: registerUser.college,
            },
            params: {
              code: registerUser.code,
            },
          })
            .then((res) => {
              if (res.code == "200") {
                ElMessage.success(res.msg);
                router.push("/login");
              } else {
                ElMessage.error(res.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          ElMessage.warning("输入有误");
        }
      });
    }

    return {
      registerUser,
      options,
      User,
      Lock,
      Message,
      ChatLineSquare,
      codetime,
      validateEmail,
      registerListener,
      rules,
      formRef,
      text,
      accuracy,
      imgs,
      onSuccess,
      onFail,
      onRefresh,
      closeSlide,
      verifyFlag,
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
  padding: 5px 0px 5px 0px;
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
.lButton {
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
.getButton {
  width: 98%;
  height: 100%;
  margin-left: 2%;
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
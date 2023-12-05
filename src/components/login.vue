<template>
  <div class="container">
    <div class="from-box" ref="fromBox">
      <div class="register-box" ref="registerBox">
        <h1 class="title">REGISTER</h1>
        <div class="row">
          <input
            type="text"
            name="r-username"
            class="userinput"
            placeholder=""
            v-model="registerUser.username"
          />
          <label for="username" class="movelabel">用户名</label>
        </div>
        <div class="row">
          <input
            type="password"
            name="r-password"
            class="userinput" 
            placeholder=""
            v-model="registerUser.password"
          />
          <label for="password" class="movelabel">密码</label>
        </div>
        <div class="row">
          <input
            type="password"
            name="r-password2"
            class="userinput"
            v-model="registerUser.password2"
            placeholder=""
          />
          <label for="password" class="movelabel">确认密码</label>
        </div>
        <div class="row">
          <button @click="registerListener">注册</button>
        </div>
      </div>
      <div class="login-box" ref="loginBox">
        <h1 class="title">LOGIN</h1>
        <div class="row">
          <input
            type="text"
            name="username"
            class="userinput"
            v-model="loginUser.username"
            placeholder=""
          />
          <label for="username" class="movelabel">用户名</label>
        </div>
        <div class="row">
          <input
            type="password"
            name="password"
            class="userinput"
            placeholder=""
            v-model="loginUser.password"
          />
          <label for="password" class="movelabel">密码</label>
        </div>
        <div class="row">
          <button @click="loginListener">登录</button>
        </div>
      </div>
    </div>

    <div class="cont-box">
      <div class="left">
        <h1 class="title">欢迎使用<span class="t-title">系统</span></h1>
        <p class="subtitle">快来学习一下吧</p>
        <img src="../assets/two.png" alt="" class="c-img" />
        <p class="tips">已有账号?</p>
        <button class="go" ref="gologin" @click="boxmove(true)">去登录</button>
      </div>
      <div class="right">
        <h1 class="title">欢迎使用<span class="t-title">系统</span></h1>
        <p class="subtitle">快来学习一下吧</p>
        <img src="../assets/one.png" alt="" class="c-img" />
        <p class="tips">没有账号?</p>
        <button class="go" ref="goregister" @click="boxmove(false)">
          去注册
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
export default {
  name: "UpdatefileLogin",



  setup() {
    const fromBox = ref(null);
    const registerBox = ref(null);
    const loginBox = ref(null);
    

    let registerUser = {
      username: "",
      password: "",
      password2: "",
    };

    let loginUser = {
      username: "",
      password: "",
    };

    function registerListener() {
      console.log(123);
    }



    function responseHandler(infoObj) {
      switch (infoObj.state) {
        case 0:
          alert(infoObj.info)
          break;
        case 1:
          alert(infoObj.info)
          break;
      }
      
    }

    function loginListener() {
      axios({
        method:'post',
        url: "http://localhost:9999/login",
        data: {
          username:loginUser.username,
          password:loginUser.password,
        },
    
      }).then((result) => {
        console.log(result.data);
        responseHandler(result.data);


      }).catch((err) => {
        console.log(err);
      });
    }





    function boxmove(flag) {
      if (flag) {
        fromBox.value.style.left = "5%";
        registerBox.value.style.display = "none";
        loginBox.value.style.display = "block";
      } else {
        fromBox.value.style.left = "45%";
        loginBox.value.style.display = "none";
        registerBox.value.style.display = "block";
      }
    }

    return {
      boxmove,
      fromBox,
      registerBox,
      loginBox,
      registerUser,
      loginUser,
      registerListener,
      loginListener,
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="css" scoped>
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f5f5f5;
  box-shadow: 8px 6px 8px 3px #576574;
}

.title {
  color: #576574;
}
.subtitle {
}
.tips {
  color: #636e72;
}
.t-title {
  color: #0abde3;
}
.cont-box {
  width: 800px;
  height: 500px;
  display: flex;
}
.cont-box .right,
.cont-box .left {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.cont-box p {
  margin-top: 20px;
  margin-bottom: 20px;
}
.cont-box .c-img {
  width: 150px;
  height: 120px;
}
.cont-box .go {
  padding: 10px;
  border: 0;
  background: 0;
  border: 1px solid #5f27cd;
  border-radius: 5px;
  color: #5f27cd;
  cursor: pointer;
  transition: all 0.5s;
}
.cont-box .go:hover {
  padding: 10px;
  border: 0;
  background: 0;
  border: 1px solid #5f27cd;
  border-radius: 5px;
  background-color: #5f27cd;
  color: #fff;
}
.container .from-box {
  position: absolute;
  top: -5%;
  left: 5%;
  width: 400px;
  background-color: #57606f;
  height: calc(100% + 10%);
  border-radius: 5px;
  transition: all 0.7s ease;
}

.container .from-box .title {
  color: rgb(241, 241, 241);
}
.container .from-box {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.row {
  width: 100%;
  position: relative;
  margin-top: 40px;
}
.row .movelabel {
  position: absolute;
  top: 0px;
  left: 0px;
  color: white;
  font-size: 16px;
  transition: all 1s;
}
.row .userinput {
  background: 0;
  border: 0;
  outline: none;
  border-bottom: 1px solid white;
  padding: 0px 8px 10px 10px;
  color: white;
}

.row .userinput:focus + label {
  transform: translateY(-25px);
  font-size: 13px;
}

.row .userinput:not(:focus):not(:placeholder-shown) + label {
  color: transparent;
}

.row button {
  width: 100%;
  height: 40px;
  border-radius: 5px;
  border: 0;
  background-color: white;
  cursor: pointer;
}
.move {
  top: -20px !important;
  font-size: 10px !important;
}
.register-box {
  display: none;
}
</style>
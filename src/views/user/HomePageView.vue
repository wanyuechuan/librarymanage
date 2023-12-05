<template>
  <div>id:{{ user.id }}</div>
  <div>用户名:{{ user.username }}</div>
  <div>邮箱:{{ user.email }}</div>
</template>

<script>
import request from "@/utils/request";
import Cookies from "js-cookie";

export default {
  name: "UpdatefileHomePageView",

  setup() {
    const user = Cookies.get("admin") ? JSON.parse(Cookies.get("admin")) : {};

    request
      .get("/admin/getid", {
        params: { id: user.id },
      })
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });

    return {
      user,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
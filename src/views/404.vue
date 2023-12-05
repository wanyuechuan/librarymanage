<template>
  <div class="container">
    <div class="content">
      4<svg
        t="1700288499371"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="6403"
        width="200"
        height="200"
      >
        <path
          d="M957.218 311.652v-111.304h-66.784V133.566h-66.782V66.782h-111.304V0H311.652v66.782h-111.304v66.784H133.566v66.782H66.782v111.304l-66.766 0.006v400.696h66.766v111.298h66.784V890.434h66.782V957.218h111.304V1024h400.696v-66.782h111.304V890.434h66.782V823.652h66.784v-111.298h22.274v-0.006H1024V311.652z"
          fill="#FFDE46"
          p-id="6404"
        ></path>
        <path
          d="M957.218 311.652v-111.304h-66.784V133.566h-66.782V66.782h-111.304V0H311.652v66.782h-111.304v66.784H133.566v66.782H66.782v111.304H0v66.782h133.566v-111.304h66.782v-66.782h66.782V133.566h489.74v66.782h66.782v66.782h66.782v111.304H1024v-66.782z"
          fill="#FFFFFF"
          p-id="6405"
        ></path>
        <path
          d="M200.348 66.782h111.304v66.782h-111.304zM133.566 133.566h66.782v66.782H133.566zM66.782 200.348h66.782v111.304H66.782zM66.782 712.348h66.782v111.304H66.782zM133.566 823.652h66.782v66.782H133.566zM200.348 890.434h111.304v66.782h-111.304zM311.652 0h400.696v66.782H311.652zM311.652 957.218h400.696V1024H311.652zM0 311.652h66.782v400.696H0zM712.348 66.782h111.304v66.782h-111.304zM823.652 133.566h66.782v66.782h-66.782zM890.434 200.348h66.782v111.304h-66.782zM890.434 712.348h66.782v111.304h-66.782zM823.652 823.652h66.782v66.782h-66.782zM712.348 890.434h111.304v66.782h-111.304zM957.218 311.652H1024v400.696h-66.782z"
          p-id="6406"
        ></path>
        <path
          d="M690.086 623.304h-66.782v-66.782H400.696v66.782h-66.782v200.348h66.782v66.782h222.608v-66.782h66.782z"
          fill="#FB0023"
          p-id="6407"
        ></path>
        <path
          d="M311.652 289.392h-66.782v89.042H155.826v66.784h89.044v89.042h66.782v-89.042h89.044v-66.784h-89.044zM868.174 378.434h-89.044v-89.042h-66.782v89.042h-89.044v66.784h89.044v89.042h66.782v-89.042h89.044zM333.914 623.304h66.782v200.348h-66.782zM623.304 623.304h66.782v200.348h-66.782zM400.696 823.652h222.608v66.782H400.696z"
          p-id="6408"
        ></path>
        <path
          d="M400.696 556.522h222.608v66.782H400.696z"
          p-id="6409"
        ></path></svg
      >4
    </div>
    <div class="tips">SORRY! 页面走失了！</div>
    <div class="tips">NOT FOUND！ 错误代码:404</div>
    <button @click="returnHome">返回首页</button>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  name: "Updatefile404",
  setup(){
    const router = useRouter();

    function returnHome(){
        router.push("/")
    }
    return{
        returnHome
    }
  }
};
</script>

<style lang="css" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ee5760;
}
.container .content {
  color: #fff;
  font-size: 16rem;
}
.container .tips {
  color: #fff;
  line-height: 80px;
  font-size: 2rem;
}
.container .content svg {
  margin: 0 40px;
}
.container button {
  font-size: 18px;
  padding: 1rem 1.5rem;
  cursor: pointer;
  border: 0;
  background: 0;
  color: #fff;
  box-shadow: #366f9b 2px 2px 0px 3px;
  background: #527590;
  border-radius: 30px;
}
</style>
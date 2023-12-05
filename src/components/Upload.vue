<template>
  <el-upload class="upload-demo" drag action="http://localhost:8888/upload" multiple @on-progress="submitResult" name="photo">
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">拖到此处上传或 <em>点击上传</em></div>
    <template #tip>
      <div class="el-upload__tip">上传图片不能超过10MB</div>
    </template>
  </el-upload>
</template>

<script>
import { UploadFilled } from "@element-plus/icons-vue";
export default {
  name: "UpdatefileUpload",

  setup() {
    function submitResult(){
      console.log(112312);
    }
    return {
      UploadFilled,
      submitResult
    };
  },
};
</script>

<style lang="css" scoped>
</style>
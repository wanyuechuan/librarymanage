<template>
  <div class="contaienr">
    <div class="search-box">
      <el-input
        autocomplete="false"
        class="inputs"
        placeholder="请输入姓名"
        v-model="params.username"
      />
      <el-input
        autocomplete="false"
        class="inputs"
        placeholder="请输入邮箱"
        v-model="params.email"
      />
      <div class="search-button">
        <el-button type="primary" @click="into" :icon="Search">搜索</el-button>
        <el-button type="warning" @click="remove" :icon="Refresh"
          >重置</el-button
        >
      </div>
    </div>

    <el-table
      :data="tableData"
      height="80%"
      style="width: 100%"
      :key="tablekey"
      stripe
      class="data-table"
    >
      <el-table-column prop="id" sortable label="序号" width="90">
        <template v-slot="space">
          {{ space.row.id }}
        </template>
      </el-table-column>
      <el-table-column prop="username" sortable label="用户名" width="180" />
      <el-table-column prop="college" sortable label="所属学院" />
      <el-table-column prop="email" sortable label="邮箱" />
      <el-table-column prop="password" sortable label="密码" />
      <el-table-column prop="createtime" sortable label="创建时间" />
      <el-table-column prop="updatetime" sortable label="最后一次更新时间" />
      <el-table-column prop="control" label="操作">
        <template #default="space">
          <el-button
            type="primary"
            @click="
              handleEdit(
                space.row.id,
                space.row.username,
                space.row.college,
                space.row.email,
                space.row.password,
                space.row.createtime,
                space.row.updatetime
              )
            "
            >编辑</el-button
          >

          <el-popconfirm
            title="确认删除该条数据吗?"
            @confirm="deleteData(space.row.id)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template> 
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出框 -->

    <el-dialog v-model="dialogFormVisible" @close="dialogClose">
      <template #header> <div class="diglogTitle">编辑信息</div> </template>
      <el-form :model="form" :rules="rules" ref="ruleFormRef">
        <el-form-item
          label="用户名"
          :label-width="formLabelWidth"
          prop="username"
        >
          <el-input v-model="form.username" autocomplete="off" />
        </el-form-item>

        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="form.email" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="密码"
          :label-width="formLabelWidth"
          prop="password"
        >
          <el-input v-model="form.password" autocomplete="off" />
        </el-form-item>

        <el-form-item label="所属学院" :label-width="formLabelWidth">
          <el-select v-model="form.college" placeholder="请选择">
            <el-option label="信息工程学院" value="信息工程学院" />
            <el-option label="机械工程学院" value="机械工程学院" />
            <el-option label="电气工程学院" value="电气工程学院" />
            <el-option label="船舶工程学院" value="船舶工程学院" />
            <el-option label="汽车工程学院" value="汽车工程学院" />
            <el-option label="建筑工程学院" value="建筑工程学院" />
            <el-option label="经济管理学院" value="经济管理学院" />
            <el-option label="财会金融学院" value="财会金融学院" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="changeInfo">修改</el-button>
        </span>
      </template>
    </el-dialog>


    <!--  分页 -->
    <div class="demo-pagination-block">
      <el-pagination
        v-model:current-page="params.pageNum"
        v-model:page-size="params.pageSize"
        :page-sizes="[20, 30, 40, 50]"
        :small="false"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pages.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { ElMessage } from "element-plus";
import { Search, Refresh, Message} from "@element-plus/icons-vue";
import { reactive, ref, watch, onMounted } from "vue";
import request from "@/utils/request";
export default {
  name: "UpdatefileUser",

  setup() {
    let tableData = reactive([]);
    let tablekey = ref(false);
    let pages = reactive({
      total: 0,
    });

    const ruleFormRef = ref(null);

    let params = reactive({
      pageNum: 1,
      pageSize: 20,
      username: "",
      email: "",
    });

    const form = reactive({
      id: 0,
      username: "",
      collage: "",
      email: "",
      password: "",
      createtime: "",
      updatetime: "",
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
    });

    // 弹出框
    let dialogFormVisible = ref(false);
    const formLabelWidth = "140px";

    // 表格初始化
    function into() {
      request
        .get("/api/data", {
          params: params,
        })
        .then((res) => {
          tableData.splice(0, tableData.length, ...res.data.list);
          pages.total = res.data.total;
          tablekey.value = !tablekey.value;
        })
        .catch((err) => {
          console.error(err);
        });
    }

    function handleEdit(
      id,
      username,
      college,
      email,
      password,
      createtime,
      updatetime
    ) {
      form.id = id;
      form.username = username;
      form.college = college;
      form.email = email;
      form.password = password;
      form.createtime = createtime;
      form.updatetime = updatetime;
      dialogFormVisible.value = true;
    }

    function deleteData(index) {
      request
        .delete("/api/deleteData", {
          params: {
            id: index,
          },
        })
        .then((res) => {
          if (res.code == "200") {
            ElMessage.success(res.data);
            into();
          } else {
            ElMessage.warning(res.data);
          }
        });
    }
    function cancel() {
      dialogFormVisible.value = false;
     
    }
    function changeInfo() {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
          request
            .post("/api/changeData", form)
            .then((res) => {
              if (res.code === "200") {
                ElMessage.success(res.data);
                into();
                ruleFormRef.value.resetFields();
              } else {
                ElMessage.warning(res.data);
              }
            })
            .catch((err) => {
              console.log(err);
            });
          dialogFormVisible.value = false;
        } else {
          ElMessage.warning("内容有误，修改失败");
        }
      });
    }

    function handleSizeChange(pageSize) {
      params.pageSize = pageSize;

      into();
    }
    function handleCurrentChange(pageNum) {
      params.pageNum = pageNum;

      into();
    }

    function remove() {
      params.pageNum = 1;
      params.pageSize = 20;
      params.username = "";
      params.email = "";
      into();
    }

    function dialogClose() {
       ruleFormRef.value.resetFields();
    }

    onMounted(() => {
      into();
    });

    // watch(
    //   tableData,
    //   (newValue, oldValue) => {
    //     console.log("tableData变化了", newValue, oldValue);
    //   },
    //   { immediate: true, deep: true }
    // );

    return {
      
      form,
      dialogFormVisible,
      formLabelWidth,
      tableData,
      tablekey,
      handleEdit,
      cancel,
      ruleFormRef,
      changeInfo,
      deleteData,
      params,
      pages,
      handleSizeChange,
      handleCurrentChange,
      remove,
      into,
      Search,
      Refresh,
      rules,
      checkEmail,
      dialogClose,
    };
  },
};
</script>

<style lang="css" scoped>
.el-pagination {
  justify-content: center;
}
.search-box {
  padding: 10px;
}
.search-box .search-button {
  display: inline-block;
  min-width: 200px;
}

.inputs {
  width: 200px;
  margin: 5px;
}
.data-table {
  min-width: calc(1500px - 300px);
}
.diglogTitle{
  font-size: 20px;
}
</style>
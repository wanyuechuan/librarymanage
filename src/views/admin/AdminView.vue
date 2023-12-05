<template>
  <div class="contaienr">
    <div class="search-box">
      <el-input
        autocomplete="false"
        class="inputs"
        placeholder="请输入用户名"
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
        <el-button type="primary" @click="handleAdd" :icon="Plus"
          >添加管理员</el-button
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
      <el-table-column prop="email" sortable label="邮箱" />
      <el-table-column prop="createtime" sortable label="创建时间" />
      <el-table-column prop="updatetime" sortable label="最后一次更新时间" />
      <el-table-column prop="status" label="状态">
        <template v-slot="space">
          <el-switch
            v-model="space.row.status"
            @change="changeStatus(space.row)"
            class="ml-2"
            style="
              --el-switch-on-color: #13ce66;
              --el-switch-off-color: #ff4949;
            "
          />
        </template>
      </el-table-column>
      <el-table-column prop="control" label="操作" width="300">
        <template #default="space">
          <el-button type="primary" @click="handleEdit(space)">编辑</el-button>

          <el-popconfirm
            title="确认删除该条数据吗?"
            @confirm="deleteData(space.row.id)"
          >
            <template #reference>
              <el-button type="danger">删除</el-button>
            </template>
          </el-popconfirm>
          <el-button type="warning" @click="UpdatePass(space.row)"
            >修改密码</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出框 -->

    <el-dialog v-model="dialogFormVisible" @close="dialogClose">
      <template #header>
        <div class="diglogTitle">{{ diglogTitle }}</div>
      </template>
      <el-form :model="form" :rules="rules" ref="ruleRef">
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
          v-if="diglogFlag"
        >
          <el-input v-model="form.password" autocomplete="off" show-password/>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="addAdmin" v-if="diglogFlag"
            >添加</el-button
          >
          <el-button type="primary" @click="updateData" v-if="!diglogFlag"
            >修改</el-button
          >
        </span>
      </template>
    </el-dialog>

    <el-dialog v-model="updateDialogVisible" @close="dialogClose">
      <template #header>
        <div class="diglogTitle">修改密码</div>
      </template>
      <el-form :model="passFrom" :rules="rules" ref="ruleRef">
        <el-form-item
          label="新密码"
          :label-width="formLabelWidth"
          prop="newPass"
        >
          <el-input
            v-model="passFrom.newPass"
            autocomplete="off"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="ChangePasswordRequest"
            >修改</el-button
          >
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
import { Search, Refresh, Message, Plus } from "@element-plus/icons-vue";
import { reactive, ref, watch, onMounted } from "vue";
import request from "@/utils/request";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
export default {
  name: "UpdatefileUser",

  setup() {
    // 弹窗
    let diglogTitle = ref("");
    let diglogFlag = ref(false);
    let updateDialogVisible = ref(false);
    // 表格
    let tableData = reactive([]);
    let tablekey = ref(false);
    let pages = reactive({
      total: 0,
    });


    const router = useRouter();

    const ruleRef = ref(null);

    // 用户
    const admin = Cookies.get("admin") ? JSON.parse(Cookies.get("admin")) : {};

    let params = reactive({
      pageNum: 1,
      pageSize: 20,
      username: "",
      email: "",
    });

    let form = reactive({});
    const addform = reactive({
      username: "",
      email: "",
      password: "",
    });
    let passFrom = reactive({
      newPass: "",
    });

    let passForm2 = {};

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
      newPass: [
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

    //添加管理
    function addAdmin() {
      ruleRef.value.validate((valid) => {
        if (valid) {
          addform.username = form.username;
          addform.email = form.email;
          addform.password = form.password;
          request
            .post("/admin/add", addform)
            .then((res) => {
              if (res.code == "200") {
                ElMessage.success(res.msg);
                into();
                dialogFormVisible.value = false;
                ruleRef.value.resetFields();
              } else {
                ElMessage.warning(res.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          ElMessage.error("添加失败!");
        }
      });
    }
    function updateData() {
      ruleRef.value.validate((valid) => {
        if (valid) {
          request
            .put("/admin/changeData", form)
            .then((res) => {
              console.log(res);
              if (res.code == "200") {
                ElMessage.success(res.msg);
                into();
                dialogFormVisible.value = false;
                ruleRef.value.resetFields();
              } else {
                ElMessage.warning(res.msg);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      });
    }

    // 表格初始化
    function into() {
      request
        .get("/admin/data", {
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

    function cancel() {
      dialogFormVisible.value = false;
    }

    function handleSizeChange(pageSize) {
      params.pageSize = pageSize;

      into();
    }
    function handleCurrentChange(pageNum) {
      params.pageNum = pageNum;

      into();
    }
    // 弹窗
    function handleAdd() {
      form.id = null;
      form.username = null;
      form.email = null;
      diglogTitle.value = "添加管理员";
      dialogFormVisible.value = true;
      diglogFlag.value = true;
    }
    function handleEdit(space) {
      form.id = space.row.id;
      form.username = space.row.username;
      form.email = space.row.email;

      diglogTitle.value = "编辑信息";
      dialogFormVisible.value = true;
      diglogFlag.value = false;
    }

    function UpdatePass(row) {
      passForm2 = JSON.parse(JSON.stringify(row));
      console.log(passForm2);
      updateDialogVisible.value = true;
    }

    function ChangePasswordRequest() {
      ruleRef.value.validate((vaild) => {
        if (vaild) {
          passForm2.newPass = passFrom.newPass;

          request
            .put("/admin/password", passForm2)
            .then((res) => {
              if (res.code == "200") {
                ElMessage.success("修改成功");
                if (passFrom.username == admin.username) {
                  Cookies.remove("admin");
                  router.push("/login");
                } else {
                  into();
                  updateDialogVisible.value = false;
                }
              } else {
                ElMessage.error("修改失败");
              }
            })
            .catch((err) => {
              ElMessage.error("系统错误");
            });
        } else {
          ElMessage.warning("请输入新密码");
        }
      });
    }

    function changeStatus(row) {
      console.log(row);
      if (admin.id===row.id && !row.status) {
        row.status = true;
        ElMessage.error("非法操作");
        return;
      }
      request
        .put("/admin/changeData", row)
        .then((res) => {
          if (res.code === "200") {
            ElMessage.success(res.msg);
          }else{
            ElMessage.error(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    function deleteData(id) {
      request
        .delete("/admin/deleteData", {
          params: {
            id,
          },
        })
        .then((res) => {
          if (res.code == "200") {
            ElMessage.success(res.msg);
            into();
          } else {
            ElMessage.err(res.msg);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // 分页
    function remove() {
      params.pageNum = 1;
      params.pageSize = 20;
      params.username = "";
      params.email = "";
      into();
    }

    function clear() {
      form.email = "";
      form.username = "";
      form.password = "";
      form.id = "";
    }

    function dialogClose() {
      ruleRef.value.resetFields();
    }

    onMounted(() => {
      into();
    });

    return {
      //表格
      form,
      formLabelWidth,
      tableData,
      tablekey,
      cancel,
      ruleRef,
      params,
      pages,
      handleSizeChange,
      handleCurrentChange,
      remove,
      into,
      Search,
      Plus,
      Refresh,
      rules,
      checkEmail,
      dialogClose,
      addAdmin,
      passFrom,
      changeStatus,

      // diglog属性
      dialogFormVisible,
      updateDialogVisible,
      diglogTitle,
      handleAdd,
      handleEdit,
      updateData,
      UpdatePass,
      deleteData,
      diglogFlag,
      ChangePasswordRequest,
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
.diglogTitle {
  font-size: 20px;
}
</style>
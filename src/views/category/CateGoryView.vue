<template>
  <div class="contaienr">
    <div class="search-box">
      <el-input
        autocomplete="false"
        class="inputs"
        placeholder="请输入分类名"
        v-model="params.name"
      />
      <div class="search-button">
        <el-button type="primary" @click="into" :icon="Search">搜索</el-button>
        <el-button type="warning" @click="remove" :icon="Refresh"
          >重置</el-button
        >
        <el-button type="primary" @click="handleAdd" :icon="Plus"
          >添加分类</el-button
        >
      </div>
    </div>

    <el-table
      :data="tableData"
      height="80%"
      style="width: 100%"
      :key="tablekey"
      row-key="id"
      default-expand-all
      stripe
      class="data-table"
    >
      <el-table-column prop="id" sortable label="序号" width="90">
        <template v-slot="space">
          {{ space.row.id }}
        </template>
      </el-table-column>
      <el-table-column prop="name" sortable label="分类名" width="180" />
      <el-table-column prop="remark" sortable label="备注" />
      <el-table-column prop="createtime" sortable label="创建时间" />
      <el-table-column prop="updatetime" sortable label="最后一次更新时间" />
      <el-table-column prop="control" label="操作" width="300">
        <template #default="space">
          <el-button
            type="primary"
            v-if="!space.row.pid"
            @click="addSecondary(space.row)"
            >添加二级分类</el-button
          >

          <el-button type="primary" @click="handleEdit(space)">编辑</el-button>

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

    <el-dialog v-model="dialogFormVisible" @close="dialogClose" width="40%">
      <template #header>
        <div class="diglogTitle">{{ diglogTitle }}</div>
      </template>
      <el-form :model="form" :rules="rules" ref="ruleRef">
        <el-form-item label="分类名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="form.remark" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="addCategory" v-if="diglogFlag"
            >添加</el-button
          >
          <el-button type="primary" @click="updateData" v-if="!diglogFlag"
            >修改</el-button
          >
        </span>
      </template>
    </el-dialog>

    <!-- 添加二级分类 -->
    <el-dialog
      v-model="sencondaryDiglogVisible"
      @close="dialogClose"
      width="30%"
    >
      <template #header>
        <div class="diglogTitle">添加二级分类</div>
      </template>
      <el-form :model="secondForm" :rules="rules" ref="ruleRef">
        <el-form-item
          label="二级分类名"
          :label-width="formLabelWidth"
          prop="name"
        >
          <el-input v-model="secondForm.name" autocomplete="off" />
        </el-form-item>

        <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
          <el-input v-model="secondForm.remark" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="sencondaryDiglogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveSecondary">添加</el-button>
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
import { reactive, ref, watch, onMounted, toRefs } from "vue";
import request from "@/utils/request";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
export default {
  name: "Category",

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
      name: "",
    });

    let form = reactive({
    });

    // 校验规则
    const rules = reactive({
      name: [
        {
          required: true,
          message: "请输入分类名",
          trigger: "blur",
        },
      ],
    });

    // 弹出框
    let dialogFormVisible = ref(false);
    const formLabelWidth = "140px";

    // 二级分类
    let secondForm = reactive({});
    let sencondaryDiglogVisible = ref(false);

    //添加一级分类
    function addCategory() {
      ruleRef.value.validate((valid) => {
        if (valid) {
          request
            .post("/category/add", form)
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
            .put("/category/changeData", form)
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
        .get("/category/data", {
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
      diglogTitle.value = "添加分类";
      dialogFormVisible.value = true;
      diglogFlag.value = true;
    }
    function handleEdit(space) {
      form.id = space.row.id;
      form.name = space.row.name;
      form.remark = space.row.remark;

      diglogTitle.value = "编辑信息";
      dialogFormVisible.value = true;
      diglogFlag.value = false;
    }

    function deleteData(id) {
      request
        .delete("/category/deleteData", {
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

    // 添加二级分类
    function addSecondary(row) {
      secondForm.pid = row.id;
      console.log(secondForm);
      sencondaryDiglogVisible.value = true;
    }
    function saveSecondary() {
      ruleRef.value.validate((vaild) => {
        if (vaild) {
          request
            .post("/category/add", secondForm)
            .then((res) => {
              if(res.code === "200"){
                ElMessage.success(res.msg);
                sencondaryDiglogVisible.value = false;
                into();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }else{
          ElMessage.warning("请先输入二级分类");
        }
      });
    }

    // 分页
    function remove() {
      params.pageNum = 1;
      params.pageSize = 20;
      params.name = "";
      into();
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
      dialogClose,
      addCategory,

      // diglog属性
      dialogFormVisible,
      updateDialogVisible,
      diglogTitle,
      handleAdd,
      handleEdit,
      updateData,
      deleteData,
      diglogFlag,

      // 二级分类
      secondForm,
      addSecondary,
      sencondaryDiglogVisible,
      saveSecondary,
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
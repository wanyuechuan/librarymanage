<template>
  <div class="contaienr">
    <div class="search-box">
      <el-input
        autocomplete="false"
        class="inputs"
        placeholder="请输入图书名"
        v-model="params.name"
      />
      <el-input
        autocomplete="false"
        class="inputs"
        placeholder="请输入图书标准码"
        v-model="params.booNo"
      />
      <div class="search-button">
        <el-button type="primary" @click="into" :icon="Search">搜索</el-button>
        <el-button type="warning" @click="remove" :icon="Refresh"
          >重置</el-button
        >
        <el-button type="primary" @click="handleAdd" :icon="Plus"
          >添加图书</el-button
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
      <el-table-column prop="id" sortable label="编号" width="90">
        <template v-slot="space">
          {{ space.row.id }}
        </template>
      </el-table-column>
      <el-table-column prop="name" sortable label="图书名" width="180" />
      <el-table-column prop="description" sortable label="描述"  width="250"/>
      <el-table-column prop="publishDate" sortable label="出版日期" />
      <el-table-column prop="author" sortable label="作者" />
      <el-table-column prop="publisher" sortable label="出版社" />
      <el-table-column prop="category" sortable label="分类" />
      <el-table-column prop="bookNo" sortable label="图书标准码" />
      <el-table-column prop="cover" sortable label="封面">
        <template v-slot="space">
          <el-image
            :src="space.row.cover"
            :preview-src-list="[space.row.cover]"
            :preview-teleported="true"
          ></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="createtime" sortable label="创建时间" />
      <el-table-column prop="updatetime" sortable label="最后一次更新时间" />
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
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出框 -->

    <el-dialog v-model="dialogFormVisible" @close="dialogClose" width="40%">
      <template #header>
        <div class="diglogTitle">{{ diglogTitle }}</div>
      </template>
      <el-form :model="form" :rules="rules" ref="ruleRef">
        <el-form-item label="图书名" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="描述"
          :label-width="formLabelWidth"
          prop="description"
        >
          <el-input
            type="textarea"
            v-model="form.description"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="出版日期"
          :label-width="formLabelWidth"
          prop="publishDate"
        >
          <el-date-picker
            v-model="form.publishDate"
            type="date"
            value-format="YYYY-MM-DD"
            placeholder="请选择出版日期"
          />
        </el-form-item>
        <el-form-item label="作者" :label-width="formLabelWidth" prop="author">
          <el-input v-model="form.author" autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="出版社"
          :label-width="formLabelWidth"
          prop="publisher"
        >
          <el-input v-model="form.publisher" autocomplete="off" />
        </el-form-item>

        <el-form-item
          label="分类"
          :label-width="formLabelWidth"
          prop="category"
        >
          <el-cascader
            :props="{ value: 'name', label: 'name' }"
            v-model="form.categories"
            :options="categories"
          />
        </el-form-item>

        <el-form-item
          label="图书标准码"
          :label-width="formLabelWidth"
          prop="bookNo"
        >
          <el-input v-model="form.bookNo" autocomplete="off" />
        </el-form-item>

        <el-form-item label="封面" :label-width="formLabelWidth" prop="cover">
          <el-input v-model="form.cover" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="addBook" v-if="diglogFlag"
            >添加</el-button
          >
          <el-button type="primary" @click="updateData" v-if="!diglogFlag"
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
import { Search, Refresh, Plus } from "@element-plus/icons-vue";
import { reactive, ref, onMounted} from "vue";
import request from "@/utils/request";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
export default {
  name: "Book",

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

    let categories = reactive([]);

    const router = useRouter();

    const ruleRef = ref(null);

    // 用户
    const admin = Cookies.get("admin") ? JSON.parse(Cookies.get("admin")) : {};

    let params = reactive({ 
      pageNum: 1,
      pageSize: 20,
      name: "",
    });

    let form = reactive({});

    // 校验规则 @
    const rules = reactive({
      name: [
        {
          required: true,
          message: "请输入图书名",
          trigger: "blur",
        },
      ],
    });

    // 弹出框
    let dialogFormVisible = ref(false);
    const formLabelWidth = "140px";

    // 请求分类列表
    onMounted(() => {
      request
        .get("/category/tree")
        .then((res) => {
          categories.splice(0, categories.length, ...res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    });

    function addBook() {
      ruleRef.value.validate((valid) => {
        if (valid) {
          request
            .post("/book/add", form)
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
            .put("/book/changeData", form)
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
        .get("/book/data", {
          params: params,
        })
        .then((res) => {
          tableData.splice(0, tableData.length, ...res.data.list);

          console.log("into", tableData);
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
      diglogTitle.value = "添加图书";
      dialogFormVisible.value = true;
      diglogFlag.value = true;
    }
    function handleEdit(space) {
      console.log("row", space.row);
      form.id = space.row.id;
      form.name = space.row.name;
      form.description = space.row.description;
      form.publishDate = space.row.publishDate;
      form.author = space.row.author;
      form.publisher = space.row.publisher;
      form.category = space.row.category;
      form.bookNo = space.row.bookNo;
      form.cover = space.row.cover;
      if (space.row.category != null) {
        form.categories = space.row.category.split(" > ");
      }

      diglogTitle.value = "编辑信息";
      dialogFormVisible.value = true;
      diglogFlag.value = false;
    }

    function deleteData(id) {
      request
        .delete("/book/deleteData", {
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
      params.name = "";
      params.bookNo = "";
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
      addBook,

      // diglog属性
      dialogFormVisible,
      updateDialogVisible,
      diglogTitle,
      handleAdd,
      handleEdit,
      updateData,
      deleteData,
      diglogFlag,
      // 分类
      categories,
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
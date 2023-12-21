<template>
  <div class="app-container">
    <div style="box-sizing: border-box;">
      <el-form :inline="true" size="small">
        <el-form-item label="类别">
          <el-select v-model="form.isTeacher" @change="search" placeholder="" style="width: 100px">
            <el-option label="学生" value="0"></el-option>
            <el-option label="教师" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="form.realName" @change="search" clearable placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="学号/工号">
          <el-input v-model="form.username" @change="search" clearable placeholder="请输入学号/工号"></el-input>
        </el-form-item>
        <el-form-item label="班级号">
          <el-input v-model="form.classNo" @change="search" clearable placeholder="请输入班级号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div style="width: 1031px">
      <el-table
        :data="tableData"
        v-loading="isLoading"
        v-if="this.form.isTeacher === '0'"
        stripe
        border
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 911px">
        <el-table-column
          fixed
          prop="unitName"
          label="二级学院"
          width="120">
        </el-table-column>
        <el-table-column
          fixed
          prop="major"
          label="专业"
          width="260">
        </el-table-column>
        <el-table-column
          fixed
          prop="classNo"
          label="班级"
          width="100">
        </el-table-column>
        <el-table-column
          prop="username"
          label="学号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          label="角色"
          width="100">
        <template slot-scope="scope">
          <el-tag> {{form.isTeacher === '0' ? '学生' : '教师'}}</el-tag>
        </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="130">
          <template slot-scope="scope" v-if="form.isTeacher === '0'">
            <el-button
              @click.native.prevent="resetPwd(scope.row.id)"
              type="danger"
              size="mini"
              style="margin-left: 15px">
              重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="tableData"
        v-loading="isLoading"
        v-if="this.form.isTeacher === '1'"
        stripe
        border
        :header-cell-style="{'text-align':'center'}"
        :cell-style="{'text-align':'center'}"
        style="width: 551px">
        <el-table-column
          fixed
          prop="unitName"
          label="二级学院"
          width="120">
        </el-table-column>
        <el-table-column
          prop="username"
          label="学号/工号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="realName"
          label="姓名"
          width="100">
        </el-table-column>
        <el-table-column
          label="角色"
          width="100">
          <template slot-scope="scope">
            <el-tag> {{form.isTeacher === '0' ? '学生' : '教师'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          v-if="this.form.isTeacher === '1'"
          width="130">
          <template slot-scope="scope" v-if="form.isTeacher === '1'">
            <el-button
              @click.native.prevent="resetPwd(scope.row.id)"
              type="danger"
              size="mini"
              style="margin-left: 15px">
              重置密码
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" style="margin-top: 15px;float: left;margin-bottom: 20px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-sizes="[20, 50, 100, 200]"
        :page-size="20"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

import {mapGetters} from "vuex";
import {getAllUser, resetPwd} from "@/api/userMana";

export default {
  name: "UserMana",
  data() {
    return {
      isLoading: false,
      currentPage: 1,
      total: 0,
      form: {
        page: 1,
        pageSize: 20,
        realName: '',
        stuNo: '',
        className: '',
        classNo: '',
        isTeacher: '0',
      },
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'role'
    ])
  },
  created() {
    this.isLoading = true
    this.initData(this.form)
    this.isLoading = false
  },
  methods: {
    search() {
      this.form.page = 1
      this.currentPage = 1
      this.initData(this.form)
    },
    initData(data) {
      this.tableData = []
      getAllUser(data).then(response => {
        this.total = response.data.total
        this.tableData = response.data.records
      })
    },
    handleSizeChange(newSize) {
      this.form.pageSize = newSize;
      this.initData(this.form)
    },
    handleCurrentChange(newPage) {
      this.form.page = newPage;
      this.initData(this.form)
    },
    resetPwd(id) {
      this.$confirm('是否确认重置密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetPwd(id).then(response => {
          if (response.code === 200) {
            this.$message({
              message: response.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: response.msg,
              type: 'error'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
  }
}
</script>

<style scoped>

</style>
